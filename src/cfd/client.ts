/**
 * Browser client for the local /api/cfd job service.
 */
export type CfdJobState = "queued" | "meshing" | "solving" | "done" | "failed";

export interface SubmitResponse {
  jobId: string;
}

export interface StatusResponse {
  status: CfdJobState;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
}

export interface LogResponse {
  lines: string[];
  cursor: number;
}

export interface ResultResponse {
  summary: Record<string, number>;
  p: number[];
  magU: number[];
}

async function json<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `CFD API ${res.status}`);
  }
  return data;
}

export async function submitCase(
  files: Record<string, string>,
  solver: "simpleFoam" | "pimpleFoam",
): Promise<SubmitResponse> {
  const res = await fetch("/api/cfd/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ files, solver }),
  });
  return json<SubmitResponse>(res);
}

export async function pollStatus(jobId: string): Promise<StatusResponse> {
  const res = await fetch(`/api/cfd/status/${encodeURIComponent(jobId)}`);
  return json<StatusResponse>(res);
}

export async function fetchLog(jobId: string, cursor = 0): Promise<LogResponse> {
  const res = await fetch(
    `/api/cfd/log/${encodeURIComponent(jobId)}?cursor=${cursor}`,
  );
  return json<LogResponse>(res);
}

export async function fetchResult(jobId: string): Promise<ResultResponse> {
  const res = await fetch(`/api/cfd/result/${encodeURIComponent(jobId)}`);
  return json<ResultResponse>(res);
}

export async function cancelRun(jobId: string): Promise<void> {
  const res = await fetch(`/api/cfd/cancel/${encodeURIComponent(jobId)}`, {
    method: "POST",
  });
  await json<{ ok: boolean }>(res);
}
