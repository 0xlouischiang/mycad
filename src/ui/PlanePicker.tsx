/**
 * Plane picker: enters sketch mode on one of the three base planes.
 * Lives in the 3D-mode sidebar. Phase 3 sketches only support base planes
 * (XY/XZ/YZ); sketching on a model face comes with Phase 5 face picking.
 */
import { useSketchStore } from "../sketch/sketchStore";
import type { SketchPlaneId } from "../model/sketch";

const PLANES: { id: SketchPlaneId; label: string }[] = [
  { id: "XY", label: "Top (XY)" },
  { id: "XZ", label: "Front (XZ)" },
  { id: "YZ", label: "Right (YZ)" },
];

export function PlanePicker() {
  const enterSketch = useSketchStore((s) => s.enterSketch);
  return (
    <section className="border-t border-neutral-800 p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        New sketch
      </h2>
      <div className="flex gap-1">
        {PLANES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => enterSketch(p.id)}
            className="flex-1 rounded bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700"
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  );
}
