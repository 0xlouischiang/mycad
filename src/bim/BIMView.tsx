/**
 * BIM view (Phase 14): the workspace shown when a BIM tab is active. Layout:
 *   - left sidebar: level list (+ elevation/height editing), grid editor,
 *     and a component list with basic parameter editing;
 *   - center: plan view (2D authoring) over a 3D massing preview.
 */
import { useState } from "react";
import { useStore } from "../store";
import { PlanView } from "./PlanView";
import { BIMPreview } from "./BIMPreview";
import { ChatPanel } from "../ui/ChatPanel";
import { bimLoopConfig } from "../commands/bimLoop";
import type { BuildingComponent } from "../model/bim";

export function BIMView() {
  const doc = useStore((s) => s.doc);
  const activeBimId = useStore((s) => s.activeBimId);
  const addLevel = useStore((s) => s.addLevel);
  const updateLevel = useStore((s) => s.updateLevel);
  const deleteLevel = useStore((s) => s.deleteLevel);
  const addGrid = useStore((s) => s.addGrid);
  const updateGrid = useStore((s) => s.updateGrid);
  const deleteGrid = useStore((s) => s.deleteGrid);
  const updateComponent = useStore((s) => s.updateComponent);
  const deleteComponent = useStore((s) => s.deleteComponent);
  const exportBimIFC = useStore((s) => s.exportBimIFC);
  const importBimIFC = useStore((s) => s.importBimIFC);

  const bim = doc.bims.find((b) => b.id === activeBimId) ?? null;
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);

  if (!bim) return null;
  const levelId = activeLevelId && bim.levels.some((l) => l.id === activeLevelId)
    ? activeLevelId
    : (bim.levels[0]?.id ?? null);
  const levelComps = bim.components.filter((c) => c.levelId === levelId);

  return (
    <div className="flex min-h-0 flex-1">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col overflow-y-auto border-r border-neutral-800 bg-neutral-900">
        <header className="border-b border-neutral-800 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight text-emerald-200">🏛 {bim.name}</h1>
          <p className="mb-2 text-xs text-neutral-500">Building information model</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => void exportBimIFC()}
              className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
            >
              Export IFC
            </button>
            <label className="cursor-pointer rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700">
              Import IFC
              <input
                type="file"
                accept=".ifc"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const buf = new Uint8Array(await file.arrayBuffer());
                  void importBimIFC(buf, file.name.replace(/\.ifc$/i, "") || "Imported");
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </header>

        {/* Levels */}
        <section className="border-b border-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Levels</h2>
            <button
              type="button"
              onClick={() => {
                const top = Math.max(0, ...bim.levels.map((l) => l.elevation + l.height));
                addLevel(`Level ${bim.levels.length + 1}`, top);
              }}
              className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
            >
              + Level
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {bim.levels
              .slice()
              .sort((a, b) => b.elevation - a.elevation)
              .map((l) => (
                <div
                  key={l.id}
                  onClick={() => setActiveLevelId(l.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs ${
                    l.id === levelId ? "bg-emerald-800/40 text-emerald-100" : "hover:bg-neutral-800 text-neutral-300"
                  }`}
                >
                  <span className="flex-1 truncate">{l.name}</span>
                  <input
                    type="number"
                    value={l.elevation}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateLevel(l.id, { elevation: Number(e.target.value) })}
                    className="w-16 rounded border border-neutral-700 bg-neutral-800 px-1 text-right text-neutral-100 outline-none"
                    title="elevation (mm)"
                  />
                  {bim.levels.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteLevel(l.id); }}
                      className="text-neutral-600 hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Grids */}
        <section className="border-b border-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Grid lines</h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => addGrid(`X${bim.grids.filter((g) => g.kind === "x").length + 1}`, "x", 0)}
                className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
              >
                + X
              </button>
              <button
                type="button"
                onClick={() => addGrid(`Y${bim.grids.filter((g) => g.kind === "y").length + 1}`, "y", 0)}
                className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
              >
                + Y
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {bim.grids.map((g) => (
              <div key={g.id} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-neutral-400">{g.label}</span>
                <span className="text-neutral-500">{g.kind.toUpperCase()} =</span>
                <input
                  type="number"
                  value={g.offset}
                  onChange={(e) => updateGrid(g.id, { offset: Number(e.target.value) })}
                  className="w-20 rounded border border-neutral-700 bg-neutral-800 px-1 text-right text-neutral-100 outline-none"
                />
                <button type="button" onClick={() => deleteGrid(g.id)} className="text-neutral-600 hover:text-red-400">✕</button>
              </div>
            ))}
            {bim.grids.length === 0 && <p className="text-[11px] text-neutral-600">No grid lines yet.</p>}
          </div>
        </section>

        {/* Components on the active level */}
        <section className="p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Components ({levelComps.length})
          </h2>
          <div className="flex flex-col gap-1">
            {levelComps.map((c) => (
              <ComponentRow
                key={c.id}
                component={c}
                onPatch={(patch) => updateComponent(c.id, patch)}
                onDelete={() => deleteComponent(c.id)}
              />
            ))}
            {levelComps.length === 0 && (
              <p className="text-[11px] text-neutral-600">Draw walls/columns/slabs in the plan view.</p>
            )}
          </div>
        </section>

        {/* Natural-language BIM modeling (Phase 16) */}
        <ChatPanel config={bimLoopConfig} placeholder="e.g. add a 5m wall on the north side…" />
      </aside>

      {/* Center: plan view + 3D preview */}
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 border-b border-neutral-800">
          {levelId && <PlanView bim={bim} levelId={levelId} />}
        </div>
        <div className="min-h-0 flex-1">
          <BIMPreview />
        </div>
      </main>
    </div>
  );
}

function ComponentRow({
  component,
  onPatch,
  onDelete,
}: {
  component: BuildingComponent;
  onPatch: (patch: Partial<BuildingComponent>) => void;
  onDelete: () => void;
}) {
  const c = component;
  const warning = "warning" in c ? c.warning : undefined;
  return (
    <div className={`rounded border p-2 text-xs ${warning ? "border-amber-700 bg-amber-950/30" : "border-neutral-800 bg-neutral-950/40"}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="capitalize text-neutral-200">{c.type}</span>
        <button type="button" onClick={onDelete} className="text-neutral-600 hover:text-red-400">✕</button>
      </div>
      {warning && <p className="mb-1 text-[11px] text-amber-400">⚠ {warning}</p>}
      <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
        {c.type === "wall" && (
          <>
            <NumField label="thick" value={c.thickness} onChange={(v) => onPatch({ thickness: v })} />
            <NumField label="height" value={c.height} onChange={(v) => onPatch({ height: v })} />
            <NumField label="layers" value={c.materialLayers} onChange={(v) => onPatch({ materialLayers: Math.max(1, Math.round(v)) })} />
          </>
        )}
        {c.type === "slab" && <NumField label="thick" value={c.thickness} onChange={(v) => onPatch({ thickness: v })} />}
        {c.type === "column" && (
          <>
            <NumField label="w" value={c.width} onChange={(v) => onPatch({ width: v })} />
            <NumField label="d" value={c.depth} onChange={(v) => onPatch({ depth: v })} />
            <NumField label="h" value={c.height} onChange={(v) => onPatch({ height: v })} />
          </>
        )}
        {c.type === "beam" && (
          <>
            <NumField label="w" value={c.width} onChange={(v) => onPatch({ width: v })} />
            <NumField label="d" value={c.depth} onChange={(v) => onPatch({ depth: v })} />
          </>
        )}
        {(c.type === "door" || c.type === "window") && (
          <>
            <NumField label="w" value={c.width} onChange={(v) => onPatch({ width: v })} />
            <NumField label="h" value={c.height} onChange={(v) => onPatch({ height: v })} />
            <NumField label="sill" value={c.sill} onChange={(v) => onPatch({ sill: v })} />
            <NumField label="pos" value={c.position} onChange={(v) => onPatch({ position: Math.max(0, Math.min(1, v)) })} />
          </>
        )}
        {c.type === "space" && (
          <span className="text-neutral-400">
            {(c.area / 1e6).toFixed(2)} m² · {(c.volume / 1e9).toFixed(2)} m³
          </span>
        )}
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-1">
      <span className="text-neutral-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 rounded border border-neutral-700 bg-neutral-800 px-1 text-right text-neutral-100 outline-none"
      />
    </label>
  );
}
