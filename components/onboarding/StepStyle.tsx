"use client";

import type { StyleSection, VisualStyle } from "./types";
import { STYLE_OPTIONS } from "./types";

export function StepStyle({
  value,
  onChange,
}: {
  value: StyleSection | null;
  onChange: (v: StyleSection) => void;
}) {
  const selected = value?.styles ?? [];

  const toggle = (id: VisualStyle) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    onChange({ styles: next });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">🎨</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Quel est votre univers visuel&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Sélectionnez les styles qui vous correspondent (plusieurs choix possibles)
      </p>

      {/* Moodboard grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STYLE_OPTIONS.map((opt) => {
          const isSel = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className="flex flex-col items-center gap-2 p-5 rounded-xl transition-all"
              style={{
                backgroundColor: isSel ? "var(--accent-soft)" : "var(--bg-card)",
                border: isSel
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span
                className="text-[11px] font-medium text-center"
                style={{ color: isSel ? "var(--accent)" : "var(--text-primary)" }}
              >
                {opt.label}
              </span>
              {isSel && (
                <span className="text-[10px] font-bold" style={{ color: "var(--accent)" }}>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p
        className="text-xs text-center mt-4"
        style={{ color: "var(--text-tertiary)" }}
      >
        {selected.length} style{selected.length !== 1 ? "s" : ""} sélectionné
        {selected.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
