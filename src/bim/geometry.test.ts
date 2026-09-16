/**
 * BIM procedural-geometry tests (Phase 14). Pure — no kernel, no DOM.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/bim/geometry.test.ts
 */
import {
  wallMesh,
  columnMesh,
  beamMesh,
  slabMesh,
  meshBBox,
  triangulate,
} from "./geometry.ts";
import { makeLevel, makeWall, makeColumn, makeBeam, makeSlab } from "../model/bim.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}
const approx = (a: number, b: number, eps = 1e-3) => Math.abs(a - b) < eps;

const level = makeLevel("L1", 0, 3000);

{
  console.log("wall mesh");
  // Axis-aligned wall along +X: length 5000, thickness 200, height 3000.
  const w = makeWall(level.id, { x: 0, y: 0 }, { x: 5000, y: 0 }, 200, 3000);
  const m = wallMesh(w, level);
  const bb = meshBBox(m);
  check("wall length (X)", approx(bb.max[0] - bb.min[0], 5000), `${bb.max[0] - bb.min[0]}`);
  check("wall thickness (Y)", approx(bb.max[1] - bb.min[1], 200), `${bb.max[1] - bb.min[1]}`);
  check("wall height (Z)", approx(bb.max[2] - bb.min[2], 3000), `${bb.max[2] - bb.min[2]}`);
  check("wall base at level elevation", approx(bb.min[2], 0));
  check("box has 6 quads = 12 tris", m.indices.length === 36, `${m.indices.length}`);

  // Diagonal wall: bbox should span the diagonal + thickness slop.
  const d = makeWall(level.id, { x: 0, y: 0 }, { x: 3000, y: 4000 }, 200, 3000);
  const dm = meshBBox(wallMesh(d, level));
  check("diagonal wall spans X", dm.max[0] - dm.min[0] > 3000);
  check("diagonal wall spans Y", dm.max[1] - dm.min[1] > 4000);
}

{
  console.log("column mesh");
  const c = makeColumn(level.id, { x: 1000, y: 1000 }, 400, 400, 3000);
  const bb = meshBBox(columnMesh(c, level));
  check("column width X", approx(bb.max[0] - bb.min[0], 400));
  check("column depth Y", approx(bb.max[1] - bb.min[1], 400));
  check("column height Z", approx(bb.max[2] - bb.min[2], 3000));
  check("column centered at at.x", approx((bb.min[0] + bb.max[0]) / 2, 1000));
}

{
  console.log("beam mesh");
  const b = makeBeam(level.id, { x: 0, y: 0 }, { x: 4000, y: 0 }, 300, 500);
  const bb = meshBBox(beamMesh(b, level));
  check("beam length X", approx(bb.max[0] - bb.min[0], 4000));
  check("beam width Y", approx(bb.max[1] - bb.min[1], 300));
  check("beam depth Z", approx(bb.max[2] - bb.min[2], 500));
  // Beam sits at top of storey: underside at height - depth = 2500.
  check("beam underside at storey top - depth", approx(bb.min[2], 3000 - 500), `${bb.min[2]}`);
}

{
  console.log("slab mesh");
  // 6000 x 4000 rectangular slab, thickness 250, top at elevation 0.
  const s = makeSlab(
    level.id,
    [
      { x: 0, y: 0 },
      { x: 6000, y: 0 },
      { x: 6000, y: 4000 },
      { x: 0, y: 4000 },
    ],
    250,
  );
  const bb = meshBBox(slabMesh(s, level));
  check("slab X span", approx(bb.max[0] - bb.min[0], 6000));
  check("slab Y span", approx(bb.max[1] - bb.min[1], 4000));
  check("slab thickness Z", approx(bb.max[2] - bb.min[2], 250));
  check("slab top at elevation", approx(bb.max[2], 0));
}

{
  console.log("triangulation");
  // A square → 2 triangles.
  const sq = triangulate([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]);
  check("square → 2 triangles", sq.length === 2, `${sq.length}`);
  // An L-shape (concave hexagon) → 4 triangles.
  const L = triangulate([
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 20, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 20 },
    { x: 0, y: 20 },
  ]);
  check("L-shape → 4 triangles", L.length === 4, `${L.length}`);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
