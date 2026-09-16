/**
 * IFC4 round-trip test (Phase 15): export a model with walls + a hosted door +
 * a space, re-import, and verify the component graph + hosting survive.
 * Uses the REAL web-ifc wasm (initializes in node).
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/bim/ifc.test.ts
 */
import * as wi from "web-ifc";
import { exportIFC, importIFC, initIfc } from "./ifc.ts";
import {
  makeBIMTab,
  makeWall,
  makeDoor,
  makeSpace,
  type Wall,
  type Door,
} from "../model/bim.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

const api = new wi.IfcAPI();
await api.Init();
initIfc(wi as unknown as Record<string, unknown>);

{
  console.log("round-trip: walls + hosted door + space");
  const tab = makeBIMTab("Test Building");
  const level = tab.levels[0];
  // A 4-wall room.
  const walls: Wall[] = [
    makeWall(level.id, { x: 0, y: 0 }, { x: 6000, y: 0 }, 200, 3000),
    makeWall(level.id, { x: 6000, y: 0 }, { x: 6000, y: 4000 }, 200, 3000),
    makeWall(level.id, { x: 6000, y: 4000 }, { x: 0, y: 4000 }, 200, 3000),
    makeWall(level.id, { x: 0, y: 4000 }, { x: 0, y: 0 }, 200, 3000),
  ];
  const door = makeDoor(level.id, walls[0].id, 0.5, 900, 2100);
  const space = makeSpace(level.id, { x: 3000, y: 2000 });
  tab.components.push(...walls, door, space);

  const { bytes } = exportIFC(api, tab);
  check("export produced bytes", bytes.length > 0, `${bytes.length} bytes`);
  const text = new TextDecoder().decode(bytes);
  check("file is IFC (ISO-10303)", text.startsWith("ISO-10303-21;"));
  check("contains IFCWALL", /IFCWALL\b/.test(text));
  check("contains IFCDOOR", /IFCDOOR\b/.test(text));
  check("contains IFCSPACE", /IFCSPACE\b/.test(text));
  check("contains IFCRELVOIDSELEMENT (hosting)", /IFCRELVOIDSELEMENT/.test(text));

  const back = importIFC(api, bytes, "Reimported");
  const wallsBack = back.components.filter((c) => c.type === "wall");
  const doorsBack = back.components.filter((c): c is Door => c.type === "door");
  const spacesBack = back.components.filter((c) => c.type === "space");
  check("4 walls survive", wallsBack.length === 4, `${wallsBack.length}`);
  check("1 door survives", doorsBack.length === 1);
  check("1 space survives", spacesBack.length === 1);

  // Hosting survives: the door's hostId still names one of the walls.
  const wallIds = new Set(wallsBack.map((w) => w.id));
  check(
    "door hostId still references a wall",
    doorsBack.length === 1 && wallIds.has(doorsBack[0].hostId),
    doorsBack[0]?.hostId,
  );
  // Parameters survive losslessly.
  check("door width preserved", doorsBack[0]?.width === 900);
  const w0 = wallsBack.find((c): c is Wall => c.type === "wall" && c.id === walls[0].id);
  check("wall geometry preserved", !!w0 && w0.end.x === 6000 && w0.thickness === 200);
}

{
  console.log("empty model round-trips");
  const tab = makeBIMTab("Empty");
  const { bytes } = exportIFC(api, tab);
  const back = importIFC(api, bytes);
  check("no components", back.components.length === 0);
  check("at least one level", back.levels.length >= 1);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
