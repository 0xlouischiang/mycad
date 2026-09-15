/**
 * Part Studio tab bar (Document → tabs → Part Studio, architecture req #6).
 *
 * Shows the document's Part Studio tabs, highlights the active one, and offers
 * add / switch / rename (double-click) / delete. Each tab is an independent
 * feature-tree workspace; switching tabs swaps the active tree, selection, and
 * undo history (all scoped per-tab in the store).
 */
import { useState } from "react";
import { useStore } from "../store";

export function TabBar() {
  const tabs = useStore((s) => s.doc.tabs);
  const robots = useStore((s) => s.doc.robots);
  const activeTabId = useStore((s) => s.doc.activeTabId);
  const activeRobotId = useStore((s) => s.activeRobotId);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const setActiveRobot = useStore((s) => s.setActiveRobot);
  const addTab = useStore((s) => s.addTab);
  const addRobotTab = useStore((s) => s.addRobotTab);
  const renameTab = useStore((s) => s.renameTab);
  const renameRobot = useStore((s) => s.renameRobot);
  const deleteTab = useStore((s) => s.deleteTab);
  const deleteRobot = useStore((s) => s.deleteRobot);

  const [editingId, setEditingId] = useState<string | null>(null);

  // A Part Studio tab is "active" only when no robot tab is focused.
  const partStudioActive = activeRobotId === null;

  return (
    <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-950 px-2 py-1">
      {tabs.map((tab) => {
        const active = partStudioActive && tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => {
              setActiveRobot(null); // leave robot mode
              setActiveTab(tab.id);
            }}
            onDoubleClick={() => setEditingId(tab.id)}
            className={`group flex items-center gap-1 rounded-t px-3 py-1 text-xs ${
              active
                ? "bg-neutral-800 text-neutral-100"
                : "cursor-pointer bg-neutral-900 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            {editingId === tab.id ? (
              <input
                autoFocus
                defaultValue={tab.name}
                onBlur={(e) => {
                  renameTab(tab.id, e.target.value.trim() || tab.name);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-28 rounded border border-blue-500 bg-neutral-900 px-1 text-neutral-100 outline-none"
              />
            ) : (
              <span className="max-w-40 truncate">{tab.name}</span>
            )}

            {tabs.length > 1 && editingId !== tab.id && (
              <button
                type="button"
                title="Delete Part Studio"
                aria-label={`Delete ${tab.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      `Delete "${tab.name}"? This removes its feature tree.`,
                    )
                  ) {
                    deleteTab(tab.id);
                  }
                }}
                className="ml-1 text-neutral-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addTab}
        title="New Part Studio"
        className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
      >
        +
      </button>

      {/* Robot tabs (Phase 12) */}
      {robots.length > 0 && <div className="mx-1 h-4 w-px bg-neutral-700" />}
      {robots.map((rb) => {
        const active = activeRobotId === rb.id;
        return (
          <div
            key={rb.id}
            onClick={() => setActiveRobot(rb.id)}
            onDoubleClick={() => setEditingId(rb.id)}
            className={`group flex items-center gap-1 rounded-t px-3 py-1 text-xs ${
              active
                ? "bg-neutral-800 text-purple-200"
                : "cursor-pointer bg-neutral-900 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
            }`}
          >
            {editingId === rb.id ? (
              <input
                autoFocus
                defaultValue={rb.name}
                onBlur={(e) => {
                  renameRobot(rb.id, e.target.value.trim() || rb.name);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-28 rounded border border-blue-500 bg-neutral-900 px-1 text-neutral-100 outline-none"
              />
            ) : (
              <span className="max-w-40 truncate">⚙ {rb.name}</span>
            )}
            {editingId !== rb.id && (
              <button
                type="button"
                aria-label={`Delete ${rb.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete robot "${rb.name}"?`)) deleteRobot(rb.id);
                }}
                className="ml-1 text-neutral-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={addRobotTab}
        title="New Robot"
        className="rounded px-2 py-1 text-xs text-purple-400 hover:bg-neutral-800 hover:text-purple-200"
      >
        + Robot
      </button>
    </div>
  );
}
