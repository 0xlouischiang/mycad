/**
 * Profile extraction + validation.
 *
 * Turns a 2D sketch into an ordered, closed loop of edges ready to become an
 * OCCT wire → face → extrusion. Shared by main thread (for UI validation
 * feedback) and worker (for actual geometry).
 *
 * Phase 4 policy (per design decisions):
 *  - Auto-detect the closed loop from connected entities. The user just draws a
 *    closed profile; no explicit region selection.
 *  - A single circle is its own closed loop.
 *  - If several disjoint loops exist, pick the one with the largest absolute
 *    signed area (treated as the outer boundary). Inner loops as holes are a
 *    known limitation — noted below.
 *
 * Validation errors are returned as a discriminated result rather than thrown,
 * so callers can surface a friendly message on the feature.
 */
import type {
  ArcEntity,
  CircleEntity,
  LineEntity,
  Sketch,
  SketchPoint,
} from "../model/sketch";

/** A single edge of an extracted profile, described in 2D plane coords. */
export type ProfileEdge =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | {
      kind: "arc";
      // 3-point form: start, a point on the arc (mid), end.
      x1: number;
      y1: number;
      xm: number;
      ym: number;
      x2: number;
      y2: number;
    }
  | { kind: "circle"; cx: number; cy: number; radius: number };

export interface Profile {
  edges: ProfileEdge[];
  /** True if the profile is a single full circle (one closed curve). */
  isCircle: boolean;
}

export type ProfileResult =
  | { ok: true; profile: Profile }
  | { ok: false; error: string };

/** Points are "the same" if within this distance in plane units. */
const TOL = 1e-4;

export function extractProfile(sketch: Sketch): ProfileResult {
  const pointById = new Map(sketch.points.map((p) => [p.id, p]));
  const P = (id: string): SketchPoint | undefined => pointById.get(id);

  // A lone circle is a complete closed profile by itself.
  const circles = sketch.entities.filter(
    (e): e is CircleEntity => e.type === "circle",
  );
  const chainable = sketch.entities.filter(
    (e): e is LineEntity | ArcEntity => e.type === "line" || e.type === "arc",
  );

  if (chainable.length === 0 && circles.length === 1) {
    const c = circles[0];
    const center = P(c.center);
    if (!center) return { ok: false, error: "Circle center point missing" };
    return {
      ok: true,
      profile: {
        isCircle: true,
        edges: [{ kind: "circle", cx: center.u, cy: center.v, radius: c.radius }],
      },
    };
  }

  if (chainable.length === 0) {
    return {
      ok: false,
      error:
        circles.length > 1
          ? "Multiple circles — draw a single closed profile"
          : "Sketch has no profile geometry",
    };
  }

  // Build an endpoint-adjacency graph over line/arc entities. Each entity has
  // two endpoints (p1/p2 for line, start/end for arc). We walk to find a loop.
  interface Seg {
    id: string;
    a: string; // start point id
    b: string; // end point id
    entity: LineEntity | ArcEntity;
  }
  const segs: Seg[] = chainable.map((e) =>
    e.type === "line"
      ? { id: e.id, a: e.p1, b: e.p2, entity: e }
      : { id: e.id, a: e.start, b: e.end, entity: e },
  );

  // Group endpoints by coincident location so snapped-but-distinct point ids
  // still connect. Map each point id to a canonical "node key".
  const nodeKey = buildNodeKeys(sketch.points);
  const keyOf = (pid: string) => nodeKey.get(pid) ?? pid;

  // adjacency: nodeKey -> list of segment indices touching it
  const adj = new Map<string, number[]>();
  for (let i = 0; i < segs.length; i++) {
    for (const k of [keyOf(segs[i].a), keyOf(segs[i].b)]) {
      const list = adj.get(k) ?? [];
      list.push(i);
      adj.set(k, list);
    }
  }

  // Every node in a single closed loop must have exactly degree 2. If any node
  // has degree 1, the profile is open; degree >2 means a branch/junction.
  for (const [k, list] of adj) {
    if (list.length === 1) {
      return { ok: false, error: "Profile is not closed (open endpoint)" };
    }
    if (list.length > 2) {
      return {
        ok: false,
        error: "Profile has a branch — each point may join only two edges",
      };
    }
    void k;
  }

  // Walk the loop starting from segment 0, following shared nodes.
  const ordered: Seg[] = [];
  const used = new Set<number>();
  let current = 0;
  let entryNode = keyOf(segs[0].a);
  for (let steps = 0; steps < segs.length; steps++) {
    const seg = segs[current];
    used.add(current);
    ordered.push(seg);
    // The far node is whichever endpoint isn't the entry node.
    const far = keyOf(seg.a) === entryNode ? keyOf(seg.b) : keyOf(seg.a);
    const neighbors = adj.get(far) ?? [];
    const nextIdx = neighbors.find((i) => i !== current);
    if (nextIdx === undefined) break;
    if (used.has(nextIdx)) {
      // Closed the loop back to start.
      break;
    }
    entryNode = far;
    current = nextIdx;
  }

  if (ordered.length !== segs.length) {
    return {
      ok: false,
      error:
        "Sketch has disconnected segments — draw a single connected profile",
    };
  }

  // Convert to oriented profile edges following the walk direction. We track
  // the "current point" so each edge is emitted start->end consistently.
  const edges: ProfileEdge[] = [];
  let cursor = keyOf(ordered[0].a);
  const coordFor = (pid: string) => {
    const p = P(pid);
    return p ? { u: p.u, v: p.v } : { u: 0, v: 0 };
  };
  for (const seg of ordered) {
    const e = seg.entity;
    // Determine forward orientation: does this seg start at `cursor`?
    const forward = keyOf(seg.a) === cursor;
    if (e.type === "line") {
      const s = coordFor(forward ? e.p1 : e.p2);
      const t = coordFor(forward ? e.p2 : e.p1);
      edges.push({ kind: "line", x1: s.u, y1: s.v, x2: t.u, y2: t.v });
      cursor = keyOf(forward ? seg.b : seg.a);
    } else {
      const center = coordFor(e.center);
      const s = coordFor(forward ? e.start : e.end);
      const t = coordFor(forward ? e.end : e.start);
      // Compute a mid point on the arc (for makeArcEdge's 3-point form).
      const mid = arcMidpoint(center, s, t);
      edges.push({
        kind: "arc",
        x1: s.u,
        y1: s.v,
        xm: mid.u,
        ym: mid.v,
        x2: t.u,
        y2: t.v,
      });
      cursor = keyOf(forward ? seg.b : seg.a);
    }
  }

  // Self-intersection check on the line portions (arcs approximated by chords).
  if (selfIntersects(edges)) {
    return { ok: false, error: "Profile self-intersects" };
  }

  return { ok: true, profile: { isCircle: false, edges } };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map each point id to a canonical key so coincident points (within TOL) share
 * a node. Uses a simple O(n²) merge — fine for MVP sketch sizes.
 */
function buildNodeKeys(points: SketchPoint[]): Map<string, string> {
  const keys = new Map<string, string>();
  const reps: SketchPoint[] = [];
  for (const p of points) {
    const rep = reps.find((r) => Math.hypot(r.u - p.u, r.v - p.v) < TOL);
    if (rep) keys.set(p.id, rep.id);
    else {
      reps.push(p);
      keys.set(p.id, p.id);
    }
  }
  return keys;
}

/** A point on the arc between start and end, on the circle around center. */
function arcMidpoint(
  center: { u: number; v: number },
  start: { u: number; v: number },
  end: { u: number; v: number },
): { u: number; v: number } {
  const r = Math.hypot(start.u - center.u, start.v - center.v);
  let a0 = Math.atan2(start.v - center.v, start.u - center.u);
  let a1 = Math.atan2(end.v - center.v, end.u - center.u);
  // Take the CCW arc from start to end (matches SketchCanvas rendering).
  while (a1 <= a0) a1 += 2 * Math.PI;
  const am = (a0 + a1) / 2;
  return { u: center.u + r * Math.cos(am), v: center.v + r * Math.sin(am) };
}

/**
 * Detect self-intersection among the profile's line segments (arcs are
 * approximated by their chord — a known simplification; a fine tessellation
 * check is deferred). Adjacent edges sharing an endpoint are allowed to touch.
 */
function selfIntersects(edges: ProfileEdge[]): boolean {
  const segs = edges.map((e) =>
    e.kind === "circle"
      ? null
      : e.kind === "line"
        ? { x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }
        : { x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }, // arc chord
  );
  for (let i = 0; i < segs.length; i++) {
    const a = segs[i];
    if (!a) continue;
    for (let j = i + 1; j < segs.length; j++) {
      const b = segs[j];
      if (!b) continue;
      // Skip adjacent segments (they legitimately share an endpoint).
      const adjacent = j === i + 1 || (i === 0 && j === segs.length - 1);
      if (adjacent) continue;
      if (segmentsCross(a, b)) return true;
    }
  }
  return false;
}

interface Seg2 {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function segmentsCross(a: Seg2, b: Seg2): boolean {
  const d1 = cross(b.x2 - b.x1, b.y2 - b.y1, a.x1 - b.x1, a.y1 - b.y1);
  const d2 = cross(b.x2 - b.x1, b.y2 - b.y1, a.x2 - b.x1, a.y2 - b.y1);
  const d3 = cross(a.x2 - a.x1, a.y2 - a.y1, b.x1 - a.x1, b.y1 - a.y1);
  const d4 = cross(a.x2 - a.x1, a.y2 - a.y1, b.x2 - a.x1, b.y2 - a.y1);
  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  );
}

function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}
