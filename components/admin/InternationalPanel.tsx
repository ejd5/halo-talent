"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { InternationalLanguage } from "@/lib/mock/admin-dashboard";
import { Globe, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface InternationalPanelProps {
  languages: InternationalLanguage[];
  untranslatedPages: number;
}

export function InternationalPanel({ languages, untranslatedPages }: InternationalPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("admin_dashboard.international.title", l)}
      </h2>

      {languages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Globe size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t("admin_dashboard.international.empty", l)}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <div
              key={lang.localeKey}
              className="p-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Globe size={10} style={{ color: "var(--accent)" }} />
                <span className="text-[9px] font-medium" style={{ color: "var(--text-primary)" }}>{lang.language}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[7px]">
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{t("admin_dashboard.international.traffic", l)}</span>
                  <span style={{ color: "var(--text-primary)" }}>{lang.traffic}%</span>
                </div>
                <div className="flex justify-between text-[7px]">
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{t("admin_dashboard.international.conversion", l)}</span>
                  <span style={{ color: "var(--success)" }}>{lang.conversion}%</span>
                </div>
                <div className="flex justify-between text-[7px]">
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{t("admin_dashboard.international.revenue", l)}</span>
                  <span style={{ color: "var(--text-primary)" }}>€{lang.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[7px]">
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{t("admin_dashboard.international.support", l)}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{lang.supportTickets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {untranslatedPages > 0 && (
        <div
          className="flex items-center gap-1.5 p-2 mt-2"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}
        >
          <AlertTriangle size={9} style={{ color: "#F59E0B" }} />
          <span className="text-[7px]" style={{ color: "#F59E0B" }}>
            {t("admin_dashboard.international.untranslated", l).replace("{n}", String(untranslatedPages))}
          </span>
          <Link href="/admin/site/pages" className="ml-auto text-[7px]" style={{ color: "var(--accent)" }}>
            {t("admin_dashboard.international.cta", l)}
          </Link>
        </div>
      )}
    </div>
  );
}
