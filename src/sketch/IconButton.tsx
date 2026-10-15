/**
 * Icon-only toolbar button with a CSS tooltip.
 *
 * The tooltip is purely visual (aria-hidden); the accessible name comes from
 * `aria-label`, so screen readers and keyboard users don't depend on it.
 * It shows on :hover and :focus-visible via Tailwind's `group-*` variants,
 * so no extra React state is involved.
 */
import type { ReactNode } from "react";

export function IconButton({
  label,
  active = false,
  danger = false,
  tooltipSide = "top",
  onClick,
  children,
}: {
  /** Accessible name + tooltip text. */
  label: string;
  /** Currently selected tool → accent-filled state. */
  active?: boolean;
  /** Destructive action → red-tinted hover. */
  danger?: boolean;
  /**
   * Which side the tooltip appears on. The top toolbar row sits at the very
   * top of the viewport in sketch mode, so its tooltips flip below instead of
   * being clipped.
   */
  tooltipSide?: "top" | "bottom";
  onClick: () => void;
  children: ReactNode;
}) {
  const state = active
    ? "bg-blue-600 text-white"
    : danger
      ? "text-neutral-400 hover:bg-red-900/60 hover:text-red-200"
      : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100";

  const place =
    tooltipSide === "top"
      ? "bottom-full mb-2 after:top-full after:border-t-neutral-950"
      : "top-full mt-2 after:bottom-full after:border-b-neutral-950";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active || undefined}
      onClick={onClick}
      className={`group relative flex h-8 w-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${state}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-neutral-100 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 after:absolute after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:content-[''] ${place}`}
      >
        {label}
      </span>
    </button>
  );
}
