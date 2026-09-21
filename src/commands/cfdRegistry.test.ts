/**
 * CFD command registry + loop tests. Pure/fake-transport — no network.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/commands/cfdRegistry.test.ts
 */
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
const { cfdDispatch, cfdToolDefinitions } = await import("./cfdRegistry.ts");
const { validateInput } = await import("./registry.ts");
const { runTurn } = await import("./chatController.ts");
const { cfdLoopConfig } = await import("./cfdLoop.ts");
type ChatEvent = import("./chatController.ts").ChatEvent;
type AssistantResponse = import("./chatController.ts").AssistantResponse;

function resetCfd() {
  useStore.getState().newDoc();
  useStore.getState().addCfdTab();
}
function activeCfd() {
  const s = useStore.getState();
  return s.doc.cfds.find((c) => c.id === s.activeCfdId)!;
}

{
  console.log("tool defs + schema validation");
  const defs = cfdToolDefinitions();
  check("has tag_boundary", defs.some((d) => d.name === "tag_boundary"));
  check("has start_run", defs.some((d) => d.name === "start_run"));
  check("has clarify", defs.some((d) => d.name === "clarify"));
  const tag = defs.find((d) => d.name === "tag_boundary")!;
  check(
    "valid tag passes",
    validateInput(
      { faceRefs: ["1,2,3"], patchType: "inlet" },
      tag.input_schema as never,
    ) === null,
  );
  check(
    "missing faceRefs rejected",
    validateInput({ patchType: "inlet" }, tag.input_schema as never) !== null,
  );
}

{
  console.log("no active tab");
  useStore.getState().newDoc();
  const r = cfdDispatch("set_fluid", { preset: "air" }, useStore);
  check("errors without tab", !r.ok && /no active CFD tab/.test(r.error));
}

{
  console.log("dispatch mutates the tab");
  resetCfd();
  const r1 = cfdDispatch("set_fluid", { preset: "water" }, useStore);
  check("set_fluid ok", r1.ok, r1.ok ? "" : r1.error);
  check("fluid is water", activeCfd().fluid.name === "water");
  const r2 = cfdDispatch("set_turbulence_model", { model: "kEpsilon" }, useStore);
  check("turbulence ok", r2.ok);
  check("kEpsilon applied", activeCfd().turbulenceModel === "kEpsilon");
  const r3 = cfdDispatch(
    "tag_boundary",
    { faceRefs: ["0,0,10"], patchType: "inlet", velocity: [1, 0, 0] },
    useStore,
  );
  check("tag ok", r3.ok, r3.ok ? "" : r3.error);
  check("patch present", activeCfd().boundaryPatches.some((p) => p.faceRef === "0,0,10" && p.type === "inlet"));
  cfdDispatch("untag_boundary", { faceRefs: ["0,0,10"] }, useStore);
  check("untagged", activeCfd().boundaryPatches.length === 0);
}

{
  console.log("indistinguishable from manual");
  resetCfd();
  cfdDispatch("set_regime", { regime: "transientIncompressible" }, useStore);
  useStore.getState().updateCfd({ regime: "steadyIncompressible" });
  check("manual updateCfd applies", activeCfd().regime === "steadyIncompressible");
}

{
  console.log("agentic loop drives CFD tools (fake transport)");
  resetCfd();
  const events: ChatEvent[] = [];
  const toolUse = (
    calls: { id: string; name: string; input: Record<string, unknown> }[],
  ): AssistantResponse => ({
    role: "assistant",
    content: calls.map((c) => ({ type: "tool_use" as const, ...c })),
    stop_reason: "tool_use",
  });
  let n = 0;
  const transport = async (): Promise<AssistantResponse> => {
    n++;
    if (n === 1) {
      return toolUse([
        {
          id: "1",
          name: "set_fluid",
          input: { preset: "air" },
        },
        {
          id: "2",
          name: "tag_boundary",
          input: { faceRefs: ["1,0,0"], patchType: "inlet", velocity: [2, 0, 0] },
        },
      ]);
    }
    return { role: "assistant", content: [{ type: "text", text: "done" }], stop_reason: "end_turn" };
  };
  const result = await runTurn({
    userText: "air inlet on that face at 2 m/s",
    messages: [],
    transport,
    store: useStore,
    emit: (e) => events.push(e),
    config: cfdLoopConfig,
  });
  check("loop done", result.status === "done");
  check("inlet tagged", activeCfd().boundaryPatches.some((p) => p.type === "inlet"));
  check("tool_ok events", events.some((e) => e.kind === "tool_ok"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
