/**
 * Procedural geometry for BIM massing components (Phase 14).
 *
 * Walls/slabs/columns/beams are simple extrusions, so we build their triangle
 * meshes directly on the main thread — no OCCT round-trip. Only booleans
 * (Phase 15 door/window cuts) route through the kernel. Output matches the
 * MeshPayload the viewport/RobotPreview consume: interleaved Float32 positions
 * + normals and a Uint32 index buffer, in world millimeters, Z-up.
 *
 * Pure functions (no three.js / DOM) so they unit-test in the node harness.
 */
import type {
  Beam,
  Column,
  Level,
  Point2,
  Slab,
  Wall,
} from "../model/bim";

export interface BimMesh {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint32Array;
}

/** A mesh accumulator that welds nothing (flat-shaded, per-face normals). */
class MeshBuilder {
  private pos: number[] = [];
  private nrm: number[] = [];
  private idx: number[] = [];

  /** Add a quad (4 corners, CCW seen from outside) with one face normal. */
  quad(a: V3, b: V3, c: V3, d: V3): void {
    const n = normal(a, b, c);
    const base = this.pos.length / 3;
    for (const p of [a, b, c, d]) {
      this.pos.push(p[0], p[1], p[2]);
      this.nrm.push(n[0], n[1], n[2]);
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  /** Add a triangle with its own face normal. */
  tri(a: V3, b: V3, c: V3): void {
    const n = normal(a, b, c);
    const base = this.pos.length / 3;
    for (const p of [a, b, c]) {
      this.pos.push(p[0], p[1], p[2]);
      this.nrm.push(n[0], n[1], n[2]);
    }
    this.idx.push(base, base + 1, base + 2);
  }

  build(): BimMesh {
    return {
      positions: new Float32Array(this.pos),
      normals: new Float32Array(this.nrm),
      indices: new Uint32Array(this.idx),
    };
  }
}

type V3 = [number, number, number];

function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: V3, b: V3): V3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function normal(a: V3, b: V3, c: V3): V3 {
  const n = cross(sub(b, a), sub(c, a));
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / len, n[1] / len, n[2] / len];
}

/**
 * Build a box from a bottom rectangle (4 CCW corners at z0) extruded to z1.
 * Corners must be ordered CCW in plan so side quads face outward.
 */
export function prismFromQuad(
  corners: [Point2, Point2, Point2, Point2],
  z0: number,
  z1: number,
): BimMesh {
  const mb = new MeshBuilder();
  const [p0, p1, p2, p3] = corners;
  const b0: V3 = [p0.x, p0.y, z0];
  const b1: V3 = [p1.x, p1.y, z0];
  const b2: V3 = [p2.x, p2.y, z0];
  const b3: V3 = [p3.x, p3.y, z0];
  const t0: V3 = [p0.x, p0.y, z1];
  const t1: V3 = [p1.x, p1.y, z1];
  const t2: V3 = [p2.x, p2.y, z1];
  const t3: V3 = [p3.x, p3.y, z1];
  // Bottom (facing -Z: reverse winding), top (+Z).
  mb.quad(b0, b3, b2, b1);
  mb.quad(t0, t1, t2, t3);
  // Sides.
  mb.quad(b0, b1, t1, t0);
  mb.quad(b1, b2, t2, t1);
  mb.quad(b2, b3, t3, t2);
  mb.quad(b3, b0, t0, t3);
  return mb.build();
}

/** Level lookup helper used by the mesh builders. */
function levelZ(level: Level | undefined): number {
  return level ? level.elevation : 0;
}

/**
 * Wall mesh: a box centered on the start→end centerline, `thickness` wide,
 * `height` tall, sitting at level elevation + baseOffset. The centerline runs
 * along the wall axis; corners are offset by ±thickness/2 along the perpendicular.
 */
export function wallMesh(wall: Wall, level?: Level): BimMesh {
  const { start, end, thickness, height, baseOffset } = wall;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  // Unit perpendicular in plan.
  const px = -dy / len;
  const py = dx / len;
  const h = thickness / 2;
  const corners: [Point2, Point2, Point2, Point2] = [
    { x: start.x + px * h, y: start.y + py * h },
    { x: end.x + px * h, y: end.y + py * h },
    { x: end.x - px * h, y: end.y - py * h },
    { x: start.x - px * h, y: start.y - py * h },
  ];
  const z0 = levelZ(level) + baseOffset;
  return prismFromQuad(corners, z0, z0 + height);
}

/** Column mesh: a rectangular prism centered at `at`, width×depth×height. */
export function columnMesh(col: Column, level?: Level): BimMesh {
  const hw = col.width / 2;
  const hd = col.depth / 2;
  const { x, y } = col.at;
  const corners: [Point2, Point2, Point2, Point2] = [
    { x: x - hw, y: y - hd },
    { x: x + hw, y: y - hd },
    { x: x + hw, y: y + hd },
    { x: x - hw, y: y + hd },
  ];
  const z0 = levelZ(level);
  return prismFromQuad(corners, z0, z0 + col.height);
}

/**
 * Beam mesh: a box along start→end at the top of the level (its underside at
 * elevation + level height − depth, so it sits under the slab above). Width is
 * across the beam axis, depth is vertical.
 */
export function beamMesh(beam: Beam, level?: Level): BimMesh {
  const dx = beam.end.x - beam.start.x;
  const dy = beam.end.y - beam.start.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const h = beam.width / 2;
  const corners: [Point2, Point2, Point2, Point2] = [
    { x: beam.start.x + px * h, y: beam.start.y + py * h },
    { x: beam.end.x + px * h, y: beam.end.y + py * h },
    { x: beam.end.x - px * h, y: beam.end.y - py * h },
    { x: beam.start.x - px * h, y: beam.start.y - py * h },
  ];
  const top = levelZ(level) + (level ? level.height : 3000);
  return prismFromQuad(corners, top - beam.depth, top);
}

/**
 * Slab mesh: extrude a plan boundary polygon down by `thickness` from the level
 * elevation (top of slab at elevation, so the storey floor sits at z=elevation).
 * Boundary assumed simple; triangulated with an ear-clipping fan.
 */
export function slabMesh(slab: Slab, level?: Level): BimMesh {
  const mb = new MeshBuilder();
  const poly = slab.boundary;
  if (poly.length < 3) return mb.build();
  const z1 = levelZ(level);
  const z0 = z1 - slab.thickness;
  const tris = triangulate(poly);
  // Top (+Z) and bottom (−Z, reversed).
  for (const [a, b, c] of tris) {
    mb.tri([poly[a].x, poly[a].y, z1], [poly[b].x, poly[b].y, z1], [poly[c].x, poly[c].y, z1]);
    mb.tri([poly[c].x, poly[c].y, z0], [poly[b].x, poly[b].y, z0], [poly[a].x, poly[a].y, z0]);
  }
  // Sides.
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    mb.quad([p.x, p.y, z0], [q.x, q.y, z0], [q.x, q.y, z1], [p.x, p.y, z1]);
  }
  return mb.build();
}

/**
 * Ear-clipping triangulation of a simple polygon (returns index triples).
 * Handles CW or CCW input; robust enough for the convex/simple room boundaries
 * we author. Complex/self-intersecting polygons are out of scope.
 */
export function triangulate(poly: Point2[]): [number, number, number][] {
  const n = poly.length;
  if (n < 3) return [];
  const idx = Array.from({ length: n }, (_, i) => i);
  // Ensure CCW so the ear test's sign is consistent.
  if (signedArea(poly) < 0) idx.reverse();
  const tris: [number, number, number][] = [];
  let guard = 0;
  while (idx.length > 3 && guard++ < n * n) {
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const a = idx[(i - 1 + idx.length) % idx.length];
      const b = idx[i];
      const c = idx[(i + 1) % idx.length];
      if (isEar(poly, idx, a, b, c)) {
        tris.push([a, b, c]);
        idx.splice(i, 1);
        clipped = true;
        break;
      }
    }
    if (!clipped) break; // degenerate; bail with what we have
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]]);
  return tris;
}

function signedArea(poly: Point2[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

function isEar(poly: Point2[], idx: number[], a: number, b: number, c: number): boolean {
  const A = poly[a], B = poly[b], C = poly[c];
  // Convex corner? (CCW cross > 0)
  const crossz = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
  if (crossz <= 0) return false;
  // No other vertex inside triangle ABC.
  for (const j of idx) {
    if (j === a || j === b || j === c) continue;
    if (pointInTri(poly[j], A, B, C)) return false;
  }
  return true;
}

function pointInTri(p: Point2, a: Point2, b: Point2, c: Point2): boolean {
  const d1 = sign2(p, a, b);
  const d2 = sign2(p, b, c);
  const d3 = sign2(p, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}
function sign2(p: Point2, a: Point2, b: Point2): number {
  return (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
}

/** Axis-aligned bbox of a mesh (for tests + preview framing). */
export function meshBBox(m: BimMesh): { min: V3; max: V3 } {
  const min: V3 = [Infinity, Infinity, Infinity];
  const max: V3 = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = m.positions[i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return { min, max };
}
