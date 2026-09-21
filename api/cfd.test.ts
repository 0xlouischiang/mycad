/**
 * CFD API handler tests — validation + 404/400. Does not start Docker.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        api/cfd.test.ts
 */
import { handleCfd } from "./cfd.ts";
import {
  validateFileMap,
  parseScalarRaw,
  parseVectorMagRaw,
  parseVtkAscii,
  _resetJobsForTests,
} from "./cfdRunner.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

_resetJobsForTests();

{
  console.log("validateFileMap");
  const good = {
    "system/controlDict": "FoamFile { object controlDict; }",
    "constant/triSurface/geometry.stl": "solid walls\nendsolid walls\n",
    "0/U": "inlet { type fixedValue; }\noutlet { type zeroGradient; }\n",
  };
  check("valid map", validateFileMap(good, "simpleFoam").ok);
  check("bad solver", !validateFileMap(good, "rhoPimpleFoam").ok);
  check("path traversal", !validateFileMap({ ...good, "../etc/passwd": "x" }, "simpleFoam").ok);
  check("absolute path", !validateFileMap({ ...good, "/tmp/x": "x" }, "simpleFoam").ok);
  check("unknown path", !validateFileMap({ ...good, "evil.sh": "x" }, "simpleFoam").ok);
  const noU = { ...good, "0/U": "walls { type noSlip; }" };
  check("missing inlet/outlet", !validateFileMap(noU, "simpleFoam").ok);
}

{
  console.log("handleCfd routing");
  const bad = await handleCfd({
    method: "POST",
    path: "/submit",
    body: { files: {}, solver: "simpleFoam" },
  });
  check("empty files 400", bad.status === 400);
  const missing = await handleCfd({ method: "GET", path: "/status/nope" });
  check("unknown job 404", missing.status === 404);
  const notfound = await handleCfd({ method: "GET", path: "/nope" });
  check("unknown route 404", notfound.status === 404);
}

{
  console.log("raw / vtk parsers");
  const p = parseScalarRaw("# x y z p\n0 0 0 1.5\n1 0 0 2.5\n");
  check("scalar raw", p.length === 2 && p[0] === 1.5 && p[1] === 2.5);
  const mag = parseVectorMagRaw("# x y z ux uy uz\n0 0 0 3 4 0\n");
  check("vector mag", mag.length === 1 && mag[0] === 5);
  const vtk = parseVtkAscii(`# vtk DataFile
ASCII
DATASET POLYDATA
POINTS 2 float
0 0 0
1 0 0
POINT_DATA 2
SCALARS p float
LOOKUP_TABLE default
10
20
VECTORS U float
1 0 0
0 3 4
`);
  check("vtk p", vtk.p.length === 2 && vtk.p[0] === 10 && vtk.p[1] === 20);
  check("vtk magU", vtk.magU.length === 2 && vtk.magU[1] === 5);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
