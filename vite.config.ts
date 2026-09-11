import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// occt-wasm ships a large .wasm binary that must not be inlined or pre-bundled.
// We exclude it from Vite's dep optimizer so the worker's `import.meta.url`-based
// wasm resolution keeps working, and we run the kernel exclusively in a Worker.
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
});
