/**
 * Host-cut wall tests (Phase 15): the synthetic cut tree produces a real OCCT
 * boolean, and the plan flags openings that don't fit. Runs the REAL kernel.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/bim/wallCut.test.ts
 */
import { OcctKernel } from "occt-wasm";
import { planWallCut, transformMesh } from "./wallCut.ts";
import { makeWall, makeDoor, makeLevel } from "../model/bim.ts";
import { regenerate } from "../kernel/regen.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const k = await OcctKernel.init();
const level = makeLevel("L1", 0, 3000);

{
  console.log("wall with a door → boolean cut");
  const wall = makeWall(level.id, { x: 0, y: 0 }, { x: 5000, y: 0 }, 200, 3000);
  const door = makeDoor(level.id, wall.id, 0.5, 900, 2100);

  // Solid wall (no openings) face + volume baseline.
  const solidPlan = planWallCut(wall, [], level);
  const solid = regenerate(k, solidPlan.tree);
  const cutPlan = planWallCut(wall, [door], level);
  const cut = regenerate(k, cutPlan.tree);

  check("solid wall regenerates", solid.mesh !== null);
  check("cut wall regenerates", cut.mesh !== null);
  // A door cut opens a through-hole → more faces than a plain box (6).
  check(
    "cut adds faces (hole present)",
    (cut.mesh?.faceCount ?? 0) > (solid.mesh?.faceCount ?? 0),
    `solid=${solid.mesh?.faceCount} cut=${cut.mesh?.faceCount}`,
  );
  check("cut plan has a cut", cutPlan.hasCut);
  check("no dropped openings", cutPlan.dropped.length === 0);
  check("kernel no leak", k.shapeCount === 0, `shapeCount=${k.shapeCount}`);
}

{
  console.log("opening that doesn't fit → dropped/flagged");
  const wall = makeWall(level.id, { x: 0, y: 0 }, { x: 1000, y: 0 }, 200, 2000);
  // Door wider than the wall.
  const tooWide = makeDoor(level.id, wall.id, 0.5, 3000, 1800);
  const plan = planWallCut(wall, [tooWide], level);
  check("oversized opening dropped", plan.dropped.length === 1);
  check("dropped reason mentions ends", /past the wall ends/.test(plan.dropped[0].reason));
  check("no cut when all dropped", !plan.hasCut);

  // Door taller than wall.
  const tooTall = makeDoor(level.id, wall.id, 0.5, 800, 3000);
  const plan2 = planWallCut(wall, [tooTall], level);
  check("too-tall opening dropped", plan2.dropped.length === 1 && /taller/.test(plan2.dropped[0].reason));
}

{
  console.log("transformMesh places diagonal wall in world");
  // Wall from origin along +Y (local X maps to world +Y).
  const wall = makeWall(level.id, { x: 0, y: 0 }, { x: 0, y: 4000 }, 200, 3000);
  const plan = planWallCut(wall, [], level);
  const res = regenerate(k, plan.tree);
  const world = transformMesh(res.mesh!, plan.transform);
  // World bbox should span ~4000 in Y and ~200 in X.
  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
  for (let i = 0; i < world.positions.length; i += 3) {
    xmin = Math.min(xmin, world.positions[i]);
    xmax = Math.max(xmax, world.positions[i]);
    ymin = Math.min(ymin, world.positions[i + 1]);
    ymax = Math.max(ymax, world.positions[i + 1]);
  }
  check("diagonal wall spans Y ~4000", Math.abs(ymax - ymin - 4000) < 1, `${ymax - ymin}`);
  check("diagonal wall spans X ~200", Math.abs(xmax - xmin - 200) < 1, `${xmax - xmin}`);
  check("kernel no leak (2)", k.shapeCount === 0);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
