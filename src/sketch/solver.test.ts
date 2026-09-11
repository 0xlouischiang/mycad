/**
 * Solver verification harness (run with `node --experimental-strip-types`).
 * Not a formal test framework — a set of assert-based scenarios printed to
 * stdout. Exercises each constraint type and checks residual convergence + DOF.
 */
import { solveSketch } from "./solver.ts";
import {
  makeSketch,
  type Constraint,
  type Sketch,
  type SketchEntity,
  type SketchPoint,
} from "../model/sketch.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`  [${mark}] ${label}${detail ? " — " + detail : ""}`);
}

function pt(id: string, u: number, v: number, fixed = false): SketchPoint {
  return { id, u, v, fixed };
}
function dist(a: SketchPoint, b: SketchPoint) {
  return Math.hypot(a.u - b.u, a.v - b.v);
}
function byId(s: Sketch, id: string) {
  return s.points.find((p) => p.id === id)!;
}

// 1. Horizontal + vertical -----------------------------------------------
{
  console.log("Scenario: horizontal & vertical lines");
  const s = makeSketch("s", "XY");
  s.points = [pt("p1", 0, 0, true), pt("p2", 10, 3), pt("p3", 4, -8)];
  const l1: SketchEntity = { id: "l1", type: "line", p1: "p1", p2: "p2" };
  const l2: SketchEntity = { id: "l2", type: "line", p1: "p1", p2: "p3" };
  s.entities = [l1, l2];
  s.constraints = [
    { id: "c1", type: "horizontal", entity: "l1" },
    { id: "c2", type: "vertical", entity: "l2" },
  ];
  const r = solveSketch(s);
  check("converged", r.converged, `res=${r.residual.toExponential(2)}`);
  check("l1 horizontal", Math.abs(byId(s, "p1").v - byId(s, "p2").v) < 1e-5);
  check("l2 vertical", Math.abs(byId(s, "p1").u - byId(s, "p3").u) < 1e-5);
}

// 2. Perpendicular corner -------------------------------------------------
{
  console.log("Scenario: perpendicular");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 10, 1), pt("c", 1, 9)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "a", p2: "c" },
  ];
  s.constraints = [{ id: "c1", type: "perpendicular", a: "l1", b: "l2" }];
  const r = solveSketch(s);
  const ab = { u: byId(s, "b").u - byId(s, "a").u, v: byId(s, "b").v - byId(s, "a").v };
  const ac = { u: byId(s, "c").u - byId(s, "a").u, v: byId(s, "c").v - byId(s, "a").v };
  const dotp = ab.u * ac.u + ab.v * ac.v;
  check("converged", r.converged, `res=${r.residual.toExponential(2)}`);
  check("dot(ab,ac)≈0", Math.abs(dotp) < 1e-4, `dot=${dotp.toExponential(2)}`);
}

// 3. Parallel -------------------------------------------------------------
{
  console.log("Scenario: parallel");
  const s = makeSketch("s", "XY");
  s.points = [
    pt("a", 0, 0, true),
    pt("b", 10, 0, true),
    pt("c", 0, 5),
    pt("d", 8, 7),
  ];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "c", p2: "d" },
  ];
  s.constraints = [{ id: "c1", type: "parallel", a: "l1", b: "l2" }];
  const r = solveSketch(s);
  const cross =
    (byId(s, "b").u - byId(s, "a").u) * (byId(s, "d").v - byId(s, "c").v) -
    (byId(s, "b").v - byId(s, "a").v) * (byId(s, "d").u - byId(s, "c").u);
  check("converged", r.converged);
  check("cross≈0 (parallel)", Math.abs(cross) < 1e-4, `cross=${cross.toExponential(2)}`);
}

// 4. Equal length ---------------------------------------------------------
{
  console.log("Scenario: equal length");
  const s = makeSketch("s", "XY");
  s.points = [
    pt("a", 0, 0, true),
    pt("b", 10, 0),
    pt("c", 0, 0, true),
    pt("d", 3, 4),
  ];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "c", p2: "d" },
  ];
  s.constraints = [{ id: "c1", type: "equalLength", a: "l1", b: "l2" }];
  const r = solveSketch(s);
  const len1 = dist(byId(s, "a"), byId(s, "b"));
  const len2 = dist(byId(s, "c"), byId(s, "d"));
  check("converged", r.converged);
  check("lengths equal", Math.abs(len1 - len2) < 1e-4, `${len1.toFixed(3)} vs ${len2.toFixed(3)}`);
}

// 5. Distance dimension ---------------------------------------------------
{
  console.log("Scenario: distance dimension = 25");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 10, 0)];
  s.entities = [{ id: "l1", type: "line", p1: "a", p2: "b" }];
  s.constraints = [{ id: "c1", type: "distance", p1: "a", p2: "b", value: 25 }];
  const r = solveSketch(s);
  check("converged", r.converged);
  check("distance = 25", Math.abs(dist(byId(s, "a"), byId(s, "b")) - 25) < 1e-4);
}

// 6. Coincident chain -----------------------------------------------------
{
  console.log("Scenario: coincident");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 7, 3)];
  s.entities = [];
  s.constraints = [{ id: "c1", type: "coincident", p1: "a", p2: "b" }];
  const r = solveSketch(s);
  check("converged", r.converged);
  check("coincident", dist(byId(s, "a"), byId(s, "b")) < 1e-5);
}

// 7. Radius ---------------------------------------------------------------
{
  console.log("Scenario: circle radius = 12");
  const s = makeSketch("s", "XY");
  s.points = [pt("c", 0, 0, true)];
  s.entities = [{ id: "circ", type: "circle", center: "c", radius: 5 }];
  s.constraints = [{ id: "c1", type: "radius", entity: "circ", value: 12 }];
  const r = solveSketch(s);
  const circle = s.entities[0] as Extract<SketchEntity, { type: "circle" }>;
  check("converged", r.converged);
  check("radius = 12", Math.abs(circle.radius - 12) < 1e-4, `r=${circle.radius.toFixed(3)}`);
}

// 8. Angle 90° between two lines -----------------------------------------
{
  console.log("Scenario: angle = 60°");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0, true), pt("b", 10, 0, true), pt("c", 8, 2)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "a", p2: "c" },
  ];
  s.constraints = [{ id: "c1", type: "angle", a: "l1", b: "l2", value: 60 }];
  const r = solveSketch(s);
  const ang =
    (Math.atan2(byId(s, "c").v - byId(s, "a").v, byId(s, "c").u - byId(s, "a").u) -
      Math.atan2(byId(s, "b").v - byId(s, "a").v, byId(s, "b").u - byId(s, "a").u)) *
    (180 / Math.PI);
  check("converged", r.converged);
  check("angle ≈ 60°", Math.abs(((ang % 360) + 360) % 360 - 60) < 0.05, `ang=${ang.toFixed(2)}`);
}

// 9. Combined: a rectangle from 4 lines ----------------------------------
{
  console.log("Scenario: rectangle (H/V + distance) — closed profile");
  const s = makeSketch("s", "XY");
  s.points = [
    pt("p1", 0, 0, true),
    pt("p2", 30, 2),
    pt("p3", 28, 18),
    pt("p4", 1, 20),
  ];
  const lines: SketchEntity[] = [
    { id: "b", type: "line", p1: "p1", p2: "p2" },
    { id: "r2", type: "line", p1: "p2", p2: "p3" },
    { id: "t", type: "line", p1: "p3", p2: "p4" },
    { id: "l", type: "line", p1: "p4", p2: "p1" },
  ];
  s.entities = lines;
  const cons: Constraint[] = [
    { id: "c1", type: "horizontal", entity: "b" },
    { id: "c2", type: "horizontal", entity: "t" },
    { id: "c3", type: "vertical", entity: "r2" },
    { id: "c4", type: "vertical", entity: "l" },
    { id: "c5", type: "distance", p1: "p1", p2: "p2", value: 40 },
    { id: "c6", type: "distance", p1: "p1", p2: "p4", value: 25 },
  ];
  s.constraints = cons;
  const r = solveSketch(s);
  check("converged", r.converged, `res=${r.residual.toExponential(2)} iters=${r.iterations}`);
  check("width = 40", Math.abs(dist(byId(s, "p1"), byId(s, "p2")) - 40) < 1e-3);
  check("height = 25", Math.abs(dist(byId(s, "p1"), byId(s, "p4")) - 25) < 1e-3);
  check("bottom horizontal", Math.abs(byId(s, "p1").v - byId(s, "p2").v) < 1e-4);
  check("right vertical", Math.abs(byId(s, "p2").u - byId(s, "p3").u) < 1e-4);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
