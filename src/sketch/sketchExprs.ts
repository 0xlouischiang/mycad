/**
 * Variable-expression support for sketch dimensions (distance / angle /
 * radius). Pure — shared by the sketch store (editing) and the main store
 * (re-solving sketches before regeneration when variables change).
 *
 * Input rule (applies to typed literals and expressions alike): the user
 * enters a MAGNITUDE n. Aligned distances and radii require n ≥ 0. For
 * horizontal/vertical distances the stored solver value is dir·n, where dir is
 * the side the dimension was placed on — so editing never flips the side,
 * and a negative n deliberately moves p2 to the other side of p1.
 */
import { evalExpr, type VarScope } from "../model/expr";
import { distanceAxis, type Constraint, type Sketch } from "../model/sketch";

export type DimValue = { ok: true; value: number; expr?: string } | { ok: false; error: string };

/** Parse user input: a plain number, or an expression over the variables. */
export function parseDimInput(raw: string, scope: VarScope): DimValue {
  const text = raw.trim();
  if (text === "") return { ok: false, error: "Enter a value" };
  const literal = Number(text);
  if (Number.isFinite(literal)) return { ok: true, value: literal };
  try {
    const value = evalExpr(text, scope);
    if (!Number.isFinite(value)) return { ok: false, error: `"${text}" is not a finite number` };
    return { ok: true, value, expr: text };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

type Dimensional = Extract<Constraint, { type: "distance" | "angle" | "radius" }>;

export function isDimensional(c: Constraint): c is Dimensional {
  return c.type === "distance" || c.type === "angle" || c.type === "radius";
}

/** Validate a magnitude for a constraint kind; returns an error or null. */
export function magnitudeError(c: Dimensional, n: number): string | null {
  if (c.type === "radius" && n <= 0) return "Radius must be greater than 0";
  if (c.type === "distance" && distanceAxis(c) === "aligned" && n < 0) {
    return "Distance must be ≥ 0 (use a horizontal/vertical distance for a signed offset)";
  }
  return null;
}

/** Solver value for a user magnitude (applies the stored side for x/y). */
export function storedValue(c: Dimensional, n: number): number {
  if (c.type === "distance" && distanceAxis(c) !== "aligned") return (c.dir ?? 1) * n;
  return n;
}

/** The magnitude shown to the user for a constraint's stored value. */
export function displayValue(c: Dimensional): number {
  if (c.type === "distance" && distanceAxis(c) !== "aligned") return Math.abs(c.value);
  return c.value;
}

/**
 * Re-evaluate every expression-driven dimension in place. Returns true if any
 * value changed (caller re-solves). An expression that fails, or yields an
 * invalid magnitude, keeps the last good value — same graceful degradation as
 * feature-param expressions.
 */
export function applySketchExprs(sketch: Sketch, scope: VarScope): boolean {
  let changed = false;
  for (const c of sketch.constraints) {
    if (!isDimensional(c) || !c.expr) continue;
    const r = parseDimInput(c.expr, scope);
    if (!r.ok || magnitudeError(c, r.value)) continue;
    const next = storedValue(c, r.value);
    if (next !== c.value) {
      c.value = next;
      changed = true;
    }
  }
  return changed;
}

export function sketchHasExprs(sketch: Sketch): boolean {
  return sketch.constraints.some((c) => isDimensional(c) && !!c.expr);
}
