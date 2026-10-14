/**
 * Plant model tests: spec lookup, routing, joints, spec change, bill of materials.
 * Pure — no kernel, no store.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/model/plant.test.ts
 */
import {
  billOfMaterials,
  canJoin,
  carbonSteel150,
  changeLineSpec,
  checkConnectivity,
  deleteEquipment,
  isometric,
  makeEquipment,
  makeLine,
  makeNozzle,
  makePlantTab,
  makeValve,
  nozzlePosition,
  routeRun,
  validatePlant,
  type Line,
  type PlantTab,
} from "./plant.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

function tabWith(line: Line): PlantTab {
  const tab = makePlantTab("P");
  tab.lines.push(line);
  return tab;
}

const spec = carbonSteel150();

{
  console.log("spec rejects what it does not list");
  const tab = makePlantTab("P");
  const line = makeLine("L", spec, 50);
  tab.lines.push(line);
  // DN200 is not a listed size, so the route never starts.
  line.nps = 200;
  const before = line.runs.length;
  const result = routeRun(tab, line.id, [
    { x: 0, y: 0, z: 0 },
    { x: 1000, y: 0, z: 0 },
  ]);
  check("out-of-spec size rejected", !result.ok);
  check("line unchanged", line.runs.length === before);
}

{
  console.log("a polyline becomes straights and elbows, fully connected");
  const line = makeLine("L", spec, 100);
  const tab = tabWith(line);
  const result = routeRun(tab, line.id, [
    { x: 0, y: 0, z: 0 },
    { x: 6000, y: 0, z: 0 },
    { x: 6000, y: 3000, z: 0 },
  ]);
  check("route accepted", result.ok, result.error ?? "");
  const straights = line.runs.filter((r) => r.kind === "straight");
  const elbows = line.runs.filter((r) => r.kind === "elbow");
  const issues = checkConnectivity(line);
  check("two straights", straights.length === 2, `got ${straights.length}`);
  check("one elbow", elbows.length === 1);
  check("elbow is 90°", elbows[0]?.angle === 90);
  check("connectivity is clean apart from the two open ends", issues.length === 2, issues.map((i) => i.message).join(" | "));

  const bom = billOfMaterials(tab, line.id);
  const straightRow = Array.isArray(bom) ? bom.find((r) => r.kind === "straight") : undefined;
  const expected = straights.reduce((sum, s) => sum + s.length, 0);
  check("bom length equals the sum of the straights", straightRow?.length === expected, `bom=${straightRow?.length} sum=${expected}`);
}

{
  console.log("branching the middle of a straight inserts a tee");
  const line = makeLine("L", spec, 80);
  const tab = tabWith(line);
  routeRun(tab, line.id, [
    { x: 0, y: 0, z: 0 },
    { x: 4000, y: 0, z: 0 },
  ]);
  const result = routeRun(tab, line.id, [
    { x: 2000, y: 0, z: 0 },
    { x: 2000, y: 2000, z: 0 },
  ]);
  check("branch accepted", result.ok, result.error ?? "");
  const straights = line.runs.filter((r) => r.kind === "straight");
  const tees = line.runs.filter((r) => r.kind === "tee");
  check("original straight split into two, plus the branch", straights.length === 3, `got ${straights.length}`);
  check("one tee", tees.length === 1);
  const tee = tees[0];
  const joined = tee.ports.filter((p) => p.connectedTo !== null);
  check("all three tee ports are joined", joined.length === 3, `joined ${joined.length}`);
  check("branch uses BRANCH_PORT", tee.ports.some((p) => p.role === "BRANCH_PORT" && p.connectedTo !== null));
}

{
  console.log("a size change flags a valve the new spec lacks");
  const line = makeLine("L", spec, 100);
  const tab = tabWith(line);
  routeRun(tab, line.id, [
    { x: 0, y: 0, z: 0 },
    { x: 3000, y: 0, z: 0 },
  ]);
  // A valve at DN100 exists; DN150 does not.
  const valve = makeValve(spec, 100, { x: 1500, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
  if (!("error" in valve)) line.runs.push(valve);
  check("valve placed at DN100", !("error" in valve));

  const changed = changeLineSpec(tab, line.id, spec.id, 150);
  check("change returns a report", !("error" in changed));
  if (!("error" in changed)) {
    check("valve kept with a warning", changed.warned.length === 1);
    check("the other components were replaced", changed.replaced > 0);
  }
  const kept = line.runs.find((r) => r.kind === "valve");
  check("valve still present", !!kept);
  check("valve carries the warning", !!kept?.warning && /not in spec/.test(kept.warning));
  check("valve was not resized", kept?.nps === 100);
}

{
  console.log("a nozzle moves with its vessel and dies with it");
  const tab = makePlantTab("P");
  const vessel = makeEquipment("V-1", "vessel", { x: 0, y: 0, z: 0 }, 1000, 2000);
  tab.equipment.push(vessel);
  const datum = vessel.datums[0];
  const nozzle = makeNozzle(datum.id, { x: 0, y: 0, z: 0 }, datum.direction, 100, "150", "flanged", false);
  vessel.nozzles.push(nozzle);
  const before = nozzlePosition(vessel, nozzle);
  vessel.origin = { x: 5000, y: 0, z: 0 };
  const after = nozzlePosition(vessel, nozzle);
  check("nozzle translated with the vessel", after.x - before.x === 5000, `dx=${after.x - before.x}`);

  const removed = deleteEquipment(tab, vessel.id);
  check("deleting the vessel removes its nozzle", removed.length === 1 && removed[0] === nozzle.id);
  check("equipment list is empty", tab.equipment.length === 0);
}

{
  console.log("joints refuse mismatched ends");
  const a = makeLine("A", spec, 50);
  const tab = tabWith(a);
  routeRun(tab, a.id, [
    { x: 0, y: 0, z: 0 },
    { x: 1000, y: 0, z: 0 },
  ]);
  const port = a.runs[0].ports[1];
  const mismatch = { ...port, id: "other", nps: 80, direction: { x: -1, y: 0, z: 0 } };
  const refused = canJoin(port, mismatch, spec.id, spec.id);
  check("size mismatch named", !refused.ok && /size mismatch/.test(refused.reason ?? ""));
}

{
  console.log("isometric unfolds the run");
  const line = makeLine("L", spec, 50);
  const tab = tabWith(line);
  routeRun(tab, line.id, [
    { x: 0, y: 0, z: 0 },
    { x: 2000, y: 0, z: 0 },
    { x: 2000, y: 1000, z: 0 },
  ]);
  const iso = isometric(line);
  check("svg produced", iso.svg.startsWith("<svg"));
  check("elbow annotated with its angle", iso.items.some((i) => i.kind === "elbow" && /90°/.test(i.label)));
}

{
  console.log("validation catches a dangling support and a loose nozzle");
  const tab = makePlantTab("P");
  tab.supports.push({ id: "s", hostSegmentId: "missing", t: 0.5, kind: "guide" });
  const custom = makeEquipment("C", "custom", { x: 0, y: 0, z: 0 });
  custom.nozzles.push(makeNozzle("no-datum", { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, 50, "150", "flanged", false));
  tab.equipment.push(custom);
  const result = validatePlant(tab);
  check("invalid", !result.ok);
  check("missing support host reported", result.errors.some((e) => /host/.test(e)));
  check("unattached nozzle reported", result.errors.some((e) => /nozzle/.test(e)));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
