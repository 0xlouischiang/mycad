/**
 * Box-select hit-testing (pure, plane coordinates).
 *
 * Two CAD-standard conventions, chosen by drag direction (AutoCAD/SolidWorks):
 *   - window   (drag left→right): entity must lie entirely inside the box.
 *   - crossing (drag right→left): entity is picked if any part touches the box.
 * Points are picked when inside the box in either mode.
 *
 * Curved entities (circle/arc/ellipse) are tested against a sampled polyline
 * (SAMPLES segments per full turn), so an entity grazing the box edge by less
 * than the chord error (~0.1% of its radius) may be misclassified. Lines are
 * exact; splines are tested as the polyline the canvas draws them as.
 */
import type { Sketch, SketchEntity } from "../model/sketch";

export interface Box {
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
}

export type BoxMode = "window" | "crossing";

type Vec = { u: number; v: number };

const SAMPLES = 96;

export function boxFromCorners(a: Vec, b: Vec): Box {
  return {
    uMin: Math.min(a.u, b.u),
    uMax: Math.max(a.u, b.u),
    vMin: Math.min(a.v, b.v),
    vMax: Math.max(a.v, b.v),
  };
}

const inside = (b: Box, p: Vec) =>
  p.u >= b.uMin && p.u <= b.uMax && p.v >= b.vMin && p.v <= b.vMax;

/** Proper/touching intersection of segments p1p2 and q1q2. */
function segmentsIntersect(p1: Vec, p2: Vec, q1: Vec, q2: Vec): boolean {
  const cross = (o: Vec, a: Vec, b: Vec) => (a.u - o.u) * (b.v - o.v) - (a.v - o.v) * (b.u - o.u);
  const d1 = cross(q1, q2, p1);
  const d2 = cross(q1, q2, p2);
  const d3 = cross(p1, p2, q1);
  const d4 = cross(p1, p2, q2);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0) || d1 === 0 || d2 === 0) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0) || d3 === 0 || d4 === 0) &&
    // Collinear-but-disjoint guard via bounding-box overlap.
    Math.max(p1.u, p2.u) >= Math.min(q1.u, q2.u) &&
    Math.max(q1.u, q2.u) >= Math.min(p1.u, p2.u) &&
    Math.max(p1.v, p2.v) >= Math.min(q1.v, q2.v) &&
    Math.max(q1.v, q2.v) >= Math.min(p1.v, p2.v);
}

function segmentTouchesBox(b: Box, a: Vec, c: Vec): boolean {
  if (inside(b, a) || inside(b, c)) return true;
  const corners = [
    { u: b.uMin, v: b.vMin },
    { u: b.uMax, v: b.vMin },
    { u: b.uMax, v: b.vMax },
    { u: b.uMin, v: b.vMax },
  ];
  for (let i = 0; i < 4; i++) {
    if (segmentsIntersect(a, c, corners[i], corners[(i + 1) % 4])) return true;
  }
  return false;
}

/** Polyline approximation of an entity in plane space (null if unresolvable). */
export function entityPolyline(sketch: Sketch, e: SketchEntity): Vec[] | null {
  const pt = (id: string) => sketch.points.find((p) => p.id === id);
  const ring = (c: Vec, rx: number, ry: number, rot: number, a0: number, sweep: number, steps: number) => {
    const out: Vec[] = [];
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    for (let i = 0; i <= steps; i++) {
      const t = a0 + (sweep * i) / steps;
      const x = rx * Math.cos(t);
      const y = ry * Math.sin(t);
      out.push({ u: c.u + x * cr - y * sr, v: c.v + x * sr + y * cr });
    }
    return out;
  };

  switch (e.type) {
    case "line": {
      const a = pt(e.p1);
      const b = pt(e.p2);
      return a && b ? [a, b] : null;
    }
    case "spline": {
      const ps = e.points.map(pt);
      return ps.every(Boolean) ? (ps as Vec[]) : null;
    }
    case "circle": {
      const c = pt(e.center);
      return c ? ring(c, e.radius, e.radius, 0, 0, 2 * Math.PI, SAMPLES) : null;
    }
    case "ellipse": {
      const c = pt(e.center);
      return c ? ring(c, e.majorRadius, e.minorRadius, e.rotation, 0, 2 * Math.PI, SAMPLES) : null;
    }
    case "arc": {
      const c = pt(e.center);
      const s = pt(e.start);
      const en = pt(e.end);
      if (!c || !s || !en) return null;
      // Same sweep resolution as the canvas's ArcPath.
      const r = Math.hypot(s.u - c.u, s.v - c.v);
      const a0 = Math.atan2(s.v - c.v, s.u - c.u);
      const a1 = Math.atan2(en.v - c.v, en.u - c.u);
      let d = a1 - a0;
      if ((e.sweep ?? "ccw") === "ccw") while (d <= 0) d += 2 * Math.PI;
      else while (d >= 0) d -= 2 * Math.PI;
      const steps = Math.max(4, Math.ceil((SAMPLES * Math.abs(d)) / (2 * Math.PI)));
      return ring(c, r, r, 0, a0, d, steps);
    }
  }
}

export function boxSelect(
  sketch: Sketch,
  box: Box,
  mode: BoxMode,
): { points: string[]; entities: string[] } {
  const points = sketch.points.filter((p) => inside(box, p)).map((p) => p.id);
  const entities: string[] = [];
  for (const e of sketch.entities) {
    const poly = entityPolyline(sketch, e);
    if (!poly || poly.length === 0) continue;
    // The box is convex, so a polyline is inside iff all its vertices are.
    const hit =
      mode === "window"
        ? poly.every((p) => inside(box, p))
        : poly.length === 1
          ? inside(box, poly[0])
          : poly.some((p, i) => i > 0 && segmentTouchesBox(box, poly[i - 1], p));
    if (hit) entities.push(e.id);
  }
  return { points, entities };
}
