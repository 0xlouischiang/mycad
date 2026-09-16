/**
 * BIM command registry + loop tests (Phase 16). Pure/fake-transport — no network.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/commands/bimRegistry.test.ts
 *
 * Stubs Worker + indexedDB before importing the store (see registry.test.ts).
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
const { bimDispatch, bimToolDefinitions } = await import("./bimRegistry.ts");
const { validateInput } = await import("./registry.ts");
const { runTurn } = await import("./chatController.ts");
const { bimLoopConfig } = await import("./bimLoop.ts");
type ChatEvent = import("./chatController.ts").ChatEvent;
type AssistantResponse = import("./chatController.ts").AssistantResponse;

/** Reset to a doc with a single fresh BIM tab active. */
function resetBim() {
  useStore.getState().newDoc();
  useStore.getState().addBimTab();
}
function activeBim() {
  const s = useStore.getState();
  return s.doc.bims.find((b) => b.id === s.activeBimId)!;
}

// ---------------------------------------------------------------------------
{
  console.log("tool defs + schema validation");
  const defs = bimToolDefinitions();
  check("has create_wall", defs.some((d) => d.name === "create_wall"));
  check("has create_door_in_wall", defs.some((d) => d.name === "create_door_in_wall"));
  check("has clarify", defs.some((d) => d.name === "clarify"));
  const wallDef = defs.find((d) => d.name === "create_wall")!;
  check("valid wall input passes", validateInput({ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }, wallDef.input_schema as never) === null);
  check("missing end rejected", validateInput({ start: { x: 0, y: 0 } }, wallDef.input_schema as never) !== null);
}

// ---------------------------------------------------------------------------
{
  console.log("dispatch creates real components");
  resetBim();
  const level = activeBim().levels[0];
  const r1 = bimDispatch("create_wall", { start: { x: 0, y: 0 }, end: { x: 5000, y: 0 }, thickness: 200 }, useStore);
  check("create_wall ok", r1.ok, r1.ok ? "" : r1.error);
  const wall = activeBim().components.find((c) => c.type === "wall");
  check("wall in tab", !!wall && wall.levelId === level.id);
  check("wall params applied", wall?.type === "wall" && wall.thickness === 200 && wall.end.x === 5000);

  // Door hosted in the wall → real component with hostId.
  const r2 = bimDispatch("create_door_in_wall", { wallId: wall!.id, position: 0.5, width: 900, height: 2100 }, useStore);
  check("create_door_in_wall ok", r2.ok, r2.ok ? "" : r2.error);
  const door = activeBim().components.find((c) => c.type === "door");
  check("door hosted on wall", door?.type === "door" && door.hostId === wall!.id);
}

// ---------------------------------------------------------------------------
{
  console.log("error path");
  resetBim();
  const bad = bimDispatch("create_door_in_wall", { wallId: "nope", width: 900 }, useStore);
  check("door on missing wall fails", !bad.ok);
  check("error lists walls", !bad.ok && /Walls:/.test(bad.error));
  check("unknown command fails", !bimDispatch("frobnicate", {}, useStore).ok);
  check("schema failure via dispatch", !bimDispatch("create_wall", { start: { x: 0, y: 0 } }, useStore).ok);
  // Door too wide for the wall → flagged as not fitting.
  bimDispatch("create_wall", { start: { x: 0, y: 0 }, end: { x: 1000, y: 0 } }, useStore);
  const wall = activeBim().components.find((c) => c.type === "wall")!;
  const tooWide = bimDispatch("create_door_in_wall", { wallId: wall.id, position: 0.5, width: 5000 }, useStore);
  check("oversized door reported as not fitting", !tooWide.ok && /doesn't fit/.test(tooWide.error));
}

// ---------------------------------------------------------------------------
{
  console.log("indistinguishable from manual (update / delete / undo cascade)");
  resetBim();
  bimDispatch("create_wall", { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 }, thickness: 200 }, useStore);
  const wall = activeBim().components.find((c) => c.type === "wall")!;
  // Update via the SAME store action the UI uses.
  useStore.getState().updateComponent(wall.id, { thickness: 300 } as never);
  check("updateComponent applies", activeBim().components.find((c) => c.id === wall.id)?.type === "wall" && (activeBim().components.find((c) => c.id === wall.id) as { thickness: number }).thickness === 300);
  // Add a hosted door, then delete the wall → door removed by cascade.
  bimDispatch("create_door_in_wall", { wallId: wall.id, width: 900 }, useStore);
  check("door exists before wall delete", activeBim().components.some((c) => c.type === "door"));
  useStore.getState().deleteComponent(wall.id);
  check("wall deleted", !activeBim().components.some((c) => c.id === wall.id));
  check("hosted door cascaded away", !activeBim().components.some((c) => c.type === "door"));
}

// ---------------------------------------------------------------------------
{
  console.log("agentic loop drives BIM tools (fake transport)");
  resetBim();
  const events: ChatEvent[] = [];
  const toolUse = (calls: { id: string; name: string; input: Record<string, unknown> }[]): AssistantResponse => ({
    role: "assistant",
    content: calls.map((c) => ({ type: "tool_use" as const, ...c })),
    stop_reason: "tool_use",
  });
  const text = (t: string): AssistantResponse => ({ role: "assistant", content: [{ type: "text", text: t }], stop_reason: "end_turn" });
  const queue: AssistantResponse[] = [
    toolUse([
      { id: "a", name: "create_wall", input: { start: { x: 0, y: 0 }, end: { x: 5000, y: 0 } } },
      { id: "b", name: "create_column", input: { at: { x: 2500, y: 0 } } },
    ]),
    text("Added a wall and a column."),
  ];
  let i = 0;
  const transport = async () => (i < queue.length ? queue[i++] : text("done"));
  const res = await runTurn({ userText: "add a wall and a column", messages: [], transport, store: useStore, emit: (e) => events.push(e), config: bimLoopConfig });
  check("loop completes", res.status === "done");
  check("wall + column created", activeBim().components.filter((c) => c.type === "wall" || c.type === "column").length === 2);
  check("two tool_ok events", events.filter((e) => e.kind === "tool_ok").length === 2);

  // Clarify path.
  const events2: ChatEvent[] = [];
  let j = 0;
  const q2 = [toolUse([{ id: "c", name: "clarify", input: { question: "Which level?" } }])];
  const t2 = async () => (j < q2.length ? q2[j++] : text("done"));
  const res2 = await runTurn({ userText: "add a wall", messages: [], transport: t2, store: useStore, emit: (e) => events2.push(e), config: bimLoopConfig });
  check("clarify pauses loop", res2.status === "clarify");
  check("clarify question surfaced", events2.some((e) => e.kind === "clarify"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
