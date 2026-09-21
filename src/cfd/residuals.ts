/**
 * Parse SIMPLE/PIMPLE residual lines from an OpenFOAM solver log.
 *
 * Typical line:
 *   Solving for p, Initial residual = 0.12, Final residual = 0.001, No Iterations 12
 * Time = 5
 */
export interface ResidualSample {
  iter: number;
  p: number;
  U: number;
}

const TIME_RE = /^\s*Time\s*=\s*([0-9.eE+-]+)/;
const SOLVE_RE =
  /Solving for (p|Ux|Uy|Uz|U), Initial residual = ([0-9.eE+-]+)/;

export function parseResiduals(lines: string[]): ResidualSample[] {
  const out: ResidualSample[] = [];
  let iter = 0;
  let p = NaN;
  let ux = NaN;
  let uy = NaN;
  let uz = NaN;
  let u = NaN;
  const flush = () => {
    const U = Number.isFinite(u)
      ? u
      : Math.max(
          Number.isFinite(ux) ? ux : 0,
          Number.isFinite(uy) ? uy : 0,
          Number.isFinite(uz) ? uz : 0,
        );
    if (Number.isFinite(p) || U > 0) {
      out.push({ iter, p: Number.isFinite(p) ? p : 0, U });
    }
    p = ux = uy = uz = u = NaN;
  };
  for (const line of lines) {
    const tm = TIME_RE.exec(line);
    if (tm) {
      if (iter > 0) flush();
      iter = Number(tm[1]);
      continue;
    }
    const sm = SOLVE_RE.exec(line);
    if (!sm) continue;
    const val = Number(sm[2]);
    if (sm[1] === "p") p = val;
    else if (sm[1] === "U") u = val;
    else if (sm[1] === "Ux") ux = val;
    else if (sm[1] === "Uy") uy = val;
    else if (sm[1] === "Uz") uz = val;
  }
  if (iter > 0) flush();
  return out;
}
