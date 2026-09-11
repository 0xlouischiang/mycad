/**
 * Sketch mode toolbar + constraint palette.
 *
 * Top row: drawing tools (select/line/circle/arc) + exit.
 * Constraint buttons apply to the current selection; dimensioned constraints
 * (distance/angle/radius) prompt for a value. A status line shows solver
 * convergence.
 */
import { useState } from "react";
import { useSketchStore, type SketchTool } from "./sketchStore";
import { useStore } from "../store";
import type { ConstraintType } from "../model/sketch";

const TOOLS: { id: SketchTool; label: string; hint: string }[] = [
  { id: "select", label: "Select", hint: "Select / drag points (V)" },
  { id: "line", label: "Line", hint: "Click to chain line segments" },
  { id: "circle", label: "Circle", hint: "Click center, then radius" },
  { id: "arc", label: "Arc", hint: "Click center, start, end" },
];

const GEOMETRIC: { type: ConstraintType; label: string }[] = [
  { type: "coincident", label: "Coincident" },
  { type: "horizontal", label: "Horizontal" },
  { type: "vertical", label: "Vertical" },
  { type: "parallel", label: "Parallel" },
  { type: "perpendicular", label: "Perpendicular" },
  { type: "equalLength", label: "Equal" },
];

const DIMENSIONAL: { type: ConstraintType; label: string; prompt: string }[] = [
  { type: "distance", label: "Distance", prompt: "Distance value:" },
  { type: "angle", label: "Angle", prompt: "Angle (degrees):" },
  { type: "radius", label: "Radius", prompt: "Radius value:" },
];

export function SketchToolbar() {
  const tool = useSketchStore((s) => s.tool);
  const setTool = useSketchStore((s) => s.setTool);
  const exitSketch = useSketchStore((s) => s.exitSketch);
  const finish = useSketchStore((s) => s.finish);
  const addConstraint = useSketchStore((s) => s.addConstraint);
  const deleteSelected = useSketchStore((s) => s.deleteSelected);
  const lastSolve = useSketchStore((s) => s.lastSolve);
  const planeId = useSketchStore((s) => s.sketch?.planeId);
  const addSketchFeature = useStore((s) => s.addSketchFeature);
  const updateSketch = useStore((s) => s.updateSketch);
  const [message, setMessage] = useState<string | null>(null);

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
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.hint}
            onClick={() => setTool(t.id)}
            className={`rounded px-2 py-1 text-xs transition ${
              tool === t.id
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-neutral-700" />
        <button
          type="button"
          onClick={deleteSelected}
          className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-red-900"
        >
          Delete
        </button>
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
          <button
            key={c.type}
            type="button"
            onClick={() => apply(c.type)}
            className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
          >
            {c.label}
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-neutral-700" />
        {DIMENSIONAL.map((c) => (
          <button
            key={c.type}
            type="button"
            onClick={() => apply(c.type, c.prompt)}
            className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
          >
            {c.label}…
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500">{message}</span>
        {lastSolve && (
          <span
            className={lastSolve.converged ? "text-green-500" : "text-yellow-500"}
            title={`max residual ${lastSolve.residual.toExponential(2)}`}
          >
            {lastSolve.converged ? "solved" : "under/over-constrained"}
          </span>
        )}
      </div>
    </div>
  );
}
