"use client";

import { Globe } from "lucide-react";
import { formatEuro, sparklinePath } from "../../creators/utils";
import type { PlatformRevenueSummary } from "../types";
import { PLATFORM_COLORS } from "../types";

type Props = { summaries: PlatformRevenueSummary[] };

const platformLogos: Record<string, string> = {
  YouTube: "YT",
  Instagram: "IG",
  TikTok: "TK",
  OnlyFans: "OF",
  Twitter: "TW",
  LinkedIn: "LN",
  Twitch: "TW",
  Snapchat: "SC",
};

export function ByPlatformTab({ summaries }: Props) {
  if (summaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-sans" style={{ color: "#5A544C" }}>
          Aucune donnée plateforme pour cette période.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {summaries.map((platform) => {
        const color = PLATFORM_COLORS[platform.name] || "#5A544C";
        const path = sparklinePath(platform.monthly_history, 120, 32);
        const maxRevenue = Math.max(...platform.monthly_history, 1);

        return (
          <div
            key={platform.name}
            className="p-5 transition-colors hover:bg-white/[0.02] cursor-pointer"
            style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 flex items-center justify-center text-[11px] font-sans font-bold"
                  style={{ background: `${color}15`, color }}>
                  {platformLogos[platform.name] || platform.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-sans font-semibold" style={{ color: "#F5F0EB" }}>
                    {platform.name}
                  </p>
                  <p className="text-[10px] font-sans" style={{ color: "#5A544C" }}>
                    {platform.active_creators} créateur{platform.active_creators > 1 ? "s" : ""} actif{platform.active_creators > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-sans font-semibold" style={{ color: platform.growth_rate >= 0 ? "#7A9A65" : "#C44536" }}>
                {platform.growth_rate >= 0 ? "+" : ""}{platform.growth_rate}%
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#7A736B" }}>
                  Revenus totaux
                </p>
                <p className="font-display text-lg font-bold tabular-nums" style={{ color: "#F5F0EB" }}>
                  {formatEuro(platform.total_revenue)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#7A736B" }}>
                  Moy. par créateur
                </p>
                <p className="font-display text-lg font-bold tabular-nums" style={{ color: "#F5F0EB" }}>
                  {formatEuro(platform.avg_revenue_per_creator)}
                </p>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-8">
              <svg width="100%" height="32" viewBox="0 0 120 32" preserveAspectRatio="none">
                {platform.monthly_history.length > 0 && (
                  <>
                    <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
                    {platform.monthly_history.map((v, i) => {
                      const x = (i / (platform.monthly_history.length - 1)) * 120;
                      const y = 32 - ((v - Math.min(...platform.monthly_history)) / (maxRevenue - Math.min(...platform.monthly_history) || 1)) * 28 - 2;
                      return (
                        <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
