/**
 * STORED (method 0) ZIP encoder. No extra dependency — Robot downloads loose
 * files, but an OpenFOAM case is a tree that needs one archive.
 *
 * CRC32 matches the PKWARE APPNOTE. Filenames are UTF-8. Compression is none
 * so tests can round-trip without a zlib binding.
 */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

export function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  return b;
}
function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
}

export function zipFiles(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  const names = Object.keys(files).sort();
  for (const name of names) {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(files[name]);
    const crc = crc32(data);
    const local = concat(
      u32(0x04034b50),
      u16(20), // version needed
      u16(0), // flags
      u16(0), // stored
      u16(0),
      u16(0), // time/date
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0), // extra
      nameBytes,
      data,
    );
    const central = concat(
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    );
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralDir = concat(...centrals);
  const end = concat(
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(names.length),
    u16(names.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  );
  return concat(...locals, centralDir, end);
}

function concat(...parts: Uint8Array[]): Uint8Array {
  let n = 0;
  for (const p of parts) n += p.length;
  const out = new Uint8Array(n);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/** List STORED zip entry names (for tests). */
export function zipEntryNames(buf: Uint8Array): string[] {
  const names: string[] = [];
  const dec = new TextDecoder();
  let i = 0;
  while (i + 30 <= buf.length) {
    const sig = buf[i] | (buf[i + 1] << 8) | (buf[i + 2] << 16) | (buf[i + 3] << 24);
    if (sig !== 0x04034b50) break;
    const nameLen = buf[i + 26] | (buf[i + 27] << 8);
    const extraLen = buf[i + 28] | (buf[i + 29] << 8);
    const size =
      buf[i + 18] |
      (buf[i + 19] << 8) |
      (buf[i + 20] << 16) |
      (buf[i + 21] << 24);
    names.push(dec.decode(buf.subarray(i + 30, i + 30 + nameLen)));
    i += 30 + nameLen + extraLen + size;
  }
  return names;
}
