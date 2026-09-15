/**
 * Robot tab editor: define Links (from Part Studio bodies), Joints between
 * them, see kinematic-tree validation, drive joint-value sliders live, and
 * export URDF. The 3D preview (RobotPreview) shows the assembled, articulated
 * robot.
 */
import { useStore } from "../store";
import { validateRobot, type JointType } from "../model/robot";
import { RobotPreview } from "./RobotPreview";

const JOINT_TYPES: JointType[] = [
  "revolute",
  "continuous",
  "prismatic",
  "fixed",
  "floating",
  "planar",
];

export function RobotView() {
  const doc = useStore((s) => s.doc);
  const activeRobotId = useStore((s) => s.activeRobotId);
  const addLink = useStore((s) => s.addLink);
  const addJoint = useStore((s) => s.addJoint);
  const updateJoint = useStore((s) => s.updateJoint);
  const deleteLink = useStore((s) => s.deleteLink);
  const deleteJoint = useStore((s) => s.deleteJoint);
  const setJointValue = useStore((s) => s.setJointValue);
  const jointValues = useStore((s) => s.jointValues);
  const exportRobotUrdf = useStore((s) => s.exportRobotUrdf);

  const robot = doc.robots.find((r) => r.id === activeRobotId);
  if (!robot) return null;

  const validation = validateRobot(robot);
  const linkName = (id: string) =>
    robot.links.find((l) => l.id === id)?.name ?? "?";

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-96 flex-col overflow-y-auto border-r border-neutral-800 bg-neutral-900 p-3 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">{robot.name}</h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => void exportRobotUrdf("urdf")}
              className="rounded bg-blue-700 px-2 py-1 text-xs text-white hover:bg-blue-600"
            >
              Export URDF
            </button>
            <button
              type="button"
              onClick={() => void exportRobotUrdf("xacro")}
              title="Export as xacro — repeated sub-trees become macros"
              className="rounded bg-purple-700 px-2 py-1 text-xs text-white hover:bg-purple-600"
            >
              Export xacro
            </button>
          </div>
        </div>

        {/* Validation banner */}
        <div
          className={`mb-3 rounded px-2 py-1 text-xs ${
            validation.ok
              ? "bg-green-950/50 text-green-300"
              : "bg-red-950/50 text-red-300"
          }`}
        >
          {validation.ok
            ? `Valid kinematic tree (root: ${linkName(validation.root)})`
            : validation.error}
        </div>

        {/* Links */}
        <section className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Links
            </h3>
          </div>
          {robot.links.map((l) => (
            <div key={l.id} className="flex items-center gap-2 py-0.5 text-xs">
              <span className="mr-auto truncate">
                {l.name}
                {robot.rootLinkId === l.id && (
                  <span className="ml-1 text-[10px] text-green-400">(root)</span>
                )}
              </span>
              <span className="text-neutral-500">← {tabName(doc, l.sourceTabId)}</span>
              <button
                type="button"
                onClick={() => deleteLink(l.id)}
                className="text-neutral-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
          {/* Add link from a Part Studio tab */}
          <div className="mt-1 flex flex-wrap gap-1">
            {doc.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => addLink(t.id, `${t.name} link`)}
                className="rounded bg-neutral-800 px-2 py-1 text-[11px] hover:bg-neutral-700"
              >
                + {t.name}
              </button>
            ))}
          </div>
        </section>

        {/* Joints */}
        <section className="mb-3">
          <h3 className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Joints
          </h3>
          {robot.joints.map((j) => (
            <div key={j.id} className="mb-2 rounded border border-neutral-800 p-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="mr-auto font-medium">{j.name}</span>
                <select
                  value={j.type}
                  onChange={(e) =>
                    updateJoint(j.id, { type: e.target.value as JointType })
                  }
                  className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5"
                >
                  {JOINT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => deleteJoint(j.id)}
                  className="text-neutral-500 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              <div className="mt-1 text-neutral-500">
                {linkName(j.parentLinkId)} → {linkName(j.childLinkId)}
              </div>
              {/* Joint-value slider for articulated joints */}
              {(j.type === "revolute" ||
                j.type === "continuous" ||
                j.type === "prismatic") && (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={j.type === "continuous" ? -Math.PI : j.limits.lower}
                    max={j.type === "continuous" ? Math.PI : j.limits.upper}
                    step={0.01}
                    value={jointValues[j.id] ?? 0}
                    onChange={(e) => setJointValue(j.id, Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <span className="w-10 shrink-0 text-right font-mono text-[10px]">
                    {(jointValues[j.id] ?? 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))}
          {/* Add joint (needs >= 2 links) */}
          {robot.links.length >= 2 && (
            <AddJointRow
              robotLinks={robot.links.map((l) => ({ id: l.id, name: l.name }))}
              onAdd={(type, p, c) => addJoint(type, p, c)}
            />
          )}
        </section>
      </aside>

      <main className="relative flex-1">
        <RobotPreview />
      </main>
    </div>
  );
}

function tabName(
  doc: ReturnType<typeof useStore.getState>["doc"],
  tabId: string,
): string {
  return doc.tabs.find((t) => t.id === tabId)?.name ?? "?";
}

function AddJointRow({
  robotLinks,
  onAdd,
}: {
  robotLinks: { id: string; name: string }[];
  onAdd: (type: JointType, parent: string, child: string) => void;
}) {
  // Local uncontrolled selects; default parent=first, child=second.
  let parent = robotLinks[0].id;
  let child = robotLinks[1].id;
  let type: JointType = "revolute";
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
      <select
        defaultValue={parent}
        onChange={(e) => (parent = e.target.value)}
        className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5"
      >
        {robotLinks.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <span className="text-neutral-500">→</span>
      <select
        defaultValue={child}
        onChange={(e) => (child = e.target.value)}
        className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5"
      >
        {robotLinks.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <select
        defaultValue={type}
        onChange={(e) => (type = e.target.value as JointType)}
        className="rounded border border-neutral-700 bg-neutral-800 px-1 py-0.5"
      >
        {JOINT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          if (parent !== child) onAdd(type, parent, child);
        }}
        className="rounded bg-neutral-800 px-2 py-0.5 hover:bg-neutral-700"
      >
        + joint
      </button>
    </div>
  );
}
