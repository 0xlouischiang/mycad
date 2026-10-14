/**
 * Nozzle bore through a vessel shell.
 *
 * The kernel's cylinder grows along +Z and the feature tree can only translate
 * it, so a bore at an arbitrary angle cannot be cut. This plans a cut only for
 * nozzles that point straight up (+Z), which is the "Side" datum direction the
 * built-in equipment ships with. Every other nozzle is drawn procedurally and
 * reported here as skipped — never as stale geometry.
 *
 * The vessel itself is procedural too (see geometry.ts). The cut replaces it
 * only when at least one nozzle actually bores the shell.
 */
import type { FeatureTree, Feature } from "../model/featureTree";
import { newFeatureId } from "../model/featureTree";
import type { Equipment, Nozzle } from "../model/plant";
import type { MeshPayload } from "../kernel/protocol";

export interface NozzleCutPlan {
  tree: FeatureTree;
  /** Column-major 4×4, local → world. A pure translation. */
  transform: number[];
  dropped: { id: string; reason: string }[];
  hasCut: boolean;
}

const UP_TOLERANCE = 0.01;

/**
 * Plan the cut in the vessel's local frame: axis along +Z, centered on the
 * equipment origin. The transform moves the result to the equipment origin.
 */
export function planNozzleCut(equipment: Equipment, nozzles: Nozzle[]): NozzleCutPlan {
  const radius = equipment.diameter / 2;
  const features: Feature[] = [
    {
      id: newFeatureId(),
      type: "cylinder",
      name: equipment.name,
      suppressed: false,
      operation: "new",
      // makeCylinder grows along +Z from its base, so the shell runs from z=0 to
      // z=length. The transform below lifts it so the equipment origin is halfway up.
      position: { x: 0, y: 0, z: 0 },
      params: { radius, height: equipment.length },
    },
  ];

  const dropped: { id: string; reason: string }[] = [];
  for (const nozzle of nozzles) {
    if (nozzle.direction.z < 1 - UP_TOLERANCE || Math.hypot(nozzle.direction.x, nozzle.direction.y) > UP_TOLERANCE) {
      dropped.push({ id: nozzle.id, reason: "nozzle is not vertical; drawn without a shell cut" });
      continue;
    }
    // A datum's position is already in the equipment's local frame, which is the
    // frame this cut is built in. nozzlePosition() adds the origin on top, so it
    // must not be used here.
    const datum = nozzle.datumId ? equipment.datums.find((d) => d.id === nozzle.datumId) : undefined;
    const local = datum
      ? {
          x: datum.position.x + nozzle.offset.x,
          y: datum.position.y + nozzle.offset.y,
          z: datum.position.z + nozzle.offset.z,
        }
      : nozzle.offset;
    const radial = Math.hypot(local.x, local.y);
    if (radial > radius) {
      dropped.push({ id: nozzle.id, reason: "nozzle is outside the shell" });
      continue;
    }
    // The shell occupies local z = 0..length. makeCylinder grows along +Z from
    // its base, so the bore starts one diameter below the top and passes through it.
    const top = equipment.length;
    const depth = nozzle.nps;
    features.push({
      id: newFeatureId(),
      type: "cylinder",
      name: "Nozzle bore",
      suppressed: false,
      operation: "remove",
      position: { x: local.x, y: local.y, z: top - depth },
      params: { radius: nozzle.nps / 2, height: depth * 2 },
    });
  }

  const o = equipment.origin;
  const transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, o.x, o.y, o.z - equipment.length / 2, 1];
  return { tree: { features }, transform, dropped, hasCut: features.length > 1 };
}

/** Apply a column-major 4×4 to positions and normals. */
export function transformMesh(mesh: MeshPayload, m: number[]): MeshPayload {
  const pos = new Float32Array(mesh.positions.length);
  const nrm = new Float32Array(mesh.normals.length);
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const x = mesh.positions[i];
    const y = mesh.positions[i + 1];
    const z = mesh.positions[i + 2];
    pos[i] = m[0] * x + m[4] * y + m[8] * z + m[12];
    pos[i + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    pos[i + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    const nx = mesh.normals[i];
    const ny = mesh.normals[i + 1];
    const nz = mesh.normals[i + 2];
    nrm[i] = m[0] * nx + m[4] * ny + m[8] * nz;
    nrm[i + 1] = m[1] * nx + m[5] * ny + m[9] * nz;
    nrm[i + 2] = m[2] * nx + m[6] * ny + m[10] * nz;
  }
  return { ...mesh, positions: pos, normals: nrm };
}
