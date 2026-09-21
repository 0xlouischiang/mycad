/**
 * CFD command registry — natural-language tool set for an active CFD tab.
 *
 * Reuses Command / JSONSchema / validateInput from registry.ts. Each run()
 * calls the same store actions the sidebar uses.
 */
import type { StoreHandle, Command, CommandResult, JSONSchema } from "./registry";
import { validateInput } from "./registry";
import {
  FLUID_AIR,
  FLUID_WATER,
  type CFDTab,
  type PatchType,
  type TurbulenceModel,
  type FlowRegime,
  type FlowType,
  type FlowDirection,
} from "../model/cfd";

function activeCfd(store: StoreHandle): CFDTab | null {
  const s = store.getState();
  return s.doc.cfds.find((c) => c.id === s.activeCfdId) ?? null;
}

function num(input: Record<string, unknown>, key: string): number | undefined {
  const v = input[key];
  return typeof v === "number" ? v : undefined;
}
function str(input: Record<string, unknown>, key: string): string | undefined {
  const v = input[key];
  return typeof v === "string" ? v : undefined;
}
function strs(input: Record<string, unknown>, key: string): string[] | undefined {
  const v = input[key];
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return undefined;
}
function vec3(input: Record<string, unknown>, key: string): [number, number, number] | undefined {
  const v = input[key];
  if (Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === "number")) {
    return v as [number, number, number];
  }
  return undefined;
}

const VEC3 = {
  type: "array",
  items: { type: "number" },
};

const commands: Command[] = [
  {
    name: "set_source_tab",
    description: "Point this CFD tab at a Part Studio tab (by id or name) whose body will be meshed.",
    inputSchema: {
      type: "object",
      properties: { tabId: { type: "string" } },
      required: ["tabId"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const ref = str(input, "tabId")!;
      const tab = store.getState().doc.tabs.find(
        (t) => t.id === ref || t.name.toLowerCase() === ref.toLowerCase(),
      );
      if (!tab) {
        const list = store.getState().doc.tabs.map((t) => `${t.name} (id ${t.id})`).join(", ");
        return { ok: false, error: `no Part Studio "${ref}". Tabs: ${list}` };
      }
      store.getState().updateCfd({ sourceTab: tab.id });
      return { ok: true, message: `Source set to ${tab.name}` };
    },
  },
  {
    name: "set_flow_type",
    description: "external = body in a far-field box; internal = flow through the solid (duct/pipe). flowDirection is the inlet axis for external (+X/+Y/+Z).",
    inputSchema: {
      type: "object",
      properties: {
        flowType: { type: "string", enum: ["external", "internal"] },
        flowDirection: { type: "string", enum: ["x", "y", "z"] },
      },
      required: ["flowType"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const patch: Partial<CFDTab> = { flowType: str(input, "flowType") as FlowType };
      const d = str(input, "flowDirection") as FlowDirection | undefined;
      if (d) patch.flowDirection = d;
      store.getState().updateCfd(patch);
      return { ok: true, message: `Flow type ${patch.flowType}` };
    },
  },
  {
    name: "set_fluid",
    description: "Set fluid to a preset (air, water) or custom density (kg/m³) and kinematic viscosity (m²/s).",
    inputSchema: {
      type: "object",
      properties: {
        preset: { type: "string", enum: ["air", "water"] },
        density: { type: "number" },
        kinematicViscosity: { type: "number" },
        name: { type: "string" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const preset = str(input, "preset");
      if (preset === "air") {
        store.getState().updateCfd({ fluid: { ...FLUID_AIR } });
        return { ok: true, message: "Fluid set to air" };
      }
      if (preset === "water") {
        store.getState().updateCfd({ fluid: { ...FLUID_WATER } });
        return { ok: true, message: "Fluid set to water" };
      }
      const density = num(input, "density");
      const nu = num(input, "kinematicViscosity");
      if (density === undefined || nu === undefined) {
        return { ok: false, error: "provide preset or both density and kinematicViscosity" };
      }
      store.getState().updateCfd({
        fluid: { name: str(input, "name") ?? "custom", density, kinematicViscosity: nu },
      });
      return { ok: true, message: `Fluid ρ=${density} ν=${nu}` };
    },
  },
  {
    name: "set_turbulence_model",
    description: "laminar, kEpsilon (k-ε), or kOmegaSST (k-ω SST).",
    inputSchema: {
      type: "object",
      properties: { model: { type: "string", enum: ["laminar", "kEpsilon", "kOmegaSST"] } },
      required: ["model"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const model = str(input, "model") as TurbulenceModel;
      store.getState().updateCfd({ turbulenceModel: model });
      return { ok: true, message: `Turbulence ${model}` };
    },
  },
  {
    name: "set_regime",
    description: "steadyIncompressible → simpleFoam; transientIncompressible → pimpleFoam.",
    inputSchema: {
      type: "object",
      properties: {
        regime: {
          type: "string",
          enum: ["steadyIncompressible", "transientIncompressible"],
        },
      },
      required: ["regime"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const regime = str(input, "regime") as FlowRegime;
      store.getState().updateCfd({ regime });
      return { ok: true, message: `Regime ${regime}` };
    },
  },
  {
    name: "auto_size_domain",
    description: "Auto domain from the source bbox. Margins are multiples of the characteristic length (longest bbox axis).",
    inputSchema: {
      type: "object",
      properties: {
        upstream: { type: "number" },
        downstream: { type: "number" },
        lateral: { type: "number" },
        vertical: { type: "number" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      const cfd = activeCfd(store);
      if (!cfd) return { ok: false, error: "no active CFD tab" };
      store.getState().updateCfd({
        domainBox: null,
        domainMargins: {
          upstream: num(input, "upstream") ?? cfd.domainMargins.upstream,
          downstream: num(input, "downstream") ?? cfd.domainMargins.downstream,
          lateral: num(input, "lateral") ?? cfd.domainMargins.lateral,
          vertical: num(input, "vertical") ?? cfd.domainMargins.vertical,
        },
      });
      return { ok: true, message: "Domain set to auto-size" };
    },
  },
  {
    name: "set_domain_box",
    description: "Manual domain box in millimetres (must enclose the model for external flow).",
    inputSchema: {
      type: "object",
      properties: { min: VEC3, max: VEC3 },
      required: ["min", "max"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const min = vec3(input, "min");
      const max = vec3(input, "max");
      if (!min || !max) return { ok: false, error: "min and max must be [x,y,z] millimetres" };
      store.getState().updateCfd({ domainBox: { min, max } });
      return { ok: true, message: "Domain box set" };
    },
  },
  {
    name: "tag_boundary",
    description:
      "Tag CAD faces (refs from the GEOMETRY CATALOG) as an OpenFOAM patch. inlet/movingWall/freestream take velocity [Ux,Uy,Uz] m/s; outlet takes gaugePressure Pa.",
    inputSchema: {
      type: "object",
      properties: {
        faceRefs: { type: "array", items: { type: "string" } },
        patchType: {
          type: "string",
          enum: ["inlet", "outlet", "wall", "movingWall", "symmetry", "freestream"],
        },
        name: { type: "string" },
        velocity: VEC3,
        gaugePressure: { type: "number" },
      },
      required: ["faceRefs", "patchType"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const faceRefs = strs(input, "faceRefs");
      if (!faceRefs || faceRefs.length === 0) return { ok: false, error: "faceRefs is required" };
      const id = store.getState().tagBoundary(faceRefs, str(input, "patchType") as PatchType, {
        name: str(input, "name"),
        velocity: vec3(input, "velocity"),
        gaugePressure: num(input, "gaugePressure"),
      });
      return id
        ? { ok: true, featureId: id, message: `Tagged ${faceRefs.length} face(s) as ${str(input, "patchType")}` }
        : { ok: false, error: "failed to tag faces" };
    },
  },
  {
    name: "untag_boundary",
    description: "Remove boundary tags from the given face refs.",
    inputSchema: {
      type: "object",
      properties: { faceRefs: { type: "array", items: { type: "string" } } },
      required: ["faceRefs"],
      additionalProperties: false,
    },
    run(input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      const faceRefs = strs(input, "faceRefs") ?? [];
      store.getState().untagBoundary(faceRefs);
      return { ok: true, message: `Untagged ${faceRefs.length} face(s)` };
    },
  },
  {
    name: "set_mesh_refinement",
    description: "baseCellSize is millimetres. surfaceRefinementLevels is [min,max] snappy hex levels. boundaryLayers is prism-layer count.",
    inputSchema: {
      type: "object",
      properties: {
        baseCellSize: { type: "number" },
        surfaceRefinementLevels: { type: "array", items: { type: "number" } },
        boundaryLayers: { type: "number" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      const cfd = activeCfd(store);
      if (!cfd) return { ok: false, error: "no active CFD tab" };
      const levels = input.surfaceRefinementLevels;
      const pair =
        Array.isArray(levels) && levels.length === 2 && levels.every((x) => typeof x === "number")
          ? ([levels[0], levels[1]] as [number, number])
          : cfd.meshSettings.surfaceRefinementLevels;
      store.getState().updateCfd({
        meshSettings: {
          baseCellSize: num(input, "baseCellSize") ?? cfd.meshSettings.baseCellSize,
          surfaceRefinementLevels: pair,
          boundaryLayers: num(input, "boundaryLayers") ?? cfd.meshSettings.boundaryLayers,
        },
      });
      return { ok: true, message: "Mesh settings updated" };
    },
  },
  {
    name: "set_solver_controls",
    description: "endTime / deltaT / writeInterval. For steady simpleFoam, deltaT=1 so endTime is iteration count.",
    inputSchema: {
      type: "object",
      properties: {
        endTime: { type: "number" },
        deltaT: { type: "number" },
        writeInterval: { type: "number" },
      },
      additionalProperties: false,
    },
    run(input, store) {
      const cfd = activeCfd(store);
      if (!cfd) return { ok: false, error: "no active CFD tab" };
      store.getState().updateCfd({
        solverControl: {
          endTime: num(input, "endTime") ?? cfd.solverControl.endTime,
          deltaT: num(input, "deltaT") ?? cfd.solverControl.deltaT,
          writeInterval: num(input, "writeInterval") ?? cfd.solverControl.writeInterval,
        },
      });
      return { ok: true, message: "Solver controls updated" };
    },
  },
  {
    name: "start_run",
    description: "Submit the generated OpenFOAM case to the local Docker runner.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run(_input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      void store.getState().startCfdRun();
      return { ok: true, message: "Run submitted" };
    },
  },
  {
    name: "cancel_run",
    description: "Cancel the in-flight OpenFOAM job.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run(_input, store) {
      if (!activeCfd(store)) return { ok: false, error: "no active CFD tab" };
      void store.getState().cancelCfdRun();
      return { ok: true, message: "Cancel requested" };
    },
  },
];

const byName = new Map(commands.map((c) => [c.name, c]));

export const CFD_CLARIFY_TOOL = {
  name: "clarify",
  description:
    "Ask the user a clarifying question instead of making a change, when the instruction is ambiguous (which face, what speed, internal vs external).",
  inputSchema: {
    type: "object",
    properties: { question: { type: "string" } },
    required: ["question"],
    additionalProperties: false,
  } as JSONSchema,
};

export function cfdToolDefinitions() {
  return [
    ...commands.map((c) => ({
      name: c.name,
      description: c.description,
      input_schema: c.inputSchema,
    })),
    {
      name: CFD_CLARIFY_TOOL.name,
      description: CFD_CLARIFY_TOOL.description,
      input_schema: CFD_CLARIFY_TOOL.inputSchema,
    },
  ];
}

export function cfdDispatch(
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

export const CFD_COMMANDS = commands;
