/**
 * React wrapper around the imperative three.js Viewport.
 *
 * Mounts the Viewport into a container div, feeds it the current shape from the
 * store, and tears it down on unmount. React owns the DOM node; the Viewport
 * owns everything WebGL.
 *
 * Edge picking: pointer move drives hover highlight; a click that hits an edge
 * toggles it in the store's selection (shift = additive). A click that starts a
 * drag (orbit) is not treated as a pick — we only select on a click that didn't
 * move much.
 */
import { useEffect, useRef } from "react";
import { Viewport } from "./Viewport";
import { useStore } from "../store";

export function ViewportView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const shape = useStore((s) => s.shape);
  const setSelectedEdges = useStore((s) => s.setSelectedEdges);
  const selectedEdgeRefs = useStore((s) => s.selectedEdgeRefs);

  // Track pointer-down position to distinguish a click (pick) from a drag (orbit).
  const downPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const vp = new Viewport(containerRef.current);
    viewportRef.current = vp;
    // Push canvas-driven selection changes into the store.
    vp.onSelectionChange = (refs) => setSelectedEdges(refs);
    return () => {
      vp.dispose();
      viewportRef.current = null;
    };
  }, [setSelectedEdges]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (shape) vp.setShape(shape);
    else vp.clearShape();
  }, [shape]);

  // Keep the viewport's highlight in sync when selection is cleared elsewhere
  // (e.g. after a fillet consumes the edges).
  useEffect(() => {
    viewportRef.current?.setSelection(selectedEdgeRefs);
  }, [selectedEdgeRefs]);

  const toNdc = (e: React.PointerEvent): [number, number] => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    return [x, y];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const [x, y] = toNdc(e);
    const ref = vp.hover(x, y);
    // Cursor affordance: pointer over a pickable edge.
    if (containerRef.current) {
      containerRef.current.style.cursor = ref ? "pointer" : "default";
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    downPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    const start = downPos.current;
    downPos.current = null;
    if (!vp || !start) return;
    // Only treat as a pick if the pointer barely moved (else it was an orbit).
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (moved > 4) return;
    const [x, y] = toNdc(e);
    vp.clickSelect(x, y, e.shiftKey);
  };

  const zoomToFit = () => {
    if (shape && viewportRef.current) viewportRef.current.frameCurrent(shape.bbox);
  };

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <button
        type="button"
        onClick={zoomToFit}
        disabled={!shape}
        className="absolute right-3 top-3 rounded border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-200 backdrop-blur transition hover:bg-neutral-700 disabled:opacity-40"
      >
        Zoom to fit
      </button>
      {selectedEdgeRefs.length > 0 && (
        <div className="absolute left-3 top-3 rounded border border-amber-700 bg-amber-950/70 px-2 py-1 text-xs text-amber-200 backdrop-blur">
          {selectedEdgeRefs.length} edge(s) selected · Esc to clear
        </div>
      )}
      {shape && (
        <div className="absolute bottom-3 left-3 rounded border border-neutral-700 bg-neutral-900/80 px-2 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur">
          {formatDims(shape.bbox)}
        </div>
      )}
    </div>
  );
}

/** Overall model extents (X × Y × Z) from the bounding box, for quick inspection. */
function formatDims(bbox: {
  min: [number, number, number];
  max: [number, number, number];
}): string {
  const dx = bbox.max[0] - bbox.min[0];
  const dy = bbox.max[1] - bbox.min[1];
  const dz = bbox.max[2] - bbox.min[2];
  const f = (n: number) => n.toFixed(1);
  return `${f(dx)} × ${f(dy)} × ${f(dz)}`;
}
