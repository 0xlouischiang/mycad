/**
 * Client-side agentic loop (Phase 13).
 *
 * Owns the conversation with the model via the /api/chat proxy. Each turn:
 *   1. Attach a fresh state block (feature tree summary + geometry catalog) so
 *      the model always reasons over current geometry.
 *   2. POST { system, messages, tools } to the proxy.
 *   3. Execute each returned tool_use IN ORDER through the command registry —
 *      the same dispatch the UI uses — so features land in the tree/viewport
 *      one at a time as the user watches. Each result becomes a tool_result.
 *   4. clarify tool → pause and surface the question, awaiting the user's reply.
 *   5. Any tool error → loop again so the model can correct, capped by a retry
 *      limit; on exhaustion surface a plain-language failure.
 *   6. No tool_use → we're done; surface the assistant's text.
 *
 * The transport is injectable so the loop is unit-testable with canned
 * assistant messages (no network / API key needed).
 */
import { dispatch, toolDefinitions, type StoreHandle, type CommandResult } from "./registry";
import { summarizeTree, catalogGeometry } from "./context";

// ---------------------------------------------------------------------------
// Message + content-block types (Anthropic Messages API shape, minimal subset)
// ---------------------------------------------------------------------------

export interface TextBlock {
  type: "text";
  text: string;
}
export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}
export interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}
export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

/** The proxy's response (assistant message). */
export interface AssistantResponse {
  role: "assistant";
  content: ContentBlock[];
  stop_reason: string | null;
  /** Set by the transport when the proxy returned a non-2xx (e.g. key missing). */
  error?: string;
  status?: number;
}

/** Transport: send messages+tools, get the assistant message back. */
export type Transport = (payload: {
  system: string;
  messages: ChatMessage[];
  tools: unknown[];
}) => Promise<AssistantResponse>;

// ---------------------------------------------------------------------------
// UI-facing event stream
// ---------------------------------------------------------------------------

export type ChatEvent =
  | { kind: "assistant_text"; text: string }
  | { kind: "tool_ok"; command: string; message: string }
  | { kind: "tool_error"; command: string; error: string }
  | { kind: "clarify"; question: string }
  | { kind: "error"; message: string }
  | { kind: "done" };

const MAX_RETRIES = 3;
const MAX_TURNS = 12; // hard backstop against runaway loops

const SYSTEM = `You are a CAD modeling assistant embedded in myCAD, a parametric 3D CAD app. You turn the user's plain-language instructions into feature-creation tool calls.

Rules:
- All dimensions are in millimeters. The coordinate system is Z-up.
- To modify or reference an existing feature, use its id from the FEATURE TREE block.
- To fillet/chamfer edges or shell/draft faces, pick refs from the GEOMETRY CATALOG block. Each edge/face has a "ref" string plus its center coordinates, and (for edges) length + axis, (for faces) normal. "Top" = highest Z; a face whose normal is +Z (0,0,1) is the top face. Reason over these to select the right refs — never invent a ref that isn't listed.
- You may call several tools in sequence to build something (e.g. add_sketch then add_extrude).
- If the instruction is ambiguous or missing a dimension that materially changes the result, call the "clarify" tool with a specific question instead of guessing.
- When a tool call returns an error, read it and retry with corrected parameters.
- Keep any text brief; the user sees the features appear in the tree as you create them.`;

/**
 * Everything domain-specific about a chat loop. The loop control flow (execute
 * tool_use in order, feed results back, clarify pause, retry cap, done) is
 * identical for mechanical and BIM modeling; only these four bindings differ.
 * Phase 16 passes a BIM config; the default is the mechanical (Phase 13) one.
 */
export interface LoopConfig {
  /** System prompt describing the domain + rules. */
  system: string;
  /** Anthropic tool definitions (registry schemas + clarify). */
  tools: unknown[];
  /** Validate + run one tool call against the store. */
  dispatch: (name: string, input: unknown, store: StoreHandle) => CommandResult;
  /** Build the per-turn state block appended so the model sees current state. */
  buildStateBlock: (store: StoreHandle) => string;
}

/** Build the per-turn state block appended so the model sees current geometry. */
export function buildStateBlock(store: StoreHandle): string {
  const s = store.getState();
  const summary = summarizeTree(s.tree, s.statuses);
  const catalog = catalogGeometry(s.shape);
  const treeText =
    summary.length === 0
      ? "(empty — no features yet)"
      : summary
          .map(
            (f) =>
              `#${f.index} ${f.name} [${f.type}${f.operation ? "/" + f.operation : ""}] id=${f.id}` +
              (f.suppressed ? " (suppressed)" : "") +
              (f.error ? ` ERROR: ${f.error}` : ""),
          )
          .join("\n");
  const edgesText =
    catalog.edges
      .map(
        (e) =>
          `ref=${e.ref} center=(${e.center.map((n) => round(n)).join(",")}) len=${round(e.length)}${e.axis ? " axis=" + e.axis : ""}`,
      )
      .join("\n") || "(no edges — no body yet)";
  const facesText =
    catalog.faces
      .map(
        (f) =>
          `ref=${f.ref} center=(${f.center.map((n) => round(n)).join(",")})${f.normal ? " normal=(" + f.normal.map((n) => round(n)).join(",") + ")" : " (non-planar)"}`,
      )
      .join("\n") || "(no faces — no body yet)";
  const bbox = catalog.bbox
    ? `model bbox min=(${catalog.bbox.min.map(round).join(",")}) max=(${catalog.bbox.max.map(round).join(",")})`
    : "no geometry";
  return `FEATURE TREE:\n${treeText}\n\nGEOMETRY CATALOG:\n${bbox}\nEDGES:\n${edgesText}\nFACES:\n${facesText}`;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** The default (mechanical / Part Studio) loop config — Phase 13 behavior. */
export const mechanicalLoopConfig: LoopConfig = {
  system: SYSTEM,
  tools: toolDefinitions(),
  dispatch,
  buildStateBlock,
};

/**
 * Run one user turn through the agentic loop. `messages` is the running
 * conversation (mutated: the assistant + tool_result messages are appended, so
 * the caller can persist it for the next turn). `emit` streams UI events.
 *
 * Returns { status: "done" | "clarify" | "error", messages }. On "clarify" the
 * caller collects the user's answer and calls runTurn again with it appended.
 */
export async function runTurn(
  opts: {
    userText: string;
    messages: ChatMessage[];
    transport: Transport;
    store: StoreHandle;
    emit: (e: ChatEvent) => void;
    /** Domain bindings; defaults to the mechanical (Part Studio) config. */
    config?: LoopConfig;
  },
): Promise<{ status: "done" | "clarify" | "error"; messages: ChatMessage[] }> {
  const { transport, store, emit } = opts;
  const config = opts.config ?? mechanicalLoopConfig;
  const messages = opts.messages;

  // Append the user's instruction with the current state block attached.
  messages.push({
    role: "user",
    content: `${opts.userText}\n\n---\n${config.buildStateBlock(store)}`,
  });

  let retries = 0;
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    let res: AssistantResponse;
    try {
      res = await transport({
        system: config.system,
        messages,
        tools: config.tools,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      emit({ kind: "error", message });
      return { status: "error", messages };
    }

    if (res.error) {
      emit({ kind: "error", message: res.error });
      return { status: "error", messages };
    }

    // Record the assistant message verbatim (needed for tool_result linkage).
    messages.push({ role: "assistant", content: res.content });

    const toolUses = res.content.filter(
      (b): b is ToolUseBlock => b.type === "tool_use",
    );
    const texts = res.content.filter((b): b is TextBlock => b.type === "text");
    for (const t of texts) {
      if (t.text.trim()) emit({ kind: "assistant_text", text: t.text });
    }

    // No tools → the turn is complete.
    if (toolUses.length === 0) {
      emit({ kind: "done" });
      return { status: "done", messages };
    }

    // Clarify short-circuits the loop and waits for the user.
    const clarify = toolUses.find((t) => t.name === "clarify");
    if (clarify) {
      const question = String(clarify.input.question ?? "Could you clarify?");
      emit({ kind: "clarify", question });
      // Answer the tool call so the transcript stays valid when resumed.
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: clarify.id,
            content: "(waiting for the user's answer)",
          },
          ...toolUses
            .filter((t) => t.id !== clarify.id)
            .map(
              (t): ToolResultBlock => ({
                type: "tool_result",
                tool_use_id: t.id,
                content: "skipped: resolve the clarification first",
                is_error: true,
              }),
            ),
        ],
      });
      return { status: "clarify", messages };
    }

    // Execute each tool call in order; collect tool_result blocks.
    const results: ToolResultBlock[] = [];
    let hadError = false;
    for (const tu of toolUses) {
      const result = config.dispatch(tu.name, tu.input, store);
      if (result.ok) {
        emit({ kind: "tool_ok", command: tu.name, message: result.message });
        results.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: result.message,
        });
      } else {
        hadError = true;
        emit({ kind: "tool_error", command: tu.name, error: result.error });
        results.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content: result.error,
          is_error: true,
        });
      }
    }

    // Feed results back. Attach a refreshed state block so the model sees the
    // geometry that resulted from the calls it just made.
    messages.push({
      role: "user",
      content: [
        ...results,
        { type: "text", text: `---\n${config.buildStateBlock(store)}` },
      ],
    });

    if (hadError) {
      retries += 1;
      if (retries > MAX_RETRIES) {
        emit({
          kind: "error",
          message:
            "I couldn't complete that after several attempts. Try rephrasing, or give a specific dimension or target.",
        });
        return { status: "error", messages };
      }
      // else loop: let the model correct itself.
    } else {
      retries = 0;
    }
  }

  emit({ kind: "error", message: "Stopped after too many steps." });
  return { status: "error", messages };
}

/** The default network transport, POSTing to the /api/chat proxy. */
export const httpTransport: Transport = async (payload) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      role: "assistant",
      content: [],
      stop_reason: null,
      error:
        (data as { error?: string }).error ?? `Request failed (${res.status})`,
      status: res.status,
    };
  }
  return data as AssistantResponse;
};
