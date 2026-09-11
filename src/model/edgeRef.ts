/**
 * Stable edge references (the topological-naming scheme, architecture req #3).
 *
 * OCCT edge/face *hashes* are derived from in-memory TShape pointers, so they
 * change on every rebuild — even rebuilding identical geometry. Since our
 * regeneration rebuilds the whole body from the feature tree each time, a raw
 * hash is useless as a persistent reference.
 *
 * What IS stable across rebuilds is the GEOMETRY: regeneration is
 * deterministic, so the edge at a given 3D location is the same edge every
 * time. We therefore reference an edge by a geometric signature — the rounded
 * center of its axis-aligned bounding box. This is computable both:
 *   - at pick time, from the edge's sampled polyline points, and
 *   - at resolve time (in the worker), from the edge handle's bounding box.
 *
 * Known limitations (acceptable per the "reasonable, mostly-stable" bar):
 *   - Two distinct edges that happen to share a bbox center collide. Rare for
 *     real models; we tolerate it (both would be selected).
 *   - A large edit that moves an edge changes its signature, so a fillet loses
 *     its reference → that feature errors and regeneration continues.
 */

/** A stable, serializable reference to an edge by rounded bbox-center. */
export type EdgeRef = string;

/** Rounding grid (model units). 1e3 => 0.001 precision, matches our tolerances. */
const QUANT = 1000;

function q(n: number): number {
  // Round to the quantization grid; normalize -0 to 0 for stable strings.
  const r = Math.round(n * QUANT) / QUANT;
  return r === 0 ? 0 : r;
}

/** Build an EdgeRef from a 3D bounding-box center. */
export function edgeRefFromCenter(cx: number, cy: number, cz: number): EdgeRef {
  return `${q(cx)},${q(cy)},${q(cz)}`;
}

/**
 * Build an EdgeRef from a flat array of XYZ sample points along the edge
 * (e.g. one edge group's slice of an EdgePayload's points). Uses the midpoint
 * of the axis-aligned bounding box of the samples — matching the worker's
 * getBoundingBox-center computation for straight and simple curved edges.
 */
export function edgeRefFromPoints(points: Float32Array | number[]): EdgeRef {
  let xmin = Infinity,
    ymin = Infinity,
    zmin = Infinity,
    xmax = -Infinity,
    ymax = -Infinity,
    zmax = -Infinity;
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i];
    const y = points[i + 1];
    const z = points[i + 2];
    if (x < xmin) xmin = x;
    if (y < ymin) ymin = y;
    if (z < zmin) zmin = z;
    if (x > xmax) xmax = x;
    if (y > ymax) ymax = y;
    if (z > zmax) zmax = z;
  }
  return edgeRefFromCenter((xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2);
}
