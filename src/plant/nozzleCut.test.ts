/**
 * Nozzle bore tests. A vertical nozzle produces a real OCCT cut; one that misses
 * the shell is dropped. Runs the real kernel.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/plant/nozzleCut.test.ts
 */
import { OcctKernel } from "occt-wasm";
import { planNozzleCut } from "./nozzleCut.ts";
import { makeEquipment, makeNozzle } from "../model/plant.ts";
import { regenerate } from "../kernel/regen.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const k = await OcctKernel.init();

function maxZ(positions: Float32Array): number {
  let z = -Infinity;
  for (let i = 2; i < positions.length; i += 3) if (positions[i] > z) z = positions[i];
  return z;
}

function topRing(positions: Float32Array): { inner: number; covered: boolean } {
  const top = maxZ(positions);
  let inner = Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i + 2] < top - 1) continue;
    const r = Math.hypot(positions[i], positions[i + 1]);
    if (r < inner) inner = r;
  }
  return { inner, covered: inner < 1 };
}

{
  console.log("vertical nozzle bores the shell");
  const vessel = makeEquipment("V", "vessel", { x: 0, y: 0, z: 0 }, 1000, 2000);
  const top = vessel.datums.find((d) => d.name === "Top")!;
  const nozzle = makeNozzle(top.id, { x: 0, y: 0, z: 0 }, top.direction, 100, "150", "flanged", false);
  vessel.nozzles.push(nozzle);

  const solid = planNozzleCut(vessel, []);
  const cut = planNozzleCut(vessel, [nozzle]);
  const solidMesh = regenerate(k, solid.tree);
  const cutMesh = regenerate(k, cut.tree);
  check("cut planned", cut.hasCut);
  check("nothing dropped", cut.dropped.length === 0);
  check("both regenerate", solidMesh.mesh !== null && cutMesh.mesh !== null);
  const solidTop = topRing(solidMesh.mesh!.positions);
  const cutTop = topRing(cutMesh.mesh!.positions);
  check(
    "bore opens the top",
    cutTop.inner < nozzle.nps / 2 + 5 && solidTop.inner > nozzle.nps / 2 + 5,
    `solid r=${solidTop.inner.toFixed(1)} cut r=${cutTop.inner.toFixed(1)}`,
  );
  check("no leaked handles", k.shapeCount === 0, `shapeCount=${k.shapeCount}`);
}

{
  console.log("a nozzle outside the shell is dropped");
  const vessel = makeEquipment("V", "vessel", { x: 0, y: 0, z: 0 }, 1000, 2000);
  const nozzle = makeNozzle(null, { x: 5000, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, 100, "150", "flanged", true);
  const plan = planNozzleCut(vessel, [nozzle]);
  check("dropped", plan.dropped.length === 1);
  check("no cut", !plan.hasCut);
}

{
  console.log("a horizontal nozzle is not bored");
  const vessel = makeEquipment("V", "vessel", { x: 0, y: 0, z: 0 }, 1000, 2000);
  const side = vessel.datums.find((d) => d.name === "Side")!;
  const nozzle = makeNozzle(side.id, { x: 0, y: 0, z: 0 }, side.direction, 100, "150", "flanged", false);
  const plan = planNozzleCut(vessel, [nozzle]);
  check("skipped", plan.dropped.length === 1 && /not vertical/.test(plan.dropped[0].reason));
  check("no cut", !plan.hasCut);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
