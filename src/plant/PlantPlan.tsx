/**
 * Plan view for a plant tab: top-down routing and equipment placement.
 *
 * Pipe is placed by continuous clicks; each click snaps to an open port within
 * range, otherwise to the nearest 90° axis from the previous point. A double
 * click (or Enter) finishes the run. Equipment is a single click. World plan
 * coordinates are (x, y) in mm; the SVG y axis is flipped so +Y points up.
 */
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { openPorts, type PlantTab, type Vec3 } from "../model/plant";

type Tool = "route" | "equipment";

const MM_PER_PX = 20;
const PORT_SNAP_MM = 300;

export function PlantPlan({ plant }: { plant: PlantTab }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const routeLine = useStore((s) => s.routeLine);
  const createLine = useStore((s) => s.createLine);
  const placeEquipment = useStore((s) => s.placeEquipment);
  const [tool, setTool] = useState<Tool>("route");
  const [chain, setChain] = useState<Vec3[]>([]);
  const [cursor, setCursor] = useState<Vec3 | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const line = plant.lines.find((l) => l.id === plant.context.activeLineId) ?? null;
  const ports = line ? openPorts(line) : [];

  /** Screen → world plan point, snapped to a port or to the 90° axis. */
  function toWorld(evt: React.MouseEvent): Vec3 {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const raw = {
      x: (evt.clientX - rect.left - rect.width / 2) * MM_PER_PX,
      y: -(evt.clientY - rect.top - rect.height / 2) * MM_PER_PX,
      z: 0,
    };
    const port = nearestPort(raw, ports);
    if (port) return { ...port.port.position };
    const prev = chain[chain.length - 1];
    if (!prev || evt.shiftKey) return raw;
    return axisLock(prev, raw);
  }

  function finish() {
    if (chain.length < 2) {
      setChain([]);
      return;
    }
    const target = line?.id ?? createLine(`Line ${plant.lines.length + 1}`) ?? undefined;
    if (!target) return;
    const result = routeLine(chain, target, { joinExisting: true });
    setNotice(result.ok ? null : (result.error ?? "route rejected"));
    setChain([]);
  }

  function onClick(evt: React.MouseEvent) {
    if (evt.detail > 1) return; // the double-click handler finishes the run
    const point = toWorld(evt);
    if (tool === "equipment") {
      const n = plant.equipment.length + 1;
      placeEquipment(`V-${n}`, "vessel", point);
      return;
    }
    setChain((c) => [...c, point]);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") finish();
      if (e.key === "Escape") setChain([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // finish closes over the chain; rebinding per change is cheap here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, line]);

  const w = 800;
  const h = 600;
  const px = (p: Vec3) => ({ x: w / 2 + p.x / MM_PER_PX, y: h / 2 - p.y / MM_PER_PX });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-neutral-800 px-2 py-1">
        {(["route", "equipment"] as Tool[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTool(t)}
            className={`rounded px-2 py-1 text-[11px] ${
              tool === t ? "bg-orange-700 text-white" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {t === "route" ? "Route pipe" : "Equipment"}
          </button>
        ))}
        {tool === "route" && (
          <button
            type="button"
            onClick={finish}
            className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
          >
            Finish
          </button>
        )}
        <span className="ml-2 text-[11px] text-neutral-500">
          {line ? `${line.name} · DN${line.nps}` : "a line is created on the first run"}
        </span>
        {notice && <span className="ml-2 text-[11px] text-amber-400">{notice}</span>}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="h-full w-full bg-neutral-950"
        onClick={onClick}
        onDoubleClick={finish}
        onMouseMove={(e) => tool === "route" && setCursor(toWorld(e))}
      >
        {plant.lines.flatMap((l) =>
          l.runs
            .filter((r) => r.kind === "straight" && r.ports.length >= 2)
            .map((r) => {
              const a = px(r.ports[0].position);
              const b = px(r.ports[1].position);
              return <line key={r.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#d97706" strokeWidth={3} />;
            }),
        )}
        {ports.map((p) => {
          const c = px(p.port.position);
          return <circle key={p.port.id} cx={c.x} cy={c.y} r={4} fill="#ef4444" />;
        })}
        {plant.equipment.map((e) => {
          const c = px(e.origin);
          const r = e.diameter / 2 / MM_PER_PX;
          return <circle key={e.id} cx={c.x} cy={c.y} r={r} fill="none" stroke="#38bdf8" strokeWidth={1.5} />;
        })}
        {chain.map((p, i) => {
          const c = px(p);
          const prev = i > 0 ? px(chain[i - 1]) : null;
          return (
            <g key={i}>
              {prev && <line x1={prev.x} y1={prev.y} x2={c.x} y2={c.y} stroke="#fdba74" strokeDasharray="4 3" />}
              <circle cx={c.x} cy={c.y} r={3} fill="#fdba74" />
            </g>
          );
        })}
        {cursor && chain.length > 0 && (
          <line
            x1={px(chain[chain.length - 1]).x}
            y1={px(chain[chain.length - 1]).y}
            x2={px(cursor).x}
            y2={px(cursor).y}
            stroke="#78716c"
            strokeDasharray="2 3"
          />
        )}
      </svg>
    </div>
  );
}

/** The open port closest to `point`, within the snap radius. */
function nearestPort(
  point: Vec3,
  ports: ReturnType<typeof openPorts>,
): ReturnType<typeof openPorts>[number] | null {
  let best: ReturnType<typeof openPorts>[number] | null = null;
  let bestDist = PORT_SNAP_MM;
  for (const port of ports) {
    const d = Math.hypot(port.port.position.x - point.x, port.port.position.y - point.y);
    if (d < bestDist) {
      best = port;
      bestDist = d;
    }
  }
  return best;
}

/** Project `point` onto the dominant axis through `from` (90° lock). */
function axisLock(from: Vec3, point: Vec3): Vec3 {
  const dx = point.x - from.x;
  const dy = point.y - from.y;
  return Math.abs(dx) >= Math.abs(dy)
    ? { x: point.x, y: from.y, z: from.z }
    : { x: from.x, y: point.y, z: from.z };
}
