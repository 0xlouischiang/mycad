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
  build: {
    // three.js is legitimately ~525 KB as its own vendor chunk and can't be
    // split further without deep tree-shaking; raise the warning threshold so
    // the build output isn't perpetually noisy about an intentional split.
    chunkSizeWarningLimit: 600,
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
