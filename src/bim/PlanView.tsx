/**
 * Plan view (Phase 14): a top-down 2D SVG canvas for authoring BIM components
 * on the active level. Draw walls via continuous chain-clicking (Phase 14a),
 * beams (2 clicks), columns (1 click), or slabs (polygon; double-click /
 * Enter to close). Every tool resolves its working point through the shared
 * `resolveSnapPoint` (src/bim/snapping.ts) instead of ad hoc rounding. World
 * plan coordinates are (x, y) in mm; the SVG y axis is flipped so +Y points up.
 */
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import {
  makeWall,
  makeColumn,
  makeBeam,
  makeSlab,
  makeDoor,
  makeWindow,
  makeSpace,
  type BIMTab,
  type Point2,
  type Wall,
} from "../model/bim";
import { buildSnapCandidates, resolveSnapPoint, type SnapResult } from "./snapping";
import { useChainDraw } from "./chainDraw";

type Tool = "select" | "wall" | "column" | "beam" | "slab" | "door" | "window" | "space";

const SNAP_PIXEL_RADIUS = 12; // screen px — kept constant in screen space across zoom
const MIN_MM_PER_PX = 2;
const MAX_MM_PER_PX = 200;

export function PlanView({ bim, levelId }: { bim: BIMTab; levelId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const addComponent = useStore((s) => s.addComponent);
  const [tool, setTool] = useState<Tool>("wall");
  const [pending, setPending] = useState<Point2[]>([]); // slab polygon in progress
  const [cursor, setCursor] = useState<Point2 | null>(null);
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  // View scale: mm represented by one screen pixel. No pan in this pass —
  // only zoom, which is enough to make the screen-pixel snap radius testable.
  const [mmPerPx, setMmPerPx] = useState(20);

  const levelComps = bim.components.filter((c) => c.levelId === levelId);
  const candidates = buildSnapCandidates(levelComps, bim.grids);

  const wallChain = useChainDraw({
    onCommitSegment: (a, b) => addComponent(makeWall(levelId, a, b)),
    isClosePoint: (p, chainStart) => p.x === chainStart.x && p.y === chainStart.y,
  });

  /** Screen (px, from SVG top-left) → raw world plan point (mm), no snapping. */
  function toWorldRaw(evt: { clientX: number; clientY: number }): Point2 {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    const py = evt.clientY - rect.top;
    // Center origin; flip Y so up is +Y.
    const wx = (px - rect.width / 2) * mmPerPx;
    const wy = -(py - rect.height / 2) * mmPerPx;
    return { x: wx, y: wy };
  }

  /** Screen → world, resolved through the shared snap function unless bypassed (Alt). */
  function toWorld(evt: React.MouseEvent): Point2 {
    const raw = toWorldRaw(evt);
    if (evt.altKey) {
      setSnapResult({ point: raw, snapped: false });
      return raw;
    }
    const result = resolveSnapPoint(raw, candidates, mmPerPx, SNAP_PIXEL_RADIUS);
    setSnapResult(result);
    return result.point;
  }

  /** World plan (mm) → SVG px, for drawing. */
  function toPx(p: Point2, w: number, h: number): { x: number; y: number } {
    return { x: w / 2 + p.x / mmPerPx, y: h / 2 - p.y / mmPerPx };
  }

  function handleWheel(evt: React.WheelEvent) {
    evt.preventDefault();
    const factor = evt.deltaY > 0 ? 1.1 : 1 / 1.1;
    setMmPerPx((z) => Math.min(MAX_MM_PER_PX, Math.max(MIN_MM_PER_PX, z * factor)));
  }

  function handleClick(evt: React.MouseEvent) {
    if (tool === "select") return;
    const p = toWorld(evt);
    if (tool === "column") {
      addComponent(makeColumn(levelId, p));
      return;
    }
    if (tool === "wall") {
      wallChain.click(p);
      return;
    }
    if (tool === "beam") {
      if (pending.length === 0) {
        setPending([p]);
      } else {
        addComponent(makeBeam(levelId, pending[0], p));
        setPending([]);
      }
      return;
    }
    if (tool === "slab") {
      setPending([...pending, p]);
      return;
    }
    if (tool === "door" || tool === "window") {
      // Host the opening on the nearest wall; position = param along the wall.
      const hit = nearestWall(p, levelComps.filter((c): c is Wall => c.type === "wall"));
      if (!hit) return;
      const op = tool === "door"
        ? makeDoor(levelId, hit.wall.id, hit.t)
        : makeWindow(levelId, hit.wall.id, hit.t);
      addComponent(op);
      return;
    }
    if (tool === "space") {
      addComponent(makeSpace(levelId, p));
      return;
    }
  }

  function finishCurrentTool() {
    if (tool === "slab" && pending.length >= 3) {
      addComponent(makeSlab(levelId, pending));
    }
    if (tool === "wall") {
      wallChain.finish();
      return;
    }
    setPending([]);
  }

  // Escape/Enter end the active wall chain. Enter commits the pending
  // segment first; Escape discards it (already-committed segments are
  // untouched either way, since each commit already called addComponent).
  useEffect(() => {
    if (tool !== "wall" || !wallChain.active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        wallChain.cancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        wallChain.finish();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tool, wallChain]);

  function selectTool(t: Tool) {
    // Switching tools mid-chain commits the pending segment first rather
    // than silently discarding it.
    if (tool === "wall") wallChain.finish();
    setPending([]);
    setTool(t);
  }

  // Render dimensions come from the SVG's client box; use a viewBox in px.
  const W = 900;
  const H = 560;

  return (
    <div className="flex h-full flex-col">
      {/* Tool palette */}
      <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-950 px-2 py-1 text-xs">
        {(["select", "wall", "column", "beam", "slab", "door", "window", "space"] as Tool[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => selectTool(t)}
            className={`rounded px-2 py-1 capitalize ${
              tool === t
                ? "bg-emerald-700 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {t}
          </button>
        ))}
        {tool === "slab" && (
          <button
            type="button"
            onClick={finishCurrentTool}
            className="ml-2 rounded bg-blue-700 px-2 py-1 text-white hover:bg-blue-600"
          >
            Finish slab ({pending.length})
          </button>
        )}
        {tool === "wall" && wallChain.active && (
          <span className="ml-2 text-neutral-500">
            chain: {wallChain.points.length} pt{wallChain.points.length === 1 ? "" : "s"} (Esc cancel · Enter/dblclick finish)
          </span>
        )}
        <span className="ml-2 text-neutral-600">alt: no snap · scroll: zoom</span>
        <span className="ml-auto text-neutral-500">
          {cursor ? `(${Math.round(cursor.x)}, ${Math.round(cursor.y)}) mm` : "plan view"}
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="min-h-0 flex-1 bg-neutral-900"
        onClick={handleClick}
        onDoubleClick={finishCurrentTool}
        onWheel={handleWheel}
        onMouseMove={(e) => {
          const p = toWorld(e);
          setCursor(p);
          if (tool === "wall") wallChain.updateCursor(p);
        }}
        onMouseLeave={() => {
          setCursor(null);
          setSnapResult(null);
        }}
      >
        {/* Modular grid */}
        <PlanGrid w={W} h={H} mmPerPx={mmPerPx} />
        {/* Named grid lines */}
        {bim.grids.map((g) => {
          if (g.kind === "x") {
            const { x } = toPx({ x: g.offset, y: 0 }, W, H);
            return <line key={g.id} x1={x} y1={0} x2={x} y2={H} stroke="#3b82f6" strokeDasharray="4 4" />;
          }
          const { y } = toPx({ x: 0, y: g.offset }, W, H);
          return <line key={g.id} x1={0} y1={y} x2={W} y2={y} stroke="#3b82f6" strokeDasharray="4 4" />;
        })}

        {/* Existing components (plan footprints) */}
        {levelComps.map((c) => {
          if (c.type === "wall" || c.type === "beam") {
            const a = toPx(c.start, W, H);
            const b = toPx(c.end, W, H);
            return (
              <line
                key={c.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={c.type === "wall" ? "#e5e0d5" : "#9db0c8"}
                strokeWidth={Math.max(2, (c.type === "wall" ? c.thickness : c.width) / mmPerPx)}
                strokeLinecap="round"
              />
            );
          }
          if (c.type === "column") {
            const p = toPx(c.at, W, H);
            const w = c.width / mmPerPx;
            const d = c.depth / mmPerPx;
            return <rect key={c.id} x={p.x - w / 2} y={p.y - d / 2} width={w} height={d} fill="#c8973b" />;
          }
          if (c.type === "slab") {
            const pts = c.boundary.map((pt) => { const q = toPx(pt, W, H); return `${q.x},${q.y}`; }).join(" ");
            return <polygon key={c.id} points={pts} fill="#9aa0a640" stroke="#9aa0a6" />;
          }
          if (c.type === "door" || c.type === "window") {
            // Draw a marker at the opening's position along its host wall.
            const host = levelComps.find((w) => w.id === c.hostId);
            if (!host || host.type !== "wall") return null;
            const hx = host.start.x + c.position * (host.end.x - host.start.x);
            const hy = host.start.y + c.position * (host.end.y - host.start.y);
            const q = toPx({ x: hx, y: hy }, W, H);
            const color = c.warning ? "#ef4444" : c.type === "door" ? "#6ab04a" : "#4a90d9";
            return (
              <g key={c.id}>
                <circle cx={q.x} cy={q.y} r={5} fill={color} stroke="#000" />
                {c.warning && <title>{c.warning}</title>}
              </g>
            );
          }
          if (c.type === "space") {
            if (c.boundary.length < 3) {
              const q = toPx(c.seed, W, H);
              return <circle key={c.id} cx={q.x} cy={q.y} r={4} fill="#f59e0b60" stroke="#f59e0b" />;
            }
            const pts = c.boundary.map((pt) => { const q = toPx(pt, W, H); return `${q.x},${q.y}`; }).join(" ");
            const seed = toPx(c.seed, W, H);
            return (
              <g key={c.id}>
                <polygon points={pts} fill="#f59e0b22" stroke="#f59e0b" strokeDasharray="6 3" />
                <text x={seed.x} y={seed.y} fill="#f59e0b" fontSize={11} textAnchor="middle">
                  {(c.area / 1e6).toFixed(1)} m²
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* In-progress geometry */}
        {pending.length > 0 && cursor && tool === "beam" && (
          <line
            {...lineProps(toPx(pending[0], W, H), toPx(cursor, W, H))}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        )}
        {tool === "slab" && pending.length > 0 && (
          <polyline
            points={[...pending, ...(cursor ? [cursor] : [])].map((pt) => { const q = toPx(pt, W, H); return `${q.x},${q.y}`; }).join(" ")}
            fill="none"
            stroke="#10b981"
            strokeDasharray="4 4"
          />
        )}

        {/* Wall chain: live preview segment from the last point to the snapped cursor, with a length/angle label. */}
        {tool === "wall" && wallChain.active && wallChain.cursor && (() => {
          const last = wallChain.points[wallChain.points.length - 1];
          const a = toPx(last, W, H);
          const b = toPx(wallChain.cursor, W, H);
          const dx = wallChain.cursor.x - last.x;
          const dy = wallChain.cursor.y - last.y;
          const lengthMm = Math.hypot(dx, dy);
          const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g>
              <line {...lineProps(a, b)} stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              <text x={midX} y={midY - 6} fill="#10b981" fontSize={11} textAnchor="middle">
                {(lengthMm / 1000).toFixed(2)} m · {angleDeg.toFixed(0)}°
              </text>
            </g>
          );
        })()}

        {/* Snap indicator: shown before commit, so a click never surprises the user. */}
        {snapResult?.snapped && cursor && (
          <circle
            {...toPx(snapResult.point, W, H)}
            r={6}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2}
          />
        )}
      </svg>
    </div>
  );
}

function lineProps(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

/**
 * Find the wall whose centerline is nearest to point p, returning it plus the
 * clamped parameter t (0..1) of the closest point along it. null if no walls.
 */
function nearestWall(
  p: Point2,
  walls: Wall[],
): { wall: Wall; t: number; dist: number } | null {
  let best: { wall: Wall; t: number; dist: number } | null = null;
  for (const w of walls) {
    const dx = w.end.x - w.start.x;
    const dy = w.end.y - w.start.y;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((p.x - w.start.x) * dx + (p.y - w.start.y) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = w.start.x + t * dx;
    const cy = w.start.y + t * dy;
    const dist = Math.hypot(p.x - cx, p.y - cy);
    if (!best || dist < best.dist) best = { wall: w, t, dist };
  }
  return best;
}

/** Static modular grid lines behind the plan (visual aid only — not a snap candidate, see snapping.ts). */
function PlanGrid({ w, h, mmPerPx }: { w: number; h: number; mmPerPx: number }) {
  const step = 1000 / mmPerPx; // 1m grid
  const lines: React.ReactNode[] = [];
  for (let x = w / 2; x < w; x += step) {
    lines.push(<line key={`x+${x}`} x1={x} y1={0} x2={x} y2={h} stroke="#2a2a2a" />);
    const mx = w - x;
    lines.push(<line key={`x-${mx}`} x1={mx} y1={0} x2={mx} y2={h} stroke="#2a2a2a" />);
  }
  for (let y = h / 2; y < h; y += step) {
    lines.push(<line key={`y+${y}`} x1={0} y1={y} x2={w} y2={y} stroke="#2a2a2a" />);
    const my = h - y;
    lines.push(<line key={`y-${my}`} x1={0} y1={my} x2={w} y2={my} stroke="#2a2a2a" />);
  }
  return <g>{lines}</g>;
}
