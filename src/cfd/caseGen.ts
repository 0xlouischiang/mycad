/**
 * OpenFOAM.org v11 case-file generator.
 *
 * Pure (no React / DOM / fetch). Never throws — returns {ok:false,error}.
 * CAD lengths in the spec are millimetres; dicts are written in metres.
 */
import type {
  BoundaryPatch,
  CFDTab,
  DomainBox,
  FlowDirection,
  PatchType,
} from "../model/cfd";
import { autoDomainBox, isValidPatchName, validateCFD } from "../model/cfd";
import type { MeshPayload } from "../kernel/protocol";
import { meshToNamedStl } from "./namedStl";
import { zipFiles } from "./zip";

const MM = 0.001;

export type FoamSolver = "simpleFoam" | "pimpleFoam";

export interface CFDCaseSpec {
  tab: CFDTab;
  bbox: DomainBox;
  stl: string;
  domainBox: DomainBox;
}

export type CaseGenResult =
  | { ok: true; files: Record<string, string>; solver: FoamSolver; warnings: string[] }
  | { ok: false; error: string };

export function chooseSolver(regime: CFDTab["regime"]): FoamSolver {
  return regime === "transientIncompressible" ? "pimpleFoam" : "simpleFoam";
}

export function resolveDomain(tab: CFDTab, bbox: DomainBox): DomainBox {
  if (tab.domainBox) return tab.domainBox;
  return autoDomainBox(bbox, tab.domainMargins, tab.flowType, tab.flowDirection);
}

export function generateCase(spec: CFDCaseSpec): CaseGenResult {
  const { tab, bbox, stl } = spec;
  const domain = spec.domainBox;

  const structural = validateCFD(tab);
  // validateCFD requires inlet+outlet on the tab; for EXTERNAL flow the far-field
  // faces supply them, so allow empty body patches in that case.
  if (!structural.ok) {
    const onlyMissingIO =
      /need at least one (inlet|outlet)/.test(structural.error) &&
      tab.flowType === "external";
    if (!onlyMissingIO) return structural;
  }
  if (tab.meshSettings.baseCellSize <= 0) {
    return { ok: false, error: "baseCellSize must be > 0" };
  }
  if (tab.solverControl.endTime <= 0) {
    return { ok: false, error: "endTime must be > 0" };
  }
  if (!encloses(domain, bbox, tab.flowType)) {
    return {
      ok: false,
      error:
        tab.flowType === "external"
          ? "domain box must strictly enclose the model bounding box"
          : "domain box must cover the model bounding box",
    };
  }

  const stlSolids = parseSolidNames(stl);
  if (stlSolids.length === 0) {
    return { ok: false, error: "STL has no named solids" };
  }
  const warnings: string[] = [];
  for (const p of tab.boundaryPatches) {
    if (!stlSolids.includes(p.name) && !stlSolids.includes(fallbackSolid(p))) {
      warnings.push(`patch "${p.name}" (face ${p.faceRef}) is not a named STL solid`);
    }
  }

  const solver = chooseSolver(tab.regime);
  const far = tab.flowType === "external" ? farFieldPatches(tab.flowDirection, usedNames(tab, stlSolids)) : [];
  const bodyPatches = bodyPatchList(tab, stlSolids);
  const allPatches = [...bodyPatches, ...far];

  const hasInlet = allPatches.some((p) => p.type === "inlet" || p.type === "freestream");
  const hasOutlet = allPatches.some((p) => p.type === "outlet" || p.type === "freestream");
  if (!hasInlet) return { ok: false, error: "need at least one inlet (or freestream)" };
  if (!hasOutlet) return { ok: false, error: "need at least one outlet (or freestream)" };

  const files: Record<string, string> = {
    "system/controlDict": controlDict(tab, solver, allPatches),
    "system/fvSchemes": fvSchemes(tab),
    "system/fvSolution": fvSolution(tab, solver),
    "system/blockMeshDict": blockMeshDict(domain, tab, far),
    "system/snappyHexMeshDict": snappyHexMeshDict(tab, bbox, domain, stlSolids),
    "constant/transportProperties": transportProperties(tab),
    "constant/turbulenceProperties": turbulenceProperties(tab),
    "constant/triSurface/geometry.stl": stl,
    "0/U": fieldU(tab, allPatches),
    "0/p": fieldP(tab, allPatches),
    Allrun: allrunScript(solver),
    Allclean: allcleanScript(),
  };
  if (tab.turbulenceModel !== "laminar") {
    files["0/k"] = fieldK(allPatches);
    files["0/nut"] = fieldNut(tab, allPatches);
    if (tab.turbulenceModel === "kEpsilon") {
      files["0/epsilon"] = fieldEpsilon(tab, allPatches);
    } else {
      files["0/omega"] = fieldOmega(tab, allPatches);
    }
  }
  return { ok: true, files, solver, warnings };
}

/** Store entry: build the case from the active CFD tab + cfdShape and download a zip. */
export async function generateAndDownloadCase(get: () => {
  doc: { cfds: CFDTab[]; tabs: { id: string; name: string }[] };
  activeCfdId: string | null;
  cfdShape: { mesh: MeshPayload; bbox: DomainBox } | null;
  error: string | null;
}): Promise<void> {
  const s = get();
  const cfd = s.doc.cfds.find((c) => c.id === s.activeCfdId);
  if (!cfd) throw new Error("no active CFD tab");
  if (!s.cfdShape) throw new Error("no source geometry — pick a Part Studio with a solid");
  const domain = resolveDomain(cfd, s.cfdShape.bbox);
  const named = meshToNamedStl(
    s.cfdShape.mesh,
    cfd.boundaryPatches.map((p) => ({ faceRef: p.faceRef, name: p.name })),
    { defaultName: "walls", scale: MM },
  );
  const result = generateCase({
    tab: cfd,
    bbox: s.cfdShape.bbox,
    stl: named.stl,
    domainBox: domain,
  });
  if (!result.ok) throw new Error(result.error);
  const bytes = zipFiles(result.files);
  downloadBytes(`${sanitize(cfd.name)}.zip`, bytes);
}

function downloadBytes(filename: string, bytes: Uint8Array): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitize(name: string): string {
  const cleaned = name.replace(/[^\w.\- ]+/g, "_").trim();
  return cleaned.length > 0 ? cleaned : "cfd-case";
}

// ---------------------------------------------------------------------------
// Patch lists
// ---------------------------------------------------------------------------

interface FoamPatch {
  name: string;
  type: PatchType;
  velocity?: [number, number, number];
  gaugePressure?: number;
  /** blockMesh face identifier, if this patch is a domain far-field face. */
  blockFace?: "xmin" | "xmax" | "ymin" | "ymax" | "zmin" | "zmax";
}

function usedNames(tab: CFDTab, stlSolids: string[]): Set<string> {
  return new Set([...tab.boundaryPatches.map((p) => p.name), ...stlSolids]);
}

function unique(base: string, used: Set<string>): string {
  if (!used.has(base) && isValidPatchName(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  while (used.has(`${base}_${i}`)) i++;
  const n = `${base}_${i}`;
  used.add(n);
  return n;
}

function farFieldPatches(dir: FlowDirection, used: Set<string>): FoamPatch[] {
  const axis = dir === "x" ? 0 : dir === "y" ? 1 : 2;
  const faces = ["xmin", "xmax", "ymin", "ymax", "zmin", "zmax"] as const;
  const out: FoamPatch[] = [];
  for (const f of faces) {
    const isMin = f.endsWith("min");
    const fAxis = f.startsWith("x") ? 0 : f.startsWith("y") ? 1 : 2;
    if (fAxis === axis) {
      out.push({
        name: unique(isMin ? "inlet" : "outlet", used),
        type: isMin ? "inlet" : "outlet",
        velocity: isMin ? defaultInletU(dir) : undefined,
        gaugePressure: isMin ? undefined : 0,
        blockFace: f,
      });
    } else {
      out.push({ name: unique(`sym_${f}`, used), type: "symmetry", blockFace: f });
    }
  }
  return out;
}

function defaultInletU(dir: FlowDirection): [number, number, number] {
  return dir === "x" ? [1, 0, 0] : dir === "y" ? [0, 1, 0] : [0, 0, 1];
}

function bodyPatchList(tab: CFDTab, stlSolids: string[]): FoamPatch[] {
  const byName = new Map<string, FoamPatch>();
  for (const p of tab.boundaryPatches) {
    byName.set(p.name, {
      name: p.name,
      type: p.type,
      velocity: p.velocity,
      gaugePressure: p.gaugePressure,
    });
  }
  for (const s of stlSolids) {
    if (!byName.has(s)) byName.set(s, { name: s, type: "wall" });
  }
  return [...byName.values()];
}

function fallbackSolid(p: BoundaryPatch): string {
  return p.name;
}

function parseSolidNames(stl: string): string[] {
  const names: string[] = [];
  const re = /^solid\s+(\S+)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(stl))) names.push(m[1]);
  return names;
}

function encloses(domain: DomainBox, bbox: DomainBox, flowType: CFDTab["flowType"]): boolean {
  const eps = flowType === "internal" ? 0 : 1e-6;
  return (
    domain.min[0] <= bbox.min[0] - eps &&
    domain.min[1] <= bbox.min[1] - eps &&
    domain.min[2] <= bbox.min[2] - eps &&
    domain.max[0] >= bbox.max[0] + eps &&
    domain.max[1] >= bbox.max[1] + eps &&
    domain.max[2] >= bbox.max[2] + eps &&
    domain.max[0] > domain.min[0] &&
    domain.max[1] > domain.min[1] &&
    domain.max[2] > domain.min[2]
  );
}

// ---------------------------------------------------------------------------
// FoamFile + helpers
// ---------------------------------------------------------------------------

function foamFile(cls: string, object: string, location?: string): string {
  const loc = location ? `    location    "${location}";\n` : "";
  return `FoamFile
{
    version     2.0;
    format      ascii;
    class       ${cls};
${loc}    object      ${object};
}
`;
}

function vec(v: [number, number, number]): string {
  return `(${v[0]} ${v[1]} ${v[2]})`;
}

function m(n: number): number {
  return n * MM;
}

function inletSpeed(patches: FoamPatch[]): number {
  for (const p of patches) {
    if ((p.type === "inlet" || p.type === "freestream" || p.type === "movingWall") && p.velocity) {
      return Math.hypot(p.velocity[0], p.velocity[1], p.velocity[2]);
    }
  }
  return 1;
}

function kFromU(U: number): number {
  const I = 0.05;
  return 1.5 * (I * U) ** 2;
}

function epsFromK(k: number, L: number): number {
  const Cmu = 0.09;
  return (Cmu ** 0.75 * k ** 1.5) / Math.max(L, 1e-6);
}

function omegaFromKE(k: number, eps: number): number {
  const Cmu = 0.09;
  return eps / (Cmu * Math.max(k, 1e-12));
}

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

function controlDict(tab: CFDTab, solver: FoamSolver, patches: FoamPatch[]): string {
  const dt = tab.solverControl.deltaT ?? 1;
  const walls = patches.filter((p) => p.type === "wall" || p.type === "movingWall").map((p) => p.name);
  const outlet = patches.find((p) => p.type === "outlet")?.name;
  const inlet = patches.find((p) => p.type === "inlet" || p.type === "freestream")?.name;
  const U = inletSpeed(patches);
  const lRef = 0.1;
  const functions: string[] = [];
  if (tab.flowType === "external" && walls.length > 0) {
    const drag: [number, number, number] =
      tab.flowDirection === "x" ? [1, 0, 0] : tab.flowDirection === "y" ? [0, 1, 0] : [0, 0, 1];
    const lift: [number, number, number] =
      tab.flowDirection === "z" ? [1, 0, 0] : [0, 0, 1];
    functions.push(`    forceCoeffs1
    {
        type            forceCoeffs;
        libs            (forces);
        writeControl    timeStep;
        writeInterval   ${tab.solverControl.writeInterval};
        patches         (${walls.join(" ")});
        rho             rhoInf;
        rhoInf          ${tab.fluid.density};
        liftDir         ${vec(lift)};
        dragDir         ${vec(drag)};
        CofR            (0 0 0);
        pitchAxis       (0 1 0);
        magUInf         ${U};
        lRef            ${lRef};
        Aref            ${lRef * lRef};
    }`);
  }
  if (outlet) {
    functions.push(`    outletAverage
    {
        type            surfaceFieldValue;
        libs            (fieldFunctionObjects);
        writeControl    onEnd;
        regionType      patch;
        name            ${outlet};
        operation       areaAverage;
        fields          (U p);
    }`);
  }
  if (inlet && outlet) {
    functions.push(`    inletAverage
    {
        type            surfaceFieldValue;
        libs            (fieldFunctionObjects);
        writeControl    onEnd;
        regionType      patch;
        name            ${inlet};
        operation       areaAverage;
        fields          (p);
    }`);
  }
  functions.push(`    surfaces1
    {
        type            surfaces;
        libs            (sampling);
        writeControl    onEnd;
        surfaceFormat   raw;
        interpolationScheme cellPoint;
        fields          (p U);
        surfaces
        {
            body
            {
                type        triSurfaceMesh;
                surface     geometry.stl;
                source      cells;
            }
        }
    }`);
  return `${foamFile("dictionary", "controlDict")}
application     ${solver};

startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         ${tab.solverControl.endTime};
deltaT          ${dt};

writeControl    timeStep;
writeInterval   ${tab.solverControl.writeInterval};
purgeWrite      0;
writeFormat     ascii;
writePrecision  6;
writeCompression off;
timeFormat      general;
timePrecision   6;
runTimeModifiable true;

functions
{
${functions.join("\n")}
}
`;
}

function fvSchemes(tab: CFDTab): string {
  const ddt = tab.regime === "transientIncompressible" ? "Euler" : "steadyState";
  const divU =
    tab.turbulenceModel === "laminar"
      ? "bounded Gauss linearUpwind grad(U)"
      : "bounded Gauss upwind";
  const turbDiv =
    tab.turbulenceModel === "laminar"
      ? ""
      : `    div(phi,k)       bounded Gauss upwind;
    div(phi,epsilon) bounded Gauss upwind;
    div(phi,omega)   bounded Gauss upwind;
`;
  return `${foamFile("dictionary", "fvSchemes")}
ddtSchemes
{
    default         ${ddt};
}
gradSchemes
{
    default         Gauss linear;
    grad(U)         cellLimited Gauss linear 1;
}
divSchemes
{
    default         none;
    div(phi,U)      ${divU};
${turbDiv}    div((nuEff*dev2(T(grad(U))))) Gauss linear;
}
laplacianSchemes
{
    default         Gauss linear limited 0.5;
}
interpolationSchemes
{
    default         linear;
}
snGradSchemes
{
    default         limited 0.5;
}
`;
}

function fvSolution(tab: CFDTab, solver: FoamSolver): string {
  const turbSolvers =
    tab.turbulenceModel === "laminar"
      ? ""
      : `    "(k|epsilon|omega|nut)"
    {
        solver          smoothSolver;
        smoother        symGaussSeidel;
        tolerance       1e-6;
        relTol          0.1;
    }
`;
  const algo =
    solver === "simpleFoam"
      ? `SIMPLE
{
    nNonOrthogonalCorrectors 1;
    residualControl
    {
        p               1e-4;
        U               1e-4;
    }
}
relaxationFactors
{
    fields { p 0.3; }
    equations { U 0.7; k 0.7; epsilon 0.7; omega 0.7; }
}
`
      : `PIMPLE
{
    nOuterCorrectors ${1};
    nCorrectors     2;
    nNonOrthogonalCorrectors 1;
}
`;
  return `${foamFile("dictionary", "fvSolution")}
solvers
{
    p
    {
        solver          GAMG;
        tolerance       1e-6;
        relTol          0.1;
        smoother        GaussSeidel;
    }
    pFinal
    {
        $p;
        relTol          0;
    }
    U
    {
        solver          smoothSolver;
        smoother        symGaussSeidel;
        tolerance       1e-6;
        relTol          0.1;
    }
    UFinal
    {
        $U;
        relTol          0;
    }
${turbSolvers}}
${algo}`;
}

function blockMeshDict(domain: DomainBox, tab: CFDTab, far: FoamPatch[]): string {
  const min = domain.min.map(m) as [number, number, number];
  const max = domain.max.map(m) as [number, number, number];
  const nx = Math.max(1, Math.round((domain.max[0] - domain.min[0]) / tab.meshSettings.baseCellSize));
  const ny = Math.max(1, Math.round((domain.max[1] - domain.min[1]) / tab.meshSettings.baseCellSize));
  const nz = Math.max(1, Math.round((domain.max[2] - domain.min[2]) / tab.meshSettings.baseCellSize));
  const faceName = (face: FoamPatch["blockFace"], fallback: string) =>
    far.find((p) => p.blockFace === face)?.name ?? fallback;
  return `${foamFile("dictionary", "blockMeshDict")}
convertToMeters 1;

vertices
(
    (${min[0]} ${min[1]} ${min[2]})
    (${max[0]} ${min[1]} ${min[2]})
    (${max[0]} ${max[1]} ${min[2]})
    (${min[0]} ${max[1]} ${min[2]})
    (${min[0]} ${min[1]} ${max[2]})
    (${max[0]} ${min[1]} ${max[2]})
    (${max[0]} ${max[1]} ${max[2]})
    (${min[0]} ${max[1]} ${max[2]})
);

blocks
(
    hex (0 1 2 3 4 5 6 7) (${nx} ${ny} ${nz}) simpleGrading (1 1 1)
);

edges
(
);

boundary
(
    ${faceName("xmin", "xmin")} { type patch; faces ((0 4 7 3)); }
    ${faceName("xmax", "xmax")} { type patch; faces ((1 2 6 5)); }
    ${faceName("ymin", "ymin")} { type patch; faces ((0 1 5 4)); }
    ${faceName("ymax", "ymax")} { type patch; faces ((3 7 6 2)); }
    ${faceName("zmin", "zmin")} { type patch; faces ((0 3 2 1)); }
    ${faceName("zmax", "zmax")} { type patch; faces ((4 5 6 7)); }
);
`;
}

function snappyHexMeshDict(
  tab: CFDTab,
  bbox: DomainBox,
  domain: DomainBox,
  solids: string[],
): string {
  const [r0, r1] = tab.meshSettings.surfaceRefinementLevels;
  const layers = tab.meshSettings.boundaryLayers;
  const regions = solids.map((s) => `            ${s} { name ${s}; }`).join("\n");
  const refRegions = solids
    .map((s) => `            ${s} { level (${r0} ${r1}); }`)
    .join("\n");
  const loc = locationInMesh(tab, bbox, domain);
  const addLayers = layers > 0;
  const layerDict = solids
    .map((s) => `        ${s} { nSurfaceLayers ${layers}; }`)
    .join("\n");
  return `${foamFile("dictionary", "snappyHexMeshDict")}
castellatedMesh true;
snap            true;
addLayers       ${addLayers};

geometry
{
    geometry.stl
    {
        type triSurfaceMesh;
        name body;
        regions
        {
${regions}
        }
    }
}

castellatedMeshControls
{
    maxLocalCells 1000000;
    maxGlobalCells 2000000;
    minRefinementCells 0;
    maxLoadUnbalance 0.1;
    nCellsBetweenLevels 2;
    features ();
    refinementSurfaces
    {
        body
        {
            level (${r0} ${r1});
            regions
            {
${refRegions}
            }
        }
    }
    resolveFeatureAngle 30;
    refinementRegions {}
    locationInMesh (${loc[0]} ${loc[1]} ${loc[2]});
    allowFreeStandingZoneFaces true;
}

snapControls
{
    nSmoothPatch 3;
    tolerance 2.0;
    nSolveIter 30;
    nRelaxIter 5;
}

addLayersControls
{
    relativeSizes true;
    layers
    {
${layerDict}
    }
    expansionRatio 1.2;
    finalLayerThickness 0.3;
    minThickness 0.1;
    nGrow 0;
    featureAngle 60;
    nRelaxIter 3;
    nSmoothSurfaceNormals 1;
    nSmoothNormals 3;
    nSmoothThickness 10;
    maxFaceThicknessRatio 0.5;
    maxThicknessToMedialRatio 0.3;
    minMedialAxisAngle 90;
    nBufferCellsNoExtrude 0;
    nLayerIter 50;
}

meshQualityControls
{
    maxNonOrtho 65;
    maxBoundarySkewness 20;
    maxInternalSkewness 4;
    maxConcave 80;
    minVol 1e-13;
    minTetQuality 1e-15;
    minArea -1;
    minTwist 0.02;
    minDeterminant 0.001;
    minFaceWeight 0.05;
    minVolRatio 0.01;
    minTriangleTwist -1;
    nSmoothScale 4;
    errorReduction 0.75;
}

mergeTolerance 1e-6;
`;
}

function locationInMesh(
  tab: CFDTab,
  bbox: DomainBox,
  domain: DomainBox,
): [number, number, number] {
  if (tab.flowType === "internal") {
    // Slightly offset from the exact centroid so we don't sit on a cell face.
    return [
      m((bbox.min[0] + bbox.max[0]) / 2 + 0.013),
      m((bbox.min[1] + bbox.max[1]) / 2 + 0.017),
      m((bbox.min[2] + bbox.max[2]) / 2 + 0.019),
    ];
  }
  // Outside the body, inside the domain: midpoint of body-max and domain-max
  // along the flow axis, centroid of the other two.
  const axis = tab.flowDirection === "x" ? 0 : tab.flowDirection === "y" ? 1 : 2;
  const p: [number, number, number] = [
    m((bbox.min[0] + bbox.max[0]) / 2),
    m((bbox.min[1] + bbox.max[1]) / 2),
    m((bbox.min[2] + bbox.max[2]) / 2),
  ];
  p[axis] = m((bbox.max[axis] + domain.max[axis]) / 2);
  return p;
}

function transportProperties(tab: CFDTab): string {
  return `${foamFile("dictionary", "transportProperties")}
transportModel  Newtonian;
nu              [0 2 -1 0 0 0 0] ${tab.fluid.kinematicViscosity};
`;
}

function turbulenceProperties(tab: CFDTab): string {
  if (tab.turbulenceModel === "laminar") {
    return `${foamFile("dictionary", "turbulenceProperties")}
simulationType  laminar;
`;
  }
  const model = tab.turbulenceModel === "kEpsilon" ? "kEpsilon" : "kOmegaSST";
  return `${foamFile("dictionary", "turbulenceProperties")}
simulationType  RAS;
RAS
{
    model           ${model};
    turbulence      on;
    printCoeffs     on;
}
`;
}

function fieldU(tab: CFDTab, patches: FoamPatch[]): string {
  const boundary = patches
    .map((p) => {
      switch (p.type) {
        case "inlet":
        case "freestream":
        case "movingWall": {
          const U = p.velocity ?? defaultInletU(tab.flowDirection);
          if (p.type === "freestream") {
            return `    ${p.name}
    {
        type            freestreamVelocity;
        freestreamValue uniform ${vec(U)};
    }`;
          }
          return `    ${p.name}
    {
        type            fixedValue;
        value           uniform ${vec(U)};
    }`;
        }
        case "outlet":
          return `    ${p.name}
    {
        type            zeroGradient;
    }`;
        case "symmetry":
          return `    ${p.name}
    {
        type            symmetry;
    }`;
        default:
          return `    ${p.name}
    {
        type            noSlip;
    }`;
      }
    })
    .join("\n");
  return `${foamFile("volVectorField", "U", "0")}
dimensions      [0 1 -1 0 0 0 0];
internalField   uniform (0 0 0);
boundaryField
{
${boundary}
}
`;
}

function fieldP(_tab: CFDTab, patches: FoamPatch[]): string {
  const boundary = patches
    .map((p) => {
      switch (p.type) {
        case "outlet":
          return `    ${p.name}
    {
        type            fixedValue;
        value           uniform ${p.gaugePressure ?? 0};
    }`;
        case "freestream":
          return `    ${p.name}
    {
        type            freestreamPressure;
        freestreamValue uniform 0;
    }`;
        case "symmetry":
          return `    ${p.name}
    {
        type            symmetry;
    }`;
        default:
          return `    ${p.name}
    {
        type            zeroGradient;
    }`;
      }
    })
    .join("\n");
  return `${foamFile("volScalarField", "p", "0")}
dimensions      [0 2 -2 0 0 0 0];
internalField   uniform 0;
boundaryField
{
${boundary}
}
`;
}

function wallFn(name: string, type: string, value: string): string {
  return `    ${name}
    {
        type            ${type};
        value           uniform ${value};
    }`;
}

function scalarBC(
  patches: FoamPatch[],
  inletValue: string,
  wallType: string,
  wallValue: string,
): string {
  return patches
    .map((p) => {
      switch (p.type) {
        case "inlet":
        case "freestream":
        case "movingWall":
          return `    ${p.name}
    {
        type            fixedValue;
        value           uniform ${inletValue};
    }`;
        case "symmetry":
          return `    ${p.name}
    {
        type            symmetry;
    }`;
        case "outlet":
          return `    ${p.name}
    {
        type            zeroGradient;
    }`;
        default:
          return wallFn(p.name, wallType, wallValue);
      }
    })
    .join("\n");
}

function charLengthM(tab: CFDTab): number {
  // Mixing length ~ 0.07 * 0.1 m as a documented default when we don't have SI Lref.
  void tab;
  return 0.1;
}

function fieldK(patches: FoamPatch[]): string {
  const k = kFromU(inletSpeed(patches));
  return `${foamFile("volScalarField", "k", "0")}
dimensions      [0 2 -2 0 0 0 0];
internalField   uniform ${k};
boundaryField
{
${scalarBC(patches, String(k), "kqRWallFunction", String(k))}
}
`;
}

function fieldEpsilon(tab: CFDTab, patches: FoamPatch[]): string {
  const k = kFromU(inletSpeed(patches));
  const e = epsFromK(k, charLengthM(tab));
  return `${foamFile("volScalarField", "epsilon", "0")}
dimensions      [0 2 -3 0 0 0 0];
internalField   uniform ${e};
boundaryField
{
${scalarBC(patches, String(e), "epsilonWallFunction", String(e))}
}
`;
}

function fieldOmega(tab: CFDTab, patches: FoamPatch[]): string {
  const k = kFromU(inletSpeed(patches));
  const e = epsFromK(k, charLengthM(tab));
  const w = omegaFromKE(k, e);
  return `${foamFile("volScalarField", "omega", "0")}
dimensions      [0 0 -1 0 0 0 0];
internalField   uniform ${w};
boundaryField
{
${scalarBC(patches, String(w), "omegaWallFunction", String(w))}
}
`;
}

function fieldNut(tab: CFDTab, patches: FoamPatch[]): string {
  void tab;
  return `${foamFile("volScalarField", "nut", "0")}
dimensions      [0 2 -1 0 0 0 0];
internalField   uniform 0;
boundaryField
{
${scalarBC(patches, "0", "nutkWallFunction", "0")}
}
`;
}

function allrunScript(solver: FoamSolver): string {
  return `#!/bin/sh
cd "\${0%/*}" || exit
. \${WM_PROJECT_DIR:?}/bin/tools/RunFunctions
runApplication blockMesh
runApplication snappyHexMesh -overwrite
runApplication ${solver}
`;
}

function allcleanScript(): string {
  return `#!/bin/sh
cd "\${0%/*}" || exit
. \${WM_PROJECT_DIR:?}/bin/tools/CleanFunctions
cleanCase
`;
}
