"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { FanIntel } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface FanScoreBreakdownProps {
  fan: FanIntel;
}

type ScoreSection = {
  key: string;
  labelKey: string;
  max: number;
  value: number;
};

export function FanScoreBreakdown({ fan }: FanScoreBreakdownProps) {
  const locale = useLocale();
  const l = norm(locale);

  // Derive score values from fan data
  const totalSpentScore = Math.min(15, fan.totalSpend > 5000 ? 15 : fan.totalSpend > 1000 ? 12 : fan.totalSpend > 500 ? 8 : fan.totalSpend > 100 ? 5 : fan.totalSpend > 0 ? 2 : 0);
  const purchaseCountScore = Math.min(10, fan.purchasedContentIds.length > 10 ? 10 : fan.purchasedContentIds.length > 5 ? 7 : fan.purchasedContentIds.length > 2 ? 5 : fan.purchasedContentIds.length > 0 ? 3 : 0);
  const lastPurchaseScore = fan.lastPurchase ? (new Date(fan.lastPurchase).getTime() > Date.now() - 7 * 86400000 ? 10 : new Date(fan.lastPurchase).getTime() > Date.now() - 30 * 86400000 ? 7 : new Date(fan.lastPurchase).getTime() > Date.now() - 90 * 86400000 ? 4 : 1) : 0;
  const aovScore = fan.averageOrderValue > 100 ? 5 : fan.averageOrderValue > 50 ? 3 : fan.averageOrderValue > 20 ? 1 : 0;
  const purchasesScore = totalSpentScore + purchaseCountScore + lastPurchaseScore + aovScore;

  const recentActivityScore = fan.lastMessage ? (new Date(fan.lastMessage).getTime() > Date.now() - 3 * 86400000 ? 10 : new Date(fan.lastMessage).getTime() > Date.now() - 7 * 86400000 ? 7 : new Date(fan.lastMessage).getTime() > Date.now() - 30 * 86400000 ? 3 : 0) : 0;
  const engagementScore = recentActivityScore + Math.min(10, Math.round((fan.relationshipScore / 100) * 10)) + 5;

  const loyaltyScore = Math.min(20, Math.round((fan.relationshipScore / 100) * 10) + (fan.subscriptionStatus === "active" ? 8 : fan.subscriptionStatus === "expired" ? 3 : 0));

  const signalsScore = Math.min(10, fan.tags.includes("vip") ? 10 : fan.tags.includes("high-potential") ? 7 : fan.tags.includes("ppv-buyer") ? 5 : 3);

  const totalScore = purchasesScore + engagementScore + loyaltyScore + signalsScore;

  const sections: ScoreSection[] = [
    { key: "purchases", labelKey: "fan_intel.scores.purchases", max: 40, value: purchasesScore },
    { key: "engagement", labelKey: "fan_intel.scores.engagement", max: 30, value: engagementScore },
    { key: "loyalty", labelKey: "fan_intel.scores.loyalty", max: 20, value: loyaltyScore },
    { key: "signals", labelKey: "fan_intel.scores.signals", max: 10, value: signalsScore },
  ];

  return (
    <div className="p-4 space-y-5">
      {/* Total score */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
          {t("fan_intel.scores.total", l)}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>
            {totalScore}
          </span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>/100</span>
        </div>
      </div>

      {/* Score sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const pct = (section.value / section.max) * 100;
          const barColor =
            pct >= 80 ? "var(--success)" : pct >= 50 ? "#F59E0B" : "var(--color-accent, var(--or, #D8A95B))";

          return (
            <div key={section.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t(section.labelKey, l)}
                </span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {section.value}/{section.max}
                </span>
              </div>
              <div className="h-1.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-scores detail */}
      <div className="pt-3 space-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          Détail
        </p>
        <ScoreRow label="Total dépensé" value={totalSpentScore} max={15} />
        <ScoreRow label="Nombre d'achats" value={purchaseCountScore} max={10} />
        <ScoreRow label="Récence achat" value={lastPurchaseScore} max={10} />
        <ScoreRow label="Panier moyen" value={aovScore} max={5} />
        <ScoreRow label="Activité récente" value={recentActivityScore} max={15} />
        <ScoreRow label="Multi-canal" value={Math.min(5, fan.platform ? 3 : 1)} max={5} />
        <ScoreRow label="Fidélité" value={loyaltyScore} max={20} />
        <ScoreRow label="Signaux positifs" value={signalsScore} max={10} />
      </div>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        {label}
      </span>
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
        {value}/{max}
      </span>
    </div>
  );
}
