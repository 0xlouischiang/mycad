/**
 * Plant workspace: line list and spec context on the left, plan routing over
 * the 3D preview in the center, and the plant chat alongside.
 */
import { useState } from "react";
import { useStore } from "../store";
import { ChatPanel } from "../ui/ChatPanel";
import { plantLoopConfig } from "../commands/plantLoop";
import { PlantPlan } from "./PlantPlan";
import { PlantPreview } from "./PlantPreview";
import { billOfMaterials, checkConnectivity, isometric } from "../model/plant";

export function PlantView() {
  const doc = useStore((s) => s.doc);
  const activePlantId = useStore((s) => s.activePlantId);
  const createLine = useStore((s) => s.createLine);
  const setPlantContext = useStore((s) => s.setPlantContext);
  const changePlantSpec = useStore((s) => s.changePlantSpec);
  const deletePlantComponent = useStore((s) => s.deletePlantComponent);
  const deletePlantEquipment = useStore((s) => s.deletePlantEquipment);
  const plant = doc.plants.find((p) => p.id === activePlantId) ?? null;
  const [report, setReport] = useState<string | null>(null);

  if (!plant) return null;
  const spec = plant.specs.find((s) => s.id === plant.context.activeSpecId) ?? plant.specs[0];
  const line = plant.lines.find((l) => l.id === plant.context.activeLineId) ?? null;

  function showBom() {
    if (!line) return;
    const rows = billOfMaterials(plant!, line.id);
    if ("error" in rows) return;
    setReport(
      rows
        .map((r) =>
          r.kind === "straight"
            ? `${r.kind} DN${r.nps}: ${Math.round(r.length)} mm`
            : `${r.kind} DN${r.nps}: ${r.count}`,
        )
        .join("\n") || "(empty line)",
    );
  }

  function showConnectivity() {
    if (!line) return;
    const issues = checkConnectivity(line);
    setReport(issues.length === 0 ? "No connectivity issues." : issues.map((i) => i.message).join("\n"));
  }

  function showIso() {
    if (!line) return;
    const iso = isometric(line);
    setReport(iso.svg);
  }

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-80 flex-col overflow-y-auto border-r border-neutral-800 bg-neutral-900">
        <header className="border-b border-neutral-800 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight text-orange-200">🔧 {plant.name}</h1>
          <p className="text-xs text-neutral-500">Spec-driven piping</p>
        </header>

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Context</h2>
          <label className="flex items-center justify-between text-xs text-neutral-300">
            Spec
            <select
              value={spec?.id ?? ""}
              onChange={(e) => setPlantContext({ activeSpecId: e.target.value })}
              className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              {plant.specs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="mt-1 flex items-center justify-between text-xs text-neutral-300">
            Size
            <select
              value={plant.context.activeNps ?? spec?.nps[0] ?? ""}
              onChange={(e) => setPlantContext({ activeNps: Number(e.target.value) })}
              className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              {spec?.nps.map((n) => (
                <option key={n} value={n}>DN{n}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="border-b border-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Lines</h2>
            <button
              type="button"
              onClick={() => createLine(`Line ${plant.lines.length + 1}`)}
              className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
            >
              + Line
            </button>
          </div>
          {plant.lines.map((l) => (
            <div
              key={l.id}
              onClick={() => setPlantContext({ activeLineId: l.id, activeSpecId: l.specId, activeNps: l.nps })}
              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs ${
                l.id === line?.id ? "bg-orange-800/40 text-orange-100" : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <span className="flex-1 truncate">{l.name}</span>
              <span className="text-neutral-500">DN{l.nps}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlantComponent(l.id);
                }}
                className="text-neutral-600 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
          {line && (
            <div className="mt-2 flex flex-col gap-1">
              <label className="flex items-center justify-between text-xs text-neutral-300">
                Change size
                <select
                  value={line.nps}
                  onChange={(e) => changePlantSpec(line.id, line.specId, Number(e.target.value))}
                  className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
                >
                  {spec?.nps.map((n) => (
                    <option key={n} value={n}>DN{n}</option>
                  ))}
                </select>
              </label>
              {line.warnings.length > 0 && (
                <p className="whitespace-pre-wrap text-[11px] text-amber-400">{line.warnings.join("\n")}</p>
              )}
              <div className="flex gap-1">
                <button type="button" onClick={showConnectivity} className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700">Connectivity</button>
                <button type="button" onClick={showBom} className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700">BOM</button>
                <button type="button" onClick={showIso} className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700">Iso</button>
              </div>
            </div>
          )}
        </section>

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Equipment</h2>
          {plant.equipment.map((e) => (
            <div key={e.id} className="flex items-center gap-2 px-2 py-1 text-xs text-neutral-300">
              <span className="flex-1 truncate">{e.name}</span>
              <span className="text-neutral-500">{e.nozzles.length} nozzles</span>
              <button
                type="button"
                onClick={() => deletePlantEquipment(e.id)}
                className="text-neutral-600 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
          {plant.equipment.length === 0 && <p className="text-[11px] text-neutral-600">None yet.</p>}
        </section>

        {report && (
          <section className="border-b border-neutral-800 p-3">
            {report.startsWith("<svg") ? (
              <div className="overflow-hidden rounded" dangerouslySetInnerHTML={{ __html: report }} />
            ) : (
              <pre className="whitespace-pre-wrap text-[11px] text-neutral-300">{report}</pre>
            )}
          </section>
        )}

        <ChatPanel config={plantLoopConfig} placeholder="Route 6 m DN100 along X, then 3 m along Y" />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="h-1/2 border-b border-neutral-800">
          <PlantPlan plant={plant} />
        </div>
        <div className="h-1/2">
          <PlantPreview />
        </div>
      </main>
    </div>
  );
}
