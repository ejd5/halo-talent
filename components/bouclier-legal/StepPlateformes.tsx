"use client";

import { useState } from "react";
import { Check, ArrowRight, Monitor } from "lucide-react";
import { PLATFORMS } from "@/lib/bouclier-legal/types";

const PLATFORM_ICONS: Record<string, string> = {
  onlyfans: "OF",
  fansly: "FL",
  mym: "MYM",
  instagram: "IG",
  youtube: "YT",
  other: "…",
};

export function StepPlateformes({
  onNext,
}: {
  onNext: (platforms: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isValid = selected.size >= 1;

  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <Monitor size={22} style={{ color: "var(--color-accent)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Sur quelles plateformes exercez-vous&nbsp;?
        </h2>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Sélectionnez une ou plusieurs plateformes
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {PLATFORMS.map((p) => {
          const isSelected = selected.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className="relative flex flex-col items-center gap-3 p-5 transition-all"
              style={{
                backgroundColor: isSelected ? "rgba(199,91,57,0.1)" : "var(--bg-card)",
                border: `1.5px solid ${isSelected ? "var(--color-accent)" : "var(--border-default)"}`,
              }}
            >
              {isSelected && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  <Check size={11} color="#fff" />
                </span>
              )}
              <span
                className="w-11 h-11 flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: isSelected ? "var(--color-accent)" : "var(--bg-surface)",
                  color: isSelected ? "#fff" : "var(--text-secondary)",
                }}
              >
                {PLATFORM_ICONS[p.id]}
              </span>
              <span className="text-sm font-medium" style={{ color: isSelected ? "var(--color-accent)" : "var(--text-primary)" }}>
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next */}
      <div className="text-center">
        <button
          onClick={() => isValid && onNext(Array.from(selected))}
          disabled={!isValid}
          className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold transition-all disabled:opacity-40"
          style={{
            backgroundColor: isValid ? "var(--color-accent)" : "var(--border-default)",
            color: isValid ? "#fff" : "var(--text-tertiary)",
          }}
        >
          Suivant
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
