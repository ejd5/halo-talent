"use client";

import { track } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Sparkles, ShieldCheck, Calendar, UserPlus } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const CTAS = [
  { labelKey: "demo_new.final.cta_pricing", href: "/pricing", icon: Sparkles },
  { labelKey: "demo_new.final.cta_protection", href: "/protection", icon: ShieldCheck },
  { labelKey: "demo_new.final.cta_demo", href: "/apply", icon: Calendar },
  { labelKey: "demo_new.final.cta_apply", href: "/apply", icon: UserPlus },
];

export function DemoFinalCTA({ onRestart }: { onRestart: () => void }) {
  const locale = useLocale();
  const l = norm(locale);

  const handleCta = (labelKey: string, href: string) => {
    track("cta_clicked", { cta: labelKey, href });
  };

  const handleRestart = () => {
    track("demo_completed", { action: "restart" });
    onRestart();
  };

  return (
    <div className="animate-fade-in text-center max-w-xl mx-auto space-y-6">
      <div
        className="p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {t("demo_new.final.title", l)}
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
          {t("demo_new.final.desc", l)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CTAS.map((cta) => {
          const Icon = cta.icon;
          return (
            <a
              key={cta.labelKey}
              href={cta.href}
              onClick={() => handleCta(cta.labelKey, cta.href)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all"
              style={{
                backgroundColor: "var(--accent-soft)",
                border: "1px solid var(--accent-border)",
                color: "var(--accent)",
              }}
            >
              <Icon size={16} />
              {t(cta.labelKey, l)}
            </a>
          );
        })}
      </div>

      <button
        onClick={handleRestart}
        className="text-[10px] transition-colors"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {t("demo_new.final.restart", l)}
      </button>
    </div>
  );
}
