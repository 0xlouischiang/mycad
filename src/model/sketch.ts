/**
 * 2D sketch data model.
 *
 * A sketch lives on a plane and consists of:
 *   - points: the solver's degrees of freedom (each has u,v coordinates in the
 *     sketch plane's 2D space).
 *   - entities: geometry (line/circle/arc) that reference points by id.
 *   - constraints: relationships the solver enforces over the points.
 *
 * Everything is serializable (plain JSON, id-referenced) so a sketch can later
 * become a feature-tree node (Phase 4) and be persisted (Phase 7).
 *
 * Coordinates are 2D (u, v) in the sketch plane. The plane carries a 3D basis
 * (origin + u/v axes) so Phase 4 can map solved 2D geometry into OCCT's 3D
 * world for extrude/cut.
 */

// ---------------------------------------------------------------------------
// Planes
// ---------------------------------------------------------------------------

export type SketchPlaneId = "XY" | "XZ" | "YZ";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** A sketch plane: a 2D (u,v) frame embedded in 3D world space. */
export interface SketchPlane {
  /** Base-plane id, or "custom" for a face-derived plane. */
  id: SketchPlaneId | "custom";
  /** World-space origin of the plane's (0,0). */
  origin: Vec3;
  /** World-space unit vector for the sketch's +u (2D x) axis. */
  uAxis: Vec3;
  /** World-space unit vector for the sketch's +v (2D y) axis. */
  vAxis: Vec3;
  /** World-space plane normal (uAxis × vAxis). */
  normal: Vec3;
}

/**
 * The three base planes. u/v axes chosen so each sketch's +u/+v map to
 * intuitive world axes:
 *   XY: u=+X, v=+Y, n=+Z
 *   XZ: u=+X, v=+Z, n=-Y  (right-handed so the sketch looks natural from +Y)
 *   YZ: u=+Y, v=+Z, n=+X
 */
export const BASE_PLANES: Record<SketchPlaneId, SketchPlane> = {
  XY: {
    id: "XY",
    origin: { x: 0, y: 0, z: 0 },
    uAxis: { x: 1, y: 0, z: 0 },
    vAxis: { x: 0, y: 1, z: 0 },
    normal: { x: 0, y: 0, z: 1 },
  },
  XZ: {
    id: "XZ",
    origin: { x: 0, y: 0, z: 0 },
    uAxis: { x: 1, y: 0, z: 0 },
    vAxis: { x: 0, y: 0, z: 1 },
    normal: { x: 0, y: -1, z: 0 },
  },
  YZ: {
    id: "YZ",
    origin: { x: 0, y: 0, z: 0 },
    uAxis: { x: 0, y: 1, z: 0 },
    vAxis: { x: 0, y: 0, z: 1 },
    normal: { x: 1, y: 0, z: 0 },
  },
};

/** Map a solved 2D sketch point into 3D world space via its plane. */
export function sketchToWorld(plane: SketchPlane, u: number, v: number): Vec3 {
  return {
    x: plane.origin.x + plane.uAxis.x * u + plane.vAxis.x * v,
    y: plane.origin.y + plane.uAxis.y * u + plane.vAxis.y * v,
    z: plane.origin.z + plane.uAxis.z * u + plane.vAxis.z * v,
  };
}

// ---------------------------------------------------------------------------
// Points & entities
// ---------------------------------------------------------------------------

/** A solver degree-of-freedom: a 2D point in plane coordinates. */
export interface SketchPoint {
  id: string;
  u: number;
  v: number;
  /** Fixed points are held constant by the solver (e.g. the origin). */
  fixed: boolean;
}

export type EntityType = "line" | "circle" | "arc" | "ellipse" | "spline";

export interface LineEntity {
  id: string;
  type: "line";
  /** Endpoint point ids. */
  p1: string;
  p2: string;
}

export interface CircleEntity {
  id: string;
  type: "circle";
  center: string;
  /** Radius is a stored scalar DOF; a radius constraint can pin it. */
  radius: number;
}

/**
 * An ellipse: closed curve about a center. `rotation` is the major-axis angle
 * (radians) measured in-plane from the plane's +u axis. A lone ellipse forms a
 * closed profile like a circle.
 */
export interface EllipseEntity {
  id: string;
  type: "ellipse";
  center: string;
  majorRadius: number;
  minorRadius: number;
  rotation: number;
}

/**
 * A spline interpolating through an ordered list of points (>= 2). Its
 * endpoints (first/last point) participate in profile chaining like a line's;
 * interior points shape the curve. Built via the kernel's interpolatePoints.
 */
export interface SplineEntity {
  id: string;
  type: "spline";
  points: string[];
}

export interface ArcEntity {
  id: string;
  type: "arc";
  center: string;
  /** Start and end points; radius is implied by |center-start| and enforced. */
  start: string;
  end: string;
  /**
   * Sweep direction from start to end. "ccw" (default) sweeps counter-clockwise;
   * "cw" sweeps clockwise. Needed to disambiguate which of the two arcs between
   * start and end is meant (e.g. a slot end-cap must bulge outward, not inward).
   */
  sweep?: "ccw" | "cw";
}

export type SketchEntity =
  | LineEntity
  | CircleEntity
  | ArcEntity
  | EllipseEntity
  | SplineEntity;

// ---------------------------------------------------------------------------
// Constraints
// ---------------------------------------------------------------------------

export type ConstraintType =
  | "coincident"
  | "horizontal"
  | "vertical"
  | "parallel"
  | "perpendicular"
  | "equalLength"
  | "distance"
  | "angle"
  | "radius"
  | "concentric"
  | "midpoint"
  | "symmetric"
  | "tangent";

/** Two points made to occupy the same location. */
export interface CoincidentConstraint {
  id: string;
  type: "coincident";
  p1: string;
  p2: string;
}

/** A line entity forced horizontal (v1 == v2) or vertical (u1 == u2). */
export interface OrientConstraint {
  id: string;
  type: "horizontal" | "vertical";
  entity: string; // line entity id
}

/** Two lines made parallel or perpendicular. */
export interface PairLineConstraint {
  id: string;
  type: "parallel" | "perpendicular" | "equalLength";
  a: string; // line entity id
  b: string; // line entity id
}

/**
 * Which component of p1→p2 a distance dimension fixes:
 *   - "aligned": straight-line length, |p2 − p1| = value (value ≥ 0).
 *   - "x": horizontal offset only, u2 − u1 = value (v free).
 *   - "y": vertical offset only,   v2 − v1 = value (u free).
 */
export type DistanceAxis = "aligned" | "x" | "y";

/**
 * Fixed distance between two points (a driven dimension).
 *
 * Backward compatible: sketches saved before `axis` existed have no axis and
 * are treated as "aligned" everywhere (see distanceAxis()).
 *
 * For "x"/"y", `value` is SIGNED (the solver target for u2−u1 / v2−v1) and the
 * UI shows |value|. `dir` records the direction the dimension was placed in
 * (sign of the offset at commit time); an entered number n is stored as
 * dir·n, so editing the number never flips the side, and the signed residual
 * holds the side while dragging. A NEGATIVE entry therefore puts p2 on the
 * opposite side of p1 — documented UI rule, applied equally to literals and
 * expressions.
 */
export interface DistanceConstraint {
  id: string;
  type: "distance";
  p1: string;
  p2: string;
  value: number;
  axis?: DistanceAxis;
  /** "x"/"y" only: committed direction (+1 / −1). Missing = +1. */
  dir?: 1 | -1;
  /**
   * "x"/"y" only: where the dimension line sits, as an offset (plane units)
   * from the two points' midpoint along the perpendicular axis (v for "x",
   * u for "y"). Rendering only; never affects the solve.
   */
  offset?: number;
  /** Optional variable expression driving the value (e.g. "width/2"). */
  expr?: string;
}

/** A distance constraint's axis, defaulting legacy (axis-less) data to aligned. */
export function distanceAxis(c: DistanceConstraint): DistanceAxis {
  return c.axis ?? "aligned";
}

/** Fixed angle (degrees) between two lines. */
export interface AngleConstraint {
  id: string;
  type: "angle";
  a: string; // line entity id
  b: string; // line entity id
  value: number; // degrees
  /** Optional variable expression driving the value. */
  expr?: string;
}

/** Fixed radius for a circle or arc. */
export interface RadiusConstraint {
  id: string;
  type: "radius";
  entity: string; // circle or arc entity id
  value: number;
  /** Optional variable expression driving the value. */
  expr?: string;
}

/** Id of the fixed sketch origin point (0,0) every edited sketch carries. */
export const ORIGIN_ID = "origin";

/** Two circles/arcs share a center point (their center points coincide). */
export interface ConcentricConstraint {
  id: string;
  type: "concentric";
  a: string; // circle or arc entity id
  b: string; // circle or arc entity id
}

/** A point pinned to the midpoint of a line. */
export interface MidpointConstraint {
  id: string;
  type: "midpoint";
  point: string; // point id
  line: string; // line entity id
}

/** Two points made symmetric about a line (mirror line). */
export interface SymmetricConstraint {
  id: string;
  type: "symmetric";
  p1: string;
  p2: string;
  line: string; // mirror-line entity id
}

/** A line made tangent to a circle/arc (distance center→line == radius). */
export interface TangentConstraint {
  id: string;
  type: "tangent";
  line: string; // line entity id
  curve: string; // circle or arc entity id
}

export type Constraint =
  | CoincidentConstraint
  | OrientConstraint
  | PairLineConstraint
  | DistanceConstraint
  | AngleConstraint
  | RadiusConstraint
  | ConcentricConstraint
  | MidpointConstraint
  | SymmetricConstraint
  | TangentConstraint;

// ---------------------------------------------------------------------------
// Sketch
// ---------------------------------------------------------------------------

export interface Sketch {
  id: string;
  planeId: SketchPlaneId;
  /**
   * Offset of the sketch plane along the base plane's normal, in model units.
   * 0 = the base plane itself. Lets sketches sit at arbitrary heights (a datum
   * plane) — enables e.g. lofting two same-orientation profiles at different
   * offsets, and sketching on top of a body.
   */
  planeOffset: number;
  /**
   * When the sketch is on a selected model face (not a base plane), the face's
   * derived plane basis is stored here and takes precedence over planeId/offset.
   * Serializable; computed on the main thread from the face's mesh triangles.
   */
  customPlane?: SketchPlane;
  points: SketchPoint[];
  entities: SketchEntity[];
  constraints: Constraint[];
}

/** Create an empty sketch on the given plane, optionally offset along normal. */
export function makeSketch(
  id: string,
  planeId: SketchPlaneId,
  planeOffset = 0,
): Sketch {
  return { id, planeId, planeOffset, points: [], entities: [], constraints: [] };
}

/**
 * Resolve a sketch's effective plane: the base plane translated along its
 * normal by the sketch's offset. All 2D→3D mapping (regen, picking) must use
 * THIS, not BASE_PLANES directly, so offset sketches land at the right height.
 */
export function resolveSketchPlane(sketch: {
  planeId: SketchPlaneId;
  planeOffset?: number;
  customPlane?: SketchPlane;
}): SketchPlane {
  // A face-derived custom plane takes precedence over the base plane + offset.
  if (sketch.customPlane) return sketch.customPlane;
  const base = BASE_PLANES[sketch.planeId];
  const d = sketch.planeOffset ?? 0;
  if (d === 0) return base;
  return {
    ...base,
    origin: {
      x: base.origin.x + base.normal.x * d,
      y: base.origin.y + base.normal.y * d,
      z: base.origin.z + base.normal.z * d,
    },
  };
}

// ---------------------------------------------------------------------------
// ID generation (mirrors featureTree's approach)
// ---------------------------------------------------------------------------

let idCounter = 0;
export function newSketchId(prefix: string): string {
  idCounter += 1;
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  return `${prefix}${idCounter}_${rand}`;
}
