/**
 * Insert-reference dialog (Phase 11, stretch): pick another local document and
 * one of its Part Studio tabs to insert as a read-only linked reference into
 * the current Part Studio.
 *
 * Loads the candidate documents from IndexedDB on open. Excludes the current
 * document (self-reference would be circular). No live sync — the inserted
 * reference caches the source tree and is refreshed manually.
 */
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { listDocuments, loadDocument } from "../persistence/db";

interface TabChoice {
  docId: string;
  docName: string;
  tabId: string;
  tabName: string;
}

export function InsertReferenceDialog({ onClose }: { onClose: () => void }) {
  const currentDocId = useStore((s) => s.doc.id);
  const insertReference = useStore((s) => s.insertReference);
  const [choices, setChoices] = useState<TabChoice[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const summaries = await listDocuments();
      const rows: TabChoice[] = [];
      for (const s of summaries) {
        if (s.id === currentDocId) continue; // no self-reference
        const doc = await loadDocument(s.id);
        if (!doc) continue;
        for (const tab of doc.tabs) {
          rows.push({
            docId: doc.id,
            docName: doc.name,
            tabId: tab.id,
            tabName: tab.name,
          });
        }
      }
      if (!cancelled) setChoices(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentDocId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-96 rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold text-neutral-100">
          Insert reference
        </h2>

        {choices === null ? (
          <p className="text-xs text-neutral-500">Loading…</p>
        ) : choices.length === 0 ? (
          <p className="text-xs text-neutral-500">
            No other documents to reference. Save another document first.
          </p>
        ) : (
          <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {choices.map((c) => (
              <li key={`${c.docId}:${c.tabId}`}>
                <button
                  type="button"
                  onClick={() => {
                    void insertReference(c.docId, c.tabId);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-xs hover:border-blue-600 hover:bg-neutral-800"
                >
                  <span className="truncate text-neutral-200">{c.tabName}</span>
                  <span className="ml-2 shrink-0 text-neutral-500">
                    {c.docName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
