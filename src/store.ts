/**
 * Global app store (Zustand).
 *
 * The feature tree is the single source of truth. The 3D scene, the tree
 * panel, and the parameter editor are all derived views of it. Every mutation
 * goes through an action that updates the tree and schedules a (debounced)
 * regeneration; the worker returns the derived mesh + per-feature status.
 */
import { create } from "zustand";
import { KernelClient } from "./kernel/client";
import type { FeatureStatus, RegenResult, ShapeResult } from "./kernel/protocol";
import {
  makeChamferFeature,
  makeCircularPatternFeature,
  makeDefaultFeature,
  makeExtrudeFeature,
  makeRevolveFeature,
  makeFilletFeature,
  makeLinearPatternFeature,
  makeLinkedFeature,
  makeMirrorFeature,
  makeSketchFeature,
  type BooleanOperation,
  type Feature,
  type FeatureTree,
} from "./model/featureTree";
import type { Sketch } from "./model/sketch";
import type { EdgeRef } from "./model/edgeRef";
import {
  activeStudio,
  makeDocument,
  makePartStudio,
  type CADDocument,
  type PartStudio,
} from "./model/document";
import {
  nextVersionName,
  type VersionHistory,
  type VersionNode,
} from "./model/version";
import { newFeatureId } from "./model/featureTree";
import { saveDocument, loadDocument, listDocuments } from "./persistence/db";

/**
 * The viewport consumes a `ShapeResult`-shaped object. A regeneration may
 * produce no geometry (null mesh); we only push renderable results.
 */
type RenderableShape = Pick<ShapeResult, "shapeId" | "mesh" | "edges" | "bbox">;

interface AppState {
  client: KernelClient;
  ready: boolean;
  busy: boolean;
  error: string | null;

  /** The whole document (all Part Studio tabs). Single source of truth. */
  doc: CADDocument;
  /**
   * The active tab's feature tree, mirrored here for convenience. Every
   * mutation writes through mutateTree, which updates BOTH this and the active
   * tab inside `doc`. Kept in sync so existing feature actions need no change.
   */
  tree: FeatureTree;
  /** Currently selected feature id (for the parameter editor). Per active tab. */
  selectedId: string | null;
  /** Latest per-feature regeneration status, keyed by feature id. */
  statuses: Record<string, FeatureStatus>;
  /** Latest renderable geometry, or null if the tree produced none. */
  shape: RenderableShape | null;
  /** Currently selected edge refs in the 3D view (for fillet/chamfer). */
  selectedEdgeRefs: EdgeRef[];

  /** Timestamp of the last successful auto-save, or null if never saved. */
  lastSavedAt: number | null;

  initKernel: () => Promise<void>;

  // --- Tabs (Part Studios) ---
  /** Switch the active Part Studio tab. */
  setActiveTab: (tabId: string) => void;
  /** Add a new empty Part Studio tab and switch to it. */
  addTab: () => void;
  /** Rename a Part Studio tab. */
  renameTab: (tabId: string, name: string) => void;
  /** Delete a Part Studio tab (never the last one). */
  deleteTab: (tabId: string) => void;
  addFeature: (type: "box" | "cylinder") => void;
  /** Add a finished sketch as a SketchFeature node; returns its id. */
  addSketchFeature: (sketch: Sketch) => string;
  /** Replace the sketch geometry of an existing SketchFeature (after editing). */
  updateSketch: (featureId: string, sketch: Sketch) => void;
  /** Add an extrude feature consuming the given sketch feature id. */
  addExtrude: (sketchId: string) => void;
  /** Add a revolve feature consuming the given sketch feature id. */
  addRevolve: (sketchId: string) => void;
  /** Set the current 3D edge selection (from the viewport). */
  setSelectedEdges: (refs: EdgeRef[]) => void;
  /** Create a fillet/chamfer from the current edge selection. */
  addFillet: () => void;
  addChamfer: () => void;
  /** Add a whole-body transform feature (mirror / linear / circular pattern). */
  addMirror: () => void;
  addLinearPattern: () => void;
  addCircularPattern: () => void;
  updateFeature: (id: string, patch: Partial<Feature>) => void;
  updateParams: (id: string, params: Record<string, number | boolean>) => void;
  setOperation: (id: string, operation: BooleanOperation) => void;
  toggleSuppress: (id: string) => void;
  deleteFeature: (id: string) => void;
  moveFeature: (id: string, direction: -1 | 1) => void;
  selectFeature: (id: string | null) => void;
  regenerate: () => Promise<void>;

  /** Export the current model; triggers a browser file download. */
  exportModel: (format: "step" | "stl") => Promise<void>;
  /** Rename the current document. */
  renameDoc: (name: string) => void;
  /** Persist the current document to IndexedDB now. */
  saveDoc: () => Promise<void>;
  /** Load a document by id, replacing the current tree. */
  loadDoc: (id: string) => Promise<void>;
  /** Start a fresh empty document. */
  newDoc: () => void;
  /** On startup, load the most recently edited document if one exists. */
  restoreLast: () => Promise<void>;

  /** Undo/redo over discrete tree mutations. */
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // --- Version history (per active Part Studio) ---
  /**
   * Id of the version currently being VIEWED read-only, or null when editing
   * the live workspace. When set, the viewport shows that snapshot and editing
   * is disabled until the user exits or restores.
   */
  viewingVersionId: string | null;
  /** Snapshot the active tab's current tree as a new named version. */
  createVersion: (name?: string) => void;
  /** Open a past version read-only (shows its geometry, no editing). */
  openVersion: (versionId: string) => void;
  /** Leave read-only version view, returning to the live workspace. */
  exitVersionView: () => void;
  /** Non-destructively restore a version (fork): live tree becomes it. */
  restoreVersion: (versionId: string) => void;

  // --- Linked documents (Phase 11, stretch) ---
  /**
   * Insert a read-only reference to another local document's Part Studio.
   * Loads that tab's tree from IndexedDB and caches it in a LinkedFeature.
   */
  insertReference: (sourceDocId: string, sourceTabId: string) => Promise<void>;
  /** Re-fetch a linked reference's source tree from IndexedDB (manual sync). */
  updateReference: (featureId: string) => Promise<void>;
}

/**
 * Debounce so dragging a numeric input doesn't fire a regeneration per
 * keystroke. Kept module-level (not in state) since it's transient plumbing.
 */
let regenTimer: ReturnType<typeof setTimeout> | null = null;
const REGEN_DEBOUNCE_MS = 80;

/** Auto-save is debounced separately (slower — persistence isn't per-frame). */
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 800;

/**
 * Undo/redo history — kept PER TAB (Part Studio), keyed by tab id, so switching
 * tabs preserves each Part Studio's own timeline (architecture req #6: undo is
 * scoped per-tab, not global). Module-level and transient (not persisted). We
 * snapshot the active tree BEFORE each discrete mutation; rapid param edits
 * coalesce within COALESCE_MS so a slider drag is one undo step.
 */
interface TabHistory {
  undo: FeatureTree[];
  redo: FeatureTree[];
  lastSnapshotAt: number;
}
const histories = new Map<string, TabHistory>();
const HISTORY_LIMIT = 50;
const COALESCE_MS = 500;

function historyFor(tabId: string): TabHistory {
  let h = histories.get(tabId);
  if (!h) {
    h = { undo: [], redo: [], lastSnapshotAt: 0 };
    histories.set(tabId, h);
  }
  return h;
}

function cloneTree(tree: FeatureTree): FeatureTree {
  // Structured deep clone; feature tree is plain JSON-serializable data.
  return structuredClone(tree);
}

export const useStore = create<AppState>((set, get) => {
  const refreshUndoFlags = () => {
    const h = historyFor(get().doc.activeTabId);
    set({ canUndo: h.undo.length > 0, canRedo: h.redo.length > 0 });
  };

  /** Write a new tree into the active tab of the document. */
  const writeActiveTree = (tree: FeatureTree): CADDocument => {
    const doc = get().doc;
    const tabs = doc.tabs.map((t) =>
      t.id === doc.activeTabId ? { ...t, tree } : t,
    );
    return { ...doc, tabs };
  };

  /** Write a new version history into the active tab of the document. */
  const writeActiveHistory = (history: VersionHistory): CADDocument => {
    const doc = get().doc;
    const tabs: PartStudio[] = doc.tabs.map((t) =>
      t.id === doc.activeTabId ? { ...t, history } : t,
    );
    return { ...doc, tabs };
  };

  /**
   * Snapshot the active tab's tree before mutating. `coalesce` merges
   * consecutive edits within COALESCE_MS into one history entry (slider drags).
   */
  const snapshot = (coalesce: boolean) => {
    const now = performance.now();
    const h = historyFor(get().doc.activeTabId);
    if (coalesce && now - h.lastSnapshotAt < COALESCE_MS && h.undo.length > 0) {
      h.lastSnapshotAt = now;
      return;
    }
    h.undo.push(cloneTree(get().tree));
    if (h.undo.length > HISTORY_LIMIT) h.undo.shift();
    h.redo.length = 0; // a new edit invalidates the redo branch
    h.lastSnapshotAt = now;
    refreshUndoFlags();
  };

  /** Apply a tree mutation to the active tab, then debounce regen + auto-save. */
  const mutateTree = (features: Feature[], coalesce = false) => {
    // Editing is disabled while viewing a past version read-only. The UI hides
    // edit affordances too, but guard here as the single choke point.
    if (get().viewingVersionId !== null) return;
    snapshot(coalesce);
    const tree = { features };
    set({ tree, doc: writeActiveTree(tree) });
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => {
      void get().regenerate();
    }, REGEN_DEBOUNCE_MS);
    // Auto-save the whole document after edits settle.
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      void get().saveDoc();
    }, SAVE_DEBOUNCE_MS);
  };

  const initialDoc = makeDocument();

  return {
    client: new KernelClient(),
    ready: false,
    busy: false,
    error: null,
    doc: initialDoc,
    tree: activeStudio(initialDoc).tree,
    selectedId: null,
    statuses: {},
    shape: null,
    selectedEdgeRefs: [],
    lastSavedAt: null,
    canUndo: false,
    canRedo: false,
    viewingVersionId: null,

    initKernel: async () => {
      set({ busy: true, error: null });
      try {
        await get().client.init();
        set({ ready: true });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    },

    setActiveTab: (tabId) => {
      const doc = get().doc;
      if (tabId === doc.activeTabId) return;
      const tab = doc.tabs.find((t) => t.id === tabId);
      if (!tab) return;
      // Swap in the target tab's tree; selection/statuses reset, history is
      // preserved per-tab in `histories`. Regenerate the newly active tree.
      const h = historyFor(tabId);
      set({
        doc: { ...doc, activeTabId: tabId },
        tree: tab.tree,
        selectedId: null,
        selectedEdgeRefs: [],
        statuses: {},
        canUndo: h.undo.length > 0,
        canRedo: h.redo.length > 0,
        viewingVersionId: null, // leave any read-only version view on tab switch
      });
      void get().regenerate();
      void get().saveDoc();
    },

    addTab: () => {
      const doc = get().doc;
      const tab = makePartStudio(`Part Studio ${doc.tabs.length + 1}`);
      set({ doc: { ...doc, tabs: [...doc.tabs, tab] } });
      get().setActiveTab(tab.id);
    },

    renameTab: (tabId, name) => {
      const doc = get().doc;
      const tabs = doc.tabs.map((t) => (t.id === tabId ? { ...t, name } : t));
      set({ doc: { ...doc, tabs } });
      void get().saveDoc();
    },

    deleteTab: (tabId) => {
      const doc = get().doc;
      if (doc.tabs.length <= 1) return; // never delete the last tab
      const idx = doc.tabs.findIndex((t) => t.id === tabId);
      if (idx < 0) return;
      const tabs = doc.tabs.filter((t) => t.id !== tabId);
      histories.delete(tabId);
      // If the active tab was deleted, activate a neighbor.
      const nextActive =
        doc.activeTabId === tabId
          ? tabs[Math.max(0, idx - 1)].id
          : doc.activeTabId;
      set({ doc: { ...doc, tabs, activeTabId: nextActive } });
      if (doc.activeTabId === tabId) {
        // Force a full reload of the newly-active tree.
        const tab = tabs.find((t) => t.id === nextActive)!;
        const h = historyFor(nextActive);
        set({
          tree: tab.tree,
          selectedId: null,
          selectedEdgeRefs: [],
          statuses: {},
          canUndo: h.undo.length > 0,
          canRedo: h.redo.length > 0,
        });
        void get().regenerate();
      }
      void get().saveDoc();
    },

    addFeature: (type) => {
      const { tree } = get();
      // First solid feature starts a new body; subsequent default to "add".
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index =
        tree.features.filter((f) => f.type === type).length + 1;
      const feature = makeDefaultFeature(type, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addSketchFeature: (sketch) => {
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "sketch").length + 1;
      const feature = makeSketchFeature(sketch, index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
      return feature.id;
    },

    updateSketch: (featureId, sketch) => {
      const features = get().tree.features.map((f) =>
        f.id === featureId && f.type === "sketch"
          ? ({ ...f, planeId: sketch.planeId, sketch } as Feature)
          : f,
      );
      mutateTree(features);
      set({ selectedId: featureId });
    },

    addExtrude: (sketchId) => {
      const { tree } = get();
      // If a solid body already exists, default to "add"; else "new".
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index = tree.features.filter((f) => f.type === "extrude").length + 1;
      const feature = makeExtrudeFeature(sketchId, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addRevolve: (sketchId) => {
      const { tree } = get();
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index = tree.features.filter((f) => f.type === "revolve").length + 1;
      const feature = makeRevolveFeature(sketchId, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    setSelectedEdges: (refs) => set({ selectedEdgeRefs: refs }),

    addFillet: () => {
      const { tree, selectedEdgeRefs } = get();
      if (selectedEdgeRefs.length === 0) return;
      const index = tree.features.filter((f) => f.type === "fillet").length + 1;
      const feature = makeFilletFeature(selectedEdgeRefs, index);
      mutateTree([...tree.features, feature]);
      // Clear the edge selection now that it's captured in the feature.
      set({ selectedId: feature.id, selectedEdgeRefs: [] });
    },

    addChamfer: () => {
      const { tree, selectedEdgeRefs } = get();
      if (selectedEdgeRefs.length === 0) return;
      const index = tree.features.filter((f) => f.type === "chamfer").length + 1;
      const feature = makeChamferFeature(selectedEdgeRefs, index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id, selectedEdgeRefs: [] });
    },

    addMirror: () => {
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "mirror").length + 1;
      const feature = makeMirrorFeature(index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addLinearPattern: () => {
      const { tree } = get();
      const index =
        tree.features.filter((f) => f.type === "linearPattern").length + 1;
      const feature = makeLinearPatternFeature(index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addCircularPattern: () => {
      const { tree } = get();
      const index =
        tree.features.filter((f) => f.type === "circularPattern").length + 1;
      const feature = makeCircularPatternFeature(index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    updateFeature: (id, patch) => {
      const features = get().tree.features.map((f) =>
        f.id === id ? ({ ...f, ...patch } as Feature) : f,
      );
      mutateTree(features, true); // coalesce: position drags are one undo step
    },

    updateParams: (id, params) => {
      const features = get().tree.features.map((f) => {
        // sketch and linked features have no `params` bag to merge into.
        if (f.id !== id || f.type === "sketch" || f.type === "linked") return f;
        return { ...f, params: { ...f.params, ...params } } as Feature;
      });
      mutateTree(features, true); // coalesce: slider drags are one undo step
    },

    setOperation: (id, operation) => {
      const features = get().tree.features.map((f) => {
        if (f.id !== id || f.type === "sketch") return f; // sketches have no op
        return { ...f, operation } as Feature;
      });
      mutateTree(features);
    },

    toggleSuppress: (id) => {
      const features = get().tree.features.map((f) =>
        f.id === id ? ({ ...f, suppressed: !f.suppressed } as Feature) : f,
      );
      mutateTree(features);
    },

    deleteFeature: (id) => {
      const features = get().tree.features.filter((f) => f.id !== id);
      mutateTree(features);
      if (get().selectedId === id) set({ selectedId: null });
    },

    moveFeature: (id, direction) => {
      const features = [...get().tree.features];
      const i = features.findIndex((f) => f.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= features.length) return;
      [features[i], features[j]] = [features[j], features[i]];
      mutateTree(features);
    },

    selectFeature: (id) => set({ selectedId: id }),

    regenerate: async () => {
      const { client, tree } = get();
      set({ busy: true, error: null });
      try {
        const result: RegenResult = await client.regenerate(tree);
        const statuses: Record<string, FeatureStatus> = {};
        for (const s of result.statuses) statuses[s.featureId] = s;

        const shape: RenderableShape | null =
          result.mesh && result.edges && result.bbox
            ? {
                shapeId: result.shapeId ?? -1,
                mesh: result.mesh,
                edges: result.edges,
                bbox: result.bbox,
              }
            : null;

        set({ statuses, shape });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    },

    exportModel: async (format) => {
      const { client, tree, doc } = get();
      set({ busy: true, error: null });
      try {
        const result = await client.exportShape(tree, format);
        // Trigger a browser download of the returned text. Name uses the doc
        // + active Part Studio name so exports are identifiable.
        const tabName = activeStudio(doc).name;
        const mime = format === "step" ? "application/step" : "model/stl";
        const blob = new Blob([result.data], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${sanitizeFilename(`${doc.name}-${tabName}`)}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    },

    renameDoc: (name) => {
      set({ doc: { ...get().doc, name } });
      void get().saveDoc();
    },

    saveDoc: async () => {
      const { doc } = get();
      try {
        // Date.now is fine on the main thread (only banned in workflow scripts).
        const now = Date.now();
        await saveDocument(doc, now);
        set({ lastSavedAt: now });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      }
    },

    loadDoc: async (id) => {
      try {
        const doc = await loadDocument(id);
        if (!doc) {
          set({ error: `Document ${id} not found` });
          return;
        }
        histories.clear();
        const studio = activeStudio(doc);
        set({
          doc,
          tree: studio.tree,
          selectedId: null,
          selectedEdgeRefs: [],
          statuses: {},
          lastSavedAt: null,
          canUndo: false,
          canRedo: false,
        });
        await get().regenerate();
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      }
    },

    newDoc: () => {
      histories.clear();
      const freshDoc = makeDocument();
      set({
        doc: freshDoc,
        tree: activeStudio(freshDoc).tree,
        selectedId: null,
        selectedEdgeRefs: [],
        statuses: {},
        shape: null,
        lastSavedAt: null,
        canUndo: false,
        canRedo: false,
      });
    },

    restoreLast: async () => {
      try {
        const docs = await listDocuments();
        if (docs.length > 0) await get().loadDoc(docs[0].id);
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      }
    },

    undo: () => {
      if (get().viewingVersionId !== null) return; // disabled in read-only view
      const h = historyFor(get().doc.activeTabId);
      if (h.undo.length === 0) return;
      h.redo.push(cloneTree(get().tree));
      const prev = h.undo.pop()!;
      set({
        tree: prev,
        doc: writeActiveTree(prev),
        canUndo: h.undo.length > 0,
        canRedo: h.redo.length > 0,
      });
      void get().regenerate();
      // Persist the reverted state.
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => void get().saveDoc(), SAVE_DEBOUNCE_MS);
    },

    redo: () => {
      if (get().viewingVersionId !== null) return; // disabled in read-only view
      const h = historyFor(get().doc.activeTabId);
      if (h.redo.length === 0) return;
      h.undo.push(cloneTree(get().tree));
      const next = h.redo.pop()!;
      set({
        tree: next,
        doc: writeActiveTree(next),
        canUndo: h.undo.length > 0,
        canRedo: h.redo.length > 0,
      });
      void get().regenerate();
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => void get().saveDoc(), SAVE_DEBOUNCE_MS);
    },

    createVersion: (name) => {
      const doc = get().doc;
      const studio = activeStudio(doc);
      const node: VersionNode = {
        id: newFeatureId(),
        name: name?.trim() || nextVersionName(studio.history),
        parentId: studio.history.headId,
        snapshot: cloneTree(studio.tree),
        createdAt: Date.now(),
      };
      const history: VersionHistory = {
        nodes: [...studio.history.nodes, node],
        headId: node.id,
      };
      set({ doc: writeActiveHistory(history) });
      void get().saveDoc();
    },

    openVersion: (versionId) => {
      const studio = activeStudio(get().doc);
      const node = studio.history.nodes.find((n) => n.id === versionId);
      if (!node) return;
      // Read-only view: push the snapshot to the viewport WITHOUT touching the
      // live tree in the document. Editing is disabled while viewingVersionId
      // is set (guarded in mutateTree).
      set({ viewingVersionId: versionId, tree: node.snapshot, selectedId: null });
      void get().regenerate();
    },

    exitVersionView: () => {
      if (get().viewingVersionId === null) return;
      // Restore the live working tree from the active tab.
      const studio = activeStudio(get().doc);
      set({ viewingVersionId: null, tree: studio.tree, selectedId: null });
      void get().regenerate();
    },

    restoreVersion: (versionId) => {
      const doc = get().doc;
      const studio = activeStudio(doc);
      const node = studio.history.nodes.find((n) => n.id === versionId);
      if (!node) return;
      // Non-destructive fork: the live tree becomes the snapshot, and we append
      // a NEW head node whose parent is the restored node. Nothing is deleted;
      // the prior timeline stays browsable.
      const forked: VersionNode = {
        id: newFeatureId(),
        name: `${node.name} (restored)`,
        parentId: node.id,
        snapshot: cloneTree(node.snapshot),
        createdAt: Date.now(),
      };
      const history: VersionHistory = {
        nodes: [...studio.history.nodes, forked],
        headId: forked.id,
      };
      // Clear this tab's undo history — the restore is a fresh starting point.
      histories.delete(doc.activeTabId);
      const restoredTree = cloneTree(node.snapshot);
      // Write both the new tree and the updated history into the active tab.
      const tabs = doc.tabs.map((t) =>
        t.id === doc.activeTabId ? { ...t, tree: restoredTree, history } : t,
      );
      set({
        doc: { ...doc, tabs },
        tree: restoredTree,
        viewingVersionId: null,
        selectedId: null,
        selectedEdgeRefs: [],
        canUndo: false,
        canRedo: false,
      });
      void get().regenerate();
      void get().saveDoc();
    },

    insertReference: async (sourceDocId, sourceTabId) => {
      try {
        const source = await loadDocument(sourceDocId);
        const tab = source?.tabs.find((t) => t.id === sourceTabId);
        if (!source || !tab) {
          set({ error: "Referenced document/tab not found" });
          return;
        }
        const { tree } = get();
        const hasSolid = tree.features.some((f) => f.type !== "sketch");
        const operation: BooleanOperation = hasSolid ? "add" : "new";
        const index =
          tree.features.filter((f) => f.type === "linked").length + 1;
        const feature = makeLinkedFeature(
          sourceDocId,
          sourceTabId,
          `${source.name} / ${tab.name}`,
          structuredClone(tab.tree),
          index,
          operation,
        );
        mutateTree([...tree.features, feature]);
        set({ selectedId: feature.id });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      }
    },

    updateReference: async (featureId) => {
      const feature = get().tree.features.find((f) => f.id === featureId);
      if (!feature || feature.type !== "linked") return;
      try {
        const source = await loadDocument(feature.sourceDocId);
        const tab = source?.tabs.find((t) => t.id === feature.sourceTabId);
        if (!source || !tab) {
          set({ error: "Referenced source no longer exists" });
          return;
        }
        // Refresh the cached tree + label (source may have been renamed).
        const features = get().tree.features.map((f) =>
          f.id === featureId && f.type === "linked"
            ? {
                ...f,
                cachedTree: structuredClone(tab.tree),
                sourceLabel: `${source.name} / ${tab.name}`,
              }
            : f,
        );
        mutateTree(features);
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      }
    },
  };
});

/** Make a document name safe to use as a download filename. */
function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^\w.\- ]+/g, "_").trim();
  return cleaned.length > 0 ? cleaned : "model";
}
