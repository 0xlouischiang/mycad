/**
 * Live drawing preview: what an in-progress tool WOULD create if the next
 * click landed at the cursor. Pure + render-only — it never touches the
 * sketch; the store's `clickAt` remains the single source of committed
 * geometry. Every formula here mirrors the matching branch in
 * sketchStore.clickAt, including which parameter snaps (via pointAt) and which
 * uses the raw cursor (e.g. circle radius, rectangle opposite corner).
 *
 * Shapes are returned in plane coordinates; the canvas maps them to screen.
 */
import type { Sketch } from "../model/sketch";
import type { SketchTool } from "./sketchStore";

/** Snap-together tolerance (plane units): clicks this close reuse a point. */
export const SNAP = 2.0;

export type Vec = { u: number; v: number };

export type PreviewShape =
  | { kind: "polyline"; pts: Vec[]; closed: boolean }
  | { kind: "circle"; c: Vec; r: number }
  | { kind: "arc"; c: Vec; start: Vec; end: Vec; ccw: boolean }
  | { kind: "ellipse"; c: Vec; rx: number; ry: number; rotation: number };

/**
 * Where a click at `cursor` would land a pointAt-placed point: the hit point
 * (screen-space pick), else an existing point within SNAP, else the cursor.
 * Mirrors sketchStore's pointAt.
 */
export function snapCursor(sketch: Sketch, cursor: Vec, hitPointId: string | null): Vec {
  const hit = hitPointId ? sketch.points.find((p) => p.id === hitPointId) : undefined;
  if (hit) return { u: hit.u, v: hit.v };
  const near = sketch.points.find((p) => Math.hypot(p.u - cursor.u, p.v - cursor.v) < SNAP);
  return near ? { u: near.u, v: near.v } : cursor;
}

/**
 * Preview shapes for the pending operation, or [] when nothing is in progress.
 * `raw` is the unsnapped cursor; `snapped` is snapCursor(raw).
 */
export function previewGeometry(
  sketch: Sketch,
  pending: { tool: SketchTool; pointIds: string[] } | null,
  raw: Vec,
  snapped: Vec,
  polygonSides: number,
): PreviewShape[] {
  if (!pending || pending.pointIds.length === 0) return [];
  const pts = pending.pointIds.map((id) => sketch.points.find((p) => p.id === id));
  if (pts.some((p) => !p)) return [];
  const P = pts as Vec[];
  const n = P.length;
  const seg = (a: Vec, b: Vec): PreviewShape => ({ kind: "polyline", pts: [a, b], closed: false });

  switch (pending.tool) {
    case "line":
      // Chained: pending always holds the current segment's start.
      return [seg(P[0], snapped)];

    case "spline":
      // The draft entity already renders the placed points; preview the next span.
      return [seg(P[n - 1], snapped)];

    case "circle": {
      const r = Math.hypot(raw.u - P[0].u, raw.v - P[0].v) || 1;
      return [{ kind: "circle", c: P[0], r }];
    }

    case "rectangle": {
      const p1 = P[0];
      return [
        {
          kind: "polyline",
          pts: [p1, { u: raw.u, v: p1.v }, raw, { u: p1.u, v: raw.v }],
          closed: true,
        },
      ];
    }

    case "polygon": {
      const c = P[0];
      const sides = Math.max(3, Math.round(polygonSides));
      const r = Math.hypot(raw.u - c.u, raw.v - c.v) || 1;
      const a0 = Math.atan2(raw.v - c.v, raw.u - c.u);
      const verts: Vec[] = [];
      for (let i = 0; i < sides; i++) {
        const a = a0 + (2 * Math.PI * i) / sides;
        verts.push({ u: c.u + r * Math.cos(a), v: c.v + r * Math.sin(a) });
      }
      return [{ kind: "polyline", pts: verts, closed: true }];
    }

    case "arc": {
      const c = P[0];
      if (n === 1) {
        // Choosing the start point: show the radius it would set.
        const r = Math.hypot(snapped.u - c.u, snapped.v - c.v);
        return [seg(c, snapped), { kind: "circle", c, r }];
      }
      // Choosing the end. The committed end point sits at the (snapped)
      // cursor; the solver's implicit arc constraint then pulls it onto the
      // radius. We preview that projected end directly, so the preview can
      // differ slightly from the instant after commit if the solver also
      // moves start/center to compromise.
      const start = P[1];
      const r = Math.hypot(start.u - c.u, start.v - c.v);
      const a = Math.atan2(snapped.v - c.v, snapped.u - c.u);
      const end = { u: c.u + r * Math.cos(a), v: c.v + r * Math.sin(a) };
      return [{ kind: "arc", c, start, end, ccw: true }];
    }

    case "slot": {
      if (n === 1) return [seg(P[0], snapped)]; // centerline A→B
      const [A, B] = P;
      const dx = B.u - A.u;
      const dy = B.v - A.v;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const r = Math.abs((raw.u - A.u) * nx + (raw.v - A.v) * ny) || len / 4;
      const aL = { u: A.u + nx * r, v: A.v + ny * r };
      const aR = { u: A.u - nx * r, v: A.v - ny * r };
      const bL = { u: B.u + nx * r, v: B.v + ny * r };
      const bR = { u: B.u - nx * r, v: B.v - ny * r };
      return [
        seg(aL, bL),
        { kind: "arc", c: B, start: bL, end: bR, ccw: false },
        seg(bR, aR),
        { kind: "arc", c: A, start: aR, end: aL, ccw: false },
      ];
    }

    case "ellipse": {
      const c = P[0];
      // Major endpoint is placed with addPoint (no snapping) → raw cursor.
      if (n === 1) return [seg(c, raw)];
      const m = P[1];
      const mdu = m.u - c.u;
      const mdv = m.v - c.v;
      const major = Math.hypot(mdu, mdv) || 1;
      const nx = -mdv / major;
      const ny = mdu / major;
      const minor = Math.abs((raw.u - c.u) * nx + (raw.v - c.v) * ny) || major / 2;
      return [{ kind: "ellipse", c, rx: major, ry: minor, rotation: Math.atan2(mdv, mdu) }];
    }

    default:
      return [];
  }
}
