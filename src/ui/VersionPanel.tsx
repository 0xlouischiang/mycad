/**
 * Version history panel (architecture req #7) for the active Part Studio.
 *
 * Shows the linear version timeline (newest first), a "Create version" action,
 * and per-version Open (read-only) / Restore (non-destructive fork). While a
 * past version is open read-only, a banner indicates it and offers Exit.
 *
 * Restore never rewinds destructively — it forks a new head from the chosen
 * version (see store.restoreVersion / model/version.ts).
 */
import { useStore } from "../store";
import { linearize } from "../model/version";

export function VersionPanel() {
  const doc = useStore((s) => s.doc);
  const viewingVersionId = useStore((s) => s.viewingVersionId);
  const createVersion = useStore((s) => s.createVersion);
  const openVersion = useStore((s) => s.openVersion);
  const exitVersionView = useStore((s) => s.exitVersionView);
  const restoreVersion = useStore((s) => s.restoreVersion);

  const studio = doc.tabs.find((t) => t.id === doc.activeTabId) ?? doc.tabs[0];
  // Newest first for display.
  const versions = linearize(studio.history).slice().reverse();

  return (
    <section className="border-t border-neutral-800 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Versions
        </h2>
        <button
          type="button"
          onClick={() => createVersion()}
          className="rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700"
        >
          + Create version
        </button>
      </div>

      {viewingVersionId && (
        <div className="mb-2 flex items-center justify-between rounded border border-amber-700 bg-amber-950/60 px-2 py-1 text-[11px] text-amber-200">
          <span>Viewing a past version (read-only)</span>
          <button
            type="button"
            onClick={exitVersionView}
            className="rounded bg-amber-800 px-1.5 py-0.5 text-amber-100 hover:bg-amber-700"
          >
            Exit
          </button>
        </div>
      )}

      {versions.length === 0 ? (
        <p className="text-[11px] text-neutral-600">
          No versions yet. Create one to snapshot the current state.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {versions.map((v) => {
            const isViewing = v.id === viewingVersionId;
            return (
              <li
                key={v.id}
                className={`flex items-center gap-2 rounded border px-2 py-1 text-xs ${
                  isViewing
                    ? "border-amber-700 bg-amber-950/40"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                <div className="mr-auto min-w-0">
                  <div className="truncate text-neutral-200">{v.name}</div>
                  <div className="text-[10px] text-neutral-500">
                    {new Date(v.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openVersion(v.id)}
                  className="rounded px-1.5 py-0.5 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                  title="Open read-only"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => restoreVersion(v.id)}
                  className="rounded px-1.5 py-0.5 text-[11px] text-blue-400 hover:bg-neutral-800 hover:text-blue-300"
                  title="Restore (non-destructive fork)"
                >
                  Restore
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
