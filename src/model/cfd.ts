/**
 * CFD (computational fluid dynamics) data model — additive tab type.
 *
 * A CFDTab is an ADDITIVE tab type (like RobotTab / BIMTab): the Document keeps
 * a separate `cfds: CFDTab[]` list so the Part Studio + Robot + BIM code paths
 * are untouched. A CFD tab references a Part Studio body (no geometry is
 * duplicated), holds boundary patches tagged by the same FaceRef strings the
 * viewport/chat catalog already use, plus fluid/mesh/solver settings, run
 * state, and (after a solve) sampled field results.
 *
 * Units: CAD lengths in the tab are millimetres (Z-up, matching the viewport).
 * Fluid properties and boundary-condition values are SI (kg/m³, m²/s, m/s, Pa).
 * caseGen.ts converts lengths * 0.001 when writing OpenFOAM dicts.
 *
 * All types are plain-JSON serializable so a whole Document persists in one
 * record. Run results (p/magU arrays) persist too so a reopen can recolor the
 * mesh without re-solving.
 */
import { newFeatureId } from "./featureTree";

export type PatchType =
  | "inlet"
  | "outlet"
  | "wall"
  | "movingWall"
  | "symmetry"
  | "freestream";

export type TurbulenceModel = "laminar" | "kEpsilon" | "kOmegaSST";
export type FlowRegime = "steadyIncompressible" | "transientIncompressible";
export type FlowType = "external" | "internal";
export type FlowDirection = "x" | "y" | "z";
export type CfdRunStatus =
  | "idle"
  | "queued"
  | "meshing"
  | "solving"
  | "done"
  | "failed";

export interface BoundaryPatch {
  id: string;
  /** FaceRef bbox-center string, identical to catalogGeometry / Viewport picking. */
  faceRef: string;
  /** OpenFOAM patch name; must match [A-Za-z_][A-Za-z0-9_]*. */
  name: string;
  type: PatchType;
  /** m/s; inlet / movingWall / freestream. */
  velocity?: [number, number, number];
  /** Pa (gauge); outlet. */
  gaugePressure?: number;
}

export interface DomainMargins {
  upstream: number;
  downstream: number;
  lateral: number;
  vertical: number;
}

export interface DomainBox {
  min: [number, number, number];
  max: [number, number, number];
}

export interface FluidProps {
  name: string;
  /** kg/m³ */
  density: number;
  /** m²/s */
  kinematicViscosity: number;
}

export interface MeshSettings {
  /** CAD millimetres. */
  baseCellSize: number;
  surfaceRefinementLevels: [number, number];
  boundaryLayers: number;
}

export interface SolverControl {
  endTime: number;
  deltaT?: number;
  writeInterval: number;
}

export interface CfdRun {
  status: CfdRunStatus;
  jobId: string | null;
  logTail: string[];
}

export interface CfdResults {
  summary: Record<string, number> | null;
  /** Per-vertex samples aligned with the source mesh (length = vertexCount). */
  p: number[] | null;
  magU: number[] | null;
}

export interface CFDTab {
  kind: "cfd";
  id: string;
  name: string;
  /** Part Studio tab id whose regenerated body this case wraps. */
  sourceTab: string;
  /** Which solid body of that tab (0-based). */
  bodyIndex: number;
  flowType: FlowType;
  /** External far-field: inlet = min face of this axis. */
  flowDirection: FlowDirection;
  /** CAD millimetres. null = auto from source bbox × domainMargins. */
  domainBox: DomainBox | null;
  domainMargins: DomainMargins;
  boundaryPatches: BoundaryPatch[];
  fluid: FluidProps;
  turbulenceModel: TurbulenceModel;
  regime: FlowRegime;
  meshSettings: MeshSettings;
  solverControl: SolverControl;
  run: CfdRun;
  results: CfdResults | null;
}

export const FLUID_AIR: FluidProps = {
  name: "air",
  density: 1.225,
  kinematicViscosity: 1.5e-5,
};

export const FLUID_WATER: FluidProps = {
  name: "water",
  density: 1000,
  kinematicViscosity: 1e-6,
};

const PATCH_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function isValidPatchName(name: string): boolean {
  return PATCH_NAME_RE.test(name);
}

export function makeBoundaryPatch(
  faceRef: string,
  type: PatchType,
  name: string,
  extras: { velocity?: [number, number, number]; gaugePressure?: number } = {},
): BoundaryPatch {
  const patch: BoundaryPatch = { id: newFeatureId(), faceRef, name, type };
  if (extras.velocity) patch.velocity = extras.velocity;
  if (extras.gaugePressure !== undefined) patch.gaugePressure = extras.gaugePressure;
  return patch;
}

export function makeCFDTab(name: string, sourceTab: string): CFDTab {
  return {
    kind: "cfd",
    id: newFeatureId(),
    name,
    sourceTab,
    bodyIndex: 0,
    flowType: "external",
    flowDirection: "x",
    domainBox: null,
    domainMargins: { upstream: 3, downstream: 6, lateral: 3, vertical: 3 },
    boundaryPatches: [],
    fluid: { ...FLUID_AIR },
    turbulenceModel: "laminar",
    regime: "steadyIncompressible",
    meshSettings: {
      baseCellSize: 5,
      surfaceRefinementLevels: [2, 4],
      boundaryLayers: 3,
    },
    solverControl: { endTime: 200, deltaT: 1, writeInterval: 50 },
    run: { status: "idle", jobId: null, logTail: [] },
    results: null,
  };
}

export type CFDValidation = { ok: true } | { ok: false; error: string };

/**
 * Structural validation of a CFD tab. Referential checks against the document
 * (does `sourceTab` exist?) live in the store / caseGen, because the tab itself
 * doesn't hold the Part Studio list.
 */
export function validateCFD(tab: CFDTab): CFDValidation {
  if (tab.meshSettings.baseCellSize <= 0) {
    return { ok: false, error: "baseCellSize must be > 0" };
  }
  if (tab.solverControl.endTime <= 0) {
    return { ok: false, error: "endTime must be > 0" };
  }
  const names = new Set<string>();
  for (const p of tab.boundaryPatches) {
    if (!isValidPatchName(p.name)) {
      return {
        ok: false,
        error: `invalid patch name "${p.name}" (must match [A-Za-z_][A-Za-z0-9_]*)`,
      };
    }
    if (names.has(p.name)) {
      return { ok: false, error: `duplicate patch name "${p.name}"` };
    }
    names.add(p.name);
  }
  const hasInlet = tab.boundaryPatches.some(
    (p) => p.type === "inlet" || p.type === "freestream",
  );
  const hasOutlet = tab.boundaryPatches.some(
    (p) => p.type === "outlet" || p.type === "freestream",
  );
  if (!hasInlet) return { ok: false, error: "need at least one inlet (or freestream)" };
  if (!hasOutlet) return { ok: false, error: "need at least one outlet (or freestream)" };
  return { ok: true };
}

/** Characteristic length = longest bbox axis (CAD mm). */
export function characteristicLength(bbox: DomainBox): number {
  return Math.max(
    bbox.max[0] - bbox.min[0],
    bbox.max[1] - bbox.min[1],
    bbox.max[2] - bbox.min[2],
    1,
  );
}

/**
 * Auto domain from a source bbox (CAD mm) and margin ratios. For `external`,
 * the flow-direction axis is padded by upstream/downstream; the other two by
 * lateral/vertical. For `internal`, a tiny pad (1% of char length) keeps
 * snappyHexMesh's locationInMesh unambiguously inside.
 */
export function autoDomainBox(
  bbox: DomainBox,
  margins: DomainMargins,
  flowType: FlowType,
  flowDirection: FlowDirection,
): DomainBox {
  const L = characteristicLength(bbox);
  if (flowType === "internal") {
    const pad = L * 0.01;
    return {
      min: [bbox.min[0] - pad, bbox.min[1] - pad, bbox.min[2] - pad],
      max: [bbox.max[0] + pad, bbox.max[1] + pad, bbox.max[2] + pad],
    };
  }
  const up = L * margins.upstream;
  const down = L * margins.downstream;
  const lat = L * margins.lateral;
  const vert = L * margins.vertical;
  const min: [number, number, number] = [...bbox.min] as [number, number, number];
  const max: [number, number, number] = [...bbox.max] as [number, number, number];
  const axis = flowDirection === "x" ? 0 : flowDirection === "y" ? 1 : 2;
  // The other two axes: treat the numerically next as "lateral", the last as "vertical".
  const a1 = (axis + 1) % 3;
  const a2 = (axis + 2) % 3;
  min[axis] -= up;
  max[axis] += down;
  min[a1] -= lat;
  max[a1] += lat;
  min[a2] -= vert;
  max[a2] += vert;
  return { min, max };
}
