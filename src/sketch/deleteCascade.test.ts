/**
 * Delete-cascade + sketch undo verification. Run with
 * `node --experimental-strip-types --import ./src/test/ts-resolve.mjs`.
 * Drives the real sketch store (same path as the Delete button / key).
 */
import { useSketchStore } from "./sketchStore";
import { collectCascade } from "./deleteCascade";
import { makeSketch, type Sketch, type SketchPoint } from "../model/sketch";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}
const sk = () => useSketchStore.getState();
const counts = () => {
  const s = sk().sketch!;
  return { pts: s.points.length, ents: s.entities.length, cons: s.constraints.length };
};
const fmt = (c: { pts: number; ents: number; cons: number }) => `${c.pts}p/${c.ents}e/${c.cons}c`;
const sameCounts = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);
const entIds = () => sk().sketch!.entities.map((e) => e.id);

function fresh() {
  sk().enterSketch("XY");
}
function line(a: [number, number], b: [number, number]) {
  sk().setTool("line");
  sk().clickAt(a[0], a[1], null);
  sk().clickAt(b[0], b[1], null);
  sk().setTool("select");
}
function rect() {
  sk().setTool("rectangle");
  sk().clickAt(0, 0, null);
  sk().clickAt(20, 10, null);
  sk().setTool("select");
}
function del(entities: string[], points: string[] = []) {
  sk().selectBox(points, entities, false);
  sk().deleteSelected();
}
/** Delete, then check one undo restores exactly and one redo re-applies. */
function delWithUndoCheck(label: string, entities: string[], points: string[] = []) {
  const before = structuredClone(sk().sketch!);
  del(entities, points);
  const after = structuredClone(sk().sketch!);
  sk().undo();
  const restored = sk().sketch!;
  check(
    `${label}: one undo restores same ids`,
    JSON.stringify(restored.points.map((p) => p.id)) === JSON.stringify(before.points.map((p) => p.id)) &&
      JSON.stringify(restored.entities) === JSON.stringify(before.entities) &&
      JSON.stringify(restored.constraints) === JSON.stringify(before.constraints),
  );
  sk().redo();
  check(
    `${label}: redo re-applies cascade`,
    JSON.stringify(sk().sketch!.entities) === JSON.stringify(after.entities) &&
      sk().sketch!.points.length === after.points.length &&
      sk().sketch!.constraints.length === after.constraints.length,
  );
}

{
  console.log("Isolated line");
  fresh();
  line([0, 0], [10, 0]);
  check("built 2p/1e", sameCounts(counts(), { pts: 2, ents: 1, cons: 0 }), fmt(counts()));
  delWithUndoCheck("isolated line", entIds());
  check("line + both endpoints gone", sameCounts(counts(), { pts: 0, ents: 0, cons: 0 }), fmt(counts()));
}

{
  console.log("Rectangle: one edge vs whole");
  fresh();
  rect(); // 4 pts, 4 lines, 4 H/V constraints
  check("built 4p/4e/4c", sameCounts(counts(), { pts: 4, ents: 4, cons: 4 }), fmt(counts()));
  const [bottom] = entIds();
  delWithUndoCheck("one edge", [bottom]);
  check("edge + its H constraint gone, both corners kept", sameCounts(counts(), { pts: 4, ents: 3, cons: 3 }), fmt(counts()));
  sk().undo();
  del(entIds());
  check("whole rectangle → nothing left", sameCounts(counts(), { pts: 0, ents: 0, cons: 0 }), fmt(counts()));
}

{
  console.log("Adjacent lines deleted together take their shared corner");
  fresh();
  rect();
  const [bottom, right] = entIds();
  del([bottom, right]);
  // Corners: p1 (left/bottom), p2 (bottom/right, shared), p3 (right/top), p4.
  check("only the shared corner removed (3 pts left)", sameCounts(counts(), { pts: 3, ents: 2, cons: 2 }), fmt(counts()));
}

{
  console.log("Line chain: delete middle segment");
  fresh();
  sk().setTool("line");
  sk().clickAt(0, 0, null);
  sk().clickAt(10, 0, null);
  sk().clickAt(20, 5, null);
  sk().clickAt(30, 0, null);
  sk().setTool("select");
  check("built 4p/3e", sameCounts(counts(), { pts: 4, ents: 3, cons: 0 }), fmt(counts()));
  del([entIds()[1]]);
  check("middle gone, both its endpoints kept", sameCounts(counts(), { pts: 4, ents: 2, cons: 0 }), fmt(counts()));
  // The far segment is now isolated (its shared point only joined the middle).
  del([entIds()[1]]);
  check("now-isolated far segment takes both its points", sameCounts(counts(), { pts: 2, ents: 1, cons: 0 }), fmt(counts()));
  // Fresh chain: deleting the END segment removes only its free end.
  fresh();
  sk().setTool("line");
  sk().clickAt(0, 0, null);
  sk().clickAt(10, 0, null);
  sk().clickAt(20, 5, null);
  sk().setTool("select");
  del([entIds()[1]]);
  check("end segment: only its free end removed", sameCounts(counts(), { pts: 2, ents: 1, cons: 0 }), fmt(counts()));
}

{
  console.log("Two circles sharing a center");
  fresh();
  sk().setTool("circle");
  sk().clickAt(0, 0, null);
  sk().clickAt(5, 0, null);
  sk().clickAt(0.5, 0, null); // snaps onto the existing center
  sk().clickAt(9, 0, null);
  sk().setTool("select");
  check("built 1p/2e (shared center)", sameCounts(counts(), { pts: 1, ents: 2, cons: 0 }), fmt(counts()));
  del([entIds()[0]]);
  check("first circle gone, center stays", sameCounts(counts(), { pts: 1, ents: 1, cons: 0 }), fmt(counts()));
  del([entIds()[0]]);
  check("second circle gone, center goes", sameCounts(counts(), { pts: 0, ents: 0, cons: 0 }), fmt(counts()));
}

{
  console.log("Spline owns its through-points");
  fresh();
  sk().setTool("spline");
  for (const [u, v] of [[0, 0], [10, 5], [20, -5], [30, 0]]) sk().clickAt(u, v, null);
  sk().setTool("select"); // commits the spline
  check("built 4p/1e", sameCounts(counts(), { pts: 4, ents: 1, cons: 0 }), fmt(counts()));
  delWithUndoCheck("spline", entIds());
  check("spline + all points gone", sameCounts(counts(), { pts: 0, ents: 0, cons: 0 }), fmt(counts()));
}

{
  console.log("Point held only by a dimension is orphaned; spanning coincident is dropped");
  fresh();
  line([0, 0], [10, 0]);
  line([20, 0], [30, 0]);
  const pts = sk().sketch!.points.map((p) => p.id);
  // Distance dim between the two lines' near endpoints (pts[1], pts[2]).
  sk().selectPoint(pts[1], false);
  sk().selectPoint(pts[2], true);
  check("distance added", sk().addConstraint("distance", 10) === null);
  const [first] = entIds();
  del([first]);
  const s = sk().sketch!;
  check("first line + both endpoints gone (dim doesn't keep pts[1])", !s.points.some((p) => p.id === pts[1]) && s.points.length === 2);
  check("dimension removed with it", s.constraints.length === 0);
  check("solver still converges", sk().lastSolve?.converged === true);
}

{
  console.log("Deleting a point still removes the shapes built on it");
  fresh();
  rect();
  const corner = sk().sketch!.points[0].id;
  delWithUndoCheck("corner point", [], [corner]);
  // Corner p1 kills bottom + left; p2/p4 are still used by right/top, so only
  // the selected corner itself goes. No line is left with a missing endpoint.
  check("right + top survive with all 3 of their points", sameCounts(counts(), { pts: 3, ents: 2, cons: 2 }), fmt(counts()));
  const s2 = sk().sketch!;
  const live = new Set(s2.points.map((p) => p.id));
  check("no surviving entity references a missing point", s2.entities.every((e) => e.type !== "line" || (live.has(e.p1) && live.has(e.p2))));
}

{
  console.log("Protected: fixed points and in-progress tool points are never orphan-removed");
  const s: Sketch = makeSketch("s", "XY");
  const pt = (id: string, u: number, v: number, fixed = false): SketchPoint => ({ id, u, v, fixed });
  s.points = [pt("o", 0, 0, true), pt("a", 10, 0), pt("b", 0, 10)];
  s.entities = [
    { id: "l1", type: "line", p1: "o", p2: "a" },
    { id: "l2", type: "line", p1: "o", p2: "b" },
  ];
  const r = collectCascade(s, [], ["l1", "l2"], ["b"]);
  check("fixed origin kept", !r.points.includes("o"));
  check("pending point kept", !r.points.includes("b"));
  check("ordinary orphan removed", r.points.includes("a"));
}

{
  console.log("Undo housekeeping");
  fresh();
  check("fresh sketch has nothing to undo", !sk().canUndo);
  line([0, 0], [10, 0]);
  sk().selectEntity(entIds()[0], false);
  sk().deleteSelected();
  check("selection cleared after delete", sk().selectedEntities.length === 0 && sk().selectedPoints.length === 0);
  sk().selectBox([], [], false);
  sk().deleteSelected();
  check("delete with empty selection records nothing", (sk().undo(), counts().ents === 1));
  // Drag coalescing: many moves of one point = one undo step.
  const pid = sk().sketch!.points[0].id;
  const start = sk().sketch!.points[0].u;
  for (let i = 1; i <= 20; i++) sk().dragPoint(pid, start - i, 0);
  sk().undo();
  check("20-move drag undone in one step", sk().sketch!.points.find((p) => p.id === pid)!.u === start);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
