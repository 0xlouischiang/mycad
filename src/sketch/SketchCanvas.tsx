/**
 * 2D orthographic sketch canvas (SVG-based).
 *
 * Deliberately SVG rather than a three.js ortho camera: the sketch view is
 * strictly 2D, and SVG gives crisp lines, trivial hit-testing, and simple
 * pan/zoom without wrestling a 3D camera into a locked orientation.
 *
 * Screen<->plane mapping: the view holds a pan (px,py in plane units) and a
 * scale (px per plane unit). +v points UP on screen (SVG y is flipped).
 *
 * Interaction:
 *   - select tool: click points/entities (shift = additive), drag points to
 *     re-solve live. Dragging on empty space box-selects (see boxSelect.ts):
 *     left→right = window (fully inside), right→left = crossing (touching);
 *     shift adds to the selection.
 *   - drawing tools: click to place (see sketchStore.clickAt). Between clicks
 *     a dashed live preview (see preview.ts) shows what the next click makes.
 *   - wheel = zoom about cursor, middle/space-drag = pan.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSketchStore } from "./sketchStore";
import { boxFromCorners, boxSelect } from "./boxSelect";
import { previewGeometry, snapCursor, type PreviewShape, type Vec } from "./preview";
import {
  AXIS_LABEL,
  inferAxis,
  layoutDimension,
  measure,
  placementOffset,
  type DimensionLayout,
} from "./dimension";
import { displayValue } from "./sketchExprs";
import {
  ORIGIN_ID,
  distanceAxis,
  type ArcEntity,
  type CircleEntity,
  type DistanceAxis,
  type EllipseEntity,
  type LineEntity,
  type Sketch,
  type SplineEntity,
} from "../model/sketch";

interface View {
  scale: number; // pixels per plane unit
  px: number; // plane-space point shown at screen center
  py: number;
}

export function SketchCanvas() {
  const sketch = useSketchStore((s) => s.sketch);
  const tool = useSketchStore((s) => s.tool);
  const selectedPoints = useSketchStore((s) => s.selectedPoints);
  const selectedEntities = useSketchStore((s) => s.selectedEntities);
  const clickAt = useSketchStore((s) => s.clickAt);
  const dragPoint = useSketchStore((s) => s.dragPoint);
  const selectPoint = useSketchStore((s) => s.selectPoint);
  const selectEntity = useSketchStore((s) => s.selectEntity);
  const selectBox = useSketchStore((s) => s.selectBox);
  const pending = useSketchStore((s) => s.pending);
  const polygonSides = useSketchStore((s) => s.polygonSides);
  const dimension = useSketchStore((s) => s.dimension);
  const placeDimension = useSketchStore((s) => s.placeDimension);
  const setDimensionOffset = useSketchStore((s) => s.setDimensionOffset);
  /** Constraint whose value editor is open (set right after placing a dim). */
  const [editingDim, setEditingDim] = useState<string | null>(null);
  /** Dragging a placed dimension's line to reposition it. */
  const dimDragRef = useRef<{ id: string } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [view, setView] = useState<View>({ scale: 8, px: 0, py: 0 });
  const dragRef = useRef<{ pointId: string } | null>(null);
  const panRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  /**
   * Empty-space mousedown under the select tool. It only becomes a box once
   * the pointer moves past BOX_THRESHOLD px; otherwise mouseup is a plain
   * empty click (clears the selection, as before).
   */
  const boxRef = useRef<{
    x: number;
    y: number;
    start: Vec;
    additive: boolean;
    active: boolean;
  } | null>(null);
  /** Live box-select rectangle in screen px (null when not box-selecting). */
  const [box, setBox] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  /** Cursor in plane coords while hovering the canvas (drives the live preview). */
  const [cursor, setCursor] = useState<Vec | null>(null);

  // Track container size.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Convert plane (u,v) -> screen (x,y). */
  const toScreen = useCallback(
    (u: number, v: number): [number, number] => {
      const x = size.w / 2 + (u - view.px) * view.scale;
      const y = size.h / 2 - (v - view.py) * view.scale; // flip v
      return [x, y];
    },
    [size, view],
  );

  /** Convert screen (x,y) -> plane (u,v). */
  const toPlane = useCallback(
    (x: number, y: number): [number, number] => {
      const u = (x - size.w / 2) / view.scale + view.px;
      const v = -(y - size.h / 2) / view.scale + view.py;
      return [u, v];
    },
    [size, view],
  );

  const eventToPlane = useCallback(
    (e: React.MouseEvent | MouseEvent): [number, number] => {
      const rect = svgRef.current!.getBoundingClientRect();
      return toPlane(e.clientX - rect.left, e.clientY - rect.top);
    },
    [toPlane],
  );

  // Global mousemove/up for dragging + panning.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const b = boxRef.current;
      if (b) {
        if (!b.active && Math.hypot(e.clientX - b.x, e.clientY - b.y) > BOX_THRESHOLD) {
          b.active = true;
        }
        if (b.active) {
          const rect = svgRef.current!.getBoundingClientRect();
          setBox({
            x0: b.x - rect.left,
            y0: b.y - rect.top,
            x1: e.clientX - rect.left,
            y1: e.clientY - rect.top,
          });
        }
      } else if (dimDragRef.current) {
        const sk = useSketchStore.getState().sketch;
        const c = sk?.constraints.find((x) => x.id === dimDragRef.current!.id);
        if (sk && c?.type === "distance") {
          const a = sk.points.find((p) => p.id === c.p1);
          const b = sk.points.find((p) => p.id === c.p2);
          const [u, v] = eventToPlane(e);
          if (a && b) {
            setDimensionOffset(c.id, placementOffset(a, b, { u, v }, distanceAxis(c)));
          }
        }
      } else if (dragRef.current) {
        const [u, v] = eventToPlane(e);
        dragPoint(dragRef.current.pointId, u, v);
      } else if (panRef.current) {
        const dx = e.clientX - panRef.current.x;
        const dy = e.clientY - panRef.current.y;
        setView((prev) => ({
          ...prev,
          px: panRef.current!.px - dx / prev.scale,
          py: panRef.current!.py + dy / prev.scale,
        }));
      }
    };
    const onUp = (e: MouseEvent) => {
      const b = boxRef.current;
      if (b) {
        boxRef.current = null;
        setBox(null);
        const sk = useSketchStore.getState().sketch;
        if (b.active && sk) {
          const [u, v] = eventToPlane(e);
          // Window when dragged rightward on screen, crossing when leftward.
          const mode = e.clientX >= b.x ? "window" : "crossing";
          const hit = boxSelect(sk, boxFromCorners(b.start, { u, v }), mode);
          selectBox(hit.points, hit.entities, b.additive);
        } else {
          // Below the drag threshold: same as the old empty click.
          clickAt(b.start.u, b.start.v, null);
        }
      }
      dragRef.current = null;
      panRef.current = null;
      dimDragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragPoint, eventToPlane, selectBox, clickAt]);

  const onWheel = (e: React.WheelEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const [uBefore, vBefore] = toPlane(e.clientX - rect.left, e.clientY - rect.top);
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setView((prev) => {
      const scale = Math.max(0.5, Math.min(200, prev.scale * factor));
      // Keep the cursor's plane point stationary.
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = uBefore - (x - size.w / 2) / scale;
      const py = vBefore + (y - size.h / 2) / scale;
      return { scale, px, py };
    });
  };

  const findHitPoint = (u: number, v: number): string | null => {
    if (!sketch) return null;
    const tol = 8 / view.scale; // 8px in plane units
    let best: string | null = null;
    let bestD = tol;
    for (const p of sketch.points) {
      const d = Math.hypot(p.u - u, p.v - v);
      if (d < bestD) {
        bestD = d;
        best = p.id;
      }
    }
    return best;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Pan with middle button or Alt+drag.
      panRef.current = { x: e.clientX, y: e.clientY, px: view.px, py: view.py };
      e.preventDefault();
      return;
    }
    if (e.button !== 0 || !sketch) return;

    const [u, v] = eventToPlane(e);
    const hit = findHitPoint(u, v);

    // Placing a distance: this click commits the previewed mode, then the
    // value editor opens on the new dimension.
    if (dimension) {
      // Keep the browser from moving focus to <body> on this mousedown;
      // otherwise it would immediately blur (and commit) the value editor
      // that opens for the new dimension.
      e.preventDefault();
      const a = sketch.points.find((p) => p.id === dimension.p1);
      const b = sketch.points.find((p) => p.id === dimension.p2);
      if (a && b) {
        const c = { u, v };
        const axis = inferAxis(a, b, c, 4 / view.scale);
        const id = placeDimension(axis, placementOffset(a, b, c, axis));
        if (id) setEditingDim(id);
      }
      return;
    }

    if (tool === "select") {
      if (hit) {
        selectPoint(hit, e.shiftKey);
        dragRef.current = { pointId: hit };
      } else {
        // Empty space: decide click vs box-select on mouseup / first move.
        boxRef.current = {
          x: e.clientX,
          y: e.clientY,
          start: { u, v },
          additive: e.shiftKey,
          active: false,
        };
      }
    } else {
      clickAt(u, v, hit);
    }
  };

  if (!sketch) return null;

  // Live preview of the in-progress shape (render-only; clickAt commits).
  let previewShapes: PreviewShape[] = [];
  let snapTarget: Vec | null = null;
  if (cursor && pending && tool !== "select") {
    const snapped = snapCursor(sketch, cursor, findHitPoint(cursor.u, cursor.v));
    if (snapped !== cursor) snapTarget = snapped;
    previewShapes = previewGeometry(sketch, pending, cursor, snapped, polygonSides);
  }
  const boxIsWindow = box ? box.x1 >= box.x0 : true;

  // Distance placement preview: mode follows the cursor (dimension.ts).
  let dimPreview: { axis: DistanceAxis; a: Vec; b: Vec; offset: number; value: number } | null =
    null;
  if (dimension && cursor) {
    const a = sketch.points.find((p) => p.id === dimension.p1);
    const b = sketch.points.find((p) => p.id === dimension.p2);
    if (a && b) {
      const axis = inferAxis(a, b, cursor, 4 / view.scale);
      dimPreview = {
        axis,
        a,
        b,
        offset: placementOffset(a, b, cursor, axis),
        value: Math.abs(measure(a, b, axis)),
      };
    }
  }

  return (
    <div className="relative h-full w-full">
      <svg
        ref={svgRef}
        className="h-full w-full cursor-crosshair select-none bg-neutral-900"
        onMouseDown={onMouseDown}
        onMouseMove={(e) => {
          // Only track while a shape or dimension is in progress, so idle
          // hovering doesn't re-render the whole sketch on every move.
          if (!pending && !dimension) {
            if (cursor) setCursor(null);
            return;
          }
          const [u, v] = eventToPlane(e);
          setCursor({ u, v });
        }}
        onMouseLeave={() => setCursor(null)}
        onWheel={onWheel}
      >
        <Grid size={size} view={view} toScreen={toScreen} />
        <SketchGeometry
          sketch={sketch}
          toScreen={toScreen}
          selectedPoints={selectedPoints}
          selectedEntities={selectedEntities}
          onEntityClick={(id, additive) => {
            if (tool === "select") selectEntity(id, additive);
          }}
        />
        <PreviewLayer
          shapes={previewShapes}
          snapTarget={snapTarget}
          toScreen={toScreen}
          scale={view.scale}
        />
        {box && (
          // Window = solid border, crossing = dashed (AutoCAD/SolidWorks cue).
          // Color matches the existing selection highlight.
          <rect
            x={Math.min(box.x0, box.x1)}
            y={Math.min(box.y0, box.y1)}
            width={Math.abs(box.x1 - box.x0)}
            height={Math.abs(box.y1 - box.y0)}
            fill="#facc15"
            fillOpacity={0.08}
            stroke="#facc15"
            strokeWidth={1}
            strokeDasharray={boxIsWindow ? undefined : "5 3"}
            pointerEvents="none"
          />
        )}
        <DimensionLines
          sketch={sketch}
          toScreen={toScreen}
          scale={view.scale}
          onLineMouseDown={(id) => {
            if (tool === "select" && !dimension) dimDragRef.current = { id };
          }}
        />
        {dimPreview && (
          <DimensionGraphic
            layout={layoutDimension(dimPreview.a, dimPreview.b, dimPreview.axis, dimPreview.offset, 0)}
            toScreen={toScreen}
            color={PREVIEW_STROKE}
            dashed
          />
        )}
      </svg>
      {/* Dimension annotations as HTML overlays (editable inline). */}
      <DimensionLabels
        sketch={sketch}
        toScreen={toScreen}
        scale={view.scale}
        editing={editingDim}
        setEditing={setEditingDim}
      />
      {dimPreview &&
        (() => {
          const lay = layoutDimension(dimPreview.a, dimPreview.b, dimPreview.axis, dimPreview.offset, 0);
          const [x, y] = toScreen(lay.label.u, lay.label.v);
          return (
            <div
              style={{ left: x, top: y }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded bg-blue-950/90 px-1.5 py-0.5 text-[11px] text-blue-100"
            >
              {AXIS_LABEL[dimPreview.axis]} {fmtNum(dimPreview.value)}
            </div>
          );
        })()}
    </div>
  );
}

function fmtNum(n: number): string {
  return String(Math.round(n * 1000) / 1000);
}

// ---------------------------------------------------------------------------
// Distance dimensions (extension lines + arrowed dimension line)
// ---------------------------------------------------------------------------

const DIM_COLOR = "#fbbf24";
/** Default clearance (screen px) for dims without a stored offset (legacy). */
const DIM_CLEARANCE_PX = 18;

function DimensionGraphic({
  layout,
  toScreen,
  color,
  dashed = false,
  onLineMouseDown,
}: {
  layout: DimensionLayout;
  toScreen: (u: number, v: number) => [number, number];
  color: string;
  dashed?: boolean;
  onLineMouseDown?: (e: React.MouseEvent) => void;
}) {
  const [x1, y1] = toScreen(layout.line[0].u, layout.line[0].v);
  const [x2, y2] = toScreen(layout.line[1].u, layout.line[1].v);
  const len = Math.hypot(x2 - x1, y2 - y1);
  // Arrowheads at both ends, pointing outward along the dimension line.
  const arrow = (tx: number, ty: number, dx: number, dy: number) => {
    const s = 7;
    const w = 3;
    const nx = -dy;
    const ny = dx;
    return `${tx},${ty} ${tx - dx * s + nx * w},${ty - dy * s + ny * w} ${tx - dx * s - nx * w},${ty - dy * s - ny * w}`;
  };
  const ux = len > 1e-6 ? (x2 - x1) / len : 1;
  const uy = len > 1e-6 ? (y2 - y1) / len : 0;
  return (
    <g pointerEvents={onLineMouseDown ? undefined : "none"}>
      {layout.ext.map(([p, q], i) => {
        const [ax, ay] = toScreen(p.u, p.v);
        const [bx, by] = toScreen(q.u, q.v);
        return (
          <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={0.75} opacity={0.7} strokeDasharray={dashed ? "3 3" : undefined} />
        );
      })}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "5 3" : undefined} />
      {len > 16 && (
        <>
          <polygon points={arrow(x1, y1, -ux, -uy)} fill={color} />
          <polygon points={arrow(x2, y2, ux, uy)} fill={color} />
        </>
      )}
      {onLineMouseDown && (
        // Fat invisible hit target for dragging the dimension line.
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={10}
          className="cursor-move"
          onMouseDown={(e) => {
            e.stopPropagation();
            onLineMouseDown(e);
          }}
        />
      )}
    </g>
  );
}

function DimensionLines({
  sketch,
  toScreen,
  scale,
  onLineMouseDown,
}: {
  sketch: Sketch;
  toScreen: (u: number, v: number) => [number, number];
  scale: number;
  onLineMouseDown: (constraintId: string) => void;
}) {
  return (
    <>
      {sketch.constraints.map((c) => {
        if (c.type !== "distance") return null;
        const a = sketch.points.find((p) => p.id === c.p1);
        const b = sketch.points.find((p) => p.id === c.p2);
        if (!a || !b) return null;
        const layout = layoutDimension(a, b, distanceAxis(c), c.offset, DIM_CLEARANCE_PX / scale);
        return (
          <DimensionGraphic
            key={c.id}
            layout={layout}
            toScreen={toScreen}
            color={DIM_COLOR}
            onLineMouseDown={() => onLineMouseDown(c.id)}
          />
        );
      })}
    </>
  );
}

/** Screen-px movement before an empty-space press becomes a box-select. */
const BOX_THRESHOLD = 4;

// ---------------------------------------------------------------------------
// Live drawing preview
// ---------------------------------------------------------------------------

// Dashed blue matches the "in-progress" treatment used by the BIM/Plant
// plan views (dashed preview stroke) and the sketch's own point color.
const PREVIEW_STROKE = "#60a5fa";
const PREVIEW_DASH = "6 4";

function PreviewLayer({
  shapes,
  snapTarget,
  toScreen,
  scale,
}: {
  shapes: PreviewShape[];
  /** Existing point the next click would snap onto, if any. */
  snapTarget: Vec | null;
  toScreen: (u: number, v: number) => [number, number];
  scale: number;
}) {
  if (shapes.length === 0) return null;
  const common = {
    fill: "none",
    stroke: PREVIEW_STROKE,
    strokeWidth: 1.5,
    strokeDasharray: PREVIEW_DASH,
  } as const;
  let snapRing: React.ReactNode = null;
  if (snapTarget) {
    const [x, y] = toScreen(snapTarget.u, snapTarget.v);
    snapRing = <circle cx={x} cy={y} r={7} fill="none" stroke={PREVIEW_STROKE} strokeWidth={1.5} />;
  }
  return (
    <g pointerEvents="none">
      {shapes.map((sh, i) => {
        if (sh.kind === "polyline") {
          const pts = sh.pts.map((p) => toScreen(p.u, p.v).join(",")).join(" ");
          return sh.closed ? (
            <polygon key={i} points={pts} {...common} />
          ) : (
            <polyline key={i} points={pts} {...common} />
          );
        }
        if (sh.kind === "circle") {
          const [cx, cy] = toScreen(sh.c.u, sh.c.v);
          return <circle key={i} cx={cx} cy={cy} r={sh.r * scale} {...common} />;
        }
        if (sh.kind === "ellipse") {
          const [cx, cy] = toScreen(sh.c.u, sh.c.v);
          const deg = (-sh.rotation * 180) / Math.PI;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={sh.rx * scale}
              ry={sh.ry * scale}
              transform={`rotate(${deg} ${cx} ${cy})`}
              {...common}
            />
          );
        }
        return (
          <ArcPath
            key={i}
            center={sh.c}
            start={sh.start}
            end={sh.end}
            ccw={sh.ccw}
            toScreen={toScreen}
            stroke={PREVIEW_STROKE}
            strokeWidth={1.5}
            strokeDasharray={PREVIEW_DASH}
          />
        );
      })}
      {snapRing}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Grid + axes
// ---------------------------------------------------------------------------

function Grid({
  size,
  view,
  toScreen,
}: {
  size: { w: number; h: number };
  view: View;
  toScreen: (u: number, v: number) => [number, number];
}) {
  // Choose a grid spacing that stays ~40-80px on screen.
  let spacing = 1;
  while (spacing * view.scale < 40) spacing *= 5;
  while (spacing * view.scale > 200) spacing /= 5;

  const [uMin, vMax] = [
    view.px - size.w / 2 / view.scale,
    view.py + size.h / 2 / view.scale,
  ];
  const [uMax, vMin] = [
    view.px + size.w / 2 / view.scale,
    view.py - size.h / 2 / view.scale,
  ];

  const lines: React.ReactNode[] = [];
  const startU = Math.floor(uMin / spacing) * spacing;
  for (let u = startU; u <= uMax; u += spacing) {
    const [x] = toScreen(u, 0);
    const isAxis = Math.abs(u) < 1e-9;
    lines.push(
      <line
        key={`u${u}`}
        x1={x}
        y1={0}
        x2={x}
        y2={size.h}
        stroke={isAxis ? "#3b6ea5" : "#2a2a2a"}
        strokeWidth={isAxis ? 1.5 : 1}
      />,
    );
  }
  const startV = Math.floor(vMin / spacing) * spacing;
  for (let v = startV; v <= vMax; v += spacing) {
    const [, y] = toScreen(0, v);
    const isAxis = Math.abs(v) < 1e-9;
    lines.push(
      <line
        key={`v${v}`}
        x1={0}
        y1={y}
        x2={size.w}
        y2={y}
        stroke={isAxis ? "#a53b3b" : "#2a2a2a"}
        strokeWidth={isAxis ? 1.5 : 1}
      />,
    );
  }
  return <g>{lines}</g>;
}

// ---------------------------------------------------------------------------
// Geometry rendering
// ---------------------------------------------------------------------------

function SketchGeometry({
  sketch,
  toScreen,
  selectedPoints,
  selectedEntities,
  onEntityClick,
}: {
  sketch: Sketch;
  toScreen: (u: number, v: number) => [number, number];
  selectedPoints: string[];
  selectedEntities: string[];
  onEntityClick: (id: string, additive: boolean) => void;
}) {
  const pt = (id: string) => sketch.points.find((p) => p.id === id);

  return (
    <g>
      {/* Entities */}
      {sketch.entities.map((e) => {
        const sel = selectedEntities.includes(e.id);
        const stroke = sel ? "#facc15" : "#d4d4d4";
        const sw = sel ? 2.5 : 1.75;
        const onClick = (ev: React.MouseEvent) => {
          ev.stopPropagation();
          onEntityClick(e.id, ev.shiftKey);
        };

        if (e.type === "line") {
          const l = e as LineEntity;
          const p1 = pt(l.p1);
          const p2 = pt(l.p2);
          if (!p1 || !p2) return null;
          const [x1, y1] = toScreen(p1.u, p1.v);
          const [x2, y2] = toScreen(p2.u, p2.v);
          return (
            <line
              key={e.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={sw}
              className="cursor-pointer"
              onMouseDown={onClick}
            />
          );
        }

        if (e.type === "circle") {
          const c = e as CircleEntity;
          const center = pt(c.center);
          if (!center) return null;
          const [cx, cy] = toScreen(center.u, center.v);
          const [ex] = toScreen(center.u + c.radius, center.v);
          const r = Math.abs(ex - cx);
          return (
            <circle
              key={e.id}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              className="cursor-pointer"
              onMouseDown={onClick}
            />
          );
        }

        if (e.type === "ellipse") {
          const el = e as EllipseEntity;
          const center = pt(el.center);
          if (!center) return null;
          const [cx, cy] = toScreen(center.u, center.v);
          const [mx] = toScreen(center.u + el.majorRadius, center.v);
          const scale = Math.abs(mx - cx) / (el.majorRadius || 1);
          const rx = el.majorRadius * scale;
          const ry = el.minorRadius * scale;
          // SVG rotates clockwise in screen space; plane +rotation is CCW and y
          // is flipped, so negate to degrees.
          const deg = (-el.rotation * 180) / Math.PI;
          return (
            <ellipse
              key={e.id}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              transform={`rotate(${deg} ${cx} ${cy})`}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              className="cursor-pointer"
              onMouseDown={onClick}
            />
          );
        }

        if (e.type === "spline") {
          const sp = e as SplineEntity;
          const scr = sp.points.map((id) => {
            const p = pt(id);
            return p ? toScreen(p.u, p.v) : null;
          });
          if (scr.some((s) => s === null) || scr.length < 2) return null;
          // Smooth Catmull-Rom-ish preview via a simple polyline (the true
          // curve is the kernel's interpolation; the polyline is a faithful
          // enough 2D preview and keeps picking simple).
          const d =
            `M ${scr[0]![0]} ${scr[0]![1]} ` +
            scr.slice(1).map((s) => `L ${s![0]} ${s![1]}`).join(" ");
          return (
            <path
              key={e.id}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              className="cursor-pointer"
              onMouseDown={onClick}
            />
          );
        }

        // Arc
        const a = e as ArcEntity;
        const center = pt(a.center);
        const start = pt(a.start);
        const end = pt(a.end);
        if (!center || !start || !end) return null;
        return (
          <ArcPath
            key={e.id}
            center={center}
            start={start}
            end={end}
            ccw={(a.sweep ?? "ccw") === "ccw"}
            toScreen={toScreen}
            stroke={stroke}
            strokeWidth={sw}
            onMouseDown={onClick}
          />
        );
      })}

      {/* Points */}
      {sketch.points.map((p) => {
        const [x, y] = toScreen(p.u, p.v);
        const sel = selectedPoints.includes(p.id);
        if (p.id === ORIGIN_ID) {
          // Fixed sketch origin: a ringed marker so it reads as reference
          // geometry. Pickable like any point (for dimensions), never draggable.
          return (
            <g key={p.id} aria-label="Sketch origin">
              <circle cx={x} cy={y} r={sel ? 7 : 6} fill="none" stroke={sel ? "#facc15" : "#9ca3af"} strokeWidth={1.5} />
              <circle cx={x} cy={y} r={2} fill={sel ? "#facc15" : "#9ca3af"} />
            </g>
          );
        }
        return (
          <circle
            key={p.id}
            cx={x}
            cy={y}
            r={sel ? 5 : 3.5}
            fill={p.fixed ? "#6b7280" : sel ? "#facc15" : "#4a90d9"}
            stroke="#111"
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

function ArcPath({
  center,
  start,
  end,
  ccw,
  toScreen,
  stroke,
  strokeWidth,
  strokeDasharray,
  onMouseDown,
}: {
  center: { u: number; v: number };
  start: { u: number; v: number };
  end: { u: number; v: number };
  /** Plane-space sweep from start→end: CCW (default) or CW. */
  ccw: boolean;
  toScreen: (u: number, v: number) => [number, number];
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  /** Omit for non-interactive (preview) arcs. */
  onMouseDown?: (e: React.MouseEvent) => void;
}) {
  const r = Math.hypot(start.u - center.u, start.v - center.v);
  const [sx, sy] = toScreen(start.u, start.v);
  const [ex, ey] = toScreen(end.u, end.v);
  const [cx0] = toScreen(center.u, center.v);
  const [rx] = toScreen(center.u + r, center.v);
  const rPx = Math.abs(rx - cx0);

  // Signed plane-space sweep angle in the chosen direction determines largeArc.
  const a0 = Math.atan2(start.v - center.v, start.u - center.u);
  const a1 = Math.atan2(end.v - center.v, end.u - center.u);
  let delta = a1 - a0;
  if (ccw) {
    while (delta <= 0) delta += 2 * Math.PI;
  } else {
    while (delta >= 0) delta -= 2 * Math.PI;
  }
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  // SVG y is flipped vs plane, so plane-CCW renders as screen sweep-flag 0 and
  // plane-CW as sweep-flag 1.
  const sweep = ccw ? 0 : 1;

  const d = `M ${sx} ${sy} A ${rPx} ${rPx} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className={onMouseDown ? "cursor-pointer" : undefined}
      onMouseDown={onMouseDown}
    />
  );
}

// ---------------------------------------------------------------------------
// Dimension annotations (HTML overlay, editable inline)
// ---------------------------------------------------------------------------

interface DimLabel {
  id: string;
  x: number; // screen px
  y: number;
  /** Displayed magnitude (|value| for horizontal/vertical distances). */
  value: number;
  suffix: string; // "" for distance/radius, "°" for angle
  prefix: string; // "R" for radius, "↔"/"↕" for horizontal/vertical, else ""
  /** What the editor says it's setting, e.g. "Horizontal distance". */
  kind: string;
  expr?: string;
}

function DimensionLabels({
  sketch,
  toScreen,
  scale,
  editing,
  setEditing,
}: {
  sketch: Sketch;
  toScreen: (u: number, v: number) => [number, number];
  scale: number;
  editing: string | null;
  setEditing: (id: string | null) => void;
}) {
  const setDimensionInput = useSketchStore((s) => s.setDimensionInput);
  const varScope = useSketchStore((s) => s.varScope);
  const [error, setError] = useState<string | null>(null);

  const pt = (id: string) => sketch.points.find((p) => p.id === id);
  const ent = (id: string) => sketch.entities.find((e) => e.id === id);

  const labels: DimLabel[] = [];
  for (const c of sketch.constraints) {
    if (c.type === "distance") {
      const a = pt(c.p1);
      const b = pt(c.p2);
      if (!a || !b) continue;
      const axis = distanceAxis(c);
      const lay = layoutDimension(a, b, axis, c.offset, DIM_CLEARANCE_PX / scale);
      const [x, y] = toScreen(lay.label.u, lay.label.v);
      labels.push({
        id: c.id,
        x,
        y,
        value: displayValue(c),
        suffix: "",
        prefix: axis === "x" ? "↔ " : axis === "y" ? "↕ " : "",
        kind: AXIS_LABEL[axis],
        expr: c.expr,
      });
    } else if (c.type === "angle") {
      const la = ent(c.a);
      if (!la || la.type !== "line") continue;
      const p1 = pt(la.p1);
      const p2 = pt(la.p2);
      if (!p1 || !p2) continue;
      const [x, y] = toScreen((p1.u + p2.u) / 2, (p1.v + p2.v) / 2);
      labels.push({ id: c.id, x, y, value: c.value, suffix: "°", prefix: "", kind: "Angle", expr: c.expr });
    } else if (c.type === "radius") {
      const e = ent(c.entity);
      if (!e || (e.type !== "circle" && e.type !== "arc")) continue;
      const center = pt(e.center);
      if (!center) continue;
      const [x, y] = toScreen(center.u, center.v);
      labels.push({ id: c.id, x, y, value: c.value, suffix: "", prefix: "R", kind: "Radius", expr: c.expr });
    }
  }

  const varNames = Object.keys(varScope);
  const commitInput = (id: string, raw: string): boolean => {
    const err = setDimensionInput(id, raw);
    setError(err);
    return err === null;
  };

  return (
    <>
      {labels.map((l) => (
        <div
          key={l.id}
          style={{ left: l.x, top: l.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          {editing === l.id ? (
            <div className="flex flex-col items-center gap-0.5">
              {/* The mode is always named before the value is committed. */}
              <span className="whitespace-nowrap rounded bg-neutral-950/90 px-1 text-[10px] text-neutral-300">
                {l.kind}
              </span>
              <input
                autoFocus
                type="text"
                aria-label={`${l.kind} value or expression`}
                defaultValue={l.expr ?? String(Math.round(l.value * 1000) / 1000)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => {
                  // Clicking away commits a valid entry; an invalid one is
                  // discarded (the dimension keeps its previous value).
                  commitInput(l.id, e.target.value);
                  setError(null);
                  setEditing(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Validate in place: on error, keep focus and the text
                    // selected so the user can retype immediately.
                    const input = e.target as HTMLInputElement;
                    if (commitInput(l.id, input.value)) setEditing(null);
                    else input.select();
                  }
                  if (e.key === "Escape") {
                    setError(null);
                    setEditing(null);
                  }
                }}
                className={`w-24 rounded border bg-neutral-900 px-1 text-center text-[11px] text-neutral-100 outline-none ${
                  error ? "border-red-500" : "border-blue-500"
                }`}
              />
              {error ? (
                <span role="alert" className="max-w-48 rounded bg-red-950/90 px-1 text-[10px] text-red-200">
                  {error}
                </span>
              ) : (
                varNames.length > 0 && (
                  <span className="max-w-48 truncate rounded bg-neutral-950/90 px-1 text-[10px] text-neutral-400">
                    vars: {varNames.join(", ")}
                  </span>
                )
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setEditing(l.id);
              }}
              className="rounded bg-neutral-800/90 px-1 text-[11px] text-amber-300 hover:bg-neutral-700"
              title={`Edit ${l.kind.toLowerCase()}${l.expr ? ` (= ${l.expr})` : ""}`}
              aria-label={`${l.kind} ${l.prefix.trim()}${Math.round(l.value * 1000) / 1000}${l.suffix}${l.expr ? `, driven by ${l.expr}` : ""}`}
            >
              {l.prefix}
              {Math.round(l.value * 1000) / 1000}
              {l.suffix}
              {l.expr && <span className="ml-0.5 text-[9px] text-sky-300">ƒ</span>}
            </button>
          )}
        </div>
      ))}
    </>
  );
}
