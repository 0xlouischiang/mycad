/**
 * Node module-resolution hook for running the app's TypeScript under
 * `node --experimental-strip-types` in tests.
 *
 * The app uses Vite-style extensionless relative imports (e.g.
 * `import { x } from "../model/featureTree"`). Node's type-stripping does NOT
 * rewrite specifiers, so those fail to resolve. This hook appends `.ts` (or
 * `/index.ts`) to extensionless relative specifiers so the real modules —
 * regen.ts and everything it imports — load unchanged in tests.
 *
 * Usage: node --experimental-strip-types --import ./src/test/ts-resolve.mjs <test>
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

// Register ourselves as a resolver hook in the current process.
register("./ts-resolve.mjs", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const parentPath = context.parentURL
      ? fileURLToPath(new URL(".", context.parentURL))
      : process.cwd() + "/";
    const asTs = new URL(specifier + ".ts", `file://${parentPath}`);
    if (existsSync(fileURLToPath(asTs))) {
      return nextResolve(asTs.href, context);
    }
    const asIndex = new URL(specifier + "/index.ts", `file://${parentPath}`);
    if (existsSync(fileURLToPath(asIndex))) {
      return nextResolve(asIndex.href, context);
    }
  }
  return nextResolve(specifier, context);
}
