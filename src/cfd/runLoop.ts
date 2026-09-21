/**
 * Store-facing run loop: generate the case, POST /api/cfd/submit, poll until
 * terminal, then write results onto the active CFD tab.
 */
import type { AppState } from "../store";
import { generateCase, resolveDomain } from "./caseGen";
import { meshToNamedStl } from "./namedStl";
import {
  submitCase,
  pollStatus,
  fetchLog,
  fetchResult,
  cancelRun,
  type CfdJobState,
} from "./client";
import type { CfdRunStatus } from "../model/cfd";

type Get = () => AppState;
type Set = (
  partial: Partial<AppState> | ((s: AppState) => Partial<AppState>),
) => void;

const POLL_MS = 2000;
const MM = 0.001;

const jobs = new Map<string, { abort: boolean }>();

function patchRun(
  get: Get,
  set: Set,
  patch: Partial<AppState["doc"]["cfds"][number]["run"]> & {
    results?: AppState["doc"]["cfds"][number]["results"];
  },
) {
  const s = get();
  const id = s.activeCfdId;
  if (!id) return;
  const { results, ...runPatch } = patch;
  const cfds = s.doc.cfds.map((c) => {
    if (c.id !== id) return c;
    return {
      ...c,
      run: { ...c.run, ...runPatch },
      results: results !== undefined ? results : c.results,
    };
  });
  set({ doc: { ...s.doc, cfds } });
  void get().saveDoc();
}

export async function submitAndPoll(get: Get, set: Set): Promise<void> {
  const s = get();
  const cfd = s.doc.cfds.find((c) => c.id === s.activeCfdId);
  if (!cfd) {
    set({ error: "no active CFD tab" });
    return;
  }
  if (!s.cfdShape) {
    set({ error: "no source geometry — pick a Part Studio with a solid" });
    return;
  }
  const domain = resolveDomain(cfd, s.cfdShape.bbox);
  const named = meshToNamedStl(
    s.cfdShape.mesh,
    cfd.boundaryPatches.map((p) => ({ faceRef: p.faceRef, name: p.name })),
    { defaultName: "walls", scale: MM },
  );
  const generated = generateCase({
    tab: cfd,
    bbox: s.cfdShape.bbox,
    stl: named.stl,
    domainBox: domain,
  });
  if (!generated.ok) {
    set({ error: generated.error });
    return;
  }
  set({ error: null, busy: true });
  try {
    const { jobId } = await submitCase(generated.files, generated.solver);
    jobs.set(jobId, { abort: false });
    patchRun(get, set, { status: "queued", jobId, logTail: [] });
    let cursor = 0;
    while (!jobs.get(jobId)?.abort) {
      await sleep(POLL_MS);
      let status: CfdJobState;
      try {
        const st = await pollStatus(jobId);
        status = st.status;
        if (st.error) set({ error: st.error });
      } catch (err) {
        patchRun(get, set, {
          status: "failed",
        });
        set({
          error: err instanceof Error ? err.message : String(err),
          busy: false,
        });
        return;
      }
      try {
        const log = await fetchLog(jobId, cursor);
        cursor = log.cursor;
        if (log.lines.length > 0) {
          const s2 = get();
          const cur = s2.doc.cfds.find((c) => c.id === s2.activeCfdId);
          const prev = cur?.run.logTail ?? [];
          patchRun(get, set, {
            status: status as CfdRunStatus,
            logTail: [...prev, ...log.lines].slice(-200),
          });
        } else {
          patchRun(get, set, { status: status as CfdRunStatus });
        }
      } catch {
        patchRun(get, set, { status: status as CfdRunStatus });
      }
      if (status === "done") {
        try {
          const result = await fetchResult(jobId);
          patchRun(get, set, {
            status: "done",
            results: {
              summary: result.summary,
              p: result.p,
              magU: result.magU,
            },
          });
        } catch (err) {
          patchRun(get, set, { status: "done" });
          set({ error: err instanceof Error ? err.message : String(err) });
        }
        set({ busy: false });
        return;
      }
      if (status === "failed") {
        patchRun(get, set, { status: "failed" });
        set({ busy: false });
        return;
      }
    }
    set({ busy: false });
  } catch (err) {
    patchRun(get, set, { status: "failed" });
    set({
      error: err instanceof Error ? err.message : String(err),
      busy: false,
    });
  }
}

export async function cancelActive(get: Get, set: Set): Promise<void> {
  const s = get();
  const cfd = s.doc.cfds.find((c) => c.id === s.activeCfdId);
  const jobId = cfd?.run.jobId;
  if (!jobId) return;
  const rec = jobs.get(jobId);
  if (rec) rec.abort = true;
  try {
    await cancelRun(jobId);
  } catch {
    // ignore — local abort still stops polling
  }
  patchRun(get, set, { status: "idle" });
  set({ busy: false });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
