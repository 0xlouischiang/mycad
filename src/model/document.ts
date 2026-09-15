/**
 * Document → tabs → Part Studio container model (architecture req #6).
 *
 * Modeled on Onshape rather than "one file = one part":
 *   - A Document is the top-level container. It holds one or more tabs.
 *   - Each tab is a Part Studio: an independent feature-tree workspace that can
 *     output MULTIPLE solid bodies (a single tree can terminate in N bodies).
 *   - Assemblies/Drawings are out of scope, but the tab concept leaves room.
 *
 * Why this matters even before multi-document linking: it determines how the
 * feature tree, undo/redo scope, and persistence are keyed — PER-TAB, not
 * per-file. The store holds one Document and an active tab id; all editing,
 * undo history, and selection are scoped to the active Part Studio.
 *
 * Everything is plain-JSON serializable so a whole Document persists to
 * IndexedDB in one record.
 */
import type { FeatureTree } from "./featureTree";
import { newFeatureId } from "./featureTree";
import { emptyHistory, type VersionHistory } from "./version";
import { evalExpr, type VarScope } from "./expr";
import type { RobotTab } from "./robot";

/**
 * A named variable local to a Part Studio. `expression` is an expr.ts string
 * that may reference earlier variables (evaluated in definition order).
 */
export interface Variable {
  id: string;
  name: string;
  expression: string;
}

/**
 * A named configuration: a set of variable-value overrides that produce a
 * parametric variant of the Part Studio (Onshape's Configurations). When a
 * configuration is active, its `overrides` replace the matching variables'
 * evaluated values in the scope used for regeneration.
 */
export interface Configuration {
  id: string;
  name: string;
  /** Variable name → override value. Only listed variables are overridden. */
  overrides: Record<string, number>;
}

/** A single Part Studio tab: an independent feature tree + version history. */
export interface PartStudio {
  id: string;
  name: string;
  tree: FeatureTree;
  /** Per-tab append-only version timeline (architecture req #7). */
  history: VersionHistory;
  /** Per-tab named variables usable in feature dimension expressions. */
  variables: Variable[];
  /** Named parametric variants (variable-override sets). */
  configurations: Configuration[];
  /** Active configuration id, or null for the base (no overrides). */
  activeConfigId: string | null;
  /**
   * Rollback bar position: only features with index < rollbackIndex are
   * evaluated during regeneration; the rest are "rolled back" (kept but
   * inactive). Defaults to the feature count (bar at the end = all active).
   * A value >= feature count means no rollback.
   */
  rollbackIndex: number;
}

/** The top-level document: Part Studio tabs plus (additive) Robot tabs. */
export interface CADDocument {
  id: string;
  name: string;
  tabs: PartStudio[];
  /**
   * Robot tabs (Phase 12) — an additive kinematic layer that references Part
   * Studio bodies by id. Kept as a separate list rather than folding into
   * `tabs` so the Part Studio code path is untouched.
   */
  robots: RobotTab[];
  /** Id of the currently active tab. Always references a tab in `tabs`. */
  activeTabId: string;
  /** Active robot tab id when a robot tab is focused, else null. */
  activeRobotId: string | null;
  /** Bumped when the persisted shape changes, for migration. */
  schemaVersion: number;
}

/** Current document schema version. */
export const DOCUMENT_SCHEMA_VERSION = 2;

export function makePartStudio(name: string): PartStudio {
  return {
    id: newFeatureId(),
    name,
    tree: { features: [] },
    history: emptyHistory(),
    variables: [],
    configurations: [],
    activeConfigId: null,
    rollbackIndex: Number.MAX_SAFE_INTEGER, // bar at end → all features active
  };
}

/** Create a fresh document with one empty Part Studio. */
export function makeDocument(name = "Untitled"): CADDocument {
  const tab = makePartStudio("Part Studio 1");
  return {
    id: newFeatureId(),
    name,
    tabs: [tab],
    robots: [],
    activeTabId: tab.id,
    activeRobotId: null,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
  };
}

/** Get the active Part Studio, falling back to the first tab. */
export function activeStudio(doc: CADDocument): PartStudio {
  return doc.tabs.find((t) => t.id === doc.activeTabId) ?? doc.tabs[0];
}

/**
 * Migrate a persisted record of unknown/old shape into a CADDocument.
 * v1 stored a bare { id, name, tree } (single tree, pre-tabs). We wrap it in a
 * one-tab document so old saves keep opening.
 */
export function migrateToDocument(raw: unknown): CADDocument {
  const r = raw as Record<string, unknown>;
  // Already a v2 document — but backfill any tab missing `history` (added in a
  // later revision) so version-history code can assume it exists.
  if (r && Array.isArray(r.tabs) && typeof r.activeTabId === "string") {
    const tabs = (r.tabs as PartStudio[]).map((t) => ({
      ...t,
      history: t.history ?? emptyHistory(),
      variables: t.variables ?? [],
      configurations: t.configurations ?? [],
      activeConfigId: t.activeConfigId ?? null,
      rollbackIndex: t.rollbackIndex ?? Number.MAX_SAFE_INTEGER,
    }));
    return {
      ...(r as unknown as CADDocument),
      tabs,
      robots: (r.robots as RobotTab[] | undefined) ?? [],
      activeRobotId: (r.activeRobotId as string | null | undefined) ?? null,
    };
  }
  // v1 single-tree document → wrap in one Part Studio.
  const tree = (r?.tree as FeatureTree | undefined) ?? { features: [] };
  const tab: PartStudio = {
    id: newFeatureId(),
    name: "Part Studio 1",
    tree,
    history: emptyHistory(),
    variables: [],
    configurations: [],
    activeConfigId: null,
    rollbackIndex: Number.MAX_SAFE_INTEGER,
  };
  return {
    id: (r?.id as string) ?? newFeatureId(),
    name: (r?.name as string) ?? "Untitled",
    tabs: [tab],
    robots: [],
    activeTabId: tab.id,
    activeRobotId: null,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
  };
}

/**
 * Evaluate a Part Studio's variables in definition order into a name→value
 * scope. Each variable may reference earlier ones. A variable whose expression
 * fails (bad syntax / unknown ref) is skipped (omitted from scope) rather than
 * throwing, so one bad variable doesn't break the whole regeneration; the UI
 * surfaces which variables are invalid separately.
 */
export function resolveVariableScope(
  variables: Variable[],
  overrides?: Record<string, number>,
): VarScope {
  const scope: VarScope = {};
  for (const v of variables) {
    if (!v.name) continue;
    // A configuration override replaces the variable's evaluated value, but
    // still participates as a scope entry that later variables can reference.
    if (overrides && v.name in overrides) {
      scope[v.name] = overrides[v.name];
      continue;
    }
    try {
      scope[v.name] = evalExpr(v.expression, scope);
    } catch {
      // Leave unresolved; downstream expressions referencing it will fail too.
    }
  }
  return scope;
}

/** The active configuration's overrides for a Part Studio, or empty. */
export function activeConfigOverrides(
  studio: PartStudio,
): Record<string, number> {
  const cfg = studio.configurations.find((c) => c.id === studio.activeConfigId);
  return cfg?.overrides ?? {};
}
