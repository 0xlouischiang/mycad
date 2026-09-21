/**
 * CFD view: workspace shown when a CFD tab is active. Layout:
 *   - left sidebar: source tab, fluid/turbulence, domain, boundary table,
 *     mesh/solver, run + results, chat;
 *   - center: 3D preview of the source body with face tagging + domain box.
 */
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { ChatPanel } from "../ui/ChatPanel";
import { cfdLoopConfig } from "../commands/cfdLoop";
import { CFDPreview } from "./CFDPreview";
import { parseResiduals } from "./residuals";
import {
  FLUID_AIR,
  FLUID_WATER,
  type PatchType,
  type TurbulenceModel,
  type FlowRegime,
  type FlowType,
  type FlowDirection,
} from "../model/cfd";

const PATCH_TYPES: PatchType[] = [
  "inlet",
  "outlet",
  "wall",
  "movingWall",
  "symmetry",
  "freestream",
];

export function CFDView() {
  const doc = useStore((s) => s.doc);
  const activeCfdId = useStore((s) => s.activeCfdId);
  const selectedFaceRefs = useStore((s) => s.selectedFaceRefs);
  const updateCfd = useStore((s) => s.updateCfd);
  const tagBoundary = useStore((s) => s.tagBoundary);
  const untagBoundary = useStore((s) => s.untagBoundary);
  const downloadCfdCase = useStore((s) => s.downloadCfdCase);
  const startCfdRun = useStore((s) => s.startCfdRun);
  const cancelCfdRun = useStore((s) => s.cancelCfdRun);
  const computeCfdMesh = useStore((s) => s.computeCfdMesh);
  const busy = useStore((s) => s.busy);
  const error = useStore((s) => s.error);

  const cfd = doc.cfds.find((c) => c.id === activeCfdId) ?? null;
  const [tagType, setTagType] = useState<PatchType>("inlet");
  const [field, setField] = useState<"p" | "magU">("p");

  useEffect(() => {
    if (cfd) void computeCfdMesh();
  }, [cfd?.id, cfd?.sourceTab, computeCfdMesh]);

  if (!cfd) return null;

  const residuals = parseResiduals(cfd.run.logTail);
  const running =
    cfd.run.status === "queued" ||
    cfd.run.status === "meshing" ||
    cfd.run.status === "solving";

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-80 flex-col overflow-y-auto border-r border-neutral-800 bg-neutral-900">
        <header className="border-b border-neutral-800 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight text-cyan-200">
            🌊 {cfd.name}
          </h1>
          <p className="mb-2 text-xs text-neutral-500">
            Incompressible flow · OpenFOAM.org v11
          </p>
          <label className="mb-2 flex items-center gap-2 text-[11px] text-neutral-400">
            Source
            <select
              value={cfd.sourceTab}
              onChange={(e) => updateCfd({ sourceTab: e.target.value })}
              className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              {doc.tabs.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => void downloadCfdCase()}
              disabled={busy}
              className="rounded bg-cyan-800 px-2 py-1 text-[11px] text-cyan-50 hover:bg-cyan-700 disabled:opacity-40"
            >
              Download case (.zip)
            </button>
            {running ? (
              <button
                type="button"
                onClick={() => void cancelCfdRun()}
                className="rounded bg-red-800 px-2 py-1 text-[11px] text-red-100 hover:bg-red-700"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startCfdRun()}
                disabled={busy}
                className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
              >
                Start run
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="m-3 rounded border border-red-800 bg-red-950/50 p-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Fluid &amp; turbulence
          </h2>
          <div className="mb-2 flex gap-1">
            <button
              type="button"
              onClick={() => updateCfd({ fluid: { ...FLUID_AIR } })}
              className={`rounded px-2 py-0.5 text-[11px] ${
                cfd.fluid.name === "air"
                  ? "bg-cyan-800 text-cyan-50"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              Air
            </button>
            <button
              type="button"
              onClick={() => updateCfd({ fluid: { ...FLUID_WATER } })}
              className={`rounded px-2 py-0.5 text-[11px] ${
                cfd.fluid.name === "water"
                  ? "bg-cyan-800 text-cyan-50"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              Water
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
            <NumField
              label="ρ"
              value={cfd.fluid.density}
              onChange={(v) =>
                updateCfd({ fluid: { ...cfd.fluid, name: "custom", density: v } })
              }
            />
            <NumField
              label="ν"
              value={cfd.fluid.kinematicViscosity}
              onChange={(v) =>
                updateCfd({
                  fluid: { ...cfd.fluid, name: "custom", kinematicViscosity: v },
                })
              }
            />
          </div>
          <label className="mt-2 flex items-center gap-2 text-[11px] text-neutral-400">
            Turbulence
            <select
              value={cfd.turbulenceModel}
              onChange={(e) =>
                updateCfd({ turbulenceModel: e.target.value as TurbulenceModel })
              }
              className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              <option value="laminar">laminar</option>
              <option value="kEpsilon">k-ε</option>
              <option value="kOmegaSST">k-ω SST</option>
            </select>
          </label>
          <label className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
            Regime
            <select
              value={cfd.regime}
              onChange={(e) => updateCfd({ regime: e.target.value as FlowRegime })}
              className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              <option value="steadyIncompressible">steady (simpleFoam)</option>
              <option value="transientIncompressible">transient (pimpleFoam)</option>
            </select>
          </label>
          <label className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
            Flow
            <select
              value={cfd.flowType}
              onChange={(e) => updateCfd({ flowType: e.target.value as FlowType })}
              className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
            >
              <option value="external">external</option>
              <option value="internal">internal</option>
            </select>
          </label>
          {cfd.flowType === "external" && (
            <label className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
              Direction
              <select
                value={cfd.flowDirection}
                onChange={(e) =>
                  updateCfd({ flowDirection: e.target.value as FlowDirection })
                }
                className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-neutral-100"
              >
                <option value="x">+X</option>
                <option value="y">+Y</option>
                <option value="z">+Z</option>
              </select>
            </label>
          )}
        </section>

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Domain (mm)
          </h2>
          <label className="mb-1 flex items-center gap-2 text-[11px] text-neutral-400">
            <input
              type="checkbox"
              checked={cfd.domainBox === null}
              onChange={(e) =>
                updateCfd({
                  domainBox: e.target.checked
                    ? null
                    : {
                        min: [0, 0, 0],
                        max: [100, 100, 100],
                      },
                })
              }
            />
            auto-size from bbox
          </label>
          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
            <NumField
              label="up"
              value={cfd.domainMargins.upstream}
              onChange={(v) =>
                updateCfd({ domainMargins: { ...cfd.domainMargins, upstream: v } })
              }
            />
            <NumField
              label="down"
              value={cfd.domainMargins.downstream}
              onChange={(v) =>
                updateCfd({
                  domainMargins: { ...cfd.domainMargins, downstream: v },
                })
              }
            />
            <NumField
              label="lat"
              value={cfd.domainMargins.lateral}
              onChange={(v) =>
                updateCfd({ domainMargins: { ...cfd.domainMargins, lateral: v } })
              }
            />
            <NumField
              label="vert"
              value={cfd.domainMargins.vertical}
              onChange={(v) =>
                updateCfd({ domainMargins: { ...cfd.domainMargins, vertical: v } })
              }
            />
          </div>
          {cfd.domainBox && (
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-400">
              <NumField
                label="xmin"
                value={cfd.domainBox.min[0]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      min: [v, cfd.domainBox!.min[1], cfd.domainBox!.min[2]],
                    },
                  })
                }
              />
              <NumField
                label="ymin"
                value={cfd.domainBox.min[1]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      min: [cfd.domainBox!.min[0], v, cfd.domainBox!.min[2]],
                    },
                  })
                }
              />
              <NumField
                label="zmin"
                value={cfd.domainBox.min[2]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      min: [cfd.domainBox!.min[0], cfd.domainBox!.min[1], v],
                    },
                  })
                }
              />
              <NumField
                label="xmax"
                value={cfd.domainBox.max[0]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      max: [v, cfd.domainBox!.max[1], cfd.domainBox!.max[2]],
                    },
                  })
                }
              />
              <NumField
                label="ymax"
                value={cfd.domainBox.max[1]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      max: [cfd.domainBox!.max[0], v, cfd.domainBox!.max[2]],
                    },
                  })
                }
              />
              <NumField
                label="zmax"
                value={cfd.domainBox.max[2]}
                onChange={(v) =>
                  updateCfd({
                    domainBox: {
                      ...cfd.domainBox!,
                      max: [cfd.domainBox!.max[0], cfd.domainBox!.max[1], v],
                    },
                  })
                }
              />
            </div>
          )}
        </section>

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Boundaries
          </h2>
          <div className="mb-2 flex items-center gap-1">
            <select
              value={tagType}
              onChange={(e) => setTagType(e.target.value as PatchType)}
              className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-[11px] text-neutral-100"
            >
              {PATCH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={selectedFaceRefs.length === 0}
              onClick={() => tagBoundary(selectedFaceRefs, tagType)}
              className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-200 hover:bg-neutral-700 disabled:opacity-40"
            >
              Tag selected ({selectedFaceRefs.length})
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {cfd.boundaryPatches.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-950/40 px-2 py-1 text-[11px]"
              >
                <span className="w-16 truncate text-cyan-200">{p.name}</span>
                <select
                  value={p.type}
                  onChange={(e) => {
                    const type = e.target.value as PatchType;
                    updateCfd({
                      boundaryPatches: cfd.boundaryPatches.map((x) =>
                        x.id === p.id ? { ...x, type } : x,
                      ),
                    });
                  }}
                  className="rounded border border-neutral-700 bg-neutral-800 px-1 text-neutral-100"
                >
                  {PATCH_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {(p.type === "inlet" ||
                  p.type === "movingWall" ||
                  p.type === "freestream") && (
                  <input
                    type="number"
                    title="Ux (m/s)"
                    value={p.velocity?.[0] ?? 1}
                    onChange={(e) => {
                      const ux = Number(e.target.value);
                      updateCfd({
                        boundaryPatches: cfd.boundaryPatches.map((x) =>
                          x.id === p.id
                            ? { ...x, velocity: [ux, x.velocity?.[1] ?? 0, x.velocity?.[2] ?? 0] }
                            : x,
                        ),
                      });
                    }}
                    className="w-12 rounded border border-neutral-700 bg-neutral-800 px-1 text-right text-neutral-100"
                  />
                )}
                {p.type === "outlet" && (
                  <input
                    type="number"
                    title="p gauge (Pa)"
                    value={p.gaugePressure ?? 0}
                    onChange={(e) => {
                      const gp = Number(e.target.value);
                      updateCfd({
                        boundaryPatches: cfd.boundaryPatches.map((x) =>
                          x.id === p.id ? { ...x, gaugePressure: gp } : x,
                        ),
                      });
                    }}
                    className="w-12 rounded border border-neutral-700 bg-neutral-800 px-1 text-right text-neutral-100"
                  />
                )}
                <button
                  type="button"
                  onClick={() => untagBoundary([p.faceRef])}
                  className="ml-auto text-neutral-600 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            {cfd.boundaryPatches.length === 0 && (
              <p className="text-[11px] text-neutral-600">
                Pick faces in the preview, then Tag selected.
              </p>
            )}
          </div>
        </section>

        <section className="border-b border-neutral-800 p-3">
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Mesh &amp; solver
          </h2>
          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
            <NumField
              label="cell mm"
              value={cfd.meshSettings.baseCellSize}
              onChange={(v) =>
                updateCfd({ meshSettings: { ...cfd.meshSettings, baseCellSize: v } })
              }
            />
            <NumField
              label="ref min"
              value={cfd.meshSettings.surfaceRefinementLevels[0]}
              onChange={(v) =>
                updateCfd({
                  meshSettings: {
                    ...cfd.meshSettings,
                    surfaceRefinementLevels: [
                      Math.max(0, Math.round(v)),
                      cfd.meshSettings.surfaceRefinementLevels[1],
                    ],
                  },
                })
              }
            />
            <NumField
              label="ref max"
              value={cfd.meshSettings.surfaceRefinementLevels[1]}
              onChange={(v) =>
                updateCfd({
                  meshSettings: {
                    ...cfd.meshSettings,
                    surfaceRefinementLevels: [
                      cfd.meshSettings.surfaceRefinementLevels[0],
                      Math.max(0, Math.round(v)),
                    ],
                  },
                })
              }
            />
            <NumField
              label="layers"
              value={cfd.meshSettings.boundaryLayers}
              onChange={(v) =>
                updateCfd({
                  meshSettings: {
                    ...cfd.meshSettings,
                    boundaryLayers: Math.max(0, Math.round(v)),
                  },
                })
              }
            />
            <NumField
              label="endTime"
              value={cfd.solverControl.endTime}
              onChange={(v) =>
                updateCfd({ solverControl: { ...cfd.solverControl, endTime: v } })
              }
            />
            <NumField
              label="Δt"
              value={cfd.solverControl.deltaT ?? 1}
              onChange={(v) =>
                updateCfd({ solverControl: { ...cfd.solverControl, deltaT: v } })
              }
            />
            <NumField
              label="write"
              value={cfd.solverControl.writeInterval}
              onChange={(v) =>
                updateCfd({
                  solverControl: { ...cfd.solverControl, writeInterval: v },
                })
              }
            />
          </div>
        </section>

        <section className="border-b border-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Run
            </h2>
            <StatusPill status={cfd.run.status} />
          </div>
          {residuals.length > 0 && <ResidualChart series={residuals} />}
          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-neutral-950 p-2 font-mono text-[10px] text-neutral-400">
            {cfd.run.logTail.slice(-40).join("\n") || "(no log yet)"}
          </pre>
        </section>

        <section className="border-b border-neutral-800 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Results
            </h2>
            {cfd.results && (
              <select
                value={field}
                onChange={(e) => setField(e.target.value as "p" | "magU")}
                className="rounded border border-neutral-700 bg-neutral-800 px-1 text-[11px] text-neutral-100"
              >
                <option value="p">pressure</option>
                <option value="magU">|U|</option>
              </select>
            )}
          </div>
          {cfd.results?.summary ? (
            <dl className="flex flex-col gap-1 font-mono text-[11px] text-neutral-300">
              {Object.entries(cfd.results.summary).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-neutral-500">{k}</dt>
                  <dd>{fmt(v)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-[11px] text-neutral-600">
              Run a case (or download the zip and solve locally) to see coefficients.
            </p>
          )}
        </section>

        <ChatPanel
          config={cfdLoopConfig}
          placeholder="e.g. tag the upstream face as inlet at 1 m/s…"
        />
      </aside>

      <main className="relative min-h-0 flex-1">
        <CFDPreview overlayField={field} />
      </main>
    </div>
  );
}

function fmt(n: number): string {
  return Math.abs(n) >= 1e5 || (Math.abs(n) < 1e-3 && n !== 0)
    ? n.toExponential(3)
    : (Math.round(n * 1000) / 1000).toString();
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
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

function StatusPill({ status }: { status: string }) {
  const color =
    status === "done"
      ? "bg-green-900 text-green-300"
      : status === "failed"
        ? "bg-red-900 text-red-300"
        : status === "idle"
          ? "bg-neutral-800 text-neutral-400"
          : "bg-yellow-900 text-yellow-200";
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] uppercase tracking-wide ${color}`}>
      {status}
    </span>
  );
}

function ResidualChart({
  series,
}: {
  series: { iter: number; p: number; U: number }[];
}) {
  if (series.length < 2) return null;
  const w = 240;
  const h = 64;
  const maxY = Math.log10(Math.max(...series.flatMap((s) => [s.p, s.U]), 1e-12));
  const minY = Math.log10(Math.min(...series.flatMap((s) => [s.p, s.U, 1e-12])));
  const span = Math.max(maxY - minY, 1e-6);
  const x = (i: number) => (i / (series.length - 1)) * (w - 8) + 4;
  const y = (v: number) => {
    const ly = Math.log10(Math.max(v, 1e-16));
    return h - 4 - ((ly - minY) / span) * (h - 8);
  };
  const dP = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.p)}`).join(" ");
  const dU = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.U)}`).join(" ");
  return (
    <svg width={w} height={h} className="rounded bg-neutral-950">
      <path d={dP} fill="none" stroke="#67e8f9" strokeWidth="1.2" />
      <path d={dU} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
    </svg>
  );
}
