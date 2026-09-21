/**
 * caseGen: OpenFOAM.org v11 dict generation for three fixture combinations.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/cfd/caseGen.test.ts
 */
import { generateCase, chooseSolver, resolveDomain } from "./caseGen.ts";
import { makeCFDTab, makeBoundaryPatch, FLUID_WATER } from "../model/cfd.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const bbox = {
  min: [0, 0, 0] as [number, number, number],
  max: [10, 4, 4] as [number, number, number],
};

function stlFor(names: string[]): string {
  return names
    .map(
      (n) => `solid ${n}
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 0.01 0 0
      vertex 0 0.01 0
    endloop
  endfacet
endsolid ${n}
`,
    )
    .join("");
}

{
  console.log("chooseSolver");
  check("steady → simpleFoam", chooseSolver("steadyIncompressible") === "simpleFoam");
  check("transient → pimpleFoam", chooseSolver("transientIncompressible") === "pimpleFoam");
}

{
  console.log("duct: internal laminar inlet/outlet/walls");
  const tab = makeCFDTab("duct", "ps1");
  tab.flowType = "internal";
  tab.turbulenceModel = "laminar";
  tab.regime = "steadyIncompressible";
  tab.boundaryPatches = [
    makeBoundaryPatch("0,2,2", "inlet", "inlet", { velocity: [1, 0, 0] }),
    makeBoundaryPatch("10,2,2", "outlet", "outlet", { gaugePressure: 0 }),
    makeBoundaryPatch("5,0,2", "wall", "walls"),
  ];
  const domain = resolveDomain(tab, bbox);
  const result = generateCase({
    tab,
    bbox,
    stl: stlFor(["inlet", "outlet", "walls"]),
    domainBox: domain,
  });
  check("ok", result.ok, result.ok ? "" : result.error);
  if (result.ok) {
    check("simpleFoam", result.solver === "simpleFoam");
    check("has controlDict", !!result.files["system/controlDict"]);
    check("application simpleFoam", /application\s+simpleFoam/.test(result.files["system/controlDict"]));
    check("has STL", !!result.files["constant/triSurface/geometry.stl"]);
    check("nu dimension set", /nu\s+\[0 2 -1 0 0 0 0\]/.test(result.files["constant/transportProperties"]));
    check("laminar", /simulationType\s+laminar/.test(result.files["constant/turbulenceProperties"]));
    check("no k", !result.files["0/k"]);
    check("inlet fixedValue U", /inlet[\s\S]*fixedValue/.test(result.files["0/U"]));
    check("outlet noSlip absent on outlet", /outlet[\s\S]*zeroGradient/.test(result.files["0/U"]));
    check("walls noSlip", /walls[\s\S]*noSlip/.test(result.files["0/U"]));
    check("locationInMesh present", /locationInMesh/.test(result.files["system/snappyHexMeshDict"]));
    check("regions named", /inlet\s+\{\s*name inlet/.test(result.files["system/snappyHexMeshDict"]));
    check("Allrun blockMesh", /runApplication blockMesh/.test(result.files.Allrun));
    check("Allrun simpleFoam", /runApplication simpleFoam/.test(result.files.Allrun));
    check("surfaces sampling", /triSurfaceMesh/.test(result.files["system/controlDict"]));
    // blockMesh vertices in metres: 10 mm → 0.01
    check("metres not mm", /0\.01/.test(result.files["system/blockMeshDict"]));
  }
}

{
  console.log("external-rans: kEpsilon + forceCoeffs");
  const tab = makeCFDTab("ext", "ps1");
  tab.flowType = "external";
  tab.flowDirection = "x";
  tab.turbulenceModel = "kEpsilon";
  tab.boundaryPatches = [makeBoundaryPatch("5,2,4", "wall", "walls")];
  const domain = resolveDomain(tab, bbox);
  const result = generateCase({
    tab,
    bbox,
    stl: stlFor(["walls"]),
    domainBox: domain,
  });
  check("ok", result.ok, result.ok ? "" : result.error);
  if (result.ok) {
    check("kEpsilon model", /model\s+kEpsilon/.test(result.files["constant/turbulenceProperties"]));
    check("has 0/k", !!result.files["0/k"]);
    check("has 0/epsilon", !!result.files["0/epsilon"]);
    check("no 0/omega", !result.files["0/omega"]);
    check("forceCoeffs", /forceCoeffs/.test(result.files["system/controlDict"]));
    check("far-field inlet in 0/U", /inlet/.test(result.files["0/U"]));
    check("RAS simulationType", /simulationType\s+RAS/.test(result.files["constant/turbulenceProperties"]));
  }
}

{
  console.log("transient-komega: pimpleFoam + omega");
  const tab = makeCFDTab("trans", "ps1");
  tab.flowType = "internal";
  tab.regime = "transientIncompressible";
  tab.turbulenceModel = "kOmegaSST";
  tab.fluid = { ...FLUID_WATER };
  tab.boundaryPatches = [
    makeBoundaryPatch("0,2,2", "inlet", "inlet", { velocity: [0.5, 0, 0] }),
    makeBoundaryPatch("10,2,2", "outlet", "outlet", { gaugePressure: 0 }),
  ];
  const domain = resolveDomain(tab, bbox);
  const result = generateCase({
    tab,
    bbox,
    stl: stlFor(["inlet", "outlet", "walls"]),
    domainBox: domain,
  });
  check("ok", result.ok, result.ok ? "" : result.error);
  if (result.ok) {
    check("pimpleFoam", result.solver === "pimpleFoam");
    check("application pimpleFoam", /application\s+pimpleFoam/.test(result.files["system/controlDict"]));
    check("has omega", !!result.files["0/omega"]);
    check("no epsilon", !result.files["0/epsilon"]);
    check("kOmegaSST", /model\s+kOmegaSST/.test(result.files["constant/turbulenceProperties"]));
    check("Euler ddt", /default\s+Euler/.test(result.files["system/fvSchemes"]));
    check("PIMPLE", /PIMPLE/.test(result.files["system/fvSolution"]));
    check("water nu", result.files["constant/transportProperties"].includes(String(FLUID_WATER.kinematicViscosity)));
  }
}

{
  console.log("validation failures");
  const tab = makeCFDTab("bad", "ps1");
  tab.flowType = "internal";
  const bad = generateCase({
    tab,
    bbox,
    stl: stlFor(["walls"]),
    domainBox: bbox,
  });
  check("internal without inlet/outlet fails", !bad.ok);
  const tiny = makeCFDTab("tiny", "ps1");
  tiny.flowType = "external";
  tiny.domainBox = { min: [1, 1, 1], max: [2, 2, 2] };
  tiny.boundaryPatches = [makeBoundaryPatch("0,0,0", "freestream", "freestream")];
  const enclosed = generateCase({
    tab: tiny,
    bbox,
    stl: stlFor(["walls"]),
    domainBox: tiny.domainBox,
  });
  check("domain not enclosing fails", !enclosed.ok);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
