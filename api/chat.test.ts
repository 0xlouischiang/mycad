/**
 * Proxy handler tests (Phase 13). No network: we assert the graceful-degrade
 * path (missing key → 503) and input validation without ever calling Anthropic.
 * A live-API smoke test is intentionally NOT run here so `npm test` needs no
 * key.
 *
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        api/chat.test.ts
 */
import { handleChat } from "./chat.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

{
  console.log("graceful degradation");
  const res = await handleChat({ messages: [] }, {}); // no ANTHROPIC_API_KEY
  check("503 when key absent", res.status === 503);
  check(
    "error names the env var",
    typeof (res.body as { error?: string }).error === "string" &&
      /ANTHROPIC_API_KEY/.test((res.body as { error: string }).error),
  );
}

{
  console.log("input validation (with key present)");
  // Bad body: messages missing → 400, and we must NOT reach the network.
  const res = await handleChat(
    { messages: undefined as never },
    { ANTHROPIC_API_KEY: "test-key-not-used" },
  );
  check("400 when messages missing", res.status === 400);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
