/**
 * Icon registry for the sketch toolbar + constraint palette.
 *
 * Every icon is drawn on a 20×20 grid using `currentColor`, so the button
 * wrapper controls color (default / hover / active). Stroke width and caps are
 * set once on the <svg> below; change them here to restyle the whole set.
 * Filled marks (endpoint dots, Select's cursor, constraint accents) opt in via
 * the `DOT` / `FILL` props.
 */
import type { ReactNode } from "react";
import type { SketchTool } from "./sketchStore";
import type { ConstraintType } from "../model/sketch";

export type ToolIconName = SketchTool | ConstraintType | "fillet" | "mirror" | "delete";

const FILL = { fill: "currentColor", stroke: "none" } as const;
const DASH = { strokeDasharray: "2 2" } as const;

const dot = (cx: number, cy: number, r = 1.6) => <circle cx={cx} cy={cy} r={r} {...FILL} />;

const ICONS: Record<ToolIconName, ReactNode> = {
  // ---- Drawing tools ----
  select: <path d="M5 2.5V16l3.6-3.4 2.5 5 2.1-1-2.5-5h5Z" {...FILL} />,
  line: (
    <>
      <path d="M4.5 15.5 15.5 4.5" />
      {dot(4.5, 15.5)}
      {dot(15.5, 4.5)}
    </>
  ),
  rectangle: <rect x="3" y="5" width="14" height="10" rx="2" />,
  circle: <circle cx="10" cy="10" r="6.5" />,
  arc: (
    <>
      <path d="M3.5 14a6.5 6.5 0 0 1 13 0" />
      {dot(3.5, 14)}
      {dot(16.5, 14)}
    </>
  ),
  polygon: <path d="M17 10l-3.5 6.06h-7L3 10l3.5-6.06h7Z" />,
  slot: <rect x="2.5" y="6.5" width="15" height="7" rx="3.5" />,
  ellipse: <ellipse cx="10" cy="10" rx="7.5" ry="4.5" />,
  spline: <path d="M2.5 12C5 4 8 5 10 10s5 6 7.5-2" />,

  // ---- Edit tools ----
  fillet: (
    <>
      <path d="M4 9v7h7" strokeWidth={1.25} opacity="0.7" {...DASH} />
      <path d="M4 3.5V9a7 7 0 0 0 7 7h5.5" />
    </>
  ),
  mirror: (
    <>
      <path d="M10 2.5v15" {...DASH} />
      <path d="M3 6l5 4-5 4Z" {...FILL} />
      <path d="M17 6l-5 4 5 4Z" {...FILL} />
    </>
  ),
  delete: <path d="M3.5 5.5h13M8 5.5v-2h4v2M5 5.5 6 17h8l1-11.5M8.5 8.5V14M11.5 8.5V14" />,

  // ---- Constraints ----
  // Two same-color dots would merge into one blob, so the back one is dimmed.
  coincident: (
    <>
      <circle cx="7.5" cy="10" r="3.5" {...FILL} opacity="0.5" />
      <circle cx="12.5" cy="10" r="3.5" {...FILL} />
    </>
  ),
  horizontal: <path d="M3 10h14M3 7v6M17 7v6" />,
  vertical: <path d="M10 3v14M7 3h6M7 17h6" />,
  parallel: <path d="M4 13 11 4M9 16l7-9" />,
  perpendicular: <path d="M4 3v13h13M4 12h4v4" />,
  equalLength: <path d="M3 7h14M3 13h14M7.5 5l1.5 4M11 5l1.5 4M7.5 11l1.5 4M11 11l1.5 4" />,
  concentric: (
    <>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.5" />
    </>
  ),
  midpoint: (
    <>
      <path d="M3 10h14" />
      <path d="M10 7.5 12.5 10 10 12.5 7.5 10Z" {...FILL} />
    </>
  ),
  symmetric: (
    <>
      <path d="M10 2.5v15" {...DASH} />
      {dot(5, 10, 1.8)}
      {dot(15, 10, 1.8)}
    </>
  ),
  tangent: (
    <>
      <circle cx="10" cy="11.5" r="5.5" />
      <path d="M2 6h16" />
    </>
  ),
  // Dimension-line style: arrowheads only, no extension lines (kept simple at 18px).
  distance: <path d="M3 10h14M6 7l-3 3 3 3M14 7l3 3-3 3" />,
  angle: (
    <>
      <path d="M13 4 4 16h13" />
      <path d="M11 16a7 7 0 0 0-2.8-5.6" />
    </>
  ),
  radius: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 10l4.95-4.95" />
      {dot(10, 10)}
    </>
  ),
};

export function ToolIcon({ name, size = 18 }: { name: ToolIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
