"use client";

import { Languages, Sparkles } from "lucide-react";
import { LANGUAGES } from "../../types";
import type { LangCode } from "../../types";

export function TranslationPanel({
  currentLang,
  onLangChange,
  missingTranslations,
  onTranslateAll,
}: {
  currentLang: LangCode;
  onLangChange: (lang: LangCode) => void;
  missingTranslations: LangCode[];
  onTranslateAll: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Languages size={13} className="opacity-40" />
      <div className="flex border border-[var(--color-border)] divide-x divide-[var(--color-border)]">
        {LANGUAGES.map((lang) => {
          const isMissing = missingTranslations.includes(lang.key);
          return (
            <button
              key={lang.key}
              onClick={() => onLangChange(lang.key)}
              className={`relative px-3 py-1 text-[11px] font-medium transition-colors ${
                currentLang === lang.key
                  ? "bg-[var(--color-accent)] text-white"
                  : "hover:bg-[var(--color-card)]"
              }`}
            >
              {lang.label}
              {isMissing && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {missingTranslations.length > 0 && (
        <button
          onClick={onTranslateAll}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
        >
          <Sparkles size={10} />
          Traduire avec IA
        </button>
      )}

      {missingTranslations.length > 0 && (
        <span className="text-[10px] text-yellow-500">
          {missingTranslations.map((k) => LANGUAGES.find((l) => l.key === k)?.label).join(", ")} manquant{missingTranslations.length > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
