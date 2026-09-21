/**
 * In-process OpenFOAM job runner (FIFO, concurrency 1).
 *
 * Invokes a pinned-version Docker image with a fixed argv — never interpolates
 * user text into a shell. Case files are re-validated before write.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm, readFile, readdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, posix } from "node:path";
import { randomUUID } from "node:crypto";

export type JobStatus = "queued" | "meshing" | "solving" | "done" | "failed";
export type FoamSolver = "simpleFoam" | "pimpleFoam";

export interface CfdJob {
  id: string;
  status: JobStatus;
  solver: FoamSolver;
  startedAt: number | null;
  finishedAt: number | null;
  error: string | null;
  log: string[];
  logCursor: number;
  summary: Record<string, number> | null;
  p: number[] | null;
  magU: number[] | null;
  containerName: string;
  caseDir: string;
  cancelled: boolean;
}

const ALLOW_PREFIX = ["0/", "constant/", "system/"];
const ALLOW_FILES = new Set(["Allrun", "Allclean"]);
const STL_MAX = 25 * 1024 * 1024;
const LOG_CAP = 200;
const WALL_MS = 30 * 60 * 1000;
const DEFAULT_IMAGE = "openfoam/openfoam11-paraviewopenfoam";

const jobs = new Map<string, CfdJob>();
const queue: string[] = [];
let running: string | null = null;

export function getJob(id: string): CfdJob | undefined {
  return jobs.get(id);
}

export function dockerImage(env: Record<string, string | undefined> = process.env): string {
  return env.OPENFOAM_IMAGE || DEFAULT_IMAGE;
}

export async function dockerAvailable(): Promise<boolean> {
  try {
    const { code } = await runCmd("docker", ["info"], 8000);
    return code === 0;
  } catch {
    return false;
  }
}

export function validateFileMap(
  files: Record<string, string>,
  solver: unknown,
): { ok: true; solver: FoamSolver } | { ok: false; error: string } {
  if (solver !== "simpleFoam" && solver !== "pimpleFoam") {
    return { ok: false, error: "solver must be simpleFoam or pimpleFoam" };
  }
  if (!files || typeof files !== "object") {
    return { ok: false, error: "files map is required" };
  }
  const keys = Object.keys(files);
  if (keys.length === 0) return { ok: false, error: "files map is empty" };
  for (const key of keys) {
    if (key.includes("..") || key.startsWith("/") || key.includes("\\")) {
      return { ok: false, error: `illegal path "${key}"` };
    }
    const allowed =
      ALLOW_FILES.has(key) || ALLOW_PREFIX.some((p) => key.startsWith(p));
    if (!allowed) return { ok: false, error: `path not allowlisted: ${key}` };
    const content = files[key];
    if (typeof content !== "string") {
      return { ok: false, error: `file "${key}" is not text` };
    }
    if (key.endsWith(".stl") && content.length > STL_MAX) {
      return { ok: false, error: `STL too large (${content.length} bytes)` };
    }
  }
  if (!files["system/controlDict"]) {
    return { ok: false, error: "missing system/controlDict" };
  }
  if (!files["constant/triSurface/geometry.stl"]) {
    return { ok: false, error: "missing constant/triSurface/geometry.stl" };
  }
  const u = files["0/U"] ?? "";
  if (!/\binlet\b/.test(u) || !/\boutlet\b/.test(u)) {
    // freestream also counts as both
    if (!/\bfreestream\b/.test(u) && !/type\s+freestream/.test(u)) {
      return { ok: false, error: "0/U must define an inlet and an outlet (or freestream)" };
    }
  }
  return { ok: true, solver };
}

export async function enqueue(
  files: Record<string, string>,
  solver: FoamSolver,
  env: Record<string, string | undefined> = process.env,
): Promise<{ ok: true; jobId: string } | { ok: false; status: number; error: string }> {
  if (!(await dockerAvailable())) {
    return {
      ok: false,
      status: 503,
      error:
        "Docker is not running. Download the case zip and run it locally, or start Docker Desktop.",
    };
  }
  const id = randomUUID();
  const caseDir = join(tmpdir(), "mycad-cfd", id);
  const job: CfdJob = {
    id,
    status: "queued",
    solver,
    startedAt: null,
    finishedAt: null,
    error: null,
    log: [],
    logCursor: 0,
    summary: null,
    p: null,
    magU: null,
    containerName: `mycad-cfd-${id.slice(0, 8)}`,
    caseDir,
    cancelled: false,
  };
  jobs.set(id, job);
  try {
    await writeCase(caseDir, files);
  } catch (err) {
    job.status = "failed";
    job.error = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 500, error: job.error };
  }
  queue.push(id);
  void pump(env);
  return { ok: true, jobId: id };
}

export async function cancel(id: string): Promise<boolean> {
  const job = jobs.get(id);
  if (!job) return false;
  job.cancelled = true;
  if (job.status === "queued") {
    const i = queue.indexOf(id);
    if (i >= 0) queue.splice(i, 1);
    job.status = "failed";
    job.error = "cancelled";
    job.finishedAt = Date.now();
    return true;
  }
  try {
    await runCmd("docker", ["kill", job.containerName], 10000);
  } catch {
    // already gone
  }
  job.status = "failed";
  job.error = "cancelled";
  job.finishedAt = Date.now();
  return true;
}

async function pump(env: Record<string, string | undefined>): Promise<void> {
  if (running) return;
  const next = queue.shift();
  if (!next) return;
  running = next;
  const job = jobs.get(next);
  if (!job || job.cancelled) {
    running = null;
    void pump(env);
    return;
  }
  try {
    await execute(job, env);
  } catch (err) {
    job.status = "failed";
    job.error = err instanceof Error ? err.message : String(err);
    appendLog(job, job.error);
  } finally {
    job.finishedAt = Date.now();
    running = null;
    void pump(env);
  }
}

async function execute(
  job: CfdJob,
  env: Record<string, string | undefined>,
): Promise<void> {
  job.startedAt = Date.now();
  const image = dockerImage(env);
  // One owned script, no user interpolation. Foundation images source bashrc.
  const script = [
    "set -e",
    "if [ -f /opt/openfoam11/etc/bashrc ]; then . /opt/openfoam11/etc/bashrc; fi",
    "if [ -f /usr/lib/openfoam/openfoam11/etc/bashrc ]; then . /usr/lib/openfoam/openfoam11/etc/bashrc; fi",
    "blockMesh",
    "snappyHexMesh -overwrite",
    job.solver,
  ].join(" && ");

  job.status = "meshing";
  // --entrypoint bash so we don't fight images that wrap an `openfoam` entrypoint.
  // No --user: official Foundation images typically need to source bashrc as the
  // image's default user, and macOS Docker volume perms break uid 1000.
  const args = [
    "run",
    "--name",
    job.containerName,
    "--rm",
    "--network",
    "none",
    "--memory",
    "4g",
    "--cpus",
    "2",
    "-v",
    `${job.caseDir}:/case:rw`,
    "--tmpfs",
    "/tmp",
    "--workdir",
    "/case",
    "--entrypoint",
    "bash",
    image,
    "-lc",
    script,
  ];
  const { code, lines } = await runCmd("docker", args, WALL_MS, (line) => {
    appendLog(job, line);
    if (/snappyHexMesh|Check mesh/i.test(line)) job.status = "meshing";
    if (new RegExp(job.solver).test(line) || /Time\s*=/.test(line)) job.status = "solving";
    if (job.cancelled) {
      void runCmd("docker", ["kill", job.containerName], 5000);
    }
  });
  if (job.cancelled) {
    job.status = "failed";
    job.error = "cancelled";
    return;
  }
  if (code !== 0) {
    job.status = "failed";
    job.error = `solver exited ${code}`;
    appendLog(job, job.error);
    return;
  }
  const parsed = await parseResults(job.caseDir);
  job.summary = parsed.summary;
  job.p = parsed.p;
  job.magU = parsed.magU;
  job.status = "done";
  void lines;
}

function appendLog(job: CfdJob, line: string): void {
  job.log.push(line);
  if (job.log.length > LOG_CAP * 4) {
    job.log = job.log.slice(-LOG_CAP * 2);
  }
}

async function writeCase(dir: string, files: Record<string, string>): Promise<void> {
  await mkdir(dir, { recursive: true });
  for (const [rel, content] of Object.entries(files)) {
    const dest = join(dir, ...rel.split("/"));
    await mkdir(dirname(dest), { recursive: true });
    const mode = rel === "Allrun" || rel === "Allclean" ? 0o755 : 0o644;
    await writeFile(dest, content, { encoding: "utf8", mode });
  }
}

export async function parseResults(caseDir: string): Promise<{
  summary: Record<string, number>;
  p: number[];
  magU: number[];
}> {
  const summary: Record<string, number> = {};
  const coeff = await findFile(caseDir, /coefficient\.dat$/);
  if (coeff) {
    const text = await readFile(coeff, "utf8");
    const last = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .pop();
    if (last) {
      const cols = last.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n));
      // Foundation forceCoeffs.dat typically: time Cd Cl Cm ...
      if (cols.length >= 3) {
        summary.Cd = cols[1];
        summary.Cl = cols[2];
        if (cols.length >= 4) summary.Cm = cols[3];
      }
    }
  }
  const pFile = await findFile(caseDir, /(?:^|\/)p(_raw)?$/);
  const uFile = await findFile(caseDir, /(?:^|\/)U(_raw)?$/);
  let p: number[] = [];
  let magU: number[] = [];
  if (pFile) p = parseScalarRaw(await readFile(pFile, "utf8"));
  if (uFile) magU = parseVectorMagRaw(await readFile(uFile, "utf8"));
  const vtk = await findFile(caseDir, /\.vtk$/);
  if ((p.length === 0 || magU.length === 0) && vtk) {
    const parsed = parseVtkAscii(await readFile(vtk, "utf8"));
    if (p.length === 0) p = parsed.p;
    if (magU.length === 0) magU = parsed.magU;
  }
  if (p.length && magU.length) {
    const dp = p.length ? Math.max(...p) - Math.min(...p) : 0;
    summary.deltaP = dp;
    if (magU.length) {
      summary.meanMagU = magU.reduce((a, b) => a + b, 0) / magU.length;
    }
  }
  return { summary, p, magU };
}

async function findFile(root: string, re: RegExp): Promise<string | null> {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    let entries: string[] = [];
    try {
      entries = await readdir(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = join(dir, name);
      let st;
      try {
        st = await stat(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) stack.push(full);
      else if (re.test(posix.join(dir.replace(/\\/g, "/"), name)) || re.test(name)) {
        return full;
      }
    }
  }
  return null;
}

/** OpenFOAM `surfaceFormat raw` scalar: "# x y z p" then rows. */
export function parseScalarRaw(text: string): number[] {
  const out: number[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const cols = t.split(/\s+/);
    const v = Number(cols[cols.length - 1]);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

export function parseVectorMagRaw(text: string): number[] {
  const out: number[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const cols = t.split(/\s+/).map(Number);
    if (cols.length >= 6) {
      const ux = cols[cols.length - 3];
      const uy = cols[cols.length - 2];
      const uz = cols[cols.length - 1];
      out.push(Math.hypot(ux, uy, uz));
    }
  }
  return out;
}

/** Minimal ASCII VTK POLYDATA POINT_DATA reader (no vtk.js). */
export function parseVtkAscii(text: string): { p: number[]; magU: number[] } {
  const lines = text.split(/\r?\n/);
  let nPoints = 0;
  const p: number[] = [];
  const magU: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i].trim();
    const pm = /^POINTS\s+(\d+)/i.exec(ln);
    if (pm) nPoints = Number(pm[1]);
    const sm = /^SCALARS\s+(\S+)/i.exec(ln);
    if (sm && /^(p|pressure)$/i.test(sm[1])) {
      if (/^LOOKUP_TABLE/i.test((lines[i + 1] ?? "").trim())) i++;
      for (let k = 0; k < nPoints && i + 1 < lines.length; k++) {
        i++;
        const v = Number(lines[i].trim().split(/\s+/)[0]);
        if (Number.isFinite(v)) p.push(v);
      }
    }
    const vm = /^VECTORS\s+(\S+)/i.exec(ln);
    if (vm && /^U$/i.test(vm[1])) {
      for (let k = 0; k < nPoints && i + 1 < lines.length; k++) {
        i++;
        const cols = lines[i].trim().split(/\s+/).map(Number);
        if (cols.length >= 3) magU.push(Math.hypot(cols[0], cols[1], cols[2]));
      }
    }
  }
  return { p, magU };
}

function runCmd(
  cmd: string,
  args: string[],
  timeoutMs: number,
  onLine?: (line: string) => void,
): Promise<{ code: number; lines: string[] }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const lines: string[] = [];
    const take = (buf: Buffer) => {
      const text = buf.toString("utf8");
      for (const line of text.split(/\r?\n/)) {
        if (!line) continue;
        lines.push(line);
        onLine?.(line);
      }
    };
    child.stdout?.on("data", take);
    child.stderr?.on("data", take);
    const t = setTimeout(() => {
      child.kill("SIGKILL");
    }, timeoutMs);
    child.on("error", (err) => {
      clearTimeout(t);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(t);
      resolve({ code: code ?? 1, lines });
    });
  });
}

/** Test helper: wipe in-memory jobs (does not touch disk). */
export function _resetJobsForTests(): void {
  jobs.clear();
  queue.length = 0;
  running = null;
}

export async function cleanupCase(dir: string): Promise<void> {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
