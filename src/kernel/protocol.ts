/**
 * Worker <-> main-thread message protocol.
 *
 * Design rules (see architecture requirement #1):
 *  - Every command and response is structured-clone serializable.
 *  - Mesh payloads are typed arrays sent as Transferables (zero-copy) so we
 *    never block on large structured-clone copies.
 *  - The main thread only ever sends *commands*; the worker owns all OCCT
 *    state and is the only place `occt-wasm` is imported. This keeps the
 *    kernel off the main thread and gives us one place to grow the
 *    regeneration engine (Phase 2) later.
 *
 * Each request carries a numeric `id`; the worker echoes it back so the
 * client can resolve the matching promise. This is a minimal hand-rolled RPC
 * rather than Comlink so we control exactly what crosses the boundary and can
 * attach Transferables to responses.
 */
import type { FeatureTree } from "../model/featureTree";

/** A tessellated triangle mesh, ready to feed into a three.js BufferGeometry. */
export interface MeshPayload {
  /** Interleaved XYZ vertex positions. Length = vertexCount * 3. */
  positions: Float32Array;
  /** Interleaved XYZ vertex normals. Length = vertexCount * 3. */
  normals: Float32Array;
  /** Triangle vertex indices into positions/normals. Length = triangleCount * 3. */
  indices: Uint32Array;
  vertexCount: number;
  triangleCount: number;
  /**
   * Per-face groups as [indexStart, indexCount, faceHash] triples. NOTE:
   * indexStart/indexCount are offsets into `indices` measured in INDEX units
   * (3 per triangle), verified against occt-wasm 4.4 — a box face reports
   * indexCount=6 = two triangles. So triangles for a face are
   * indices[indexStart .. indexStart+indexCount]. `faceHash` is OCCT's
   * stable-ish per-face hash used later for picking and as the seed of our
   * stable-ID scheme (architecture requirement #3).
   */
  faceGroups: Int32Array;
  faceCount: number;
}

/** Polyline wireframe of a shape's edges, for edge overlay / picking later. */
export interface EdgePayload {
  /** Interleaved XYZ sample points along all edges. */
  points: Float32Array;
  /** Per-edge groups as [pointStart, pointCount, edgeHash] triples. */
  edgeGroups: Int32Array;
  edgeCount: number;
}

// ---------------------------------------------------------------------------
// Commands (main -> worker)
// ---------------------------------------------------------------------------

/** Tessellation quality knobs passed through to OCCT's mesher. */
export interface TessellationQuality {
  /** Max linear chord deviation, model units. Smaller = finer. Default 0.1. */
  linearDeflection?: number;
  /** Max angular deviation, radians. Smaller = finer. Default 0.5. */
  angularDeflection?: number;
}

export interface CmdInit {
  op: "init";
}

export interface CmdMakeBox {
  op: "makeBox";
  dx: number;
  dy: number;
  dz: number;
  quality?: TessellationQuality;
}

/**
 * Regenerate the whole document from its feature tree. The worker evaluates
 * every feature in order and returns the tessellated final result plus a
 * per-feature status so the UI can flag which feature failed.
 */
export interface CmdRegenerate {
  op: "regenerate";
  tree: FeatureTree;
  quality?: TessellationQuality;
}

/**
 * Export the current tree's solid to a CAD interchange format. The worker
 * regenerates the tree to a single body then serializes it. STEP is a text
 * format; STL may be ascii text or binary — we request ascii for simplicity.
 */
export interface CmdExport {
  op: "export";
  format: "step" | "stl";
  tree: FeatureTree;
}

/** Union of all commands the worker understands. */
export type KernelCommand = CmdInit | CmdMakeBox | CmdRegenerate | CmdExport;

export type KernelOp = KernelCommand["op"];

/** Envelope wrapping a command with a correlation id. */
export interface RequestMessage {
  id: number;
  command: KernelCommand;
}

// ---------------------------------------------------------------------------
// Responses (worker -> main)
// ---------------------------------------------------------------------------

export interface InitResult {
  ready: true;
  /** occt-wasm version string, for diagnostics. */
  version?: string;
}

/**
 * Result of an operation that produced a renderable shape. Carries the
 * tessellated mesh plus the kernel-side handle so downstream ops can
 * reference this shape without re-sending geometry.
 */
export interface ShapeResult {
  /** Opaque kernel-side shape handle (an occt-wasm ShapeHandle / u32). */
  shapeId: number;
  mesh: MeshPayload;
  edges: EdgePayload;
  /** Axis-aligned bounding box, handy for framing the camera. */
  bbox: { min: [number, number, number]; max: [number, number, number] };
}

/** Outcome of evaluating a single feature during regeneration. */
export interface FeatureStatus {
  featureId: string;
  state: "ok" | "suppressed" | "error";
  /** Present when state === "error". */
  message?: string;
}

/**
 * Result of a full-tree regeneration. `mesh`/`edges`/`bbox` describe the final
 * combined body, or are absent if the tree produced no geometry (empty tree,
 * everything suppressed, or the first feature errored). `statuses` always has
 * one entry per feature in tree order.
 */
export interface RegenResult {
  statuses: FeatureStatus[];
  shapeId: number | null;
  mesh: MeshPayload | null;
  edges: EdgePayload | null;
  bbox: { min: [number, number, number]; max: [number, number, number] } | null;
}

/** Result of an export command: the serialized document as text. */
export interface ExportResult {
  format: "step" | "stl";
  data: string;
}

export type ResultFor<C extends KernelCommand> = C extends CmdInit
  ? InitResult
  : C extends CmdMakeBox
    ? ShapeResult
    : C extends CmdRegenerate
      ? RegenResult
      : C extends CmdExport
        ? ExportResult
        : never;

export interface ResponseOk {
  id: number;
  ok: true;
  result: InitResult | ShapeResult | RegenResult | ExportResult;
}

export interface ResponseErr {
  id: number;
  ok: false;
  error: {
    message: string;
    /** occt-wasm OcctErrorCode when available, else undefined. */
    code?: string | number;
  };
}

export type ResponseMessage = ResponseOk | ResponseErr;

/**
 * Collect the Transferable buffers from a result so the worker can hand off
 * ownership instead of copying. Safe to call on any result shape.
 */
export function collectTransferables(
  result: InitResult | ShapeResult | RegenResult | ExportResult,
): Transferable[] {
  if (!("mesh" in result) || result.mesh == null) return [];
  const mesh = result.mesh;
  const edges = result.edges;
  const buffers: Transferable[] = [
    mesh.positions.buffer,
    mesh.normals.buffer,
    mesh.indices.buffer,
    mesh.faceGroups.buffer,
  ];
  if (edges) {
    buffers.push(edges.points.buffer, edges.edgeGroups.buffer);
  }
  return buffers;
}
