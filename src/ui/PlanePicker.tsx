/**
 * Plane picker: enters sketch mode on one of the three base planes, optionally
 * offset along the plane normal (a datum plane). Offsetting lets sketches sit
 * at arbitrary heights — needed to loft two same-orientation profiles or sketch
 * on top of a body.
 */
import { useState } from "react";
import { useSketchStore } from "../sketch/sketchStore";
import type { SketchPlaneId } from "../model/sketch";

const PLANES: { id: SketchPlaneId; label: string }[] = [
  { id: "XY", label: "Top (XY)" },
  { id: "XZ", label: "Front (XZ)" },
  { id: "YZ", label: "Right (YZ)" },
];

export function PlanePicker() {
  const enterSketch = useSketchStore((s) => s.enterSketch);
  const [offset, setOffset] = useState(0);

  return (
    <section className="border-t border-neutral-800 p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        New sketch
      </h2>
      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
        <span className="text-neutral-400">plane offset</span>
        <input
          type="number"
          step="any"
          value={offset}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) setOffset(v);
          }}
          className="w-24 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-right text-neutral-100 outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex gap-1">
        {PLANES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => enterSketch(p.id, offset)}
            className="flex-1 rounded bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700"
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  );
}
