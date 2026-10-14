/**
 * Plant command registry — the natural-language piping tool set.
 *
 * Same Command / validateInput machinery as the BIM registry; only the commands
 * and the store actions they call differ. A fitting the spec does not allow is
 * rejected by the store action, so the model hears the same error a manual
 * placement would produce.
 */
import type { StoreHandle, Command, CommandResult, JSONSchema } from "./registry";
import { validateInput } from "./registry";
import type { EndPrep, EquipmentKind, PlantTab, SupportKind, Vec3 } from "../model/plant";

function activePlant(store: StoreHandle): PlantTab | null {
  const s = store.getState();
  return s.doc.plants.find((p) => p.id === s.activePlantId) ?? null;
}

function num(input: Record<string, unknown>, key: string): number | undefined {
  const v = input[key];
  return typeof v === "number" ? v : undefined;
}
function str(input: Record<string, unknown>, key: string): string | undefined {
  const v = input[key];
  return typeof v === "string" ? v : undefined;
}
function vec(input: Record<string, unknown>, key: string): Vec3 | undefined {
  const v = input[key] as { x?: number; y?: number; z?: number } | undefined;
  if (v && typeof v.x === "number" && typeof v.y === "number") {
    return { x: v.x, y: v.y, z: typeof v.z === "number" ? v.z : 0 };
  }
  return undefined;
}

const POINT = {
  type: "object",
  properties: { x: { type: "number" }, y: { type: "number" }, z: { type: "number" } },
  required: ["x", "y"],
};

const commands: Command[] = [
  {
    name: "create_line",
    description:
      "Create a pipeline. It inherits the active spec and nominal size. service and unit are labels (optional).",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" }, service: { type: "string" }, unit: { type: "string" } },
      required: ["name"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activePlant(store)) return { ok: false, error: "no active plant tab" };
      const id = store.getState().createLine(str(input, "name")!, str(input, "service"), str(input, "unit"));
      return id
        ? { ok: true, featureId: id, message: `Created line ${str(input, "name")}` }
        : { ok: false, error: "failed to create line; check the active spec and size" };
    },
  },
  {
    name: "set_context",
    description:
      "Set the active line, spec, or nominal size (mm) used by the next route. Size must exist in the spec.",
    inputSchema: {
      type: "object",
      properties: {
        lineId: { type: "string" },
        specId: { type: "string" },
        nps: { type: "number" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      const plant = activePlant(store);
      if (!plant) return { ok: false, error: "no active plant tab" };
      const nps = num(input, "nps");
      const specId = str(input, "specId") ?? plant.context.activeSpecId ?? undefined;
      const spec = plant.specs.find((s) => s.id === specId);
      if (nps !== undefined && spec && !spec.nps.includes(nps)) {
        return { ok: false, error: `DN${nps} is not in spec "${spec.name}". Available: ${spec.nps.join(", ")}` };
      }
      const lineId = str(input, "lineId");
      if (lineId && !plant.lines.some((l) => l.id === lineId)) {
        return { ok: false, error: `no line "${lineId}"` };
      }
      store.getState().setPlantContext({
        ...(lineId ? { activeLineId: lineId } : {}),
        ...(specId ? { activeSpecId: specId } : {}),
        ...(nps !== undefined ? { activeNps: nps } : {}),
      });
      // The active line is what the next route builds on, so a size or spec change
      // has to land on it — not just on the context the next new line would inherit.
      const target = lineId ?? plant.context.activeLineId;
      if (target && (nps !== undefined || specId)) {
        const current = plant.lines.find((l) => l.id === target);
        const nextSpec = specId ?? current?.specId;
        const nextNps = nps ?? current?.nps;
        if (current && nextSpec && nextNps !== undefined && (current.specId !== nextSpec || current.nps !== nextNps)) {
          const changed = store.getState().changePlantSpec(target, nextSpec, nextNps);
          if ("error" in changed) return { ok: false, error: changed.error };
        }
      }
      return { ok: true, message: "context updated" };
    },
  },
  {
    name: "route_run",
    description:
      "Route a polyline (points in mm) on a line. Collinear points merge; a corner inserts an elbow from the spec; a point on the middle of a straight inserts a tee. Rejected if a fitting is not in the spec. lineId defaults to the active line.",
    inputSchema: {
      type: "object",
      properties: {
        points: { type: "array" },
        lineId: { type: "string" },
        endPrep: { type: "string", enum: ["buttWeld", "flanged"] },
      },
      required: ["points"],
      additionalProperties: false,
    },
    run(input, store) {
      const plant = activePlant(store);
      if (!plant) return { ok: false, error: "no active plant tab" };
      const raw = input.points as { x?: number; y?: number; z?: number }[];
      if (!Array.isArray(raw) || raw.length < 2) return { ok: false, error: "points needs at least two {x,y,z} points" };
      const points: Vec3[] = raw.map((p) => ({ x: Number(p.x), y: Number(p.y), z: Number(p.z ?? 0) }));
      if (points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) {
        return { ok: false, error: "points must be numeric {x,y,z}" };
      }
      const endPrep = str(input, "endPrep") as EndPrep | undefined;
      const result = store.getState().routeLine(points, str(input, "lineId"), { endPrep, joinExisting: true });
      if (!result.ok) return { ok: false, error: result.error ?? "route rejected" };
      const warn = result.warnings.length > 0 ? ` Warnings: ${result.warnings.join("; ")}` : "";
      return { ok: true, message: `Routed ${points.length} points.${warn}` };
    },
  },
  {
    name: "place_equipment",
    description:
      "Place parametric equipment at an origin (mm). kind is vessel, tank, pump, exchanger, or custom. custom has no datums, so it only accepts a freeform nozzle.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        kind: { type: "string", enum: ["vessel", "tank", "pump", "exchanger", "custom"] },
        origin: POINT,
        diameter: { type: "number" },
        length: { type: "number" },
      },
      required: ["name", "kind", "origin"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activePlant(store)) return { ok: false, error: "no active plant tab" };
      const origin = vec(input, "origin");
      if (!origin) return { ok: false, error: "origin must be an {x,y,z} point" };
      const id = store.getState().placeEquipment(
        str(input, "name")!,
        str(input, "kind") as EquipmentKind,
        origin,
        num(input, "diameter"),
        num(input, "length"),
      );
      return id ? { ok: true, featureId: id, message: `Placed ${str(input, "kind")}` } : { ok: false, error: "failed to place equipment" };
    },
  },
  {
    name: "place_nozzle",
    description:
      "Add a nozzle to equipment. Give datumId to hang it on a datum, or omit it for a freeform nozzle whose direction is the normal of the face it sits on. nps is the nominal size in mm.",
    inputSchema: {
      type: "object",
      properties: {
        equipmentId: { type: "string" },
        datumId: { type: "string" },
        direction: POINT,
        nps: { type: "number" },
        facing: { type: "string", enum: ["buttWeld", "flanged"] },
        lineId: { type: "string" },
      },
      required: ["equipmentId", "direction", "nps"],
      additionalProperties: false,
    },
    run(input, store) {
      const plant = activePlant(store);
      if (!plant) return { ok: false, error: "no active plant tab" };
      const equipmentId = str(input, "equipmentId")!;
      const equipment = plant.equipment.find((e) => e.id === equipmentId);
      if (!equipment) return { ok: false, error: `no equipment "${equipmentId}"` };
      const direction = vec(input, "direction");
      if (!direction) return { ok: false, error: "direction must be an {x,y,z} vector" };
      const datumId = str(input, "datumId");
      if (!datumId && equipment.datums.length > 0) {
        return {
          ok: false,
          error: `equipment has datums (${equipment.datums.map((d) => `${d.name} id=${d.id}`).join(", ")}); pass datumId or use custom equipment for a freeform nozzle`,
        };
      }
      const id = store.getState().placeNozzle(equipmentId, {
        datumId: datumId ?? null,
        direction,
        nps: num(input, "nps")!,
        facing: str(input, "facing") as EndPrep | undefined,
        lineId: str(input, "lineId") ?? null,
      });
      return id ? { ok: true, featureId: id, message: "Placed nozzle" } : { ok: false, error: "nozzle rejected; check the datum" };
    },
  },
  {
    name: "place_support",
    description: "Place an anchor, guide, or hanger on a straight segment. t is 0..1 along the segment.",
    inputSchema: {
      type: "object",
      properties: {
        segmentId: { type: "string" },
        t: { type: "number" },
        kind: { type: "string", enum: ["anchor", "guide", "hanger"] },
      },
      required: ["segmentId", "kind"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activePlant(store)) return { ok: false, error: "no active plant tab" };
      const id = store.getState().placePlantSupport(
        str(input, "segmentId")!,
        num(input, "t") ?? 0.5,
        str(input, "kind") as SupportKind,
      );
      return id
        ? { ok: true, featureId: id, message: "Placed support" }
        : { ok: false, error: "support rejected; the host must be a straight segment" };
    },
  },
  {
    name: "change_spec",
    description:
      "Change a line's spec and nominal size. Components the new spec allows are replaced; the rest stay and are flagged. Nothing is deleted.",
    inputSchema: {
      type: "object",
      properties: { lineId: { type: "string" }, specId: { type: "string" }, nps: { type: "number" } },
      required: ["lineId", "specId", "nps"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activePlant(store)) return { ok: false, error: "no active plant tab" };
      const result = store.getState().changePlantSpec(str(input, "lineId")!, str(input, "specId")!, num(input, "nps")!);
      if ("error" in result) return { ok: false, error: result.error };
      const warn = result.warned.length > 0 ? ` Kept with warnings: ${result.warned.join("; ")}` : "";
      return { ok: true, message: `Replaced ${result.replaced} components.${warn}` };
    },
  },
  {
    name: "check_connectivity",
    description: "List open ports and size or direction conflicts on a line.",
    inputSchema: {
      type: "object",
      properties: { lineId: { type: "string" } },
      required: ["lineId"],
      additionalProperties: false,
    },
    run(input, store) {
      const result = store.getState().plantConnectivity(str(input, "lineId")!);
      if ("error" in result) return { ok: false, error: result.error };
      if (result.length === 0) return { ok: true, message: "no connectivity issues" };
      return { ok: true, message: result.map((i) => i.message).join("; ") };
    },
  },
  {
    name: "bom",
    description:
      "Bill of materials for a line. Straight pipe is totaled by length (mm); every other component is counted per piece.",
    inputSchema: {
      type: "object",
      properties: { lineId: { type: "string" } },
      required: ["lineId"],
      additionalProperties: false,
    },
    run(input, store) {
      const result = store.getState().plantBom(str(input, "lineId")!);
      if ("error" in result) return { ok: false, error: result.error };
      const text = result
        .map((r) => (r.kind === "straight" ? `${r.kind} DN${r.nps}: ${Math.round(r.length)} mm` : `${r.kind} DN${r.nps}: ${r.count}`))
        .join("; ");
      return { ok: true, message: text || "(empty line)" };
    },
  },
  {
    name: "delete_component",
    description: "Delete a line or a single component by id. Deleting equipment also deletes its nozzles.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
      additionalProperties: false,
    },
    run(input, store) {
      const plant = activePlant(store);
      if (!plant) return { ok: false, error: "no active plant tab" };
      const id = str(input, "id")!;
      if (plant.equipment.some((e) => e.id === id)) {
        store.getState().deletePlantEquipment(id);
        return { ok: true, message: "Deleted equipment and its nozzles" };
      }
      const known =
        plant.lines.some((l) => l.id === id) || plant.lines.some((l) => l.runs.some((r) => r.id === id));
      if (!known) return { ok: false, error: `nothing with id "${id}"` };
      store.getState().deletePlantComponent(id);
      return { ok: true, message: "Deleted" };
    },
  },
];

const byName = new Map(commands.map((c) => [c.name, c]));

export const PLANT_CLARIFY_TOOL = {
  name: "clarify",
  description:
    "Ask the user a clarifying question instead of guessing, when the instruction is missing a line, a size, or a direction that changes the result.",
  inputSchema: {
    type: "object",
    properties: { question: { type: "string" } },
    required: ["question"],
    additionalProperties: false,
  } as JSONSchema,
};

export function plantToolDefinitions() {
  return [
    ...commands.map((c) => ({ name: c.name, description: c.description, input_schema: c.inputSchema })),
    { name: PLANT_CLARIFY_TOOL.name, description: PLANT_CLARIFY_TOOL.description, input_schema: PLANT_CLARIFY_TOOL.inputSchema },
  ];
}

export function plantDispatch(name: string, input: unknown, store: StoreHandle): CommandResult {
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

export const PLANT_COMMANDS = commands;
