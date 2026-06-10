"use client";

import { useState, useMemo } from "react";
import { DEMO_LEGAL, COMMISSION_TIERS, calculateCommission } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { ShieldCheck, AlertTriangle, DollarSign, ArrowRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const severityColors = ["var(--success)", "#F59E0B", "var(--danger)"];

export function DemoProtectionStep({ persona }: { persona: string }) {
  const locale = useLocale();
  const l = norm(locale);

  const [revenue, setRevenue] = useState(15000);
  const [showTooltip, setShowTooltip] = useState(false);

  const commission = useMemo(() => calculateCommission(revenue), [revenue]);
  const savings = Math.round(revenue * 0.5 - commission.totalCommission);
  const riskPct = Math.round((DEMO_LEGAL.score / DEMO_LEGAL.maxScore) * 100);

  const handleAnalyze = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  };

  return (
    <div className="animate-fade-in space-y-4 max-w-2xl mx-auto">
      {/* Bouclier Légal */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          <ShieldCheck size={14} style={{ color: "var(--accent)" }} />
          Bouclier Légal
        </h3>

        {/* Risk score */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="var(--danger)" strokeWidth="3" strokeDasharray="97.4"
                strokeDashoffset={97.4 - (97.4 * riskPct) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-bold" style={{ color: "var(--danger)" }}>{DEMO_LEGAL.score}</span>
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
              {t("demo_new.protection.score", l).replace("{n}", String(DEMO_LEGAL.score)).replace("{max}", String(DEMO_LEGAL.maxScore))}
            </p>
            <p className="text-[9px]" style={{ color: "var(--danger)" }}>
              {t("demo_new.protection.level", l).replace("{level}", "Élevé")}
            </p>
          </div>
        </div>

        {/* Clauses */}
        <div className="space-y-1 mb-3">
          {DEMO_LEGAL.clauses.map((clause) => (
            <div
              key={clause.label}
              className="flex items-center justify-between p-1.5 text-[9px]"
              style={{ backgroundColor: "rgba(229,72,77,0.04)" }}
            >
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={9} style={{ color: "var(--danger)" }} />
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{clause.label}</span>
              </div>
              <span style={{ color: severityColors[clause.severity >= 4 ? 2 : clause.severity >= 3 ? 1 : 0] }}>
                {t("demo_new.protection.clause_severity", l).replace("{n}", String(clause.severity))}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          className="text-[10px] px-3 py-1.5 transition-all"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {t("demo_new.protection.analyze", l)} →
        </button>
      </div>

      {/* Commission Simulator */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          <DollarSign size={14} style={{ color: "var(--success)" }} />
          Commission Simulator
        </h3>

        {/* Slider */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("demo_new.commission.slider_label", l)}
            </span>
            <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>{revenue.toLocaleString()}€</span>
          </div>
          <input
            type="range"
            min={2000}
            max={150000}
            step={1000}
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--success)" }}
          />
        </div>

        {/* Tiers breakdown */}
        <div className="space-y-1 mb-3">
          <div className="flex text-[8px] font-medium px-1 pb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span className="flex-1">{t("demo_new.commission.tier", l).replace("{label}", "")}</span>
            <span className="w-16 text-right">{t("demo_new.commission.amount", l)}</span>
            <span className="w-12 text-right">{t("demo_new.commission.rate", l)}</span>
            <span className="w-16 text-right">{t("demo_new.commission.commission", l)}</span>
          </div>
          {commission.tiers.filter((t) => t.amount > 0).map((tier) => {
            const tierDef = COMMISSION_TIERS.find((ct) => ct.label === tier.label)!;
            return (
              <div key={tier.label} className="flex items-center text-[9px] px-1 py-0.5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <span className="flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>{tier.label}</span>
                <span className="w-16 text-right" style={{ color: "rgba(255,255,255,0.5)" }}>{tier.amount}€</span>
                <span className="w-12 text-right" style={{ color: "var(--accent)" }}>{tierDef.rate}%</span>
                <span className="w-16 text-right" style={{ color: "rgba(255,255,255,0.7)" }}>{tier.commission}€</span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="pt-2 border-t space-y-0.5" style={{ borderColor: "var(--border-default)" }}>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{t("demo_new.commission.total", l).replace("{n}", "")}</span>
            <span className="font-medium" style={{ color: "var(--accent)" }}>{commission.totalCommission}€</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{t("demo_new.commission.effective", l).replace("{n}", "")}</span>
            <span className="font-medium" style={{ color: "var(--success)" }}>{commission.effectiveRate}%</span>
          </div>
          <p className="text-[8px] mt-1" style={{ color: "var(--success)" }}>
            {t("demo_new.commission.effective_desc", l)}
          </p>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{t("demo_new.commission.savings", l).replace("{n}", "")}</span>
            <span className="font-medium" style={{ color: "var(--success)" }}>{savings.toLocaleString()}€</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="p-2 text-[9px] text-center transition-opacity"
          style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          💡 {t("demo_new.protection.tooltip", l)}
        </div>
      )}
    </div>
  );
}
