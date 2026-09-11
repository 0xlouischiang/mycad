/**
 * Feature tree data model — the single source of truth for the document.
 *
 * The 3D scene is a *derived view* of this tree (architecture requirement:
 * state management). The tree is fully serializable (plain JSON) so it can be
 * sent to the worker for regeneration and, later, persisted to IndexedDB.
 *
 * Design principles:
 *  - Features are an ORDERED list. Order = evaluation order. Editing an early
 *    feature forces every downstream feature to re-evaluate (that's the whole
 *    point of the regeneration engine).
 *  - Every feature has a STABLE unique id. References between features (Phase 5+)
 *    will be by id, never by array index.
 *  - Each feature carries its own typed parameters plus a boolean `operation`
 *    describing how it combines with the accumulated result:
 *      - "new"    : start a fresh body (ignores prior result) — only meaningful
 *                   as the first non-suppressed feature, but allowed anywhere.
 *      - "add"    : union this feature's solid into the running result.
 *      - "remove" : subtract this feature's solid from the running result.
 *
 * Feature kinds so far: primitives (box, cylinder), sketch nodes (2D geometry,
 * produce no solid), and sketch-based features (extrude). Fillet/chamfer/
 * pattern slot into the same structure in later phases.
 */

import type { Sketch, SketchPlaneId } from "./sketch";
import type { EdgeRef } from "./edgeRef";

/** How a feature's solid combines with the accumulated result before it. */
export type BooleanOperation = "new" | "add" | "remove";

/** Feature type discriminant. Grows over the phases. */
export type FeatureType =
  | "box"
  | "cylinder"
  | "sketch"
  | "extrude"
  | "fillet"
  | "chamfer"
  | "mirror"
  | "linearPattern"
  | "circularPattern"
  | "linked"
  | "revolve";

/** A 3D position offset applied to a primitive before combining. */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface FeatureBase {
  /** Stable unique id. Generated once at creation; never reused. */
  id: string;
  type: FeatureType;
  /** User-visible name, e.g. "Box 1". Editable, not an identifier. */
  name: string;
  /** Suppressed features are skipped during regeneration but kept in the tree. */
  suppressed: boolean;
}

/**
 * A feature that produces a solid and combines it into the running body.
 * Sketch features are NOT solid features (they only carry 2D geometry).
 */
interface SolidFeatureBase extends FeatureBase {
  operation: BooleanOperation;
  /** Placement offset of the primitive's origin, in model units. */
  position: Vec3;
}

export interface BoxFeature extends SolidFeatureBase {
  type: "box";
  params: {
    dx: number;
    dy: number;
    dz: number;
  };
}

export interface CylinderFeature extends SolidFeatureBase {
  type: "cylinder";
  params: {
    radius: number;
    height: number;
  };
}

/**
 * A sketch node. Owns the full 2D sketch (plane, points, entities,
 * constraints). Produces NO solid on its own — it is referenced by downstream
 * sketch-based features (extrude, and later revolve). Kept in the tree so it
 * can be re-opened and edited, forcing dependents to regenerate.
 */
export interface SketchFeature extends FeatureBase {
  type: "sketch";
  planeId: SketchPlaneId;
  sketch: Sketch;
}

/**
 * Extrude a sketch's closed profile along the sketch-plane normal.
 *  - distance: extrusion length (model units).
 *  - flip: reverse the extrusion direction (extrude to the other side).
 *  - operation: "new"/"add" build/fuse material; "remove" cuts (pocket/hole).
 * The profile is auto-detected (largest closed loop) at regeneration time.
 */
export interface ExtrudeFeature extends FeatureBase {
  type: "extrude";
  /** Stable id of the SketchFeature this extrude consumes. */
  sketchId: string;
  operation: BooleanOperation;
  params: {
    distance: number;
    flip: boolean;
  };
}

/**
 * Revolve a sketch's closed profile around an axis to make a solid of
 * revolution. The axis is one of the sketch plane's local axes (u or v) through
 * the plane origin — enough for the common lathe-style parts without a separate
 * axis-picking UI (MVP simplification, per the brief's "corners cut" note).
 *  - angle: sweep in degrees (360 = full revolution).
 *  - operation: new/add build material; remove cuts.
 */
export interface RevolveFeature extends FeatureBase {
  type: "revolve";
  sketchId: string;
  operation: BooleanOperation;
  params: {
    /** Which in-plane axis to revolve about: the sketch u or v axis. */
    axis: "u" | "v";
    angle: number; // degrees
  };
}

/**
 * Linked reference to another local document's Part Studio output (Phase 11,
 * stretch goal). This is Onshape's "split into separate documents, then
 * reference them back" pattern in miniature.
 *
 * It holds a CACHED snapshot of the source Part Studio's feature tree
 * (`cachedTree`), evaluated at regen time and fused into the current body. This
 * is deliberately a read-only insert with NO live sync (per the spec): the user
 * refreshes it explicitly via an "update reference" action, which re-reads the
 * source document from IndexedDB and replaces `cachedTree`.
 *
 * Referencing by cached snapshot (not by live lookup during regen) keeps the
 * worker regeneration pure and synchronous — it never has to reach back into
 * IndexedDB mid-rebuild.
 */
export interface LinkedFeature extends FeatureBase {
  type: "linked";
  /** Source document + Part Studio tab this reference was inserted from. */
  sourceDocId: string;
  sourceTabId: string;
  /** Human-readable "Doc / Tab" label, for display without a lookup. */
  sourceLabel: string;
  /** Cached copy of the source tab's feature tree at last update. */
  cachedTree: FeatureTree;
  operation: BooleanOperation;
}

/**
 * Fillet: round a set of edges of the accumulated body. Edges are referenced by
 * their OCCT edge hash (the stable-ID scheme, architecture req #3): on regen we
 * resolve each hash back to a live edge handle via
 * hashCode(edge, 2147483647). Hashes that no longer resolve are skipped; if
 * none resolve the feature errors and the prior body is kept (user-confirmed).
 *
 * A fillet does NOT combine via a boolean — it modifies the running body in
 * place, so it has no `operation` field.
 */
export interface FilletFeature extends FeatureBase {
  type: "fillet";
  /** Stable geometric references to the edges to round (see edgeRef.ts). */
  edgeRefs: EdgeRef[];
  params: {
    radius: number;
  };
}

/** Chamfer: bevel a set of edges. Same edge referencing as fillet. */
export interface ChamferFeature extends FeatureBase {
  type: "chamfer";
  edgeRefs: EdgeRef[];
  params: {
    distance: number;
  };
}

/**
 * Mirror the accumulated body across a base plane and fuse the reflection back.
 *
 * MVP simplification (noted per the brief's "corners cut" requirement): mirror
 * operates on the WHOLE running body, not a user-selected sub-feature or a
 * picked planar face. Mirror plane is one of the three base planes. Good enough
 * for symmetric parts; per-feature mirroring is a later refinement.
 */
export interface MirrorFeature extends FeatureBase {
  type: "mirror";
  params: {
    plane: SketchPlaneId; // reflection plane (through origin)
    /** If false, keep only the mirrored copy; if true (default), keep both. */
    keepOriginal: boolean;
  };
}

/**
 * Linear pattern: replicate the running body `count` times along a world axis
 * at `spacing` intervals, fusing the copies. count includes the original.
 * MVP: patterns the whole body (see MirrorFeature note).
 */
export interface LinearPatternFeature extends FeatureBase {
  type: "linearPattern";
  params: {
    axis: "x" | "y" | "z";
    count: number;
    spacing: number;
  };
}

/**
 * Circular pattern: replicate the running body `count` times around a world
 * axis through the origin, spanning `angle` degrees total, fusing the copies.
 * count includes the original. MVP: patterns the whole body.
 */
export interface CircularPatternFeature extends FeatureBase {
  type: "circularPattern";
  params: {
    axis: "x" | "y" | "z";
    count: number;
    angle: number; // total sweep in degrees
  };
}

export type Feature =
  | BoxFeature
  | CylinderFeature
  | SketchFeature
  | ExtrudeFeature
  | FilletFeature
  | ChamferFeature
  | MirrorFeature
  | LinearPatternFeature
  | CircularPatternFeature
  | LinkedFeature
  | RevolveFeature;

/** Features that create a solid and combine via boolean (new/add/remove). */
export type SolidFeature =
  | BoxFeature
  | CylinderFeature
  | ExtrudeFeature
  | LinkedFeature
  | RevolveFeature;

/** Edge-referencing modifiers of the accumulated body (fillet/chamfer). */
export type ModifierFeature = FilletFeature | ChamferFeature;

/** Whole-body transforms (mirror + patterns) that replicate/reflect the body. */
export type TransformFeature =
  | MirrorFeature
  | LinearPatternFeature
  | CircularPatternFeature;

/** True if a feature creates+combines a solid (has an `operation`). */
export function isSolidFeature(f: Feature): f is SolidFeature {
  return (
    f.type === "box" ||
    f.type === "cylinder" ||
    f.type === "extrude" ||
    f.type === "linked" ||
    f.type === "revolve"
  );
}

/** True if a feature modifies the running body via edge selection. */
export function isModifierFeature(f: Feature): f is ModifierFeature {
  return f.type === "fillet" || f.type === "chamfer";
}

/** True if a feature replicates/reflects the whole running body. */
export function isTransformFeature(f: Feature): f is TransformFeature {
  return (
    f.type === "mirror" ||
    f.type === "linearPattern" ||
    f.type === "circularPattern"
  );
}

/** The whole document's feature tree. */
export interface FeatureTree {
  features: Feature[];
}

/**
 * Monotonic id generator. Not cryptographic — just unique within a session and
 * stable once assigned. `Date.now()` is intentionally avoided (it isn't
 * available in some execution contexts and hurts determinism); a module-level
 * counter plus a random suffix is enough for a single-user local app.
 */
let idCounter = 0;
export function newFeatureId(): string {
  idCounter += 1;
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  return `f${idCounter}_${rand}`;
}

/** Default parameters for a freshly-created primitive feature. */
export function makeDefaultFeature(
  type: "box" | "cylinder",
  index: number,
  operation: BooleanOperation,
): BoxFeature | CylinderFeature {
  const base = {
    id: newFeatureId(),
    suppressed: false,
    operation,
    position: { x: 0, y: 0, z: 0 },
  };
  switch (type) {
    case "box":
      return {
        ...base,
        type: "box",
        name: `Box ${index}`,
        params: { dx: 40, dy: 30, dz: 20 },
      };
    case "cylinder":
      return {
        ...base,
        type: "cylinder",
        name: `Cylinder ${index}`,
        params: { radius: 15, height: 40 },
      };
    default: {
      const _never: never = type;
      throw new Error(`Unknown feature type: ${String(_never)}`);
    }
  }
}

/** Wrap a finished sketch as a SketchFeature node. */
export function makeSketchFeature(sketch: Sketch, index: number): SketchFeature {
  return {
    id: newFeatureId(),
    type: "sketch",
    name: `Sketch ${index}`,
    suppressed: false,
    planeId: sketch.planeId,
    sketch,
  };
}

/** Create an extrude feature that consumes the given sketch. */
export function makeExtrudeFeature(
  sketchId: string,
  index: number,
  operation: BooleanOperation,
): ExtrudeFeature {
  return {
    id: newFeatureId(),
    type: "extrude",
    name: `Extrude ${index}`,
    suppressed: false,
    sketchId,
    operation,
    params: { distance: 20, flip: false },
  };
}

/** Create a revolve feature consuming the given sketch. */
export function makeRevolveFeature(
  sketchId: string,
  index: number,
  operation: BooleanOperation,
): RevolveFeature {
  return {
    id: newFeatureId(),
    type: "revolve",
    name: `Revolve ${index}`,
    suppressed: false,
    sketchId,
    operation,
    params: { axis: "u", angle: 360 },
  };
}

/** Create a fillet feature rounding the given edges (by geometric ref). */
export function makeFilletFeature(
  edgeRefs: EdgeRef[],
  index: number,
): FilletFeature {
  return {
    id: newFeatureId(),
    type: "fillet",
    name: `Fillet ${index}`,
    suppressed: false,
    edgeRefs: [...edgeRefs],
    params: { radius: 3 },
  };
}

/** Create a chamfer feature beveling the given edges (by geometric ref). */
export function makeChamferFeature(
  edgeRefs: EdgeRef[],
  index: number,
): ChamferFeature {
  return {
    id: newFeatureId(),
    type: "chamfer",
    name: `Chamfer ${index}`,
    suppressed: false,
    edgeRefs: [...edgeRefs],
    params: { distance: 3 },
  };
}

/** Create a mirror feature reflecting the running body across a base plane. */
export function makeMirrorFeature(index: number): MirrorFeature {
  return {
    id: newFeatureId(),
    type: "mirror",
    name: `Mirror ${index}`,
    suppressed: false,
    params: { plane: "YZ", keepOriginal: true },
  };
}

/** Create a linear pattern feature. */
export function makeLinearPatternFeature(
  index: number,
): LinearPatternFeature {
  return {
    id: newFeatureId(),
    type: "linearPattern",
    name: `Linear Pattern ${index}`,
    suppressed: false,
    params: { axis: "x", count: 3, spacing: 50 },
  };
}

/** Create a circular pattern feature. */
export function makeCircularPatternFeature(
  index: number,
): CircularPatternFeature {
  return {
    id: newFeatureId(),
    type: "circularPattern",
    name: `Circular Pattern ${index}`,
    suppressed: false,
    params: { axis: "z", count: 4, angle: 360 },
  };
}

/** Create a linked reference to another document's Part Studio output. */
export function makeLinkedFeature(
  sourceDocId: string,
  sourceTabId: string,
  sourceLabel: string,
  cachedTree: FeatureTree,
  index: number,
  operation: BooleanOperation,
): LinkedFeature {
  return {
    id: newFeatureId(),
    type: "linked",
    name: `Reference ${index}`,
    suppressed: false,
    sourceDocId,
    sourceTabId,
    sourceLabel,
    cachedTree,
    operation,
  };
}
