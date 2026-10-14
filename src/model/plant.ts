/**
 * Plant (piping) data model — OpenPlant-style, additive tab type.
 *
 * A PlantTab sits beside Robot / BIM / CFD tabs: the Document keeps a separate
 * `plants: PlantTab[]` so the Part Studio path is untouched. A plant tab holds
 * specifications, pipelines, equipment, and supports. Geometry is derived
 * (src/plant/geometry.ts); this module is plain JSON and never touches the kernel.
 *
 * Units: millimeters, Z-up, matching the mechanical viewport. A pipeline is a
 * graph of components joined at ports — a fitting is chosen from the line's
 * specification, never invented.
 */
import { newFeatureId } from "./featureTree";

// ---------------------------------------------------------------------------
// Specs
// ---------------------------------------------------------------------------

export type EndPrep = "buttWeld" | "flanged";
export type PortRole = "MAIN_PORT" | "RUN_PORT" | "BRANCH_PORT";
export type ComponentKind =
  | "straight"
  | "elbow"
  | "tee"
  | "reducer"
  | "flange"
  | "valve"
  | "cap"
  | "olet"
  | "gasket"
  | "boltSet";

/** One row of a specification: a fitting the spec allows at a given size. */
export interface SpecRecord {
  type: ComponentKind;
  /** Nominal size (mm). A reducer uses `nps` for the large end. */
  nps: number;
  /** Reducer small-end size. Absent for every other fitting. */
  npsOut?: number;
  rating: string;
  endPrep: EndPrep;
  /** Straight length of the fitting body (mm). */
  length: number;
  /** Bend radius (elbows) in mm. */
  bendRadius?: number;
  /** Included angle (elbows, branch fittings) in degrees. */
  angle?: number;
}

export interface Spec {
  id: string;
  name: string;
  nps: number[];
  ratings: string[];
  endPreps: EndPrep[];
  /** Default end preparation used when a new run does not say otherwise. */
  defaultEndPrep: EndPrep;
  allow: SpecRecord[];
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Port {
  id: string;
  role: PortRole;
  position: Vec3;
  /** Unit direction pointing OUT of the component. */
  direction: Vec3;
  nps: number;
  endPrep: EndPrep;
  rating: string;
  /** Id of the port this one is joined to, or null when open. */
  connectedTo: string | null;
}

/** Anything that occupies a run: pipe, fitting, or the flange kit. */
export interface RunSegment {
  id: string;
  kind: ComponentKind;
  specId: string;
  nps: number;
  /** Small-end size for a reducer; otherwise equal to `nps`. */
  npsOut: number;
  rating: string;
  endPrep: EndPrep;
  /** Centerline length for straights; fitting body length otherwise. */
  length: number;
  angle?: number;
  bendRadius?: number;
  ports: Port[];
  /** Set when a spec change cannot replace this component. Never deleted silently. */
  warning?: string;
}

export interface Joint {
  id: string;
  a: string;
  b: string;
}

export interface Line {
  id: string;
  name: string;
  service: string;
  unit: string;
  specId: string;
  nps: number;
  /** Insulation thickness (mm). Informational; not modeled as geometry. */
  insulation?: number;
  runs: RunSegment[];
  joints: Joint[];
  warnings: string[];
}

export type EquipmentKind = "vessel" | "tank" | "pump" | "exchanger" | "custom";

export interface Datum {
  id: string;
  name: string;
  /** Offset from the equipment origin (mm). */
  position: Vec3;
  /** Outward direction a nozzle on this datum takes by default. */
  direction: Vec3;
}

export interface Nozzle {
  id: string;
  /** Datum this nozzle hangs off. Null only for a freeform nozzle. */
  datumId: string | null;
  /** Extra offset from the datum (or, for freeform, from the equipment origin). */
  offset: Vec3;
  direction: Vec3;
  nps: number;
  rating: string;
  facing: EndPrep;
  /** Pipeline this nozzle belongs to, when one has been assigned. */
  lineId: string | null;
  /** Freeform nozzles record the face normal they were placed against. */
  freeform: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  kind: EquipmentKind;
  /** Placement origin (mm). Nozzles and datums move with it. */
  origin: Vec3;
  /** Diameter (mm) for vessel/tank/exchanger; width for a pump. */
  diameter: number;
  /** Tangent-to-tangent / body length (mm). */
  length: number;
  datums: Datum[];
  nozzles: Nozzle[];
}

export type SupportKind = "anchor" | "guide" | "hanger";

export interface Support {
  id: string;
  hostSegmentId: string;
  /** 0..1 along the host straight. */
  t: number;
  kind: SupportKind;
}

/** Placement context shared by every new line and run. */
export interface PlantContext {
  activeLineId: string | null;
  activeSpecId: string | null;
  activeNps: number | null;
}

export interface PlantTab {
  kind: "plant";
  id: string;
  name: string;
  specs: Spec[];
  lines: Line[];
  equipment: Equipment[];
  supports: Support[];
  context: PlantContext;
}

// ---------------------------------------------------------------------------
// Example specification: carbon steel, ASME 150, DN50–DN150.
// ---------------------------------------------------------------------------

const CS150_SIZES = [50, 80, 100, 150];

function cs150Records(): SpecRecord[] {
  const rows: SpecRecord[] = [];
  for (const nps of CS150_SIZES) {
    const od = nps * 1.2;
    for (const endPrep of ["buttWeld", "flanged"] as EndPrep[]) {
      rows.push(
        { type: "straight", nps, rating: "150", endPrep, length: 0 },
        { type: "elbow", nps, rating: "150", endPrep, length: od, bendRadius: 1.5 * nps, angle: 90 },
        { type: "elbow", nps, rating: "150", endPrep, length: od * 0.6, bendRadius: 1.5 * nps, angle: 45 },
        { type: "tee", nps, rating: "150", endPrep, length: od, angle: 90 },
        { type: "flange", nps, rating: "150", endPrep, length: Math.max(20, nps * 0.25) },
        { type: "gasket", nps, rating: "150", endPrep, length: 3 },
        { type: "boltSet", nps, rating: "150", endPrep, length: 0 },
        { type: "cap", nps, rating: "150", endPrep, length: nps * 0.5 },
        { type: "olet", nps, rating: "150", endPrep, length: nps * 0.6, angle: 90 },
      );
    }
    // A gate valve only up to DN100 — DN150 is the "not in spec" case.
    if (nps <= 100) {
      rows.push({ type: "valve", nps, rating: "150", endPrep: "flanged", length: nps * 2, angle: 90 });
    }
  }
  // Concentric reducers between adjacent sizes, both end preps.
  for (let i = 1; i < CS150_SIZES.length; i++) {
    const big = CS150_SIZES[i];
    const small = CS150_SIZES[i - 1];
    for (const endPrep of ["buttWeld", "flanged"] as EndPrep[]) {
      rows.push({
        type: "reducer",
        nps: big,
        npsOut: small,
        rating: "150",
        endPrep,
        length: (big - small) * 2,
      });
    }
  }
  return rows;
}

export function carbonSteel150(): Spec {
  return {
    id: "cs150",
    name: "Carbon steel 150 lb",
    nps: [...CS150_SIZES],
    ratings: ["150"],
    endPreps: ["buttWeld", "flanged"],
    defaultEndPrep: "buttWeld",
    allow: cs150Records(),
  };
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

export function makePlantTab(name: string): PlantTab {
  const spec = carbonSteel150();
  return {
    kind: "plant",
    id: newFeatureId(),
    name,
    specs: [spec],
    lines: [],
    equipment: [],
    supports: [],
    context: { activeLineId: null, activeSpecId: spec.id, activeNps: spec.nps[0] },
  };
}

export function makeLine(
  name: string,
  spec: Spec,
  nps: number,
  service = "",
  unit = "",
): Line {
  return {
    id: newFeatureId(),
    name,
    service,
    unit,
    specId: spec.id,
    nps,
    runs: [],
    joints: [],
    warnings: [],
  };
}

const ZERO: Vec3 = { x: 0, y: 0, z: 0 };
const UP: Vec3 = { x: 0, y: 0, z: 1 };

export function makeEquipment(
  name: string,
  kind: EquipmentKind,
  origin: Vec3,
  diameter = 1000,
  length = 2000,
): Equipment {
  // A parametric body ships with two datums: one on the head, one on the side.
  // "custom" has none, so it only accepts a freeform nozzle.
  const datums: Datum[] =
    kind === "custom"
      ? []
      : [
          // Top of the shell. Its direction is +Z, which is the one direction the
          // kernel can bore (cylinders grow along +Z and cannot be rotated).
          { id: newFeatureId(), name: "Top", position: { x: 0, y: 0, z: length / 2 }, direction: { ...UP } },
          { id: newFeatureId(), name: "Side", position: { x: diameter / 2, y: 0, z: 0 }, direction: { x: 1, y: 0, z: 0 } },
        ];
  return { id: newFeatureId(), name, kind, origin, diameter, length, datums, nozzles: [] };
}

export function makeNozzle(
  datumId: string | null,
  offset: Vec3,
  direction: Vec3,
  nps: number,
  rating: string,
  facing: EndPrep,
  freeform: boolean,
): Nozzle {
  return {
    id: newFeatureId(),
    datumId,
    offset,
    direction: unit(direction),
    nps,
    rating,
    facing,
    lineId: null,
    freeform,
  };
}

export function makeSupport(hostSegmentId: string, t: number, kind: SupportKind): Support {
  return { id: newFeatureId(), hostSegmentId, t: Math.min(1, Math.max(0, t)), kind };
}

// ---------------------------------------------------------------------------
// Vector helpers (kept here so routing and validation share one definition)
// ---------------------------------------------------------------------------

export function vAdd(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
export function vSub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
export function vScale(a: Vec3, s: number): Vec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}
export function vDot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function vLen(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}
export function unit(a: Vec3): Vec3 {
  const l = vLen(a);
  return l < 1e-9 ? { x: 0, y: 0, z: 0 } : vScale(a, 1 / l);
}
export function vCross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

/** Nearly collinear: the cross product is tiny relative to both lengths. */
export function collinear(a: Vec3, b: Vec3, c: Vec3, tol = 1): boolean {
  const ab = vSub(b, a);
  const bc = vSub(c, b);
  return vLen(vCross(ab, bc)) <= tol * Math.max(vLen(ab), vLen(bc), 1);
}

// ---------------------------------------------------------------------------
// Spec lookup
// ---------------------------------------------------------------------------

export function findSpec(tab: PlantTab, specId: string): Spec | undefined {
  return tab.specs.find((s) => s.id === specId);
}

/**
 * Find the spec record for a fitting. For elbows, `angle` selects the row
 * (exact match wins; otherwise the closest, reported via `approx`).
 */
export function lookupFitting(
  spec: Spec,
  type: ComponentKind,
  nps: number,
  endPrep: EndPrep,
  angle?: number,
  npsOut?: number,
): { record: SpecRecord; approx: boolean } | null {
  const rows = spec.allow.filter(
    (r) =>
      r.type === type &&
      r.nps === nps &&
      r.endPrep === endPrep &&
      (npsOut === undefined || r.npsOut === npsOut),
  );
  if (rows.length === 0) return null;
  if (angle === undefined) return { record: rows[0], approx: false };
  const exact = rows.find((r) => r.angle === angle);
  if (exact) return { record: exact, approx: false };
  const ranked = rows
    .filter((r) => r.angle !== undefined)
    .sort((a, b) => Math.abs(a.angle! - angle) - Math.abs(b.angle! - angle));
  return ranked.length > 0 ? { record: ranked[0], approx: true } : null;
}

function makePort(
  role: PortRole,
  position: Vec3,
  direction: Vec3,
  nps: number,
  endPrep: EndPrep,
  rating: string,
): Port {
  return {
    id: newFeatureId(),
    role,
    position,
    direction: unit(direction),
    nps,
    endPrep,
    rating,
    connectedTo: null,
  };
}

/** Build a straight run between two points. Length is the point distance. */
export function makeStraight(
  spec: Spec,
  nps: number,
  endPrep: EndPrep,
  from: Vec3,
  to: Vec3,
): RunSegment | { error: string } {
  const found = lookupFitting(spec, "straight", nps, endPrep);
  if (!found) return { error: `no straight DN${nps} ${endPrep} in spec "${spec.name}"` };
  const dir = unit(vSub(to, from));
  if (vLen(dir) === 0) return { error: "straight pipe has zero length" };
  return {
    id: newFeatureId(),
    kind: "straight",
    specId: spec.id,
    nps,
    npsOut: nps,
    rating: found.record.rating,
    endPrep,
    length: vLen(vSub(to, from)),
    ports: [
      makePort("MAIN_PORT", from, vScale(dir, -1), nps, endPrep, found.record.rating),
      makePort("RUN_PORT", to, dir, nps, endPrep, found.record.rating),
    ],
  };
}

/**
 * Build an elbow sitting at `corner`. MAIN_PORT faces back along `incoming`
 * (the direction of travel into the corner); RUN_PORT leaves along `outgoing`.
 */
export function makeElbow(
  spec: Spec,
  nps: number,
  endPrep: EndPrep,
  corner: Vec3,
  incoming: Vec3,
  outgoing: Vec3,
): { segment: RunSegment; warning?: string } | { error: string } {
  const angle = (Math.acos(Math.min(1, Math.max(-1, vDot(unit(incoming), unit(outgoing))))) * 180) / Math.PI;
  const found = lookupFitting(spec, "elbow", nps, endPrep, angle);
  if (!found) return { error: `no elbow DN${nps} ${endPrep} in spec "${spec.name}"` };
  const radius = found.record.bendRadius ?? nps * 1.5;
  const back = unit(vScale(incoming, -1));
  const seg: RunSegment = {
    id: newFeatureId(),
    kind: "elbow",
    specId: spec.id,
    nps,
    npsOut: nps,
    rating: found.record.rating,
    endPrep,
    length: found.record.length,
    angle: found.record.angle,
    bendRadius: radius,
    ports: [
      makePort("MAIN_PORT", vAdd(corner, vScale(back, radius)), back, nps, endPrep, found.record.rating),
      makePort("RUN_PORT", vAdd(corner, vScale(unit(outgoing), radius)), unit(outgoing), nps, endPrep, found.record.rating),
    ],
  };
  const warning = found.approx
    ? `elbow ${angle.toFixed(0)}° not in spec; used ${found.record.angle}°`
    : undefined;
  if (warning) seg.warning = warning;
  return { segment: seg, warning };
}

/** Equal tee. Branch leaves `corner` along `branchDir`; the run follows `runDir`. */
export function makeTee(
  spec: Spec,
  nps: number,
  endPrep: EndPrep,
  corner: Vec3,
  runDir: Vec3,
  branchDir: Vec3,
): RunSegment | { error: string } {
  const found = lookupFitting(spec, "tee", nps, endPrep, 90);
  if (!found) return { error: `no tee DN${nps} ${endPrep} in spec "${spec.name}"` };
  const half = found.record.length / 2;
  const run = unit(runDir);
  const branch = unit(branchDir);
  return {
    id: newFeatureId(),
    kind: "tee",
    specId: spec.id,
    nps,
    npsOut: nps,
    rating: found.record.rating,
    endPrep,
    length: found.record.length,
    angle: 90,
    ports: [
      makePort("MAIN_PORT", vAdd(corner, vScale(run, -half)), vScale(run, -1), nps, endPrep, found.record.rating),
      makePort("RUN_PORT", vAdd(corner, vScale(run, half)), run, nps, endPrep, found.record.rating),
      makePort("BRANCH_PORT", vAdd(corner, vScale(branch, half)), branch, nps, endPrep, found.record.rating),
    ],
  };
}

/** A single flange / gasket / bolt-set. Both ports sit on the same face. */
export function makeFlangeKitPart(
  spec: Spec,
  kind: "flange" | "gasket" | "boltSet",
  nps: number,
  at: Vec3,
  outward: Vec3,
): RunSegment | { error: string } {
  const found = lookupFitting(spec, kind, nps, "flanged");
  if (!found) return { error: `no ${kind} DN${nps} in spec "${spec.name}"` };
  const dir = unit(outward);
  const back = vScale(dir, -1);
  return {
    id: newFeatureId(),
    kind,
    specId: spec.id,
    nps,
    npsOut: nps,
    rating: found.record.rating,
    endPrep: "flanged",
    length: found.record.length,
    ports: [
      makePort("MAIN_PORT", at, back, nps, "flanged", found.record.rating),
      makePort("RUN_PORT", vAdd(at, vScale(dir, found.record.length)), dir, nps, "flanged", found.record.rating),
    ],
  };
}

/** A flanged valve, centered so its ports fall at ±length/2 along `dir`. */
export function makeValve(
  spec: Spec,
  nps: number,
  center: Vec3,
  dir: Vec3,
): RunSegment | { error: string } {
  const found = lookupFitting(spec, "valve", nps, "flanged");
  if (!found) return { error: `no valve DN${nps} flanged in spec "${spec.name}"` };
  const axis = unit(dir);
  const half = found.record.length / 2;
  return {
    id: newFeatureId(),
    kind: "valve",
    specId: spec.id,
    nps,
    npsOut: nps,
    rating: found.record.rating,
    endPrep: "flanged",
    length: found.record.length,
    ports: [
      makePort("MAIN_PORT", vAdd(center, vScale(axis, -half)), vScale(axis, -1), nps, "flanged", found.record.rating),
      makePort("RUN_PORT", vAdd(center, vScale(axis, half)), axis, nps, "flanged", found.record.rating),
    ],
  };
}

// ---------------------------------------------------------------------------
// Joints
// ---------------------------------------------------------------------------

export const JOINT_TOLERANCE_MM = 1;

export interface JointCheck {
  ok: boolean;
  /** Which property failed, when `ok` is false. */
  reason?: string;
}

/** A joint exists only when spec, size, end prep, rating, and direction all agree. */
export function canJoin(a: Port, b: Port, specA: string, specB: string): JointCheck {
  if (specA !== specB) return { ok: false, reason: `spec mismatch (${specA} vs ${specB})` };
  if (a.nps !== b.nps) return { ok: false, reason: `size mismatch (DN${a.nps} vs DN${b.nps})` };
  if (a.endPrep !== b.endPrep) return { ok: false, reason: `end prep mismatch (${a.endPrep} vs ${b.endPrep})` };
  if (a.rating !== b.rating) return { ok: false, reason: `rating mismatch (${a.rating} vs ${b.rating})` };
  if (vLen(vSub(a.position, b.position)) > JOINT_TOLERANCE_MM) {
    return { ok: false, reason: "ports are more than 1 mm apart" };
  }
  // Opposite directions: each port points out of its own component.
  if (vDot(a.direction, b.direction) > -0.99) {
    return { ok: false, reason: "port directions are not opposite" };
  }
  return { ok: true };
}

/** Record a joint and point both ports at each other. Mutates both segments. */
export function connect(line: Line, portA: Port, portB: Port): Joint {
  portA.connectedTo = portB.id;
  portB.connectedTo = portA.id;
  const joint: Joint = { id: newFeatureId(), a: portA.id, b: portB.id };
  line.joints.push(joint);
  return joint;
}

export interface OpenPort {
  segmentId: string;
  port: Port;
  specId: string;
}

export function openPorts(line: Line): OpenPort[] {
  const out: OpenPort[] = [];
  for (const seg of line.runs) {
    for (const port of seg.ports) {
      if (port.connectedTo === null) out.push({ segmentId: seg.id, port, specId: seg.specId });
    }
  }
  return out;
}

/**
 * An open port of this line within `tol` mm of `point`, if there is exactly one.
 * Two candidates is ambiguous and returns null — the caller must reject it.
 */
export function portAt(line: Line, point: Vec3, tol = JOINT_TOLERANCE_MM): OpenPort | null {
  const hits = openPorts(line).filter((p) => vLen(vSub(p.port.position, point)) <= tol);
  return hits.length === 1 ? hits[0] : null;
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

export interface RouteResult {
  ok: boolean;
  error?: string;
  /** Ids of the segments this call added. */
  added: string[];
  warnings: string[];
}

interface RouteOptions {
  /** End preparation for the new run. Defaults to the spec's. */
  endPrep?: EndPrep;
  /**
   * When the first point lands on an open port, join to it. When the last point
   * lands on a different open port, join to that too.
   */
  joinExisting?: boolean;
}

/**
 * Route a polyline onto a line.
 *
 * Collinear points collapse into one straight. A corner inserts an elbow from
 * the spec (90° preferred, otherwise the closest angle, with a warning). An
 * endpoint that lands on the middle of an existing straight splits it and
 * inserts a tee. An endpoint that lands on an existing port is joined only
 * after `canJoin` passes; otherwise the whole route is rejected and the line
 * is unchanged.
 */
export function routeRun(
  tab: PlantTab,
  lineId: string,
  points: Vec3[],
  options: RouteOptions = {},
): RouteResult {
  const line = tab.lines.find((l) => l.id === lineId);
  if (!line) return { ok: false, error: `no line "${lineId}"`, added: [], warnings: [] };
  const spec = findSpec(tab, line.specId);
  if (!spec) return { ok: false, error: `line references missing spec "${line.specId}"`, added: [], warnings: [] };
  if (!spec.nps.includes(line.nps)) {
    return { ok: false, error: `DN${line.nps} is not in spec "${spec.name}"`, added: [], warnings: [] };
  }
  if (points.length < 2) return { ok: false, error: "a route needs at least two points", added: [], warnings: [] };

  const endPrep = options.endPrep ?? spec.defaultEndPrep;
  const simplified = simplifyPolyline(points);
  if (simplified.length < 2) return { ok: false, error: "all points are collinear and coincident", added: [], warnings: [] };

  // Work on a copy. Commit only when every joint validates.
  const draft = cloneLine(line);
  const warnings: string[] = [];
  const added: string[] = [];

  const startHit = options.joinExisting ? portAt(draft, simplified[0]) : null;
  const endHit =
    options.joinExisting && !(startHit && vLen(vSub(simplified[simplified.length - 1], simplified[0])) <= JOINT_TOLERANCE_MM)
      ? portAt(draft, simplified[simplified.length - 1])
      : null;

  // Branch onto the middle of an existing straight (either end of the polyline).
  const startBranch = !startHit ? branchPoint(draft, simplified[0]) : null;
  const endBranch = !endHit ? branchPoint(draft, simplified[simplified.length - 1]) : null;
  if (startBranch && endBranch && startBranch.segmentId === endBranch.segmentId) {
    return { ok: false, error: "both ends land on the same straight", added: [], warnings: [] };
  }

  let cursor = simplified[0];
  let incoming: Vec3 | null = null;

  if (startBranch) {
    const tee = insertTee(draft, spec, startBranch, unit(vSub(simplified[1], simplified[0])), endPrep);
    if ("error" in tee) return { ok: false, error: tee.error, added: [], warnings: [] };
    added.push(tee.tee.id, ...tee.replacements.map((s) => s.id));
    cursor = tee.branchPort.position;
    incoming = tee.branchPort.direction;
  }

  for (let i = 1; i < simplified.length; i++) {
    const target = simplified[i];
    const travel = unit(vSub(target, cursor));
    if (vLen(travel) === 0) continue;

    if (incoming && vDot(incoming, travel) < 0.999) {
      const elbow = makeElbow(spec, line.nps, endPrep, cursor, incoming, travel);
      if ("error" in elbow) return { ok: false, error: elbow.error, added: [], warnings: [] };
      if (elbow.warning) warnings.push(elbow.warning);
      // The elbow consumes `bendRadius` on each side of the corner, so the
      // straight must stop at the elbow's near port rather than at the corner.
      const elbowStart = elbow.segment.ports[0].position;
      const prev = [...draft.runs].reverse().find((s) => added.includes(s.id) && s.kind === "straight");
      if (prev && prev.ports.length === 2) {
        const trimmed = makeStraight(spec, line.nps, endPrep, prev.ports[0].position, elbowStart);
        if ("error" in trimmed) return { ok: false, error: trimmed.error, added: [], warnings: [] };
        trimmed.id = prev.id;
        trimmed.ports[0].id = prev.ports[0].id;
        trimmed.ports[0].connectedTo = prev.ports[0].connectedTo;
        const idx = draft.runs.findIndex((s) => s.id === prev.id);
        draft.runs[idx] = trimmed;
        draft.joints.forEach((j) => {
          if (j.a === prev.ports[1].id) j.a = trimmed.ports[1].id;
          if (j.b === prev.ports[1].id) j.b = trimmed.ports[1].id;
        });
      }
      const join = joinToCursor(draft, elbowStart, elbow.segment);
      if (join) return { ok: false, error: join, added: [], warnings: [] };
      draft.runs.push(elbow.segment);
      added.push(elbow.segment.id);
      cursor = elbow.segment.ports[1].position;
      incoming = elbow.segment.ports[1].direction;
    }

    const isLast = i === simplified.length - 1;
    const branch = isLast ? endBranch : null;
    const straightEnd = branch ? branch.point : target;
    if (vLen(vSub(straightEnd, cursor)) > JOINT_TOLERANCE_MM) {
      const straight = makeStraight(spec, line.nps, endPrep, cursor, straightEnd);
      if ("error" in straight) return { ok: false, error: straight.error, added: [], warnings: [] };
      const join = joinToCursor(draft, cursor, straight);
      if (join) return { ok: false, error: join, added: [], warnings: [] };
      draft.runs.push(straight);
      added.push(straight.id);
      cursor = straight.ports[1].position;
      incoming = straight.ports[1].direction;
    }

    if (branch && incoming) {
      const tee = insertTee(draft, spec, branch, vScale(incoming, -1), endPrep);
      if ("error" in tee) return { ok: false, error: tee.error, added: [], warnings: [] };
      const join = joinToCursor(draft, cursor, tee.tee, tee.branchPort);
      if (join) return { ok: false, error: join, added: [], warnings: [] };
      added.push(tee.tee.id, ...tee.replacements.map((s) => s.id));
      cursor = tee.branchPort.position;
      incoming = null;
    }
  }

  // Join the dangling start to an existing port, now that the new segment exists.
  if (startHit) {
    const fresh = draft.runs.find((s) => added.includes(s.id) && s.ports.some((p) => vLen(vSub(p.position, simplified[0])) <= JOINT_TOLERANCE_MM));
    const port = fresh?.ports.find((p) => vLen(vSub(p.position, simplified[0])) <= JOINT_TOLERANCE_MM);
    if (!port) return { ok: false, error: "route did not reach the existing port", added: [], warnings: [] };
    const check = canJoin(port, startHit.port, fresh!.specId, startHit.specId);
    if (!check.ok) return { ok: false, error: `cannot join: ${check.reason}`, added: [], warnings: [] };
    connect(draft, port, startHit.port);
  }
  if (endHit && incoming) {
    const fresh = [...draft.runs].reverse().find((s) => added.includes(s.id));
    const port = fresh?.ports.find((p) => p.connectedTo === null && vDot(p.direction, incoming!) > 0.99);
    if (!port) return { ok: false, error: "route did not reach the existing port", added: [], warnings: [] };
    const check = canJoin(port, endHit.port, fresh!.specId, endHit.specId);
    if (!check.ok) return { ok: false, error: `cannot join: ${check.reason}`, added: [], warnings: [] };
    connect(draft, port, endHit.port);
  }

  if (endPrep === "flanged") {
    const kitWarnings = addFlangeKits(draft, spec, added);
    warnings.push(...kitWarnings);
  }

  // The elbow is inserted before the straight that reaches it, so the first pass
  // can miss that joint. A second pass closes any pair of open ports that meet.
  const missed = closeCoincidentPorts(draft);
  if (missed) return { ok: false, error: missed, added: [], warnings: [] };

  draft.warnings.push(...warnings);
  commitLine(line, draft);
  return { ok: true, added, warnings };
}

/** Drop interior points that lie on the segment between their neighbours. */
function simplifyPolyline(points: Vec3[]): Vec3[] {
  if (points.length < 3) return dedupe(points);
  const out: Vec3[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    if (!collinear(out[out.length - 1], points[i], points[i + 1])) out.push(points[i]);
  }
  out.push(points[points.length - 1]);
  return dedupe(out);
}

function dedupe(points: Vec3[]): Vec3[] {
  const out: Vec3[] = [];
  for (const p of points) {
    if (out.length === 0 || vLen(vSub(out[out.length - 1], p)) > JOINT_TOLERANCE_MM) out.push(p);
  }
  return out;
}

/** Where a point hits the interior of a straight (not within tolerance of either port). */
function branchPoint(line: Line, point: Vec3): { segmentId: string; point: Vec3; t: number } | null {
  for (const seg of line.runs) {
    if (seg.kind !== "straight" || seg.ports.length < 2) continue;
    const a = seg.ports[0].position;
    const b = seg.ports[1].position;
    const ab = vSub(b, a);
    const len = vLen(ab);
    if (len < 1) continue;
    const t = vDot(vSub(point, a), ab) / (len * len);
    if (t <= 0.02 || t >= 0.98) continue;
    const proj = vAdd(a, vScale(ab, t));
    if (vLen(vSub(proj, point)) <= JOINT_TOLERANCE_MM) return { segmentId: seg.id, point: proj, t };
  }
  return null;
}

interface TeeInsertion {
  tee: RunSegment;
  branchPort: Port;
  replacements: RunSegment[];
}

/**
 * Split `hit`'s straight at the hit point and insert a tee whose branch leaves
 * along `branchDir`. The two replacement straights inherit the original joints
 * at the outer ends.
 */
function insertTee(
  line: Line,
  spec: Spec,
  hit: { segmentId: string; point: Vec3 },
  branchDir: Vec3,
  endPrep: EndPrep,
): TeeInsertion | { error: string } {
  const seg = line.runs.find((s) => s.id === hit.segmentId);
  if (!seg || seg.kind !== "straight") return { error: "branch target is not a straight" };
  const [main, run] = seg.ports;
  const runDir = unit(vSub(run.position, main.position));
  const tee = makeTee(spec, seg.nps, endPrep, hit.point, runDir, branchDir);
  if ("error" in tee) return tee;

  const left = makeStraight(spec, seg.nps, seg.endPrep, main.position, tee.ports[0].position);
  const right = makeStraight(spec, seg.nps, seg.endPrep, tee.ports[1].position, run.position);
  if ("error" in left || "error" in right) return { error: "error" in left ? left.error : (right as { error: string }).error };

  // Re-hang the joints that were on the straight's outer ports.
  rehang(line, main, left.ports[0]);
  rehang(line, run, right.ports[1]);
  connect(line, left.ports[1], tee.ports[0]);
  connect(line, tee.ports[1], right.ports[0]);

  line.runs = line.runs.filter((s) => s.id !== seg.id);
  line.runs.push(left, tee, right);
  return { tee, branchPort: tee.ports[2], replacements: [left, right] };
}

/** Point a joint that referenced `oldPort` at `newPort` instead. */
function rehang(line: Line, oldPort: Port, newPort: Port): void {
  if (!oldPort.connectedTo) return;
  const joint = line.joints.find((j) => j.a === oldPort.id || j.b === oldPort.id);
  if (!joint) return;
  const otherId = joint.a === oldPort.id ? joint.b : joint.a;
  const other = findPort(line, otherId);
  joint.a = newPort.id;
  joint.b = otherId;
  newPort.connectedTo = otherId;
  if (other) other.connectedTo = newPort.id;
}

function findPort(line: Line, portId: string): Port | undefined {
  for (const seg of line.runs) {
    const port = seg.ports.find((p) => p.id === portId);
    if (port) return port;
  }
  return undefined;
}

/**
 * Join `segment` to whatever open port already sits on `cursor`. Either side may
 * already be in the line: the elbow is added before the straight that reaches it,
 * so the search has to look both ways. Returns an error, or null when nothing is
 * waiting there.
 */
function joinToCursor(line: Line, cursor: Vec3, segment: RunSegment, explicit?: Port): string | null {
  const mine =
    explicit ??
    segment.ports.find((p) => p.connectedTo === null && vLen(vSub(p.position, cursor)) <= JOINT_TOLERANCE_MM);
  if (!mine || mine.connectedTo) return null;
  const other = openPorts(line).find(
    (p) => p.segmentId !== segment.id && vLen(vSub(p.port.position, mine.position)) <= JOINT_TOLERANCE_MM,
  );
  if (!other) return null;
  const check = canJoin(mine, other.port, segment.specId, other.specId);
  if (!check.ok) return `cannot join: ${check.reason}`;
  connect(line, mine, other.port);
  return null;
}

/**
 * For every flanged port added in this batch that is still open, attach a
 * flange, a gasket, and a bolt set, in that order, pointing outward.
 */
function addFlangeKits(line: Line, spec: Spec, added: string[]): string[] {
  const warnings: string[] = [];
  const targets: Port[] = [];
  for (const seg of line.runs) {
    if (!added.includes(seg.id)) continue;
    if (seg.kind === "flange" || seg.kind === "gasket" || seg.kind === "boltSet") continue;
    for (const port of seg.ports) {
      if (port.connectedTo === null && port.endPrep === "flanged") targets.push(port);
    }
  }
  for (const port of targets) {
    let cursor = port;
    for (const kind of ["flange", "gasket", "boltSet"] as const) {
      const part = makeFlangeKitPart(spec, kind, port.nps, cursor.position, cursor.direction);
      if ("error" in part) {
        warnings.push(part.error);
        break;
      }
      // The kit part's MAIN_PORT faces back toward `cursor`; turn it around so
      // the two outward directions oppose.
      part.ports[0].direction = vScale(unit(cursor.direction), -1);
      const check = canJoin(cursor, part.ports[0], spec.id, part.specId);
      if (!check.ok) {
        warnings.push(`flange kit skipped: ${check.reason}`);
        break;
      }
      line.runs.push(part);
      added.push(part.id);
      connect(line, cursor, part.ports[0]);
      cursor = part.ports[1];
    }
  }
  return warnings;
}

/** Join every pair of open ports that occupy the same point and agree. */
function closeCoincidentPorts(line: Line): string | null {
  const open = openPorts(line);
  const used = new Set<string>();
  for (let i = 0; i < open.length; i++) {
    if (used.has(open[i].port.id)) continue;
    for (let j = i + 1; j < open.length; j++) {
      if (used.has(open[j].port.id)) continue;
      if (vLen(vSub(open[i].port.position, open[j].port.position)) > JOINT_TOLERANCE_MM) continue;
      const check = canJoin(open[i].port, open[j].port, open[i].specId, open[j].specId);
      if (!check.ok) return `cannot join: ${check.reason}`;
      connect(line, open[i].port, open[j].port);
      used.add(open[i].port.id);
      used.add(open[j].port.id);
      break;
    }
  }
  return null;
}

function cloneLine(line: Line): Line {
  return JSON.parse(JSON.stringify(line)) as Line;
}

/** Copy the mutated draft back onto the live line (same object the tab holds). */
function commitLine(line: Line, draft: Line): void {
  line.runs = draft.runs;
  line.joints = draft.joints;
  line.warnings = draft.warnings;
}

// ---------------------------------------------------------------------------
// Spec / size change
// ---------------------------------------------------------------------------

export interface ChangeSpecResult {
  replaced: number;
  /** Components that have no equivalent in the new spec. They stay, with a warning. */
  warned: string[];
}

/**
 * Point a line at a new spec and size. Everything the new spec can build is
 * rebuilt in place (ports keep their positions and connections); anything it
 * cannot is left where it is and flagged. Nothing is deleted.
 */
export function changeLineSpec(
  tab: PlantTab,
  lineId: string,
  specId: string,
  nps: number,
): ChangeSpecResult | { error: string } {
  const line = tab.lines.find((l) => l.id === lineId);
  if (!line) return { error: `no line "${lineId}"` };
  const spec = findSpec(tab, specId);
  if (!spec) return { error: `no spec "${specId}"` };
  if (!spec.nps.includes(nps)) return { error: `DN${nps} is not in spec "${spec.name}"` };

  let replaced = 0;
  const warned: string[] = [];
  for (const seg of line.runs) {
    const found = lookupFitting(spec, seg.kind, nps, seg.endPrep, seg.angle, seg.kind === "reducer" ? seg.npsOut : undefined);
    if (!found) {
      const msg = `${seg.kind} DN${nps} ${seg.endPrep} is not in spec "${spec.name}"`;
      seg.warning = msg;
      warned.push(`${seg.id}: ${msg}`);
      continue;
    }
    seg.specId = spec.id;
    seg.nps = nps;
    seg.rating = found.record.rating;
    seg.length = seg.kind === "straight" ? seg.length : found.record.length;
    seg.bendRadius = found.record.bendRadius;
    seg.angle = found.record.angle ?? seg.angle;
    delete seg.warning;
    for (const port of seg.ports) {
      port.nps = nps;
      port.rating = found.record.rating;
    }
    replaced++;
  }
  line.specId = spec.id;
  line.nps = nps;
  if (warned.length > 0) line.warnings.push(...warned);
  return { replaced, warned };
}

// ---------------------------------------------------------------------------
// Connectivity, bill of materials, isometric
// ---------------------------------------------------------------------------

export interface ConnectivityIssue {
  segmentId: string;
  portId: string;
  message: string;
}

/** Open ports, and ports whose recorded joint disagrees in size or direction. */
export function checkConnectivity(line: Line): ConnectivityIssue[] {
  const issues: ConnectivityIssue[] = [];
  const byId = new Map<string, { seg: RunSegment; port: Port }>();
  for (const seg of line.runs) for (const port of seg.ports) byId.set(port.id, { seg, port });

  for (const seg of line.runs) {
    for (const port of seg.ports) {
      if (!port.connectedTo) {
        issues.push({ segmentId: seg.id, portId: port.id, message: `${seg.kind} ${port.role} is open` });
        continue;
      }
      const other = byId.get(port.connectedTo);
      if (!other) {
        issues.push({ segmentId: seg.id, portId: port.id, message: "joint references a missing port" });
        continue;
      }
      if (port.nps !== other.port.nps) {
        issues.push({
          segmentId: seg.id,
          portId: port.id,
          message: `size conflict DN${port.nps} vs DN${other.port.nps}`,
        });
      }
      if (vDot(port.direction, other.port.direction) > -0.99) {
        issues.push({ segmentId: seg.id, portId: port.id, message: "direction conflict" });
      }
    }
  }
  return issues;
}

export interface BomRow {
  kind: ComponentKind;
  spec: string;
  nps: number;
  /** Piece count. Straights contribute 0; their length is totaled instead. */
  count: number;
  /** Total length (mm). Only straights accumulate this. */
  length: number;
}

export function billOfMaterials(tab: PlantTab, lineId: string): BomRow[] | { error: string } {
  const line = tab.lines.find((l) => l.id === lineId);
  if (!line) return { error: `no line "${lineId}"` };
  const spec = findSpec(tab, line.specId);
  const rows = new Map<string, BomRow>();
  for (const seg of line.runs) {
    const key = `${seg.kind}|${seg.nps}|${seg.specId}`;
    const row = rows.get(key) ?? {
      kind: seg.kind,
      spec: spec?.name ?? seg.specId,
      nps: seg.nps,
      count: 0,
      length: 0,
    };
    if (seg.kind === "straight") row.length += seg.length;
    else row.count += 1;
    rows.set(key, row);
  }
  return [...rows.values()];
}

export interface IsoItem {
  kind: ComponentKind;
  /** Position along the unfolded centerline (mm). */
  at: number;
  label: string;
}

export interface Isometric {
  /** Total unfolded length (mm). */
  length: number;
  items: IsoItem[];
  svg: string;
}

/**
 * Unfold one line into a 2D centerline: straights run horizontally, elbows keep
 * only their angle. Output is an SVG with nominal size, length, and a fitting
 * number per component. No drawing frame.
 */
export function isometric(line: Line): Isometric {
  // Walk the run from a port that starts a chain. Order segments by following joints.
  const ordered = orderSegments(line);
  const items: IsoItem[] = [];
  let at = 0;
  let fittingNo = 0;
  for (const seg of ordered) {
    if (seg.kind === "straight") {
      items.push({ kind: seg.kind, at, label: `DN${seg.nps}  L=${Math.round(seg.length)}` });
      at += seg.length;
    } else {
      fittingNo++;
      const angle = seg.angle ? ` ${seg.angle}°` : "";
      items.push({ kind: seg.kind, at, label: `${fittingNo} ${seg.kind}${angle} DN${seg.nps}` });
    }
  }

  const width = Math.max(240, at / 4 + 80);
  const height = 140;
  const x0 = 40;
  const y = 70;
  const scale = at > 0 ? (width - 80) / at : 1;
  const ticks = items
    .map((item) => {
      const x = x0 + item.at * scale;
      return `<g><line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" stroke="#ccc"/><text x="${x}" y="${y + 24}" fill="#ccc" font-size="10">${item.label}</text></g>`;
    })
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<rect width="100%" height="100%" fill="#1a1a1a"/>` +
    `<line x1="${x0}" y1="${y}" x2="${x0 + at * scale}" y2="${y}" stroke="#e8e8e8" stroke-width="2"/>` +
    ticks +
    `</svg>`;
  return { length: at, items, svg };
}

/** Order a line's segments by walking joints, so the iso reads from one end. */
function orderSegments(line: Line): RunSegment[] {
  if (line.runs.length === 0) return [];
  const byId = new Map(line.runs.map((s) => [s.id, s]));
  const portOwner = new Map<string, string>();
  for (const seg of line.runs) for (const port of seg.ports) portOwner.set(port.id, seg.id);
  const neighbours = new Map<string, string[]>();
  for (const seg of line.runs) neighbours.set(seg.id, []);
  for (const joint of line.joints) {
    const a = portOwner.get(joint.a);
    const b = portOwner.get(joint.b);
    if (a && b && a !== b) {
      neighbours.get(a)!.push(b);
      neighbours.get(b)!.push(a);
    }
  }
  // Start at an end (one neighbour) when there is one, else anywhere.
  const start = line.runs.find((s) => (neighbours.get(s.id)?.length ?? 0) <= 1) ?? line.runs[0];
  const ordered: RunSegment[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined = start.id;
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    const seg = byId.get(cursor);
    if (seg) ordered.push(seg);
    cursor = neighbours.get(cursor)?.find((n) => !seen.has(n));
  }
  // Anything not on the walked chain (a disconnected branch) follows.
  for (const seg of line.runs) if (!seen.has(seg.id)) ordered.push(seg);
  return ordered;
}

// ---------------------------------------------------------------------------
// Equipment nozzles
// ---------------------------------------------------------------------------

/** World position of a nozzle: equipment origin + datum + offset. */
export function nozzlePosition(equipment: Equipment, nozzle: Nozzle): Vec3 {
  const datum = nozzle.datumId ? equipment.datums.find((d) => d.id === nozzle.datumId) : undefined;
  const base = datum ? datum.position : ZERO;
  return vAdd(equipment.origin, vAdd(base, nozzle.offset));
}

/** Move equipment. Nozzles ride along because their position is derived. */
export function moveEquipment(equipment: Equipment, origin: Vec3): void {
  equipment.origin = origin;
}

/**
 * Delete equipment and everything that hangs off it. Returns the nozzle ids
 * removed so the caller can drop their geometry.
 */
export function deleteEquipment(tab: PlantTab, equipmentId: string): string[] {
  const equipment = tab.equipment.find((e) => e.id === equipmentId);
  if (!equipment) return [];
  const nozzleIds = equipment.nozzles.map((n) => n.id);
  tab.equipment = tab.equipment.filter((e) => e.id !== equipmentId);
  return nozzleIds;
}

// ---------------------------------------------------------------------------
// Validation (pure, no kernel)
// ---------------------------------------------------------------------------

export interface PlantValidation {
  ok: boolean;
  errors: string[];
}

export function validatePlant(tab: PlantTab): PlantValidation {
  const errors: string[] = [];
  const specIds = new Set(tab.specs.map((s) => s.id));
  const segmentIds = new Set<string>();

  for (const line of tab.lines) {
    if (!specIds.has(line.specId)) errors.push(`line ${line.name} references missing spec ${line.specId}`);
    const spec = tab.specs.find((s) => s.id === line.specId);
    for (const seg of line.runs) {
      segmentIds.add(seg.id);
      if (spec && !seg.warning && !lookupFitting(spec, seg.kind, seg.nps, seg.endPrep, seg.angle)) {
        errors.push(`${seg.kind} ${seg.id} is not in spec "${spec.name}"`);
      }
      for (const port of seg.ports) {
        if (port.connectedTo) {
          const peer = line.runs.some((s) => s.ports.some((p) => p.id === port.connectedTo));
          if (!peer) errors.push(`port ${port.id} joins a port that is not on this line`);
        }
      }
    }
    for (const joint of line.joints) {
      const a = findPort(line, joint.a);
      const b = findPort(line, joint.b);
      if (!a || !b) errors.push(`joint ${joint.id} references a missing port`);
    }
  }

  for (const equipment of tab.equipment) {
    for (const nozzle of equipment.nozzles) {
      if (nozzle.freeform) continue;
      if (!nozzle.datumId || !equipment.datums.some((d) => d.id === nozzle.datumId)) {
        errors.push(`nozzle ${nozzle.id} is not attached to a datum on ${equipment.name}`);
      }
    }
  }

  for (const support of tab.supports) {
    if (!segmentIds.has(support.hostSegmentId)) {
      errors.push(`support ${support.id} host ${support.hostSegmentId} is missing`);
    }
  }

  return { ok: errors.length === 0, errors };
}
