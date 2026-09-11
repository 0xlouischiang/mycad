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
  id: SketchPlaneId;
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

export type EntityType = "line" | "circle" | "arc";

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

export interface ArcEntity {
  id: string;
  type: "arc";
  center: string;
  /** Start and end points; radius is implied by |center-start| and enforced. */
  start: string;
  end: string;
}

export type SketchEntity = LineEntity | CircleEntity | ArcEntity;

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
  | "radius";

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

/** Fixed distance between two points (a driven dimension). */
export interface DistanceConstraint {
  id: string;
  type: "distance";
  p1: string;
  p2: string;
  value: number;
}

/** Fixed angle (degrees) between two lines. */
export interface AngleConstraint {
  id: string;
  type: "angle";
  a: string; // line entity id
  b: string; // line entity id
  value: number; // degrees
}

/** Fixed radius for a circle or arc. */
export interface RadiusConstraint {
  id: string;
  type: "radius";
  entity: string; // circle or arc entity id
  value: number;
}

export type Constraint =
  | CoincidentConstraint
  | OrientConstraint
  | PairLineConstraint
  | DistanceConstraint
  | AngleConstraint
  | RadiusConstraint;

// ---------------------------------------------------------------------------
// Sketch
// ---------------------------------------------------------------------------

export interface Sketch {
  id: string;
  planeId: SketchPlaneId;
  points: SketchPoint[];
  entities: SketchEntity[];
  constraints: Constraint[];
}

/** Create an empty sketch on the given plane. */
export function makeSketch(id: string, planeId: SketchPlaneId): Sketch {
  return { id, planeId, points: [], entities: [], constraints: [] };
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
