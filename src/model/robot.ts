/**
 * Robot design data model (architecture req #8, Phase 12).
 *
 * A SEPARATE, additive layer on top of the Part Studio/Document model — not a
 * rework. A Robot tab holds a kinematic tree of Links (each referencing a
 * Part Studio body by stable id, plus mass/inertia) connected by Joints
 * (URDF joint types). Forward kinematics and URDF export build on this.
 *
 * Everything is plain-JSON serializable and persists inside the CADDocument
 * alongside Part Studio tabs.
 */
import { newFeatureId } from "./featureTree";

/** URDF joint type set. */
export type JointType =
  | "revolute"
  | "continuous"
  | "prismatic"
  | "fixed"
  | "floating"
  | "planar";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** 3×3 inertia tensor (kg·m²), URDF's ixx/ixy/ixz/iyy/iyz/izz. */
export interface Inertia {
  ixx: number;
  ixy: number;
  ixz: number;
  iyy: number;
  iyz: number;
  izz: number;
}

/**
 * A Link wraps a Part Studio body output. Geometry is NOT duplicated — the link
 * references the source Part Studio tab (and, when a tree yields multiple
 * bodies, a body index) by id, so editing the feature tree updates the link's
 * shape on next regeneration.
 */
export interface Link {
  id: string;
  name: string;
  /** Part Studio tab id whose regenerated body this link visualizes. */
  sourceTabId: string;
  /** Which solid body of that tab (0-based) — 0 unless the tree yields N bodies. */
  bodyIndex: number;
  /** Mass (kg). Auto-derived default from body volume; user-overridable. */
  mass: number;
  /** Inertia tensor about the center of mass. */
  inertia: Inertia;
  /** Center of mass in the link frame. */
  com: Vec3;
}

/**
 * A Joint connects a parent Link to a child Link. `origin` places the child
 * frame relative to the parent (xyz translation + rpy fixed-axis rotation, URDF
 * convention). `axis` is the joint axis in the child frame. `limits` apply to
 * revolute/prismatic (URDF requires them for revolute).
 */
export interface Joint {
  id: string;
  name: string;
  type: JointType;
  parentLinkId: string;
  childLinkId: string;
  origin: { xyz: Vec3; rpy: Vec3 };
  axis: Vec3;
  limits: { lower: number; upper: number; velocity: number; effort: number };
}

/** A Robot tab: a named kinematic tree rooted at one base Link. */
export interface RobotTab {
  /** Discriminant distinguishing robot tabs from Part Studio tabs. */
  kind: "robot";
  id: string;
  name: string;
  links: Link[];
  joints: Joint[];
  /** Base (root) link id, or null until a link exists. */
  rootLinkId: string | null;
}

export function makeRobotTab(name: string): RobotTab {
  return {
    kind: "robot",
    id: newFeatureId(),
    name,
    links: [],
    joints: [],
    rootLinkId: null,
  };
}

const zeroInertia = (): Inertia => ({
  ixx: 1,
  ixy: 0,
  ixz: 0,
  iyy: 1,
  iyz: 0,
  izz: 1,
});

/** Create a link referencing a Part Studio body; mass/inertia default to unit. */
export function makeLink(
  name: string,
  sourceTabId: string,
  bodyIndex = 0,
): Link {
  return {
    id: newFeatureId(),
    name,
    sourceTabId,
    bodyIndex,
    mass: 1,
    inertia: zeroInertia(),
    com: { x: 0, y: 0, z: 0 },
  };
}

/** Create a joint with sensible defaults for its type. */
export function makeJoint(
  name: string,
  type: JointType,
  parentLinkId: string,
  childLinkId: string,
): Joint {
  return {
    id: newFeatureId(),
    name,
    type,
    parentLinkId,
    childLinkId,
    origin: { xyz: { x: 0, y: 0, z: 0 }, rpy: { x: 0, y: 0, z: 0 } },
    axis: { x: 0, y: 0, z: 1 },
    limits: { lower: -Math.PI, upper: Math.PI, velocity: 1, effort: 1 },
  };
}

// ---------------------------------------------------------------------------
// Kinematic tree validation
// ---------------------------------------------------------------------------

export type RobotValidation =
  | { ok: true; root: string }
  | { ok: false; error: string };

/**
 * Validate that a robot's links + joints form a single rooted tree:
 *  - every joint references existing parent/child links,
 *  - no link has two parents (child appears in ≤1 joint),
 *  - exactly one root (a link that is never a child),
 *  - no cycles,
 *  - every link is reachable from the root (no orphans).
 * Errors name the specific offending link/joint.
 */
export function validateRobot(robot: RobotTab): RobotValidation {
  const { links, joints } = robot;
  if (links.length === 0) return { ok: false, error: "Robot has no links" };

  const linkIds = new Set(links.map((l) => l.id));
  const nameOf = (id: string) =>
    links.find((l) => l.id === id)?.name ?? id;

  // Referential integrity + single-parent check.
  const parentOf = new Map<string, string>(); // childLinkId → jointId
  for (const j of joints) {
    if (!linkIds.has(j.parentLinkId))
      return { ok: false, error: `Joint "${j.name}" has an unknown parent link` };
    if (!linkIds.has(j.childLinkId))
      return { ok: false, error: `Joint "${j.name}" has an unknown child link` };
    if (j.parentLinkId === j.childLinkId)
      return { ok: false, error: `Joint "${j.name}" connects a link to itself` };
    if (parentOf.has(j.childLinkId))
      return {
        ok: false,
        error: `Link "${nameOf(j.childLinkId)}" has more than one parent joint`,
      };
    parentOf.set(j.childLinkId, j.id);
  }

  // Roots = links that are never a child.
  const roots = links.filter((l) => !parentOf.has(l.id));
  if (roots.length === 0)
    return { ok: false, error: "No root link (every link has a parent → cycle)" };
  if (roots.length > 1)
    return {
      ok: false,
      error: `Multiple roots: ${roots.map((l) => `"${l.name}"`).join(", ")} — a robot must have exactly one base link`,
    };
  const root = roots[0];

  // BFS from root; detect unreachable links (orphans) and cycles.
  const childrenByParent = new Map<string, string[]>();
  for (const j of joints) {
    const arr = childrenByParent.get(j.parentLinkId) ?? [];
    arr.push(j.childLinkId);
    childrenByParent.set(j.parentLinkId, arr);
  }
  const visited = new Set<string>();
  const queue = [root.id];
  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id))
      return { ok: false, error: `Cycle detected at link "${nameOf(id)}"` };
    visited.add(id);
    for (const c of childrenByParent.get(id) ?? []) queue.push(c);
  }
  if (visited.size !== links.length) {
    const orphan = links.find((l) => !visited.has(l.id));
    return {
      ok: false,
      error: `Link "${orphan ? orphan.name : "?"}" is not connected to the root`,
    };
  }

  return { ok: true, root: root.id };
}
