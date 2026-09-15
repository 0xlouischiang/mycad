/**
 * Serverless proxy for the Claude API (Phase 13).
 *
 * The browser never sees the API key: the client POSTs { system, messages,
 * tools } here, and this stateless handler forwards to the Anthropic Messages
 * API with tool use enabled and returns the raw assistant message. No
 * conversation state is kept server-side — the client owns the agentic loop.
 *
 * The handler is runtime-agnostic (plain request-body-in, {status, body}-out)
 * so it can be mounted by the Vite dev middleware (see vite.config.ts) AND
 * deployed as a serverless function (see the default export adapter below).
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";
const MAX_TOKENS = 4096;

export interface ChatRequest {
  system?: string;
  messages: unknown[];
  tools?: unknown[];
}

export interface HandlerResponse {
  status: number;
  body: unknown;
}

/**
 * Core handler. Reads ANTHROPIC_API_KEY / CLAUDE_MODEL from `env` (pass
 * process.env). Returns a 503 with a clear message when the key is absent so
 * the client can degrade gracefully instead of erroring.
 */
export async function handleChat(
  req: ChatRequest,
  env: Record<string, string | undefined> = {},
): Promise<HandlerResponse> {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error:
          "ANTHROPIC_API_KEY not set. Set it in the server environment to enable chat-driven modeling.",
      },
    };
  }

  if (!req || !Array.isArray(req.messages)) {
    return { status: 400, body: { error: "messages[] is required" } };
  }

  const model = env.CLAUDE_MODEL || DEFAULT_MODEL;

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        system: req.system,
        messages: req.messages,
        tools: req.tools,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      // Surface the upstream error (e.g. auth, rate limit) to the client.
      const message =
        (data as { error?: { message?: string } })?.error?.message ??
        `Anthropic API error (${res.status})`;
      return { status: res.status, body: { error: message } };
    }
    // Return the assistant message content blocks + stop_reason for the loop.
    return {
      status: 200,
      body: {
        role: (data as { role?: string }).role ?? "assistant",
        content: (data as { content?: unknown }).content ?? [],
        stop_reason: (data as { stop_reason?: string }).stop_reason ?? null,
      },
    };
  } catch (err) {
    return {
      status: 502,
      body: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

/**
 * Serverless adapter (Vercel / Netlify style Web Request → Response). Kept as
 * the module default so a platform can route POST /api/chat straight to it.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }
  let req: ChatRequest;
  try {
    req = (await request.json()) as ChatRequest;
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env ?? {};
  const { status, body } = await handleChat(req, env);
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
