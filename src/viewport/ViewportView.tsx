/**
 * React wrapper around the imperative three.js Viewport.
 *
 * Mounts the Viewport into a container div, feeds it the current shape from the
 * store, and tears it down on unmount. React owns the DOM node; the Viewport
 * owns everything WebGL.
 *
 * Picking: a pick-mode toggle (edges vs faces) drives what the pointer selects.
 * Edges feed fillet/chamfer; faces feed shell/draft. Pointer move drives hover;
 * a click that barely moved toggles the hit edge/face (shift = additive). A
 * click that turned into a drag is treated as an orbit, not a pick.
 */
import { useEffect, useRef, useState } from "react";
import { Viewport, type PickMode } from "./Viewport";
import { useStore } from "../store";
import { useSketchStore } from "../sketch/sketchStore";
import { planeForFaceRef } from "../sketch/facePlane";

export function ViewportView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const shape = useStore((s) => s.shape);
  const setSelectedEdges = useStore((s) => s.setSelectedEdges);
  const setSelectedFaces = useStore((s) => s.setSelectedFaces);
  const selectedEdgeRefs = useStore((s) => s.selectedEdgeRefs);
  const selectedFaceRefs = useStore((s) => s.selectedFaceRefs);
  const enterSketchOnFace = useSketchStore((s) => s.enterSketchOnFace);

  const [pickMode, setPickMode] = useState<PickMode>("edge");
  const [sectionAxis, setSectionAxis] = useState<"x" | "y" | "z" | null>(null);
  const [sectionOffset, setSectionOffset] = useState(0);

  // Apply section changes to the viewport.
  useEffect(() => {
    viewportRef.current?.setSection(sectionAxis, sectionOffset);
  }, [sectionAxis, sectionOffset]);

  /** Derive the selected face's plane and enter sketch mode on it. */
  const sketchOnFace = () => {
    if (!shape || selectedFaceRefs.length !== 1) return;
    const plane = planeForFaceRef(shape.mesh, selectedFaceRefs[0]);
    if (!plane) {
      window.alert("That face isn't planar — pick a flat face to sketch on.");
      return;
    }
    setSelectedFaces([]);
    enterSketchOnFace(plane);
  };

  // Track pointer-down position to distinguish a click (pick) from a drag (orbit).
  const downPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const vp = new Viewport(containerRef.current);
    viewportRef.current = vp;
    // Push canvas-driven selection changes into the store.
    vp.onSelectionChange = (refs) => setSelectedEdges(refs);
    vp.onFaceSelectionChange = (refs) => setSelectedFaces(refs);
    return () => {
      vp.dispose();
      viewportRef.current = null;
    };
  }, [setSelectedEdges, setSelectedFaces]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (shape) vp.setShape(shape);
    else vp.clearShape();
  }, [shape]);

  useEffect(() => {
    viewportRef.current?.setPickMode(pickMode);
  }, [pickMode]);

  // Keep the viewport's highlight in sync when selection is cleared elsewhere
  // (e.g. after a fillet/shell consumes the selection).
  useEffect(() => {
    viewportRef.current?.setSelection(selectedEdgeRefs);
  }, [selectedEdgeRefs]);
  useEffect(() => {
    viewportRef.current?.setFaceSelection(selectedFaceRefs);
  }, [selectedFaceRefs]);

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
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (moved > 4) return; // it was an orbit drag, not a pick
    const [x, y] = toNdc(e);
    vp.clickSelect(x, y, e.shiftKey);
  };

  const zoomToFit = () => {
    if (shape && viewportRef.current) viewportRef.current.frameCurrent(shape.bbox);
  };

  const selCount =
    pickMode === "edge" ? selectedEdgeRefs.length : selectedFaceRefs.length;

  const measurement = computeMeasurement(
    shape,
    selectedEdgeRefs,
    selectedFaceRefs,
  );

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />

      {/* Pick-mode toggle */}
      <div className="absolute left-3 top-3 flex overflow-hidden rounded border border-neutral-700 text-xs">
        {(["edge", "face"] as PickMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setPickMode(m)}
            className={`px-2 py-1 capitalize transition ${
              pickMode === m
                ? "bg-blue-600 text-white"
                : "bg-neutral-800/80 text-neutral-300 backdrop-blur hover:bg-neutral-700"
            }`}
          >
            {m}s
          </button>
        ))}
      </div>

      {/* Section-view control */}
      <div className="absolute left-3 top-11 flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800/80 px-1.5 py-1 text-[11px] backdrop-blur">
        <span className="text-neutral-400">section</span>
        {(["off", "x", "y", "z"] as const).map((a) => {
          const val = a === "off" ? null : a;
          const active = sectionAxis === val;
          return (
            <button
              key={a}
              type="button"
              onClick={() => setSectionAxis(val)}
              className={`rounded px-1 uppercase ${
                active ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {a}
            </button>
          );
        })}
        {sectionAxis && (
          <input
            type="range"
            min={-100}
            max={100}
            step={0.5}
            value={sectionOffset}
            onChange={(e) => setSectionOffset(Number(e.target.value))}
            className="w-24 accent-blue-500"
            title="Section offset"
          />
        )}
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1">
        {/* Standard view orientations */}
        <div className="flex overflow-hidden rounded border border-neutral-700 text-[11px]">
          {(
            [
              ["front", "Fr"],
              ["top", "To"],
              ["right", "Ri"],
              ["iso", "Iso"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => viewportRef.current?.setView(v)}
              title={`${v} view`}
              className="bg-neutral-800/80 px-1.5 py-1 text-neutral-200 backdrop-blur hover:bg-neutral-700"
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={zoomToFit}
          disabled={!shape}
          className="rounded border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-200 backdrop-blur transition hover:bg-neutral-700 disabled:opacity-40"
        >
          Zoom to fit
        </button>
      </div>

      {selCount > 0 && (
        <div className="absolute left-3 top-12 flex items-center gap-2 rounded border border-amber-700 bg-amber-950/70 px-2 py-1 text-xs text-amber-200 backdrop-blur">
          <span>
            {selCount} {pickMode}(s) selected · Esc to clear
          </span>
          {pickMode === "face" && selectedFaceRefs.length === 1 && (
            <button
              type="button"
              onClick={sketchOnFace}
              className="rounded bg-blue-600 px-1.5 py-0.5 text-white hover:bg-blue-500"
            >
              Sketch on face
            </button>
          )}
        </div>
      )}

      {measurement && (
        <div className="absolute right-3 bottom-3 rounded border border-emerald-700 bg-emerald-950/70 px-2 py-1 font-mono text-[11px] text-emerald-200 backdrop-blur">
          {measurement}
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

/** Parse a "x,y,z" ref string into a point, or null. */
function parseRef(ref: string): [number, number, number] | null {
  const parts = ref.split(",").map(Number);
  return parts.length === 3 && parts.every(Number.isFinite)
    ? [parts[0], parts[1], parts[2]]
    : null;
}

/**
 * Compute a measurement readout from the current selection:
 *  - exactly 1 edge selected → its true polyline length (from the edge payload).
 *  - exactly 2 selections (edges/faces, any mix) → center-to-center distance
 *    with dx/dy/dz breakdown (refs are bbox-center points).
 * Returns null when there's nothing meaningful to show.
 */
function computeMeasurement(
  shape: { edges: import("../kernel/protocol").EdgePayload; bbox: unknown } | null,
  edgeRefs: string[],
  faceRefs: string[],
): string | null {
  const allRefs = [...edgeRefs, ...faceRefs];

  // Single edge → true length by summing its polyline segment lengths.
  if (edgeRefs.length === 1 && faceRefs.length === 0 && shape) {
    const len = edgeLengthForRef(shape.edges, edgeRefs[0]);
    if (len !== null) return `length ${len.toFixed(3)}`;
  }

  // Two selections → distance between their reference (bbox-center) points.
  if (allRefs.length === 2) {
    const a = parseRef(allRefs[0]);
    const b = parseRef(allRefs[1]);
    if (a && b) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const dz = b[2] - a[2];
      const dist = Math.hypot(dx, dy, dz);
      return `dist ${dist.toFixed(3)}  (Δ ${dx.toFixed(1)}, ${dy.toFixed(1)}, ${dz.toFixed(1)})`;
    }
  }

  return null;
}

/**
 * Find the edge whose bbox-center matches `ref` in the edge payload and return
 * its polyline length. edgeGroups are [floatStart, floatCount, hash]; we sum
 * segment lengths and match the group whose sample-bbox center equals `ref`.
 */
function edgeLengthForRef(
  edges: import("../kernel/protocol").EdgePayload,
  ref: string,
): number | null {
  const { points, edgeGroups } = edges;
  for (let g = 0; g < edgeGroups.length; g += 3) {
    const start = edgeGroups[g];
    const count = edgeGroups[g + 1];
    // bbox center of this edge's samples.
    let xmin = Infinity, ymin = Infinity, zmin = Infinity;
    let xmax = -Infinity, ymax = -Infinity, zmax = -Infinity;
    for (let i = start; i < start + count; i += 3) {
      const x = points[i], y = points[i + 1], z = points[i + 2];
      if (x < xmin) xmin = x; if (y < ymin) ymin = y; if (z < zmin) zmin = z;
      if (x > xmax) xmax = x; if (y > ymax) ymax = y; if (z > zmax) zmax = z;
    }
    const q = (n: number) => {
      const r = Math.round(n * 1000) / 1000;
      return r === 0 ? 0 : r;
    };
    const center = `${q((xmin + xmax) / 2)},${q((ymin + ymax) / 2)},${q((zmin + zmax) / 2)}`;
    if (center !== ref) continue;
    // Sum consecutive segment lengths.
    let len = 0;
    for (let i = start; i < start + count - 3; i += 3) {
      len += Math.hypot(
        points[i + 3] - points[i],
        points[i + 4] - points[i + 1],
        points[i + 5] - points[i + 2],
      );
    }
    return len;
  }
  return null;
}
