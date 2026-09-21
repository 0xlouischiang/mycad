/**
 * Named multi-solid ASCII STL from a tessellated mesh + FaceRef patches.
 *
 * occt-wasm cannot export per-face B-rep solids. The tessellation already
 * groups triangles by CAD face (`faceGroups` in INDEX units); we compute the
 * same FaceRef bbox-center string catalogGeometry / Viewport use, bucket
 * triangles by tagged patch name, and emit one `solid <name>` per bucket.
 *
 * Pure (no kernel / DOM). Vertices optionally scaled (0.001 = mm → m).
 */
import type { MeshPayload } from "../kernel/protocol";
import { faceRefFromPoints } from "../model/edgeRef";
import { isValidPatchName } from "../model/cfd";

export interface NamedStlPatch {
  faceRef: string;
  name: string;
}

export interface NamedStlOpts {
  defaultName?: string;
  /** Multiply vertex coordinates (use 0.001 to convert CAD mm → metres). */
  scale?: number;
}

export interface NamedStlResult {
  stl: string;
  unusedRefs: string[];
  solids: string[];
}

export function meshToNamedStl(
  mesh: MeshPayload,
  patches: NamedStlPatch[],
  opts: NamedStlOpts = {},
): NamedStlResult {
  const defaultName = opts.defaultName ?? "walls";
  const scale = opts.scale ?? 1;
  if (!isValidPatchName(defaultName)) {
    return { stl: "", unusedRefs: [], solids: [] };
  }

  const refToName = new Map<string, string>();
  for (const p of patches) {
    if (isValidPatchName(p.name)) refToName.set(p.faceRef, p.name);
  }
  const used = new Set<string>();
  const buckets = new Map<string, number[][]>(); // name → list of [x,y,z, x,y,z, x,y,z]

  const fg = mesh.faceGroups;
  const idx = mesh.indices;
  const pos = mesh.positions;
  const nrm = mesh.normals;

  for (let g = 0; g < fg.length; g += 3) {
    const indexStart = fg[g];
    const indexCount = fg[g + 1];
    const coords: number[] = [];
    for (let i = indexStart; i < indexStart + indexCount; i++) {
      const v = idx[i] * 3;
      coords.push(pos[v], pos[v + 1], pos[v + 2]);
    }
    const ref = faceRefFromPoints(coords);
    const name = refToName.get(ref) ?? defaultName;
    if (refToName.has(ref)) used.add(ref);
    let bucket = buckets.get(name);
    if (!bucket) {
      bucket = [];
      buckets.set(name, bucket);
    }
    for (let i = indexStart; i + 2 < indexStart + indexCount; i += 3) {
      const a = idx[i] * 3;
      const b = idx[i + 1] * 3;
      const c = idx[i + 2] * 3;
      bucket.push([
        pos[a], pos[a + 1], pos[a + 2],
        pos[b], pos[b + 1], pos[b + 2],
        pos[c], pos[c + 1], pos[c + 2],
        nrm[a], nrm[a + 1], nrm[a + 2],
      ]);
    }
  }

  const unusedRefs = [...refToName.keys()].filter((r) => !used.has(r));
  const solids = [...buckets.keys()];
  const lines: string[] = [];
  for (const [name, tris] of buckets) {
    lines.push(`solid ${name}`);
    for (const t of tris) {
      // Prefer a geometric normal so OpenFOAM's orientation is consistent.
      const ux = t[3] - t[0];
      const uy = t[4] - t[1];
      const uz = t[5] - t[2];
      const vx = t[6] - t[0];
      const vy = t[7] - t[1];
      const vz = t[8] - t[2];
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz);
      if (len > 0) {
        nx /= len;
        ny /= len;
        nz /= len;
      } else {
        nx = t[9];
        ny = t[10];
        nz = t[11];
      }
      lines.push(`  facet normal ${fmt(nx)} ${fmt(ny)} ${fmt(nz)}`);
      lines.push("    outer loop");
      lines.push(
        `      vertex ${fmt(t[0] * scale)} ${fmt(t[1] * scale)} ${fmt(t[2] * scale)}`,
      );
      lines.push(
        `      vertex ${fmt(t[3] * scale)} ${fmt(t[4] * scale)} ${fmt(t[5] * scale)}`,
      );
      lines.push(
        `      vertex ${fmt(t[6] * scale)} ${fmt(t[7] * scale)} ${fmt(t[8] * scale)}`,
      );
      lines.push("    endloop");
      lines.push("  endfacet");
    }
    lines.push(`endsolid ${name}`);
  }
  return { stl: lines.join("\n") + "\n", unusedRefs, solids };
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toPrecision(8);
}
