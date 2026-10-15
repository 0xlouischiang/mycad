/**
 * Box-select + live-preview verification. Run with `node --experimental-strip-types`.
 * Pure logic — checks window vs crossing hit-testing and that each tool's
 * preview matches the geometry clickAt would commit for the same cursor.
 */
import { boxFromCorners, boxSelect } from "./boxSelect.ts";
import { previewGeometry, snapCursor } from "./preview.ts";
import { makeSketch, type Sketch, type SketchPoint } from "../model/sketch.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

function pt(id: string, u: number, v: number): SketchPoint {
  return { id, u, v, fixed: false };
}

// Scene: a line fully inside [0,10]², a line straddling its right edge, a
// circle far away, and a circle whose rim grazes into the box.
function scene(): Sketch {
  const s = makeSketch("s", "XY");
  s.points = [
    pt("a", 2, 2), pt("b", 8, 8),
    pt("c", 5, 5), pt("d", 20, 5),
    pt("far", 100, 100),
    pt("rimC", 14, 5),
  ];
  s.entities = [
    { id: "inLine", type: "line", p1: "a", p2: "b" },
    { id: "crossLine", type: "line", p1: "c", p2: "d" },
    { id: "farCircle", type: "circle", center: "far", radius: 3 },
    { id: "rimCircle", type: "circle", center: "rimC", radius: 5 },
  ];
  return s;
}

{
  console.log("Box-select: window (fully inside)");
  const s = scene();
  const r = boxSelect(s, boxFromCorners({ u: 0, v: 0 }, { u: 10, v: 10 }), "window");
  check("only the contained line", same(r.entities, ["inLine"]), r.entities.join(","));
  check("points inside box", same(r.points, ["a", "b", "c"]), r.points.join(","));
}

{
  console.log("Box-select: crossing (touching)");
  const s = scene();
  const r = boxSelect(s, boxFromCorners({ u: 10, v: 10 }, { u: 0, v: 0 }), "crossing");
  check(
    "contained + straddling line + grazing circle",
    same(r.entities, ["inLine", "crossLine", "rimCircle"]),
    r.entities.join(","),
  );
}

{
  console.log("Box-select: crossing catches a line passing through with both ends outside");
  const s = makeSketch("s", "XY");
  s.points = [pt("p", -5, 5), pt("q", 15, 5)];
  s.entities = [{ id: "thru", type: "line", p1: "p", p2: "q" }];
  const box = boxFromCorners({ u: 0, v: 0 }, { u: 10, v: 10 });
  check("crossing selects it", same(boxSelect(s, box, "crossing").entities, ["thru"]));
  check("window does not", boxSelect(s, box, "window").entities.length === 0);
}

{
  console.log("Box-select: arc honors its sweep (CCW quarter, box over the other side)");
  const s = makeSketch("s", "XY");
  s.points = [pt("o", 0, 0), pt("st", 10, 0), pt("en", 0, 10)];
  s.entities = [{ id: "arc", type: "arc", center: "o", start: "st", end: "en" }];
  // The CCW quarter lives in u,v >= 0; a box in the third quadrant misses it.
  const miss = boxSelect(s, boxFromCorners({ u: -12, v: -12 }, { u: -1, v: -1 }), "crossing");
  check("box opposite the sweep misses", miss.entities.length === 0);
  const hit = boxSelect(s, boxFromCorners({ u: 5, v: 5 }, { u: 9, v: 9 }), "crossing");
  check("box on the sweep hits", same(hit.entities, ["arc"]));
}

// ---- Live preview ----------------------------------------------------------

{
  console.log("Preview: nothing pending → nothing drawn");
  const s = scene();
  check("empty", previewGeometry(s, null, { u: 1, v: 1 }, { u: 1, v: 1 }, 6).length === 0);
}

{
  console.log("Preview: line segment snaps to a nearby existing point");
  const s = scene();
  const raw = { u: 8.5, v: 8.5 }; // within SNAP of b (8,8)
  const snapped = snapCursor(s, raw, null);
  check("snapped onto b", near(snapped.u, 8) && near(snapped.v, 8));
  const [sh] = previewGeometry(s, { tool: "line", pointIds: ["a"] }, raw, snapped, 6);
  check(
    "segment a → b",
    sh.kind === "polyline" && near(sh.pts[0].u, 2) && near(sh.pts[1].u, 8) && near(sh.pts[1].v, 8),
  );
}

{
  console.log("Preview: rectangle corners match clickAt's CCW order");
  const s = scene();
  const c = { u: 12, v: 7 };
  const [sh] = previewGeometry(s, { tool: "rectangle", pointIds: ["a"] }, c, c, 6);
  const want = [[2, 2], [12, 2], [12, 7], [2, 7]];
  check(
    "4 closed corners",
    sh.kind === "polyline" && sh.closed &&
      sh.pts.every((p, i) => near(p.u, want[i][0]) && near(p.v, want[i][1])),
  );
}

{
  console.log("Preview: circle radius uses the raw cursor (like clickAt)");
  const s = scene();
  const raw = { u: 5, v: 6 }; // 3-4-5 from a(2,2)
  const [sh] = previewGeometry(s, { tool: "circle", pointIds: ["a"] }, raw, raw, 6);
  check("r = 5", sh.kind === "circle" && near(sh.r, 5));
}

{
  console.log("Preview: polygon has N vertices on the cursor's radius");
  const s = scene();
  const raw = { u: 6, v: 2 };
  const [sh] = previewGeometry(s, { tool: "polygon", pointIds: ["a"] }, raw, raw, 5);
  check(
    "5 vertices, first at cursor",
    sh.kind === "polyline" && sh.pts.length === 5 && near(sh.pts[0].u, 6) && near(sh.pts[0].v, 2),
  );
}

{
  console.log("Preview: arc end is projected onto the start radius");
  const s = makeSketch("s", "XY");
  s.points = [pt("o", 0, 0), pt("st", 10, 0)];
  const raw = { u: 0, v: 3 };
  const shapes = previewGeometry(s, { tool: "arc", pointIds: ["o", "st"] }, raw, raw, 6);
  const sh = shapes[0];
  check("end at (0,10)", sh.kind === "arc" && near(sh.end.u, 0) && near(sh.end.v, 10));
}

{
  console.log("Preview: slot and ellipse produce full shapes on their last step");
  const s = makeSketch("s", "XY");
  s.points = [pt("A", 0, 0), pt("B", 10, 0)];
  const slot = previewGeometry(s, { tool: "slot", pointIds: ["A", "B"] }, { u: 3, v: 2 }, { u: 3, v: 2 }, 6);
  check("slot = 2 lines + 2 arcs", slot.length === 4 && slot.filter((x) => x.kind === "arc").length === 2);
  const el = previewGeometry(s, { tool: "ellipse", pointIds: ["A", "B"] }, { u: 4, v: 3 }, { u: 4, v: 3 }, 6);
  check("ellipse major 10 / minor 3", el[0].kind === "ellipse" && near(el[0].rx, 10) && near(el[0].ry, 3));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
