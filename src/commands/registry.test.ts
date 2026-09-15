/**
 * Command-registry + context tests (Phase 13).
 *
 * Covers: schema validation, dispatch creating real features through the store,
 * the error path (bad sketch / unresolved ref), the geometry catalog, and the
 * spec's explicit "indistinguishable from manual" checklist — an LLM-created
 * feature must suppress/update/move/delete and undo/redo exactly like a
 * hand-made one.
 *
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/commands/registry.test.ts
 *
 * The store spawns a Worker + touches indexedDB at construction, so we stub
 * those globals BEFORE importing it (dynamic import after the stubs).
 */

// --- Global stubs so the store module can be imported under Node ------------
class FakeWorker {
  onmessage: unknown = null;
  onerror: unknown = null;
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}
(globalThis as unknown as { Worker: unknown }).Worker = FakeWorker;
(globalThis as unknown as { indexedDB: unknown }).indexedDB = {
  // saveDoc opens the DB behind a debounced timer; return a request that never
  // fires (the test exits first). saveDoc catches any resulting error.
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
const { dispatch, validateInput, getCommand, toolDefinitions } = await import(
  "./registry.ts"
);
const { catalogEdges, catalogFaces, summarizeTree } = await import("./context.ts");

/** Reset the store to a fresh empty document between test groups. */
function reset() {
  useStore.getState().newDoc();
}

// ---------------------------------------------------------------------------
{
  console.log("schema validation");
  const box = getCommand("add_box")!;
  check("valid input passes", validateInput({ dx: 1, dy: 2, dz: 3 }, box.inputSchema) === null);
  check(
    "missing field rejected",
    validateInput({ dx: 1, dy: 2 }, box.inputSchema) !== null,
  );
  check(
    "wrong type rejected",
    validateInput({ dx: "big", dy: 2, dz: 3 }, box.inputSchema) !== null,
  );
  check(
    "unknown field rejected",
    validateInput({ dx: 1, dy: 2, dz: 3, foo: 9 }, box.inputSchema) !== null,
  );
  const sketch = getCommand("add_sketch")!;
  check(
    "enum violation rejected",
    validateInput({ plane: "AB", shape: "circle" }, sketch.inputSchema) !== null,
  );
  check("tool defs include clarify", toolDefinitions().some((t) => t.name === "clarify"));
}

// ---------------------------------------------------------------------------
{
  console.log("dispatch creates real features");
  reset();
  const before = useStore.getState().tree.features.length;
  const r1 = dispatch("add_box", { dx: 40, dy: 30, dz: 20 }, useStore);
  check("add_box ok", r1.ok, r1.ok ? "" : r1.error);
  const feats = useStore.getState().tree.features;
  check("tree grew by 1", feats.length === before + 1);
  const box = feats[feats.length - 1];
  check("feature is a box", box.type === "box");
  check(
    "params applied",
    box.type === "box" && box.params.dx === 40 && box.params.dz === 20,
    box.type === "box" ? JSON.stringify(box.params) : "",
  );

  // Sketch + extrude sequence.
  const r2 = dispatch(
    "add_sketch",
    { plane: "XY", shape: "rectangle", width: 20, height: 10 },
    useStore,
  );
  check("add_sketch ok", r2.ok);
  const sketchId = r2.ok ? r2.featureId! : "";
  const r3 = dispatch("add_extrude", { sketch: sketchId, distance: 15 }, useStore);
  check("add_extrude ok", r3.ok, r3.ok ? "" : r3.error);
  const ext = useStore.getState().tree.features.find((f) => f.id === (r3.ok ? r3.featureId : ""));
  check("extrude distance applied", ext?.type === "extrude" && ext.params.distance === 15);
}

// ---------------------------------------------------------------------------
{
  console.log("error path (LLM-actionable messages)");
  reset();
  const bad = dispatch("add_extrude", { sketch: "nope", distance: 10 }, useStore);
  check("extrude with missing sketch fails", !bad.ok);
  check(
    "error names available sketches",
    !bad.ok && /Available/.test(bad.error),
    !bad.ok ? bad.error : "",
  );
  // Fillet with no body / unresolved ref.
  const badFillet = dispatch("add_fillet", { edges: ["999,999,999"], radius: 2 }, useStore);
  check("fillet with unresolved edge fails", !badFillet.ok);
  check("unknown command fails", !dispatch("frobnicate", {}, useStore).ok);
  // Schema failure routed through dispatch (not just validateInput).
  check("dispatch rejects bad schema", !dispatch("add_box", { dx: 1 }, useStore).ok);
}

// ---------------------------------------------------------------------------
{
  console.log("indistinguishable from manual (undo/suppress/update/move/delete)");
  reset();
  check("canUndo starts false", useStore.getState().canUndo === false);
  const r = dispatch("add_box", { dx: 10, dy: 10, dz: 10 }, useStore);
  const id = r.ok ? r.featureId! : "";
  check("canUndo true after dispatch", useStore.getState().canUndo === true);

  // Suppress
  useStore.getState().toggleSuppress(id);
  check("suppress works", useStore.getState().tree.features.find((f) => f.id === id)?.suppressed === true);
  useStore.getState().toggleSuppress(id);

  // Update params
  useStore.getState().updateParams(id, { dx: 25 });
  const upd = useStore.getState().tree.features.find((f) => f.id === id);
  check("updateParams works", upd?.type === "box" && upd.params.dx === 25);

  // Move (add a second feature, then reorder)
  dispatch("add_cylinder", { radius: 5, height: 10 }, useStore);
  const twoBefore = useStore.getState().tree.features.map((f) => f.id);
  useStore.getState().moveFeature(twoBefore[1], -1);
  const twoAfter = useStore.getState().tree.features.map((f) => f.id);
  check("moveFeature reorders", twoAfter[0] === twoBefore[1] && twoAfter[1] === twoBefore[0]);

  // Undo/redo round-trip: undo the move.
  useStore.getState().undo();
  check("undo reverts move", useStore.getState().tree.features.map((f) => f.id)[0] === twoBefore[0]);
  useStore.getState().redo();
  check("redo re-applies move", useStore.getState().tree.features.map((f) => f.id)[0] === twoBefore[1]);

  // Delete
  const countBefore = useStore.getState().tree.features.length;
  useStore.getState().deleteFeature(id);
  check("deleteFeature removes it", useStore.getState().tree.features.length === countBefore - 1);
  check("undo restores deleted feature", (useStore.getState().undo(), useStore.getState().tree.features.length === countBefore));
}

// ---------------------------------------------------------------------------
{
  console.log("geometry catalog derivation");
  // Synthetic payloads: one Z-aligned edge and one top face (normal +Z).
  const edges = {
    points: new Float32Array([0, 0, 0, 0, 0, 10]), // vertical edge, length 10
    edgeGroups: new Int32Array([0, 6, 0]), // float-offset units: start 0, count 6
  };
  const cat = catalogEdges(edges as never);
  check("one edge catalogued", cat.length === 1);
  check("edge length correct", Math.abs(cat[0].length - 10) < 1e-6, `len=${cat[0].length}`);
  check("edge axis is z", cat[0].axis === "z");
  check("edge ref is bbox center", cat[0].ref === "0,0,5", cat[0].ref);

  // A single top face: two triangles of a 10×10 square at z=5, winding +Z.
  const positions = new Float32Array([
    0, 0, 5, 10, 0, 5, 10, 10, 5, 0, 10, 5,
  ]);
  const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);
  const mesh = {
    positions,
    normals: new Float32Array(positions.length),
    indices,
    faceGroups: new Int32Array([0, 6, 0]), // index units: 6 indices = 2 tris
  };
  const faces = catalogFaces(mesh as never);
  check("one face catalogued", faces.length === 1);
  check("face is planar", faces[0].planar === true);
  check(
    "face normal is +Z",
    faces[0].normal !== null && Math.abs(Math.abs(faces[0].normal[2]) - 1) < 1e-6,
    JSON.stringify(faces[0].normal),
  );
}

// ---------------------------------------------------------------------------
{
  console.log("summarizeTree");
  reset();
  dispatch("add_box", { dx: 1, dy: 1, dz: 1 }, useStore);
  const s = summarizeTree(useStore.getState().tree, useStore.getState().statuses);
  check("summary has one entry", s.length === 1);
  check("summary carries id + type + index", s[0].type === "box" && s[0].index === 0 && !!s[0].id);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
