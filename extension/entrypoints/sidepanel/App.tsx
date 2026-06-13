// ─── Side panel App root — Halo Companion ───────────

import { ThemeProvider } from "./theme-provider";
import { Router } from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
        >
          <Router />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
