/**
 * Horizontal / vertical distance verification. Run with
 * `node --experimental-strip-types --import ./src/test/ts-resolve.mjs`.
 * Covers solver math, placement-mode inference, sign/side rules, variable
 * expressions, legacy data, the origin point, DOF/conflict reporting, and
 * delete + undo — driving the real sketch store where it matters.
 */
import { solveSketch } from "./solver";
import { useSketchStore } from "./sketchStore";
import { inferAxis, measure, placementOffset } from "./dimension";
import { applySketchExprs } from "./sketchExprs";
import { extractProfile } from "./profile";
import { ORIGIN_ID, makeSketch, type Sketch, type SketchPoint } from "../model/sketch";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) < tol;
const pt = (id: string, u: number, v: number, fixed = false): SketchPoint => ({ id, u, v, fixed });
const P = (s: Sketch, id: string) => s.points.find((p) => p.id === id)!;
const sk = () => useSketchStore.getState();

// ---- Solver math ----------------------------------------------------------

{
  console.log("Horizontal distance fixes Δu only; v stays free");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 10, 7)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: 40, axis: "x", dir: 1 }];
  const r = solveSketch(s);
  check("converged", r.converged);
  check("u2 − u1 = 40", near(P(s, "b").u - P(s, "a").u, 40), String(P(s, "b").u));
  check("v untouched (free axis)", near(P(s, "b").v, 7, 1e-4), String(P(s, "b").v));
  check("1 DOF left (b.v)", r.dof === 1, String(r.dof));
}

{
  console.log("Vertical distance fixes Δv only");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 3, 2)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: 25, axis: "y", dir: 1 }];
  solveSketch(s);
  check("v2 − v1 = 25", near(P(s, "b").v, 25));
  check("u untouched", near(P(s, "b").u, 3, 1e-4));
}

{
  console.log("Signed side: negative stored value puts p2 on the other side");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", -5, 0)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: -30, axis: "x", dir: -1 }];
  solveSketch(s);
  check("b.u = −30 (stays left, doesn't flip)", near(P(s, "b").u, -30));
}

{
  console.log("Zero distance and coincident start are stable (no length division)");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 0, 0)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: 0, axis: "x", dir: 1 }];
  const r = solveSketch(s);
  check("converged with no NaN", r.converged && Number.isFinite(P(s, "b").u) && Number.isFinite(P(s, "b").v));
}

{
  console.log("Horizontal + vertical together pin a point (fully constrained)");
  const s = makeSketch("s", "XY");
  s.points = [pt("o", 0, 0, true), pt("b", 1, 1)];
  s.constraints = [
    { id: "h", type: "distance", p1: "o", p2: "b", value: 40, axis: "x", dir: 1 },
    { id: "v", type: "distance", p1: "o", p2: "b", value: 25, axis: "y", dir: 1 },
  ];
  const r = solveSketch(s);
  check("at (40,25)", near(P(s, "b").u, 40) && near(P(s, "b").v, 25));
  check("0 DOF", r.dof === 0, String(r.dof));
}

{
  console.log("Conflict: horizontal distance on a vertical line");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 0, 10)];
  s.entities = [{ id: "l", type: "line", p1: "a", p2: "b" }];
  s.constraints = [
    { id: "vert", type: "vertical", entity: "l" },
    { id: "h", type: "distance", p1: "a", p2: "b", value: 15, axis: "x", dir: 1 },
  ];
  const r = solveSketch(s);
  check("reported as not converged", !r.converged);
  check("no NaN produced", s.points.every((p) => Number.isFinite(p.u) && Number.isFinite(p.v)));
  console.log("Redundant (not conflicting): 0 horizontal distance on a vertical line");
  s.points = [pt("a", 0, 0, true), pt("b", 0, 10)];
  s.constraints[1] = { id: "h", type: "distance", p1: "a", p2: "b", value: 0, axis: "x", dir: 1 };
  const r2 = solveSketch(s);
  check("converges", r2.converged);
  check("1 redundant constraint reported", r2.redundant === 1, String(r2.redundant));
}

{
  console.log("Legacy data: distance with no axis field = aligned");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 3, 4)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: 10 }];
  solveSketch(s);
  const b = P(s, "b");
  check("|b − a| = 10 (aligned)", near(Math.hypot(b.u, b.v), 10, 1e-5));
  check("direction preserved (3:4)", near(b.u / b.v, 0.75, 1e-4));
}

// ---- Placement inference ---------------------------------------------------

{
  console.log("Placement-mode inference");
  const a = { u: 0, v: 0 };
  const b = { u: 40, v: 25 };
  check("above the span → horizontal", inferAxis(a, b, { u: 20, v: 40 }) === "x");
  check("below the span → horizontal", inferAxis(a, b, { u: 20, v: -10 }) === "x");
  check("right of span → vertical", inferAxis(a, b, { u: 55, v: 10 }) === "y");
  check("left of span → vertical", inferAxis(a, b, { u: -10, v: 10 }) === "y");
  check("diagonal off a corner → aligned", inferAxis(a, b, { u: 60, v: 40 }) === "aligned");
  check("inside the box → aligned", inferAxis(a, b, { u: 20, v: 12 }) === "aligned");
  check("signed horizontal measure", measure(b, a, "x") === -40);
  check("horizontal offset is v-relative", placementOffset(a, b, { u: 5, v: 40 }, "x") === 27.5);
}

// ---- Store: placement, edit, side, expressions, origin, delete/undo -------

{
  console.log("Store: origin present, protected, ignored by profiles");
  sk().enterSketch("XY");
  const o = sk().sketch!.points.find((p) => p.id === ORIGIN_ID);
  check("origin at (0,0), fixed", !!o && o.u === 0 && o.v === 0 && o.fixed);
  sk().setTool("rectangle");
  sk().clickAt(10, 10, null);
  sk().clickAt(30, 20, null);
  sk().setTool("select");
  check("profile still extracts with origin present", extractProfile(sk().sketch!).ok);
  sk().selectBox([], sk().sketch!.entities.map((e) => e.id), false);
  sk().deleteSelected();
  check("deleting everything keeps the origin", sk().sketch!.points.some((p) => p.id === ORIGIN_ID));
}

{
  console.log("Store: horizontal distance from origin, side kept on edit");
  sk().enterSketch("XY");
  sk().setTool("line");
  sk().clickAt(-12, 5, null);
  sk().clickAt(-2, 9, null);
  sk().setTool("select");
  const first = sk().sketch!.entities[0];
  const p1 = first.type === "line" ? first.p1 : "";
  sk().selectPoint(ORIGIN_ID, false);
  sk().selectPoint(p1, true);
  check("beginDistance ok", sk().beginDistance() === null);
  const id = sk().placeDimension("x", 6)!;
  const c = sk().sketch!.constraints.find((x) => x.id === id)!;
  check("placed as horizontal at current value (−12)", c.type === "distance" && c.axis === "x" && near(c.value, -12));
  check("geometry didn't jump on placement", near(P(sk().sketch!, p1).u, -12, 1e-6));
  check("enter 30 → accepted", sk().setDimensionInput(id, "30") === null);
  const after = P(sk().sketch!, p1);
  check("point stays LEFT of origin at u = −30", near(after.u, -30, 1e-5), String(after.u));
  check("v left free (unchanged)", near(after.v, 5, 1e-3), String(after.v));
  check("entering −30 flips to the right side", sk().setDimensionInput(id, "-30") === null && near(P(sk().sketch!, p1).u, 30, 1e-5));

  console.log("Store: invalid inputs are rejected, nothing changes");
  const before = JSON.stringify(sk().sketch);
  check("non-numeric rejected", sk().setDimensionInput(id, "abc") !== null);
  check("empty rejected", sk().setDimensionInput(id, "  ") !== null);
  check("sketch unchanged", JSON.stringify(sk().sketch) === before);

  console.log("Store: variable expression drives the dimension");
  sk().setVarScope({ width: 50 });
  check("expression accepted", sk().setDimensionInput(id, "width/2") === null);
  check("u = 25 (−1·dir already flipped → +25)", near(Math.abs(P(sk().sketch!, p1).u), 25, 1e-5));
  sk().setVarScope({ width: 80 });
  check("variable change re-solves → |u| = 40", near(Math.abs(P(sk().sketch!, p1).u), 40, 1e-5));
  const cc = sk().sketch!.constraints.find((x) => x.id === id)!;
  check("expression stored on constraint", cc.type === "distance" && cc.expr === "width/2");

  console.log("Store: aligned rejects negatives");
  sk().selectPoint(ORIGIN_ID, false);
  sk().selectPoint(p1, true);
  sk().beginDistance();
  const al = sk().placeDimension("aligned", 3)!;
  check("negative aligned rejected", sk().setDimensionInput(al, "-5") !== null);

  console.log("Store: delete point removes its h/v dimension; one undo restores");
  const nBefore = sk().sketch!.constraints.length;
  sk().selectBox([p1], [], false);
  sk().deleteSelected();
  check("dims on the point removed", !sk().sketch!.constraints.some((x) => x.id === id || x.id === al));
  sk().undo();
  const restored = sk().sketch!.constraints.find((x) => x.id === id);
  check("one undo restores the dimension with axis + expr", sk().sketch!.constraints.length === nBefore && restored?.type === "distance" && restored.axis === "x" && restored.expr === "width/2");
}

{
  console.log("Store: 1 line selected → dimension its endpoints; Esc-equivalent cancels");
  sk().enterSketch("XY");
  sk().setTool("line");
  sk().clickAt(0, 0, null);
  sk().clickAt(20, 10, null);
  sk().setTool("select");
  sk().selectEntity(sk().sketch!.entities[0].id, false);
  check("beginDistance from a line", sk().beginDistance() === null && sk().dimension !== null);
  sk().cancelDimension();
  check("cancel leaves no constraint", sk().dimension === null && sk().sketch!.constraints.length === 0);
}

{
  console.log("Expressions re-applied outside the editor (regen path)");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 10, 0)];
  s.constraints = [{ id: "c", type: "distance", p1: "a", p2: "b", value: 10, axis: "x", dir: 1, expr: "w" }];
  check("applies scope", applySketchExprs(s, { w: 42 }) && s.constraints[0].type === "distance" && s.constraints[0].value === 42);
  check("bad scope keeps last good value", !applySketchExprs(s, {}) && s.constraints[0].type === "distance" && s.constraints[0].value === 42);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
