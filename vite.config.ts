import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleChat, type ChatRequest } from "./api/chat";
import { handleCfd } from "./api/cfd";

/**
 * Dev-only middleware that mounts the /api/chat proxy inside `npm run dev`, so
 * the chat feature is testable locally without a separate server or deploy. It
 * reuses the exact same handleChat used by the serverless entry, reading the
 * key from the dev process's env (ANTHROPIC_API_KEY).
 */
function chatProxyPlugin(): PluginOption {
  return {
    name: "mycad-chat-proxy",
    configureServer(server) {
      server.middlewares.use("/api/chat", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "method not allowed" }));
          return;
        }
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", async () => {
          let body: ChatRequest;
          try {
            body = JSON.parse(raw || "{}") as ChatRequest;
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "invalid JSON body" }));
            return;
          }
          const { status, body: out } = await handleChat(body, process.env);
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(out));
        });
      });
    },
  };
}

/**
 * Dev-only middleware mounting the CFD job API (submit/status/log/result/cancel)
 * at /api/cfd. Reuses handleCfd from api/cfd.ts. OpenFOAM itself runs in Docker;
 * if Docker is down, submit returns 503 and the client can still download a zip.
 */
function cfdProxyPlugin(): PluginOption {
  return {
    name: "mycad-cfd-proxy",
    configureServer(server) {
      server.middlewares.use("/api/cfd", (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const query: Record<string, string> = {};
        url.searchParams.forEach((v, k) => {
          query[k] = v;
        });
        const respond = async (body?: unknown) => {
          const { status, body: out } = await handleCfd(
            { method: req.method ?? "GET", path: url.pathname, body, query },
            process.env,
          );
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(out));
        };
        if (req.method === "POST") {
          let raw = "";
          req.on("data", (chunk) => (raw += chunk));
          req.on("end", () => {
            let body: unknown = {};
            try {
              body = JSON.parse(raw || "{}");
            } catch {
              res.statusCode = 400;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ error: "invalid JSON body" }));
              return;
            }
            void respond(body);
          });
          return;
        }
        void respond();
      });
    },
  };
}

// occt-wasm ships a large .wasm binary that must not be inlined or pre-bundled.
// We exclude it from Vite's dep optimizer so the worker's `import.meta.url`-based
// wasm resolution keeps working, and we run the kernel exclusively in a Worker.
export default defineConfig({
  plugins: [react(), tailwindcss(), chatProxyPlugin(), cfdProxyPlugin()],
  worker: {
    // The OCCT worker uses ES module imports (occt-wasm), so emit an ESM worker.
    format: "es",
  },
  optimizeDeps: {
    // occt-wasm is a single-threaded (no SharedArrayBuffer) SIMD build, so no
    // cross-origin isolation headers are required. Excluding it from the dep
    // optimizer preserves the worker's import.meta.url-based .wasm resolution.
    exclude: ["occt-wasm"],
  },
  build: {
    // three.js is ~525 KB and web-ifc's wasm-loader JS is ~3.4 MB; both are
    // isolated in their own chunks (web-ifc is lazy-loaded only when IFC
    // import/export runs, never in the initial bundle), so raise the threshold
    // past web-ifc so the build output isn't perpetually noisy about an
    // intentional split.
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own chunks so they cache
        // independently of app code and the initial parse is smaller. three.js
        // dominates; react/react-dom are stable across releases.
        manualChunks: {
          three: ["three"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
