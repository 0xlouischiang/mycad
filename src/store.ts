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
  makeLoftFeature,
  makeRevolveFeature,
  makeSweepFeature,
  makeDraftFeature,
  makeFilletFeature,
  makeHoleFeature,
  makeImportFeature,
  makeSplitFeature,
  makeLinearPatternFeature,
  makeShellFeature,
  makeLinkedFeature,
  makeMirrorFeature,
  makeSketchFeature,
  type BooleanOperation,
  type Feature,
  type FeatureTree,
} from "./model/featureTree";
import { makeSketch, newSketchId, type Sketch } from "./model/sketch";
import type { EdgeRef, FaceRef } from "./model/edgeRef";
import {
  activeConfigOverrides,
  activeStudio,
  makeDocument,
  makePartStudio,
  resolveVariableScope,
  type CADDocument,
  type Configuration,
  type PartStudio,
  type Variable,
} from "./model/document";
import { evalExpr } from "./model/expr";
import {
  makeRobotTab,
  makeLink,
  makeJoint,
  type RobotTab,
} from "./model/robot";
import { exportUrdf, exportXacro, urdfName } from "./model/urdf";
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

/**
 * A parametric primitive sketch spec for the chat command path. `cx`/`cy` are
 * the shape center in plane (u,v) coordinates (default 0,0).
 */
export type PrimitiveSketchSpec = {
  plane: "XY" | "XZ" | "YZ";
  offset?: number;
} & (
  | { kind: "rectangle"; width: number; height: number; cx?: number; cy?: number }
  | { kind: "circle"; radius: number; cx?: number; cy?: number }
  | { kind: "polygon"; sides: number; radius: number; cx?: number; cy?: number }
);

export interface AppState {
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
  /** Currently selected face refs in the 3D view (for shell/draft). */
  selectedFaceRefs: FaceRef[];

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

  // --- Robot tabs (Phase 12) ---
  /** Id of the active robot tab, or null when a Part Studio is focused. */
  activeRobotId: string | null;
  /** Live joint values for the active robot (jointId → value). */
  jointValues: Record<string, number>;
  /** Add a new robot tab and focus it. */
  addRobotTab: () => void;
  /** Focus a robot tab (or null to return to Part Studio mode). */
  setActiveRobot: (robotId: string | null) => void;
  /** Delete a robot tab. */
  deleteRobot: (robotId: string) => void;
  /** Rename a robot tab. */
  renameRobot: (robotId: string, name: string) => void;
  /** Add a link to the active robot from a Part Studio tab body. */
  addLink: (sourceTabId: string, name: string) => void;
  /** Add a joint between two links in the active robot. */
  addJoint: (
    type: import("./model/robot").JointType,
    parentLinkId: string,
    childLinkId: string,
  ) => void;
  /** Patch a link's fields (mass, inertia, com, name). */
  updateLink: (linkId: string, patch: Partial<import("./model/robot").Link>) => void;
  /** Patch a joint's fields. */
  updateJoint: (jointId: string, patch: Partial<import("./model/robot").Joint>) => void;
  /** Remove a link (and any joints referencing it). */
  deleteLink: (linkId: string) => void;
  /** Remove a joint. */
  deleteJoint: (jointId: string) => void;
  /** Set a live joint value (drives viewport transform propagation). */
  setJointValue: (jointId: string, value: number) => void;
  /**
   * Per-link tessellated meshes for the active robot, keyed by link id. Built
   * by regenerating each link's source Part Studio tab (reused for live FK
   * transforms — no re-tessellation on slider moves).
   */
  robotMeshes: Record<string, RenderableShape>;
  /** Regenerate every active-robot link's source body into robotMeshes. */
  computeRobotMeshes: () => Promise<void>;
  /** Export the active robot to URDF/xacro + per-link STL, as a downloadable bundle. */
  exportRobotUrdf: (format?: "urdf" | "xacro") => Promise<void>;

  addFeature: (type: "box" | "cylinder") => void;
  /** Add a finished sketch as a SketchFeature node; returns its id. */
  addSketchFeature: (sketch: Sketch) => string;
  /** Replace the sketch geometry of an existing SketchFeature (after editing). */
  updateSketch: (featureId: string, sketch: Sketch) => void;
  /** Add an extrude feature consuming the given sketch feature id. */
  addExtrude: (sketchId: string) => void;
  /** Add a revolve feature consuming the given sketch feature id. */
  addRevolve: (sketchId: string) => void;
  /** Add a loft through all sketch features in tree order (>= 2 needed). */
  addLoft: () => void;
  /** Add a sweep of the last two sketches (profile = later, path = earlier). */
  addSweep: () => void;
  /** Set the current 3D edge selection (from the viewport). */
  setSelectedEdges: (refs: EdgeRef[]) => void;
  /** Set the current 3D face selection (from the viewport). */
  setSelectedFaces: (refs: FaceRef[]) => void;
  /** Create a fillet/chamfer from the current edge selection. */
  addFillet: () => void;
  addChamfer: () => void;
  /** Create a shell/draft from the current face selection. */
  addShell: () => void;
  addDraft: () => void;
  /**
   * Ref-accepting command variants. The UI button actions above delegate to
   * these with the current viewport selection; the command registry (chat /
   * LLM path) calls them directly with refs it derived from the geometry
   * catalog. Both paths converge here → mutateTree → same undo/regen/save.
   * Each returns the created feature id (or null if refs were empty).
   */
  addFilletFor: (edgeRefs: EdgeRef[], radius?: number) => string | null;
  addChamferFor: (edgeRefs: EdgeRef[], distance?: number) => string | null;
  addShellFor: (faceRefs: FaceRef[], thickness?: number) => string | null;
  addDraftFor: (
    faceRefs: FaceRef[],
    direction?: "x" | "y" | "z",
    angle?: number,
  ) => string | null;
  /**
   * Build a parametric primitive sketch (rectangle / circle / polygon) and add
   * it as a SketchFeature. Used by the chat command path (freeform NL sketching
   * is out of scope); returns the created sketch feature id.
   */
  addSketchPrimitive: (spec: PrimitiveSketchSpec) => string;
  /** Add a hole feature (cuts the running body). */
  addHole: () => void;
  /** Add a split feature (cuts the body by a plane, keeps one side). */
  addSplit: () => void;
  /** Add an imported STEP/STL body from file text. */
  addImport: (format: "step" | "stl", data: string, fileName: string) => void;
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

  // --- Variables (per active Part Studio) ---
  addVariable: (name: string, expression: string) => void;
  updateVariable: (id: string, patch: { name?: string; expression?: string }) => void;
  deleteVariable: (id: string) => void;
  /** Set an expression override for a feature param (or clear it if empty). */
  setParamExpr: (featureId: string, param: string, expression: string) => void;

  // --- Configurations (per active Part Studio) ---
  addConfiguration: (name: string) => void;
  deleteConfiguration: (id: string) => void;
  /** Activate a configuration (or null for the base, no overrides). */
  setActiveConfig: (id: string | null) => void;

  /** Move the rollback bar: only features with index < value are evaluated. */
  setRollback: (index: number) => void;

  /** Latest computed mass properties, or null until computed/if empty. */
  massProps: {
    volume: number | null;
    surfaceArea: number | null;
    centerOfMass: [number, number, number] | null;
  } | null;
  /** Compute mass properties of the current model (worker round-trip). */
  computeMassProps: () => Promise<void>;
  /** Set/clear a variable override within a configuration. */
  setConfigOverride: (
    configId: string,
    varName: string,
    value: number | null,
  ) => void;

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

  /** Write a new variables list into the active tab, then regen + save. */
  const commitVariables = (variables: Variable[]) => {
    const doc = get().doc;
    const tabs: PartStudio[] = doc.tabs.map((t) =>
      t.id === doc.activeTabId ? { ...t, variables } : t,
    );
    set({ doc: { ...doc, tabs } });
    // Variables feed feature-param expressions, so re-regenerate + persist.
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => void get().regenerate(), REGEN_DEBOUNCE_MS);
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void get().saveDoc(), SAVE_DEBOUNCE_MS);
  };

  /** Patch the active tab's Part Studio fields, then regen + save. */
  const commitStudioPatch = (patch: Partial<PartStudio>) => {
    const doc = get().doc;
    const tabs: PartStudio[] = doc.tabs.map((t) =>
      t.id === doc.activeTabId ? { ...t, ...patch } : t,
    );
    set({ doc: { ...doc, tabs } });
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => void get().regenerate(), REGEN_DEBOUNCE_MS);
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void get().saveDoc(), SAVE_DEBOUNCE_MS);
  };

  /** Apply a transform to a robot tab by id, then persist. No regen — robot
   * edits are topology/metadata, not Part Studio geometry. */
  const patchRobot = (robotId: string, fn: (r: RobotTab) => RobotTab) => {
    const doc = get().doc;
    const robots = doc.robots.map((r) => (r.id === robotId ? fn(r) : r));
    set({ doc: { ...doc, robots } });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void get().saveDoc(), SAVE_DEBOUNCE_MS);
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
    selectedFaceRefs: [],
    lastSavedAt: null,
    canUndo: false,
    canRedo: false,
    viewingVersionId: null,
    massProps: null,
    activeRobotId: null,
    jointValues: {},
    robotMeshes: {},

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

    // --- Robot tab actions -------------------------------------------------
    addRobotTab: () => {
      const doc = get().doc;
      const robot = makeRobotTab(`Robot ${doc.robots.length + 1}`);
      set({
        doc: { ...doc, robots: [...doc.robots, robot] },
        activeRobotId: robot.id,
        jointValues: {},
      });
      void get().saveDoc();
    },

    setActiveRobot: (robotId) => set({ activeRobotId: robotId, jointValues: {} }),

    deleteRobot: (robotId) => {
      const doc = get().doc;
      set({
        doc: { ...doc, robots: doc.robots.filter((r) => r.id !== robotId) },
        activeRobotId: get().activeRobotId === robotId ? null : get().activeRobotId,
      });
      void get().saveDoc();
    },

    renameRobot: (robotId, name) => {
      patchRobot(robotId, (r) => ({ ...r, name }));
    },

    addLink: (sourceTabId, name) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => {
        const link = makeLink(name, sourceTabId, 0);
        return {
          ...r,
          links: [...r.links, link],
          // First link becomes the root automatically.
          rootLinkId: r.rootLinkId ?? link.id,
        };
      });
    },

    addJoint: (type, parentLinkId, childLinkId) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => {
        const idx = r.joints.length + 1;
        return {
          ...r,
          joints: [
            ...r.joints,
            makeJoint(`joint_${idx}`, type, parentLinkId, childLinkId),
          ],
        };
      });
    },

    updateLink: (linkId, patch) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => ({
        ...r,
        links: r.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)),
      }));
    },

    updateJoint: (jointId, patch) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => ({
        ...r,
        joints: r.joints.map((j) => (j.id === jointId ? { ...j, ...patch } : j)),
      }));
    },

    deleteLink: (linkId) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => {
        const links = r.links.filter((l) => l.id !== linkId);
        return {
          ...r,
          links,
          joints: r.joints.filter(
            (j) => j.parentLinkId !== linkId && j.childLinkId !== linkId,
          ),
          rootLinkId:
            r.rootLinkId === linkId ? (links[0]?.id ?? null) : r.rootLinkId,
        };
      });
    },

    deleteJoint: (jointId) => {
      const robotId = get().activeRobotId;
      if (!robotId) return;
      patchRobot(robotId, (r) => ({
        ...r,
        joints: r.joints.filter((j) => j.id !== jointId),
      }));
    },

    setJointValue: (jointId, value) =>
      set({ jointValues: { ...get().jointValues, [jointId]: value } }),

    computeRobotMeshes: async () => {
      const { client, doc, activeRobotId } = get();
      const robot = doc.robots.find((r) => r.id === activeRobotId);
      if (!robot) return;
      set({ busy: true, error: null });
      try {
        const meshes: Record<string, RenderableShape> = {};
        // Regenerate each distinct source tab once, then assign to its links.
        const byTab = new Map<string, RegenResult>();
        for (const link of robot.links) {
          let res = byTab.get(link.sourceTabId);
          if (!res) {
            const tab = doc.tabs.find((t) => t.id === link.sourceTabId);
            if (!tab) continue;
            const scope = resolveVariableScope(
              tab.variables,
              activeConfigOverrides(tab),
            );
            const active: FeatureTree = {
              features: tab.tree.features.slice(0, tab.rollbackIndex),
            };
            res = await client.regenerate(resolveTreeExpressions(active, scope));
            byTab.set(link.sourceTabId, res);
          }
          if (res.mesh && res.edges && res.bbox) {
            meshes[link.id] = {
              shapeId: res.shapeId ?? -1,
              mesh: res.mesh,
              edges: res.edges,
              bbox: res.bbox,
            };
          }
        }
        set({ robotMeshes: meshes });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    },

    exportRobotUrdf: async (format = "urdf") => {
      const { client, doc, activeRobotId } = get();
      const robot = doc.robots.find((r) => r.id === activeRobotId);
      if (!robot) return;
      set({ busy: true, error: null });
      try {
        const result =
          format === "xacro" ? exportXacro(robot) : exportUrdf(robot);
        if (!result.ok) {
          set({ error: `${format.toUpperCase()} export failed: ${result.error}` });
          return;
        }
        // Bundle: the .urdf/.xacro plus one STL per link (exported from its
        // source body). Downloaded as separate files (no zip dep) — the mesh
        // paths use meshes/<link>.stl, matching the STL filenames.
        const ext = format === "xacro" ? "urdf.xacro" : "urdf";
        downloadText(`${sanitizeFilename(robot.name)}.${ext}`, result.xml, "application/xml");
        for (const link of robot.links) {
          const tab = doc.tabs.find((t) => t.id === link.sourceTabId);
          if (!tab) continue;
          const scope = resolveVariableScope(tab.variables, activeConfigOverrides(tab));
          const active: FeatureTree = {
            features: tab.tree.features.slice(0, tab.rollbackIndex),
          };
          try {
            const stl = await client.exportShape(
              resolveTreeExpressions(active, scope),
              "stl",
            );
            downloadText(`${urdfName(link.name)}.stl`, stl.data, "model/stl");
          } catch {
            // A link with no geometry is skipped; URDF still references it.
          }
        }
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
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

    addSketchPrimitive: (spec) => {
      const sketch = buildPrimitiveSketch(spec);
      return get().addSketchFeature(sketch);
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

    addLoft: () => {
      const { tree } = get();
      // Loft through every sketch feature, in tree order.
      const sketchIds = tree.features
        .filter((f) => f.type === "sketch")
        .map((f) => f.id);
      if (sketchIds.length < 2) {
        set({ error: "Loft needs at least 2 sketches in the tree" });
        return;
      }
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index = tree.features.filter((f) => f.type === "loft").length + 1;
      const feature = makeLoftFeature(sketchIds, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addSweep: () => {
      const { tree } = get();
      const sketches = tree.features.filter((f) => f.type === "sketch");
      if (sketches.length < 2) {
        set({ error: "Sweep needs 2 sketches: a profile and a path" });
        return;
      }
      // Convention: profile = last sketch, path = second-to-last.
      const profile = sketches[sketches.length - 1];
      const path = sketches[sketches.length - 2];
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index = tree.features.filter((f) => f.type === "sweep").length + 1;
      const feature = makeSweepFeature(profile.id, path.id, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    setSelectedEdges: (refs) => set({ selectedEdgeRefs: refs }),
    setSelectedFaces: (refs) => set({ selectedFaceRefs: refs }),

    addShell: () => {
      const id = get().addShellFor(get().selectedFaceRefs);
      if (id) set({ selectedFaceRefs: [] });
    },

    addDraft: () => {
      const id = get().addDraftFor(get().selectedFaceRefs);
      if (id) set({ selectedFaceRefs: [] });
    },

    addShellFor: (faceRefs, thickness) => {
      if (faceRefs.length === 0) return null;
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "shell").length + 1;
      const feature = makeShellFeature(faceRefs, index);
      if (thickness !== undefined) feature.params.thickness = thickness;
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
      return feature.id;
    },

    addDraftFor: (faceRefs, direction, angle) => {
      if (faceRefs.length === 0) return null;
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "draft").length + 1;
      const feature = makeDraftFeature(faceRefs, index);
      if (direction !== undefined) feature.params.direction = direction;
      if (angle !== undefined) feature.params.angle = angle;
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
      return feature.id;
    },

    addHole: () => {
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "hole").length + 1;
      const feature = makeHoleFeature(index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addSplit: () => {
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "split").length + 1;
      const feature = makeSplitFeature(index);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addImport: (format, data, fileName) => {
      const { tree } = get();
      const hasSolid = tree.features.some((f) => f.type !== "sketch");
      const operation: BooleanOperation = hasSolid ? "add" : "new";
      const index = tree.features.filter((f) => f.type === "import").length + 1;
      const feature = makeImportFeature(format, data, fileName, index, operation);
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
    },

    addFillet: () => {
      // Clear the edge selection now that it's captured in the feature.
      const id = get().addFilletFor(get().selectedEdgeRefs);
      if (id) set({ selectedEdgeRefs: [] });
    },

    addChamfer: () => {
      const id = get().addChamferFor(get().selectedEdgeRefs);
      if (id) set({ selectedEdgeRefs: [] });
    },

    addFilletFor: (edgeRefs, radius) => {
      if (edgeRefs.length === 0) return null;
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "fillet").length + 1;
      const feature = makeFilletFeature(edgeRefs, index);
      if (radius !== undefined) feature.params.radius = radius;
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
      return feature.id;
    },

    addChamferFor: (edgeRefs, distance) => {
      if (edgeRefs.length === 0) return null;
      const { tree } = get();
      const index = tree.features.filter((f) => f.type === "chamfer").length + 1;
      const feature = makeChamferFeature(edgeRefs, index);
      if (distance !== undefined) feature.params.distance = distance;
      mutateTree([...tree.features, feature]);
      set({ selectedId: feature.id });
      return feature.id;
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
        // sketch/linked/sweep features have no `params` bag to merge into.
        if (
          f.id !== id ||
          f.type === "sketch" ||
          f.type === "linked" ||
          f.type === "sweep" ||
          f.type === "import"
        )
          return f;
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
      const { client, tree, doc } = get();
      set({ busy: true, error: null });
      try {
        // Resolve expression-driven params into concrete numbers against the
        // active Part Studio's variable scope, so the worker only ever sees
        // plain numbers (regen.ts stays expression-agnostic).
        const studio = activeStudio(doc);
        const scope = resolveVariableScope(
          studio.variables,
          activeConfigOverrides(studio),
        );
        // Rollback bar: only evaluate features above the bar. Features below are
        // kept in the tree but excluded from this regeneration.
        const active: FeatureTree = {
          features: tree.features.slice(0, studio.rollbackIndex),
        };
        const resolved = resolveTreeExpressions(active, scope);
        const result: RegenResult = await client.regenerate(resolved);
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

    addVariable: (name, expression) => {
      const vars = activeStudio(get().doc).variables;
      commitVariables([
        ...vars,
        { id: newFeatureId(), name: name.trim(), expression },
      ]);
    },

    updateVariable: (id, patch) => {
      const vars = activeStudio(get().doc).variables.map((v) =>
        v.id === id
          ? {
              ...v,
              name: patch.name?.trim() ?? v.name,
              expression: patch.expression ?? v.expression,
            }
          : v,
      );
      commitVariables(vars);
    },

    deleteVariable: (id) => {
      commitVariables(activeStudio(get().doc).variables.filter((v) => v.id !== id));
    },

    setParamExpr: (featureId, param, expression) => {
      const features = get().tree.features.map((f) => {
        if (f.id !== featureId) return f;
        const exprs = { ...(f.exprs ?? {}) };
        if (expression.trim() === "") delete exprs[param];
        else exprs[param] = expression;
        return { ...f, exprs } as Feature;
      });
      mutateTree(features);
    },

    addConfiguration: (name) => {
      const studio = activeStudio(get().doc);
      const cfg: Configuration = {
        id: newFeatureId(),
        name: name.trim() || `Config ${studio.configurations.length + 1}`,
        overrides: {},
      };
      commitStudioPatch({
        configurations: [...studio.configurations, cfg],
        activeConfigId: cfg.id, // activate the new config
      });
    },

    deleteConfiguration: (id) => {
      const studio = activeStudio(get().doc);
      commitStudioPatch({
        configurations: studio.configurations.filter((c) => c.id !== id),
        activeConfigId:
          studio.activeConfigId === id ? null : studio.activeConfigId,
      });
    },

    setActiveConfig: (id) => {
      commitStudioPatch({ activeConfigId: id });
    },

    setRollback: (index) => {
      const count = activeStudio(get().doc).tree.features.length;
      // Clamp to [0, count]; count means "bar at end" (all active).
      commitStudioPatch({ rollbackIndex: Math.max(0, Math.min(index, count)) });
    },

    computeMassProps: async () => {
      const { client, tree, doc } = get();
      set({ busy: true, error: null });
      try {
        // Honor the rollback bar so props match the displayed model.
        const studio = activeStudio(doc);
        const active: FeatureTree = {
          features: tree.features.slice(0, studio.rollbackIndex),
        };
        const scope = resolveVariableScope(
          studio.variables,
          activeConfigOverrides(studio),
        );
        const resolved = resolveTreeExpressions(active, scope);
        const props = await client.massProps(resolved);
        set({ massProps: props });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    },

    setConfigOverride: (configId, varName, value) => {
      const studio = activeStudio(get().doc);
      const configurations = studio.configurations.map((c) => {
        if (c.id !== configId) return c;
        const overrides = { ...c.overrides };
        if (value === null) delete overrides[varName];
        else overrides[varName] = value;
        return { ...c, overrides };
      });
      commitStudioPatch({ configurations });
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

/**
 * Build a parametric primitive Sketch (rectangle / circle / polygon) from a
 * PrimitiveSketchSpec. Mirrors the geometry the interactive sketch tools emit
 * (see src/sketch/sketchStore.ts) but with fully-specified numeric coordinates
 * — used by the chat command path, which can't click points. The result is a
 * closed profile ready for extrude/revolve.
 */
function buildPrimitiveSketch(spec: PrimitiveSketchSpec): Sketch {
  const sketch = makeSketch(newSketchId("sk"), spec.plane, spec.offset ?? 0);
  const cx = spec.cx ?? 0;
  const cy = spec.cy ?? 0;
  const addPt = (u: number, v: number): string => {
    const id = newSketchId("pt");
    sketch.points.push({ id, u, v, fixed: false });
    return id;
  };

  if (spec.kind === "circle") {
    const center = addPt(cx, cy);
    sketch.entities.push({
      id: newSketchId("ci"),
      type: "circle",
      center,
      radius: spec.radius,
    });
    return sketch;
  }

  // Rectangle and polygon both emit N corner points joined by a closed line
  // loop (the profile extractor closes start→end).
  let corners: string[];
  if (spec.kind === "rectangle") {
    const hw = spec.width / 2;
    const hh = spec.height / 2;
    corners = [
      addPt(cx - hw, cy - hh),
      addPt(cx + hw, cy - hh),
      addPt(cx + hw, cy + hh),
      addPt(cx - hw, cy + hh),
    ];
  } else {
    const n = Math.max(3, Math.round(spec.sides));
    corners = [];
    for (let i = 0; i < n; i++) {
      // Start at +v (top) so a hexagon reads flat-ish; any a0 gives a valid loop.
      const a = Math.PI / 2 + (2 * Math.PI * i) / n;
      corners.push(addPt(cx + spec.radius * Math.cos(a), cy + spec.radius * Math.sin(a)));
    }
  }
  for (let i = 0; i < corners.length; i++) {
    sketch.entities.push({
      id: newSketchId("ln"),
      type: "line",
      p1: corners[i],
      p2: corners[(i + 1) % corners.length],
    });
  }
  return sketch;
}

/** Trigger a browser download of text content as a file. */
function downloadText(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Return a copy of the tree with every feature's expression-driven params
 * (feature.exprs) evaluated against `scope` and written into the numeric
 * params. Features without exprs are passed through unchanged. An expression
 * that fails to evaluate leaves the existing literal param value in place, so a
 * bad expression degrades gracefully instead of blanking the model.
 */
function resolveTreeExpressions(
  tree: FeatureTree,
  scope: Record<string, number>,
): FeatureTree {
  const features = tree.features.map((f) => {
    const exprs = f.exprs;
    if (!exprs || Object.keys(exprs).length === 0) return f;
    // Only solid/modifier features carry a `params` bag; sketch/linked/sweep
    // have none, so skip them.
    if (!("params" in f) || f.params == null) return f;
    const params: Record<string, unknown> = { ...(f.params as object) };
    for (const [key, expression] of Object.entries(exprs)) {
      if (!(key in params)) continue;
      try {
        params[key] = evalExpr(expression, scope);
      } catch {
        // keep the literal param value
      }
    }
    return { ...f, params } as Feature;
  });
  return { features };
}
