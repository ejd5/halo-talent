import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      // The existing product code still contains broad external/API payloads.
      // Keep surfacing them without blocking the baseline lint command.
      "@typescript-eslint/no-explicit-any": "warn",
      // React Compiler rules expose useful debt in this inherited codebase, but
      // the first recovery step is to make lint runnable without blocking.
      "react-hooks/globals": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated analysis artifacts and separate workspaces are linted in their
    // own contexts to keep the web app signal actionable.
    ".graphify-off/**",
    "coverage/**",
    "mobile/**",
    "extension/**",
    "remotion/**",
    "scripts/*.js",
  ]),
]);

export default eslintConfig;
