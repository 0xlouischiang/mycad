/**
 * Bounded BIM context for the natural-language BIM loop (Phase 16).
 *
 * A building's component count doesn't fit the model context the way a part's
 * feature tree does (arch req #11), so we do NOT reuse Phase 13's full-tree
 * summarization. Instead we summarize, capped in size:
 *   - the level list (ids + elevations) so the model can target a storey;
 *   - the ACTIVE level's components with their key params + a spatial reference
 *     (walls by endpoint coordinates, so "the north wall" resolves by position);
 *   - named space adjacency (which spaces touch which walls) on the level.
 *
 * Pure (no store/DOM); the store handle is read at call time in the loop config.
 */
import type { StoreHandle } from "./registry";
import type {
  BIMTab,
  BuildingComponent,
  Wall,
} from "../model/bim";

const MAX_COMPONENTS = 60; // hard cap on listed components per state block

/** The active BIM tab + a chosen "active level" (first level by default). */
function activeContext(store: StoreHandle): { bim: BIMTab; levelId: string } | null {
  const s = store.getState();
  const bim = s.doc.bims.find((b) => b.id === s.activeBimId);
  if (!bim) return null;
  const levelId = bim.levels[0]?.id ?? "";
  return { bim, levelId };
}

function describeComponent(c: BuildingComponent): string {
  switch (c.type) {
    case "wall":
      return `wall id=${c.id} from(${c.start.x},${c.start.y}) to(${c.end.x},${c.end.y}) thick=${c.thickness} height=${c.height}`;
    case "slab":
      return `slab id=${c.id} pts=${c.boundary.length} thick=${c.thickness}`;
    case "column":
      return `column id=${c.id} at(${c.at.x},${c.at.y}) ${c.width}x${c.depth}x${c.height}`;
    case "beam":
      return `beam id=${c.id} from(${c.start.x},${c.start.y}) to(${c.end.x},${c.end.y}) ${c.width}x${c.depth}`;
    case "door":
      return `door id=${c.id} host=${c.hostId} pos=${c.position} ${c.width}x${c.height}${c.warning ? " WARNING:" + c.warning : ""}`;
    case "window":
      return `window id=${c.id} host=${c.hostId} pos=${c.position} ${c.width}x${c.height}${c.warning ? " WARNING:" + c.warning : ""}`;
    case "space":
      return `space id=${c.id} area=${Math.round(c.area)}mm² walls=${c.boundaryWallIds.length}${c.warning ? " WARNING:" + c.warning : ""}`;
  }
}

/**
 * Build the bounded state block for the active BIM tab + level. Capped at
 * MAX_COMPONENTS listed components; a trailing note reports any truncation so
 * the omission is explicit rather than silent.
 */
export function buildBimStateBlock(store: StoreHandle): string {
  const ctx = activeContext(store);
  if (!ctx) return "No active BIM tab.";
  const { bim, levelId } = ctx;

  const levelsText = bim.levels
    .map((l) => `id=${l.id} "${l.name}" elev=${l.elevation} height=${l.height}${l.id === levelId ? " (ACTIVE)" : ""}`)
    .join("\n");

  const onLevel = bim.components.filter((c) => c.levelId === levelId);
  const shown = onLevel.slice(0, MAX_COMPONENTS);
  const compText = shown.map(describeComponent).join("\n") || "(no components on this level yet)";
  const truncated =
    onLevel.length > shown.length
      ? `\n… (${onLevel.length - shown.length} more components omitted — ask to focus on an area)`
      : "";

  // Space adjacency: which walls bound each space on this level.
  const spaces = onLevel.filter((c) => c.type === "space");
  const adjacency =
    spaces.length > 0
      ? "\nSPACE ADJACENCY:\n" +
        spaces
          .map((s) => `space ${s.id} bounded by walls [${(s as { boundaryWallIds: string[] }).boundaryWallIds.join(", ")}]`)
          .join("\n")
      : "";

  const grids = bim.grids.map((g) => `${g.label}: ${g.kind}=${g.offset}`).join(", ") || "(none)";

  return (
    `LEVELS:\n${levelsText}\n\n` +
    `GRID LINES: ${grids}\n\n` +
    `COMPONENTS on the active level (id=${levelId}):\n${compText}${truncated}${adjacency}`
  );
}

/** Wall id → cardinal-ish hint, so the model can resolve "the north wall". */
export function wallOrientationHints(walls: Wall[]): Record<string, string> {
  const hints: Record<string, string> = {};
  for (const w of walls) {
    const dx = w.end.x - w.start.x;
    const dy = w.end.y - w.start.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const midY = (w.start.y + w.end.y) / 2;
    const midX = (w.start.x + w.end.x) / 2;
    hints[w.id] = horizontal
      ? midY >= 0 ? "north-ish" : "south-ish"
      : midX >= 0 ? "east-ish" : "west-ish";
  }
  return hints;
}
