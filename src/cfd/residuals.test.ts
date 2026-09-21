/**
 * Residual log parser.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/cfd/residuals.test.ts
 */
import { parseResiduals } from "./residuals.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const log = `
Time = 1
smoothSolver:  Solving for Ux, Initial residual = 1, Final residual = 0.1, No Iterations 1
smoothSolver:  Solving for Uy, Initial residual = 0.5, Final residual = 0.05, No Iterations 1
GAMG:  Solving for p, Initial residual = 0.8, Final residual = 0.01, No Iterations 5
Time = 2
smoothSolver:  Solving for Ux, Initial residual = 0.2, Final residual = 0.01, No Iterations 1
GAMG:  Solving for p, Initial residual = 0.1, Final residual = 0.001, No Iterations 5
`.split("\n");

const series = parseResiduals(log);
check("two samples", series.length === 2, `n=${series.length}`);
check("iter 1 p", series[0]?.iter === 1 && series[0]?.p === 0.8);
check("iter 2 p dropped", series[1]?.p === 0.1);
check("U uses max component", series[0]?.U === 1);

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
