/**
 * Version history (architecture req #7): a linear, restorable timeline per Part
 * Studio, stored as an append-only TREE of snapshots.
 *
 * Why a tree when the UI only shows a linear path today: the brief asks us to
 * structure the data so branching can be added later (Phase 11+) without a
 * rewrite. Each VersionNode has a `parentId`; today every node's parent is the
 * previous head, so the tree is a straight line — but restore-as-fork can
 * create siblings, and nothing is ever deleted.
 *
 * Restore semantics (non-destructive): restoring an old version does NOT rewind
 * or overwrite. It appends a NEW node whose snapshot equals the old one and
 * whose parent is the old node — a fork. The workspace then continues from
 * there. The original timeline stays intact and browsable.
 *
 * Everything is plain-JSON serializable and persists inside the PartStudio.
 */
import type { FeatureTree } from "./featureTree";

export interface VersionNode {
  id: string;
  /** Display name, e.g. "V1". Auto-incrementing, user-renamable. */
  name: string;
  /** Parent version id, or null for the initial root. */
  parentId: string | null;
  /** Immutable feature-tree snapshot captured at creation. */
  snapshot: FeatureTree;
  /** Wall-clock creation time (ms). Stamped by the caller (main thread). */
  createdAt: number;
}

/**
 * A Part Studio's version history: the set of snapshot nodes plus the id of the
 * node the live workspace currently descends from (the "head"). New versions
 * are created as children of `headId`.
 */
export interface VersionHistory {
  nodes: VersionNode[];
  /** The version the current working tree was last committed from/at. */
  headId: string | null;
}

export function emptyHistory(): VersionHistory {
  return { nodes: [], headId: null };
}

/** The linear path from root to head, oldest first (what the UI displays). */
export function linearize(history: VersionHistory): VersionNode[] {
  const byId = new Map(history.nodes.map((n) => [n.id, n]));
  // Walk parent links from head back to root, then reverse.
  const path: VersionNode[] = [];
  let cur = history.headId ? byId.get(history.headId) : undefined;
  const seen = new Set<string>();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    path.push(cur);
    cur = cur.parentId ? byId.get(cur.parentId) : undefined;
  }
  return path.reverse();
}

/** Next auto-name like "V1", "V2" based on how many nodes exist. */
export function nextVersionName(history: VersionHistory): string {
  return `V${history.nodes.length + 1}`;
}
