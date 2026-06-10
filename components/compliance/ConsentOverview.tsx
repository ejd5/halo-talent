"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { CONSENT_SUMMARIES, type ConsentSummary } from "@/lib/mock/atlas-compliance";
import { Users, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const CHANNEL_ICONS: Record<string, string> = {
  email: "#3B82F6",
  sms: "#F59E0B",
  push: "#8B5CF6",
  dm: "#EC4899",
};

interface ConsentOverviewProps {
  summaries?: ConsentSummary[];
}

export function ConsentOverview({ summaries = CONSENT_SUMMARIES }: ConsentOverviewProps) {
  const locale = useLocale();
  const l = norm(locale);

  const totalMissing = summaries.reduce((acc, s) => acc + s.missing, 0);

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.consent.title", l)}
        {totalMissing > 0 && (
          <span className="ml-2 text-[8px] px-1.5 py-0.5" style={{ background: "rgba(229,72,77,0.12)", color: "var(--danger)" }}>
            {totalMissing} {t("compliance.consent.missing", l).replace("{n}", "")}
          </span>
        )}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaries.map((s) => {
            const pct = Math.round((s.granted / s.total) * 100);
            const channelColor = CHANNEL_ICONS[s.channel] || "var(--accent)";
            const isLow = pct < 70;
            return (
              <div
                key={s.channel}
                className="p-3"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${isLow ? "rgba(229,72,77,0.15)" : "rgba(255,255,255,0.04)"}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {t(`compliance.consent.channel_${s.channel}`, l)}
                  </span>
                  {isLow && <AlertTriangle size={10} style={{ color: "var(--danger)" }} />}
                </div>

                {/* Progress bar */}
                <div className="h-2 mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: isLow ? "var(--danger)" : channelColor,
                    }}
                  />
                </div>

                <p className="text-[18px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {t("compliance.consent.granted", l).replace("{pct}", String(pct))}
                </p>
                <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t("compliance.consent.total", l).replace("{n}", String(s.total))} · {t("compliance.consent.missing", l).replace("{n}", String(s.missing))}
                </p>
              </div>
            );
          })}
        </div>

        <button
          className="flex items-center gap-1 mt-3 text-[8px] px-2 py-1 transition-colors"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Users size={10} />
          {t("compliance.consent.view_fans", l)}
        </button>
      </div>
    </div>
  );
}
