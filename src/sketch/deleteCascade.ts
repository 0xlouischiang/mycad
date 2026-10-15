/**
 * Sketch deletion cascade — the single code path behind every sketch delete
 * (toolbar Delete button and the Delete/Backspace key both reach it through
 * sketchStore.deleteSelected).
 *
 * Data model: entities reference shared SketchPoints by id; there is no stored
 * reference count, so "is this point still used?" is derived here from the
 * post-deletion entity set.
 *
 * Rules, evaluated against the sketch as it will look after the WHOLE
 * selection is removed (so two adjacent lines deleted together also take
 * their shared corner):
 *   1. Dead entities = selected entities + any entity that references a
 *      selected point (deleting a point takes the shapes built on it; this is
 *      the pre-existing point-delete behavior, kept as-is).
 *   2. Dead points = selected points + every point a dead entity referenced
 *      that no surviving entity still references ("orphans").
 *   3. Constraints/dimensions do NOT keep a point alive: a point held only by
 *      a dimension is an orphan, and the dimension goes with it.
 *   4. Any constraint referencing a dead point or entity is removed — even if
 *      its other references survive (e.g. a coincident between a deleted
 *      endpoint and a surviving one), since it can't be satisfied anymore.
 *
 * Protected points are never removed as orphans:
 *   - `fixed` points (solver-anchored reference geometry). Nothing in the app
 *     creates them yet, but the model supports them. A fixed point the user
 *     explicitly selects is still deleted, as before.
 *   - ids the caller passes in `protectedPoints` (the store passes the
 *     in-progress tool's pending points, so deleting mid-draw can't pull the
 *     anchor out from under the active tool).
 *
 * Not applicable in this codebase (no such concepts exist yet): standalone
 * Point entities, construction geometry, and points projected from 3D model
 * edges. If they are added, they need to be added to the protected set here.
 */
import type { Constraint, Sketch, SketchEntity } from "../model/sketch";

/** Every point id an entity depends on. */
export function entityPointIds(e: SketchEntity): string[] {
  switch (e.type) {
    case "line":
      return [e.p1, e.p2];
    case "circle":
    case "ellipse":
      return [e.center];
    case "arc":
      return [e.center, e.start, e.end];
    case "spline":
      return e.points;
  }
}

/** True if every id a constraint references still exists. */
export function constraintRefsAlive(
  c: Constraint,
  entities: Set<string>,
  points: Set<string>,
): boolean {
  switch (c.type) {
    case "coincident":
    case "distance":
      return points.has(c.p1) && points.has(c.p2);
    case "horizontal":
    case "vertical":
      return entities.has(c.entity);
    case "parallel":
    case "perpendicular":
    case "equalLength":
    case "angle":
    case "concentric":
      return entities.has(c.a) && entities.has(c.b);
    case "radius":
      return entities.has(c.entity);
    case "midpoint":
      return points.has(c.point) && entities.has(c.line);
    case "symmetric":
      return points.has(c.p1) && points.has(c.p2) && entities.has(c.line);
    case "tangent":
      return entities.has(c.line) && entities.has(c.curve);
    default:
      return false;
  }
}

export interface CascadeResult {
  entities: string[];
  points: string[];
  constraints: string[];
}

/**
 * Work out everything a delete removes, without mutating the sketch.
 * See the module comment for the rules.
 */
export function collectCascade(
  sketch: Sketch,
  selectedPoints: string[],
  selectedEntities: string[],
  protectedPoints: Iterable<string> = [],
): CascadeResult {
  const selPts = new Set(selectedPoints);
  const selEnts = new Set(selectedEntities);

  const deadEntities = new Set<string>();
  for (const e of sketch.entities) {
    if (selEnts.has(e.id) || entityPointIds(e).some((p) => selPts.has(p))) {
      deadEntities.add(e.id);
    }
  }

  // Points still used by surviving entities.
  const stillUsed = new Set<string>();
  for (const e of sketch.entities) {
    if (!deadEntities.has(e.id)) for (const p of entityPointIds(e)) stillUsed.add(p);
  }

  const guard = new Set(protectedPoints);
  for (const p of sketch.points) if (p.fixed) guard.add(p.id);

  const deadPoints = new Set<string>(selPts);
  for (const e of sketch.entities) {
    if (!deadEntities.has(e.id)) continue;
    for (const p of entityPointIds(e)) {
      if (!stillUsed.has(p) && !guard.has(p)) deadPoints.add(p);
    }
  }

  const liveEntities = new Set(
    sketch.entities.filter((e) => !deadEntities.has(e.id)).map((e) => e.id),
  );
  const livePoints = new Set(
    sketch.points.filter((p) => !deadPoints.has(p.id)).map((p) => p.id),
  );
  const deadConstraints = sketch.constraints
    .filter((c) => !constraintRefsAlive(c, liveEntities, livePoints))
    .map((c) => c.id);

  return {
    entities: [...deadEntities],
    points: sketch.points.filter((p) => deadPoints.has(p.id)).map((p) => p.id),
    constraints: deadConstraints,
  };
}

/** Apply a cascade to a (mutable, already-cloned) sketch. */
export function applyCascade(s: Sketch, r: CascadeResult): void {
  const ents = new Set(r.entities);
  const pts = new Set(r.points);
  const cons = new Set(r.constraints);
  s.entities = s.entities.filter((e) => !ents.has(e.id));
  s.points = s.points.filter((p) => !pts.has(p.id));
  s.constraints = s.constraints.filter((c) => !cons.has(c.id));
}
