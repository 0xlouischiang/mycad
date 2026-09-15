/**
 * OCCT kernel Web Worker (the "kernel host").
 *
 * This is the ONLY module that imports `occt-wasm`. All geometry lives here,
 * off the main thread. The main thread talks to it exclusively through the
 * serializable command protocol in ./protocol.ts.
 *
 * Phase 1 scope: init the kernel, make a box, tessellate it (with face groups
 * for future picking), and ship the mesh back via Transferables.
 *
 * The kernel instance and a running list of live shape handles are held in
 * module scope. In later phases the feature-tree regeneration engine will live
 * inside this worker, mutating/rebuilding shapes here and only streaming the
 * final meshes out — the main thread never needs the B-rep itself.
 */
import { OcctKernel } from "occt-wasm";
// Vite resolves this to a hashed URL for the .wasm binary. We pass it to
// OcctKernel.init so the worker doesn't rely on import.meta.url guessing.
import wasmUrl from "occt-wasm/dist/occt-wasm.wasm?url";

import type {
  CmdExport,
  CmdMakeBox,
  CmdMassProps,
  CmdRegenerate,
  EdgePayload,
  ExportResult,
  InitResult,
  KernelCommand,
  MassPropsResult,
  MeshPayload,
  RegenResult,
  RequestMessage,
  ResponseMessage,
  ShapeResult,
  TessellationQuality,
} from "./protocol";
import { collectTransferables } from "./protocol";
import { regenerate, exportTree, massPropsOfTree } from "./regen";

/** Lazily-initialized kernel. Null until the first `init` command completes. */
let kernel: OcctKernel | null = null;

const DEFAULT_QUALITY: Required<TessellationQuality> = {
  linearDeflection: 0.1,
  angularDeflection: 0.5,
};

function requireKernel(): OcctKernel {
  if (!kernel) {
    throw new Error("Kernel not initialized — send an 'init' command first.");
  }
  return kernel;
}

async function handleInit(): Promise<InitResult> {
  if (!kernel) {
    kernel = await OcctKernel.init({ wasm: wasmUrl });
  }
  return { ready: true };
}

/**
 * Tessellate a shape into a renderable mesh + edge wireframe, and compute its
 * bounding box. Uses `meshShape` (not `tessellate`) so we get per-face groups
 * with stable face hashes — the seed of picking and the stable-ID scheme.
 */
function buildShapeResult(
  k: OcctKernel,
  shapeId: number,
  quality: Required<TessellationQuality>,
): ShapeResult {
  const opts = {
    linearDeflection: quality.linearDeflection,
    angularDeflection: quality.angularDeflection,
  };

  const raw = k.meshShape(shapeId as never, opts);
  const mesh: MeshPayload = {
    // occt-wasm returns views into WASM memory; copy into standalone buffers so
    // they survive past the next kernel call and can be transferred out.
    positions: new Float32Array(raw.positions),
    normals: new Float32Array(raw.normals),
    indices: new Uint32Array(raw.indices),
    vertexCount: raw.vertexCount,
    triangleCount: raw.triangleCount,
    faceGroups: new Int32Array(raw.faceGroups ?? new Int32Array(0)),
    faceCount: raw.faceCount ?? 0,
  };

  const rawEdges = k.wireframe(shapeId as never, quality.linearDeflection);
  const edges: EdgePayload = {
    points: new Float32Array(rawEdges.points),
    edgeGroups: new Int32Array(rawEdges.edgeGroups),
    edgeCount: rawEdges.edgeCount,
  };

  const bb = k.getBoundingBox(shapeId as never, true);
  return {
    shapeId,
    mesh,
    edges,
    bbox: {
      min: [bb.xmin, bb.ymin, bb.zmin],
      max: [bb.xmax, bb.ymax, bb.zmax],
    },
  };
}

function handleMakeBox(cmd: CmdMakeBox): ShapeResult {
  const k = requireKernel();
  const quality = { ...DEFAULT_QUALITY, ...cmd.quality };
  const handle = k.makeBox(cmd.dx, cmd.dy, cmd.dz);
  return buildShapeResult(k, handle as unknown as number, quality);
}

function handleRegenerate(cmd: CmdRegenerate): RegenResult {
  const k = requireKernel();
  return regenerate(k, cmd.tree, cmd.quality);
}

function handleExport(cmd: CmdExport): ExportResult {
  const k = requireKernel();
  const data = exportTree(k, cmd.tree, cmd.format);
  return { format: cmd.format, data };
}

function handleMassProps(cmd: CmdMassProps): MassPropsResult {
  const k = requireKernel();
  return massPropsOfTree(k, cmd.tree);
}

async function dispatch(
  command: KernelCommand,
): Promise<
  InitResult | ShapeResult | RegenResult | ExportResult | MassPropsResult
> {
  switch (command.op) {
    case "init":
      return handleInit();
    case "export":
      return handleExport(command);
    case "massProps":
      return handleMassProps(command);
    case "makeBox":
      return handleMakeBox(command);
    case "regenerate":
      return handleRegenerate(command);
    default: {
      // Exhaustiveness guard — adding a command without handling it is a
      // compile-time error here.
      const _never: never = command;
      throw new Error(`Unhandled command: ${JSON.stringify(_never)}`);
    }
  }
}

self.onmessage = async (event: MessageEvent<RequestMessage>) => {
  const { id, command } = event.data;
  try {
    const result = await dispatch(command);
    const response: ResponseMessage = { id, ok: true, result };
    (self as unknown as Worker).postMessage(
      response,
      collectTransferables(result),
    );
  } catch (err) {
    const response: ResponseMessage = {
      id,
      ok: false,
      error: {
        message: err instanceof Error ? err.message : String(err),
        code:
          err && typeof err === "object" && "code" in err
            ? (err as { code?: string | number }).code
            : undefined,
      },
    };
    (self as unknown as Worker).postMessage(response);
  }
};
