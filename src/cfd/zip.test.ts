/**
 * STORED zip encoder round-trip.
 * Run with:
 *   node --experimental-strip-types --import ./src/test/ts-resolve.mjs \
 *        src/cfd/zip.test.ts
 */
import { zipFiles, zipEntryNames, crc32 } from "./zip.ts";

let failures = 0;
function check(label: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`  [${cond ? "PASS" : "FAIL"}] ${label}${detail ? " — " + detail : ""}`);
}

{
  console.log("crc32");
  // ISO 3309 / PKZIP of "123456789" is 0xcbf43926
  check("known vector", crc32(new TextEncoder().encode("123456789")) === 0xcbf43926);
}

{
  console.log("zip files");
  const files = {
    "system/controlDict": "FoamFile\n{\n}\n",
    "0/U": "dimensions [0 1 -1 0 0 0 0];\n",
    Allrun: "#!/bin/sh\n",
  };
  const buf = zipFiles(files);
  check("non-empty", buf.length > 100);
  check("local sig", buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04);
  const names = zipEntryNames(buf);
  check("3 entries", names.length === 3, names.join(","));
  check("has Allrun", names.includes("Allrun"));
  check("has 0/U", names.includes("0/U"));
  check("has controlDict", names.includes("system/controlDict"));
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
