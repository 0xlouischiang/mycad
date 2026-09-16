/**
 * Cascade + reconciliation for BIM host/hosted + space relationships (Phase 15).
 *
 * The feature-tree regeneration engine models linear dependencies; host/hosted
 * (a door depends on its wall) and space-derivation (a room depends on its
 * enclosing walls) are NEW relationship types. We reconcile them purely,
 * off the kernel, whenever the BIM tab changes:
 *   - Openings whose host wall was deleted are removed.
 *   - Openings that no longer fit their (possibly resized/moved) host get a
 *     `warning` flag instead of leaving stale geometry.
 *   - Spaces re-trace their enclosing walls from the seed and recompute
 *     area/volume; if no enclosing loop is found the space is flagged.
 *
 * All pure functions → unit-testable without the kernel.
 */
import type {
  BIMTab,
  BuildingComponent,
  Door,
  Level,
  Point2,
  Space,
  Wall,
  WindowComponent,
} from "../model/bim";

type Opening = Door | WindowComponent;

/** Re-derive `warning` on openings and re-trace spaces. Returns a new tab. */
export function reconcileBim(tab: BIMTab): BIMTab {
  const wallById = new Map(
    tab.components.filter((c): c is Wall => c.type === "wall").map((w) => [w.id, w]),
  );
  const levelById = new Map(tab.levels.map((l) => [l.id, l]));

  const components = tab.components
    // Drop openings whose host wall no longer exists.
    .filter((c) => !(isOpening(c) && !wallById.has(c.hostId)))
    .map((c) => {
      if (isOpening(c)) return reconcileOpening(c, wallById.get(c.hostId)!);
      if (c.type === "space") return reconcileSpace(c, tab, levelById.get(c.levelId));
      return c;
    });

  return { ...tab, components };
}

function isOpening(c: BuildingComponent): c is Opening {
  return c.type === "door" || c.type === "window";
}

/** Flag an opening that no longer fits its host wall (else clear the flag). */
function reconcileOpening(op: Opening, wall: Wall): Opening {
  const length = Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y);
  const center = op.position * length;
  const half = op.width / 2;
  let warning: string | undefined;
  if (op.width <= 0 || op.height <= 0) warning = "non-positive size";
  else if (center - half < 0 || center + half > length) warning = "opening extends past the wall ends";
  else if (op.sill + op.height > wall.height) warning = "opening taller than the wall";
  return { ...op, warning };
}

// ---------------------------------------------------------------------------
// Space tracing
// ---------------------------------------------------------------------------

/**
 * Re-derive a space's boundary by tracing the walls that enclose its seed
 * point, then compute area (shoelace) and volume (× level height). MVP: uses
 * the walls' centerline segments on the same level and finds the enclosing
 * polygon by a planar arrangement walk. Non-enclosed seeds are flagged.
 */
export function reconcileSpace(space: Space, tab: BIMTab, level?: Level): Space {
  const walls = tab.components.filter(
    (c): c is Wall => c.type === "wall" && c.levelId === space.levelId,
  );
  const loop = traceEnclosingLoop(space.seed, walls);
  if (!loop) {
    return { ...space, boundaryWallIds: [], boundary: [], area: 0, volume: 0, warning: "no enclosing walls found around the seed point" };
  }
  const area = Math.abs(shoelace(loop.polygon));
  const height = level ? level.height : 3000;
  return {
    ...space,
    boundaryWallIds: loop.wallIds,
    boundary: loop.polygon,
    area,
    volume: area * height,
    warning: undefined,
  };
}

interface Loop {
  polygon: Point2[];
  wallIds: string[];
}

/**
 * Find the smallest wall-bounded loop containing `seed`. We build a graph of
 * wall endpoints, then for each face of the planar arrangement test whether it
 * contains the seed. MVP approach: enumerate simple cycles up to a modest
 * length via DFS over the endpoint graph (rooms are small), pick the
 * smallest-area cycle whose polygon contains the seed.
 */
export function traceEnclosingLoop(seed: Point2, walls: Wall[]): Loop | null {
  if (walls.length < 3) return null;
  // Node = snapped endpoint; edges = walls.
  const key = (p: Point2) => `${Math.round(p.x)},${Math.round(p.y)}`;
  const nodes = new Map<string, Point2>();
  const adj = new Map<string, { to: string; wallId: string }[]>();
  const addNode = (p: Point2) => {
    const k = key(p);
    if (!nodes.has(k)) {
      nodes.set(k, p);
      adj.set(k, []);
    }
    return k;
  };
  for (const w of walls) {
    const a = addNode(w.start);
    const b = addNode(w.end);
    if (a === b) continue;
    adj.get(a)!.push({ to: b, wallId: w.id });
    adj.get(b)!.push({ to: a, wallId: w.id });
  }

  // Enumerate simple cycles (length ≤ 12) via DFS; keep the smallest-area one
  // that contains the seed. Rooms are small, so this stays cheap.
  let best: Loop | null = null;
  let bestArea = Infinity;
  const MAX_LEN = 12;

  const startKeys = [...nodes.keys()];
  for (const start of startKeys) {
    const stack: { node: string; path: string[]; walls: string[] }[] = [
      { node: start, path: [start], walls: [] },
    ];
    while (stack.length) {
      const { node, path, walls: wids } = stack.pop()!;
      if (path.length > MAX_LEN) continue;
      for (const edge of adj.get(node)!) {
        if (edge.to === start && path.length >= 3) {
          // Closed cycle.
          const polygon = path.map((k) => nodes.get(k)!);
          if (pointInPolygon(seed, polygon)) {
            const area = Math.abs(shoelace(polygon));
            if (area > 1 && area < bestArea) {
              bestArea = area;
              best = { polygon, wallIds: [...wids, edge.wallId] };
            }
          }
          continue;
        }
        if (!path.includes(edge.to)) {
          stack.push({ node: edge.to, path: [...path, edge.to], walls: [...wids, edge.wallId] });
        }
      }
    }
  }
  return best;
}

/** Signed polygon area (shoelace). Positive = CCW. */
export function shoelace(poly: Point2[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Ray-cast point-in-polygon test. */
export function pointInPolygon(p: Point2, poly: Point2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
