/**
 * chatController agentic-loop tests (Phase 13), driven by a FAKE transport so
 * no network / API key is needed. Covers the four loop behaviors the spec
 * calls out: multi-tool sequencing, error→retry, retry-limit exhaustion, and
 * the clarify pause.
 *
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/commands/chatController.test.ts
 */

// Stub the browser globals the store touches at import (see registry.test.ts).
class FakeWorker {
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}
(globalThis as unknown as { Worker: unknown }).Worker = FakeWorker;
(globalThis as unknown as { indexedDB: unknown }).indexedDB = {
  open() {
    return { onupgradeneeded: null, onsuccess: null, onerror: null, result: null };
  },
};

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const { useStore } = await import("../store.ts");
const { runTurn } = await import("./chatController.ts");
type ChatEvent = import("./chatController.ts").ChatEvent;
type AssistantResponse = import("./chatController.ts").AssistantResponse;

/** Build an assistant response with tool_use blocks. */
function toolUse(
  calls: { id: string; name: string; input: Record<string, unknown> }[],
): AssistantResponse {
  return {
    role: "assistant",
    content: calls.map((c) => ({ type: "tool_use", ...c })),
    stop_reason: "tool_use",
  };
}
function textReply(text: string): AssistantResponse {
  return { role: "assistant", content: [{ type: "text", text }], stop_reason: "end_turn" };
}

/** A scripted transport that returns queued responses in order. */
function scriptedTransport(queue: AssistantResponse[]) {
  let i = 0;
  const calls: number = 0;
  void calls;
  const fn = async () => {
    if (i >= queue.length) return textReply("(done)");
    return queue[i++];
  };
  return { fn, count: () => i };
}

// ---------------------------------------------------------------------------
{
  console.log("multi-tool sequence: two features land in order");
  useStore.getState().newDoc();
  const events: ChatEvent[] = [];
  const t = scriptedTransport([
    toolUse([
      { id: "t1", name: "add_box", input: { dx: 10, dy: 10, dz: 10 } },
      { id: "t2", name: "add_cylinder", input: { radius: 3, height: 8 } },
    ]),
    textReply("Done — added a box and a cylinder."),
  ]);
  const res = await runTurn({
    userText: "add a box and a cylinder",
    messages: [],
    transport: t.fn,
    store: useStore,
    emit: (e) => events.push(e),
  });
  check("status done", res.status === "done");
  const types = useStore.getState().tree.features.map((f) => f.type);
  check("box then cylinder in tree order", types[0] === "box" && types[1] === "cylinder", types.join(","));
  const oks = events.filter((e) => e.kind === "tool_ok");
  check("two tool_ok events", oks.length === 2);
}

// ---------------------------------------------------------------------------
{
  console.log("error → retry → success");
  useStore.getState().newDoc();
  const events: ChatEvent[] = [];
  const t = scriptedTransport([
    // First call: bad box (negative dim) → validation/semantic error.
    toolUse([{ id: "a", name: "add_box", input: { dx: -1, dy: 10, dz: 10 } }]),
    // Model corrects itself.
    toolUse([{ id: "b", name: "add_box", input: { dx: 10, dy: 10, dz: 10 } }]),
    textReply("Fixed it."),
  ]);
  const res = await runTurn({
    userText: "add a box",
    messages: [],
    transport: t.fn,
    store: useStore,
    emit: (e) => events.push(e),
  });
  check("status done after retry", res.status === "done");
  check("one tool_error emitted", events.filter((e) => e.kind === "tool_error").length === 1);
  check("one tool_ok emitted", events.filter((e) => e.kind === "tool_ok").length === 1);
  check("exactly one box created", useStore.getState().tree.features.filter((f) => f.type === "box").length === 1);
}

// ---------------------------------------------------------------------------
{
  console.log("retry-limit exhaustion → surfaced failure");
  useStore.getState().newDoc();
  const events: ChatEvent[] = [];
  // Always returns a failing call → should stop after the retry cap.
  const alwaysBad = async () =>
    toolUse([{ id: "x", name: "add_box", input: { dx: -1, dy: 1, dz: 1 } }]);
  const res = await runTurn({
    userText: "add a box",
    messages: [],
    transport: alwaysBad,
    store: useStore,
    emit: (e) => events.push(e),
  });
  check("status error", res.status === "error");
  check("a plain-language error was surfaced", events.some((e) => e.kind === "error"));
  check("no box created", useStore.getState().tree.features.filter((f) => f.type === "box").length === 0);
}

// ---------------------------------------------------------------------------
{
  console.log("clarify pauses the loop");
  useStore.getState().newDoc();
  const events: ChatEvent[] = [];
  const t = scriptedTransport([
    toolUse([{ id: "c", name: "clarify", input: { question: "How big should the box be?" } }]),
  ]);
  const res = await runTurn({
    userText: "add a box",
    messages: [],
    transport: t.fn,
    store: useStore,
    emit: (e) => events.push(e),
  });
  check("status clarify", res.status === "clarify");
  const clarifyEvent = events.find((e) => e.kind === "clarify");
  check("clarify question surfaced", clarifyEvent?.kind === "clarify" && /how big/i.test(clarifyEvent.question));
  check("nothing built yet", useStore.getState().tree.features.length === 0);

  // Resume: the user answers, loop continues with the same messages array.
  const t2 = scriptedTransport([
    toolUse([{ id: "d", name: "add_box", input: { dx: 20, dy: 20, dz: 20 } }]),
    textReply("Built it."),
  ]);
  const res2 = await runTurn({
    userText: "50 by 50 by 50... actually 20 cube",
    messages: res.messages,
    transport: t2.fn,
    store: useStore,
    emit: (e) => events.push(e),
  });
  check("resume completes", res2.status === "done");
  check("box built after clarification", useStore.getState().tree.features.some((f) => f.type === "box"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
