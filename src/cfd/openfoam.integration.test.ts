/**
 * Optional OpenFOAM Docker smoke test. NOT part of `npm test`.
 *
 *   OPENFOAM_TEST_IMAGE=openfoam/openfoam11-paraviewopenfoam \
 *     node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *          src/cfd/openfoam.integration.test.ts
 *
 * Writes the duct fixture to a temp dir and runs Allrun in the image. Asserts
 * the solver log contains "End". Skips (exit 0) when the env var is unset.
 */
import { mkdtemp, writeFile, mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawn } from "node:child_process";
import { generateCase, resolveDomain } from "./caseGen.ts";
import { makeCFDTab, makeBoundaryPatch } from "../model/cfd.ts";

const image = process.env.OPENFOAM_TEST_IMAGE;
if (!image) {
  console.log("SKIP: OPENFOAM_TEST_IMAGE unset");
  process.exit(0);
}

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const bbox = {
  min: [0, 0, 0] as [number, number, number],
  max: [10, 4, 4] as [number, number, number],
};
const tab = makeCFDTab("duct", "ps1");
tab.flowType = "internal";
tab.turbulenceModel = "laminar";
tab.regime = "steadyIncompressible";
tab.solverControl = { endTime: 2, deltaT: 1, writeInterval: 1 };
tab.meshSettings = { baseCellSize: 5, surfaceRefinementLevels: [0, 1], boundaryLayers: 0 };
tab.boundaryPatches = [
  makeBoundaryPatch("0,2,2", "inlet", "inlet", { velocity: [1, 0, 0] }),
  makeBoundaryPatch("10,2,2", "outlet", "outlet", { gaugePressure: 0 }),
];
const stl = `solid inlet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 0.004 0
      vertex 0 0.004 0.004
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex 0 0 0
      vertex 0 0.004 0.004
      vertex 0 0 0.004
    endloop
  endfacet
endsolid inlet
solid outlet
  facet normal 1 0 0
    outer loop
      vertex 0.01 0 0
      vertex 0.01 0 0.004
      vertex 0.01 0.004 0.004
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex 0.01 0 0
      vertex 0.01 0.004 0.004
      vertex 0.01 0.004 0
    endloop
  endfacet
endsolid outlet
solid walls
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 0.01 0 0
      vertex 0.01 0.004 0
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 0.01 0.004 0
      vertex 0 0.004 0
    endloop
  endfacet
endsolid walls
`;
const result = generateCase({
  tab,
  bbox,
  stl,
  domainBox: resolveDomain(tab, bbox),
});
if (!result.ok) {
  console.error(result.error);
  process.exit(1);
}

const dir = await mkdtemp(join(tmpdir(), "mycad-cfdof-"));
for (const [rel, content] of Object.entries(result.files)) {
  const dest = join(dir, ...rel.split("/"));
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, content);
}

const script =
  "set -e; " +
  "if [ -f /opt/openfoam11/etc/bashrc ]; then . /opt/openfoam11/etc/bashrc; fi; " +
  "if [ -f /usr/lib/openfoam/openfoam11/etc/bashrc ]; then . /usr/lib/openfoam/openfoam11/etc/bashrc; fi; " +
  "blockMesh && snappyHexMesh -overwrite && simpleFoam";

const code: number = await new Promise((resolve) => {
  const child = spawn(
    "docker",
    [
      "run",
      "--rm",
      "--network",
      "none",
      "-v",
      `${dir}:/case:rw`,
      "--workdir",
      "/case",
      "--entrypoint",
      "bash",
      image,
      "-lc",
      script,
    ],
    { stdio: "inherit" },
  );
  child.on("close", (c) => resolve(c ?? 1));
  child.on("error", () => resolve(1));
});
check("docker run exited 0", code === 0, `code=${code}`);
try {
  const log = await readFile(join(dir, "log.simpleFoam"), "utf8");
  check("solver End", /End/.test(log));
} catch {
  check("solver End", false, "log.simpleFoam missing");
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
