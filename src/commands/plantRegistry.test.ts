/**
 * Plant command tests. The natural-language path and the manual path call the
 * same store actions, so a routed line has the same shape either way.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/commands/plantRegistry.test.ts
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
const { plantDispatch } = await import("./plantRegistry.ts");
const { runTurn } = await import("./chatController.ts");
const { plantLoopConfig } = await import("./plantLoop.ts");
type ChatEvent = import("./chatController.ts").ChatEvent;
type AssistantResponse = import("./chatController.ts").AssistantResponse;

function reset() {
  useStore.getState().newDoc();
  useStore.getState().addPlantTab();
}
function plant() {
  const s = useStore.getState();
  return s.doc.plants.find((p) => p.id === s.activePlantId)!;
}

{
  console.log("routing through the command matches routing by hand");
  reset();
  const created = plantDispatch("create_line", { name: "L-1", service: "CW" }, useStore);
  check("line created", created.ok, created.ok ? "" : created.error);

  const spoken = plantDispatch(
    "route_run",
    {
      points: [
        { x: 0, y: 0, z: 0 },
        { x: 6000, y: 0, z: 0 },
        { x: 6000, y: 3000, z: 0 },
      ],
    },
    useStore,
  );
  check("spoken route accepted", spoken.ok, spoken.ok ? "" : spoken.error);
  const spokenLine = plant().lines[0];
  const spokenShape = spokenLine.runs.map((r) => r.kind);

  // The same points placed through the store action directly.
  reset();
  const id = useStore.getState().createLine("L-1", "CW");
  useStore.getState().routeLine(
    [
      { x: 0, y: 0, z: 0 },
      { x: 6000, y: 0, z: 0 },
      { x: 6000, y: 3000, z: 0 },
    ],
    id!,
  );
  const manualShape = plant().lines[0].runs.map((r) => r.kind);
  check("same component sequence", spokenShape.join(",") === manualShape.join(","), `${spokenShape} vs ${manualShape}`);
}

{
  console.log("an out-of-spec size is rejected and the model is unchanged");
  reset();
  plantDispatch("create_line", { name: "L" }, useStore);
  const before = plant().lines[0].runs.length;
  plantDispatch("set_context", { nps: 50 }, useStore);
  const bad = plantDispatch(
    "route_run",
    { points: [{ x: 0, y: 0 }, { x: 1000, y: 0 }] },
    useStore,
  );
  check("in-spec route accepted", bad.ok, bad.ok ? "" : bad.error);
  const rejected = plantDispatch("set_context", { nps: 200 }, useStore);
  check("DN200 refused", !rejected.ok);
  check("the refusal routed nothing", plant().lines[0].runs.length === before + 1);
}

{
  console.log("deleting equipment removes its nozzles");
  reset();
  const placed = plantDispatch(
    "place_equipment",
    { name: "V-1", kind: "vessel", origin: { x: 0, y: 0, z: 0 } },
    useStore,
  );
  check("equipment placed", placed.ok);
  const equipment = plant().equipment[0];
  const nozzle = plantDispatch(
    "place_nozzle",
    { equipmentId: equipment.id, datumId: equipment.datums[0].id, direction: { x: 0, y: 0, z: 1 }, nps: 100 },
    useStore,
  );
  check("nozzle placed on datum", nozzle.ok, nozzle.ok ? "" : nozzle.error);
  check("vessel has one nozzle", plant().equipment[0].nozzles.length === 1);
  plantDispatch("delete_component", { id: equipment.id }, useStore);
  check("equipment gone", plant().equipment.length === 0);
}

{
  console.log("the loop drives the plant tools");
  reset();
  const events: ChatEvent[] = [];
  const toolUse = (calls: { id: string; name: string; input: Record<string, unknown> }[]): AssistantResponse => ({
    role: "assistant",
    content: calls.map((c) => ({ type: "tool_use" as const, ...c })),
    stop_reason: "tool_use",
  });
  const text = (t: string): AssistantResponse => ({ role: "assistant", content: [{ type: "text", text: t }], stop_reason: "end_turn" });
  const queue: AssistantResponse[] = [
    toolUse([
      { id: "a", name: "create_line", input: { name: "CW-1" } },
      { id: "b", name: "set_context", input: { nps: 100 } },
    ]),
    toolUse([
      {
        id: "c",
        name: "route_run",
        input: {
          points: [
            { x: 0, y: 0, z: 0 },
            { x: 6000, y: 0, z: 0 },
            { x: 6000, y: 3000, z: 0 },
          ],
        },
      },
    ]),
    text("Routed DN100."),
  ];
  let i = 0;
  const res = await runTurn({
    userText: "route 6 m DN100 along X, then 3 m along Y",
    messages: [],
    transport: async () => (i < queue.length ? queue[i++] : text("done")),
    store: useStore,
    emit: (e) => events.push(e),
    config: plantLoopConfig,
  });
  check("loop finished", res.status === "done", res.status);
  const line = plant().lines[0];
  check("line is DN100", line?.nps === 100);
  check("two straights and an elbow", line?.runs.filter((r) => r.kind === "straight").length === 2 && line?.runs.some((r) => r.kind === "elbow"));
  check("no tool errors", !events.some((e) => e.kind === "tool_error"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
