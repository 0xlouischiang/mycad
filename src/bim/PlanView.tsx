/**
 * Plan view (Phase 14): a top-down 2D SVG canvas for authoring BIM components
 * on the active level. Draw walls/beams (2 clicks), columns (1 click), or slabs
 * (polygon; double-click / Enter to close). Points snap to grid lines and to a
 * coarse modular grid. World plan coordinates are (x, y) in mm; the SVG y axis
 * is flipped so +Y points up.
 */
import { useRef, useState } from "react";
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

type Tool = "select" | "wall" | "column" | "beam" | "slab" | "door" | "window" | "space";

const SNAP = 500; // coarse modular snap, mm
const MM_PER_PX = 20; // view scale: 20 mm per screen px → 1000mm = 50px

export function PlanView({ bim, levelId }: { bim: BIMTab; levelId: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const addComponent = useStore((s) => s.addComponent);
  const [tool, setTool] = useState<Tool>("wall");
  const [pending, setPending] = useState<Point2[]>([]);
  const [cursor, setCursor] = useState<Point2 | null>(null);

  const levelComps = bim.components.filter((c) => c.levelId === levelId);

  /** Screen (px, from SVG top-left) → snapped world plan point (mm). */
  function toWorld(evt: React.MouseEvent): Point2 {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    const py = evt.clientY - rect.top;
    // Center origin; flip Y so up is +Y.
    const wx = (px - rect.width / 2) * MM_PER_PX;
    const wy = -(py - rect.height / 2) * MM_PER_PX;
    return snap({ x: wx, y: wy });
  }

  function snap(p: Point2): Point2 {
    // Snap to grid-line offsets first, else to the modular grid.
    let x = Math.round(p.x / SNAP) * SNAP;
    let y = Math.round(p.y / SNAP) * SNAP;
    for (const g of bim.grids) {
      if (g.kind === "x" && Math.abs(p.x - g.offset) < SNAP) x = g.offset;
      if (g.kind === "y" && Math.abs(p.y - g.offset) < SNAP) y = g.offset;
    }
    return { x, y };
  }

  /** World plan (mm) → SVG px, for drawing. */
  function toPx(p: Point2, w: number, h: number): { x: number; y: number } {
    return { x: w / 2 + p.x / MM_PER_PX, y: h / 2 - p.y / MM_PER_PX };
  }

  function handleClick(evt: React.MouseEvent) {
    if (tool === "select") return;
    const p = toWorld(evt);
    if (tool === "column") {
      addComponent(makeColumn(levelId, p));
      return;
    }
    if (tool === "wall" || tool === "beam") {
      if (pending.length === 0) {
        setPending([p]);
      } else {
        const a = pending[0];
        if (tool === "wall") addComponent(makeWall(levelId, a, p));
        else addComponent(makeBeam(levelId, a, p));
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

  function finishSlab() {
    if (tool === "slab" && pending.length >= 3) {
      addComponent(makeSlab(levelId, pending));
    }
    setPending([]);
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
            onClick={() => {
              setTool(t);
              setPending([]);
            }}
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
            onClick={finishSlab}
            className="ml-2 rounded bg-blue-700 px-2 py-1 text-white hover:bg-blue-600"
          >
            Finish slab ({pending.length})
          </button>
        )}
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
        onDoubleClick={finishSlab}
        onMouseMove={(e) => setCursor(toWorld(e))}
        onMouseLeave={() => setCursor(null)}
      >
        {/* Modular grid */}
        <PlanGrid w={W} h={H} />
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
                strokeWidth={Math.max(2, (c.type === "wall" ? c.thickness : c.width) / MM_PER_PX)}
                strokeLinecap="round"
              />
            );
          }
          if (c.type === "column") {
            const p = toPx(c.at, W, H);
            const w = c.width / MM_PER_PX;
            const d = c.depth / MM_PER_PX;
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
        {pending.length > 0 && cursor && (tool === "wall" || tool === "beam") && (
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

/** Static modular grid lines behind the plan. */
function PlanGrid({ w, h }: { w: number; h: number }) {
  const step = 1000 / MM_PER_PX; // 1m grid
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
