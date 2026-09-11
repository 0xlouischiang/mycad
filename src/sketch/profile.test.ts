/**
 * Profile extraction verification. Run with `node --experimental-strip-types`.
 * Pure logic (no kernel) — checks loop detection, orientation, and rejection
 * of open/self-intersecting/disconnected profiles.
 */
import { extractProfile } from "./profile.ts";
import { makeSketch, type Sketch, type SketchPoint } from "../model/sketch.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

function pt(id: string, u: number, v: number): SketchPoint {
  return { id, u, v, fixed: false };
}

// Closed rectangle from 4 lines -----------------------------------------
{
  console.log("Rectangle (closed, 4 lines)");
  const s: Sketch = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0), pt("b", 40, 0), pt("c", 40, 25), pt("d", 0, 25)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "b", p2: "c" },
    { id: "l3", type: "line", p1: "c", p2: "d" },
    { id: "l4", type: "line", p1: "d", p2: "a" },
  ];
  const r = extractProfile(s);
  check("extracted ok", r.ok, r.ok ? "" : r.error);
  if (r.ok) check("4 edges", r.profile.edges.length === 4);
  if (r.ok) check("not flagged circle", !r.profile.isCircle);
}

// Single circle ----------------------------------------------------------
{
  console.log("Single circle");
  const s = makeSketch("s", "XY");
  s.points = [pt("c", 5, 5)];
  s.entities = [{ id: "ci", type: "circle", center: "c", radius: 10 }];
  const r = extractProfile(s);
  check("extracted ok", r.ok, r.ok ? "" : r.error);
  if (r.ok) check("flagged circle", r.profile.isCircle);
}

// Open profile (missing closing edge) -----------------------------------
{
  console.log("Open profile (3 of 4 edges)");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0), pt("b", 40, 0), pt("c", 40, 25), pt("d", 0, 25)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "b", p2: "c" },
    { id: "l3", type: "line", p1: "c", p2: "d" },
  ];
  const r = extractProfile(s);
  check("rejected", !r.ok, r.ok ? "unexpectedly ok" : r.error);
}

// Self-intersecting bowtie ----------------------------------------------
{
  console.log("Self-intersecting bowtie");
  const s = makeSketch("s", "XY");
  // Cross the diagonals: a-b, b-c, c-d, d-a but with c/d swapped to cross.
  s.points = [pt("a", 0, 0), pt("b", 40, 0), pt("c", 0, 25), pt("d", 40, 25)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "b", p2: "c" }, // crosses l4
    { id: "l3", type: "line", p1: "c", p2: "d" },
    { id: "l4", type: "line", p1: "d", p2: "a" }, // crosses l2
  ];
  const r = extractProfile(s);
  check("rejected (self-intersect)", !r.ok, r.ok ? "unexpectedly ok" : r.error);
}

// Disconnected segments --------------------------------------------------
{
  console.log("Disconnected (two separate edges)");
  const s = makeSketch("s", "XY");
  s.points = [pt("a", 0, 0), pt("b", 10, 0), pt("c", 20, 0), pt("d", 30, 0)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "c", p2: "d" },
  ];
  const r = extractProfile(s);
  check("rejected (open/disconnected)", !r.ok, r.ok ? "unexpectedly ok" : r.error);
}

// Triangle with an arc side ---------------------------------------------
{
  console.log("Closed loop with one arc edge");
  const s = makeSketch("s", "XY");
  s.points = [
    pt("a", 0, 0),
    pt("b", 40, 0),
    pt("center", 20, 0),
    pt("astart", 40, 0),
    pt("aend", 0, 0),
  ];
  // Two lines + one arc forming a closed shape: a->b (line), b->top (line), top->a
  s.points = [pt("a", 0, 0), pt("b", 40, 0), pt("c", 20, 30), pt("cen", 20, 15)];
  s.entities = [
    { id: "l1", type: "line", p1: "a", p2: "b" },
    { id: "l2", type: "line", p1: "b", p2: "c" },
    { id: "ar", type: "arc", center: "cen", start: "c", end: "a" },
  ];
  const r = extractProfile(s);
  check("extracted ok", r.ok, r.ok ? "" : r.error);
  if (r.ok) check("3 edges incl arc", r.profile.edges.length === 3);
  if (r.ok) check("has arc edge", r.profile.edges.some((e) => e.kind === "arc"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
