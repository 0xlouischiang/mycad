/**
 * Distance-dimension geometry shared by the placement preview and the
 * committed-dimension renderer (pure, plane coordinates).
 *
 * Mode inference while placing (SolidWorks/Onshape feel), relative to the
 * axis-aligned box spanned by the two measured points:
 *   - cursor above/below the box (outside it in v, within it in u)
 *       → horizontal dimension ("x"): dimension line runs along u.
 *   - cursor left/right of the box (outside in u, within in v)
 *       → vertical dimension ("y"): dimension line runs along v.
 *   - anywhere else (inside the box, or diagonally off a corner)
 *       → aligned, offset perpendicular to the segment.
 * Degenerate spans fall out naturally: two points with equal v have a zero-
 * height box, so "inside" collapses and hovering beside them along u gives a
 * vertical dimension (whose value would be 0) — the user simply hovers above
 * instead, as in other sketchers.
 */
import type { DistanceAxis } from "../model/sketch";

export type Vec = { u: number; v: number };

/** A small slack so the box isn't razor-thin for near-aligned points. */
const BOX_PAD = 0.5;

export function inferAxis(a: Vec, b: Vec, cursor: Vec, padPlane = BOX_PAD): DistanceAxis {
  const uMin = Math.min(a.u, b.u) - padPlane;
  const uMax = Math.max(a.u, b.u) + padPlane;
  const vMin = Math.min(a.v, b.v) - padPlane;
  const vMax = Math.max(a.v, b.v) + padPlane;
  const inU = cursor.u >= uMin && cursor.u <= uMax;
  const inV = cursor.v >= vMin && cursor.v <= vMax;
  if (inU && !inV) return "x";
  if (inV && !inU) return "y";
  return "aligned";
}

/**
 * Offset of the dimension line, stored with the constraint:
 *   "x": v-offset of the line from the points' mid-v.
 *   "y": u-offset of the line from the points' mid-u.
 *   "aligned": signed distance along the segment's left normal.
 */
export function placementOffset(a: Vec, b: Vec, cursor: Vec, axis: DistanceAxis): number {
  if (axis === "x") return cursor.v - (a.v + b.v) / 2;
  if (axis === "y") return cursor.u - (a.u + b.u) / 2;
  const dx = b.u - a.u;
  const dy = b.v - a.v;
  const len = Math.hypot(dx, dy);
  if (len < 1e-12) return 0;
  return ((cursor.u - a.u) * -dy + (cursor.v - a.v) * dx) / len;
}

/** Current measured value for an axis (signed for x/y). */
export function measure(a: Vec, b: Vec, axis: DistanceAxis): number {
  if (axis === "x") return b.u - a.u;
  if (axis === "y") return b.v - a.v;
  return Math.hypot(b.u - a.u, b.v - a.v);
}

export interface DimensionLayout {
  /** Extension lines (each from a measured point out to the dimension line). */
  ext: [Vec, Vec][];
  /** Dimension line endpoints (arrowheads go at both ends, pointing outward). */
  line: [Vec, Vec];
  /** Where the value label is centered. */
  label: Vec;
}

/**
 * Layout of a dimension in plane space. `offset` follows placementOffset();
 * a missing offset uses a default clearance so legacy/aligned dimensions
 * still read clearly.
 */
export function layoutDimension(
  a: Vec,
  b: Vec,
  axis: DistanceAxis,
  offset: number | undefined,
  defaultClearance: number,
): DimensionLayout {
  if (axis === "x") {
    const lineV = (a.v + b.v) / 2 + (offset ?? defaultClearance + Math.abs(a.v - b.v) / 2);
    const pa = { u: a.u, v: lineV };
    const pb = { u: b.u, v: lineV };
    return { ext: [[a, pa], [b, pb]], line: [pa, pb], label: { u: (a.u + b.u) / 2, v: lineV } };
  }
  if (axis === "y") {
    const lineU = (a.u + b.u) / 2 + (offset ?? defaultClearance + Math.abs(a.u - b.u) / 2);
    const pa = { u: lineU, v: a.v };
    const pb = { u: lineU, v: b.v };
    return { ext: [[a, pa], [b, pb]], line: [pa, pb], label: { u: lineU, v: (a.v + b.v) / 2 } };
  }
  const dx = b.u - a.u;
  const dy = b.v - a.v;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const o = offset ?? defaultClearance;
  const pa = { u: a.u + nx * o, v: a.v + ny * o };
  const pb = { u: b.u + nx * o, v: b.v + ny * o };
  return {
    ext: o === 0 ? [] : [[a, pa], [b, pb]],
    line: [pa, pb],
    label: { u: (pa.u + pb.u) / 2, v: (pa.v + pb.v) / 2 },
  };
}

export const AXIS_LABEL: Record<DistanceAxis, string> = {
  aligned: "Distance",
  x: "Horizontal distance",
  y: "Vertical distance",
};
