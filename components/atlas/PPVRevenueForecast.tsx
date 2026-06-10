"use client";

import { BarChart3, TrendingUp, Target, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { PPVRevenueForecast } from "@/lib/mock/atlas-ppv";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface PPVRevenueForecastProps {
  forecast: PPVRevenueForecast;
  hasSelection: boolean;
}

const VARIANT_COLORS: Record<string, string> = {
  A: "#3B82F6",
  B: "var(--accent)",
  C: "#8B5CF6",
};

export function PPVRevenueForecast({ forecast, hasSelection }: PPVRevenueForecastProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (!hasSelection || forecast.variantBreakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <BarChart3 size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("ppv_pricing.forecast.no_data", l)}
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...forecast.variantBreakdown.map((v) => v.totalRevenue));

  return (
    <div className="p-4 space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPIBox
          icon={<TrendingUp size={14} />}
          label={t("ppv_pricing.forecast.total_revenue", l)}
          value={`€${forecast.totalRevenue.toLocaleString()}`}
          color="var(--success)"
        />
        <KPIBox
          icon={<Target size={14} />}
          label={t("ppv_pricing.forecast.best_variant", l)}
          value={forecast.bestVariant ? `Variante ${forecast.bestVariant}` : "—"}
          color="var(--accent)"
        />
        <KPIBox
          icon={<Users size={14} />}
          label={t("ppv_pricing.forecast.targeted_fans", l)}
          value={forecast.targetedFans.toString()}
          color="#3B82F6"
        />
        <KPIBox
          icon={<BarChart3 size={14} />}
          label={t("ppv_pricing.forecast.confidence_interval", l)}
          value={forecast.confidenceInterval}
          color="#8B5CF6"
        />
      </div>

      {/* Bar chart */}
      <div>
        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("ppv_pricing.abtest.title", l)}
        </p>
        <div className="space-y-2.5">
          {forecast.variantBreakdown.map((v) => {
            const pct = maxRevenue > 0 ? (v.totalRevenue / maxRevenue) * 100 : 0;
            const color = VARIANT_COLORS[v.id];

            return (
              <div key={v.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                      Variante {v.id}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {v.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {v.estimatedConversion}%
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "var(--success)" }}>
                      {v.totalRevenue}€
                    </span>
                  </div>
                </div>
                <div className="h-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{ width: `${Math.max(4, pct)}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional metrics */}
      <div
        className="px-3 py-2.5 rounded-sm text-[10px]"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center justify-between">
          <span style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("ppv_pricing.reco.estimated_conversion", l)} moyen
          </span>
          <span style={{ color: "var(--text-primary)" }}>{forecast.avgConversion}%</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("ppv_pricing.reco.confidence_score", l)} moyen
          </span>
          <span style={{ color: "var(--text-primary)" }}>{forecast.avgConfidence}%</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("ppv_pricing.forecast.confidence_interval", l)}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{forecast.confidenceInterval}</span>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[9px] text-center" style={{ color: "rgba(255,255,255,0.1)" }}>
        {t("ppv_pricing.guardrails.false_promises", l)}
      </p>
    </div>
  );
}

function KPIBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
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
