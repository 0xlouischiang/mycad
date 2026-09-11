/**
 * Main-thread client for the OCCT worker.
 *
 * Wraps the raw postMessage protocol in a promise-based RPC: each `send`
 * returns a promise that resolves when the worker echoes back the matching
 * correlation id. This is the main thread's only handle on the kernel.
 */
import type {
  CmdExport,
  CmdMakeBox,
  CmdRegenerate,
  ExportResult,
  InitResult,
  KernelCommand,
  RegenResult,
  RequestMessage,
  ResponseMessage,
  ShapeResult,
  TessellationQuality,
} from "./protocol";
import type { FeatureTree } from "../model/featureTree";

interface Pending {
  resolve: (value: InitResult | ShapeResult | RegenResult | ExportResult) => void;
  reject: (reason: Error) => void;
}

export class KernelClient {
  private worker: Worker;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private initPromise: Promise<InitResult> | null = null;

  constructor() {
    // `new URL(..., import.meta.url)` is the Vite-idiomatic way to spawn a
    // module worker; the bundler rewrites it and code-splits the worker.
    this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    this.worker.onmessage = (event: MessageEvent<ResponseMessage>) => {
      this.handleResponse(event.data);
    };
    this.worker.onerror = (event) => {
      // A hard worker error rejects every outstanding request so callers don't
      // hang forever.
      const error = new Error(
        `Kernel worker error: ${event.message ?? "unknown"}`,
      );
      for (const [, p] of this.pending) p.reject(error);
      this.pending.clear();
    };
  }

  private handleResponse(msg: ResponseMessage): void {
    const p = this.pending.get(msg.id);
    if (!p) return;
    this.pending.delete(msg.id);
    if (msg.ok) {
      p.resolve(msg.result);
    } else {
      const err = new Error(msg.error.message);
      if (msg.error.code !== undefined) {
        (err as Error & { code?: unknown }).code = msg.error.code;
      }
      p.reject(err);
    }
  }

  private send(
    command: KernelCommand,
  ): Promise<InitResult | ShapeResult | RegenResult | ExportResult> {
    const id = this.nextId++;
    const message: RequestMessage = { id, command };
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage(message);
    });
  }

  /** Initialize the kernel. Idempotent — safe to call repeatedly. */
  init(): Promise<InitResult> {
    if (!this.initPromise) {
      this.initPromise = this.send({ op: "init" }) as Promise<InitResult>;
    }
    return this.initPromise;
  }

  async makeBox(
    dx: number,
    dy: number,
    dz: number,
    quality?: TessellationQuality,
  ): Promise<ShapeResult> {
    await this.init();
    const cmd: CmdMakeBox = { op: "makeBox", dx, dy, dz, quality };
    return this.send(cmd) as Promise<ShapeResult>;
  }

  /** Regenerate the whole document from its feature tree. */
  async regenerate(
    tree: FeatureTree,
    quality?: TessellationQuality,
  ): Promise<RegenResult> {
    await this.init();
    const cmd: CmdRegenerate = { op: "regenerate", tree, quality };
    return this.send(cmd) as Promise<RegenResult>;
  }

  /** Export the tree's solid to STEP or STL text. */
  async exportShape(
    tree: FeatureTree,
    format: "step" | "stl",
  ): Promise<ExportResult> {
    await this.init();
    const cmd: CmdExport = { op: "export", format, tree };
    return this.send(cmd) as Promise<ExportResult>;
  }

  dispose(): void {
    this.worker.terminate();
    this.pending.clear();
  }
}
