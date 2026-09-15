/**
 * Command registry (Phase 13) — the single typed catalog of feature-creation
 * commands, described with JSON Schema, used by BOTH the chat/LLM tool-calling
 * path and (indirectly) the UI. Each command validates its input, then calls
 * the SAME store action a UI button would, so a feature it creates is
 * indistinguishable from a manually-created one (same undo/regen/save via
 * mutateTree).
 *
 * No React / DOM / fetch deps → unit-testable in the node harness. The store is
 * passed in (the live Zustand state object) so the registry stays decoupled
 * from the store module and easy to test with a real store instance.
 */
import type { AppState, PrimitiveSketchSpec } from "../store";
import { catalogGeometry, type GeometryCatalog } from "./context";
import type { JointType } from "../model/robot";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal JSON Schema shape we author (Anthropic tool input_schema subset). */
export interface JSONSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export type CommandResult =
  | { ok: true; featureId?: string; message: string }
  | { ok: false; error: string };

/**
 * A live handle to the store. We take this (not a state snapshot) because
 * Zustand returns a NEW state object after every `set`, so a captured snapshot
 * goes stale the moment a command mutates the tree. `useStore` itself satisfies
 * this interface, so callers pass `useStore` directly.
 */
export interface StoreHandle {
  getState(): AppState;
}

export interface Command {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  run(input: Record<string, unknown>, store: StoreHandle): CommandResult;
}

// ---------------------------------------------------------------------------
// Tiny schema validator (structural — enough to catch LLM mistakes cheaply)
// ---------------------------------------------------------------------------

/**
 * Validate `input` against a schema. Returns an error string, or null if valid.
 * Supports the subset we author: object with typed properties (number, string,
 * boolean, array, object), required[], and enum on string props.
 */
export function validateInput(
  input: unknown,
  schema: JSONSchema,
): string | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return "input must be an object";
  }
  const obj = input as Record<string, unknown>;
  for (const key of schema.required ?? []) {
    if (obj[key] === undefined || obj[key] === null) {
      return `missing required field "${key}"`;
    }
  }
  for (const [key, value] of Object.entries(obj)) {
    const propSchema = schema.properties[key] as
      | { type?: string; enum?: unknown[] }
      | undefined;
    if (!propSchema) {
      if (schema.additionalProperties === false) {
        return `unknown field "${key}"`;
      }
      continue;
    }
    const err = checkType(key, value, propSchema);
    if (err) return err;
  }
  return null;
}

function checkType(
  key: string,
  value: unknown,
  propSchema: { type?: string; enum?: unknown[] },
): string | null {
  const t = propSchema.type;
  if (t === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return `field "${key}" must be a finite number`;
    }
  } else if (t === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return `field "${key}" must be an integer`;
    }
  } else if (t === "string") {
    if (typeof value !== "string") return `field "${key}" must be a string`;
  } else if (t === "boolean") {
    if (typeof value !== "boolean") return `field "${key}" must be a boolean`;
  } else if (t === "array") {
    if (!Array.isArray(value)) return `field "${key}" must be an array`;
  } else if (t === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return `field "${key}" must be an object`;
    }
  }
  if (propSchema.enum && !propSchema.enum.includes(value)) {
    return `field "${key}" must be one of ${JSON.stringify(propSchema.enum)}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Small helpers shared by commands
// ---------------------------------------------------------------------------

const PLANE_ENUM = ["XY", "XZ", "YZ"] as const;
const AXIS_ENUM = ["x", "y", "z"] as const;

/** Find a sketch feature by id or by (case-insensitive) name. */
function findSketch(store: StoreHandle, ref: string) {
  const feats = store.getState().tree.features.filter((f) => f.type === "sketch");
  return (
    feats.find((f) => f.id === ref) ||
    feats.find((f) => f.name.toLowerCase() === ref.toLowerCase()) ||
    null
  );
}

function sketchList(store: StoreHandle): string {
  const feats = store.getState().tree.features.filter((f) => f.type === "sketch");
  if (feats.length === 0) return "(no sketches in the tree)";
  return feats.map((f) => `${f.name} (id ${f.id})`).join(", ");
}

/** Resolve which edge refs a command targets: explicit refs must exist in the catalog. */
function resolveEdgeRefs(
  cat: GeometryCatalog,
  refs: string[],
): { ok: true; refs: string[] } | { ok: false; error: string } {
  const available = new Set(cat.edges.map((e) => e.ref));
  const missing = refs.filter((r) => !available.has(r));
  if (missing.length > 0) {
    return {
      ok: false,
      error:
        `edge ref(s) not found: ${missing.join(", ")}. ` +
        `Available edges: ${cat.edges.map((e) => e.ref).join("; ") || "(none — is there a body?)"}`,
    };
  }
  return { ok: true, refs };
}

function resolveFaceRefs(
  cat: GeometryCatalog,
  refs: string[],
): { ok: true; refs: string[] } | { ok: false; error: string } {
  const available = new Set(cat.faces.map((f) => f.ref));
  const missing = refs.filter((r) => !available.has(r));
  if (missing.length > 0) {
    return {
      ok: false,
      error:
        `face ref(s) not found: ${missing.join(", ")}. ` +
        `Available faces: ${cat.faces.map((f) => f.ref).join("; ") || "(none — is there a body?)"}`,
    };
  }
  return { ok: true, refs };
}

function num(input: Record<string, unknown>, key: string): number | undefined {
  const v = input[key];
  return typeof v === "number" ? v : undefined;
}

function str(input: Record<string, unknown>, key: string): string | undefined {
  const v = input[key];
  return typeof v === "string" ? v : undefined;
}

// ---------------------------------------------------------------------------
// Command definitions
// ---------------------------------------------------------------------------

const commands: Command[] = [
  {
    name: "add_box",
    description:
      "Add a box primitive. dx/dy/dz are its dimensions in mm. Positions at the origin (edit position afterward with update_position if needed).",
    inputSchema: {
      type: "object",
      properties: {
        dx: { type: "number", description: "size along X (mm)" },
        dy: { type: "number", description: "size along Y (mm)" },
        dz: { type: "number", description: "size along Z (mm)" },
      },
      required: ["dx", "dy", "dz"],
      additionalProperties: false,
    },
    run(input, store) {
      const dx = num(input, "dx")!, dy = num(input, "dy")!, dz = num(input, "dz")!;
      if (dx <= 0 || dy <= 0 || dz <= 0) {
        return { ok: false, error: "box dimensions must be positive" };
      }
      store.getState().addFeature("box");
      const f = lastFeature(store);
      if (f) store.getState().updateParams(f.id, { dx, dy, dz });
      return { ok: true, featureId: f?.id, message: `Added box ${dx}×${dy}×${dz}` };
    },
  },
  {
    name: "add_cylinder",
    description: "Add a cylinder primitive with the given radius and height (mm).",
    inputSchema: {
      type: "object",
      properties: {
        radius: { type: "number" },
        height: { type: "number" },
      },
      required: ["radius", "height"],
      additionalProperties: false,
    },
    run(input, store) {
      const radius = num(input, "radius")!, height = num(input, "height")!;
      if (radius <= 0 || height <= 0) {
        return { ok: false, error: "radius and height must be positive" };
      }
      store.getState().addFeature("cylinder");
      const f = lastFeature(store);
      if (f) store.getState().updateParams(f.id, { radius, height });
      return { ok: true, featureId: f?.id, message: `Added cylinder r${radius}×h${height}` };
    },
  },
  {
    name: "add_sketch",
    description:
      "Add a parametric primitive sketch (rectangle, circle, or polygon) on a base plane. Freeform sketching is not available via chat. Returns a sketch you can then extrude or revolve. cx/cy optionally offset the shape center in the plane.",
    inputSchema: {
      type: "object",
      properties: {
        plane: { type: "string", enum: [...PLANE_ENUM] },
        offset: { type: "number", description: "plane offset along its normal (mm)" },
        shape: {
          type: "string",
          enum: ["rectangle", "circle", "polygon"],
        },
        width: { type: "number", description: "rectangle width" },
        height: { type: "number", description: "rectangle height" },
        radius: { type: "number", description: "circle/polygon radius" },
        sides: { type: "integer", description: "polygon side count (>=3)" },
        cx: { type: "number" },
        cy: { type: "number" },
      },
      required: ["plane", "shape"],
      additionalProperties: false,
    },
    run(input, store) {
      const plane = str(input, "plane") as PrimitiveSketchSpec["plane"];
      const shape = str(input, "shape");
      const offset = num(input, "offset");
      const cx = num(input, "cx");
      const cy = num(input, "cy");
      let spec: PrimitiveSketchSpec;
      if (shape === "rectangle") {
        const width = num(input, "width"), height = num(input, "height");
        if (!width || !height || width <= 0 || height <= 0) {
          return { ok: false, error: "rectangle needs positive width and height" };
        }
        spec = { plane, offset, kind: "rectangle", width, height, cx, cy };
      } else if (shape === "circle") {
        const radius = num(input, "radius");
        if (!radius || radius <= 0) {
          return { ok: false, error: "circle needs a positive radius" };
        }
        spec = { plane, offset, kind: "circle", radius, cx, cy };
      } else if (shape === "polygon") {
        const radius = num(input, "radius"), sides = num(input, "sides");
        if (!radius || radius <= 0) return { ok: false, error: "polygon needs a positive radius" };
        if (!sides || sides < 3) return { ok: false, error: "polygon needs sides >= 3" };
        spec = { plane, offset, kind: "polygon", radius, sides, cx, cy };
      } else {
        return { ok: false, error: `unknown shape "${shape}"` };
      }
      const id = store.getState().addSketchPrimitive(spec);
      return { ok: true, featureId: id, message: `Added ${shape} sketch on ${plane}` };
    },
  },
  {
    name: "add_extrude",
    description:
      "Extrude a sketch into a solid. Reference the sketch by its id or name (see the feature list). distance in mm; symmetric extrudes both ways; flip reverses direction.",
    inputSchema: {
      type: "object",
      properties: {
        sketch: { type: "string", description: "sketch id or name" },
        distance: { type: "number" },
        flip: { type: "boolean" },
        symmetric: { type: "boolean" },
      },
      required: ["sketch", "distance"],
      additionalProperties: false,
    },
    run(input, store) {
      const sketch = findSketch(store, str(input, "sketch")!);
      if (!sketch) {
        return { ok: false, error: `no sketch "${str(input, "sketch")}". Available: ${sketchList(store)}` };
      }
      const distance = num(input, "distance")!;
      if (distance <= 0) return { ok: false, error: "distance must be positive" };
      store.getState().addExtrude(sketch.id);
      const f = lastFeature(store);
      if (f) {
        const params: Record<string, number | boolean> = { distance };
        if (typeof input.flip === "boolean") params.flip = input.flip;
        if (typeof input.symmetric === "boolean") params.symmetric = input.symmetric;
        store.getState().updateParams(f.id, params);
      }
      return { ok: true, featureId: f?.id, message: `Extruded ${sketch.name} by ${distance}` };
    },
  },
  {
    name: "add_revolve",
    description:
      "Revolve a sketch about an in-plane axis. Reference the sketch by id or name. angle in degrees (default 360). axis 'u' or 'v'.",
    inputSchema: {
      type: "object",
      properties: {
        sketch: { type: "string" },
        angle: { type: "number" },
        axis: { type: "string", enum: ["u", "v"] },
      },
      required: ["sketch"],
      additionalProperties: false,
    },
    run(input, store) {
      const sketch = findSketch(store, str(input, "sketch")!);
      if (!sketch) {
        return { ok: false, error: `no sketch "${str(input, "sketch")}". Available: ${sketchList(store)}` };
      }
      store.getState().addRevolve(sketch.id);
      const f = lastFeature(store);
      if (f) {
        const params: Record<string, number | boolean> = {};
        const angle = num(input, "angle");
        if (angle !== undefined) params.angle = angle;
        store.getState().updateParams(f.id, params);
        const axis = str(input, "axis");
        if (axis) store.getState().updateFeature(f.id, { params: { ...(f as { params: object }).params, axis } } as never);
      }
      return { ok: true, featureId: f?.id, message: `Revolved ${sketch.name}` };
    },
  },
  {
    name: "add_fillet",
    description:
      "Round edges with a radius (mm). Provide edge refs from the geometry catalog (the 'ref' strings). To fillet e.g. the top edges, pick refs whose center Z is highest.",
    inputSchema: {
      type: "object",
      properties: {
        edges: { type: "array", description: "edge ref strings from the catalog" },
        radius: { type: "number" },
      },
      required: ["edges", "radius"],
      additionalProperties: false,
    },
    run(input, store) {
      const radius = num(input, "radius")!;
      if (radius <= 0) return { ok: false, error: "radius must be positive" };
      const refs = (input.edges as unknown[]).map(String);
      if (refs.length === 0) return { ok: false, error: "no edges given" };
      const cat = catalogGeometry(store.getState().shape);
      const resolved = resolveEdgeRefs(cat, refs);
      if (!resolved.ok) return resolved;
      const id = store.getState().addFilletFor(resolved.refs, radius);
      if (!id) return { ok: false, error: "fillet failed (no edges resolved)" };
      return { ok: true, featureId: id, message: `Filleted ${refs.length} edge(s) r${radius}` };
    },
  },
  {
    name: "add_chamfer",
    description:
      "Bevel edges with a setback distance (mm). Provide edge refs from the geometry catalog.",
    inputSchema: {
      type: "object",
      properties: {
        edges: { type: "array" },
        distance: { type: "number" },
      },
      required: ["edges", "distance"],
      additionalProperties: false,
    },
    run(input, store) {
      const distance = num(input, "distance")!;
      if (distance <= 0) return { ok: false, error: "distance must be positive" };
      const refs = (input.edges as unknown[]).map(String);
      if (refs.length === 0) return { ok: false, error: "no edges given" };
      const cat = catalogGeometry(store.getState().shape);
      const resolved = resolveEdgeRefs(cat, refs);
      if (!resolved.ok) return resolved;
      const id = store.getState().addChamferFor(resolved.refs, distance);
      if (!id) return { ok: false, error: "chamfer failed (no edges resolved)" };
      return { ok: true, featureId: id, message: `Chamfered ${refs.length} edge(s) ${distance}` };
    },
  },
  {
    name: "add_shell",
    description:
      "Hollow the body to a wall thickness (mm), removing the given faces (open faces). Provide face refs from the geometry catalog.",
    inputSchema: {
      type: "object",
      properties: {
        faces: { type: "array" },
        thickness: { type: "number" },
      },
      required: ["faces", "thickness"],
      additionalProperties: false,
    },
    run(input, store) {
      const thickness = num(input, "thickness")!;
      if (thickness <= 0) return { ok: false, error: "thickness must be positive" };
      const refs = (input.faces as unknown[]).map(String);
      if (refs.length === 0) return { ok: false, error: "no faces given" };
      const cat = catalogGeometry(store.getState().shape);
      const resolved = resolveFaceRefs(cat, refs);
      if (!resolved.ok) return resolved;
      const id = store.getState().addShellFor(resolved.refs, thickness);
      if (!id) return { ok: false, error: "shell failed (no faces resolved)" };
      return { ok: true, featureId: id, message: `Shelled removing ${refs.length} face(s) t${thickness}` };
    },
  },
  {
    name: "add_draft",
    description:
      "Taper faces about a pull direction by an angle (degrees). Provide face refs from the catalog; direction is x/y/z.",
    inputSchema: {
      type: "object",
      properties: {
        faces: { type: "array" },
        angle: { type: "number" },
        direction: { type: "string", enum: [...AXIS_ENUM] },
      },
      required: ["faces", "angle"],
      additionalProperties: false,
    },
    run(input, store) {
      const angle = num(input, "angle")!;
      if (angle <= 0) return { ok: false, error: "angle must be positive" };
      const refs = (input.faces as unknown[]).map(String);
      if (refs.length === 0) return { ok: false, error: "no faces given" };
      const cat = catalogGeometry(store.getState().shape);
      const resolved = resolveFaceRefs(cat, refs);
      if (!resolved.ok) return resolved;
      const direction = str(input, "direction") as "x" | "y" | "z" | undefined;
      const id = store.getState().addDraftFor(resolved.refs, direction, angle);
      if (!id) return { ok: false, error: "draft failed (no faces resolved)" };
      return { ok: true, featureId: id, message: `Drafted ${refs.length} face(s) ${angle}°` };
    },
  },
  {
    name: "add_hole",
    description:
      "Drill a hole into the body on a base plane at (x,y). type simple/counterbore/countersink; diameter/depth in mm.",
    inputSchema: {
      type: "object",
      properties: {
        plane: { type: "string", enum: [...PLANE_ENUM] },
        x: { type: "number" },
        y: { type: "number" },
        diameter: { type: "number" },
        depth: { type: "number" },
        holeType: {
          type: "string",
          enum: ["simple", "counterbore", "countersink"],
        },
      },
      required: ["diameter", "depth"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!hasBody(store)) return { ok: false, error: "no body to drill into; add a solid first" };
      const diameter = num(input, "diameter")!, depth = num(input, "depth")!;
      if (diameter <= 0 || depth <= 0) return { ok: false, error: "diameter and depth must be positive" };
      store.getState().addHole();
      const f = lastFeature(store);
      if (f) {
        const p = f as { params: Record<string, unknown> };
        const params: Record<string, number> = { diameter, depth };
        const x = num(input, "x"), y = num(input, "y");
        if (x !== undefined) params.x = x;
        if (y !== undefined) params.y = y;
        store.getState().updateParams(f.id, params);
        const plane = str(input, "plane"), holeType = str(input, "holeType");
        const patch: Record<string, unknown> = { ...p.params, ...params };
        if (plane) patch.plane = plane;
        if (holeType) patch.holeType = holeType;
        store.getState().updateFeature(f.id, { params: patch } as never);
      }
      return { ok: true, featureId: f?.id, message: `Drilled ⌀${diameter}×${depth} hole` };
    },
  },
  {
    name: "add_mirror",
    description: "Mirror the whole body across a base plane (XY/XZ/YZ). keepOriginal keeps the source body.",
    inputSchema: {
      type: "object",
      properties: {
        plane: { type: "string", enum: [...PLANE_ENUM] },
        keepOriginal: { type: "boolean" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      if (!hasBody(store)) return { ok: false, error: "no body to mirror" };
      store.getState().addMirror();
      const f = lastFeature(store);
      if (f) {
        const p = (f as { params: Record<string, unknown> }).params;
        const patch: Record<string, unknown> = { ...p };
        const plane = str(input, "plane");
        if (plane) patch.plane = plane;
        if (typeof input.keepOriginal === "boolean") patch.keepOriginal = input.keepOriginal;
        store.getState().updateFeature(f.id, { params: patch } as never);
      }
      return { ok: true, featureId: f?.id, message: `Mirrored body` };
    },
  },
  {
    name: "add_linear_pattern",
    description: "Linear pattern the body along an axis (x/y/z). count total copies, spacing in mm.",
    inputSchema: {
      type: "object",
      properties: {
        axis: { type: "string", enum: [...AXIS_ENUM] },
        count: { type: "integer" },
        spacing: { type: "number" },
      },
      required: ["count", "spacing"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!hasBody(store)) return { ok: false, error: "no body to pattern" };
      const count = num(input, "count")!, spacing = num(input, "spacing")!;
      if (count < 2) return { ok: false, error: "count must be >= 2" };
      store.getState().addLinearPattern();
      const f = lastFeature(store);
      if (f) {
        const p = (f as { params: Record<string, unknown> }).params;
        const patch: Record<string, unknown> = { ...p, count: Math.round(count), spacing };
        const axis = str(input, "axis");
        if (axis) patch.axis = axis;
        store.getState().updateFeature(f.id, { params: patch } as never);
      }
      return { ok: true, featureId: f?.id, message: `Linear pattern ×${count}` };
    },
  },
  {
    name: "add_circular_pattern",
    description: "Circular pattern the body about an axis (x/y/z). count copies over angle degrees (default 360).",
    inputSchema: {
      type: "object",
      properties: {
        axis: { type: "string", enum: [...AXIS_ENUM] },
        count: { type: "integer" },
        angle: { type: "number" },
      },
      required: ["count"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!hasBody(store)) return { ok: false, error: "no body to pattern" };
      const count = num(input, "count")!;
      if (count < 2) return { ok: false, error: "count must be >= 2" };
      store.getState().addCircularPattern();
      const f = lastFeature(store);
      if (f) {
        const p = (f as { params: Record<string, unknown> }).params;
        const patch: Record<string, unknown> = { ...p, count: Math.round(count) };
        const angle = num(input, "angle");
        if (angle !== undefined) patch.angle = angle;
        const axis = str(input, "axis");
        if (axis) patch.axis = axis;
        store.getState().updateFeature(f.id, { params: patch } as never);
      }
      return { ok: true, featureId: f?.id, message: `Circular pattern ×${count}` };
    },
  },
  {
    name: "update_params",
    description:
      "Change numeric/boolean parameters of an existing feature. Reference the feature by id (from the feature list). params is an object of the fields to change (e.g. {distance: 30}).",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string", description: "feature id" },
        params: { type: "object" },
      },
      required: ["feature", "params"],
      additionalProperties: false,
    },
    run(input, store) {
      const id = str(input, "feature")!;
      const f = store.getState().tree.features.find((x) => x.id === id);
      if (!f) return { ok: false, error: `no feature with id "${id}"` };
      const params = input.params as Record<string, number | boolean>;
      store.getState().updateParams(id, params);
      return { ok: true, featureId: id, message: `Updated ${f.name}` };
    },
  },
  {
    name: "delete_feature",
    description: "Delete a feature by id (from the feature list).",
    inputSchema: {
      type: "object",
      properties: { feature: { type: "string" } },
      required: ["feature"],
      additionalProperties: false,
    },
    run(input, store) {
      const id = str(input, "feature")!;
      const f = store.getState().tree.features.find((x) => x.id === id);
      if (!f) return { ok: false, error: `no feature with id "${id}"` };
      store.getState().deleteFeature(id);
      return { ok: true, message: `Deleted ${f.name}` };
    },
  },
  {
    name: "add_link",
    description:
      "Robot: add a Link referencing a Part Studio tab's body. Requires an active robot tab. sourceTab is the Part Studio tab id.",
    inputSchema: {
      type: "object",
      properties: {
        sourceTab: { type: "string", description: "Part Studio tab id" },
        name: { type: "string" },
      },
      required: ["sourceTab"],
      additionalProperties: false,
    },
    run(input, store) {
      if (store.getState().activeRobotId === null) {
        return { ok: false, error: "no active robot tab; open or create a robot first" };
      }
      const sourceTab = str(input, "sourceTab")!;
      const tab = store.getState().doc.tabs.find((t) => t.id === sourceTab);
      if (!tab) {
        return {
          ok: false,
          error: `no Part Studio tab "${sourceTab}". Available: ${store.getState().doc.tabs.map((t) => `${t.name} (id ${t.id})`).join(", ")}`,
        };
      }
      store.getState().addLink(sourceTab, str(input, "name") ?? `${tab.name} link`);
      return { ok: true, message: `Added link from ${tab.name}` };
    },
  },
  {
    name: "add_joint",
    description:
      "Robot: add a Joint between two links (parent → child). Requires an active robot tab. Reference links by their link id.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["revolute", "continuous", "prismatic", "fixed", "floating", "planar"],
        },
        parent: { type: "string", description: "parent link id" },
        child: { type: "string", description: "child link id" },
      },
      required: ["type", "parent", "child"],
      additionalProperties: false,
    },
    run(input, store) {
      if (store.getState().activeRobotId === null) {
        return { ok: false, error: "no active robot tab" };
      }
      const robot = store.getState().doc.robots.find((r) => r.id === store.getState().activeRobotId);
      const parent = str(input, "parent")!, child = str(input, "child")!;
      const links = robot?.links ?? [];
      const has = (id: string) => links.some((l) => l.id === id);
      if (!has(parent) || !has(child)) {
        return {
          ok: false,
          error: `parent/child must be link ids. Available links: ${links.map((l) => `${l.name} (id ${l.id})`).join(", ") || "(none)"}`,
        };
      }
      if (parent === child) return { ok: false, error: "parent and child must differ" };
      store.getState().addJoint(str(input, "type") as JointType, parent, child);
      return { ok: true, message: `Added ${str(input, "type")} joint` };
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers used by commands
// ---------------------------------------------------------------------------

/** The most recently added feature (add actions append + select it). */
function lastFeature(store: StoreHandle) {
  const feats = store.getState().tree.features;
  return feats.length > 0 ? feats[feats.length - 1] : null;
}

/** True if the tree has at least one non-suppressed solid (a body exists). */
function hasBody(store: StoreHandle): boolean {
  return store
    .getState()
    .tree.features.some((f) => f.type !== "sketch" && !f.suppressed);
}

// ---------------------------------------------------------------------------
// Registry API
// ---------------------------------------------------------------------------

export const COMMANDS: Command[] = commands;

const byName = new Map(commands.map((c) => [c.name, c]));

export function getCommand(name: string): Command | undefined {
  return byName.get(name);
}

/**
 * The "clarify" tool the model uses instead of a command when the instruction
 * is underspecified. Not a mutating command — the loop handles it specially.
 */
export const CLARIFY_TOOL = {
  name: "clarify",
  description:
    "Ask the user a clarifying question instead of making a change, when the instruction is ambiguous or missing required detail. Do NOT guess when a dimension or target is unspecified in a way that materially changes the result.",
  inputSchema: {
    type: "object",
    properties: {
      question: { type: "string", description: "the question to ask the user" },
    },
    required: ["question"],
    additionalProperties: false,
  } as JSONSchema,
};

/** Anthropic tool definitions for all commands + clarify. */
export function toolDefinitions() {
  return [
    ...commands.map((c) => ({
      name: c.name,
      description: c.description,
      input_schema: c.inputSchema,
    })),
    {
      name: CLARIFY_TOOL.name,
      description: CLARIFY_TOOL.description,
      input_schema: CLARIFY_TOOL.inputSchema,
    },
  ];
}

/**
 * Validate + run a command by name against the store. Unknown name or invalid
 * input returns {ok:false} with an LLM-actionable message (never throws).
 */
export function dispatch(
  name: string,
  input: unknown,
  store: StoreHandle,
): CommandResult {
  const cmd = byName.get(name);
  if (!cmd) return { ok: false, error: `unknown command "${name}"` };
  const inputObj =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const schemaErr = validateInput(inputObj, cmd.inputSchema);
  if (schemaErr) return { ok: false, error: schemaErr };
  try {
    return cmd.run(inputObj, store);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
