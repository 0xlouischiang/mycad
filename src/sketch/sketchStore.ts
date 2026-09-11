/**
 * Sketch-mode store (Zustand).
 *
 * Holds the transient state of an in-progress sketch: the active sketch, the
 * current tool, in-progress drawing state, selection, and drag state. Every
 * geometry edit re-runs the solver so constrained geometry stays satisfied
 * live (the Phase 3 "solve on every drag/edit" requirement).
 *
 * In Phase 3 the sketch is standalone (entering/exiting sketch mode is a UI
 * concern only). In Phase 4 a finished sketch becomes a feature-tree node.
 */
import { create } from "zustand";
import {
  BASE_PLANES,
  makeSketch,
  newSketchId,
  type Constraint,
  type ConstraintType,
  type Sketch,
  type SketchPlaneId,
} from "../model/sketch";
import { solveSketch } from "./solver";

/** Drawing tools. "select" is the default idle/edit tool. */
export type SketchTool = "select" | "line" | "circle" | "arc";

interface SketchStore {
  /** Null when not in sketch mode. */
  sketch: Sketch | null;
  /**
   * When editing an existing SketchFeature, its feature id. Null when drawing a
   * brand-new sketch (finishing then creates a new feature).
   */
  editingFeatureId: string | null;
  tool: SketchTool;
  /** Selected point ids and entity ids (for applying constraints). */
  selectedPoints: string[];
  selectedEntities: string[];
  /**
   * In-progress multi-click drawing. Holds ids of points already placed for
   * the current entity (e.g. line needs 1 anchor then 1 more; arc needs 3).
   */
  pending: { tool: SketchTool; pointIds: string[] } | null;
  /** Last solver result, for status display. */
  lastSolve: { converged: boolean; residual: number } | null;

  enterSketch: (planeId: SketchPlaneId) => void;
  /** Re-open an existing sketch feature for editing. */
  editExisting: (featureId: string, sketch: Sketch) => void;
  /**
   * Leave sketch mode WITHOUT committing (cancel). Prefer `finish` to persist.
   */
  exitSketch: () => void;
  /**
   * Return the current sketch + editing target and clear sketch mode. The
   * caller (App) commits the result into the feature tree. Returns null if
   * there was no active sketch.
   */
  finish: () => { sketch: Sketch; editingFeatureId: string | null } | null;
  setTool: (tool: SketchTool) => void;

  /**
   * Handle a click at plane coordinates (u,v). Behavior depends on the active
   * tool: places points/entities, or selects under the select tool.
   */
  clickAt: (u: number, v: number, hitPointId: string | null) => void;

  /** Drag a point to (u,v) with live re-solve (point is pinned during drag). */
  dragPoint: (pointId: string, u: number, v: number) => void;

  selectPoint: (pointId: string, additive: boolean) => void;
  selectEntity: (entityId: string, additive: boolean) => void;
  clearSelection: () => void;

  /** Add a constraint from the current selection; returns error msg or null. */
  addConstraint: (type: ConstraintType, value?: number) => string | null;

  deleteSelected: () => void;
  resolve: () => void;
}

/** Snap-together tolerance: clicks within this of an existing point reuse it. */
const SNAP = 2.0;

export const useSketchStore = create<SketchStore>((set, get) => {
  /** Mutate the sketch immutably-at-the-top, re-solve, and store the result. */
  const commit = (mutate: (s: Sketch) => void, pinned?: string[]) => {
    const current = get().sketch;
    if (!current) return;
    // Deep-ish clone so React sees a new reference; points/entities/constraints
    // are plain data.
    const next: Sketch = {
      ...current,
      points: current.points.map((p) => ({ ...p })),
      entities: current.entities.map((e) => ({ ...e })),
      constraints: current.constraints.map((c) => ({ ...c })),
    };
    mutate(next);
    const result = solveSketch(next, pinned ? { pinned } : undefined);
    set({
      sketch: next,
      lastSolve: { converged: result.converged, residual: result.residual },
    });
  };

  const addPoint = (s: Sketch, u: number, v: number, fixed = false): string => {
    const id = newSketchId("pt");
    s.points.push({ id, u, v, fixed });
    return id;
  };

  /** Find an existing point near (u,v), or create one. */
  const pointAt = (s: Sketch, u: number, v: number, hit: string | null): string => {
    if (hit) return hit;
    const near = s.points.find((p) => Math.hypot(p.u - u, p.v - v) < SNAP);
    return near ? near.id : addPoint(s, u, v);
  };

  return {
    sketch: null,
    editingFeatureId: null,
    tool: "select",
    selectedPoints: [],
    selectedEntities: [],
    pending: null,
    lastSolve: null,

    enterSketch: (planeId) => {
      set({
        sketch: makeSketch(newSketchId("sk"), planeId),
        editingFeatureId: null,
        tool: "select",
        selectedPoints: [],
        selectedEntities: [],
        pending: null,
        lastSolve: null,
      });
    },

    editExisting: (featureId, sketch) => {
      // Deep-clone so edits don't mutate the tree's copy until finish.
      const clone: Sketch = {
        ...sketch,
        points: sketch.points.map((p) => ({ ...p })),
        entities: sketch.entities.map((e) => ({ ...e })),
        constraints: sketch.constraints.map((c) => ({ ...c })),
      };
      set({
        sketch: clone,
        editingFeatureId: featureId,
        tool: "select",
        selectedPoints: [],
        selectedEntities: [],
        pending: null,
        lastSolve: null,
      });
    },

    finish: () => {
      const { sketch, editingFeatureId } = get();
      if (!sketch) return null;
      set({
        sketch: null,
        editingFeatureId: null,
        tool: "select",
        selectedPoints: [],
        selectedEntities: [],
        pending: null,
      });
      return { sketch, editingFeatureId };
    },

    exitSketch: () => {
      set({
        sketch: null,
        editingFeatureId: null,
        tool: "select",
        selectedPoints: [],
        selectedEntities: [],
        pending: null,
      });
    },

    setTool: (tool) => set({ tool, pending: null }),

    clickAt: (u, v, hitPointId) => {
      const { tool, pending } = get();

      if (tool === "select") {
        // Selection is handled by selectPoint/selectEntity via the canvas;
        // a click on empty space clears.
        if (!hitPointId) get().clearSelection();
        return;
      }

      if (tool === "line") {
        commit((s) => {
          if (!pending || pending.tool !== "line") {
            const p1 = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "line", pointIds: [p1] } });
          } else {
            const p1 = pending.pointIds[0];
            const p2 = pointAt(s, u, v, hitPointId);
            s.entities.push({ id: newSketchId("ln"), type: "line", p1, p2 });
            // Chain: the endpoint becomes the start of the next segment.
            set({ pending: { tool: "line", pointIds: [p2] } });
          }
        });
        return;
      }

      if (tool === "circle") {
        commit((s) => {
          if (!pending || pending.tool !== "circle") {
            const center = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "circle", pointIds: [center] } });
          } else {
            const center = s.points.find((p) => p.id === pending.pointIds[0])!;
            const radius = Math.hypot(u - center.u, v - center.v) || 1;
            s.entities.push({
              id: newSketchId("ci"),
              type: "circle",
              center: center.id,
              radius,
            });
            set({ pending: null });
          }
        });
        return;
      }

      if (tool === "arc") {
        // 3-click arc: center, start, end.
        commit((s) => {
          if (!pending || pending.tool !== "arc") {
            const center = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "arc", pointIds: [center] } });
          } else if (pending.pointIds.length === 1) {
            const start = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "arc", pointIds: [pending.pointIds[0], start] } });
          } else {
            const [center, start] = pending.pointIds;
            const end = pointAt(s, u, v, hitPointId);
            s.entities.push({
              id: newSketchId("ar"),
              type: "arc",
              center,
              start,
              end,
            });
            set({ pending: null });
          }
        });
        return;
      }
    },

    dragPoint: (pointId, u, v) => {
      commit((s) => {
        const p = s.points.find((pt) => pt.id === pointId);
        if (p && !p.fixed) {
          p.u = u;
          p.v = v;
        }
      }, [pointId]);
    },

    selectPoint: (pointId, additive) => {
      set((state) => {
        const has = state.selectedPoints.includes(pointId);
        const selectedPoints = additive
          ? has
            ? state.selectedPoints.filter((id) => id !== pointId)
            : [...state.selectedPoints, pointId]
          : [pointId];
        return {
          selectedPoints,
          selectedEntities: additive ? state.selectedEntities : [],
        };
      });
    },

    selectEntity: (entityId, additive) => {
      set((state) => {
        const has = state.selectedEntities.includes(entityId);
        const selectedEntities = additive
          ? has
            ? state.selectedEntities.filter((id) => id !== entityId)
            : [...state.selectedEntities, entityId]
          : [entityId];
        return {
          selectedEntities,
          selectedPoints: additive ? state.selectedPoints : [],
        };
      });
    },

    clearSelection: () => set({ selectedPoints: [], selectedEntities: [] }),

    addConstraint: (type, value) => {
      const { sketch, selectedPoints, selectedEntities } = get();
      if (!sketch) return "No active sketch";

      const id = newSketchId("cn");
      let constraint: Constraint | null = null;
      let error: string | null = null;

      switch (type) {
        case "coincident":
          if (selectedPoints.length !== 2) error = "Select exactly 2 points";
          else constraint = { id, type, p1: selectedPoints[0], p2: selectedPoints[1] };
          break;
        case "horizontal":
        case "vertical":
          if (selectedEntities.length !== 1) error = "Select exactly 1 line";
          else constraint = { id, type, entity: selectedEntities[0] };
          break;
        case "parallel":
        case "perpendicular":
        case "equalLength":
          if (selectedEntities.length !== 2) error = "Select exactly 2 lines";
          else constraint = { id, type, a: selectedEntities[0], b: selectedEntities[1] };
          break;
        case "distance":
          if (selectedPoints.length !== 2) error = "Select exactly 2 points";
          else if (value === undefined) error = "Distance value required";
          else constraint = { id, type, p1: selectedPoints[0], p2: selectedPoints[1], value };
          break;
        case "angle":
          if (selectedEntities.length !== 2) error = "Select exactly 2 lines";
          else if (value === undefined) error = "Angle value required";
          else constraint = { id, type, a: selectedEntities[0], b: selectedEntities[1], value };
          break;
        case "radius":
          if (selectedEntities.length !== 1) error = "Select exactly 1 circle/arc";
          else if (value === undefined) error = "Radius value required";
          else constraint = { id, type, entity: selectedEntities[0], value };
          break;
        default: {
          const _never: never = type;
          error = `Unknown constraint ${String(_never)}`;
        }
      }

      if (error || !constraint) return error ?? "Could not create constraint";
      const c = constraint;
      commit((s) => {
        s.constraints.push(c);
      });
      return null;
    },

    deleteSelected: () => {
      const { selectedPoints, selectedEntities } = get();
      commit((s) => {
        // Remove selected entities.
        s.entities = s.entities.filter((e) => !selectedEntities.includes(e.id));
        // Remove selected points and any entities/constraints referencing them.
        const deadPoints = new Set(selectedPoints);
        s.entities = s.entities.filter((e) => {
          if (e.type === "line") return !deadPoints.has(e.p1) && !deadPoints.has(e.p2);
          if (e.type === "circle") return !deadPoints.has(e.center);
          return !deadPoints.has(e.center) && !deadPoints.has(e.start) && !deadPoints.has(e.end);
        });
        s.points = s.points.filter((p) => !deadPoints.has(p.id));
        // Drop constraints referencing anything now gone.
        const liveEntities = new Set(s.entities.map((e) => e.id));
        const livePoints = new Set(s.points.map((p) => p.id));
        s.constraints = s.constraints.filter((c) => constraintRefsAlive(c, liveEntities, livePoints));
      });
      set({ selectedPoints: [], selectedEntities: [] });
    },

    resolve: () => commit(() => {}),
  };
});

/** True if every id a constraint references still exists. */
function constraintRefsAlive(
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
      return entities.has(c.a) && entities.has(c.b);
    case "radius":
      return entities.has(c.entity);
    default:
      return false;
  }
}

/** Convenience re-export so UI can read plane definitions. */
export { BASE_PLANES };
