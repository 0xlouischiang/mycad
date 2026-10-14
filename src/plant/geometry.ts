/**
 * Procedural geometry for plant components.
 *
 * Straights, elbows, tees, flanges, valves, vessels, and nozzles are plain
 * triangle meshes built on the main thread — no OCCT round-trip per segment.
 * Only a nozzle cut through a vessel shell goes through the kernel, and it does
 * so from `nozzleCut.ts`, not from here. Output matches the BIM mesh shape so
 * the preview can consume either.
 *
 * Pure (no three.js, no DOM) so it unit-tests in the node harness.
 */
import type { BimMesh } from "../bim/geometry";
import type { Equipment, Nozzle, RunSegment, Vec3 } from "../model/plant";
import { nozzlePosition, vAdd, vCross, vScale, vSub } from "../model/plant";

type V3 = [number, number, number];

class MeshBuilder {
  private pos: number[] = [];
  private nrm: number[] = [];
  private idx: number[] = [];

  tri(a: V3, b: V3, c: V3): void {
    const n = normal(a, b, c);
    const base = this.pos.length / 3;
    for (const p of [a, b, c]) {
      this.pos.push(p[0], p[1], p[2]);
      this.nrm.push(n[0], n[1], n[2]);
    }
    this.idx.push(base, base + 1, base + 2);
  }

  build(): BimMesh {
    return {
      positions: new Float32Array(this.pos),
      normals: new Float32Array(this.nrm),
      indices: new Uint32Array(this.idx),
    };
  }
}

function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function normal(a: V3, b: V3, c: V3): V3 {
  const n = cross(sub(b, a), sub(c, a));
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / len, n[1] / len, n[2] / len];
}

/** An orthonormal basis whose Z axis is `axis`. */
function basis(axis: Vec3): [V3, V3, V3] {
  const z: V3 = [axis.x, axis.y, axis.z];
  const helper: V3 = Math.abs(axis.z) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const x = cross(helper, z);
  const xl = Math.hypot(x[0], x[1], x[2]) || 1;
  const xv: V3 = [x[0] / xl, x[1] / xl, x[2] / xl];
  const y = cross(z, xv);
  return [xv, y, z];
}

const SIDES = 12;

/** A tube along `axis` (unit) from `from`, of the given length and radius. */
function tube(mb: MeshBuilder, from: V3, axis: V3, length: number, radius: number): void {
  const [bx, by] = basis({ x: axis[0], y: axis[1], z: axis[2] });
  const ring = (t: number): V3[] => {
    const c: V3 = [from[0] + axis[0] * t, from[1] + axis[1] * t, from[2] + axis[2] * t];
    const pts: V3[] = [];
    for (let i = 0; i < SIDES; i++) {
      const a = (i / SIDES) * Math.PI * 2;
      pts.push([
        c[0] + (Math.cos(a) * bx[0] + Math.sin(a) * by[0]) * radius,
        c[1] + (Math.cos(a) * bx[1] + Math.sin(a) * by[1]) * radius,
        c[2] + (Math.cos(a) * bx[2] + Math.sin(a) * by[2]) * radius,
      ]);
    }
    return pts;
  };
  const a = ring(0);
  const b = ring(length);
  for (let i = 0; i < SIDES; i++) {
    const j = (i + 1) % SIDES;
    mb.tri(a[i], b[i], b[j]);
    mb.tri(a[i], b[j], a[j]);
  }
}

function toV3(v: Vec3): V3 {
  return [v.x, v.y, v.z];
}

/** Outside radius used for every fitting of a given nominal size. */
function radiusOf(nps: number): number {
  return nps * 0.6;
}

/** Mesh for one run component. Gaskets and bolt sets are not drawn. */
export function segmentMesh(seg: RunSegment): BimMesh | null {
  if (seg.kind === "gasket" || seg.kind === "boltSet") return null;
  const main = seg.ports.find((p) => p.role === "MAIN_PORT");
  const run = seg.ports.find((p) => p.role === "RUN_PORT");
  if (!main || !run) return null;
  const mb = new MeshBuilder();
  const r = radiusOf(seg.nps);

  if (seg.kind === "elbow" && seg.bendRadius && seg.angle) {
    elbowMesh(mb, seg, r);
  } else if (seg.kind === "tee") {
    const branch = seg.ports.find((p) => p.role === "BRANCH_PORT");
    tube(mb, toV3(main.position), toV3(run.direction), seg.length, r);
    if (branch) {
      const half = seg.length / 2;
      const center: V3 = [
        main.position.x + run.direction.x * half,
        main.position.y + run.direction.y * half,
        main.position.z + run.direction.z * half,
      ];
      tube(mb, center, toV3(branch.direction), half, r * 0.9);
    }
  } else if (seg.kind === "flange") {
    tube(mb, toV3(main.position), toV3(run.direction), seg.length, r * 1.6);
  } else if (seg.kind === "valve") {
    tube(mb, toV3(main.position), toV3(run.direction), seg.length, r);
    // Handwheel: a short disc at the midpoint, sticking up.
    const mid: V3 = [
      (main.position.x + run.position.x) / 2,
      (main.position.y + run.position.y) / 2,
      (main.position.z + run.position.z) / 2,
    ];
    tube(mb, mid, [0, 0, 1], r * 1.5, r * 0.3);
  } else {
    const len = Math.hypot(run.position.x - main.position.x, run.position.y - main.position.y, run.position.z - main.position.z);
    tube(mb, toV3(main.position), toV3(run.direction), len || seg.length, r);
  }
  return mb.build();
}

/** Torus slice from MAIN_PORT to RUN_PORT about the bend center. */
function elbowMesh(mb: MeshBuilder, seg: RunSegment, radius: number): void {
  const main = seg.ports[0];
  const run = seg.ports[1];
  const bend = seg.bendRadius!;
  // Bend center is `bendRadius` back along each port's outward direction.
  const center = vAdd(main.position, vScale(main.direction, -bend));
  const from = vSub(main.position, center);
  const to = vSub(run.position, center);
  const normal = vCross(from, to);
  const angle = (seg.angle! * Math.PI) / 180;
  const steps = 8;
  const rings: V3[][] = [];
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * angle;
    const dir = rotate(from, normal, t);
    const c = vAdd(center, dir);
    rings.push(ringAbout(c, dir, radius));
  }
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < SIDES; i++) {
      const j = (i + 1) % SIDES;
      mb.tri(rings[s][i], rings[s + 1][i], rings[s + 1][j]);
      mb.tri(rings[s][i], rings[s + 1][j], rings[s][j]);
    }
  }
}

/** Rotate `v` around `axis` by `radians` (Rodrigues). */
function rotate(v: Vec3, axis: Vec3, radians: number): Vec3 {
  const k = { x: axis.x, y: axis.y, z: axis.z };
  const len = Math.hypot(k.x, k.y, k.z) || 1;
  k.x /= len;
  k.y /= len;
  k.z /= len;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dot = v.x * k.x + v.y * k.y + v.z * k.z;
  const cr = vCross(k, v);
  return {
    x: v.x * cos + cr.x * sin + k.x * dot * (1 - cos),
    y: v.y * cos + cr.y * sin + k.y * dot * (1 - cos),
    z: v.z * cos + cr.z * sin + k.z * dot * (1 - cos),
  };
}

function ringAbout(center: Vec3, axis: Vec3, radius: number): V3[] {
  const [bx, by] = basis(axis);
  const pts: V3[] = [];
  for (let i = 0; i < SIDES; i++) {
    const a = (i / SIDES) * Math.PI * 2;
    pts.push([
      center.x + (Math.cos(a) * bx[0] + Math.sin(a) * by[0]) * radius,
      center.y + (Math.cos(a) * bx[1] + Math.sin(a) * by[1]) * radius,
      center.z + (Math.cos(a) * bx[2] + Math.sin(a) * by[2]) * radius,
    ]);
  }
  return pts;
}

/**
 * Vessel body: a cylinder standing on Z, centered on the equipment origin.
 * Matches the kernel cylinder used for nozzle bores, so the procedural body and
 * the cut body occupy the same space.
 */
export function equipmentMesh(equipment: Equipment): BimMesh {
  const mb = new MeshBuilder();
  const r = equipment.diameter / 2;
  const from: V3 = [equipment.origin.x, equipment.origin.y, equipment.origin.z - equipment.length / 2];
  tube(mb, from, [0, 0, 1], equipment.length, r);
  for (const nozzle of equipment.nozzles) nozzleMesh(mb, equipment, nozzle);
  return mb.build();
}

/** A short stub at the nozzle's world position, pointing along its direction. */
function nozzleMesh(mb: MeshBuilder, equipment: Equipment, nozzle: Nozzle): void {
  const at = nozzlePosition(equipment, nozzle);
  tube(mb, toV3(at), toV3(nozzle.direction), nozzle.nps, radiusOf(nozzle.nps));
}

/** Support marker: a small post under the host point. */
export function supportMesh(at: Vec3): BimMesh {
  const mb = new MeshBuilder();
  tube(mb, [at.x, at.y, at.z - 200], [0, 0, 1], 200, 30);
  return mb.build();
}

/** Merge several meshes into one. Used to draw a whole line as a single object. */
export function mergeMeshes(meshes: BimMesh[]): BimMesh {
  let posLen = 0;
  let idxLen = 0;
  for (const m of meshes) {
    posLen += m.positions.length;
    idxLen += m.indices.length;
  }
  const positions = new Float32Array(posLen);
  const normals = new Float32Array(posLen);
  const indices = new Uint32Array(idxLen);
  let pv = 0;
  let iv = 0;
  let base = 0;
  for (const m of meshes) {
    positions.set(m.positions, pv);
    normals.set(m.normals, pv);
    for (let i = 0; i < m.indices.length; i++) indices[iv + i] = m.indices[i] + base;
    pv += m.positions.length;
    iv += m.indices.length;
    base += m.positions.length / 3;
  }
  return { positions, normals, indices };
}
