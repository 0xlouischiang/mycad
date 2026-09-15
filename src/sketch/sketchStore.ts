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
  type SketchPlane,
  type SketchPlaneId,
} from "../model/sketch";
import { solveSketch } from "./solver";

/** Drawing tools. "select" is the default idle/edit tool. */
export type SketchTool =
  | "select"
  | "line"
  | "circle"
  | "arc"
  | "rectangle"
  | "polygon"
  | "slot"
  | "ellipse"
  | "spline";

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
  /** Number of sides for the polygon tool (>= 3). */
  polygonSides: number;
  /** Set the polygon tool's side count. */
  setPolygonSides: (n: number) => void;

  enterSketch: (planeId: SketchPlaneId, planeOffset?: number) => void;
  /** Enter sketch mode on a face-derived custom plane. */
  enterSketchOnFace: (plane: SketchPlane) => void;
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

  /**
   * Fillet the corner between the two selected lines with the given radius:
   * trims both lines back to the tangent points and inserts a tangent arc.
   * Returns an error message or null on success.
   */
  addSketchFillet: (radius: number) => string | null;

  /** Finish the in-progress spline (commits it and starts a fresh draft). */
  finishSpline: () => void;

  /** Edit a dimensional constraint's value (distance/angle/radius) + re-solve. */
  updateConstraintValue: (constraintId: string, value: number) => void;

  /**
   * Mirror the currently-selected entities across the given mirror line,
   * creating reflected copies. Returns an error message or null on success.
   */
  addSketchMirror: (mirrorLineId: string) => string | null;

  deleteSelected: () => void;
  resolve: () => void;
}

/** Snap-together tolerance: clicks within this of an existing point reuse it. */
const SNAP = 2.0;

export const useSketchStore = create<SketchStore>((set, get) => {
  // Id of the spline entity currently being drawn (grows as points are added).
  // A fresh id is minted whenever a spline is finished.
  let splineDraftId = newSketchId("sp");

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
    polygonSides: 6,
    setPolygonSides: (n) => set({ polygonSides: Math.max(3, Math.round(n)) }),

    enterSketch: (planeId, planeOffset = 0) => {
      set({
        sketch: makeSketch(newSketchId("sk"), planeId, planeOffset),
        editingFeatureId: null,
        tool: "select",
        selectedPoints: [],
        selectedEntities: [],
        pending: null,
        lastSolve: null,
      });
    },

    enterSketchOnFace: (plane) => {
      // planeId is a placeholder; customPlane drives the actual mapping.
      const sketch = makeSketch(newSketchId("sk"), "XY", 0);
      sketch.customPlane = plane;
      set({
        sketch,
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

    setTool: (tool) => {
      // Switching away from the spline tool commits the in-progress spline.
      if (get().tool === "spline" && tool !== "spline") get().finishSpline();
      set({ tool, pending: null });
    },

    finishSpline: () => {
      // A spline needs >= 2 points; if the draft has fewer, drop it.
      const sketch = get().sketch;
      if (sketch) {
        const draft = sketch.entities.find(
          (e) => e.type === "spline" && e.id === splineDraftId,
        );
        if (draft && draft.type === "spline" && draft.points.length < 2) {
          commit((s) => {
            s.entities = s.entities.filter((e) => e.id !== splineDraftId);
          });
        }
      }
      // Mint a fresh draft id so the next spline is a separate entity.
      splineDraftId = newSketchId("sp");
      set({ pending: null });
    },

    updateConstraintValue: (constraintId, value) => {
      if (!Number.isFinite(value)) return;
      commit((s) => {
        const c = s.constraints.find((x) => x.id === constraintId);
        if (
          c &&
          (c.type === "distance" || c.type === "angle" || c.type === "radius")
        ) {
          c.value = value;
        }
      });
    },

    addSketchMirror: (mirrorLineId) => {
      const { sketch, selectedEntities } = get();
      if (!sketch) return "No active sketch";
      const line = sketch.entities.find((e) => e.id === mirrorLineId);
      if (!line || line.type !== "line") return "Mirror line must be a line";
      const toMirror = selectedEntities.filter((id) => id !== mirrorLineId);
      if (toMirror.length === 0) return "Select entities to mirror + a line";

      const a = sketch.points.find((p) => p.id === line.p1)!;
      const b = sketch.points.find((p) => p.id === line.p2)!;
      // Reflect point (u,v) across the infinite line through a,b.
      const dx = b.u - a.u, dy = b.v - a.v;
      const len2 = dx * dx + dy * dy || 1;
      const reflect = (u: number, v: number): [number, number] => {
        const t = ((u - a.u) * dx + (v - a.v) * dy) / len2;
        const px = a.u + t * dx, py = a.v + t * dy; // foot of perpendicular
        return [2 * px - u, 2 * py - v];
      };

      commit((s) => {
        // Map old point id → new reflected point id (created lazily).
        const ptMap = new Map<string, string>();
        const mirrorPoint = (id: string): string => {
          const existing = ptMap.get(id);
          if (existing) return existing;
          const p = s.points.find((x) => x.id === id)!;
          const [ru, rv] = reflect(p.u, p.v);
          const nid = addPoint(s, ru, rv);
          ptMap.set(id, nid);
          return nid;
        };
        for (const eid of toMirror) {
          const e = s.entities.find((x) => x.id === eid);
          if (!e) continue;
          if (e.type === "line") {
            s.entities.push({
              id: newSketchId("ln"),
              type: "line",
              p1: mirrorPoint(e.p1),
              p2: mirrorPoint(e.p2),
            });
          } else if (e.type === "circle") {
            s.entities.push({
              id: newSketchId("ci"),
              type: "circle",
              center: mirrorPoint(e.center),
              radius: e.radius,
            });
          } else if (e.type === "arc") {
            // Reflection flips arc orientation.
            s.entities.push({
              id: newSketchId("ar"),
              type: "arc",
              center: mirrorPoint(e.center),
              start: mirrorPoint(e.start),
              end: mirrorPoint(e.end),
              sweep: (e.sweep ?? "ccw") === "ccw" ? "cw" : "ccw",
            });
          } else if (e.type === "ellipse") {
            s.entities.push({
              id: newSketchId("el"),
              type: "ellipse",
              center: mirrorPoint(e.center),
              majorRadius: e.majorRadius,
              minorRadius: e.minorRadius,
              // Reflect the major-axis angle about the mirror line's angle.
              rotation:
                2 * Math.atan2(dy, dx) - e.rotation,
            });
          } else if (e.type === "spline") {
            s.entities.push({
              id: newSketchId("sp"),
              type: "spline",
              points: e.points.map(mirrorPoint),
            });
          }
        }
      });
      set({ selectedEntities: [] });
      return null;
    },

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

      if (tool === "rectangle") {
        // 2-click corner rectangle. First click = first corner; second click =
        // opposite corner. Emits 4 corner points + 4 lines + auto H/V
        // constraints so it behaves like Onshape's corner rectangle.
        commit((s) => {
          if (!pending || pending.tool !== "rectangle") {
            const c1 = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "rectangle", pointIds: [c1] } });
          } else {
            const p1 = s.points.find((p) => p.id === pending.pointIds[0])!;
            // Four corners: p1, (u,p1.v), (u,v), (p1.u,v) — CCW rectangle.
            const p2 = addPoint(s, u, p1.v);
            const p3 = addPoint(s, u, v);
            const p4 = addPoint(s, p1.u, v);
            const bottom = newSketchId("ln");
            const right = newSketchId("ln");
            const top = newSketchId("ln");
            const left = newSketchId("ln");
            s.entities.push(
              { id: bottom, type: "line", p1: p1.id, p2 },
              { id: right, type: "line", p1: p2, p2: p3 },
              { id: top, type: "line", p1: p3, p2: p4 },
              { id: left, type: "line", p1: p4, p2: p1.id },
            );
            // Auto constraints: bottom/top horizontal, left/right vertical.
            s.constraints.push(
              { id: newSketchId("cn"), type: "horizontal", entity: bottom },
              { id: newSketchId("cn"), type: "horizontal", entity: top },
              { id: newSketchId("cn"), type: "vertical", entity: right },
              { id: newSketchId("cn"), type: "vertical", entity: left },
            );
            set({ pending: null });
          }
        });
        return;
      }

      if (tool === "polygon") {
        // 2-click regular polygon: center, then a vertex (sets radius +
        // orientation). Emits N points + N closed line entities inscribed in
        // the circle through the clicked vertex.
        commit((s) => {
          if (!pending || pending.tool !== "polygon") {
            const center = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "polygon", pointIds: [center] } });
          } else {
            const center = s.points.find((p) => p.id === pending.pointIds[0])!;
            const n = Math.max(3, Math.round(get().polygonSides));
            const r = Math.hypot(u - center.u, v - center.v) || 1;
            const a0 = Math.atan2(v - center.v, u - center.u);
            const ids: string[] = [];
            for (let i = 0; i < n; i++) {
              const a = a0 + (2 * Math.PI * i) / n;
              ids.push(
                addPoint(s, center.u + r * Math.cos(a), center.v + r * Math.sin(a)),
              );
            }
            for (let i = 0; i < n; i++) {
              s.entities.push({
                id: newSketchId("ln"),
                type: "line",
                p1: ids[i],
                p2: ids[(i + 1) % n],
              });
            }
            set({ pending: null });
          }
        });
        return;
      }

      if (tool === "slot") {
        // 3-click straight slot (stadium): click centerline end A, end B, then a
        // 3rd click whose perpendicular distance from the A–B line sets the
        // half-width r. Emits 2 offset side lines + 2 semicircular end arcs, all
        // sharing 4 corner points, forming a closed profile.
        commit((s) => {
          if (!pending || pending.tool !== "slot") {
            const a = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "slot", pointIds: [a] } });
          } else if (pending.pointIds.length === 1) {
            const b = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "slot", pointIds: [pending.pointIds[0], b] } });
          } else {
            const A = s.points.find((p) => p.id === pending.pointIds[0])!;
            const B = s.points.find((p) => p.id === pending.pointIds[1])!;
            const dx = B.u - A.u;
            const dy = B.v - A.v;
            const len = Math.hypot(dx, dy) || 1;
            // Unit direction and left-normal.
            const ux = dx / len;
            const uy = dy / len;
            const nx = -uy;
            const ny = ux;
            // Half-width = perpendicular distance from the 3rd click to A–B.
            const r = Math.abs((u - A.u) * nx + (v - A.v) * ny) || len / 4;
            // Four corner points: A±n*r, B±n*r.
            const aL = addPoint(s, A.u + nx * r, A.v + ny * r);
            const aR = addPoint(s, A.u - nx * r, A.v - ny * r);
            const bL = addPoint(s, B.u + nx * r, B.v + ny * r);
            const bR = addPoint(s, B.u - nx * r, B.v - ny * r);
            // Two side lines (aL→bL and bR→aR) + two end arcs (around B, around A).
            // End-cap arcs sweep CW so they bulge OUTWARD (away from the
            // centerline), forming the stadium rather than caving inward.
            s.entities.push(
              { id: newSketchId("ln"), type: "line", p1: aL, p2: bL },
              { id: newSketchId("ar"), type: "arc", center: B.id, start: bL, end: bR, sweep: "cw" },
              { id: newSketchId("ln"), type: "line", p1: bR, p2: aR },
              { id: newSketchId("ar"), type: "arc", center: A.id, start: aR, end: aL, sweep: "cw" },
            );
            set({ pending: null });
          }
        });
        return;
      }

      if (tool === "ellipse") {
        // 3-click ellipse: center, major-axis endpoint (sets majorRadius +
        // rotation), then a 3rd click whose perpendicular distance to the major
        // axis sets minorRadius. Only the center is a solver point.
        commit((s) => {
          if (!pending || pending.tool !== "ellipse") {
            const center = pointAt(s, u, v, hitPointId);
            set({ pending: { tool: "ellipse", pointIds: [center] } });
          } else if (pending.pointIds.length === 1) {
            // Store a transient major-axis endpoint as a second pending point.
            const major = addPoint(s, u, v);
            set({ pending: { tool: "ellipse", pointIds: [pending.pointIds[0], major] } });
          } else {
            const center = s.points.find((p) => p.id === pending.pointIds[0])!;
            const majorPt = s.points.find((p) => p.id === pending.pointIds[1])!;
            const mdu = majorPt.u - center.u;
            const mdv = majorPt.v - center.v;
            const majorRadius = Math.hypot(mdu, mdv) || 1;
            const rotation = Math.atan2(mdv, mdu);
            // Minor = perpendicular distance from 3rd click to the major axis.
            const nx = -mdv / majorRadius;
            const ny = mdu / majorRadius;
            const minorRadius =
              Math.abs((u - center.u) * nx + (v - center.v) * ny) ||
              majorRadius / 2;
            // The major endpoint was only a UI helper; remove it.
            s.points = s.points.filter((p) => p.id !== majorPt.id);
            s.entities.push({
              id: newSketchId("el"),
              type: "ellipse",
              center: center.id,
              majorRadius,
              minorRadius,
              rotation,
            });
            set({ pending: null });
          }
        });
        return;
      }

      if (tool === "spline") {
        // Multi-click: each click adds a point; the spline entity is created
        // once there are >= 2 points and grows as more are added. Finish via
        // finishSpline (double-click / Enter / tool switch).
        commit((s) => {
          const prev = pending?.tool === "spline" ? pending.pointIds : [];
          const pid = pointAt(s, u, v, hitPointId);
          const ids = [...prev, pid];
          // Maintain a single spline entity for the in-progress point list.
          const existing = s.entities.find(
            (e) => e.type === "spline" && e.id === splineDraftId,
          );
          if (ids.length >= 2) {
            if (existing && existing.type === "spline") {
              existing.points = ids;
            } else {
              s.entities.push({ id: splineDraftId, type: "spline", points: ids });
            }
          }
          set({ pending: { tool: "spline", pointIds: ids } });
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
        case "concentric":
          if (selectedEntities.length !== 2)
            error = "Select exactly 2 circles/arcs";
          else constraint = { id, type, a: selectedEntities[0], b: selectedEntities[1] };
          break;
        case "midpoint":
          // 1 point + 1 line, in either selection order.
          if (selectedPoints.length !== 1 || selectedEntities.length !== 1)
            error = "Select 1 point and 1 line";
          else
            constraint = {
              id,
              type,
              point: selectedPoints[0],
              line: selectedEntities[0],
            };
          break;
        case "symmetric":
          // 2 points + 1 mirror line.
          if (selectedPoints.length !== 2 || selectedEntities.length !== 1)
            error = "Select 2 points and 1 mirror line";
          else
            constraint = {
              id,
              type,
              p1: selectedPoints[0],
              p2: selectedPoints[1],
              line: selectedEntities[0],
            };
          break;
        case "tangent":
          // 1 line + 1 circle/arc. We can't tell which entity is which from
          // ids alone here, so assume [line, curve] selection order.
          if (selectedEntities.length !== 2)
            error = "Select 1 line and 1 circle/arc";
          else
            constraint = {
              id,
              type,
              line: selectedEntities[0],
              curve: selectedEntities[1],
            };
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

    addSketchFillet: (radius) => {
      const { sketch, selectedEntities } = get();
      if (!sketch) return "No active sketch";
      if (selectedEntities.length !== 2) return "Select exactly 2 lines";
      if (!(radius > 0)) return "Radius must be positive";
      const l1 = sketch.entities.find((e) => e.id === selectedEntities[0]);
      const l2 = sketch.entities.find((e) => e.id === selectedEntities[1]);
      if (!l1 || l1.type !== "line" || !l2 || l2.type !== "line")
        return "Both selections must be lines";

      // Find the shared corner point.
      const shared = [l1.p1, l1.p2].find((p) => p === l2.p1 || p === l2.p2);
      if (!shared) return "Selected lines must share a corner";
      const pById = (id: string) => sketch.points.find((p) => p.id === id)!;
      const corner = pById(shared);
      const far1 = pById(l1.p1 === shared ? l1.p2 : l1.p1);
      const far2 = pById(l2.p1 === shared ? l2.p2 : l2.p1);

      // Unit directions from the corner along each line.
      const d1u = far1.u - corner.u, d1v = far1.v - corner.v;
      const d2u = far2.u - corner.u, d2v = far2.v - corner.v;
      const l1len = Math.hypot(d1u, d1v) || 1;
      const l2len = Math.hypot(d2u, d2v) || 1;
      const e1u = d1u / l1len, e1v = d1v / l1len;
      const e2u = d2u / l2len, e2v = d2v / l2len;

      // Half-angle between the legs → trim setback = r / tan(theta/2).
      const cosT = Math.max(-1, Math.min(1, e1u * e2u + e1v * e2v));
      const theta = Math.acos(cosT);
      if (theta < 1e-3 || Math.PI - theta < 1e-3)
        return "Lines are collinear — no corner to fillet";
      const setback = radius / Math.tan(theta / 2);
      if (setback > l1len || setback > l2len)
        return "Radius too large for these edges";

      // Tangent points along each leg, and the arc center (along the bisector).
      const t1u = corner.u + e1u * setback, t1v = corner.v + e1v * setback;
      const t2u = corner.u + e2u * setback, t2v = corner.v + e2v * setback;
      const bisu = e1u + e2u, bisv = e1v + e2v;
      const bisLen = Math.hypot(bisu, bisv) || 1;
      const centerDist = radius / Math.sin(theta / 2);
      const cu = corner.u + (bisu / bisLen) * centerDist;
      const cv = corner.v + (bisv / bisLen) * centerDist;

      // Arc sweep: cross product of (center→t1) and (center→t2) sign gives CCW/CW.
      const c1u = t1u - cu, c1v = t1v - cv;
      const c2u = t2u - cu, c2v = t2v - cv;
      const crossz = c1u * c2v - c1v * c2u;
      const sweep = crossz > 0 ? "ccw" : "cw";

      commit((s) => {
        // Move the shared corner to tangent point 1 (keeps l1 valid, trimmed),
        // add a new point for tangent 2 that l2 now ends at, plus the arc + a
        // center point.
        const cp = s.points.find((p) => p.id === shared)!;
        cp.u = t1u;
        cp.v = t1v;
        const t2id = addPoint(s, t2u, t2v);
        const centerId = addPoint(s, cu, cv);
        // Re-point l2's shared end to the new tangent-2 point.
        const l2m = s.entities.find((e) => e.id === l2.id)!;
        if (l2m.type === "line") {
          if (l2m.p1 === shared) l2m.p1 = t2id;
          else l2m.p2 = t2id;
        }
        s.entities.push({
          id: newSketchId("ar"),
          type: "arc",
          center: centerId,
          start: shared, // tangent point 1 (the moved corner)
          end: t2id,
          sweep,
        });
      });
      set({ selectedEntities: [] });
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
          if (e.type === "circle" || e.type === "ellipse")
            return !deadPoints.has(e.center);
          if (e.type === "spline") return !e.points.some((p) => deadPoints.has(p));
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

/** Convenience re-export so UI can read plane definitions. */
export { BASE_PLANES };
