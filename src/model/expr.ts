/**
 * Safe expression evaluator for parametric dimensions and variables.
 *
 * Onshape lets dimensions be expressions referencing named variables
 * (e.g. `#width / 2 + 5`). We implement a small recursive-descent parser +
 * evaluator — deliberately NOT `eval`/`Function`, which would be an
 * arbitrary-code-execution hole for persisted documents loaded from IndexedDB.
 *
 * Grammar (standard precedence):
 *   expr    := term (('+' | '-') term)*
 *   term    := power (('*' | '/') power)*
 *   power   := unary ('^' power)?        // right-associative
 *   unary   := ('-' | '+') unary | atom
 *   atom    := number | '#'ident | ident '(' args ')' | ident | '(' expr ')'
 *
 * Variable references use a leading `#` (Onshape style) OR a bare identifier;
 * both resolve against the provided variable map. Supported functions:
 * sqrt, abs, sin, cos, tan, min, max, floor, ceil, round. Constants: pi, e.
 * Angles for trig are in DEGREES (CAD convention).
 */

export type VarScope = Record<string, number>;

const FUNCS: Record<string, (...a: number[]) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sin: (d) => Math.sin((d * Math.PI) / 180),
  cos: (d) => Math.cos((d * Math.PI) / 180),
  tan: (d) => Math.tan((d * Math.PI) / 180),
  min: Math.min,
  max: Math.max,
};

const CONSTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

/** Evaluate an expression string against a variable scope. Throws on error. */
export function evalExpr(input: string, scope: VarScope = {}): number {
  return new Parser(input, scope).parse();
}

/**
 * Try to evaluate; return the number, or null if it doesn't parse / references
 * an unknown variable. Convenience for UI that wants a soft failure.
 */
export function tryEvalExpr(input: string, scope: VarScope = {}): number | null {
  try {
    const v = evalExpr(input, scope);
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

class Parser {
  private pos = 0;
  private readonly s: string;
  private readonly scope: VarScope;
  constructor(s: string, scope: VarScope) {
    this.s = s;
    this.scope = scope;
  }

  parse(): number {
    const v = this.expr();
    this.skipWs();
    if (this.pos < this.s.length) {
      throw new Error(`Unexpected '${this.s[this.pos]}' at ${this.pos}`);
    }
    return v;
  }

  private skipWs() {
    while (this.pos < this.s.length && /\s/.test(this.s[this.pos])) this.pos++;
  }

  private peek(): string {
    this.skipWs();
    return this.s[this.pos] ?? "";
  }

  private expr(): number {
    let v = this.term();
    for (;;) {
      const op = this.peek();
      if (op === "+" || op === "-") {
        this.pos++;
        const rhs = this.term();
        v = op === "+" ? v + rhs : v - rhs;
      } else break;
    }
    return v;
  }

  private term(): number {
    let v = this.power();
    for (;;) {
      const op = this.peek();
      if (op === "*" || op === "/") {
        this.pos++;
        const rhs = this.power();
        if (op === "/" && rhs === 0) throw new Error("Division by zero");
        v = op === "*" ? v * rhs : v / rhs;
      } else break;
    }
    return v;
  }

  private power(): number {
    const base = this.unary();
    if (this.peek() === "^") {
      this.pos++;
      const exp = this.power(); // right-associative
      return Math.pow(base, exp);
    }
    return base;
  }

  private unary(): number {
    const c = this.peek();
    if (c === "-") {
      this.pos++;
      return -this.unary();
    }
    if (c === "+") {
      this.pos++;
      return this.unary();
    }
    return this.atom();
  }

  private atom(): number {
    const c = this.peek();

    if (c === "(") {
      this.pos++;
      const v = this.expr();
      if (this.peek() !== ")") throw new Error("Expected ')'");
      this.pos++;
      return v;
    }

    // Number (with optional decimal / exponent).
    if (/[0-9.]/.test(c)) {
      return this.number();
    }

    // Variable reference: #ident.
    if (c === "#") {
      this.pos++;
      const name = this.ident();
      return this.lookup(name);
    }

    // Identifier: function call, constant, or bare variable.
    if (/[a-zA-Z_]/.test(c)) {
      const name = this.ident();
      if (this.peek() === "(") {
        this.pos++;
        const args: number[] = [];
        if (this.peek() !== ")") {
          args.push(this.expr());
          while (this.peek() === ",") {
            this.pos++;
            args.push(this.expr());
          }
        }
        if (this.peek() !== ")") throw new Error("Expected ')'");
        this.pos++;
        const fn = FUNCS[name.toLowerCase()];
        if (!fn) throw new Error(`Unknown function '${name}'`);
        return fn(...args);
      }
      const lower = name.toLowerCase();
      if (lower in CONSTS) return CONSTS[lower];
      return this.lookup(name);
    }

    throw new Error(`Unexpected '${c || "end of input"}' at ${this.pos}`);
  }

  private number(): number {
    this.skipWs();
    const start = this.pos;
    while (this.pos < this.s.length && /[0-9.eE+\-]/.test(this.s[this.pos])) {
      // Allow +/- only immediately after e/E (exponent sign).
      const ch = this.s[this.pos];
      if ((ch === "+" || ch === "-") && !/[eE]/.test(this.s[this.pos - 1])) break;
      this.pos++;
    }
    const text = this.s.slice(start, this.pos);
    const v = Number(text);
    if (!Number.isFinite(v)) throw new Error(`Invalid number '${text}'`);
    return v;
  }

  private ident(): string {
    this.skipWs();
    const start = this.pos;
    while (this.pos < this.s.length && /[a-zA-Z0-9_]/.test(this.s[this.pos])) {
      this.pos++;
    }
    if (this.pos === start) throw new Error("Expected identifier");
    return this.s.slice(start, this.pos);
  }

  private lookup(name: string): number {
    if (name in this.scope) return this.scope[name];
    throw new Error(`Unknown variable '${name}'`);
  }
}
