/**
 * Bounded CFD context for the natural-language CFD loop.
 *
 * Includes the source Part Studio's geometry catalog (same FaceRef strings as
 * fillet/shell) so "the +X face" / "the upstream face" resolve without a click.
 */
import type { StoreHandle } from "./registry";
import { catalogGeometry } from "./context";
import { autoDomainBox } from "../model/cfd";

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function buildCfdStateBlock(store: StoreHandle): string {
  const s = store.getState();
  const cfd = s.doc.cfds.find((c) => c.id === s.activeCfdId);
  if (!cfd) return "No active CFD tab.";
  const source = s.doc.tabs.find((t) => t.id === cfd.sourceTab);
  const catalog = catalogGeometry(s.cfdShape);
  const bbox = catalog.bbox;
  const domain = cfd.domainBox
    ? cfd.domainBox
    : bbox
      ? autoDomainBox(bbox, cfd.domainMargins, cfd.flowType, cfd.flowDirection)
      : null;
  const facesText =
    catalog.faces
      .map(
        (f) =>
          `ref=${f.ref} center=(${f.center.map(round).join(",")})${
            f.normal ? " normal=(" + f.normal.map(round).join(",") + ")" : " (non-planar)"
          }`,
      )
      .join("\n") || "(no faces — pick a Part Studio with a solid)";
  const patches =
    cfd.boundaryPatches
      .map(
        (p) =>
          `${p.name} type=${p.type} face=${p.faceRef}` +
          (p.velocity ? ` U=${p.velocity.join(",")}` : "") +
          (p.gaugePressure !== undefined ? ` p=${p.gaugePressure}` : ""),
      )
      .join("\n") || "(none tagged)";
  return (
    `CFD TAB: ${cfd.name} id=${cfd.id}\n` +
    `SOURCE PART STUDIO: ${source?.name ?? "(missing)"} id=${cfd.sourceTab}\n` +
    `FLOW: ${cfd.flowType} direction=${cfd.flowDirection}\n` +
    `FLUID: ${cfd.fluid.name} ρ=${cfd.fluid.density} ν=${cfd.fluid.kinematicViscosity}\n` +
    `TURBULENCE: ${cfd.turbulenceModel}  REGIME: ${cfd.regime}\n` +
    `MESH: cell=${cfd.meshSettings.baseCellSize}mm levels=${cfd.meshSettings.surfaceRefinementLevels.join(
      "-",
    )} layers=${cfd.meshSettings.boundaryLayers}\n` +
    `SOLVER: endTime=${cfd.solverControl.endTime} deltaT=${cfd.solverControl.deltaT ?? 1} write=${cfd.solverControl.writeInterval}\n` +
    `RUN: ${cfd.run.status}${cfd.run.jobId ? " job=" + cfd.run.jobId : ""}\n` +
    (bbox
      ? `MODEL BBOX mm min=(${bbox.min.map(round).join(",")}) max=(${bbox.max.map(round).join(",")})\n`
      : "MODEL BBOX: none\n") +
    (domain
      ? `DOMAIN mm min=(${domain.min.map(round).join(",")}) max=(${domain.max.map(round).join(",")})\n`
      : "") +
    `PATCHES:\n${patches}\n\nFACES:\n${facesText}`
  );
}
