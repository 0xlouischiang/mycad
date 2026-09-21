/**
 * namedStl: a 12-triangle box, two tagged faces → two named solids + walls.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/cfd/namedStl.test.ts
 */
import { meshToNamedStl } from "./namedStl.ts";
import { faceRefFromPoints } from "../model/edgeRef.ts";
import type { MeshPayload } from "../kernel/protocol.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

/** Axis-aligned 10³ box at the origin: 8 unique verts, 12 triangles, 6 face groups. */
function boxMesh(): { mesh: MeshPayload; refs: Record<string, string> } {
  const positions = new Float32Array([
    0, 0, 0, 10, 0, 0, 10, 10, 0, 0, 10, 0, // 0-3 z=0
    0, 0, 10, 10, 0, 10, 10, 10, 10, 0, 10, 10, // 4-7 z=10
  ]);
  const normals = new Float32Array(positions.length);
  // two tris per face, indices into the 8 verts
  const indices = new Uint32Array([
    0, 1, 2, 0, 2, 3, // z=0
    4, 7, 6, 4, 6, 5, // z=10
    0, 4, 5, 0, 5, 1, // y=0
    3, 2, 6, 3, 6, 7, // y=10
    0, 3, 7, 0, 7, 4, // x=0
    1, 5, 6, 1, 6, 2, // x=10
  ]);
  const faceGroups = new Int32Array([
    0, 6, 1, 6, 6, 2, 12, 6, 3, 18, 6, 4, 24, 6, 5, 30, 6, 6,
  ]);
  const mesh: MeshPayload = {
    positions,
    normals,
    indices,
    vertexCount: 8,
    triangleCount: 12,
    faceGroups,
    faceCount: 6,
  };
  const refOf = (indexStart: number, indexCount: number) => {
    const coords: number[] = [];
    for (let i = indexStart; i < indexStart + indexCount; i++) {
      const v = indices[i] * 3;
      coords.push(positions[v], positions[v + 1], positions[v + 2]);
    }
    return faceRefFromPoints(coords);
  };
  return {
    mesh,
    refs: {
      z0: refOf(0, 6),
      z10: refOf(6, 6),
      y0: refOf(12, 6),
      y10: refOf(18, 6),
      x0: refOf(24, 6),
      x10: refOf(30, 6),
    },
  };
}

{
  console.log("named multi-solid STL");
  const { mesh, refs } = boxMesh();
  const result = meshToNamedStl(
    mesh,
    [
      { faceRef: refs.x0, name: "inlet" },
      { faceRef: refs.x10, name: "outlet" },
    ],
    { defaultName: "walls", scale: 0.001 },
  );
  check("three solids", result.solids.length === 3, result.solids.join(","));
  check("has inlet", result.solids.includes("inlet"));
  check("has outlet", result.solids.includes("outlet"));
  check("has walls", result.solids.includes("walls"));
  check("no unused refs", result.unusedRefs.length === 0);
  check("ascii header inlet", /^solid inlet$/m.test(result.stl));
  check("ascii header outlet", /^solid outlet$/m.test(result.stl));
  check("ascii header walls", /^solid walls$/m.test(result.stl));
  check("endsolids", /endsolid inlet/.test(result.stl) && /endsolid walls/.test(result.stl));
  // scale 0.001: a vertex that was 10 mm becomes 0.01 m
  check("scaled to metres", /vertex\s+0\.01/.test(result.stl) || /vertex 1\.0000000e-2/.test(result.stl) || result.stl.includes("0.010000"));
  const bogus = meshToNamedStl(mesh, [{ faceRef: "nope", name: "ghost" }]);
  check("unused ref reported", bogus.unusedRefs.includes("nope"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
