/**
 * Integration test for the REAL regeneration engine (regen.ts), exercising
 * every feature type end-to-end against the actual occt-wasm kernel.
 *
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/kernel/regen.test.ts
 *
 * The ts-resolve hook lets extensionless app imports load under Node. This is a
 * durable regression guard replacing the throwaway per-feature scripts: it
 * asserts face counts + per-feature statuses, and confirms the kernel's live
 * shape count returns to 0 after each regen (no handle leaks).
 */
import { OcctKernel } from "occt-wasm";
import { regenerate, exportTree, massPropsOfTree } from "./regen.ts";
import {
  makeDefaultFeature,
  makeExtrudeFeature,
  makeRevolveFeature,
  makeSketchFeature,
  makeFilletFeature,
  makeChamferFeature,
  makeHoleFeature,
  makeLoftFeature,
  makeSweepFeature,
  makeShellFeature,
  makeDraftFeature,
  makeSplitFeature,
  makeMirrorFeature,
  makeLinearPatternFeature,
  makeCircularPatternFeature,
  type FeatureTree,
} from "../model/featureTree.ts";
import { makeSketch } from "../model/sketch.ts";
import { faceRefFromPoints } from "../model/edgeRef.ts";
import { edgeRefFromPoints } from "../model/edgeRef.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const k = await OcctKernel.init();

/** Assert the kernel has no live shapes (no leaks) after a regen. */
function assertNoLeak(label: string) {
  check(`${label}: no handle leak`, k.shapeCount === 0, `shapeCount=${k.shapeCount}`);
}

/** Build a closed rectangle sketch feature at the given size on XY. */
function rectSketch(w: number, h: number) {
  const s = makeSketch("sk", "XY", 0);
  const p = (u: number, v: number) => {
    const id = `p${s.points.length}`;
    s.points.push({ id, u, v, fixed: false });
    return id;
  };
  const a = p(0, 0), b = p(w, 0), c = p(w, h), d = p(0, h);
  s.entities.push(
    { id: "l1", type: "line", p1: a, p2: b },
    { id: "l2", type: "line", p1: b, p2: c },
    { id: "l3", type: "line", p1: c, p2: d },
    { id: "l4", type: "line", p1: d, p2: a },
  );
  return makeSketchFeature(s, 1);
}

/** The faceRef of the highest-Z-centroid face in a mesh (a body's top face). */
function topFaceRef(m: NonNullable<ReturnType<typeof regenerate>["mesh"]>): string {
  let ref = "";
  let topZ = -Infinity;
  for (let g = 0; g < m.faceGroups.length; g += 3) {
    const s0 = m.faceGroups[g];
    const c0 = m.faceGroups[g + 1];
    const coords: number[] = [];
    let zsum = 0, n = 0;
    for (let i = s0; i < s0 + c0; i++) {
      const v = m.indices[i] * 3;
      coords.push(m.positions[v], m.positions[v + 1], m.positions[v + 2]);
      zsum += m.positions[v + 2];
      n++;
    }
    const zc = zsum / n;
    if (zc > topZ) {
      topZ = zc;
      ref = faceRefFromPoints(coords);
    }
  }
  return ref;
}

// --- Primitives -----------------------------------------------------------
{
  console.log("box + cylinder booleans");
  const box = makeDefaultFeature("box", 1, "new");
  const cyl = makeDefaultFeature("cylinder", 1, "remove");
  (cyl as { position: { x: number; y: number; z: number } }).position = {
    x: 20,
    y: 15,
    z: -5,
  };
  const tree: FeatureTree = { features: [box, cyl] };
  const res = regenerate(k, tree);
  check("box−cyl produces geometry", res.mesh !== null);
  check("all features ok", res.statuses.every((s) => s.state === "ok"));
  assertNoLeak("box−cyl");
}

// --- Extrude --------------------------------------------------------------
{
  console.log("extrude a rectangle");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new"); // distance 20 along +Z
  const res = regenerate(k, { features: [sk, ex] });
  check("extrude → 6 faces", res.mesh?.faceCount === 6, `faces=${res.mesh?.faceCount}`);
  check("extrude z 0..20", res.bbox != null && Math.abs(res.bbox.min[2]) < 1e-6 && Math.abs(res.bbox.max[2] - 20) < 1e-6, `z=${res.bbox?.min[2]}..${res.bbox?.max[2]}`);
  assertNoLeak("extrude");
}

// --- Symmetric extrude ----------------------------------------------------
{
  console.log("symmetric extrude straddles the sketch plane");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new");
  ex.params = { ...ex.params, distance: 20, symmetric: true };
  const res = regenerate(k, { features: [sk, ex] });
  // 2*distance total (=40), centered on z=0 → z from -20 to +20.
  check(
    "symmetric z -20..20",
    res.bbox != null && Math.abs(res.bbox.min[2] + 20) < 1e-6 && Math.abs(res.bbox.max[2] - 20) < 1e-6,
    `z=${res.bbox?.min[2]}..${res.bbox?.max[2]}`,
  );
  assertNoLeak("symmetric-extrude");
}

// --- Revolve --------------------------------------------------------------
{
  console.log("revolve a rectangle about v");
  const s = makeSketch("sk", "XZ", 0);
  const p = (u: number, v: number) => {
    const id = `p${s.points.length}`;
    s.points.push({ id, u, v, fixed: false });
    return id;
  };
  const a = p(10, 0), b = p(20, 0), c = p(20, 30), d = p(10, 30);
  s.entities.push(
    { id: "l1", type: "line", p1: a, p2: b },
    { id: "l2", type: "line", p1: b, p2: c },
    { id: "l3", type: "line", p1: c, p2: d },
    { id: "l4", type: "line", p1: d, p2: a },
  );
  const sk = makeSketchFeature(s, 1);
  const rev = makeRevolveFeature(sk.id, 1, "new");
  const res = regenerate(k, { features: [sk, rev] });
  check("revolve produces geometry", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("revolve");
}

// --- Fillet by geometric edge ref (stability path) ------------------------
{
  console.log("extrude then fillet a resolved edge");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new");
  const base = regenerate(k, { features: [sk, ex] });
  // Pick a real edge ref from the extruded body.
  const edges = base.edges!;
  const refs: string[] = [];
  for (let i = 0; i < edges.edgeGroups.length; i += 3) {
    const start = edges.edgeGroups[i];
    const count = edges.edgeGroups[i + 1];
    refs.push(edgeRefFromPoints(edges.points.slice(start, start + count)));
  }
  const fil = makeFilletFeature([refs[0]], 1);
  const res = regenerate(k, { features: [sk, ex, fil] });
  const fs = res.statuses.find((s) => s.featureId === fil.id);
  check("fillet applied ok", fs?.state === "ok", fs?.message);
  check("fillet added a face", (res.mesh?.faceCount ?? 0) > 6, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("fillet");
}

// --- Hole -----------------------------------------------------------------
{
  console.log("box with a through hole");
  const box = makeDefaultFeature("box", 1, "new");
  const hole = makeHoleFeature(1);
  hole.params = { ...hole.params, plane: "XY", x: 20, y: 15, startOffset: 20, dir: -1, depth: 25 };
  const res = regenerate(k, { features: [box, hole] });
  const hs = res.statuses.find((s) => s.featureId === hole.id);
  check("hole applied ok", hs?.state === "ok", hs?.message);
  assertNoLeak("hole");
}

// --- Error path: bad extrude profile keeps prior body ---------------------
{
  console.log("errored feature is skipped, regen continues");
  const box = makeDefaultFeature("box", 1, "new");
  const badFillet = makeFilletFeature(["999,999,999"], 1); // ref matches nothing
  const res = regenerate(k, { features: [box, badFillet] });
  const fs = res.statuses.find((s) => s.featureId === badFillet.id);
  check("bad fillet errors", fs?.state === "error");
  check("prior body survives", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("error-path");
}

// --- Rollback: regenerating a truncated feature list (what the store does
//     when the rollback bar is moved) yields the earlier state. --------------
{
  console.log("rollback = regenerate a sliced feature list");
  const box = makeDefaultFeature("box", 1, "new");
  const cyl = makeDefaultFeature("cylinder", 1, "remove");
  (cyl as { position: { x: number; y: number; z: number } }).position = {
    x: 20,
    y: 15,
    z: -5,
  };
  const full = { features: [box, cyl] };
  const withHole = regenerate(k, full);
  const holeFaces = withHole.mesh!.faceCount; // box minus cyl → 7
  assertNoLeak("rollback-full");
  // Bar rolled back to just after the box: slice to [box].
  const rolled = regenerate(k, { features: full.features.slice(0, 1) });
  check("rolled-back box has 6 faces", rolled.mesh?.faceCount === 6, `faces=${rolled.mesh?.faceCount}`);
  check("full had more faces than rolled", holeFaces > (rolled.mesh?.faceCount ?? 0));
  assertNoLeak("rollback-sliced");
}

// --- Chamfer --------------------------------------------------------------
{
  console.log("extrude then chamfer a resolved edge");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new");
  const base = regenerate(k, { features: [sk, ex] });
  const edges = base.edges!;
  const refs: string[] = [];
  for (let i = 0; i < edges.edgeGroups.length; i += 3) {
    const start = edges.edgeGroups[i];
    const count = edges.edgeGroups[i + 1];
    refs.push(edgeRefFromPoints(edges.points.slice(start, start + count)));
  }
  const ch = makeChamferFeature([refs[0]], 1);
  const res = regenerate(k, { features: [sk, ex, ch] });
  check("chamfer ok", res.statuses.find((s) => s.featureId === ch.id)?.state === "ok");
  assertNoLeak("chamfer");
}

// --- Shell + Draft (face-referencing modifiers) ---------------------------
{
  console.log("extrude then shell (remove top face)");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new"); // extrudes +Z by 20
  const base = regenerate(k, { features: [sk, ex] });
  const shell = makeShellFeature([topFaceRef(base.mesh!)], 1);
  const res = regenerate(k, { features: [sk, ex, shell] });
  const ss = res.statuses.find((s) => s.featureId === shell.id);
  check("shell ok", ss?.state === "ok", ss?.message);
  check("shell added faces", (res.mesh?.faceCount ?? 0) > 6, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("shell");
}

// --- Draft (taper a side face) --------------------------------------------
{
  console.log("extrude then draft a side face (pull +Z)");
  const sk = rectSketch(40, 30);
  const ex = makeExtrudeFeature(sk.id, 1, "new"); // 40x30 extruded +Z by 20
  const base = regenerate(k, { features: [sk, ex] });
  // A SIDE face (normal in-plane, e.g. the x=40 face) — NOT the top, since
  // drafting a face whose normal is parallel to the pull direction is
  // degenerate. Find the face with the max-x centroid.
  const m = base.mesh!;
  let sideRef = "";
  let maxX = -Infinity;
  for (let g = 0; g < m.faceGroups.length; g += 3) {
    const s0 = m.faceGroups[g];
    const c0 = m.faceGroups[g + 1];
    const coords: number[] = [];
    let xsum = 0, n = 0;
    for (let i = s0; i < s0 + c0; i++) {
      const v = m.indices[i] * 3;
      coords.push(m.positions[v], m.positions[v + 1], m.positions[v + 2]);
      xsum += m.positions[v];
      n++;
    }
    if (xsum / n > maxX) {
      maxX = xsum / n;
      sideRef = faceRefFromPoints(coords);
    }
  }
  const draft = makeDraftFeature([sideRef], 1); // pull +Z, 5°
  const res = regenerate(k, { features: [sk, ex, draft] });
  const ds = res.statuses.find((s) => s.featureId === draft.id);
  check("draft ok", ds?.state === "ok", ds?.message);
  check("draft kept geometry", res.mesh !== null);
  assertNoLeak("draft");
}

// --- Loft (two offset sketches) -------------------------------------------
{
  console.log("loft through two offset rectangles");
  const s1 = makeSketch("skA", "XY", 0);
  const s2 = makeSketch("skB", "XY", 40);
  for (const [s, half] of [[s1, 20], [s2, 10]] as const) {
    const p = (u: number, v: number) => {
      const id = `${s.id}_${s.points.length}`;
      s.points.push({ id, u, v, fixed: false });
      return id;
    };
    const a = p(-half, -half), b = p(half, -half), c = p(half, half), d = p(-half, half);
    s.entities.push(
      { id: `${s.id}l1`, type: "line", p1: a, p2: b },
      { id: `${s.id}l2`, type: "line", p1: b, p2: c },
      { id: `${s.id}l3`, type: "line", p1: c, p2: d },
      { id: `${s.id}l4`, type: "line", p1: d, p2: a },
    );
  }
  const skA = makeSketchFeature(s1, 1);
  const skB = makeSketchFeature(s2, 2);
  const loft = makeLoftFeature([skA.id, skB.id], 1, "new");
  const res = regenerate(k, { features: [skA, skB, loft] });
  check("loft produces geometry", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("loft");
}

// --- Sweep (circle profile along an open path) ----------------------------
{
  console.log("sweep a circle along an L-path");
  // Profile: a circle sketch on XY.
  const prof = makeSketch("prof", "XY", 0);
  prof.points.push({ id: "c", u: 0, v: 0, fixed: false });
  prof.entities.push({ id: "ci", type: "circle", center: "c", radius: 3 });
  const profF = makeSketchFeature(prof, 1);
  // Path: an open 2-segment polyline on XZ.
  const path = makeSketch("path", "XZ", 0);
  const pp = (u: number, v: number) => {
    const id = `pp${path.points.length}`;
    path.points.push({ id, u, v, fixed: false });
    return id;
  };
  const a = pp(0, 0), b = pp(0, 30), c = pp(20, 30);
  path.entities.push(
    { id: "pl1", type: "line", p1: a, p2: b },
    { id: "pl2", type: "line", p1: b, p2: c },
  );
  const pathF = makeSketchFeature(path, 2);
  const sweep = makeSweepFeature(profF.id, pathF.id, 1, "new");
  const res = regenerate(k, { features: [profF, pathF, sweep] });
  check("sweep produces geometry", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("sweep");
}

// --- Transforms: mirror + patterns ----------------------------------------
{
  console.log("mirror + linear + circular patterns");
  const box = makeDefaultFeature("box", 1, "new"); // 40x30x20 at origin
  const mirror = makeMirrorFeature(1); // YZ, keepOriginal
  let res = regenerate(k, { features: [box, mirror] });
  check("mirror ok", res.statuses.find((s) => s.featureId === mirror.id)?.state === "ok");
  assertNoLeak("mirror");

  const lin = makeLinearPatternFeature(1); // x, count 3, spacing 50
  res = regenerate(k, { features: [box, lin] });
  check("linear pattern ok", res.statuses.find((s) => s.featureId === lin.id)?.state === "ok");
  assertNoLeak("linear-pattern");

  const circ = makeCircularPatternFeature(1); // z, count 4, 360
  // Offset the box so the circular pattern sweeps distinct copies.
  (box as { position: { x: number; y: number; z: number } }).position = { x: 40, y: 0, z: 0 };
  res = regenerate(k, { features: [box, circ] });
  check("circular pattern ok", res.statuses.find((s) => s.featureId === circ.id)?.state === "ok");
  assertNoLeak("circular-pattern");
}

// --- Split ----------------------------------------------------------------
{
  console.log("split a box, keep positive side");
  const box = makeDefaultFeature("box", 1, "new");
  const split = makeSplitFeature(1); // XY, offset 0, keep positive
  const res = regenerate(k, { features: [box, split] });
  check("split ok", res.statuses.find((s) => s.featureId === split.id)?.state === "ok");
  check("split kept geometry", res.mesh !== null);
  assertNoLeak("split");
}

// --- Ellipse + spline profiles --------------------------------------------
{
  console.log("ellipse profile extrude");
  const s = makeSketch("el", "XY", 0);
  s.points.push({ id: "c", u: 0, v: 0, fixed: false });
  s.entities.push({
    id: "el1",
    type: "ellipse",
    center: "c",
    majorRadius: 20,
    minorRadius: 10,
    rotation: 0,
  });
  const skF = makeSketchFeature(s, 1);
  const ex = makeExtrudeFeature(skF.id, 1, "new");
  const res = regenerate(k, { features: [skF, ex] });
  check("ellipse extrude ok", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("ellipse");
}
{
  console.log("spline+line closed profile extrude");
  const s = makeSketch("sp", "XY", 0);
  const p = (u: number, v: number) => {
    const id = `sp${s.points.length}`;
    s.points.push({ id, u, v, fixed: false });
    return id;
  };
  const a = p(0, 0), b = p(20, 15), c = p(40, -5), d = p(60, 0);
  s.entities.push(
    { id: "spl", type: "spline", points: [a, b, c, d] },
    { id: "cl", type: "line", p1: d, p2: a },
  );
  const skF = makeSketchFeature(s, 1);
  const ex = makeExtrudeFeature(skF.id, 1, "new");
  const res = regenerate(k, { features: [skF, ex] });
  check("spline extrude ok", res.mesh !== null, `faces=${res.mesh?.faceCount}`);
  assertNoLeak("spline");
}

// --- Mass properties ------------------------------------------------------
{
  console.log("mass properties of a 40x30x20 box");
  const box = makeDefaultFeature("box", 1, "new");
  const mp = massPropsOfTree(k, { features: [box] });
  check("volume = 24000", Math.abs((mp.volume ?? 0) - 24000) < 1e-3, `vol=${mp.volume}`);
  // Surface area = 2*(40*30 + 40*20 + 30*20) = 2*(1200+800+600) = 5200.
  check("surface area = 5200", Math.abs((mp.surfaceArea ?? 0) - 5200) < 1e-3, `area=${mp.surfaceArea}`);
  // Box origin at corner → center of mass at (20, 15, 10).
  const c = mp.centerOfMass ?? [0, 0, 0];
  check(
    "center of mass = (20,15,10)",
    Math.abs(c[0] - 20) < 1e-6 && Math.abs(c[1] - 15) < 1e-6 && Math.abs(c[2] - 10) < 1e-6,
    `com=${c.map((n) => n.toFixed(1)).join(",")}`,
  );
  assertNoLeak("mass-props");
}

// --- Export ---------------------------------------------------------------
{
  console.log("STEP + STL export of a regenerated tree");
  const box = makeDefaultFeature("box", 1, "new");
  const tree: FeatureTree = { features: [box] };
  const step = exportTree(k, tree, "step");
  const stl = exportTree(k, tree, "stl");
  check("STEP is ISO-10303", step.startsWith("ISO-10303"));
  check("STL is ascii solid", stl.trimStart().startsWith("solid"));
  assertNoLeak("export");
}

k[Symbol.dispose]();
console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
