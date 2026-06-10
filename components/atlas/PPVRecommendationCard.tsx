"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info, TrendingUp, DollarSign, Clock, MessageCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { PPVProduct, PPVRecommendation } from "@/lib/mock/atlas-ppv";
import { formatCurrency } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface PPVRecommendationCardProps {
  product: PPVProduct | null;
  selectedSegmentName: string | null;
  recommendations: PPVRecommendation[];
  customPrice: number | null;
  onPriceChange: (price: number) => void;
}

export function PPVRecommendationCard({
  product,
  selectedSegmentName,
  recommendations,
  customPrice,
  onPriceChange,
}: PPVRecommendationCardProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [expandedFan, setExpandedFan] = useState<string | null>(null);

  if (!product || !selectedSegmentName) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <TrendingUp size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("ppv_pricing.reco.no_selection", l)}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
          {t("ppv_pricing.reco.no_selection_desc", l)}
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Users size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("ppv_pricing.reco.segment_empty", l)}
        </p>
      </div>
    );
  }

  const avgRec = Math.round(recommendations.reduce((s, r) => s + r.recPrice, 0) / recommendations.length);
  const totalExpected = recommendations.reduce((s, r) => s + r.expectedRevenue, 0);
  const displayPrice = customPrice ?? avgRec;

  return (
    <div className="flex flex-col h-full">
      {/* Price slider section */}
      <div className="shrink-0 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t("ppv_pricing.reco.price_slider", l)}
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{t("ppv_pricing.reco.min", l)}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{recommendations[0].minPrice}€</p>
            </div>
            <div className="text-right">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{t("ppv_pricing.reco.recommended", l)}</p>
              <p className="text-[13px] font-bold" style={{ color: "var(--accent)" }}>{displayPrice}€</p>
            </div>
            <div className="text-right">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{t("ppv_pricing.reco.max", l)}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{recommendations[0].maxPrice}€</p>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={recommendations[0].minPrice}
            max={recommendations[0].maxPrice}
            step={1}
            value={displayPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-1 appearance-none cursor-pointer rounded-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              accentColor: "var(--accent)",
            }}
          />
          {/* Marker dots */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-[2px] pointer-events-none" style={{ top: "-3px" }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <MetricBox
            label={t("ppv_pricing.reco.expected_revenue", l)}
            value={`€${totalExpected.toFixed(0)}`}
            color="var(--success)"
          />
          <MetricBox
            label={t("ppv_pricing.reco.estimated_conversion", l)}
            value={`${Math.round(recommendations.reduce((s, r) => s + r.estimatedConversion, 0) / recommendations.length)}%`}
            color="#3B82F6"
          />
          <MetricBox
            label={t("ppv_pricing.reco.confidence_score", l)}
            value={`${Math.round(recommendations.reduce((s, r) => s + r.confidenceScore, 0) / recommendations.length)}%`}
            color="#8B5CF6"
          />
        </div>
      </div>

      {/* Fan list */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("ppv_pricing.reco.fan_list", l)} ({recommendations.length})
        </p>
        <div className="space-y-1.5">
          {recommendations.slice(0, 20).map((rec) => (
            <div key={rec.fanId}>
              <button
                onClick={() => setExpandedFan(expandedFan === rec.fanId ? null : rec.fanId)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-left transition-colors"
                style={{
                  backgroundColor: expandedFan === rec.fanId ? "rgba(255,255,255,0.03)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                  style={{ backgroundColor: "var(--color-accent, #C75B39)", color: "#fff" }}
                >
                  {rec.pseudonyme.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {rec.pseudonyme}
                    </span>
                    <span className="text-[8px] px-1 py-px rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
                      {rec.tier}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                    {rec.recPrice}€
                  </span>
                </div>
                <div className="text-right w-16">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    ~{rec.expectedRevenue.toFixed(1)}€
                  </span>
                </div>
                {/* Confidence bar */}
                <div className="w-8 h-1 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${rec.confidenceScore}%`,
                      backgroundColor: rec.confidenceScore >= 75 ? "var(--success)" : rec.confidenceScore >= 40 ? "#F59E0B" : "rgba(255,255,255,0.3)",
                    }}
                  />
                </div>
                {expandedFan === rec.fanId ? <ChevronUp size={12} style={{ color: "rgba(255,255,255,0.2)" }} /> : <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.2)" }} />}
              </button>

              {/* Expanded justification */}
              {expandedFan === rec.fanId && (
                <div className="px-4 py-3 space-y-2" style={{ backgroundColor: "rgba(255,255,255,0.015)" }}>
                  <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {rec.justification}
                  </p>
                  <div className="space-y-1">
                    {rec.justificationDetails.map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Info size={9} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.15)" }} />
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="px-3 py-2 rounded-sm text-center" style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <p className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
      <p className="text-[13px] font-bold mt-0.5" style={{ color }}>{value}</p>
    </div>
  );
}

function Users({ size, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
