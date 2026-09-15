/**
 * Robot layer tests (Phase 12): tree validation, forward kinematics, URDF
 * export. Pure — no kernel. Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/model/robot.test.ts
 */
import { makeRobotTab, makeLink, makeJoint, validateRobot } from "./robot.ts";
import { forwardKinematics } from "./kinematics.ts";
import { exportUrdf, exportXacro, urdfName } from "./urdf.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

{
  console.log("validation");
  const r = makeRobotTab("r");
  const a = makeLink("a", "t");
  const b = makeLink("b", "t");
  r.links = [a, b];
  r.rootLinkId = a.id;
  r.joints = [makeJoint("j", "revolute", a.id, b.id)];
  const v = validateRobot(r);
  check("valid chain", v.ok && v.root === a.id);

  // Add a second root (orphan) → invalid.
  const c = makeLink("c", "t");
  r.links.push(c);
  check("orphan → invalid", !validateRobot(r).ok);
}

{
  console.log("forward kinematics");
  const r = makeRobotTab("r");
  const base = makeLink("base", "t");
  const arm = makeLink("arm", "t");
  r.links = [base, arm];
  r.rootLinkId = base.id;
  const j = makeJoint("j", "prismatic", base.id, arm.id);
  j.origin.xyz = { x: 5, y: 0, z: 0 };
  j.axis = { x: 1, y: 0, z: 0 };
  r.joints = [j];
  const p = forwardKinematics(r, base.id, { [j.id]: 7 });
  const armM = p.get(arm.id)!;
  // origin +5x then prismatic +7 along x → world x = 12.
  check("prismatic FK", Math.abs(armM[12] - 12) < 1e-6, `x=${armM[12]}`);
  check("root at identity", p.get(base.id)![12] === 0);
}

{
  console.log("URDF export");
  const r = makeRobotTab("my bot");
  const base = makeLink("base link", "t");
  const wheel = makeLink("wheel", "t");
  r.links = [base, wheel];
  r.rootLinkId = base.id;
  r.joints = [makeJoint("axle", "continuous", base.id, wheel.id)];
  const res = exportUrdf(r);
  check("export ok", res.ok, res.ok ? "" : res.error);
  if (res.ok) {
    check("robot name sanitized", res.xml.includes('<robot name="my_bot">'));
    check("continuous joint", res.xml.includes('type="continuous"'));
    check("mesh path", res.xml.includes(`meshes/${urdfName("base link")}.stl`));
    check("well-formed prolog", res.xml.startsWith('<?xml version="1.0"?>'));
  }
  // Invalid robot → export refuses.
  const bad = makeRobotTab("bad");
  check("empty robot export refused", !exportUrdf(bad).ok);
}

{
  console.log("xacro export (repeated sub-trees → macro)");
  const r = makeRobotTab("rover");
  const base = makeLink("chassis", "t");
  r.links = [base];
  r.rootLinkId = base.id;
  r.joints = [];
  // Four identical wheels: same source body, same continuous joint type/axis,
  // differing only in origin + name → one macro + four instantiations.
  for (let i = 0; i < 4; i++) {
    const w = makeLink(`wheel_${i + 1}`, "t");
    r.links.push(w);
    const j = makeJoint(`wj_${i + 1}`, "continuous", base.id, w.id);
    j.origin.xyz = { x: i < 2 ? 10 : -10, y: i % 2 ? -10 : 10, z: 0 };
    j.axis = { x: 0, y: 1, z: 0 };
    r.joints.push(j);
  }
  const res = exportXacro(r);
  check("xacro export ok", res.ok, res.ok ? "" : res.error);
  if (res.ok) {
    check("xacro namespace", res.xml.includes('xmlns:xacro='));
    check("one macro def", (res.xml.match(/<xacro:macro /g) || []).length === 1);
    check(
      "four instantiations",
      (res.xml.match(/<xacro:wheel_1_macro_1 /g) || []).length === 4,
    );
    check("macro params", res.xml.includes('params="name parent xyz rpy"'));
    check("chassis stays flat", res.xml.includes('<link name="chassis">'));
    check("well-formed", res.xml.startsWith("<?xml"));
  }
  // No repetition → xacro still valid (falls back to flat + namespace).
  const single = makeRobotTab("single");
  const b0 = makeLink("b0", "t");
  const b1 = makeLink("b1", "t");
  single.links = [b0, b1];
  single.rootLinkId = b0.id;
  single.joints = [makeJoint("j", "revolute", b0.id, b1.id)];
  const sr = exportXacro(single);
  check("no-repeat xacro ok", sr.ok);
  check("no-repeat has no macro", sr.ok && !sr.xml.includes("<xacro:macro"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
