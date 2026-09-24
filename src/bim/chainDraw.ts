/**
 * Generic continuous-chain drawing interaction (Phase 14a): click to start,
 * click again to commit a segment and continue from that point, repeat.
 * Used by the Wall tool today; written with no Wall-specific logic so
 * Grid-line or Space-boundary tracing can adopt it later without a rewrite.
 *
 * The caller owns what a "segment" means (e.g. turning two points into a
 * `makeWall` + `addComponent` call) via `onCommitSegment` — this hook only
 * tracks the interaction state machine (idle -> active -> ... -> idle).
 */
import { useCallback, useState } from "react";
import type { Point2 } from "../model/bim";

export interface UseChainDrawOptions {
  onCommitSegment: (a: Point2, b: Point2) => void;
  /** True if `b` should be treated as "clicking back on the chain's start" (closes the loop). */
  isClosePoint: (a: Point2, chainStart: Point2) => boolean;
}

export interface ChainDrawState {
  /** Points committed so far in the current chain (empty when idle). */
  points: Point2[];
  /** Latest snapped cursor position, for the live preview segment. */
  cursor: Point2 | null;
  active: boolean;
  /** Click handler: starts the chain, commits a segment, or closes the loop. */
  click: (p: Point2) => void;
  /** Mousemove handler: updates the live preview point. */
  updateCursor: (p: Point2 | null) => void;
  /** Escape: discard the in-progress segment and end the chain (keeps committed segments, since those already fired onCommitSegment). */
  cancel: () => void;
  /** Enter / double-click / tool-switch: commit the pending segment (if a cursor point exists) then end the chain. */
  finish: () => void;
}

export function useChainDraw({ onCommitSegment, isClosePoint }: UseChainDrawOptions): ChainDrawState {
  const [points, setPoints] = useState<Point2[]>([]);
  const [cursor, setCursor] = useState<Point2 | null>(null);

  const click = useCallback(
    (p: Point2) => {
      setPoints((prev) => {
        if (prev.length === 0) return [p];
        const last = prev[prev.length - 1];
        // Guard against a degenerate zero-length segment — this is what the
        // browser's synthetic second `click` looks like just before
        // `dblclick` fires, since both land at the same point. Treat it as a
        // no-op; the dblclick handler's `finish()` ends the chain cleanly.
        if (last.x === p.x && last.y === p.y) return prev;
        if (prev.length > 1 && isClosePoint(p, prev[0])) {
          onCommitSegment(last, prev[0]);
          return [];
        }
        onCommitSegment(last, p);
        return [...prev, p];
      });
    },
    [onCommitSegment, isClosePoint],
  );

  const updateCursor = useCallback((p: Point2 | null) => setCursor(p), []);

  const cancel = useCallback(() => {
    setPoints([]);
    setCursor(null);
  }, []);

  const finish = useCallback(() => {
    setPoints((prev) => {
      const last = prev[prev.length - 1];
      // Skip a zero-length final segment (e.g. double-click: the cursor
      // hasn't moved since the last commit) rather than adding a degenerate wall.
      if (last && cursor && (cursor.x !== last.x || cursor.y !== last.y)) {
        onCommitSegment(last, cursor);
      }
      return [];
    });
    setCursor(null);
  }, [cursor, onCommitSegment]);

  return { points, cursor, active: points.length > 0, click, updateCursor, cancel, finish };
}
