/**
 * Host-cut wall geometry (Phase 15).
 *
 * A wall that hosts doors/windows can't be a simple procedural box — the
 * openings are real boolean subtractions. Since the feature tree supports only
 * translation (no rotation), we build the wall + its openings in the wall's
 * LOCAL frame (wall length along +X, thickness along Y, height along +Z, base
 * at z=0), feed that synthetic FeatureTree to the kernel's regenerate() for a
 * true OCCT boolean, then transform the returned mesh into world space here.
 *
 * Openings that fall outside the wall extent are dropped and reported so the
 * caller can flag them (a Phase 15 requirement: no stale geometry).
 */
import type { FeatureTree, BoxFeature } from "../model/featureTree";
import { newFeatureId } from "../model/featureTree";
import type { Door, Level, Wall, WindowComponent } from "../model/bim";
import type { MeshPayload } from "../kernel/protocol";

export type Opening = Door | WindowComponent;

export interface WallCutPlan {
  /** Synthetic feature tree in the wall's local frame (wall box − openings). */
  tree: FeatureTree;
  /** 4×4 column-major transform mapping local → world. */
  transform: number[];
  /** Openings that couldn't be placed within the wall extent (to flag). */
  dropped: { id: string; reason: string }[];
  /** Whether any opening actually produced a cut (else caller can use procedural). */
  hasCut: boolean;
}

function box(
  dx: number,
  dy: number,
  dz: number,
  pos: { x: number; y: number; z: number },
  operation: "new" | "remove",
): BoxFeature {
  return {
    id: newFeatureId(),
    type: "box",
    name: operation === "new" ? "Wall" : "Opening",
    suppressed: false,
    operation,
    position: pos,
    params: { dx, dy, dz },
  };
}

/**
 * Build the local-frame cut tree + world transform for a wall and its openings.
 * Local frame: origin at wall.start, +X toward wall.end, +Y = left normal, +Z up.
 */
export function planWallCut(
  wall: Wall,
  openings: Opening[],
  level?: Level,
): WallCutPlan {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  // Left normal (perpendicular in plan).
  const nx = -uy;
  const ny = ux;
  const z0 = (level ? level.elevation : 0) + wall.baseOffset;

  // Wall box in local frame: [0..length] × [−t/2..t/2] × [0..height].
  // makeBox origin is a corner, so place at y = −thickness/2.
  const features: BoxFeature[] = [
    box(length, wall.thickness, wall.height, { x: 0, y: -wall.thickness / 2, z: 0 }, "new"),
  ];

  const dropped: { id: string; reason: string }[] = [];
  for (const op of openings) {
    const center = op.position * length; // position is 0..1 along the wall
    const half = op.width / 2;
    const x0 = center - half;
    if (op.width <= 0 || op.height <= 0) {
      dropped.push({ id: op.id, reason: "non-positive size" });
      continue;
    }
    if (x0 < 0 || x0 + op.width > length) {
      dropped.push({ id: op.id, reason: "opening extends past the wall ends" });
      continue;
    }
    if (op.sill + op.height > wall.height) {
      dropped.push({ id: op.id, reason: "opening taller than the wall" });
      continue;
    }
    // Cut box: full thickness (over-cut slightly in Y so faces are clean), the
    // opening width in X, opening height in Z starting at the sill.
    features.push(
      box(
        op.width,
        wall.thickness + 2,
        op.height,
        { x: x0, y: -wall.thickness / 2 - 1, z: op.sill },
        "remove",
      ),
    );
  }

  // Column-major 4×4: rotation about Z from local axes + translation to start.
  // local X → (ux,uy,0), local Y → (nx,ny,0), local Z → (0,0,1).
  const transform = [
    ux, uy, 0, 0,
    nx, ny, 0, 0,
    0, 0, 1, 0,
    wall.start.x, wall.start.y, z0, 1,
  ];

  return {
    tree: { features },
    transform,
    dropped,
    hasCut: features.length > 1,
  };
}

/**
 * Apply a column-major 4×4 to a mesh's positions + normals, returning a new
 * MeshPayload in world space. Normals use the rotation part only (our transform
 * has no scale/shear, so this is exact).
 */
export function transformMesh(mesh: MeshPayload, m: number[]): MeshPayload {
  const pos = new Float32Array(mesh.positions.length);
  const nrm = new Float32Array(mesh.normals.length);
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const x = mesh.positions[i], y = mesh.positions[i + 1], z = mesh.positions[i + 2];
    pos[i] = m[0] * x + m[4] * y + m[8] * z + m[12];
    pos[i + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    pos[i + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    const nxv = mesh.normals[i], nyv = mesh.normals[i + 1], nzv = mesh.normals[i + 2];
    nrm[i] = m[0] * nxv + m[4] * nyv + m[8] * nzv;
    nrm[i + 1] = m[1] * nxv + m[5] * nyv + m[9] * nzv;
    nrm[i + 2] = m[2] * nxv + m[6] * nyv + m[10] * nzv;
  }
  return { ...mesh, positions: pos, normals: nrm };
}
