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
 *     re-solve live.
 *   - line/circle/arc tools: click to place (see sketchStore.clickAt).
 *   - wheel = zoom about cursor, middle/space-drag = pan.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSketchStore } from "./sketchStore";
import type { ArcEntity, CircleEntity, LineEntity, Sketch } from "../model/sketch";

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

  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [view, setView] = useState<View>({ scale: 8, px: 0, py: 0 });
  const dragRef = useRef<{ pointId: string } | null>(null);
  const panRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

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
      if (dragRef.current) {
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
    const onUp = () => {
      dragRef.current = null;
      panRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragPoint, eventToPlane]);

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

    if (tool === "select") {
      if (hit) {
        selectPoint(hit, e.shiftKey);
        dragRef.current = { pointId: hit };
      } else {
        clickAt(u, v, null); // clears selection on empty click
      }
    } else {
      clickAt(u, v, hit);
    }
  };

  if (!sketch) return null;

  return (
    <svg
      ref={svgRef}
      className="h-full w-full cursor-crosshair select-none bg-neutral-900"
      onMouseDown={onMouseDown}
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
    </svg>
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
  toScreen,
  stroke,
  strokeWidth,
  onMouseDown,
}: {
  center: { u: number; v: number };
  start: { u: number; v: number };
  end: { u: number; v: number };
  toScreen: (u: number, v: number) => [number, number];
  stroke: string;
  strokeWidth: number;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  const r = Math.hypot(start.u - center.u, start.v - center.v);
  const [sx, sy] = toScreen(start.u, start.v);
  const [ex, ey] = toScreen(end.u, end.v);
  const [cx0] = toScreen(center.u, center.v);
  const [rx] = toScreen(center.u + r, center.v);
  const rPx = Math.abs(rx - cx0);

  // Determine sweep direction (CCW in plane => CW on flipped screen).
  const a0 = Math.atan2(start.v - center.v, start.u - center.u);
  const a1 = Math.atan2(end.v - center.v, end.u - center.u);
  let delta = a1 - a0;
  while (delta <= 0) delta += 2 * Math.PI;
  const largeArc = delta > Math.PI ? 1 : 0;
  // Plane CCW maps to screen CW because y is flipped => sweep-flag 0.
  const sweep = 0;

  const d = `M ${sx} ${sy} A ${rPx} ${rPx} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      className="cursor-pointer"
      onMouseDown={onMouseDown}
    />
  );
}
