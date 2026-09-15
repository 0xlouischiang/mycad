/**
 * Context builders for the chat / LLM command path (Phase 13).
 *
 * These pure functions turn the current app state into the compact, textual
 * context handed to the model each turn:
 *   - summarizeTree: the ordered feature list (what exists, ids, status).
 *   - catalogGeometry: every selectable edge and face with a geometric
 *     descriptor, derived ENTIRELY from the tessellated payload already in the
 *     store — no viewport/click needed. The ref strings here are byte-for-byte
 *     the same ones the regen resolver matches (see edgeRef.ts / regen.ts), so a
 *     fillet/shell command that stores a ref from this catalog resolves against
 *     live geometry correctly.
 *
 * No React / DOM / fetch deps → unit-testable in the node harness.
 */
import type { EdgePayload, MeshPayload } from "../kernel/protocol";
import { edgeRefFromPoints, faceRefFromPoints } from "../model/edgeRef";
import { planeForFaceRef } from "../sketch/facePlane";
import type { FeatureTree } from "../model/featureTree";
import type { FeatureStatus } from "../kernel/protocol";

// ---------------------------------------------------------------------------
// Feature tree summary
// ---------------------------------------------------------------------------

export interface FeatureSummary {
  index: number;
  id: string;
  name: string;
  type: string;
  operation?: string;
  suppressed: boolean;
  error?: string;
}

/** Compact, ordered summary of the feature tree for the model. */
export function summarizeTree(
  tree: FeatureTree,
  statuses: Record<string, FeatureStatus> = {},
): FeatureSummary[] {
  return tree.features.map((f, index) => {
    const st = statuses[f.id];
    const summary: FeatureSummary = {
      index,
      id: f.id,
      name: f.name,
      type: f.type,
      suppressed: f.suppressed ?? false,
    };
    if ("operation" in f && f.operation) summary.operation = f.operation;
    if (st?.state === "error" && st.message) summary.error = st.message;
    return summary;
  });
}

// ---------------------------------------------------------------------------
// Geometry catalog (edges + faces)
// ---------------------------------------------------------------------------

export interface EdgeInfo {
  ref: string;
  center: [number, number, number];
  length: number;
  /** Bounding box of the edge's samples: [min, max]. */
  bbox: [[number, number, number], [number, number, number]];
  /** True when the edge runs along a single world axis. */
  axis: "x" | "y" | "z" | null;
}

export interface FaceInfo {
  ref: string;
  center: [number, number, number];
  /** Unit normal if the face is planar, else null. */
  normal: [number, number, number] | null;
  planar: boolean;
}

export interface GeometryCatalog {
  edges: EdgeInfo[];
  faces: FaceInfo[];
  /** Overall bounding box of the whole shape, for "top/bottom/left" reasoning. */
  bbox: { min: [number, number, number]; max: [number, number, number] } | null;
}

const AXIS_TOL = 1e-3;

/**
 * Enumerate every edge in the payload. edgeGroups are [floatStart, floatCount,
 * hash] in FLOAT-offset units (see the kernel memory note / Viewport.ts) — so
 * floatCount/3 points. We compute the same bbox-center ref the picker/resolver
 * use, plus true polyline length and axis-alignment.
 */
export function catalogEdges(edges: EdgePayload): EdgeInfo[] {
  const { points, edgeGroups } = edges;
  const out: EdgeInfo[] = [];
  for (let g = 0; g < edgeGroups.length; g += 3) {
    const start = edgeGroups[g];
    const count = edgeGroups[g + 1];
    let xmin = Infinity, ymin = Infinity, zmin = Infinity;
    let xmax = -Infinity, ymax = -Infinity, zmax = -Infinity;
    let length = 0;
    for (let i = start; i < start + count; i += 3) {
      const x = points[i], y = points[i + 1], z = points[i + 2];
      if (x < xmin) xmin = x;
      if (y < ymin) ymin = y;
      if (z < zmin) zmin = z;
      if (x > xmax) xmax = x;
      if (y > ymax) ymax = y;
      if (z > zmax) zmax = z;
      if (i + 5 < start + count) {
        length += Math.hypot(
          points[i + 3] - x,
          points[i + 4] - y,
          points[i + 5] - z,
        );
      }
    }
    const ref = edgeRefFromPoints(points.subarray(start, start + count));
    // Axis-aligned if it varies along exactly one axis.
    const dx = xmax - xmin, dy = ymax - ymin, dz = zmax - zmin;
    let axis: EdgeInfo["axis"] = null;
    if (dy < AXIS_TOL && dz < AXIS_TOL && dx >= AXIS_TOL) axis = "x";
    else if (dx < AXIS_TOL && dz < AXIS_TOL && dy >= AXIS_TOL) axis = "y";
    else if (dx < AXIS_TOL && dy < AXIS_TOL && dz >= AXIS_TOL) axis = "z";
    out.push({
      ref,
      center: [(xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2],
      length,
      bbox: [
        [xmin, ymin, zmin],
        [xmax, ymax, zmax],
      ],
      axis,
    });
  }
  return out;
}

/**
 * Enumerate every face in the payload. faceGroups are [indexStart, indexCount,
 * hash] in INDEX units (3 per triangle). Ref is the bbox-center of the group's
 * vertices (matching Viewport.setShape); normal via planeForFaceRef.
 */
export function catalogFaces(mesh: MeshPayload): FaceInfo[] {
  const fg = mesh.faceGroups;
  const idx = mesh.indices;
  const pos = mesh.positions;
  const out: FaceInfo[] = [];
  for (let g = 0; g < fg.length; g += 3) {
    const indexStart = fg[g];
    const indexCount = fg[g + 1];
    const coords: number[] = [];
    let xmin = Infinity, ymin = Infinity, zmin = Infinity;
    let xmax = -Infinity, ymax = -Infinity, zmax = -Infinity;
    for (let i = indexStart; i < indexStart + indexCount; i++) {
      const v = idx[i] * 3;
      const x = pos[v], y = pos[v + 1], z = pos[v + 2];
      coords.push(x, y, z);
      if (x < xmin) xmin = x;
      if (y < ymin) ymin = y;
      if (z < zmin) zmin = z;
      if (x > xmax) xmax = x;
      if (y > ymax) ymax = y;
      if (z > zmax) zmax = z;
    }
    const ref = faceRefFromPoints(coords);
    const plane = planeForFaceRef(mesh, ref);
    out.push({
      ref,
      center: [(xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2],
      normal: plane ? [plane.normal.x, plane.normal.y, plane.normal.z] : null,
      planar: plane !== null,
    });
  }
  return out;
}

/** Build the full geometry catalog from a renderable shape (mesh + edges + bbox). */
export function catalogGeometry(
  shape: {
    mesh: MeshPayload;
    edges: EdgePayload;
    bbox: { min: [number, number, number]; max: [number, number, number] };
  } | null,
): GeometryCatalog {
  if (!shape) return { edges: [], faces: [], bbox: null };
  return {
    edges: catalogEdges(shape.edges),
    faces: catalogFaces(shape.mesh),
    bbox: shape.bbox,
  };
}
