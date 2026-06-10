"use client";

import { FlaskConical, TrendingUp, BarChart3 } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { PPVABVariant } from "@/lib/mock/atlas-ppv";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface PPVABTestPanelProps {
  variants: PPVABVariant[];
  hasSelection: boolean;
}

const VARIANT_COLORS: Record<string, string> = {
  A: "#3B82F6",
  B: "var(--accent)",
  C: "#8B5CF6",
};

const VARIANT_BG: Record<string, string> = {
  A: "rgba(59,130,246,0.08)",
  B: "rgba(199,91,57,0.08)",
  C: "rgba(139,92,246,0.08)",
};

export function PPVABTestPanel({ variants, hasSelection }: PPVABTestPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (!hasSelection || variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <FlaskConical size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("ppv_pricing.abtest.no_config", l)}
        </p>
      </div>
    );
  }

  const bestVariant = variants.reduce((best, v) => (v.totalRevenue > best.totalRevenue ? v : best), variants[0]);
  const maxRevenue = Math.max(...variants.map((v) => v.totalRevenue));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FlaskConical size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("ppv_pricing.abtest.title", l)}
        </span>
        {bestVariant && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}>
            Meilleur: Variante {bestVariant.id}
          </span>
        )}
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {variants.map((v) => {
          const color = VARIANT_COLORS[v.id];
          const bg = VARIANT_BG[v.id];
          const pct = maxRevenue > 0 ? (v.totalRevenue / maxRevenue) * 100 : 0;
          const isBest = v.id === bestVariant?.id;

          return (
            <div
              key={v.id}
              className="p-3 rounded-sm"
              style={{
                backgroundColor: bg,
                border: `1px solid ${isBest ? `${color}40` : `${color}15`}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold" style={{ color }}>
                  Variante {v.id}
                </span>
                {isBest && <TrendingUp size={13} style={{ color: "var(--success)" }} />}
              </div>

              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t(v.labelKey, l)}
              </p>
              <p className="text-xl font-display font-bold my-1" style={{ color }}>
                {v.price}€
              </p>

              <div className="space-y-1.5 mt-3">
                <div className="flex justify-between">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t("ppv_pricing.abtest.total_revenue", l)}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--success)" }}>
                    {v.totalRevenue}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t("ppv_pricing.abtest.conversion", l)}
                  </span>
                  <span className="text-[10px]" style={{ color: "#3B82F6" }}>
                    {v.estimatedConversion}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t("ppv_pricing.reco.fan_list", l)}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {v.fanCount}
                  </span>
                </div>
              </div>

              {/* Revenue bar */}
              <div className="mt-3 h-1.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribution slider info */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-sm"
        style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("ppv_pricing.abtest.distribution", l)}
        </span>
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          33% / 33% / 33%
        </span>
      </div>
    </div>
  );
}
