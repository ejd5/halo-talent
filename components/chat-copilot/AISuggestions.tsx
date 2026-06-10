"use client";

import { Sparkles, X, RefreshCw, Check } from "lucide-react";

export function AISuggestions({
  suggestion,
  isGenerating,
  onAccept,
  onDismiss,
  onRegenerate,
}: {
  suggestion: string | null;
  isGenerating: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onRegenerate: () => void;
}) {
  if (!suggestion && !isGenerating) return null;

  return (
    <div
      className="px-3 py-2 border-l-2"
      style={{
        borderLeftColor: "var(--accent)",
        backgroundColor: "var(--accent-soft)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={12} style={{ color: "var(--accent)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
          Suggestion IA
        </span>
      </div>

      {isGenerating ? (
        <div className="space-y-1.5 py-1">
          <div className="h-2.5 w-full shimmer" style={{ backgroundColor: "var(--bg-card)", borderRadius: "4px" }} />
          <div className="h-2.5 w-3/4 shimmer" style={{ backgroundColor: "var(--bg-card)", borderRadius: "4px" }} />
        </div>
      ) : suggestion ? (
        <>
          <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-primary)" }}>
            {suggestion}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onAccept}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium"
              style={{ backgroundColor: "var(--accent)", color: "#fff", borderRadius: "4px" }}
            >
              <Check size={10} />
              <span>Utiliser</span>
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium"
              style={{ color: "var(--text-secondary)", borderRadius: "4px" }}
            >
              <X size={10} />
              <span>Ignorer</span>
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium"
              style={{ color: "var(--text-secondary)", borderRadius: "4px" }}
            >
              <RefreshCw size={10} />
              <span>Regénérer</span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
