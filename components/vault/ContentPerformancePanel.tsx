"use client";

import { Send, DollarSign, BarChart3, TrendingUp, Clock } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ContentAsset } from "@/lib/mock/content-vault";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface ContentPerformancePanelProps {
  asset: ContentAsset;
}

function daysSince(dateStr: string): number {
  return Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export function ContentPerformancePanel({ asset }: ContentPerformancePanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  const hasData = asset.revenueGenerated > 0 || asset.sentToFansCount > 0 || asset.soldCount > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <BarChart3 size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("content_vault.overview.no_data", l)}
        </p>
      </div>
    );
  }

  const lastUsedLabel = asset.lastUsedAt
    ? `${t("content_vault.overview.last_used", l)}: il y a ${daysSince(asset.lastUsedAt)}j`
    : t("content_vault.overview.never_used", l);

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-2">
        <KPIBox
          icon={<Send size={13} />}
          label={t("content_vault.overview.sent", l)}
          value={asset.sentToFansCount.toString()}
          color="#3B82F6"
        />
        <KPIBox
          icon={<DollarSign size={13} />}
          label={t("content_vault.overview.sold", l)}
          value={asset.soldCount.toString()}
          color="var(--success)"
        />
        <KPIBox
          icon={<TrendingUp size={13} />}
          label={t("content_vault.overview.revenue", l)}
          value={`${asset.revenueGenerated}€`}
          color="var(--accent)"
        />
        <KPIBox
          icon={<BarChart3 size={13} />}
          label={t("content_vault.overview.avg_price", l)}
          value={asset.averagePrice > 0 ? `${asset.averagePrice}€` : "—"}
          color="#8B5CF6"
        />
      </div>

      {/* Score bars */}
      <div className="space-y-2.5">
        <ScoreBar
          label={t("content_vault.overview.perf_score", l)}
          value={asset.performanceScore}
          color={asset.performanceScore >= 70 ? "var(--success)" : asset.performanceScore >= 40 ? "#F59E0B" : "var(--danger)"}
        />
        <ScoreBar
          label={t("content_vault.overview.fatigue_score", l)}
          value={asset.fatigueScore}
          color={asset.fatigueScore >= 60 ? "var(--danger)" : asset.fatigueScore >= 30 ? "#F59E0B" : "var(--success)"}
        />
        <ScoreBar
          label={t("content_vault.overview.duplicate_risk", l)}
          value={asset.duplicateRisk}
          color={asset.duplicateRisk >= 30 ? "var(--danger)" : asset.duplicateRisk >= 15 ? "#F59E0B" : "var(--success)"}
        />
      </div>

      {/* Meta */}
      <div
        className="px-3 py-2 rounded-sm text-[10px] space-y-1"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2">
          <Clock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{lastUsedLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            {t("content_vault.overview.created", l)}: {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function KPIBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div
      className="px-3 py-2.5 rounded-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center gap-1.5 mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
        {icon}
        <span className="text-[8px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[14px] font-display font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
        <span className="text-[9px] font-medium" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        <div
          className="h-full rounded-sm transition-all duration-300"
          style={{ width: `${Math.max(2, value)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
