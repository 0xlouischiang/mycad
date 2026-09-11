/**
 * In-house 2D sketch constraint solver.
 *
 * Approach: treat the sketch as a nonlinear least-squares problem. Each
 * constraint contributes one or more scalar *residuals* r_i(x) that should be
 * driven to zero, where x is the flat vector of all free point coordinates
 * (and free circle radii). We minimise sum(r_i^2) with a damped Gauss-Newton
 * (Levenberg-Marquardt) iteration:
 *
 *     (JᵀJ + λI) Δx = −Jᵀr
 *
 * The Jacobian J is computed numerically (central differences). This is more
 * than fast enough for MVP-sized sketches (tens of points) and avoids
 * hand-deriving analytic gradients for every constraint type — a deliberate
 * simplicity-over-speed tradeoff for the MVP.
 *
 * Damping (λ) makes it robust to redundant/over-constrained systems and near
 * singular configurations: it never blows up, it just makes limited progress.
 * We adapt λ Marquardt-style (shrink on success, grow on failure).
 *
 * Fixed points and, during dragging, the dragged point, are *pinned*: their
 * coordinates are excluded from x so the solver moves everything else to
 * satisfy constraints while honoring the user's cursor.
 *
 * NO external dependencies (per project constraints). Small dense linear
 * algebra is implemented inline.
 */
import type {
  ArcEntity,
  CircleEntity,
  LineEntity,
  Sketch,
  SketchEntity,
  SketchPoint,
} from "../model/sketch";

export interface SolveOptions {
  /** Point ids to hold fixed for this solve (in addition to point.fixed). */
  pinned?: string[];
  maxIterations?: number;
  /** Convergence threshold on the max absolute residual. */
  tolerance?: number;
  /**
   * Weight (w²) of the weak "stay near start" regularization. Tiny by default
   * so it only breaks ties in under-constrained systems (prefer rotating a line
   * over collapsing it) without biasing dimensioned constraints. Exposed mainly
   * for tuning/tests.
   */
  regularization?: number;
}

export interface SolveResult {
  converged: boolean;
  iterations: number;
  /** Max absolute residual at the end. */
  residual: number;
  /** True if the system appears over/under-constrained (diagnostic only). */
  dof: number;
}

/**
 * A variable in the solve vector. Points contribute two variables (u, v);
 * circles contribute one (radius). We index by a stable key so residual
 * functions can read/write the working vector.
 */
interface VarMap {
  /** key -> index in x */
  index: Map<string, number>;
  /** parallel list of keys for writing back */
  keys: string[];
}

const U = (pid: string) => `${pid}.u`;
const V = (pid: string) => `${pid}.v`;
const R = (eid: string) => `${eid}.r`;

/** Solve the sketch in place, mutating point coords and circle radii. */
export function solveSketch(
  sketch: Sketch,
  options: SolveOptions = {},
): SolveResult {
  const maxIterations = options.maxIterations ?? 60;
  const tolerance = options.tolerance ?? 1e-7;
  const pinned = new Set(options.pinned ?? []);

  const pointById = new Map(sketch.points.map((p) => [p.id, p]));
  const entityById = new Map(sketch.entities.map((e) => [e.id, e]));

  // Build the variable map: free point coords + free circle radii.
  const vars: VarMap = { index: new Map(), keys: [] };
  const addVar = (key: string) => {
    if (!vars.index.has(key)) {
      vars.index.set(key, vars.keys.length);
      vars.keys.push(key);
    }
  };
  for (const p of sketch.points) {
    if (p.fixed || pinned.has(p.id)) continue;
    addVar(U(p.id));
    addVar(V(p.id));
  }
  for (const e of sketch.entities) {
    if (e.type === "circle") addVar(R(e.id));
  }

  const n = vars.keys.length;

  // Working coordinate store, seeded from the current sketch state. Residual
  // evaluation reads from here; fixed/pinned values come straight from the
  // sketch objects.
  const work = new Map<string, number>();
  for (const p of sketch.points) {
    work.set(U(p.id), p.u);
    work.set(V(p.id), p.v);
  }
  for (const e of sketch.entities) {
    if (e.type === "circle") work.set(R(e.id), e.radius);
  }

  // x is the free-variable vector; read/write helpers sync it with `work`.
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = work.get(vars.keys[i])!;

  const syncWorkFromX = () => {
    for (let i = 0; i < n; i++) work.set(vars.keys[i], x[i]);
  };

  const residualFns = buildResiduals(sketch, pointById, entityById);
  const m = residualFns.length;

  const evalResiduals = (): Float64Array => {
    syncWorkFromX();
    const r = new Float64Array(m);
    const getU = (pid: string) => work.get(U(pid))!;
    const getV = (pid: string) => work.get(V(pid))!;
    const getR = (eid: string) => work.get(R(eid))!;
    for (let i = 0; i < m; i++) r[i] = residualFns[i](getU, getV, getR);
    return r;
  };

  const maxAbs = (r: Float64Array): number => {
    let mx = 0;
    for (let i = 0; i < r.length; i++) mx = Math.max(mx, Math.abs(r[i]));
    return mx;
  };

  const dof = 2 * countFreePoints(sketch, pinned) - m; // rough DOF estimate

  if (n === 0 || m === 0) {
    // Nothing to solve (no free vars or no constraints). Still write back.
    writeBack(sketch, work);
    return { converged: true, iterations: 0, residual: maxAbs(evalResiduals()), dof };
  }

  // Weak Tikhonov regularization anchoring each free variable to its value at
  // the START of this solve. This resolves the null space of under-constrained
  // systems by preferring the minimal-change solution: a lone "perpendicular"
  // rotates a line rather than collapsing it toward the origin (both drive the
  // residual to zero, but only collapse is degenerate). The weight is tiny so
  // it never prevents constraints from being fully satisfied — it only picks
  // *which* satisfying configuration when several exist. This is the same trick
  // production sketch solvers use to keep dragging stable.
  const x0 = x.slice();
  const REG = options.regularization ?? 1e-8; // regularization weight (w²)

  let lambda = 1e-3;
  let r = evalResiduals();
  let cost = dot(r, r);
  let iter = 0;

  for (; iter < maxIterations; iter++) {
    if (maxAbs(r) < tolerance) break;

    // Numerical Jacobian J (m x n) via central differences.
    const J = numericJacobian(x, n, m, evalResiduals);

    // Normal equations: A = JᵀJ + λ diag, g = Jᵀr.
    const A = new Float64Array(n * n);
    const g = new Float64Array(n);
    for (let i = 0; i < m; i++) {
      for (let a = 0; a < n; a++) {
        const jia = J[i * n + a];
        if (jia === 0) continue;
        g[a] += jia * r[i];
        for (let b = 0; b < n; b++) {
          A[a * n + b] += jia * J[i * n + b];
        }
      }
    }

    // Add the regularization normal-equation contribution: for residual
    // w*(x_a - x0_a), the JᵀJ diagonal gains w² and Jᵀr gains w²*(x_a - x0_a).
    for (let a = 0; a < n; a++) {
      A[a * n + a] += REG;
      g[a] += REG * (x[a] - x0[a]);
    }

    // Try steps, adapting lambda until cost decreases or we give up.
    let stepAccepted = false;
    for (let tries = 0; tries < 8; tries++) {
      const Adamped = A.slice();
      // Uniform (Levenberg) damping: add lambda to EVERY diagonal, not
      // lambda*A[d,d] (Marquardt). Marquardt scaling leaves null-space
      // directions — where A[d,d]≈0, e.g. the degenerate collapse mode of a
      // lone perpendicular — nearly undamped, so the linear solve goes
      // singular and the iteration stalls. Uniform damping floors all
      // directions, keeping the step well-defined; the tiny REG term then only
      // breaks the residual-zero tie toward the minimal-change configuration.
      for (let d = 0; d < n; d++) Adamped[d * n + d] += lambda;

      const delta = solveLinear(Adamped, g, n); // solves Adamped * delta = g
      if (!delta) {
        lambda *= 10;
        continue;
      }

      const xNew = new Float64Array(n);
      for (let i = 0; i < n; i++) xNew[i] = x[i] - delta[i]; // step = -delta

      // Evaluate cost at xNew.
      for (let i = 0; i < n; i++) x[i] = xNew[i];
      const rNew = evalResiduals();
      const costNew = dot(rNew, rNew);

      if (costNew < cost) {
        // Accept: keep xNew, relax damping.
        r = rNew;
        cost = costNew;
        lambda = Math.max(lambda * 0.5, 1e-9);
        stepAccepted = true;
        break;
      } else {
        // Reject: restore x, increase damping, retry.
        for (let i = 0; i < n; i++) x[i] = xNew[i] + delta[i];
        lambda *= 4;
      }
    }

    if (!stepAccepted) break; // no progress possible
  }

  syncWorkFromX();
  writeBack(sketch, work);

  const finalResidual = maxAbs(r);
  return {
    converged: finalResidual < tolerance * 100, // generous: near-satisfied
    iterations: iter,
    residual: finalResidual,
    dof,
  };
}

// ---------------------------------------------------------------------------
// Residual construction
// ---------------------------------------------------------------------------

type Getter = (id: string) => number;
type ResidualFn = (u: Getter, v: Getter, r: Getter) => number;

function buildResiduals(
  sketch: Sketch,
  pointById: Map<string, SketchPoint>,
  entityById: Map<string, SketchEntity>,
): ResidualFn[] {
  const fns: ResidualFn[] = [];
  const line = (id: string) => entityById.get(id) as LineEntity | undefined;

  for (const c of sketch.constraints) {
    switch (c.type) {
      case "coincident": {
        const { p1, p2 } = c;
        fns.push((u) => u(p1) - u(p2));
        fns.push((_, v) => v(p1) - v(p2));
        break;
      }
      case "horizontal": {
        const l = line(c.entity);
        if (!l) break;
        fns.push((_, v) => v(l.p1) - v(l.p2)); // same v => horizontal
        break;
      }
      case "vertical": {
        const l = line(c.entity);
        if (!l) break;
        fns.push((u) => u(l.p1) - u(l.p2)); // same u => vertical
        break;
      }
      case "parallel": {
        const a = line(c.a);
        const b = line(c.b);
        if (!a || !b) break;
        // cross product of direction vectors == 0
        fns.push((u, v) => {
          const ax = u(a.p2) - u(a.p1);
          const ay = v(a.p2) - v(a.p1);
          const bx = u(b.p2) - u(b.p1);
          const by = v(b.p2) - v(b.p1);
          return ax * by - ay * bx;
        });
        break;
      }
      case "perpendicular": {
        const a = line(c.a);
        const b = line(c.b);
        if (!a || !b) break;
        // dot product of direction vectors == 0
        fns.push((u, v) => {
          const ax = u(a.p2) - u(a.p1);
          const ay = v(a.p2) - v(a.p1);
          const bx = u(b.p2) - u(b.p1);
          const by = v(b.p2) - v(b.p1);
          return ax * bx + ay * by;
        });
        break;
      }
      case "equalLength": {
        const a = line(c.a);
        const b = line(c.b);
        if (!a || !b) break;
        // squared-length difference (smooth, avoids sqrt near zero)
        fns.push((u, v) => {
          const la =
            (u(a.p2) - u(a.p1)) ** 2 + (v(a.p2) - v(a.p1)) ** 2;
          const lb =
            (u(b.p2) - u(b.p1)) ** 2 + (v(b.p2) - v(b.p1)) ** 2;
          return la - lb;
        });
        break;
      }
      case "distance": {
        const { p1, p2, value } = c;
        fns.push((u, v) => {
          const dx = u(p2) - u(p1);
          const dy = v(p2) - v(p1);
          return Math.sqrt(dx * dx + dy * dy) - value;
        });
        break;
      }
      case "angle": {
        const a = line(c.a);
        const b = line(c.b);
        if (!a || !b) break;
        const target = (c.value * Math.PI) / 180;
        fns.push((u, v) => {
          const ax = u(a.p2) - u(a.p1);
          const ay = v(a.p2) - v(a.p1);
          const bx = u(b.p2) - u(b.p1);
          const by = v(b.p2) - v(b.p1);
          const angA = Math.atan2(ay, ax);
          const angB = Math.atan2(by, bx);
          let diff = angB - angA - target;
          // wrap to [-pi, pi] so the residual is smooth across the branch cut
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          return diff;
        });
        break;
      }
      case "radius": {
        const e = entityById.get(c.entity);
        if (!e) break;
        if (e.type === "circle") {
          const circle = e as CircleEntity;
          fns.push((_u, _v, r) => r(circle.id) - c.value);
        } else if (e.type === "arc") {
          const arc = e as ArcEntity;
          // arc radius is |center - start|
          fns.push((u, v) => {
            const dx = u(arc.start) - u(arc.center);
            const dy = v(arc.start) - v(arc.center);
            return Math.sqrt(dx * dx + dy * dy) - c.value;
          });
        }
        break;
      }
      default: {
        const _never: never = c;
        void _never;
      }
    }
  }

  // Implicit arc constraint: start and end are equidistant from center, so the
  // arc stays circular as points move. Without this an arc's endpoints could
  // drift to different radii.
  for (const e of sketch.entities) {
    if (e.type === "arc") {
      const arc = e as ArcEntity;
      fns.push((u, v) => {
        const r1 =
          (u(arc.start) - u(arc.center)) ** 2 +
          (v(arc.start) - v(arc.center)) ** 2;
        const r2 =
          (u(arc.end) - u(arc.center)) ** 2 +
          (v(arc.end) - v(arc.center)) ** 2;
        return r1 - r2;
      });
    }
  }

  void pointById;
  return fns;
}

// ---------------------------------------------------------------------------
// Numerical linear algebra (small dense, no deps)
// ---------------------------------------------------------------------------

function numericJacobian(
  x: Float64Array,
  n: number,
  m: number,
  evalResiduals: () => Float64Array,
): Float64Array {
  const J = new Float64Array(m * n);
  const h = 1e-6;
  for (let a = 0; a < n; a++) {
    const x0 = x[a];
    x[a] = x0 + h;
    const rPlus = evalResiduals();
    x[a] = x0 - h;
    const rMinus = evalResiduals();
    x[a] = x0;
    const inv2h = 1 / (2 * h);
    for (let i = 0; i < m; i++) {
      J[i * n + a] = (rPlus[i] - rMinus[i]) * inv2h;
    }
  }
  return J;
}

function dot(a: Float64Array, b: Float64Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/**
 * Solve A x = b for x, where A is n×n row-major, via Gaussian elimination with
 * partial pivoting. Returns null if A is singular to working precision.
 */
function solveLinear(
  A: Float64Array,
  b: Float64Array,
  n: number,
): Float64Array | null {
  // Augmented copy.
  const M = new Float64Array(n * (n + 1));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) M[i * (n + 1) + j] = A[i * n + j];
    M[i * (n + 1) + n] = b[i];
  }

  for (let col = 0; col < n; col++) {
    // Partial pivot.
    let pivot = col;
    let maxVal = Math.abs(M[col * (n + 1) + col]);
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(M[row * (n + 1) + col]);
      if (val > maxVal) {
        maxVal = val;
        pivot = row;
      }
    }
    if (maxVal < 1e-12) return null; // singular

    if (pivot !== col) {
      for (let j = 0; j <= n; j++) {
        const tmp = M[col * (n + 1) + j];
        M[col * (n + 1) + j] = M[pivot * (n + 1) + j];
        M[pivot * (n + 1) + j] = tmp;
      }
    }

    // Eliminate.
    const diag = M[col * (n + 1) + col];
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row * (n + 1) + col] / diag;
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) {
        M[row * (n + 1) + j] -= factor * M[col * (n + 1) + j];
      }
    }
  }

  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = M[i * (n + 1) + n] / M[i * (n + 1) + i];
  return x;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countFreePoints(sketch: Sketch, pinned: Set<string>): number {
  return sketch.points.filter((p) => !p.fixed && !pinned.has(p.id)).length;
}

function writeBack(sketch: Sketch, work: Map<string, number>): void {
  for (const p of sketch.points) {
    const u = work.get(U(p.id));
    const v = work.get(V(p.id));
    if (u !== undefined) p.u = u;
    if (v !== undefined) p.v = v;
  }
  for (const e of sketch.entities) {
    if (e.type === "circle") {
      const r = work.get(R(e.id));
      if (r !== undefined) e.radius = Math.abs(r);
    }
  }
}
