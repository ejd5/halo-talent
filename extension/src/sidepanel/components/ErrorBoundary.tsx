// ─── Error Boundary — Halo Companion ───────────

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode }

interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[Halo Companion] ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="flex flex-col items-center justify-center h-full p-6 text-center"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <AlertTriangle size={24} style={{ color: "var(--danger)" }} />
          </div>
          <h2
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Une erreur est survenue
          </h2>
          <p
            className="text-[11px] leading-relaxed mb-5 max-w-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {this.state.error.message || "Erreur inattendue dans le Companion."}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            <RefreshCw size={14} />
            Réessayer
          </button>
          <details className="mt-4 text-left w-full max-w-xs">
            <summary
              className="text-[10px] cursor-pointer"
              style={{ color: "var(--text-tertiary)" }}
            >
              Détails techniques
            </summary>
            <pre
              className="mt-2 p-2 rounded-lg text-[9px] leading-relaxed overflow-auto max-h-32"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              {this.state.error.stack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
