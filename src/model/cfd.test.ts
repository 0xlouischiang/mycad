/**
 * CFD data-model tests: factories + structural validation.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/model/cfd.test.ts
 */
import {
  makeCFDTab,
  makeBoundaryPatch,
  validateCFD,
  autoDomainBox,
  characteristicLength,
  FLUID_AIR,
} from "./cfd.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

{
  console.log("factory defaults");
  const tab = makeCFDTab("Flow 1", "tab-1");
  check("kind is cfd", tab.kind === "cfd");
  check("sourceTab set", tab.sourceTab === "tab-1");
  check("no patches initially", tab.boundaryPatches.length === 0);
  check("default fluid is air", tab.fluid.density === FLUID_AIR.density);
  check("default laminar", tab.turbulenceModel === "laminar");
  check("default steady", tab.regime === "steadyIncompressible");
  check("default external", tab.flowType === "external");
  check("run idle", tab.run.status === "idle" && tab.run.jobId === null);
  check("no results", tab.results === null);
}

{
  console.log("validation");
  const tab = makeCFDTab("F", "t");
  check("empty patches → missing inlet", !validateCFD(tab).ok);

  tab.boundaryPatches.push(makeBoundaryPatch("0,0,10", "inlet", "inlet", { velocity: [1, 0, 0] }));
  check("inlet only → missing outlet", !validateCFD(tab).ok);

  tab.boundaryPatches.push(makeBoundaryPatch("10,0,10", "outlet", "outlet", { gaugePressure: 0 }));
  check("inlet+outlet valid", validateCFD(tab).ok);

  tab.boundaryPatches.push(makeBoundaryPatch("5,0,10", "wall", "1bad"));
  check("illegal patch name rejected", !validateCFD(tab).ok);
  tab.boundaryPatches.pop();

  tab.boundaryPatches.push(makeBoundaryPatch("5,0,0", "wall", "inlet"));
  check("duplicate name rejected", !validateCFD(tab).ok);
  tab.boundaryPatches.pop();

  tab.meshSettings.baseCellSize = 0;
  check("zero cell size rejected", !validateCFD(tab).ok);
  tab.meshSettings.baseCellSize = 5;

  tab.solverControl.endTime = 0;
  check("zero endTime rejected", !validateCFD(tab).ok);
}

{
  console.log("auto domain");
  const bbox = { min: [0, 0, 0] as [number, number, number], max: [10, 4, 4] as [number, number, number] };
  check("char length is longest axis", characteristicLength(bbox) === 10);
  const ext = autoDomainBox(bbox, { upstream: 3, downstream: 6, lateral: 2, vertical: 1 }, "external", "x");
  check("external upstream -3L", Math.abs(ext.min[0] - -30) < 1e-9);
  check("external downstream +6L", Math.abs(ext.max[0] - 70) < 1e-9);
  const inn = autoDomainBox(bbox, { upstream: 3, downstream: 6, lateral: 2, vertical: 1 }, "internal", "x");
  check("internal still encloses", inn.min[0] < 0 && inn.max[0] > 10);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
