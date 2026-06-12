"use client";

import { X, ExternalLink, BookOpen } from "lucide-react";
import type { SourceCitation } from "@/lib/halo-lex/types";

interface SourcesModalProps {
  sources: SourceCitation[];
  onClose: () => void;
}

export function SourcesModal({ sources, onClose }: SourcesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div
        className="w-full max-w-lg max-h-[70vh] overflow-y-auto"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <BookOpen size={18} style={{ color: "var(--accent)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Sources juridiques
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {sources.length === 0 && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Aucune source citée dans cette réponse.
            </p>
          )}
          {sources.map((s, i) => (
            <div key={i} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "12px" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                  {s.sourceName}
                </span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} style={{ color: "var(--text-secondary)" }} />
                  </a>
                )}
              </div>
              {s.reference && (
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  {s.reference}
                </p>
              )}
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
