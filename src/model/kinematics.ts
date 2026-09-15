/**
 * Forward kinematics for a Robot tree.
 *
 * Given a robot + per-joint values, computes each link's world transform by
 * propagating joint transforms from the root down. Pure math (no three.js) so
 * it's unit-testable; the viewport converts the resulting 4×4 matrices into
 * mesh transforms without re-tessellating (architecture req #8 + #4).
 *
 * Transforms are column-major 4×4 matrices as number[16] (three.js Matrix4
 * layout: m[col*4 + row]), so a placement can be fed straight into
 * Matrix4.fromArray on the render side.
 *
 * URDF conventions:
 *  - A joint's `origin` (xyz + rpy fixed-axis XYZ) places the child frame
 *    relative to the parent BEFORE the joint motion is applied.
 *  - Joint motion: revolute/continuous rotate about `axis` by the joint value
 *    (radians); prismatic translates along `axis` by the value (length units);
 *    fixed contributes nothing; floating/planar are treated as fixed here
 *    (their free motion isn't driven by a single slider).
 */
import type { RobotTab, Vec3 } from "./robot";

export type Mat4 = number[]; // length 16, column-major

export function identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

/** Column-major 4×4 multiply: returns a·b. */
export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array(16).fill(0);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

function translation(v: Vec3): Mat4 {
  const m = identity();
  m[12] = v.x;
  m[13] = v.y;
  m[14] = v.z;
  return m;
}

/** Rotation from URDF fixed-axis roll-pitch-yaw (Rz·Ry·Rx applied to a point). */
function rpyRotation(rpy: Vec3): Mat4 {
  const cx = Math.cos(rpy.x), sx = Math.sin(rpy.x);
  const cy = Math.cos(rpy.y), sy = Math.sin(rpy.y);
  const cz = Math.cos(rpy.z), sz = Math.sin(rpy.z);
  // R = Rz * Ry * Rx (URDF convention). Fill column-major.
  const r00 = cz * cy;
  const r01 = cz * sy * sx - sz * cx;
  const r02 = cz * sy * cx + sz * sx;
  const r10 = sz * cy;
  const r11 = sz * sy * sx + cz * cx;
  const r12 = sz * sy * cx - cz * sx;
  const r20 = -sy;
  const r21 = cy * sx;
  const r22 = cy * cx;
  return [r00, r10, r20, 0, r01, r11, r21, 0, r02, r12, r22, 0, 0, 0, 0, 1];
}

/** Rotation of `angle` radians about a unit-ish axis (normalized here). */
function axisAngle(axis: Vec3, angle: number): Mat4 {
  const len = Math.hypot(axis.x, axis.y, axis.z) || 1;
  const x = axis.x / len, y = axis.y / len, z = axis.z / len;
  const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
  const r00 = t * x * x + c;
  const r01 = t * x * y - s * z;
  const r02 = t * x * z + s * y;
  const r10 = t * x * y + s * z;
  const r11 = t * y * y + c;
  const r12 = t * y * z - s * x;
  const r20 = t * x * z - s * y;
  const r21 = t * y * z + s * x;
  const r22 = t * z * z + c;
  return [r00, r10, r20, 0, r01, r11, r21, 0, r02, r12, r22, 0, 0, 0, 0, 1];
}

/**
 * Compute the world transform of every link, keyed by link id. `jointValues`
 * maps joint id → value (radians for revolute/continuous, length for
 * prismatic); missing values default to 0. The root link is placed at identity.
 * Links unreachable from the root are omitted.
 */
export function forwardKinematics(
  robot: RobotTab,
  rootLinkId: string,
  jointValues: Record<string, number>,
): Map<string, Mat4> {
  const placements = new Map<string, Mat4>();
  placements.set(rootLinkId, identity());

  // Index joints by parent for a BFS walk down the tree.
  const childJoints = new Map<string, typeof robot.joints>();
  for (const j of robot.joints) {
    const arr = childJoints.get(j.parentLinkId) ?? [];
    arr.push(j);
    childJoints.set(j.parentLinkId, arr);
  }

  const queue = [rootLinkId];
  const seen = new Set<string>([rootLinkId]);
  while (queue.length) {
    const parentId = queue.shift()!;
    const parentWorld = placements.get(parentId)!;
    for (const j of childJoints.get(parentId) ?? []) {
      if (seen.has(j.childLinkId)) continue; // guard against cycles
      seen.add(j.childLinkId);
      // Child world = parentWorld · origin · jointMotion.
      const origin = multiply(translation(j.origin.xyz), rpyRotation(j.origin.rpy));
      let motion = identity();
      const value = jointValues[j.id] ?? 0;
      if (j.type === "revolute" || j.type === "continuous") {
        motion = axisAngle(j.axis, value);
      } else if (j.type === "prismatic") {
        motion = translation({
          x: j.axis.x * value,
          y: j.axis.y * value,
          z: j.axis.z * value,
        });
      }
      // fixed/floating/planar contribute identity motion here.
      const childWorld = multiply(multiply(parentWorld, origin), motion);
      placements.set(j.childLinkId, childWorld);
      queue.push(j.childLinkId);
    }
  }
  return placements;
}
