/**
 * IndexedDB persistence for CADDocuments (Document → tabs → Part Studio).
 *
 * A whole Document (all its Part Studio tabs and their feature trees) persists
 * as one record, keyed by document id. Everything is plain JSON. Old v1 records
 * (bare single-tree documents) are migrated on load via migrateToDocument.
 *
 * All functions are promise-based wrappers over the raw IDB request API.
 */
import {
  migrateToDocument,
  type CADDocument,
} from "../model/document";

const DB_NAME = "mycad";
const DB_VERSION = 1;
const STORE = "documents";

/** A persisted record: the document plus a last-modified timestamp. */
interface StoredRecord {
  id: string;
  /** The full document (may be an old v1 shape on disk; migrated on load). */
  doc: unknown;
  name: string;
  updatedAt: number;
}

/** Lightweight summary for listing without loading full documents. */
export interface DocumentSummary {
  id: string;
  name: string;
  updatedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
  return dbPromise;
}

/** Promisify a single-store transaction. */
async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed"));
  });
}

/** Insert or update a document. `updatedAt` is stamped by the caller. */
export async function saveDocument(
  doc: CADDocument,
  updatedAt: number,
): Promise<void> {
  const record: StoredRecord = {
    id: doc.id,
    doc,
    name: doc.name,
    updatedAt,
  };
  await withStore("readwrite", (s) => s.put(record));
}

/** Load a document by id (migrating old shapes), or null if not found. */
export async function loadDocument(id: string): Promise<CADDocument | null> {
  const rec = await withStore<StoredRecord | undefined>("readonly", (s) =>
    s.get(id),
  );
  if (!rec) return null;
  return migrateToDocument(rec.doc);
}

/** Delete a document by id. */
export async function deleteDocument(id: string): Promise<void> {
  await withStore("readwrite", (s) => s.delete(id));
}

/** List all documents (summaries), most-recently-updated first. */
export async function listDocuments(): Promise<DocumentSummary[]> {
  const all = await withStore<StoredRecord[]>("readonly", (s) => s.getAll());
  return all
    .map((d) => ({ id: d.id, name: d.name, updatedAt: d.updatedAt }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}
