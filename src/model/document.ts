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

/** A single Part Studio tab: an independent feature tree + version history. */
export interface PartStudio {
  id: string;
  name: string;
  tree: FeatureTree;
  /** Per-tab append-only version timeline (architecture req #7). */
  history: VersionHistory;
}

/** The top-level document: an ordered list of Part Studio tabs. */
export interface CADDocument {
  id: string;
  name: string;
  tabs: PartStudio[];
  /** Id of the currently active tab. Always references a tab in `tabs`. */
  activeTabId: string;
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
  };
}

/** Create a fresh document with one empty Part Studio. */
export function makeDocument(name = "Untitled"): CADDocument {
  const tab = makePartStudio("Part Studio 1");
  return {
    id: newFeatureId(),
    name,
    tabs: [tab],
    activeTabId: tab.id,
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
    }));
    return { ...(r as unknown as CADDocument), tabs };
  }
  // v1 single-tree document → wrap in one Part Studio.
  const tree = (r?.tree as FeatureTree | undefined) ?? { features: [] };
  const tab: PartStudio = {
    id: newFeatureId(),
    name: "Part Studio 1",
    tree,
    history: emptyHistory(),
  };
  return {
    id: (r?.id as string) ?? newFeatureId(),
    name: (r?.name as string) ?? "Untitled",
    tabs: [tab],
    activeTabId: tab.id,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
  };
}
