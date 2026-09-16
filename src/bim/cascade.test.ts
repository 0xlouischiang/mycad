/**
 * Cascade + space-tracing tests (Phase 15). Pure — no kernel.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/bim/cascade.test.ts
 */
import {
  reconcileBim,
  traceEnclosingLoop,
  shoelace,
  pointInPolygon,
} from "./cascade.ts";
import {
  makeBIMTab,
  makeWall,
  makeDoor,
  makeSpace,
  type Wall,
} from "../model/bim.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

/** Four walls enclosing a w×h rectangle from (0,0). */
function roomWalls(levelId: string, w: number, h: number): Wall[] {
  return [
    makeWall(levelId, { x: 0, y: 0 }, { x: w, y: 0 }),
    makeWall(levelId, { x: w, y: 0 }, { x: w, y: h }),
    makeWall(levelId, { x: w, y: h }, { x: 0, y: h }),
    makeWall(levelId, { x: 0, y: h }, { x: 0, y: 0 }),
  ];
}

{
  console.log("opening cascade (host resize / delete)");
  const tab = makeBIMTab("B");
  const level = tab.levels[0];
  const wall = makeWall(level.id, { x: 0, y: 0 }, { x: 5000, y: 0 }, 200, 3000);
  const door = makeDoor(level.id, wall.id, 0.5, 900, 2100);
  tab.components.push(wall, door);

  let r = reconcileBim(tab);
  let d = r.components.find((c) => c.id === door.id)!;
  check("fitting door has no warning", d.type === "door" && d.warning === undefined);

  // Shrink the wall so the centered door no longer fits.
  const shrunk = { ...tab, components: tab.components.map((c) => (c.id === wall.id ? { ...(c as Wall), end: { x: 500, y: 0 } } : c)) };
  r = reconcileBim(shrunk);
  d = r.components.find((c) => c.id === door.id)!;
  check("door flagged after host shrink", d.type === "door" && !!d.warning, d.type === "door" ? String(d.warning) : "");

  // Delete the host wall → door removed (no orphan).
  const noWall = { ...tab, components: tab.components.filter((c) => c.id !== wall.id) };
  r = reconcileBim(noWall);
  check("orphan door removed when host deleted", !r.components.some((c) => c.id === door.id));
}

{
  console.log("geometry helpers");
  const sq = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  check("shoelace area of 10×10 = 100", Math.abs(Math.abs(shoelace(sq)) - 100) < 1e-9);
  check("point inside", pointInPolygon({ x: 5, y: 5 }, sq));
  check("point outside", !pointInPolygon({ x: 15, y: 5 }, sq));
}

{
  console.log("space tracing");
  const tab = makeBIMTab("B");
  const level = tab.levels[0];
  const walls = roomWalls(level.id, 6000, 4000);
  tab.components.push(...walls);
  const space = makeSpace(level.id, { x: 3000, y: 2000 }); // seed inside
  tab.components.push(space);

  const r = reconcileBim(tab);
  const s = r.components.find((c) => c.id === space.id)!;
  check("space traced", s.type === "space" && s.boundary.length >= 4);
  check(
    "space area = 6000×4000",
    s.type === "space" && Math.abs(s.area - 6000 * 4000) < 1,
    s.type === "space" ? `${s.area}` : "",
  );
  check(
    "space volume = area × level height",
    s.type === "space" && Math.abs(s.volume - 6000 * 4000 * level.height) < 1,
  );
  check("space records 4 bounding walls", s.type === "space" && s.boundaryWallIds.length === 4);
  check("no warning for enclosed space", s.type === "space" && s.warning === undefined);

  // Remove a wall → the loop breaks → space flagged.
  const broken = { ...tab, components: tab.components.filter((c) => c.id !== walls[0].id) };
  const r2 = reconcileBim(broken);
  const s2 = r2.components.find((c) => c.id === space.id)!;
  check("space flagged when a bounding wall is removed", s2.type === "space" && !!s2.warning);
}

{
  console.log("traceEnclosingLoop direct");
  const walls = roomWalls("L", 1000, 1000);
  const loop = traceEnclosingLoop({ x: 500, y: 500 }, walls);
  check("loop found", loop !== null);
  check("loop has 4 walls", loop?.wallIds.length === 4);
  const outside = traceEnclosingLoop({ x: 5000, y: 5000 }, walls);
  check("no loop for outside seed", outside === null);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
