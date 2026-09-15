/**
 * Document toolbar: shown at the top of 3D mode. Editable document name,
 * save-state indicator, New / Open, and STEP / STL export.
 *
 * Persistence is auto-save (debounced in the store), so the indicator is
 * informational; the explicit actions are New, Open, and Export.
 */
import { useRef, useState } from "react";
import { useStore } from "../store";
import { listDocuments, type DocumentSummary } from "../persistence/db";

export function DocumentBar() {
  const docName = useStore((s) => s.doc.name);
  const lastSavedAt = useStore((s) => s.lastSavedAt);
  const busy = useStore((s) => s.busy);
  const renameDoc = useStore((s) => s.renameDoc);
  const newDoc = useStore((s) => s.newDoc);
  const loadDoc = useStore((s) => s.loadDoc);
  const exportModel = useStore((s) => s.exportModel);
  const addImport = useStore((s) => s.addImport);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.canUndo);
  const canRedo = useStore((s) => s.canRedo);

  const [openList, setOpenList] = useState<DocumentSummary[] | null>(null);

  const toggleOpen = async () => {
    if (openList) {
      setOpenList(null);
    } else {
      setOpenList(await listDocuments());
    }
  };

  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-sm">
      <input
        value={docName}
        onChange={(e) => renameDoc(e.target.value)}
        className="w-48 rounded border border-transparent bg-transparent px-2 py-1 text-neutral-100 hover:border-neutral-700 focus:border-blue-500 focus:outline-none"
        aria-label="Document name"
      />

      <span className="text-[11px] text-neutral-500">
        {busy ? "…" : lastSavedAt ? "saved" : "unsaved"}
      </span>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl/Cmd+Z)"
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700 disabled:opacity-30"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl/Cmd+Shift+Z)"
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700 disabled:opacity-30"
        >
          ↷
        </button>
        <div className="mx-1 h-5 w-px bg-neutral-700" />
        <button
          type="button"
          onClick={newDoc}
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          New
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => void toggleOpen()}
            className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
          >
            Open ▾
          </button>
          {openList && (
            <div className="absolute right-0 z-10 mt-1 max-h-72 w-64 overflow-y-auto rounded border border-neutral-700 bg-neutral-900 shadow-lg">
              {openList.length === 0 && (
                <div className="px-3 py-2 text-xs text-neutral-500">
                  No saved documents
                </div>
              )}
              {openList.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    void loadDoc(d.id);
                    setOpenList(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-neutral-800"
                >
                  <span className="truncate text-neutral-200">{d.name}</span>
                  <span className="ml-2 shrink-0 text-neutral-500">
                    {new Date(d.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-neutral-700" />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Import a STEP or STL file as a body"
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".step,.stp,.stl"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = ""; // allow re-importing the same file
            if (!file) return;
            const text = await file.text();
            const lower = file.name.toLowerCase();
            const format = lower.endsWith(".stl") ? "stl" : "step";
            addImport(format, text, file.name);
          }}
        />

        <button
          type="button"
          onClick={() => void exportModel("step")}
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          Export STEP
        </button>
        <button
          type="button"
          onClick={() => void exportModel("stl")}
          className="rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700"
        >
          Export STL
        </button>
      </div>
    </div>
  );
}
