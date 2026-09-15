/**
 * URDF export from a Robot tree (Phase 12).
 *
 * Walks the robot's links + joints and builds a well-formed URDF XML document
 * via the xml.ts node builder (never string concatenation). Each link gets
 * visual + collision geometry referencing a per-link mesh file (exported as STL
 * alongside — see the store/UI layer that writes the files). Joints emit
 * type/origin/axis and, for revolute/prismatic, limits.
 *
 * The mesh filename convention is `meshes/<sanitizedLinkName>.stl`, matching
 * what the export bundle writes.
 */
import { validateRobot, type Link, type RobotTab, type Vec3 } from "./robot";
import { el, serializeDocument, checkWellFormed, type XmlNode } from "./xml";

/** URDF-safe name: letters, digits, underscore; no leading digit. */
export function urdfName(name: string): string {
  const s = name.replace(/[^\w]/g, "_").replace(/^(\d)/, "_$1");
  return s.length > 0 ? s : "unnamed";
}

const xyz = (v: Vec3) => `${v.x} ${v.y} ${v.z}`;

/** Relative mesh path for a link's exported STL. */
export function linkMeshPath(link: Link): string {
  return `meshes/${urdfName(link.name)}.stl`;
}

function inertialNode(link: Link): XmlNode {
  const i = link.inertia;
  return el("inertial", undefined, [
    el("origin", { xyz: xyz(link.com), rpy: "0 0 0" }),
    el("mass", { value: link.mass }),
    el("inertia", {
      ixx: i.ixx,
      ixy: i.ixy,
      ixz: i.ixz,
      iyy: i.iyy,
      iyz: i.iyz,
      izz: i.izz,
    }),
  ]);
}

function geometryNode(link: Link): XmlNode {
  return el("geometry", undefined, [
    el("mesh", { filename: linkMeshPath(link) }),
  ]);
}

function linkNode(link: Link): XmlNode {
  return el("link", { name: urdfName(link.name) }, [
    inertialNode(link),
    el("visual", undefined, [
      el("origin", { xyz: "0 0 0", rpy: "0 0 0" }),
      geometryNode(link),
    ]),
    el("collision", undefined, [
      el("origin", { xyz: "0 0 0", rpy: "0 0 0" }),
      geometryNode(link),
    ]),
  ]);
}

function jointNode(
  joint: RobotTab["joints"][number],
  nameOf: (id: string) => string,
): XmlNode {
  const children: XmlNode[] = [
    el("parent", { link: nameOf(joint.parentLinkId) }),
    el("child", { link: nameOf(joint.childLinkId) }),
    el("origin", { xyz: xyz(joint.origin.xyz), rpy: xyz(joint.origin.rpy) }),
  ];
  // Axis is meaningful for revolute/continuous/prismatic/planar.
  if (joint.type !== "fixed" && joint.type !== "floating") {
    children.push(el("axis", { xyz: xyz(joint.axis) }));
  }
  // Limits are required for revolute + prismatic (URDF); include for those.
  if (joint.type === "revolute" || joint.type === "prismatic") {
    children.push(
      el("limit", {
        lower: joint.limits.lower,
        upper: joint.limits.upper,
        velocity: joint.limits.velocity,
        effort: joint.limits.effort,
      }),
    );
  }
  return el("joint", { name: urdfName(joint.name), type: joint.type }, children);
}

export type UrdfResult =
  | { ok: true; xml: string }
  | { ok: false; error: string };

/**
 * Build the URDF XML for a robot. Validates the kinematic tree first and checks
 * the serialized output is well-formed before returning it, so a broken export
 * is surfaced as an error rather than downloaded.
 */
export function exportUrdf(robot: RobotTab): UrdfResult {
  const v = validateRobot(robot);
  if (!v.ok) return { ok: false, error: v.error };

  const nameOf = (id: string) => {
    const l = robot.links.find((x) => x.id === id);
    return urdfName(l ? l.name : id);
  };

  // Root link first (URDF convention), then the rest, then joints.
  const rootFirst = [
    ...robot.links.filter((l) => l.id === v.root),
    ...robot.links.filter((l) => l.id !== v.root),
  ];
  const children: XmlNode[] = [
    ...rootFirst.map(linkNode),
    ...robot.joints.map((j) => jointNode(j, nameOf)),
  ];
  const root = el("robot", { name: urdfName(robot.name) }, children);
  const xml = serializeDocument(root);

  const wf = checkWellFormed(xml);
  if (wf) return { ok: false, error: `Generated URDF is malformed: ${wf}` };
  return { ok: true, xml };
}

// ---------------------------------------------------------------------------
// Xacro export (stretch): macro-ize repeated leaf sub-trees
// ---------------------------------------------------------------------------

const XACRO_NS = "http://www.ros.org/wiki/xacro";

/**
 * A repeated group = 2+ LEAF links (no children) that (a) reference the same
 * source body + bodyIndex, and (b) are attached by joints of the same type +
 * axis + limits. These are the "4 identical wheels" case. Each instance can
 * still differ in name and joint origin, which become macro parameters.
 */
interface RepeatGroup {
  key: string;
  instances: { link: Link; joint: RobotTab["joints"][number] }[];
}

function findRepeatGroups(robot: RobotTab): RepeatGroup[] {
  const childIds = new Set(robot.joints.map((j) => j.childLinkId));
  const hasChildren = new Set(robot.joints.map((j) => j.parentLinkId));
  const jointByChild = new Map(robot.joints.map((j) => [j.childLinkId, j]));

  const groups = new Map<string, RepeatGroup>();
  for (const link of robot.links) {
    if (!childIds.has(link.id)) continue; // must have a parent joint
    if (hasChildren.has(link.id)) continue; // leaf only
    const j = jointByChild.get(link.id)!;
    // Group key: source body + joint type + axis + limits (NOT origin/name —
    // those vary per instance and become macro args).
    const key = [
      link.sourceTabId,
      link.bodyIndex,
      j.type,
      j.axis.x,
      j.axis.y,
      j.axis.z,
      j.limits.lower,
      j.limits.upper,
      j.limits.velocity,
      j.limits.effort,
    ].join("|");
    const g = groups.get(key) ?? { key, instances: [] };
    g.instances.push({ link, joint: j });
    groups.set(key, g);
  }
  return [...groups.values()].filter((g) => g.instances.length >= 2);
}

/**
 * Export the robot as a xacro file: repeated leaf sub-trees become a
 * `<xacro:macro>` with `name`/`parent`/`xyz`/`rpy` params, instantiated per
 * occurrence; everything else is emitted as flat URDF. If no repetition is
 * found, this is equivalent to exportUrdf but with the xacro namespace.
 */
export function exportXacro(robot: RobotTab): UrdfResult {
  const v = validateRobot(robot);
  if (!v.ok) return { ok: false, error: v.error };

  const nameOf = (id: string) => {
    const l = robot.links.find((x) => x.id === id);
    return urdfName(l ? l.name : id);
  };

  const groups = findRepeatGroups(robot);
  // Members that are covered by a macro (excluded from the flat emission).
  const macroLinkIds = new Set<string>();
  const macroJointIds = new Set<string>();
  for (const g of groups) {
    for (const inst of g.instances) {
      macroLinkIds.add(inst.link.id);
      macroJointIds.add(inst.joint.id);
    }
  }

  const children: XmlNode[] = [];

  // Macro definitions — one per repeat group, named from the first instance.
  groups.forEach((g, gi) => {
    const proto = g.instances[0];
    const macroName = `${urdfName(proto.link.name)}_macro_${gi + 1}`;
    // The macro body: a parameterized link + joint. Link geometry reuses the
    // prototype's mesh (all instances share the same source body).
    const linkBody = linkNode({ ...proto.link, name: "${name}" });
    const j = proto.joint;
    const jointBody = el(
      "joint",
      { name: "${name}_joint", type: j.type },
      [
        el("parent", { link: "${parent}" }),
        el("child", { link: "${name}" }),
        el("origin", { xyz: "${xyz}", rpy: "${rpy}" }),
        ...(j.type !== "fixed" && j.type !== "floating"
          ? [el("axis", { xyz: xyz(j.axis) })]
          : []),
        ...(j.type === "revolute" || j.type === "prismatic"
          ? [
              el("limit", {
                lower: j.limits.lower,
                upper: j.limits.upper,
                velocity: j.limits.velocity,
                effort: j.limits.effort,
              }),
            ]
          : []),
      ],
    );
    children.push(
      el(
        "xacro:macro",
        { name: macroName, params: "name parent xyz rpy" },
        [linkBody, jointBody],
      ),
    );
    // Instantiations.
    for (const inst of g.instances) {
      children.push(
        el("xacro:" + macroName, {
          name: urdfName(inst.link.name),
          parent: nameOf(inst.joint.parentLinkId),
          xyz: xyz(inst.joint.origin.xyz),
          rpy: xyz(inst.joint.origin.rpy),
        }),
      );
    }
  });

  // Flat emission of everything not covered by a macro (root first).
  const flatLinks = [
    ...robot.links.filter((l) => l.id === v.root),
    ...robot.links.filter((l) => l.id !== v.root),
  ].filter((l) => !macroLinkIds.has(l.id));
  children.push(...flatLinks.map(linkNode));
  children.push(
    ...robot.joints
      .filter((j) => !macroJointIds.has(j.id))
      .map((j) => jointNode(j, nameOf)),
  );

  const root = el(
    "robot",
    { name: urdfName(robot.name), "xmlns:xacro": XACRO_NS },
    children,
  );
  const xml = serializeDocument(root);
  const wf = checkWellFormed(xml);
  if (wf) return { ok: false, error: `Generated xacro is malformed: ${wf}` };
  return { ok: true, xml };
}
