"use client";

import type { ContentSection, ContentType } from "./types";
import { CONTENT_TYPE_OPTIONS, FREQ_OPTIONS } from "./types";

export function StepContent({
  value,
  onChange,
}: {
  value: ContentSection | null;
  onChange: (v: ContentSection) => void;
}) {
  const data = value ?? { types: [], frequency: "" };

  const toggleType = (id: ContentType) => {
    const next = data.types.includes(id)
      ? data.types.filter((t) => t !== id)
      : [...data.types, id];
    onChange({ ...data, types: next });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">📸</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Quel contenu créez-vous principalement&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Sélectionnez vos formats de prédilection
      </p>

      {/* Content type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {CONTENT_TYPE_OPTIONS.map((opt) => {
          const sel = data.types.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleType(opt.id)}
              className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
              style={{
                backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                border: sel
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span
                className="text-xs font-medium"
                style={{ color: sel ? "var(--accent)" : "var(--text-primary)" }}
              >
                {opt.label}
              </span>
              {sel && (
                <span className="ml-auto text-accent text-xs">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Frequency */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          Fréquence de publication souhaitée
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FREQ_OPTIONS.map((f) => {
            const sel = data.frequency === f;
            return (
              <button
                key={f}
                onClick={() => onChange({ ...data, frequency: sel ? "" : f })}
                className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                  border: sel
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-default)",
                  color: sel ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
