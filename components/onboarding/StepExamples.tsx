"use client";

import { useState } from "react";
import type { ExamplesSection } from "./types";

const MAX_EXAMPLES = 3;

export function StepExamples({
  value,
  onChange,
}: {
  value: ExamplesSection | null;
  onChange: (v: ExamplesSection) => void;
}) {
  const data = value ?? { examples: [] };
  // Fill up to MAX_EXAMPLES slots
  const texts = Array.from({ length: MAX_EXAMPLES }, (_, i) => data.examples[i] ?? "");
  const [local, setLocal] = useState<string[]>(texts);

  const update = (index: number, val: string) => {
    const next = [...local];
    next[index] = val;
    setLocal(next);

    const filled = next.filter((t) => t.trim().length > 0);
    onChange({ examples: filled });
  };

  const filledCount = local.filter((t) => t.trim().length > 0).length;

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">✍️</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Partagez vos meilleurs textes
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Collez 2-3 messages ou captions dont vous êtes fier(ère). Cela aide l'IA
        à capturer votre style d'écriture exact.
      </p>

      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <label
              className="text-[10px] font-medium block mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Exemple {i + 1}{" "}
              {texts[i]?.trim() && (
                <span style={{ color: "var(--accent)" }}>✓</span>
              )}
            </label>
            <textarea
              value={local[i]}
              onChange={(e) => update(i, e.target.value)}
              placeholder={
                i === 0
                  ? "Ex: 'Les amis, aujourd'hui on va parler d'un sujet qui me tient vraiment à cœur...'"
                  : i === 1
                    ? "Ex: 'J'ai testé ça pendant 30 jours et voilà ce qui s'est passé...'"
                    : "Ex: 'Merci pour votre soutien, vous êtes la meilleure communauté ❤️'"
              }
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                border: local[i]?.trim()
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-default)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        ))}
      </div>

      <p
        className="text-xs text-center mt-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        {filledCount}/{MAX_EXAMPLES} exemple{filledCount !== 1 ? "s" : ""} renseigné
        {filledCount > 0 ? " ✓" : ""}
      </p>
    </div>
  );
}
