"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { PLATFORM_HEALTH } from "@/lib/mock/studio-dashboard";
import { Globe } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const PLATFORM_LOGOS: Record<string, string> = {
  OnlyFans: "OF",
  Fansly: "F",
  Instagram: "IG",
  TikTok: "TT",
};

export function PlatformHealthWidget() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("studio_dashboard.health.title", l)}
      </h2>
      <div className="space-y-2">
        {PLATFORM_HEALTH.map((p) => {
          const isDeclining = p.numericTrend < -3;
          const isGrowing = p.numericTrend >= 0;
          const barColor = isDeclining ? "var(--danger)" : "var(--success)";
          const barWidth = Math.min(100, Math.max(5, (p.numericFollowers / 50000) * 100));

          return (
            <div
              key={p.platform}
              className="p-3 transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Platform header */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 flex items-center justify-center text-[8px] font-bold rounded-sm shrink-0"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {PLATFORM_LOGOS[p.platform]}
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {p.platform}
                </span>
                <span
                  className="text-[9px] font-medium ml-auto tabular-nums"
                  style={{ color: isDeclining ? "var(--danger)" : "var(--success)" }}
                >
                  {p.engagementTrend}
                </span>
              </div>

              {/* Followers */}
              <div className="text-[10px] mb-1.5" style={{ color: "var(--text-secondary)" }}>
                {t("studio_dashboard.health.subscriber_growth", l).replace("{n}", p.followers)}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full" style={{ backgroundColor: "var(--bg-hover)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
