// ─── WXT Build Configuration — Halo Companion ───────────
// Targets: Chrome 120+ (Manifest V3)
// Size budget: SW <50KB, CS <30KB, Sidepanel <200KB, Total <500KB

import { defineConfig } from "wxt";

export default defineConfig({
  // ── Browser target ────────────────────────────────────
  browser: "chrome",
  outDir: "dist",

  // ── Manifest ──────────────────────────────────────────
  manifest: () => ({
    manifest_version: 3,
    name: "WTF Companion",
    version: "1.0.0",
    description:
      "Votre co-pilote IA pour créateurs de contenu — CRM, IA générative et intelligence fan dans votre navigateur.",
    author: "Halo Talent",
    homepage_url: "https://halotalent.com",
    minimum_chrome_version: "120",

    permissions: [
      "sidePanel",
      "storage",
      "alarms",
      "notifications",
      "activeTab",
    ],
    optional_permissions: ["tabs"],
    host_permissions: [
      "https://onlyfans.com/*",
      "https://*.fansly.com/*",
      "https://mym.fans/*",
      "https://*.instagram.com/*",
      "https://*.tiktok.com/*",
      "https://api.halotalent.com/*",
    ],

    // Web-accessible resources for Shadow DOM overlays
    web_accessible_resources: [
      {
        resources: ["src/content-scripts/overlays/*.ts"],
        matches: [
          "https://onlyfans.com/*",
          "https://*.fansly.com/*",
          "https://mym.fans/*",
        ],
      },
    ],

    // Content Security Policy
    content_security_policy: {
      extension_pages:
        "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.halotalent.com https://onlyfans.com https://*.fansly.com https://mym.fans https://*.instagram.com https://*.tiktok.com;",
    },

    // Icons
    icons: {
      16: "src/assets/icons/icon-16.png",
      48: "src/assets/icons/icon-48.png",
      128: "src/assets/icons/icon-128.png",
    },
  }),

  // ── Entry Points ──────────────────────────────────────
  // WXT auto-discovers these, but explicit config ensures correct bundling

  modules: ["@wxt-dev/module-react"],

  // ── Vite Configuration ────────────────────────────────
  vite: () => ({
    resolve: {
      alias: {
        "@": "/src",
        "@background": "/src/background",
        "@content-scripts": "/src/content-scripts",
        "@sidepanel": "/src/sidepanel",
        "@lib": "/src/lib",
        "@types": "/src/types",
      },
    },

    build: {
      // Target Chrome 120+ (supports top-level await, private fields, etc.)
      target: "chrome120",

      // Tree-shaking
      rollupOptions: {
        treeshake: {
          preset: "recommended",
          moduleSideEffects: (id) => {
            // Don't tree-shake CSS side effects
            if (id.endsWith(".css")) return true;
            return false;
          },
        },
        output: {
          // Manual chunk splitting to keep content-script lean
          manualChunks: (id) => {
            if (id.includes("src/content-scripts/overlays")) {
              return "content-overlays";
            }
            if (id.includes("src/content-scripts/adapters")) {
              return "content-adapters";
            }
            if (id.includes("src/content-scripts")) {
              return "content-core";
            }
            if (id.includes("src/sidepanel")) {
              return "sidepanel";
            }
            if (id.includes("src/popup")) {
              return "popup";
            }
            if (id.includes("src/lib") || id.includes("src/types")) {
              return "shared";
            }
          },
        },
      },

      // Size budgets (warnings in dev)
      chunkSizeWarningLimit: 200,

      // Minify in production using default esbuild
      minify: process.env.NODE_ENV === "production" ? "esbuild" : false,
    },

    // Source maps in dev only
    css: {
      devSourcemap: true,
    },
  }),


  // ── Zip (for Chrome Web Store submission) ──────────────
  zip: {
    name: "ofm-companion",
    artifactTemplate: "ofm-companion-v{{version}}.zip",
  },
});
