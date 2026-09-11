/**
 * Feature-tree regeneration engine (runs INSIDE the worker).
 *
 * This is the architectural spine of the app. Given a full feature tree, it:
 *   1. Walks features in tree order (order = evaluation order).
 *   2. Builds each feature's primitive solid, offsets it by its position.
 *   3. Combines it with the accumulated body via boolean op (new/add/remove).
 *   4. Releases intermediate handles so the arena doesn't grow unbounded.
 *   5. Records a per-feature status (ok / suppressed / error).
 *
 * Editing any feature and re-running this from scratch is how downstream
 * features "regenerate" — there is no incremental caching yet (a deliberate
 * Phase 2 simplification; see limitations). For a handful of primitive
 * features a full rebuild is instant, and it keeps the engine trivially
 * correct: the output is a pure function of the tree.
 *
 * Error handling: a feature that throws (invalid params, failed boolean) is
 * marked "error" and SKIPPED — regeneration continues with the accumulated
 * body so one bad feature doesn't blank the whole model. If the very first
 * contributing feature fails, the result simply has no geometry.
 */
import type { OcctKernel } from "occt-wasm";
import type {
  ExtrudeFeature,
  FeatureTree,
  ModifierFeature,
  RevolveFeature,
  SketchFeature,
  SolidFeature,
} from "../model/featureTree";
import { isModifierFeature, isTransformFeature } from "../model/featureTree";
import type { TransformFeature } from "../model/featureTree";
import { edgeRefFromCenter } from "../model/edgeRef";
import { BASE_PLANES, sketchToWorld, type SketchPlane } from "../model/sketch";
import { extractProfile, type Profile } from "../sketch/profile";
import type {
  EdgePayload,
  FeatureStatus,
  MeshPayload,
  RegenResult,
  TessellationQuality,
} from "./protocol";

/** occt-wasm ShapeHandle is a branded number; we treat it opaquely here. */
type Handle = number;

const DEFAULT_QUALITY: Required<TessellationQuality> = {
  linearDeflection: 0.1,
  angularDeflection: 0.5,
};

/**
 * Build the placed solid for a solid-producing feature. Returns a single live
 * handle representing this feature's positioned solid. Throws on invalid
 * parameters / profiles so the caller can mark the feature errored.
 *
 * `sketches` maps sketch-feature id -> SketchFeature so extrude can resolve its
 * referenced profile.
 */
function buildSolid(
  k: OcctKernel,
  feature: SolidFeature,
  sketches: Map<string, SketchFeature>,
): Handle {
  switch (feature.type) {
    case "box": {
      const { dx, dy, dz } = feature.params;
      if (dx <= 0 || dy <= 0 || dz <= 0) {
        throw new Error("Box dimensions must be positive");
      }
      return placeSolid(k, k.makeBox(dx, dy, dz) as unknown as Handle, feature.position);
    }
    case "cylinder": {
      const { radius, height } = feature.params;
      if (radius <= 0 || height <= 0) {
        throw new Error("Cylinder radius and height must be positive");
      }
      return placeSolid(
        k,
        k.makeCylinder(radius, height) as unknown as Handle,
        feature.position,
      );
    }
    case "extrude":
      return buildExtrude(k, feature, sketches);
    case "revolve":
      return buildRevolve(k, feature, sketches);
    case "linked": {
      // Evaluate the cached snapshot of the source Part Studio's tree into a
      // single solid, then insert it. The linked tree is self-contained (it
      // carries its own sketches), so we evaluate it in isolation.
      const { result } = evaluateTree(k, feature.cachedTree);
      if (result === null) {
        throw new Error("Linked reference produced no geometry");
      }
      return result;
    }
    default: {
      const _never: never = feature;
      throw new Error(`Unknown feature type: ${JSON.stringify(_never)}`);
    }
  }
}

/**
 * OCCT boolean ops (fuse/cut/common) return a COMPOUND wrapping the result,
 * even when it contains a single solid. Downstream ops that require a
 * TopoDS_Solid — notably fillet/chamfer — reject a compound ("fillet:
 * TopoDS::Solid"). So after every boolean we unwrap a single-solid compound
 * back to that solid. Compounds with 0 or >1 solids are left as-is (nothing
 * sensible to unwrap to; a later modifier will surface the error).
 */
function normalizeSolid(k: OcctKernel, shape: Handle): Handle {
  if (k.getShapeType(shape as never) !== "compound") return shape;
  const solids = k.getSubShapes(shape as never, "solid") as unknown as Handle[];
  if (solids.length === 1) {
    // Adopt the inner solid; release the compound wrapper and it stays valid
    // because getSubShapes returns independent handles.
    const solid = solids[0];
    k.release(shape as never);
    return solid;
  }
  // Not a clean single solid — release the extra handles, keep the compound.
  for (const s of solids) k.release(s as never);
  return shape;
}

/** Translate a solid to its placement, freeing the untranslated handle. */
function placeSolid(
  k: OcctKernel,
  raw: Handle,
  position: { x: number; y: number; z: number },
): Handle {
  const { x, y, z } = position;
  if (x === 0 && y === 0 && z === 0) return raw;
  const placed = k.translate(raw as never, x, y, z) as unknown as Handle;
  k.release(raw as never);
  return placed;
}

/**
 * Build a solid by extruding a sketch's closed profile along the sketch-plane
 * normal. All intermediate handles (edges, wire, face) are released; only the
 * final prism handle is returned.
 */
function buildExtrude(
  k: OcctKernel,
  feature: ExtrudeFeature,
  sketches: Map<string, SketchFeature>,
): Handle {
  const sketchFeature = sketches.get(feature.sketchId);
  if (!sketchFeature) {
    throw new Error("Extrude references a missing sketch");
  }
  const { distance, flip } = feature.params;
  if (!(distance > 0)) throw new Error("Extrude distance must be positive");

  const result = extractProfile(sketchFeature.sketch);
  if (!result.ok) throw new Error(result.error);

  const plane = BASE_PLANES[sketchFeature.planeId];
  const face = buildFace(k, result.profile, plane);

  // Extrude along the plane normal (flip reverses direction).
  const sign = flip ? -1 : 1;
  const dir = plane.normal;
  const vx = dir.x * distance * sign;
  const vy = dir.y * distance * sign;
  const vz = dir.z * distance * sign;
  const solid = k.extrude(face as never, vx, vy, vz) as unknown as Handle;
  k.release(face as never);
  return solid;
}

/**
 * Build a solid of revolution by revolving a sketch's closed profile around one
 * of its plane's in-plane axes (u or v), through the plane origin.
 */
function buildRevolve(
  k: OcctKernel,
  feature: RevolveFeature,
  sketches: Map<string, SketchFeature>,
): Handle {
  const sketchFeature = sketches.get(feature.sketchId);
  if (!sketchFeature) throw new Error("Revolve references a missing sketch");
  const { axis, angle } = feature.params;
  if (!(angle > 0)) throw new Error("Revolve angle must be positive");

  const result = extractProfile(sketchFeature.sketch);
  if (!result.ok) throw new Error(result.error);

  const plane = BASE_PLANES[sketchFeature.planeId];
  const face = buildFace(k, result.profile, plane);

  // The revolution axis is the plane's u or v direction through its origin.
  const dir = axis === "u" ? plane.uAxis : plane.vAxis;
  try {
    return k.revolve(
      face as never,
      { point: plane.origin, direction: dir },
      (angle * Math.PI) / 180,
    ) as unknown as Handle;
  } finally {
    k.release(face as never);
  }
}

/**
 * Apply a fillet/chamfer to the accumulated body, resolving stored geometric
 * edge references to live edge handles. Returns the new body handle (the old
 * one is released) plus a human-readable message about how many edges resolved.
 *
 * Stable-ID scheme (architecture req #3): a picked edge is stored by a
 * geometric signature (rounded bbox center — see edgeRef.ts), NOT by OCCT hash,
 * because hashes change on every rebuild. Here we compute each current edge's
 * bbox-center ref and match. Unresolved refs are skipped. If NONE resolve we
 * throw so the feature is flagged errored and the prior body is preserved.
 */
function applyModifier(
  k: OcctKernel,
  body: Handle,
  feature: ModifierFeature,
): { next: Handle; message: string } {
  const wanted = new Set(feature.edgeRefs);
  if (wanted.size === 0) throw new Error("No edges selected");

  const edges = k.getSubShapes(body as never, "edge") as unknown as Handle[];
  const matched: Handle[] = [];
  const unmatched: Handle[] = [];
  for (const e of edges) {
    const bb = k.getBoundingBox(e as never, false);
    const ref = edgeRefFromCenter(
      (bb.xmin + bb.xmax) / 2,
      (bb.ymin + bb.ymax) / 2,
      (bb.zmin + bb.zmax) / 2,
    );
    if (wanted.has(ref)) matched.push(e);
    else unmatched.push(e);
  }

  if (matched.length === 0) {
    // Release the sub-shape handles we won't use.
    for (const e of edges) k.release(e as never);
    throw new Error(
      `None of ${wanted.size} referenced edge(s) found on the current body`,
    );
  }

  let next: Handle;
  try {
    if (feature.type === "fillet") {
      const r = feature.params.radius;
      if (!(r > 0)) throw new Error("Fillet radius must be positive");
      next = k.fillet(body as never, matched as never, r) as unknown as Handle;
    } else {
      const d = feature.params.distance;
      if (!(d > 0)) throw new Error("Chamfer distance must be positive");
      next = k.chamfer(body as never, matched as never, d) as unknown as Handle;
    }
  } finally {
    // Sub-shape handles are owned by us; release all of them regardless.
    for (const e of matched) k.release(e as never);
    for (const e of unmatched) k.release(e as never);
  }

  k.release(body as never); // old body replaced by the modified one
  const missing = wanted.size - matched.length;
  const message =
    missing > 0
      ? `Applied to ${matched.length} edge(s); ${missing} not found`
      : `Applied to ${matched.length} edge(s)`;
  return { next, message };
}

/** Unit direction vector for a world axis name. */
function axisDir(axis: "x" | "y" | "z"): [number, number, number] {
  return axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1];
}

/**
 * Apply a whole-body transform feature (mirror / linear pattern / circular
 * pattern). Replicates the accumulated body and fuses the copies into one
 * solid. Consumes `body` (released here) and returns the new body handle.
 *
 * MVP simplification (per the brief's "corners cut" note): these operate on the
 * entire running body, not a selected sub-feature. Copies are fused with the
 * original; overlapping copies simply union cleanly.
 */
function applyTransform(
  k: OcctKernel,
  body: Handle,
  feature: TransformFeature,
): Handle {
  // Collect the transformed copies (not including the original unless kept).
  const copies: Handle[] = [];
  let keepOriginal = true;

  if (feature.type === "mirror") {
    const plane = BASE_PLANES[feature.params.plane];
    keepOriginal = feature.params.keepOriginal;
    const n = plane.normal;
    copies.push(
      k.mirror(body as never, plane.origin, n) as unknown as Handle,
    );
  } else if (feature.type === "linearPattern") {
    const { axis, count, spacing } = feature.params;
    if (!(count >= 2)) throw new Error("Pattern count must be at least 2");
    const [ux, uy, uz] = axisDir(axis);
    // i=0 is the original (kept separately); copies are i=1..count-1.
    for (let i = 1; i < count; i++) {
      const d = spacing * i;
      copies.push(
        k.translate(body as never, ux * d, uy * d, uz * d) as unknown as Handle,
      );
    }
  } else {
    // circularPattern
    const { axis, count, angle } = feature.params;
    if (!(count >= 2)) throw new Error("Pattern count must be at least 2");
    const [dx, dy, dz] = axisDir(axis);
    const axisSpec = { point: { x: 0, y: 0, z: 0 }, direction: { x: dx, y: dy, z: dz } };
    // A 360° sweep should not duplicate the original at 360°, so step by
    // count; a partial sweep spans the full angle across (count-1) gaps.
    const full = Math.abs(angle % 360) < 1e-6;
    const stepDeg = full ? angle / count : angle / (count - 1);
    for (let i = 1; i < count; i++) {
      const rad = (stepDeg * i * Math.PI) / 180;
      copies.push(
        k.rotate(body as never, axisSpec, rad) as unknown as Handle,
      );
    }
  }

  // Fuse everything: [original?] + copies. Fold left, normalizing to a solid.
  const parts: Handle[] = keepOriginal ? [body] : [];
  parts.push(...copies);
  if (parts.length === 0) throw new Error("Transform produced no bodies");

  let acc = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const fused = k.fuse(acc as never, parts[i] as never) as unknown as Handle;
    k.release(acc as never);
    k.release(parts[i] as never);
    acc = normalizeSolid(k, fused);
  }
  // If we dropped the original (mirror keepOriginal=false), release it.
  if (!keepOriginal) k.release(body as never);
  return acc;
}

/**
 * Convert a 2D profile into an OCCT planar face (wire -> face), mapping every
 * 2D point into 3D world space via the sketch plane. Releases the edges and
 * wire, returning the face handle. Caller owns the face.
 */
function buildFace(k: OcctKernel, profile: Profile, plane: SketchPlane): Handle {
  const to3d = (u: number, v: number) => sketchToWorld(plane, u, v);

  if (profile.isCircle) {
    const c = profile.edges[0];
    if (c.kind !== "circle") throw new Error("Malformed circle profile");
    const center = to3d(c.cx, c.cy);
    const edge = k.makeCircleEdge(
      center,
      plane.normal,
      c.radius,
    ) as unknown as Handle;
    const wire = k.makeWire([edge as never]) as unknown as Handle;
    const face = k.makeFace(wire as never) as unknown as Handle;
    k.release(edge as never);
    k.release(wire as never);
    return face;
  }

  const edgeHandles: Handle[] = [];
  for (const e of profile.edges) {
    if (e.kind === "line") {
      const s = to3d(e.x1, e.y1);
      const t = to3d(e.x2, e.y2);
      edgeHandles.push(k.makeLineEdge(s, t) as unknown as Handle);
    } else if (e.kind === "arc") {
      const s = to3d(e.x1, e.y1);
      const m = to3d(e.xm, e.ym);
      const t = to3d(e.x2, e.y2);
      edgeHandles.push(k.makeArcEdge(s, m, t) as unknown as Handle);
    } else {
      throw new Error("Circle edge mixed with chained edges");
    }
  }
  const wire = k.makeWire(edgeHandles as never) as unknown as Handle;
  const face = k.makeFace(wire as never) as unknown as Handle;
  for (const e of edgeHandles) k.release(e as never);
  k.release(wire as never);
  return face;
}

/**
 * Evaluate the whole tree into a single accumulated solid handle (or null),
 * recording per-feature status. The returned handle (if any) is owned by the
 * caller, who must tessellate then release it.
 */
function evaluateTree(
  k: OcctKernel,
  tree: FeatureTree,
): { result: Handle | null; statuses: FeatureStatus[] } {
  const statuses: FeatureStatus[] = [];
  let acc: Handle | null = null;

  // Index sketch features so extrude features can resolve their profiles.
  const sketches = new Map<string, SketchFeature>();
  for (const f of tree.features) {
    if (f.type === "sketch") sketches.set(f.id, f);
  }

  for (const feature of tree.features) {
    if (feature.suppressed) {
      statuses.push({ featureId: feature.id, state: "suppressed" });
      continue;
    }

    // Sketch features produce no solid; they only carry geometry for
    // downstream extrudes. Mark ok and move on.
    if (feature.type === "sketch") {
      statuses.push({ featureId: feature.id, state: "ok" });
      continue;
    }

    // Fillet/chamfer modify the accumulated body in place.
    if (isModifierFeature(feature)) {
      try {
        if (acc === null) {
          throw new Error("No body to modify — add a solid feature first");
        }
        const { next, message } = applyModifier(k, acc, feature);
        acc = next;
        statuses.push({ featureId: feature.id, state: "ok", message });
      } catch (err) {
        statuses.push({
          featureId: feature.id,
          state: "error",
          message: err instanceof Error ? err.message : String(err),
        });
        // Keep `acc` as-is (user-confirmed: error the feature, keep building).
      }
      continue;
    }

    // Mirror / linear pattern / circular pattern replicate the whole body.
    if (isTransformFeature(feature)) {
      try {
        if (acc === null) {
          throw new Error("No body to transform — add a solid feature first");
        }
        acc = applyTransform(k, acc, feature);
        statuses.push({ featureId: feature.id, state: "ok" });
      } catch (err) {
        statuses.push({
          featureId: feature.id,
          state: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
      continue;
    }

    // Remaining case: a solid feature (box/cylinder/extrude).
    try {
      // Build the placed solid for this feature (primitive or extrude). The
      // returned handle is a single live solid ready to combine.
      const placed = buildSolid(k, feature, sketches);

      // Combine with the accumulated body. Each boolean produces a fresh
      // handle; we release both inputs afterward. The first contributing
      // feature (acc === null) or an explicit "new" adopts `placed` directly.
      if (acc === null || feature.operation === "new") {
        if (acc !== null) k.release(acc as never); // discarded by "new"
        acc = placed;
      } else if (feature.operation === "add") {
        const fused = k.fuse(acc as never, placed as never) as unknown as Handle;
        k.release(acc as never);
        k.release(placed as never);
        acc = normalizeSolid(k, fused);
      } else {
        // "remove"
        const cutRes = k.cut(acc as never, placed as never) as unknown as Handle;
        k.release(acc as never);
        k.release(placed as never);
        acc = normalizeSolid(k, cutRes);
      }

      statuses.push({ featureId: feature.id, state: "ok" });
    } catch (err) {
      statuses.push({
        featureId: feature.id,
        state: "error",
        message: err instanceof Error ? err.message : String(err),
      });
      // Leave `acc` untouched and continue with the next feature.
    }
  }

  return { result: acc, statuses };
}

/**
 * Tessellate a final solid into transferable mesh + edge payloads, matching
 * the buildShapeResult logic used for standalone primitives. See
 * occt-wasm-group-units memory for the offset-unit gotchas.
 */
function tessellate(
  k: OcctKernel,
  handle: Handle,
  quality: Required<TessellationQuality>,
): { mesh: MeshPayload; edges: EdgePayload; bbox: RegenResult["bbox"] } {
  const opts = {
    linearDeflection: quality.linearDeflection,
    angularDeflection: quality.angularDeflection,
  };
  const raw = k.meshShape(handle as never, opts);
  const mesh: MeshPayload = {
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    indices: new Uint32Array(raw.indices),
    vertexCount: raw.vertexCount,
    triangleCount: raw.triangleCount,
    faceGroups: new Int32Array(raw.faceGroups ?? new Int32Array(0)),
    faceCount: raw.faceCount ?? 0,
  };

  const rawEdges = k.wireframe(handle as never, quality.linearDeflection);
  const edges: EdgePayload = {
    points: new Float32Array(rawEdges.points),
    edgeGroups: new Int32Array(rawEdges.edgeGroups),
    edgeCount: rawEdges.edgeCount,
  };

  const bb = k.getBoundingBox(handle as never, true);
  return {
    mesh,
    edges,
    bbox: {
      min: [bb.xmin, bb.ymin, bb.zmin],
      max: [bb.xmax, bb.ymax, bb.zmax],
    },
  };
}

/** Full regeneration: evaluate the tree, tessellate the result, clean up. */
export function regenerate(
  k: OcctKernel,
  tree: FeatureTree,
  quality?: TessellationQuality,
): RegenResult {
  const q = { ...DEFAULT_QUALITY, ...quality };
  const { result, statuses } = evaluateTree(k, tree);

  if (result === null) {
    return { statuses, shapeId: null, mesh: null, edges: null, bbox: null };
  }

  try {
    const { mesh, edges, bbox } = tessellate(k, result, q);
    return { statuses, shapeId: result as unknown as number, mesh, edges, bbox };
  } finally {
    // The final body has been copied into standalone typed arrays, so it's
    // safe to release. Nothing downstream references the handle after this.
    k.release(result as never);
  }
}

/**
 * Regenerate the tree to a single body and serialize it to STEP or STL text.
 * Throws if the tree produces no geometry. Releases the body afterward.
 */
export function exportTree(
  k: OcctKernel,
  tree: FeatureTree,
  format: "step" | "stl",
): string {
  const { result } = evaluateTree(k, tree);
  if (result === null) {
    throw new Error("Nothing to export — the model is empty");
  }
  try {
    if (format === "step") {
      return k.exportStep(result as never);
    }
    // ascii STL for portability/readability; linearDeflection matches our mesh.
    return k.exportStl(result as never, DEFAULT_QUALITY.linearDeflection, true);
  } finally {
    k.release(result as never);
  }
}
