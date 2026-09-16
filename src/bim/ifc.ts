/**
 * IFC4 export / import via web-ifc (Phase 15).
 *
 * Each internal BIM component maps to its IFC4 entity (Wall→IfcWall,
 * Slab→IfcSlab, Column→IfcColumn, Beam→IfcBeam, Door→IfcDoor, Window→IfcWindow,
 * Space→IfcSpace); levels map to IfcBuildingStorey; door/window hosting maps to
 * IfcRelVoidsElement (host wall ← opening). The complete parameter set of every
 * component travels losslessly in a MyCAD IfcPropertySet
 * (IfcRelDefinesByProperties → IfcPropertySet → IfcPropertySingleValue holding
 * the component JSON), which the importer reads back — so the component graph
 * and hosting relationships survive a round trip. We deliberately don't
 * serialize swept-solid geometry: massing is regenerated from parameters on
 * import (the spec's priority is the component/hosting graph, not B-rep in IFC).
 *
 * web-ifc needs its wasm; callers pass an initialized IfcAPI and the module
 * namespace (for type constants) via initIfc() so this file has no hard
 * top-level wasm dependency and tests can init once.
 */
import type { IfcAPI } from "web-ifc";
import type { BIMTab, BuildingComponent, Level } from "../model/bim";
import { makeBIMTab } from "../model/bim";

const MYCAD_PSET = "MyCAD_Component";

// Resolved once from the web-ifc module namespace.
let T: Record<string, number> = {};
/** web-ifc's Handle class — wraps an express id as a typed reference. */
let HandleCtor: new (id: number) => unknown;
let ready = false;

/** Populate IFC type + value-wrapper constants + Handle. Call once first. */
export function initIfc(wi: Record<string, unknown>): void {
  if (ready) return;
  HandleCtor = wi.Handle as new (id: number) => unknown;
  const n = (k: string) => wi[k] as number;
  T = {
    WALL: n("IFCWALL"),
    SLAB: n("IFCSLAB"),
    COLUMN: n("IFCCOLUMN"),
    BEAM: n("IFCBEAM"),
    DOOR: n("IFCDOOR"),
    WINDOW: n("IFCWINDOW"),
    SPACE: n("IFCSPACE"),
    STOREY: n("IFCBUILDINGSTOREY"),
    LABEL: n("IFCLABEL"),
    TEXT: n("IFCTEXT"),
    IDENT: n("IFCIDENTIFIER"),
    GUID: n("IFCGLOBALLYUNIQUEID"),
    LENGTH: n("IFCLENGTHMEASURE"),
    PROP: n("IFCPROPERTYSINGLEVALUE"),
    PSET: n("IFCPROPERTYSET"),
    RELDEF: n("IFCRELDEFINESBYPROPERTIES"),
    RELVOIDS: n("IFCRELVOIDSELEMENT"),
  };
  ready = true;
}

const IFC_TYPE_FOR: Record<BuildingComponent["type"], keyof typeof T | string> = {
  wall: "WALL",
  slab: "SLAB",
  column: "COLUMN",
  beam: "BEAM",
  door: "DOOR",
  window: "WINDOW",
  space: "SPACE",
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function exportIFC(api: IfcAPI, tab: BIMTab): { bytes: Uint8Array } {
  if (!ready) throw new Error("initIfc() must be called before exportIFC");
  const model = api.CreateModel({ schema: "IFC4" as never });

  const guid = (s: string) => api.CreateIfcType(model, T.GUID, toIfcGuid(s));
  const label = (s: string) => api.CreateIfcType(model, T.LABEL, s);
  const textv = (s: string) => api.CreateIfcType(model, T.TEXT, s);
  const ident = (s: string) => api.CreateIfcType(model, T.IDENT, s);
  /** Wrap an express id as a web-ifc Handle (entity cross-reference). */
  const ref = (id: number) => new HandleCtor(id);

  /** Create an entity, write it, return its assigned express id. */
  const write = (type: number, ...args: unknown[]): number => {
    const e = api.CreateIfcEntity(model, type, ...(args as never[]));
    api.WriteLine(model, e);
    return (e as { expressID: number }).expressID;
  };

  // Storeys.
  for (const level of tab.levels) {
    write(
      T.STOREY,
      guid(level.id),
      null,
      label(level.name),
      null, null, null, null, null,
      "ELEMENT" as never,
      api.CreateIfcType(model, T.LENGTH, level.elevation),
    );
  }

  // Components (typed entity + lossless MyCAD pset).
  const eidByComp = new Map<string, number>();
  for (const c of tab.components) {
    const type = T[IFC_TYPE_FOR[c.type] as string];
    const eid = write(type, guid(c.id), null, label(componentName(c)), null, null, null, null, null);
    eidByComp.set(c.id, eid);

    // pset carrying the exact component JSON.
    const propId = write(T.PROP, ident("componentJson"), null, textv(JSON.stringify(c)), null);
    const psetId = write(
      T.PSET,
      guid(c.id + ":pset"),
      null,
      label(MYCAD_PSET),
      null,
      [ref(propId)] as never,
    );
    // IfcRelDefinesByProperties(GlobalId, OwnerHistory, Name, Description,
    // RelatedObjects[], RelatingPropertyDefinition) — 6 args.
    write(
      T.RELDEF,
      guid(c.id + ":reldef"),
      null, null, null,
      [ref(eid)] as never,
      ref(psetId) as never,
    );
  }

  // Hosting: IfcRelVoidsElement(host wall, opening).
  for (const c of tab.components) {
    if (c.type === "door" || c.type === "window") {
      const wallEid = eidByComp.get(c.hostId);
      const openingEid = eidByComp.get(c.id);
      if (wallEid && openingEid) {
        // IfcRelVoidsElement(GlobalId, OwnerHistory, Name, Description,
        // RelatingBuildingElement, RelatedOpeningElement) — 6 args.
        write(
          T.RELVOIDS,
          guid(c.id + ":voids"),
          null, null, null,
          ref(wallEid) as never,
          ref(openingEid) as never,
        );
      }
    }
  }

  const bytes = api.SaveModel(model);
  api.CloseModel(model);
  return { bytes };
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export function importIFC(api: IfcAPI, bytes: Uint8Array, name = "Imported"): BIMTab {
  if (!ready) throw new Error("initIfc() must be called before importIFC");
  const model = api.OpenModel(bytes);
  const tab = makeBIMTab(name);
  tab.levels = [];
  tab.components = [];

  // Storeys → levels.
  for (const sid of collect(api.GetLineIDsWithType(model, T.STOREY))) {
    const line = api.GetLine(model, sid);
    tab.levels.push({
      id: `lvl-${sid}`,
      name: line.Name?.value ?? "Level",
      elevation: Number(line.Elevation?.value ?? 0),
      height: 3000,
    });
  }
  if (tab.levels.length === 0) tab.levels = makeBIMTab(name).levels;

  // Build a componentJson lookup keyed by the element express id it defines.
  const jsonByElement = readComponentJsonMap(api, model);

  // Components: for each mapped element, parse its JSON back.
  for (const [, json] of jsonByElement) {
    try {
      tab.components.push(JSON.parse(json) as BuildingComponent);
    } catch {
      // skip unparseable
    }
  }

  api.CloseModel(model);
  return tab;
}

/** Map element-expressID → componentJson string from all MyCAD psets. */
function readComponentJsonMap(api: IfcAPI, model: number): Map<number, string> {
  const out = new Map<number, string>();
  for (const rid of collect(api.GetLineIDsWithType(model, T.RELDEF))) {
    const rel = api.GetLine(model, rid);
    const related: { value: number }[] = rel.RelatedObjects ?? [];
    const psetRef = rel.RelatingPropertyDefinition;
    if (!psetRef || related.length === 0) continue;
    const pset = api.GetLine(model, psetRef.value);
    if (pset.Name?.value !== MYCAD_PSET) continue;
    const props: { value: number }[] = pset.HasProperties ?? [];
    for (const p of props) {
      const prop = api.GetLine(model, p.value);
      if (prop.Name?.value === "componentJson" && prop.NominalValue?.value != null) {
        for (const r of related) out.set(r.value, String(prop.NominalValue.value));
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function componentName(c: BuildingComponent): string {
  return `${c.type}-${c.id.slice(0, 8)}`;
}

function collect(vec: { size(): number; get(i: number): number }): number[] {
  const out: number[] = [];
  for (let i = 0; i < vec.size(); i++) out.push(vec.get(i));
  return out;
}

/** Deterministic valid 22-char IFC GUID from any seed string. */
function toIfcGuid(seed: string): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h ^ seed.charCodeAt(i)) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  let out = "";
  let x = h;
  for (let i = 0; i < 22; i++) {
    out += chars[x % 64];
    x = (Math.imul(x, 1103515245) + 12345 + i) >>> 0;
  }
  return out;
}

export type { Level };
