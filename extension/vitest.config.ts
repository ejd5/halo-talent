// ─── Vitest Configuration — Halo Companion ───────────

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/src": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // jsdom for DOM-related tests (adapters, Shadow DOM, overlays)
    environment: "jsdom",

    // Global test utilities
    globals: true,

    // Setup file for chrome mock, crypto mock, IndexedDB mock
    setupFiles: ["./src/test-setup.ts"],

    // Include patterns
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],

    // Exclude patterns
    exclude: ["node_modules", "dist", ".wxt"],

    // Coverage
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/content-scripts/adapters/**", "src/content-scripts/overlays/**"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "src/test-setup.ts"],
      thresholds: {
        branches: 60,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
