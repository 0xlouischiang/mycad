/**
 * BIM command registry (Phase 16) — the natural-language BIM tool set.
 *
 * Reuses the SAME Command / JSONSchema / validateInput machinery as the
 * mechanical registry (registry.ts); only the command set + the store actions
 * they call differ. Each run() validates then calls the BIM store actions, so
 * an LLM-issued BIM change is indistinguishable from a manual one (same actions
 * → same persistence/cascade). The loop (chatController.runTurn) drives this via
 * a BIM LoopConfig.
 */
import type { StoreHandle, Command, CommandResult, JSONSchema } from "./registry";
import { validateInput } from "./registry";
import {
  makeWall,
  makeSlab,
  makeColumn,
  makeBeam,
  makeDoor,
  makeWindow,
  makeSpace,
  type BIMTab,
  type Point2,
} from "../model/bim";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function activeBim(store: StoreHandle): BIMTab | null {
  const s = store.getState();
  return s.doc.bims.find((b) => b.id === s.activeBimId) ?? null;
}

/** Resolve a level ref (id, or default to first level) on the active tab. */
function resolveLevel(store: StoreHandle, ref?: string): { ok: true; id: string } | { ok: false; error: string } {
  const bim = activeBim(store);
  if (!bim) return { ok: false, error: "no active BIM tab" };
  if (ref) {
    const l = bim.levels.find((x) => x.id === ref || x.name.toLowerCase() === ref.toLowerCase());
    if (!l) return { ok: false, error: `no level "${ref}". Levels: ${bim.levels.map((x) => `${x.name} (id ${x.id})`).join(", ")}` };
    return { ok: true, id: l.id };
  }
  if (bim.levels.length === 0) return { ok: false, error: "no levels; create one first with create_level" };
  return { ok: true, id: bim.levels[0].id };
}

function num(input: Record<string, unknown>, key: string): number | undefined {
  const v = input[key];
  return typeof v === "number" ? v : undefined;
}
function str(input: Record<string, unknown>, key: string): string | undefined {
  const v = input[key];
  return typeof v === "string" ? v : undefined;
}
function pt(input: Record<string, unknown>, key: string): Point2 | undefined {
  const v = input[key] as { x?: number; y?: number } | undefined;
  if (v && typeof v.x === "number" && typeof v.y === "number") return { x: v.x, y: v.y };
  return undefined;
}

const POINT_SCHEMA = {
  type: "object",
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
};

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

const commands: Command[] = [
  {
    name: "create_level",
    description: "Add a storey/level. elevation is the floor's world Z (mm); height is the storey height (mm, default 3000).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        elevation: { type: "number" },
        height: { type: "number" },
      },
      required: ["name", "elevation"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeBim(store)) return { ok: false, error: "no active BIM tab" };
      const id = store.getState().addLevel(str(input, "name")!, num(input, "elevation")!, num(input, "height"));
      return id ? { ok: true, featureId: id, message: `Added level ${str(input, "name")}` } : { ok: false, error: "failed to add level" };
    },
  },
  {
    name: "create_grid_line",
    description: "Add an orthogonal plan grid line. kind 'x' = a line at world X=offset; 'y' = at world Y=offset (mm).",
    inputSchema: {
      type: "object",
      properties: {
        label: { type: "string" },
        kind: { type: "string", enum: ["x", "y"] },
        offset: { type: "number" },
      },
      required: ["label", "kind", "offset"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeBim(store)) return { ok: false, error: "no active BIM tab" };
      const id = store.getState().addGrid(str(input, "label")!, str(input, "kind") as "x" | "y", num(input, "offset")!);
      return id ? { ok: true, featureId: id, message: `Added grid ${str(input, "label")}` } : { ok: false, error: "failed to add grid" };
    },
  },
  {
    name: "create_wall",
    description: "Add a wall on a level from start to end (plan coords, mm). thickness/height in mm. levelId optional (defaults to first level).",
    inputSchema: {
      type: "object",
      properties: {
        start: POINT_SCHEMA,
        end: POINT_SCHEMA,
        thickness: { type: "number" },
        height: { type: "number" },
        levelId: { type: "string" },
      },
      required: ["start", "end"],
      additionalProperties: false,
    },
    run(input, store) {
      const level = resolveLevel(store, str(input, "levelId"));
      if (!level.ok) return level;
      const start = pt(input, "start"), end = pt(input, "end");
      if (!start || !end) return { ok: false, error: "start and end must be {x,y} points" };
      if (start.x === end.x && start.y === end.y) return { ok: false, error: "wall start and end coincide" };
      const wall = makeWall(level.id, start, end, num(input, "thickness"), num(input, "height"));
      const id = store.getState().addComponent(wall);
      return id ? { ok: true, featureId: id, message: `Added wall` } : { ok: false, error: "failed to add wall" };
    },
  },
  {
    name: "create_slab",
    description: "Add a floor slab from a plan boundary polygon (≥3 points, mm) on a level. thickness in mm.",
    inputSchema: {
      type: "object",
      properties: {
        boundary: { type: "array" },
        thickness: { type: "number" },
        levelId: { type: "string" },
      },
      required: ["boundary"],
      additionalProperties: false,
    },
    run(input, store) {
      const level = resolveLevel(store, str(input, "levelId"));
      if (!level.ok) return level;
      const raw = input.boundary as { x?: number; y?: number }[];
      if (!Array.isArray(raw) || raw.length < 3) return { ok: false, error: "boundary needs ≥3 {x,y} points" };
      const boundary = raw.map((p) => ({ x: Number(p.x), y: Number(p.y) }));
      if (boundary.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) return { ok: false, error: "boundary points must be numeric {x,y}" };
      const id = store.getState().addComponent(makeSlab(level.id, boundary, num(input, "thickness")));
      return id ? { ok: true, featureId: id, message: `Added slab` } : { ok: false, error: "failed to add slab" };
    },
  },
  {
    name: "create_column",
    description: "Add a column at a plan point (mm). width/depth/height in mm.",
    inputSchema: {
      type: "object",
      properties: {
        at: POINT_SCHEMA,
        width: { type: "number" },
        depth: { type: "number" },
        height: { type: "number" },
        levelId: { type: "string" },
      },
      required: ["at"],
      additionalProperties: false,
    },
    run(input, store) {
      const level = resolveLevel(store, str(input, "levelId"));
      if (!level.ok) return level;
      const at = pt(input, "at");
      if (!at) return { ok: false, error: "at must be an {x,y} point" };
      const id = store.getState().addComponent(makeColumn(level.id, at, num(input, "width"), num(input, "depth"), num(input, "height")));
      return id ? { ok: true, featureId: id, message: `Added column` } : { ok: false, error: "failed to add column" };
    },
  },
  {
    name: "create_beam",
    description: "Add a beam on a level from start to end (plan, mm). width/depth in mm.",
    inputSchema: {
      type: "object",
      properties: {
        start: POINT_SCHEMA,
        end: POINT_SCHEMA,
        width: { type: "number" },
        depth: { type: "number" },
        levelId: { type: "string" },
      },
      required: ["start", "end"],
      additionalProperties: false,
    },
    run(input, store) {
      const level = resolveLevel(store, str(input, "levelId"));
      if (!level.ok) return level;
      const start = pt(input, "start"), end = pt(input, "end");
      if (!start || !end) return { ok: false, error: "start and end must be {x,y} points" };
      const id = store.getState().addComponent(makeBeam(level.id, start, end, num(input, "width"), num(input, "depth")));
      return id ? { ok: true, featureId: id, message: `Added beam` } : { ok: false, error: "failed to add beam" };
    },
  },
  {
    name: "create_door_in_wall",
    description: "Add a door hosted in a wall (cuts an opening). Reference the wall by id. position is 0..1 along the wall; width/height/sill in mm.",
    inputSchema: {
      type: "object",
      properties: {
        wallId: { type: "string" },
        position: { type: "number" },
        width: { type: "number" },
        height: { type: "number" },
      },
      required: ["wallId"],
      additionalProperties: false,
    },
    run(input, store) {
      return addOpening(store, input, "door");
    },
  },
  {
    name: "create_window_in_wall",
    description: "Add a window hosted in a wall (cuts an opening). Reference the wall by id. position 0..1 along the wall; width/height/sill in mm.",
    inputSchema: {
      type: "object",
      properties: {
        wallId: { type: "string" },
        position: { type: "number" },
        width: { type: "number" },
        height: { type: "number" },
        sill: { type: "number" },
      },
      required: ["wallId"],
      additionalProperties: false,
    },
    run(input, store) {
      return addOpening(store, input, "window");
    },
  },
  {
    name: "create_space",
    description: "Add a room/space; its boundary is traced from a seed point inside the room. seed is a plan {x,y} within enclosing walls.",
    inputSchema: {
      type: "object",
      properties: {
        seed: POINT_SCHEMA,
        levelId: { type: "string" },
      },
      required: ["seed"],
      additionalProperties: false,
    },
    run(input, store) {
      const level = resolveLevel(store, str(input, "levelId"));
      if (!level.ok) return level;
      const seed = pt(input, "seed");
      if (!seed) return { ok: false, error: "seed must be an {x,y} point" };
      const id = store.getState().addComponent(makeSpace(level.id, seed));
      // Report if the space couldn't be traced (flagged by reconcile).
      const created = activeBim(store)?.components.find((c) => c.id === id);
      if (created && created.type === "space" && created.warning) {
        return { ok: true, featureId: id!, message: `Added space, but: ${created.warning}` };
      }
      return id ? { ok: true, featureId: id, message: `Added space` } : { ok: false, error: "failed to add space" };
    },
  },
  {
    name: "update_component",
    description: "Change parameters of an existing component by id. params is an object of fields to change (e.g. {thickness: 300}).",
    inputSchema: {
      type: "object",
      properties: {
        componentId: { type: "string" },
        params: { type: "object" },
      },
      required: ["componentId", "params"],
      additionalProperties: false,
    },
    run(input, store) {
      const bim = activeBim(store);
      if (!bim) return { ok: false, error: "no active BIM tab" };
      const id = str(input, "componentId")!;
      const comp = bim.components.find((c) => c.id === id);
      if (!comp) return { ok: false, error: `no component with id "${id}"` };
      store.getState().updateComponent(id, input.params as Record<string, unknown> as never);
      return { ok: true, featureId: id, message: `Updated ${comp.type}` };
    },
  },
  {
    name: "delete_component",
    description: "Delete a component by id (deleting a wall also removes its hosted openings).",
    inputSchema: {
      type: "object",
      properties: { componentId: { type: "string" } },
      required: ["componentId"],
      additionalProperties: false,
    },
    run(input, store) {
      const bim = activeBim(store);
      if (!bim) return { ok: false, error: "no active BIM tab" };
      const id = str(input, "componentId")!;
      const comp = bim.components.find((c) => c.id === id);
      if (!comp) return { ok: false, error: `no component with id "${id}"` };
      store.getState().deleteComponent(id);
      return { ok: true, message: `Deleted ${comp.type}` };
    },
  },
];

/** Shared door/window placement (validates host wall, then adds the opening). */
function addOpening(
  store: StoreHandle,
  input: Record<string, unknown>,
  kind: "door" | "window",
): CommandResult {
  const bim = activeBim(store);
  if (!bim) return { ok: false, error: "no active BIM tab" };
  const wallId = str(input, "wallId")!;
  const wall = bim.components.find((c) => c.id === wallId && c.type === "wall");
  if (!wall) {
    const walls = bim.components.filter((c) => c.type === "wall").map((c) => c.id);
    return { ok: false, error: `no wall "${wallId}". Walls: ${walls.join(", ") || "(none)"}` };
  }
  const position = num(input, "position") ?? 0.5;
  if (position < 0 || position > 1) return { ok: false, error: "position must be 0..1 along the wall" };
  const width = num(input, "width");
  const height = num(input, "height");
  const opening =
    kind === "door"
      ? makeDoor(wall.levelId, wallId, position, width, height)
      : makeWindow(wall.levelId, wallId, position, width, height, num(input, "sill"));
  const id = store.getState().addComponent(opening);
  // The cascade may flag it if it doesn't fit; report that back.
  const created = activeBim(store)?.components.find((c) => c.id === id);
  if (created && (created.type === "door" || created.type === "window") && created.warning) {
    return { ok: false, error: `opening doesn't fit: ${created.warning}` };
  }
  return id ? { ok: true, featureId: id, message: `Added ${kind} to wall` } : { ok: false, error: `failed to add ${kind}` };
}

// ---------------------------------------------------------------------------
// Registry API (mirrors registry.ts so the loop config can bind to it)
// ---------------------------------------------------------------------------

const byName = new Map(commands.map((c) => [c.name, c]));

export const BIM_CLARIFY_TOOL = {
  name: "clarify",
  description:
    "Ask the user a clarifying question instead of making a change, when the instruction is ambiguous or missing detail that materially changes the result (e.g. which wall, what dimension).",
  inputSchema: {
    type: "object",
    properties: { question: { type: "string" } },
    required: ["question"],
    additionalProperties: false,
  } as JSONSchema,
};

export function bimToolDefinitions() {
  return [
    ...commands.map((c) => ({ name: c.name, description: c.description, input_schema: c.inputSchema })),
    { name: BIM_CLARIFY_TOOL.name, description: BIM_CLARIFY_TOOL.description, input_schema: BIM_CLARIFY_TOOL.inputSchema },
  ];
}

export function bimDispatch(name: string, input: unknown, store: StoreHandle): CommandResult {
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

export const BIM_COMMANDS = commands;
