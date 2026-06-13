"use client";

import { useState } from "react";
import type { TaboosSection } from "./types";
import { TABOO_TAGS } from "./types";

export function StepTaboos({
  value,
  onChange,
}: {
  value: TaboosSection | null;
  onChange: (v: TaboosSection) => void;
}) {
  const data = value ?? { tags: [], custom: [] };
  const [customInput, setCustomInput] = useState("");

  const toggleTag = (tag: string) => {
    const next = data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag];
    onChange({ ...data, tags: next });
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !data.custom.includes(trimmed)) {
      onChange({ ...data, custom: [...data.custom, trimmed] });
    }
    setCustomInput("");
  };

  const removeCustom = (tag: string) => {
    onChange({ ...data, custom: data.custom.filter((c) => c !== tag) });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">🚫</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Y a-t-il des sujets que l'IA ne doit JAMAIS aborder&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Définissez les limites strictes de votre ADN créatif
      </p>

      {/* Preset tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {TABOO_TAGS.map((tag) => {
          const sel = data.tags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-3.5 py-2 text-sm font-medium rounded-xl transition-all"
              style={{
                backgroundColor: sel ? "rgba(239,68,68,0.12)" : "var(--bg-card)",
                border: sel
                  ? "1px solid rgb(239,68,68)"
                  : "1px solid var(--border-default)",
                color: sel ? "rgb(239,68,68)" : "var(--text-primary)",
              }}
            >
              {sel ? "✕ " : ""}{tag}
            </button>
          );
        })}
      </div>

      {/* Custom tags */}
      <div className="mb-3">
        <label
          className="text-xs font-medium block mb-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          Ajouter un tabou personnalisé
        </label>
        <div className="flex gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Ex: Marques d'alcool, Paris sportifs..."
            className="flex-1 px-3 py-2 text-sm rounded-xl outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          />
          <button
            onClick={addCustom}
            className="px-4 py-2 text-sm font-medium rounded-xl"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Custom tag list */}
      {data.custom.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.custom.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "rgb(239,68,68)",
              }}
            >
              {tag}
              <button onClick={() => removeCustom(tag)} className="ml-0.5">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
