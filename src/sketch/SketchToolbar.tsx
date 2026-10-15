/**
 * Sketch mode toolbar + constraint palette.
 *
 * Top row: drawing tools (select/line/circle/arc) + edit tools + exit.
 * Tools and constraints render as icon buttons (see ToolIcon / IconButton);
 * the `label` strings below are their accessible names and tooltip text.
 * Constraint buttons apply to the current selection; dimensioned constraints
 * (distance/angle/radius) prompt for a value. A status line shows solver
 * convergence.
 */
import { useEffect, useState } from "react";
import { useSketchStore, type SketchTool } from "./sketchStore";
import { useStore } from "../store";
import type { ConstraintType } from "../model/sketch";
import { IconButton } from "./IconButton";
import { ToolIcon } from "./ToolIcon";

const TOOLS: { id: SketchTool; label: string; hint: string }[] = [
  { id: "select", label: "Select", hint: "Select / drag points (V)" },
  { id: "line", label: "Line", hint: "Click to chain line segments" },
  { id: "rectangle", label: "Rect", hint: "Click two opposite corners" },
  { id: "circle", label: "Circle", hint: "Click center, then radius" },
  { id: "arc", label: "Arc", hint: "Click center, start, end" },
  { id: "polygon", label: "Poly", hint: "Click center, then a vertex" },
  { id: "slot", label: "Slot", hint: "Click end A, end B, then width" },
  { id: "ellipse", label: "Ellipse", hint: "Click center, major axis, then minor" },
  { id: "spline", label: "Spline", hint: "Click points; Finish to close" },
];

const GEOMETRIC: { type: ConstraintType; label: string }[] = [
  { type: "coincident", label: "Coincident" },
  { type: "horizontal", label: "Horizontal" },
  { type: "vertical", label: "Vertical" },
  { type: "parallel", label: "Parallel" },
  { type: "perpendicular", label: "Perpendicular" },
  { type: "equalLength", label: "Equal" },
  { type: "concentric", label: "Concentric" },
  { type: "midpoint", label: "Midpoint" },
  { type: "symmetric", label: "Symmetric" },
  { type: "tangent", label: "Tangent" },
];

const DIMENSIONAL: { type: ConstraintType; label: string; prompt: string }[] = [
  { type: "distance", label: "Distance", prompt: "Distance value:" },
  { type: "angle", label: "Angle", prompt: "Angle (degrees):" },
  { type: "radius", label: "Radius", prompt: "Radius value:" },
];

/**
 * Solver status: conflicts first (a dimension that can't be met, e.g. a
 * horizontal distance between points already constrained vertical), then
 * redundancy, then remaining degrees of freedom.
 */
function SolveStatus({
  solve,
}: {
  solve: { converged: boolean; residual: number; dof?: number; redundant?: number };
}) {
  const title = `max residual ${solve.residual.toExponential(2)}`;
  if (!solve.converged) {
    return (
      <span role="status" className="text-red-400" title={title}>
        Conflicting constraints: undo the last one or change a value
      </span>
    );
  }
  if (solve.redundant && solve.redundant > 0) {
    return (
      <span role="status" className="text-yellow-500" title={title}>
        solved · {solve.redundant} redundant constraint{solve.redundant > 1 ? "s" : ""}
      </span>
    );
  }
  if (solve.dof === 0) {
    return (
      <span role="status" className="text-green-500" title={title}>
        fully constrained
      </span>
    );
  }
  return (
    <span role="status" className="text-green-500" title={title}>
      solved{solve.dof !== undefined ? ` · ${solve.dof} DOF` : ""}
    </span>
  );
}

export function SketchToolbar() {
  const tool = useSketchStore((s) => s.tool);
  const setTool = useSketchStore((s) => s.setTool);
  const polygonSides = useSketchStore((s) => s.polygonSides);
  const setPolygonSides = useSketchStore((s) => s.setPolygonSides);
  const finishSpline = useSketchStore((s) => s.finishSpline);
  const exitSketch = useSketchStore((s) => s.exitSketch);
  const finish = useSketchStore((s) => s.finish);
  const addConstraint = useSketchStore((s) => s.addConstraint);
  const addSketchFillet = useSketchStore((s) => s.addSketchFillet);
  const addSketchMirror = useSketchStore((s) => s.addSketchMirror);
  const deleteSelected = useSketchStore((s) => s.deleteSelected);
  const lastSolve = useSketchStore((s) => s.lastSolve);
  const beginDistance = useSketchStore((s) => s.beginDistance);
  const placingDim = useSketchStore((s) => s.dimension !== null);
  const planeId = useSketchStore((s) => s.sketch?.planeId);
  const addSketchFeature = useStore((s) => s.addSketchFeature);
  const updateSketch = useStore((s) => s.updateSketch);
  const [message, setMessage] = useState<string | null>(null);
  // Drop the placement hint once a dimension is placed or cancelled.
  const [hintShown, setHintShown] = useState(false);
  useEffect(() => {
    if (!placingDim && hintShown) {
      setMessage(null);
      setHintShown(false);
    }
  }, [placingDim, hintShown]);

  /** Commit the sketch into the feature tree (new node or update existing). */
  const finishSketch = () => {
    const result = finish();
    if (!result) return;
    if (result.editingFeatureId) {
      updateSketch(result.editingFeatureId, result.sketch);
    } else {
      addSketchFeature(result.sketch);
    }
  };

  const apply = (type: ConstraintType, needsValue?: string) => {
    let value: number | undefined;
    if (needsValue) {
      const raw = window.prompt(needsValue);
      if (raw === null) return;
      value = Number(raw);
      if (!Number.isFinite(value)) {
        setMessage("Invalid number");
        return;
      }
    }
    const err = addConstraint(type, value);
    setMessage(err ?? `Applied ${type}`);
  };

  return (
    <div className="flex flex-col gap-2 border-b border-neutral-800 bg-neutral-900 p-2">
      <div className="flex items-center gap-1">
        <span className="mr-2 text-xs font-semibold text-neutral-400">
          Sketch · {planeId}
        </span>
        <div className="mr-1 h-5 w-px bg-neutral-700" />
        {TOOLS.map((t) => (
          <IconButton
            key={t.id}
            label={t.label}
            active={tool === t.id}
            tooltipSide="bottom"
            onClick={() => setTool(t.id)}
          >
            <ToolIcon name={t.id} />
          </IconButton>
        ))}
        {tool === "polygon" && (
          <label className="flex items-center gap-1 text-xs text-neutral-400">
            sides
            <input
              type="number"
              min={3}
              value={polygonSides}
              onChange={(e) => setPolygonSides(Number(e.target.value))}
              className="w-12 rounded border border-neutral-700 bg-neutral-800 px-1 py-1 text-right text-neutral-100 outline-none focus:border-blue-500"
            />
          </label>
        )}
        {tool === "spline" && (
          <button
            type="button"
            onClick={finishSpline}
            className="rounded bg-green-700 px-2 py-1 text-xs text-white hover:bg-green-600"
          >
            Finish spline
          </button>
        )}
        <div className="mx-1 h-5 w-px bg-neutral-700" />
        <IconButton
          label="Fillet…"
          tooltipSide="bottom"
          onClick={() => {
            const raw = window.prompt("Fillet radius:");
            if (raw === null) return;
            const r = Number(raw);
            if (!Number.isFinite(r)) {
              setMessage("Invalid radius");
              return;
            }
            setMessage(addSketchFillet(r) ?? "Filleted corner");
          }}
        >
          <ToolIcon name="fillet" />
        </IconButton>
        <IconButton
          label="Mirror"
          tooltipSide="bottom"
          onClick={() => {
            // Convention: last-selected entity is the mirror line.
            const sel = useSketchStore.getState().selectedEntities;
            if (sel.length < 2) {
              setMessage("Select entities + a mirror line (last)");
              return;
            }
            setMessage(addSketchMirror(sel[sel.length - 1]) ?? "Mirrored");
          }}
        >
          <ToolIcon name="mirror" />
        </IconButton>
        <IconButton label="Delete" danger tooltipSide="bottom" onClick={deleteSelected}>
          <ToolIcon name="delete" />
        </IconButton>
        <button
          type="button"
          onClick={exitSketch}
          className="ml-auto rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={finishSketch}
          className="rounded bg-green-700 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
        >
          ✓ Finish sketch
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-[11px] uppercase tracking-wide text-neutral-500">
          Constrain
        </span>
        {GEOMETRIC.map((c) => (
          <IconButton key={c.type} label={c.label} onClick={() => apply(c.type)}>
            <ToolIcon name={c.type} />
          </IconButton>
        ))}
        <div className="mx-1 h-5 w-px bg-neutral-700" />
        {DIMENSIONAL.map((c) =>
          c.type === "distance" ? (
            // Distance: one tool, three modes. Pick 2 points (or a line),
            // then the canvas previews aligned / horizontal / vertical from
            // where the cursor is; click to place, then type the value.
            <IconButton
              key={c.type}
              label="Distance (aligned / horizontal / vertical)"
              active={placingDim}
              onClick={() => {
                const err = beginDistance();
                setHintShown(err === null);
                setMessage(
                  err ??
                    "Move above/below for horizontal, left/right for vertical, diagonal for aligned. Click to place, Esc to cancel.",
                );
              }}
            >
              <ToolIcon name={c.type} />
            </IconButton>
          ) : (
            <IconButton key={c.type} label={`${c.label}…`} onClick={() => apply(c.type, c.prompt)}>
              <ToolIcon name={c.type} />
            </IconButton>
          ),
        )}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500">{message}</span>
        {lastSolve && <SolveStatus solve={lastSolve} />}
      </div>
    </div>
  );
}
