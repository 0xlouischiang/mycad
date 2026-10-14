/**
 * Bounded plant context for the natural-language loop.
 *
 * Lists the active line's components (capped) with their port coordinates, plus
 * a one-line summary of the active spec. The full spec table is not included;
 * the model asks for a fitting and the tool rejects it if the spec disagrees.
 */
import type { StoreHandle } from "./registry";
import type { PlantTab, RunSegment } from "../model/plant";
import { openPorts } from "../model/plant";

const MAX_COMPONENTS = 60;

function active(store: StoreHandle): PlantTab | null {
  const s = store.getState();
  return s.doc.plants.find((p) => p.id === s.activePlantId) ?? null;
}

function describe(seg: RunSegment): string {
  const ports = seg.ports
    .map((p) => `${p.role}@(${Math.round(p.position.x)},${Math.round(p.position.y)},${Math.round(p.position.z)})${p.connectedTo ? "" : " OPEN"}`)
    .join(" ");
  return `${seg.kind} id=${seg.id} DN${seg.nps} ${seg.endPrep} ${ports}${seg.warning ? " WARNING:" + seg.warning : ""}`;
}

export function buildPlantStateBlock(store: StoreHandle): string {
  const plant = active(store);
  if (!plant) return "No active plant tab.";
  const spec = plant.specs.find((s) => s.id === plant.context.activeSpecId) ?? plant.specs[0];
  const line = plant.lines.find((l) => l.id === plant.context.activeLineId) ?? null;

  const specText = spec
    ? `${spec.name} (id=${spec.id}); sizes DN${spec.nps.join(", DN")}; end preps ${spec.endPreps.join(", ")}`
    : "(no spec)";

  const linesText =
    plant.lines.map((l) => `id=${l.id} "${l.name}" DN${l.nps} spec=${l.specId}${l.id === line?.id ? " (ACTIVE)" : ""}`).join("\n") ||
    "(no lines yet — create one before routing)";

  const shown = (line?.runs ?? []).slice(0, MAX_COMPONENTS);
  const compText = shown.map(describe).join("\n") || "(nothing routed yet)";
  const hidden = (line?.runs.length ?? 0) - shown.length;
  const truncated = hidden > 0 ? `\n… (${hidden} more components omitted)` : "";

  const equipmentText =
    plant.equipment
      .map((e) => {
        const datums = e.datums.map((d) => `${d.name} id=${d.id}`).join(", ") || "none (freeform nozzles only)";
        return `${e.kind} id=${e.id} "${e.name}" at(${e.origin.x},${e.origin.y},${e.origin.z}) datums: ${datums}; nozzles: ${e.nozzles.length}`;
      })
      .join("\n") || "(no equipment)";

  const open = line ? openPorts(line).length : 0;

  return (
    `ACTIVE SPEC: ${specText}\nACTIVE SIZE: DN${plant.context.activeNps ?? "?"}\n\n` +
    `LINES:\n${linesText}\n\n` +
    `ACTIVE LINE COMPONENTS:\n${compText}${truncated}\n` +
    `Open ports on the active line: ${open}\n\n` +
    `EQUIPMENT:\n${equipmentText}`
  );
}
