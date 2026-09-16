/**
 * Chat panel (Phase 13): natural-language, chat-driven feature creation.
 *
 * The user types an instruction ("add a 5mm fillet to the top edges of the last
 * extrude"); the agentic loop (chatController) turns it into command-registry
 * tool calls that run through the SAME store actions the UI buttons use, so
 * features appear in the tree/viewport one at a time as they land.
 *
 * This component owns only presentation + the running message transcript; all
 * modeling logic lives in chatController/registry. If the proxy reports the API
 * key is missing it degrades to a friendly hint instead of erroring.
 */
import { useRef, useState } from "react";
import { useStore } from "../store";
import {
  runTurn,
  httpTransport,
  type ChatMessage,
  type ChatEvent,
  type Transport,
  type LoopConfig,
} from "../commands/chatController";

/** A line rendered in the transcript. */
interface Line {
  role: "user" | "assistant" | "tool" | "tool-error" | "system";
  text: string;
}

export function ChatPanel({
  transport = httpTransport,
  config,
  placeholder = "Describe a change…",
}: {
  transport?: Transport;
  /** Domain loop config; defaults to mechanical (Part Studio) inside runTurn. */
  config?: LoopConfig;
  placeholder?: string;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // Pending clarify: when set, the next send answers the model's question.
  const [awaitingClarify, setAwaitingClarify] = useState(false);
  // The running conversation, persisted across turns (not across reloads).
  const messagesRef = useRef<ChatMessage[]>([]);

  const push = (line: Line) => setLines((ls) => [...ls, line]);

  const onEvent = (e: ChatEvent) => {
    switch (e.kind) {
      case "assistant_text":
        push({ role: "assistant", text: e.text });
        break;
      case "tool_ok":
        push({ role: "tool", text: `✓ ${e.message}` });
        break;
      case "tool_error":
        push({ role: "tool-error", text: `⚠ ${e.command}: ${e.error}` });
        break;
      case "clarify":
        push({ role: "assistant", text: e.question });
        break;
      case "error":
        // The key-missing case gets a friendlier framing.
        if (/ANTHROPIC_API_KEY/.test(e.message)) {
          push({
            role: "system",
            text: "Chat is disabled: set ANTHROPIC_API_KEY in the server environment to enable natural-language modeling.",
          });
        } else {
          push({ role: "tool-error", text: e.message });
        }
        break;
      case "done":
        break;
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    push({ role: "user", text });
    setBusy(true);
    const wasClarify = awaitingClarify;
    setAwaitingClarify(false);
    try {
      // A clarify answer resumes the same transcript; a fresh turn starts anew
      // from the same running messages (chatController appends the state block).
      const result = await runTurn({
        userText: text,
        messages: messagesRef.current,
        transport,
        store: useStore,
        emit: onEvent,
        config,
      });
      messagesRef.current = result.messages;
      if (result.status === "clarify") setAwaitingClarify(true);
    } finally {
      setBusy(false);
    }
    void wasClarify; // (reserved: could annotate the transcript differently)
  };

  return (
    <section className="flex min-h-0 flex-col border-t border-neutral-800">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Assistant
        </h2>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setLines([]);
              messagesRef.current = [];
              setAwaitingClarify(false);
            }}
            className="text-[10px] text-neutral-500 hover:text-neutral-300"
          >
            clear
          </button>
        )}
      </div>

      <div className="max-h-72 min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {lines.length === 0 && (
          <p className="py-2 text-[11px] leading-relaxed text-neutral-600">
            Describe what to build, e.g. “make a 40×30×20 box, then a 5mm fillet
            on its top edges”. Features you create here behave exactly like
            hand-made ones — edit, suppress, delete, undo.
          </p>
        )}
        <ul className="flex flex-col gap-1.5">
          {lines.map((l, i) => (
            <li
              key={i}
              className={
                l.role === "user"
                  ? "text-xs text-neutral-200"
                  : l.role === "assistant"
                    ? "text-xs text-blue-300"
                    : l.role === "tool"
                      ? "font-mono text-[11px] text-green-400"
                      : l.role === "tool-error"
                        ? "font-mono text-[11px] text-amber-400"
                        : "text-[11px] italic text-neutral-500"
              }
            >
              {l.role === "user" ? <span className="text-neutral-500">›&nbsp;</span> : null}
              {l.text}
            </li>
          ))}
          {busy && (
            <li className="text-[11px] italic text-neutral-500">working…</li>
          )}
        </ul>
      </div>

      <div className="flex items-center gap-1 px-3 pb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
          placeholder={awaitingClarify ? "Answer the question…" : placeholder}
          disabled={busy}
          className="min-w-0 flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-100 outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={busy || input.trim() === ""}
          className="rounded bg-blue-700 px-3 py-1.5 text-xs text-white hover:bg-blue-600 disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </section>
  );
}
