/**
 * Runtime-agnostic CFD job API (submit / status / log / result / cancel).
 *
 * Mirrors api/chat.ts: plain request-in, {status,body}-out so Vite middleware
 * and a later long-running deploy can share the handler. OpenFOAM itself runs
 * in Docker via cfdRunner.ts — never in this process.
 */
import {
  validateFileMap,
  enqueue,
  getJob,
  cancel,
  type JobStatus,
} from "./cfdRunner";

export interface CfdRequest {
  method: string;
  path: string; // remaining path after /api/cfd
  body?: unknown;
  query?: Record<string, string>;
}

export interface HandlerResponse {
  status: number;
  body: unknown;
}

export async function handleCfd(
  req: CfdRequest,
  env: Record<string, string | undefined> = {},
): Promise<HandlerResponse> {
  const method = (req.method || "GET").toUpperCase();
  const path = normalize(req.path);

  if (method === "POST" && path === "/submit") {
    const body = (req.body ?? {}) as { files?: Record<string, string>; solver?: unknown };
    const check = validateFileMap(body.files ?? {}, body.solver);
    if (!check.ok) return { status: 400, body: { error: check.error } };
    const result = await enqueue(body.files!, check.solver, env);
    if (!result.ok) return { status: result.status, body: { error: result.error } };
    return { status: 200, body: { jobId: result.jobId } };
  }

  const statusMatch = /^\/status\/([^/]+)$/.exec(path);
  if (method === "GET" && statusMatch) {
    const job = getJob(statusMatch[1]);
    if (!job) return { status: 404, body: { error: "unknown jobId" } };
    return {
      status: 200,
      body: {
        status: job.status as JobStatus,
        startedAt: job.startedAt ?? undefined,
        finishedAt: job.finishedAt ?? undefined,
        error: job.error ?? undefined,
      },
    };
  }

  const logMatch = /^\/log\/([^/]+)$/.exec(path);
  if (method === "GET" && logMatch) {
    const job = getJob(logMatch[1]);
    if (!job) return { status: 404, body: { error: "unknown jobId" } };
    const cursor = Number(req.query?.cursor ?? 0) || 0;
    const lines = job.log.slice(cursor);
    return { status: 200, body: { lines, cursor: job.log.length } };
  }

  const resultMatch = /^\/result\/([^/]+)$/.exec(path);
  if (method === "GET" && resultMatch) {
    const job = getJob(resultMatch[1]);
    if (!job) return { status: 404, body: { error: "unknown jobId" } };
    if (job.status !== "done") {
      return { status: 409, body: { error: `job is ${job.status}` } };
    }
    return {
      status: 200,
      body: {
        summary: job.summary ?? {},
        p: job.p ?? [],
        magU: job.magU ?? [],
      },
    };
  }

  const cancelMatch = /^\/cancel\/([^/]+)$/.exec(path);
  if (method === "POST" && cancelMatch) {
    const ok = await cancel(cancelMatch[1]);
    if (!ok) return { status: 404, body: { error: "unknown jobId" } };
    return { status: 200, body: { ok: true } };
  }

  return { status: 404, body: { error: "not found" } };
}

function normalize(p: string): string {
  if (!p) return "/";
  return p.startsWith("/") ? p : `/${p}`;
}
