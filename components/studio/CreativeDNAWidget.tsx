"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { DNA_PROFILE } from "@/lib/mock/studio-dashboard";
import { Mic, Palette, Users, Ban, Target } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const DNA_ATTRIBUTES: { key: string; labelKey: string; icon: React.ElementType; valueKey: string }[] = [
  { key: "voice", labelKey: "studio_dashboard.dna.voice", icon: Mic, valueKey: DNA_PROFILE.voice },
  { key: "style", labelKey: "studio_dashboard.dna.style", icon: Palette, valueKey: DNA_PROFILE.style },
  { key: "audience", labelKey: "studio_dashboard.dna.audience", icon: Users, valueKey: DNA_PROFILE.audience },
  { key: "taboos", labelKey: "studio_dashboard.dna.taboos", icon: Ban, valueKey: DNA_PROFILE.taboos },
  { key: "goals", labelKey: "studio_dashboard.dna.goals", icon: Target, valueKey: DNA_PROFILE.goals },
];

export function CreativeDNAWidget() {
  const locale = useLocale();
  const l = norm(locale);
  const pct = DNA_PROFILE.completionPct;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("studio_dashboard.dna.title", l)}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Completion ring + pct */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="var(--accent)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
              {t("studio_dashboard.dna.completion", l).replace("{pct}", String(pct))}
            </p>
            <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t("studio_dashboard.greeting.agents", l).replace("{n}", "5")}
            </p>
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-2 mb-4">
          {DNA_ATTRIBUTES.map((attr) => {
            const Icon = attr.icon;
            return (
              <div key={attr.key} className="flex items-start gap-2">
                <Icon size={10} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
                <div className="min-w-0">
                  <span className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t(attr.labelKey, l)}
                  </span>
                  <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {t(attr.valueKey, l)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/onboarding/dna"
          className="block text-[9px] text-center py-1.5 transition-colors"
          style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
        >
          {t("studio_dashboard.dna.cta", l)}
        </Link>
      </div>
    </div>
  );
}
