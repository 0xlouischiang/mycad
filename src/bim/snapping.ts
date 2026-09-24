/**
 * Shared cursor-snapping for plan-view drawing tools (Phase 14a). Every tool
 * (Wall, Column, Beam, Slab) resolves its working point through
 * `resolveSnapPoint` instead of growing its own snap logic, so the catch
 * radius and priority order stay consistent everywhere.
 *
 * The catch radius is expressed in *screen pixels* and converted to world
 * units via `mmPerPx` on every call, so it stays visually consistent at any
 * zoom level (a fixed world-unit radius would catch a huge area when zoomed
 * out and almost nothing when zoomed in).
 */
import type { BuildingComponent, GridLine, Point2, Wall } from "../model/bim";

export type SnapKind =
  | "endpoint"
  | "midpoint"
  | "centerline"
  | "grid-intersection"
  | "grid-line";

export interface SnapResult {
  point: Point2;
  snapped: boolean;
  kind?: SnapKind;
}

export interface SnapCandidateSet {
  /** Endpoints of existing walls/beams/columns (footprint corners). */
  endpoints: Point2[];
  /** Midpoints of existing walls/beams. */
  midpoints: Point2[];
  /** Walls whose centerline a point can project onto. */
  walls: Wall[];
  gridLines: GridLine[];
}

/**
 * Build the standard candidate set from a level's components. Column corners
 * aren't tracked as distinct "walls" but every wall/beam already contributes
 * its own endpoints, which is what a Column needs to snap to.
 */
export function buildSnapCandidates(components: BuildingComponent[], gridLines: GridLine[]): SnapCandidateSet {
  const endpoints: Point2[] = [];
  const midpoints: Point2[] = [];
  const walls: Wall[] = [];
  for (const c of components) {
    if (c.type === "wall" || c.type === "beam") {
      endpoints.push(c.start, c.end);
      midpoints.push({ x: (c.start.x + c.end.x) / 2, y: (c.start.y + c.end.y) / 2 });
      if (c.type === "wall") walls.push(c);
    } else if (c.type === "column") {
      endpoints.push(c.at);
    }
  }
  return { endpoints, midpoints, walls, gridLines };
}

function dist(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Nearest point in `pts` within `radius` of `p`, or null. */
function nearestWithin(p: Point2, pts: Point2[], radius: number): { point: Point2; dist: number } | null {
  let best: { point: Point2; dist: number } | null = null;
  for (const pt of pts) {
    const d = dist(p, pt);
    if (d <= radius && (!best || d < best.dist)) best = { point: pt, dist: d };
  }
  return best;
}

/** Perpendicular projection of `p` onto wall centerline, clamped to the segment. */
function projectOntoWall(p: Point2, w: Wall): Point2 {
  const dx = w.end.x - w.start.x;
  const dy = w.end.y - w.start.y;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((p.x - w.start.x) * dx + (p.y - w.start.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return { x: w.start.x + t * dx, y: w.start.y + t * dy };
}

/**
 * Resolve the snapped point for a raw world-space cursor position.
 * Priority: endpoints > midpoints > centerline projections > grid
 * intersections > single grid line. Only falls through to the next class if
 * nothing in the current class is within radius.
 */
export function resolveSnapPoint(
  cursorWorldPos: Point2,
  candidateSet: SnapCandidateSet,
  mmPerPx: number,
  pixelRadius = 12,
): SnapResult {
  const radius = pixelRadius * mmPerPx;

  const endpointHit = nearestWithin(cursorWorldPos, candidateSet.endpoints, radius);
  if (endpointHit) return { point: endpointHit.point, snapped: true, kind: "endpoint" };

  const midpointHit = nearestWithin(cursorWorldPos, candidateSet.midpoints, radius);
  if (midpointHit) return { point: midpointHit.point, snapped: true, kind: "midpoint" };

  let centerlineHit: { point: Point2; dist: number } | null = null;
  for (const w of candidateSet.walls) {
    const proj = projectOntoWall(cursorWorldPos, w);
    const d = dist(cursorWorldPos, proj);
    if (d <= radius && (!centerlineHit || d < centerlineHit.dist)) centerlineHit = { point: proj, dist: d };
  }
  if (centerlineHit) return { point: centerlineHit.point, snapped: true, kind: "centerline" };

  const xLines = candidateSet.gridLines.filter((g) => g.kind === "x");
  const yLines = candidateSet.gridLines.filter((g) => g.kind === "y");
  let intersectionHit: { point: Point2; dist: number } | null = null;
  for (const gx of xLines) {
    for (const gy of yLines) {
      const pt = { x: gx.offset, y: gy.offset };
      const d = dist(cursorWorldPos, pt);
      if (d <= radius && (!intersectionHit || d < intersectionHit.dist)) intersectionHit = { point: pt, dist: d };
    }
  }
  if (intersectionHit) return { point: intersectionHit.point, snapped: true, kind: "grid-intersection" };

  let lineHit: { point: Point2; dist: number } | null = null;
  for (const g of candidateSet.gridLines) {
    const pt = g.kind === "x" ? { x: g.offset, y: cursorWorldPos.y } : { x: cursorWorldPos.x, y: g.offset };
    const d = dist(cursorWorldPos, pt);
    if (d <= radius && (!lineHit || d < lineHit.dist)) lineHit = { point: pt, dist: d };
  }
  if (lineHit) return { point: lineHit.point, snapped: true, kind: "grid-line" };

  return { point: cursorWorldPos, snapped: false };
}
