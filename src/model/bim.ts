/**
 * BIM (building information modeling) data model — architecture requirement 10.
 *
 * A BIMTab is an ADDITIVE tab type (like RobotTab in robot.ts): the Document
 * keeps a separate `bims: BIMTab[]` list so the Part Studio + Robot code paths
 * are untouched. A BIM tab holds:
 *   - levels: storeys (elevation + height)
 *   - grids: orthogonal plan grid lines (authoring aids + snap targets)
 *   - components: the building elements (Wall/Slab/Column/Beam, and in Phase 15
 *     Door/Window/Space)
 *
 * Geometry is generated PROCEDURALLY (src/bim/geometry.ts) for massing, and only
 * routed through the OCCT kernel for booleans (Phase 15 door/window cuts). All
 * types are plain-JSON serializable so a whole Document persists in one record.
 *
 * Units: millimeters, Z-up, matching the mechanical viewport convention. Plan
 * coordinates are (x, y) in the world XY plane; elevation is world Z.
 */
import { newFeatureId } from "./featureTree";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export interface Point2 {
  x: number;
  y: number;
}

/** A storey. `elevation` is the finished-floor world Z; `height` the storey height. */
export interface Level {
  id: string;
  name: string;
  elevation: number;
  height: number;
}

/**
 * An orthogonal plan grid line. MVP: axis-aligned. A grid of kind "x" runs
 * parallel to the Y axis at world X = offset (and vice-versa) — i.e. `offset`
 * is the coordinate on the axis named by `kind`.
 */
export interface GridLine {
  id: string;
  label: string;
  kind: "x" | "y";
  offset: number;
}

// ---------------------------------------------------------------------------
// Building components (discriminated union on `type`)
// ---------------------------------------------------------------------------

export interface Wall {
  id: string;
  type: "wall";
  levelId: string;
  start: Point2;
  end: Point2;
  thickness: number;
  height: number;
  /** Base offset above the level elevation (mm). Usually 0. */
  baseOffset: number;
  /** Number of material layers (informational for massing; used in IFC later). */
  materialLayers: number;
}

export interface Slab {
  id: string;
  type: "slab";
  levelId: string;
  /** Boundary polygon in plan (x,y), assumed simple (non-self-intersecting). */
  boundary: Point2[];
  thickness: number;
}

export interface Column {
  id: string;
  type: "column";
  levelId: string;
  at: Point2;
  width: number;
  depth: number;
  height: number;
}

export interface Beam {
  id: string;
  type: "beam";
  levelId: string;
  start: Point2;
  end: Point2;
  width: number;
  depth: number;
}

/**
 * A wall-hosted opening (Phase 15). `position` is the parameter 0..1 along the
 * host wall's start→end; `sill` is the bottom of the opening above the wall
 * base (mm). `warning` is set when the opening can't be placed (e.g. the host
 * shrank past it) so the UI can flag it instead of leaving stale geometry.
 */
export interface Door {
  id: string;
  type: "door";
  levelId: string;
  hostId: string;
  position: number;
  width: number;
  height: number;
  sill: number;
  warning?: string;
}

export interface WindowComponent {
  id: string;
  type: "window";
  levelId: string;
  hostId: string;
  position: number;
  width: number;
  height: number;
  sill: number;
  warning?: string;
}

/**
 * A boundary-derived room volume (Phase 15). Non-solid: used for area/volume
 * reporting, not rendered as a solid. Derived by tracing the walls enclosing
 * `seed`; `boundaryWallIds` records the traced loop for cascade invalidation.
 */
export interface Space {
  id: string;
  type: "space";
  levelId: string;
  seed: Point2;
  boundaryWallIds: string[];
  /** Derived boundary polygon (plan), area (mm²), volume (mm³). */
  boundary: Point2[];
  area: number;
  volume: number;
  warning?: string;
}

export type BuildingComponent =
  | Wall
  | Slab
  | Column
  | Beam
  | Door
  | WindowComponent
  | Space;

export type ComponentType = BuildingComponent["type"];

// ---------------------------------------------------------------------------
// The tab
// ---------------------------------------------------------------------------

export interface BIMTab {
  kind: "bim";
  id: string;
  name: string;
  levels: Level[];
  grids: GridLine[];
  components: BuildingComponent[];
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

export function makeBIMTab(name: string): BIMTab {
  // Start with a ground level so authoring has a valid target immediately.
  const ground = makeLevel("Level 1", 0, 3000);
  return {
    kind: "bim",
    id: newFeatureId(),
    name,
    levels: [ground],
    grids: [],
    components: [],
  };
}

export function makeLevel(name: string, elevation: number, height = 3000): Level {
  return { id: newFeatureId(), name, elevation, height };
}

export function makeGridLine(label: string, kind: "x" | "y", offset: number): GridLine {
  return { id: newFeatureId(), label, kind, offset };
}

export function makeWall(
  levelId: string,
  start: Point2,
  end: Point2,
  thickness = 200,
  height = 3000,
): Wall {
  return {
    id: newFeatureId(),
    type: "wall",
    levelId,
    start,
    end,
    thickness,
    height,
    baseOffset: 0,
    materialLayers: 1,
  };
}

export function makeSlab(levelId: string, boundary: Point2[], thickness = 250): Slab {
  return { id: newFeatureId(), type: "slab", levelId, boundary, thickness };
}

export function makeColumn(
  levelId: string,
  at: Point2,
  width = 400,
  depth = 400,
  height = 3000,
): Column {
  return { id: newFeatureId(), type: "column", levelId, at, width, depth, height };
}

export function makeBeam(
  levelId: string,
  start: Point2,
  end: Point2,
  width = 300,
  depth = 500,
): Beam {
  return { id: newFeatureId(), type: "beam", levelId, start, end, width, depth };
}

export function makeDoor(
  levelId: string,
  hostId: string,
  position = 0.5,
  width = 900,
  height = 2100,
): Door {
  return { id: newFeatureId(), type: "door", levelId, hostId, position, width, height, sill: 0 };
}

export function makeWindow(
  levelId: string,
  hostId: string,
  position = 0.5,
  width = 1200,
  height = 1200,
  sill = 900,
): WindowComponent {
  return {
    id: newFeatureId(),
    type: "window",
    levelId,
    hostId,
    position,
    width,
    height,
    sill,
  };
}

export function makeSpace(levelId: string, seed: Point2): Space {
  return {
    id: newFeatureId(),
    type: "space",
    levelId,
    seed,
    boundaryWallIds: [],
    boundary: [],
    area: 0,
    volume: 0,
  };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type BIMValidation =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Referential integrity: every component's levelId must exist; every hosted
 * opening's hostId must be a wall on the same tab. Geometry validity (e.g.
 * degenerate walls) is checked at generation time, not here.
 */
export function validateBIM(tab: BIMTab): BIMValidation {
  const levelIds = new Set(tab.levels.map((l) => l.id));
  const wallIds = new Set(
    tab.components.filter((c): c is Wall => c.type === "wall").map((c) => c.id),
  );
  for (const c of tab.components) {
    if (!levelIds.has(c.levelId)) {
      return { ok: false, error: `${c.type} ${c.id} references missing level ${c.levelId}` };
    }
    if ((c.type === "door" || c.type === "window") && !wallIds.has(c.hostId)) {
      return { ok: false, error: `${c.type} ${c.id} references missing host wall ${c.hostId}` };
    }
  }
  return { ok: true };
}

/** Type guard helpers used across the BIM code. */
export function isWall(c: BuildingComponent): c is Wall {
  return c.type === "wall";
}
export function isOpening(c: BuildingComponent): c is Door | WindowComponent {
  return c.type === "door" || c.type === "window";
}
