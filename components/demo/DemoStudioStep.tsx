"use client";

import { useState, useRef, useEffect } from "react";
import { PERSONA_DNA, PERSONA_CAPTIONS, type PersonaId } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Sparkles, PenLine } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function DemoStudioStep({ persona }: { persona: PersonaId }) {
  const locale = useLocale();
  const l = norm(locale);
  const dna = PERSONA_DNA[persona];
  const caption = PERSONA_CAPTIONS[persona];

  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setShowTooltip(true);
    }, 1500);
  };

  return (
    <div className="animate-fade-in space-y-4 max-w-2xl mx-auto">
      {/* DNA Section */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {t("demo_new.studio.dna_title", l)}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: "demo_new.studio.voice", value: dna.voice },
            { label: "demo_new.studio.style", value: dna.style },
            { label: "demo_new.studio.audience", value: dna.audience },
          ] as const).map((attr) => (
            <div key={attr.label}>
              <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t(attr.label, l)}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                {attr.value}
              </p>
            </div>
          ))}
        </div>
        {/* Progress ring */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${dna.completion}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t("demo_new.studio.completion", l).replace("{n}", String(dna.completion))}
          </span>
        </div>
      </div>

      {/* Caption Generator */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          <PenLine size={14} />
          Studio IA, Caption
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("demo_new.studio.placeholder", l)}
            className="flex-1 px-3 py-2 text-xs outline-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || generating}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] transition-all"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: !input.trim() || generating ? "rgba(255,255,255,0.3)" : "var(--accent)",
              cursor: !input.trim() || generating ? "not-allowed" : "pointer",
            }}
          >
            <Sparkles size={12} />
            {generating ? t("demo_new.studio.generating", l) : t("demo_new.studio.generate", l)}
          </button>
        </div>

        {generating && (
          <div className="flex items-center gap-2 py-3">
            <div className="w-3 h-3 rounded-full animate-spin" style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)" }} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("demo_new.studio.generating", l)}</span>
          </div>
        )}

        {generated && !generating && (
          <div className="relative">
            <div
              className="p-3 text-[11px] leading-relaxed"
              style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid var(--accent-border)" }}
            >
              <span
                className="inline-block text-[8px] font-medium px-1.5 py-0.5 mb-2"
                style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}
              >
                {t("demo_new.studio.ia_badge", l)}
              </span>
              <p style={{ color: "var(--text-primary)" }}>{caption.text}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {caption.hashtags.map((tag) => (
                  <span key={tag} className="text-[8px]" style={{ color: "rgba(199,91,57,0.6)" }}>{tag}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{caption.platform}</span>
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                <button className="text-[8px]" style={{ color: "var(--accent)" }}>{t("demo_new.studio.edit", l)}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="p-2 text-[9px] text-center transition-opacity"
          style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          💡 {t("demo_new.studio.tooltip", l)}
        </div>
      )}

      {/* CTA */}
      {generated && (
        <div className="text-center">
          <a
            href="/dashboard/ai-generation"
            className="inline-block px-4 py-1.5 text-[10px] transition-colors"
            style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
          >
            {t("demo_new.studio.view_all", l)} →
          </a>
        </div>
      )}
    </div>
  );
}
