/**
 * BIM data-model tests (Phase 14): factories + referential validation.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/model/bim.test.ts
 */
import { makeBIMTab, makeWall, makeDoor, validateBIM } from "./bim.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

{
  console.log("factory defaults");
  const tab = makeBIMTab("Building A");
  check("kind is bim", tab.kind === "bim");
  check("starts with one level", tab.levels.length === 1);
  check("no components initially", tab.components.length === 0);
}

{
  console.log("validation");
  const tab = makeBIMTab("B");
  const level = tab.levels[0];
  const wall = makeWall(level.id, { x: 0, y: 0 }, { x: 5000, y: 0 });
  tab.components.push(wall);
  check("valid tab passes", validateBIM(tab).ok);

  // Component referencing a missing level → invalid.
  const orphan = makeWall("no-such-level", { x: 0, y: 0 }, { x: 1, y: 0 });
  tab.components.push(orphan);
  check("orphan level → invalid", !validateBIM(tab).ok);
  tab.components.pop();

  // Door hosted on a real wall → valid; on a missing wall → invalid.
  tab.components.push(makeDoor(level.id, wall.id));
  check("hosted door valid", validateBIM(tab).ok);
  tab.components.push(makeDoor(level.id, "no-such-wall"));
  check("door with missing host → invalid", !validateBIM(tab).ok);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
