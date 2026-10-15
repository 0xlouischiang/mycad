/**
 * App shell.
 *
 * Two modes:
 *  - 3D mode (default): feature tree panel + parameter editor + 3D viewport.
 *  - Sketch mode (when a sketch is active): sketch toolbar + 2D SVG canvas.
 *
 * Sketch mode is entered from the PlanePicker and exited via the toolbar's
 * "Finish sketch". In Phase 3 a finished sketch is simply discarded on exit;
 * Phase 4 will turn it into a feature-tree node for extrude/cut.
 */
import { useEffect } from "react";
import { useStore } from "./store";
import { useSketchStore } from "./sketch/sketchStore";
import { ViewportView } from "./viewport/ViewportView";
import { FeatureTreePanel } from "./ui/FeatureTreePanel";
import { ParameterEditor } from "./ui/ParameterEditor";
import { PlanePicker } from "./ui/PlanePicker";
import { DocumentBar } from "./ui/DocumentBar";
import { TabBar } from "./ui/TabBar";
import { VersionPanel } from "./ui/VersionPanel";
import { VariablesPanel } from "./ui/VariablesPanel";
import { ConfigurationsPanel } from "./ui/ConfigurationsPanel";
import { MassPropertiesPanel } from "./ui/MassPropertiesPanel";
import { ChatPanel } from "./ui/ChatPanel";
import { RobotView } from "./robot/RobotView";
import { BIMView } from "./bim/BIMView";
import { CFDView } from "./cfd/CFDView";
import { PlantView } from "./plant/PlantView";
import { SketchCanvas } from "./sketch/SketchCanvas";
import { SketchToolbar } from "./sketch/SketchToolbar";

export default function App() {
  const ready = useStore((s) => s.ready);
  const busy = useStore((s) => s.busy);
  const error = useStore((s) => s.error);
  const initKernel = useStore((s) => s.initKernel);
  const restoreLast = useStore((s) => s.restoreLast);
  const activeRobotId = useStore((s) => s.activeRobotId);
  const activeBimId = useStore((s) => s.activeBimId);
  const activeCfdId = useStore((s) => s.activeCfdId);
  const activePlantId = useStore((s) => s.activePlantId);
  const inSketchMode = useSketchStore((s) => s.sketch !== null);

  useEffect(() => {
    // Init the kernel, then restore the most recent document (if any).
    void initKernel().then(() => restoreLast());
  }, [initKernel, restoreLast]);

  // Global undo/redo shortcuts: the feature tree in 3D mode, the sketch's own
  // history in sketch mode. Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z or Ctrl+Y = redo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input (e.g. name fields, dimension edits). In
      // sketch mode this covers the inline dimension editor (SketchCanvas
      // DimensionLabels), the polygon "sides" field, and the chat textarea, so
      // Backspace edits text there instead of deleting geometry. The
      // window.prompt dialogs (fillet radius, constraint values) are native
      // and modal, so they never reach this listener.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Sketch mode: single-key tool shortcuts (CAD convention).
      if (inSketchMode) {
        const sk = useSketchStore.getState();
        // Sketch-local undo/redo (the 3D tree history is untouched while sketching).
        if ((e.metaKey || e.ctrlKey) && !e.altKey) {
          const k = e.key.toLowerCase();
          if (k === "z" && !e.shiftKey) {
            e.preventDefault();
            sk.undo();
          } else if ((k === "z" && e.shiftKey) || k === "y") {
            e.preventDefault();
            sk.redo();
          }
          return;
        }
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const map: Record<string, Parameters<typeof sk.setTool>[0]> = {
          v: "select",
          l: "line",
          r: "rectangle",
          c: "circle",
          a: "arc",
          g: "polygon",
          s: "slot",
          e: "ellipse",
          p: "spline",
        };
        const key = e.key.toLowerCase();
        // Delete/Backspace = the toolbar's Delete button (same handler, same
        // selection, same orphan cascade, one undo step). With nothing
        // selected it's a no-op and the key's default is left alone.
        if (e.key === "Delete" || e.key === "Backspace") {
          if (sk.selectedPoints.length > 0 || sk.selectedEntities.length > 0) {
            e.preventDefault();
            sk.deleteSelected();
          }
          return;
        }
        if (e.key === "Escape") {
          sk.setTool("select");
        } else if (map[key]) {
          sk.setTool(map[key]);
        }
        return;
      }

      const store = useStore.getState();

      // Escape: exit read-only version view, else clear the 3D selection.
      if (e.key === "Escape") {
        if (store.viewingVersionId !== null) store.exitVersionView();
        else if (store.selectedEdgeRefs.length > 0) store.setSelectedEdges([]);
        else if (store.selectedFaceRefs.length > 0) store.setSelectedFaces([]);
        return;
      }

      // Delete/Backspace removes the selected feature.
      if (e.key === "Delete" || e.key === "Backspace") {
        if (store.selectedId) {
          e.preventDefault();
          store.deleteFeature(store.selectedId);
        }
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        store.redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inSketchMode]);

  return (
    <div className="flex h-full w-full flex-col">
      {inSketchMode ? (
        // ---- Sketch mode ----
        <>
          <SketchToolbar />
          <div className="min-h-0 flex-1">
            <SketchCanvas />
          </div>
        </>
      ) : (
        // ---- 3D mode ----
        <>
        <DocumentBar />
        <TabBar />
        {activePlantId !== null ? (
          <PlantView />
        ) : activeCfdId !== null ? (
          <CFDView />
        ) : activeBimId !== null ? (
          <BIMView />
        ) : activeRobotId !== null ? (
          <RobotView />
        ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="flex w-80 flex-col border-r border-neutral-800 bg-neutral-900">
            <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
              <h1 className="text-lg font-semibold tracking-tight">myCAD</h1>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    busy
                      ? "bg-yellow-500"
                      : ready
                        ? "bg-green-500"
                        : "bg-neutral-600"
                  }`}
                />
                <span className="text-neutral-400">
                  {busy ? "Working…" : ready ? "Ready" : "Offline"}
                </span>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <FeatureTreePanel />
              <ParameterEditor />
              <ChatPanel />
              <PlanePicker />
              <VariablesPanel />
              <ConfigurationsPanel />
              <MassPropertiesPanel />
              <VersionPanel />
            </div>

            {error && (
              <div className="m-3 rounded border border-red-800 bg-red-950/50 p-2 text-xs text-red-300">
                {error}
              </div>
            )}
          </aside>

          <main className="relative flex-1">
            <ViewportView />
          </main>
        </div>
        )}
        </>
      )}
    </div>
  );
}
