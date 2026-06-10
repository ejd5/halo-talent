"use client";

import { DEMO_PERSONAS, type PersonaId, track } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { User, Building2, Star, Briefcase } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const personaIcons: Record<PersonaId, React.ElementType> = {
  solo: User,
  agency: Building2,
  premium: Star,
  manager: Briefcase,
};

export function DemoPersonaSelector({
  selected,
  onSelect,
  onConfirm,
}: {
  selected: PersonaId | null;
  onSelect: (id: PersonaId) => void;
  onConfirm: () => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  const handleSelect = (id: PersonaId) => {
    onSelect(id);
    track("persona_selected", { persona: id });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold text-center mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("demo_new.persona.title", l)}
      </h2>
      <p className="text-xs text-center mb-6" style={{ color: "var(--color-ink-secondary)" }}>
        {t("demo_new.persona.desc", l)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-6">
        {DEMO_PERSONAS.map((persona) => {
          const isSelected = selected === persona.id;
          const Icon = personaIcons[persona.id];

          return (
            <button
              key={persona.id}
              onClick={() => handleSelect(persona.id)}
              className="p-4 text-left transition-all"
              style={{
                backgroundColor: isSelected ? "rgba(199,91,57,0.08)" : "rgba(255,255,255,0.02)",
                border: isSelected ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isSelected ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.04)" }}
                >
                  <Icon size={18} style={{ color: isSelected ? "var(--accent)" : "rgba(255,255,255,0.4)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {t(persona.labelKey, l)}
                    </span>
                    {isSelected && <span className="text-[9px]" style={{ color: "var(--accent)" }}>✓</span>}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-secondary)" }}>
                    {t(persona.descriptionKey, l)}
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    {persona.features.map((fk, fi) => (
                      <li key={fi} className="text-[9px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span style={{ color: "var(--accent)" }}>→</span>
                        {t(fk, l)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onConfirm}
          disabled={!selected}
          className="px-6 py-2 text-xs font-medium transition-all"
          style={{
            backgroundColor: selected ? "var(--accent)" : "rgba(255,255,255,0.06)",
            color: selected ? "var(--text-primary)" : "rgba(255,255,255,0.3)",
            cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          {t("demo_new.nav.confirm", l)}
        </button>
      </div>
    </div>
  );
}
