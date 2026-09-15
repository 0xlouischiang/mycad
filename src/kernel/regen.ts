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
  HoleFeature,
  LoftFeature,
  ModifierFeature,
  RevolveFeature,
  SketchFeature,
  SolidFeature,
  SplitFeature,
  SweepFeature,
} from "../model/featureTree";
import { isModifierFeature, isTransformFeature } from "../model/featureTree";
import type { TransformFeature } from "../model/featureTree";
import { edgeRefFromCenter } from "../model/edgeRef";
import {
  BASE_PLANES,
  resolveSketchPlane,
  sketchToWorld,
  type SketchPlane,
} from "../model/sketch";
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
    case "loft":
      return buildLoft(k, feature, sketches);
    case "sweep":
      return buildSweep(k, feature, sketches);
    case "import": {
      const imported =
        feature.format === "step"
          ? (k.importStep(feature.data) as unknown as Handle)
          : (k.importStl(feature.data) as unknown as Handle);
      // Normalize a compound/single-solid import to a solid where possible.
      return normalizeSolid(k, imported);
    }
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
  const { distance, flip, symmetric } = feature.params;
  if (!(distance > 0)) throw new Error("Extrude distance must be positive");

  const result = extractProfile(sketchFeature.sketch);
  if (!result.ok) throw new Error(result.error);

  const plane = resolveSketchPlane(sketchFeature.sketch);
  const face = buildFace(k, result.profile, plane);
  const dir = plane.normal;

  try {
    if (symmetric) {
      // Extrude the full 2*distance, then shift back by `distance` so the solid
      // straddles the sketch plane symmetrically.
      const raw = k.extrude(
        face as never,
        dir.x * distance * 2,
        dir.y * distance * 2,
        dir.z * distance * 2,
      ) as unknown as Handle;
      const centered = k.translate(
        raw as never,
        -dir.x * distance,
        -dir.y * distance,
        -dir.z * distance,
      ) as unknown as Handle;
      k.release(raw as never);
      return centered;
    }
    // One-sided extrude along the plane normal (flip reverses direction).
    const sign = flip ? -1 : 1;
    return k.extrude(
      face as never,
      dir.x * distance * sign,
      dir.y * distance * sign,
      dir.z * distance * sign,
    ) as unknown as Handle;
  } finally {
    k.release(face as never);
  }
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

  const plane = resolveSketchPlane(sketchFeature.sketch);
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
 * Loft a solid through an ordered list of sketch profiles. Each profile becomes
 * a section wire; k.loft skins through them. Releases all section wires.
 */
function buildLoft(
  k: OcctKernel,
  feature: LoftFeature,
  sketches: Map<string, SketchFeature>,
): Handle {
  if (feature.sketchIds.length < 2) {
    throw new Error("Loft needs at least 2 profiles");
  }
  const wires: Handle[] = [];
  try {
    for (const sid of feature.sketchIds) {
      const sf = sketches.get(sid);
      if (!sf) throw new Error("Loft references a missing sketch");
      const result = extractProfile(sf.sketch);
      if (!result.ok) throw new Error(result.error);
      wires.push(buildProfileWire(k, result.profile, resolveSketchPlane(sf.sketch)));
    }
    return k.loft(wires as never, true, feature.params.ruled) as unknown as Handle;
  } finally {
    for (const w of wires) k.release(w as never);
  }
}

/**
 * Sweep a closed profile along a path (spine). The profile sketch is a closed
 * loop; the path sketch is an open chain, so we build the spine wire directly
 * from the path sketch's connected edges rather than via extractProfile (which
 * requires closure).
 */
function buildSweep(
  k: OcctKernel,
  feature: SweepFeature,
  sketches: Map<string, SketchFeature>,
): Handle {
  const profSf = sketches.get(feature.profileSketchId);
  const pathSf = sketches.get(feature.pathSketchId);
  if (!profSf) throw new Error("Sweep references a missing profile sketch");
  if (!pathSf) throw new Error("Sweep references a missing path sketch");

  const profResult = extractProfile(profSf.sketch);
  if (!profResult.ok) throw new Error(`Profile: ${profResult.error}`);

  const profileWire = buildProfileWire(
    k,
    profResult.profile,
    resolveSketchPlane(profSf.sketch),
  );
  const spine = buildOpenPathWire(k, pathSf);
  try {
    return k.sweep(profileWire as never, spine as never) as unknown as Handle;
  } finally {
    k.release(profileWire as never);
    k.release(spine as never);
  }
}

/**
 * Build an OPEN path wire from a sketch's line/arc entities (a sweep spine).
 * Unlike extractProfile, this does not require closure — it just orders the
 * connected edges into a single chain in 3D world space.
 */
function buildOpenPathWire(k: OcctKernel, sketchFeature: SketchFeature): Handle {
  const plane = resolveSketchPlane(sketchFeature.sketch);
  const to3d = (u: number, v: number) => sketchToWorld(plane, u, v);
  const sketch = sketchFeature.sketch;
  const pointById = new Map(sketch.points.map((p) => [p.id, p]));
  const chain = sketch.entities.filter(
    (e) => e.type === "line" || e.type === "arc",
  );
  if (chain.length === 0) throw new Error("Sweep path has no edges");

  const edges: Handle[] = [];
  try {
    for (const e of chain) {
      if (e.type === "line") {
        const p1 = pointById.get(e.p1);
        const p2 = pointById.get(e.p2);
        if (!p1 || !p2) throw new Error("Path edge references missing point");
        edges.push(
          k.makeLineEdge(to3d(p1.u, p1.v), to3d(p2.u, p2.v)) as unknown as Handle,
        );
      } else if (e.type === "arc") {
        const c = pointById.get(e.center);
        const s = pointById.get(e.start);
        const en = pointById.get(e.end);
        if (!c || !s || !en) throw new Error("Path arc references missing point");
        // Midpoint on the arc for the 3-point form.
        const r = Math.hypot(s.u - c.u, s.v - c.v);
        let a0 = Math.atan2(s.v - c.v, s.u - c.u);
        let a1 = Math.atan2(en.v - c.v, en.u - c.u);
        while (a1 <= a0) a1 += 2 * Math.PI;
        const am = (a0 + a1) / 2;
        const mid = to3d(c.u + r * Math.cos(am), c.v + r * Math.sin(am));
        edges.push(
          k.makeArcEdge(to3d(s.u, s.v), mid, to3d(en.u, en.v)) as unknown as Handle,
        );
      }
    }
    return k.makeWire(edges as never) as unknown as Handle;
  } finally {
    for (const e of edges) k.release(e as never);
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
  // Hole is a tool-cut modifier, not a sub-shape-referencing one: build the
  // hole tool solid and subtract it from the body.
  if (feature.type === "hole") {
    const next = applyHole(k, body, feature);
    return { next, message: `Drilled ${feature.params.holeType} hole` };
  }

  // Split: subtract a large half-space box on the discard side of the plane.
  if (feature.type === "split") {
    const next = applySplit(k, body, feature);
    return { next, message: `Kept ${feature.params.keep} side` };
  }

  // Fillet/chamfer reference edges; shell/draft reference faces. Resolve the
  // appropriate sub-shape kind by stable bbox-center ref (see edgeRef.ts).
  const kind: "edge" | "face" =
    feature.type === "fillet" || feature.type === "chamfer" ? "edge" : "face";
  const wanted = new Set(
    feature.type === "fillet" || feature.type === "chamfer"
      ? feature.edgeRefs
      : feature.faceRefs,
  );
  if (wanted.size === 0) throw new Error(`No ${kind}s selected`);

  const subs = k.getSubShapes(body as never, kind) as unknown as Handle[];
  const matched: Handle[] = [];
  const unmatched: Handle[] = [];
  for (const s of subs) {
    const bb = k.getBoundingBox(s as never, false);
    const ref = edgeRefFromCenter(
      (bb.xmin + bb.xmax) / 2,
      (bb.ymin + bb.ymax) / 2,
      (bb.zmin + bb.zmax) / 2,
    );
    if (wanted.has(ref)) matched.push(s);
    else unmatched.push(s);
  }

  if (matched.length === 0) {
    for (const s of subs) k.release(s as never);
    throw new Error(
      `None of ${wanted.size} referenced ${kind}(s) found on the current body`,
    );
  }

  let next: Handle;
  try {
    switch (feature.type) {
      case "fillet": {
        const r = feature.params.radius;
        if (!(r > 0)) throw new Error("Fillet radius must be positive");
        next = k.fillet(body as never, matched as never, r) as unknown as Handle;
        break;
      }
      case "chamfer": {
        const d = feature.params.distance;
        if (!(d > 0)) throw new Error("Chamfer distance must be positive");
        next = k.chamfer(body as never, matched as never, d) as unknown as Handle;
        break;
      }
      case "shell": {
        const t = feature.params.thickness;
        if (!(t > 0)) throw new Error("Shell thickness must be positive");
        // Negative thickness would offset outward; we hollow inward. 1e-6 is
        // the precise tolerance (see kernel docs).
        next = k.shell(body as never, matched as never, t, 1e-6) as unknown as Handle;
        break;
      }
      case "draft": {
        const angleRad = (feature.params.angle * Math.PI) / 180;
        const d = feature.params.direction;
        const dir = d === "x" ? { x: 1, y: 0, z: 0 } : d === "y" ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 };
        // k.draft takes a single face; apply to each matched face in turn,
        // threading the result. Release intermediates.
        let acc = body;
        for (const f of matched) {
          const drafted = k.draft(acc as never, f as never, angleRad, dir) as unknown as Handle;
          if (acc !== body) k.release(acc as never);
          acc = drafted;
        }
        next = acc;
        break;
      }
      default: {
        const _never: never = feature;
        throw new Error(`Unhandled modifier ${JSON.stringify(_never)}`);
      }
    }
  } finally {
    for (const s of matched) k.release(s as never);
    for (const s of unmatched) k.release(s as never);
  }

  k.release(body as never); // old body replaced by the modified one
  next = normalizeSolid(k, next); // shell/draft can wrap the result in a compound
  const missing = wanted.size - matched.length;
  const noun = kind;
  const message =
    missing > 0
      ? `Applied to ${matched.length} ${noun}(s); ${missing} not found`
      : `Applied to ${matched.length} ${noun}(s)`;
  return { next, message };
}

/** Unit direction vector for a world axis name. */
function axisDir(axis: "x" | "y" | "z"): [number, number, number] {
  return axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1];
}

/**
 * Build the hole tool solid and cut it from the body. The tool is built along
 * +Z at the origin then transformed onto the hole's plane/position/direction,
 * so we reuse the sketch-plane basis to place it. `body` is consumed.
 *
 * Hole types:
 *  - simple: a single bore cylinder.
 *  - counterbore: bore + a wider flat cylindrical recess at the mouth.
 *  - countersink: bore + a cone recess at the mouth (rim dia, included angle).
 */
function applyHole(k: OcctKernel, body: Handle, feature: HoleFeature): Handle {
  const p = feature.params;
  if (!(p.diameter > 0)) throw new Error("Hole diameter must be positive");
  if (!(p.depth > 0)) throw new Error("Hole depth must be positive");

  const plane = resolveSketchPlane({ planeId: p.plane, planeOffset: p.startOffset });
  const r = p.diameter / 2;
  // Local tool is built along +Z (cylinder grows +Z from its base), then we
  // map local Z to the drilling direction (plane normal * dir) and local XY to
  // the plane u/v so the hole sits at (x, y) on the plane. We assemble the tool
  // in local coordinates, union its parts, then place it with a 3x4 matrix.
  const parts: Handle[] = [];
  // Overshoot both ends slightly so cuts are clean through faces.
  const OVER = 0.01;
  // Bore: from just above the mouth down to `depth`.
  const bore = k.makeCylinder(r, p.depth + OVER) as unknown as Handle;
  parts.push(bore);

  if (p.holeType === "counterbore") {
    if (p.cboreDiameter > p.diameter && p.cboreDepth > 0) {
      const cb = k.makeCylinder(p.cboreDiameter / 2, p.cboreDepth) as unknown as Handle;
      parts.push(cb);
    }
  } else if (p.holeType === "countersink") {
    if (p.csinkDiameter > p.diameter) {
      // Cone: wide at the mouth (rim radius) tapering to the bore radius over a
      // depth implied by the included angle.
      const rimR = p.csinkDiameter / 2;
      const half = (p.csinkAngle * Math.PI) / 180 / 2;
      const csDepth = (rimR - r) / Math.tan(half);
      // makeCone(r1, r2, height): r1 at base (z=0). We want the wide rim at the
      // mouth (top), so build with r1=rimR at base then position; simpler: the
      // mouth is at local z=0 going -? Our tool grows +Z, mouth at top. Build
      // cone wide-at-top by r1=r (bottom) r2=rimR (top).
      const cone = k.makeCone(r, rimR, csDepth) as unknown as Handle;
      // Cone sits at the mouth region [depth-csDepth?]. Place it at the top of
      // the bore: translate up so its top aligns with the bore top.
      const placedCone = k.translate(
        cone as never,
        0,
        0,
        p.depth - csDepth,
      ) as unknown as Handle;
      k.release(cone as never);
      parts.push(placedCone);
    }
  }

  // Union the tool parts into one solid.
  let tool = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const fused = k.fuse(tool as never, parts[i] as never) as unknown as Handle;
    k.release(tool as never);
    k.release(parts[i] as never);
    tool = normalizeSolid(k, fused);
  }

  // The local tool grows +Z with mouth at local z=depth (top). We want the
  // mouth at the plane at (x,y) and the bore going along -localZ into the body.
  // Simplest robust placement: build a transform mapping local axes to world.
  // localZ -> drill direction d = normal * dir ; the mouth should sit at the
  // plane point P; the bore extends from P along d. Since our cylinder mouth is
  // at local z=+depth and base at z=0 (base is the bore bottom), we map local
  // z=depth → P and local -Z → d. So worldZaxis = -d, and origin maps so that
  // local (0,0,depth) → P.
  const d = plane.normal;
  const dir = p.dir; // +1 or -1
  const zx = -d.x * dir,
    zy = -d.y * dir,
    zz = -d.z * dir;
  const P = sketchToWorld(plane, p.x, p.y);
  // Build orthonormal frame: localX = plane.uAxis, localY = plane.vAxis,
  // localZ = (zx,zy,zz). 3x4 row-major: [r00,r01,r02,tx, ...]. Columns are the
  // world images of local X, Y, Z; translation places local origin.
  const ux = plane.uAxis,
    vy = plane.vAxis;
  // local origin (bore base) maps to P - localZ*depth  (so that z=depth → P).
  const ox = P.x - zx * p.depth,
    oy = P.y - zy * p.depth,
    oz = P.z - zz * p.depth;
  const matrix = [
    ux.x, vy.x, zx, ox,
    ux.y, vy.y, zy, oy,
    ux.z, vy.z, zz, oz,
  ];
  const placed = k.transform(tool as never, matrix) as unknown as Handle;
  k.release(tool as never);

  const result = normalizeSolid(k, k.cut(body as never, placed as never) as unknown as Handle);
  k.release(placed as never);
  k.release(body as never);
  return result;
}

/**
 * Split the body by a base plane (at `offset` along its normal), keeping one
 * side. We build a large box covering the DISCARD half-space and subtract it,
 * so only the kept side survives. `body` is consumed.
 */
function applySplit(k: OcctKernel, body: Handle, feature: SplitFeature): Handle {
  const p = feature.params;
  const plane = BASE_PLANES[p.plane];
  const n = plane.normal;

  // Size the cutting box from the body's bounding box (with margin) so it fully
  // covers one side regardless of model scale.
  const bb = k.getBoundingBox(body as never, true);
  const span =
    Math.max(bb.xmax - bb.xmin, bb.ymax - bb.ymin, bb.zmax - bb.zmin, 1) * 4 + 10;
  const cx = (bb.xmin + bb.xmax) / 2;
  const cy = (bb.ymin + bb.ymax) / 2;
  const cz = (bb.zmin + bb.zmax) / 2;

  // A cube centered at the model center. We translate it by ±span/2 along the
  // normal so one face lies on the cut plane and it covers the discard side.
  const cube = k.makeBox(span, span, span) as unknown as Handle;
  // makeBox origin is a corner; center it first.
  const centered = k.translate(cube as never, -span / 2, -span / 2, -span / 2) as unknown as Handle;
  k.release(cube as never);

  // Discard side sign: keep "positive" → discard the -normal side, so push the
  // cube center to the -normal side by span/2 from the plane point.
  const sign = p.keep === "positive" ? -1 : 1;
  // Plane point = origin + normal*offset; but we center the box on the model in
  // the in-plane directions and only shift along the normal to the plane.
  // Move the box so its near face sits at the plane: center at planePoint +
  // normal*sign*(span/2). In-plane, keep it at the model center.
  const planePtAlongN = p.offset; // distance of plane from origin along n
  // Component of model center along n:
  const cAlongN = cx * n.x + cy * n.y + cz * n.z;
  // Desired box-center offset along n from model center:
  const boxCenterN = planePtAlongN + sign * (span / 2);
  const shiftN = boxCenterN - cAlongN;
  const placed = k.translate(
    centered as never,
    cx + n.x * shiftN,
    cy + n.y * shiftN,
    cz + n.z * shiftN,
  ) as unknown as Handle;
  k.release(centered as never);

  const result = normalizeSolid(k, k.cut(body as never, placed as never) as unknown as Handle);
  k.release(placed as never);
  k.release(body as never);
  return result;
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
function buildProfileWire(
  k: OcctKernel,
  profile: Profile,
  plane: SketchPlane,
): Handle {
  const to3d = (u: number, v: number) => sketchToWorld(plane, u, v);

  if (profile.isCircle) {
    // Single closed curve: circle or ellipse.
    const c = profile.edges[0];
    const center = to3d(c.kind === "circle" || c.kind === "ellipse" ? c.cx : 0, c.kind === "circle" || c.kind === "ellipse" ? c.cy : 0);
    let edge: Handle;
    if (c.kind === "circle") {
      edge = k.makeCircleEdge(center, plane.normal, c.radius) as unknown as Handle;
    } else if (c.kind === "ellipse") {
      // Base ellipse has its major axis along the surface's reference X; we
      // rotate the edge about the plane normal by the stored in-plane rotation.
      const raw = k.makeEllipseEdge(
        center,
        plane.normal,
        c.major,
        c.minor,
      ) as unknown as Handle;
      if (Math.abs(c.rotation) < 1e-9) {
        edge = raw;
      } else {
        edge = k.rotate(
          raw as never,
          { point: center, direction: plane.normal },
          c.rotation,
        ) as unknown as Handle;
        k.release(raw as never);
      }
    } else {
      throw new Error("Malformed single-curve profile");
    }
    const wire = k.makeWire([edge as never]) as unknown as Handle;
    k.release(edge as never);
    return wire;
  }

  const edgeHandles: Handle[] = [];
  for (const e of profile.edges) {
    if (e.kind === "line") {
      edgeHandles.push(
        k.makeLineEdge(to3d(e.x1, e.y1), to3d(e.x2, e.y2)) as unknown as Handle,
      );
    } else if (e.kind === "arc") {
      edgeHandles.push(
        k.makeArcEdge(
          to3d(e.x1, e.y1),
          to3d(e.xm, e.ym),
          to3d(e.x2, e.y2),
        ) as unknown as Handle,
      );
    } else if (e.kind === "spline") {
      // Interpolate a spline edge through the mapped 3D points.
      const pts3d = e.pts.map((p) => to3d(p.u, p.v));
      edgeHandles.push(
        k.interpolatePoints(pts3d as never, false) as unknown as Handle,
      );
    } else {
      throw new Error("Circle/ellipse edge mixed with chained edges");
    }
  }
  const wire = k.makeWire(edgeHandles as never) as unknown as Handle;
  for (const e of edgeHandles) k.release(e as never);
  return wire;
}

/** Build a planar face from a closed profile (wire → face). Caller owns it. */
function buildFace(k: OcctKernel, profile: Profile, plane: SketchPlane): Handle {
  const wire = buildProfileWire(k, profile, plane);
  const face = k.makeFace(wire as never) as unknown as Handle;
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

/**
 * Regenerate the tree to a solid and compute its mass properties. Returns
 * nulls if the model is empty. Releases the body afterward.
 */
export function massPropsOfTree(
  k: OcctKernel,
  tree: FeatureTree,
): {
  volume: number | null;
  surfaceArea: number | null;
  centerOfMass: [number, number, number] | null;
} {
  const { result } = evaluateTree(k, tree);
  if (result === null) {
    return { volume: null, surfaceArea: null, centerOfMass: null };
  }
  try {
    const com = k.getCenterOfMass(result as never);
    return {
      volume: k.getVolume(result as never),
      surfaceArea: k.getSurfaceArea(result as never),
      centerOfMass: [com.x, com.y, com.z],
    };
  } finally {
    k.release(result as never);
  }
}
