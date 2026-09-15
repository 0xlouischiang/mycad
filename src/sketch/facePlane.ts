/**
 * Derive a sketch plane from a selected planar model face, on the main thread.
 *
 * We already have the face's tessellation in the current mesh payload (the
 * faceGroups map triangle ranges to a faceRef by bbox-center — see edgeRef.ts),
 * so we can compute a planar face's plane basis directly without a worker
 * round-trip: normal from a triangle's cross product, origin at the face
 * centroid, and an arbitrary but stable in-plane u/v basis.
 *
 * Returns null if the face isn't found or isn't planar (its triangles don't
 * share a common normal within tolerance) — non-planar faces can't host a 2D
 * sketch.
 */
import type { MeshPayload } from "../kernel/protocol";
import { faceRefFromPoints } from "../model/edgeRef";
import type { SketchPlane, Vec3 } from "../model/sketch";

const PLANAR_TOL = 1e-3; // max normal deviation across a face's triangles

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}
function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function len(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}
function norm(a: Vec3): Vec3 {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
}

/**
 * Find the face group whose bbox-center matches `faceRef` and derive its plane.
 * Mirrors the triFaceRefs computation in Viewport.setShape.
 */
export function planeForFaceRef(
  mesh: MeshPayload,
  faceRef: string,
): SketchPlane | null {
  const fg = mesh.faceGroups;
  const idx = mesh.indices;
  const pos = mesh.positions;

  for (let g = 0; g < fg.length; g += 3) {
    const indexStart = fg[g];
    const indexCount = fg[g + 1];

    // Recompute this group's ref (bbox center of its vertices) to match.
    const coords: number[] = [];
    for (let i = indexStart; i < indexStart + indexCount; i++) {
      const v = idx[i] * 3;
      coords.push(pos[v], pos[v + 1], pos[v + 2]);
    }
    if (faceRefFromPoints(coords) !== faceRef) continue;

    return deriveePlaneFromFaceTris(pos, idx, indexStart, indexCount);
  }
  return null;
}

/** Compute a plane from a face's triangle index range, or null if non-planar. */
function deriveePlaneFromFaceTris(
  pos: Float32Array,
  idx: Uint32Array,
  indexStart: number,
  indexCount: number,
): SketchPlane | null {
  const vAt = (i: number): Vec3 => {
    const v = idx[i] * 3;
    return { x: pos[v], y: pos[v + 1], z: pos[v + 2] };
  };

  // Reference normal from the first non-degenerate triangle.
  let refN: Vec3 | null = null;
  let cx = 0, cy = 0, cz = 0, n = 0;
  for (let i = indexStart; i < indexStart + indexCount; i += 3) {
    const a = vAt(i), b = vAt(i + 1), c = vAt(i + 2);
    const nrm = cross(sub(b, a), sub(c, a));
    if (len(nrm) < 1e-9) continue; // degenerate triangle
    const un = norm(nrm);
    if (!refN) refN = un;
    else if (Math.abs(Math.abs(dot(un, refN)) - 1) > PLANAR_TOL) {
      return null; // triangles disagree on normal → non-planar face
    }
    // Accumulate centroid from triangle vertices.
    for (const p of [a, b, c]) {
      cx += p.x; cy += p.y; cz += p.z; n++;
    }
  }
  if (!refN || n === 0) return null;

  const origin: Vec3 = { x: cx / n, y: cy / n, z: cz / n };
  const normal = refN;

  // Build an arbitrary but stable orthonormal in-plane basis. Pick the world
  // axis least aligned with the normal as a seed for u.
  const ax = Math.abs(normal.x), ay = Math.abs(normal.y), az = Math.abs(normal.z);
  const seed: Vec3 =
    ax <= ay && ax <= az
      ? { x: 1, y: 0, z: 0 }
      : ay <= az
        ? { x: 0, y: 1, z: 0 }
        : { x: 0, y: 0, z: 1 };
  const uAxis = norm(cross(seed, normal));
  const vAxis = norm(cross(normal, uAxis));

  return { id: "custom", origin, uAxis, vAxis, normal };
}
