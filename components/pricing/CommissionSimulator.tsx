"use client";

import { useState, useMemo, useCallback } from "react";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";

/* ─── Types ─── */

interface BracketDetail {
  min: number;
  max: number;
  rate: number;
  label: string;
  taxable: number;
  commission: number;
}

interface MarginalResult {
  details: BracketDetail[];
  total: number;
  effectiveRate: number;
}

/* ─── Color palette for brackets ─── */

const BRACKET_COLORS = [
  { bar: "var(--success)", text: "var(--success)", light: "rgba(16,185,129,0.12)" },
  { bar: "#34D399", text: "#34D399", light: "rgba(52,211,153,0.12)" },
  { bar: "#F59E0B", text: "#F59E0B", light: "rgba(245,158,11,0.12)" },
  { bar: "var(--or, #D8A95B)", text: "var(--or, #D8A95B)", light: "rgba(249,115,22,0.12)" },
  { bar: "#EF4444", text: "#EF4444", light: "rgba(239,68,68,0.12)" },
];

const BRACKET_DEFS = [
  { min: 0, max: 5_000, rate: 0.30, label: "0 – 5 000€" },
  { min: 5_000, max: 20_000, rate: 0.25, label: "5 000 – 20 000€" },
  { min: 20_000, max: 50_000, rate: 0.20, label: "20 000 – 50 000€" },
  { min: 50_000, max: 150_000, rate: 0.15, label: "50 000 – 150 000€" },
  { min: 150_000, max: Infinity, rate: 0.10, label: "150 000€ +" },
];

/* ─── Calculation engine ─── */

function calculateMarginal(revenue: number): MarginalResult {
  let remaining = revenue;
  let total = 0;
  const details: BracketDetail[] = [];

  for (const b of BRACKET_DEFS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, b.max - b.min);
    if (taxable <= 0) continue;
    const commission = taxable * b.rate;
    total += commission;
    details.push({ ...b, taxable, commission });
    remaining -= taxable;
  }

  return { details, total, effectiveRate: revenue > 0 ? (total / revenue) * 100 : 0 };
}

/* ─── Animated number display ─── */

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  // Simple display with locale formatting, the value updates trigger re-render naturally
  return (
    <span className="tabular-nums">
      {value.toLocaleString("fr-FR")}{suffix}
    </span>
  );
}

/* ─── Component ─── */

export function CommissionSimulator() {
  const [revenue, setRevenue] = useState(25_000);
  const [inputValue, setInputValue] = useState("25 000");

  const halo = useMemo(() => calculateMarginal(revenue), [revenue]);
  const traditional = revenue * 0.50;
  const savings = traditional - halo.total;
  const remainder = revenue - halo.total;

  /* ─── Slider change ─── */
  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setRevenue(v);
    setInputValue(v.toLocaleString("fr-FR"));
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/€/g, "");
    setInputValue(e.target.value);
    const num = Number(raw);
    if (!isNaN(num) && num >= 0 && num <= 500_000) {
      setRevenue(num);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputValue(revenue.toLocaleString("fr-FR"));
  }, [revenue]);

  /* ─── Projection data (12 months, 10% growth) ─── */
  const projection = useMemo(() => {
    const months: { month: number; revenue: number; effectiveRate: number }[] = [];
    let rev = revenue;
    for (let m = 1; m <= 12; m++) {
      rev = Math.round(rev * 1.10);
      const result = calculateMarginal(rev);
      months.push({ month: m, revenue: rev, effectiveRate: result.effectiveRate });
    }
    return months;
  }, [revenue]);

  const maxProjectionRate = Math.max(...projection.map((p) => p.effectiveRate), 1);
  const minProjectionRate = Math.min(...projection.map((p) => p.effectiveRate));
  const range = maxProjectionRate - minProjectionRate || 1;

  /* ─── Stacked bar max width for proportional rendering ─── */
  const maxBracketTaxable = Math.max(...halo.details.map((d) => d.taxable), 1);

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--accent-soft)" }}
        >
          <Calculator size={16} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Simulez votre commission WTF
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Système marginal : plus vous grandissez, moins vous payez.
          </p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* ─── Input ─── */}
        <div>
          <label className="text-[11px] font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
            Vos revenus mensuels estimés
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={200_000}
              step={500}
              value={revenue}
              onChange={handleSlider}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: "var(--accent)",
                backgroundColor: "var(--border-default)",
              }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={handleInput}
              onBlur={handleInputBlur}
              className="w-28 px-3 py-2 text-sm font-semibold tabular-nums text-right rounded-lg outline-none"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] mt-1 px-0.5" style={{ color: "var(--text-tertiary)" }}>
            <span>0 €</span>
            <span>50 000 €</span>
            <span>100 000 €</span>
            <span>200 000 €</span>
          </div>
        </div>

        {/* ─── Stacked Bar ─── */}
        {halo.details.length > 0 && (
          <div>
            <p className="text-[10px] font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
              Répartition par tranche
            </p>
            <div className="flex h-8 rounded-lg overflow-hidden">
              {halo.details.map((d, i) => {
                const pct = (d.taxable / revenue) * 100;
                return (
                  <div
                    key={d.label}
                    className="flex items-center justify-center text-[9px] font-semibold transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: BRACKET_COLORS[i].bar,
                      color: d.taxable > revenue * 0.05 ? "#fff" : "transparent",
                    }}
                    title={`${d.label} : ${d.rate * 100}%`}
                  >
                    {pct > 8 && `${d.rate * 100}%`}
                  </div>
                );
              })}
            </div>
            {/* Bracket legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {halo.details.map((d, i) => (
                <div key={d.label} className="flex items-center gap-1.5 text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: BRACKET_COLORS[i].bar }}
                  />
                  <span>
                    {d.label} : {(d.rate * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Bracket details horizontal bars ─── */}
        <div className="space-y-2">
          {halo.details.map((d, i) => {
            const widthPct = (d.taxable / maxBracketTaxable) * 100;
            return (
              <div key={d.label}>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {d.label}
                  </span>
                  <span className="font-semibold" style={{ color: BRACKET_COLORS[i].text }}>
                    {d.rate * 100}%
                  </span>
                </div>
                <div className="h-5 rounded-md overflow-hidden relative" style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: `${Math.max(widthPct, 2)}%`,
                      backgroundColor: BRACKET_COLORS[i].light,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px]">
                    <span style={{ color: "var(--text-secondary)" }}>
                      {d.taxable.toLocaleString("fr-FR")} €
                    </span>
                    <span className="font-medium" style={{ color: BRACKET_COLORS[i].text }}>
                      {d.commission.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Results ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultCard
            label="Commission WTF"
            value={halo.total}
            suffix=" €"
            color="var(--accent)"
          />
          <ResultCard
            label="Taux effectif"
            value={halo.effectiveRate}
            suffix="%"
            color="var(--text-primary)"
            decimals={1}
          />
          <ResultCard
            label="Il vous reste"
            value={remainder}
            suffix=" €"
            color="var(--success)"
          />
        </div>

        {/* ─── Comparison with traditional agency ─── */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <p className="text-[10px] font-semibold mb-3" style={{ color: "var(--success)" }}>
            Comparaison avec une agence classique à 50%
          </p>

          {/* Comparative bars */}
          <div className="space-y-2 mb-3">
            <ComparisonBar
              label="Agence classique (50%)"
              amount={traditional}
              color="rgba(239,68,68,0.6)"
              maxVal={Math.max(traditional, halo.total)}
            />
            <ComparisonBar
              label="Where Talent Forms"
              amount={halo.total}
              color="var(--accent)"
              maxVal={Math.max(traditional, halo.total)}
            />
          </div>

          {/* Savings */}
          <div className="text-center">
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Vous économisez{" "}
            </span>
            <span className="text-lg font-bold tabular-nums" style={{ color: "var(--success)" }}>
              <AnimatedNumber value={savings} /> €
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {" "}/ mois
            </span>
            <div className="text-[10px] mt-0.5" style={{ color: "var(--success)" }}>
              Soit <span className="font-bold tabular-nums">{(savings * 12).toLocaleString("fr-FR")} €</span> / an
            </div>
          </div>
        </div>

        {/* ─── Projection ─── */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={12} style={{ color: "var(--text-tertiary)" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
              Projection à 12 mois (croissance +10%/mois)
            </span>
          </div>

          <div className="h-24 flex items-end gap-[2px]">
            {projection.map((p) => {
              const heightPct = ((p.effectiveRate - minProjectionRate) / range) * 100;
              return (
                <div
                  key={p.month}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${Math.max(heightPct, 3)}%`,
                      backgroundColor:
                        p.effectiveRate < 20
                          ? "var(--success)"
                          : p.effectiveRate < 25
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                    title={`Mois ${p.month} : ${p.effectiveRate.toFixed(1)}%`}
                  />
                  {p.month % 3 === 0 && (
                    <span className="text-[7px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                      M{p.month}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[8px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            <span>Taux effectif : {projection[0].effectiveRate.toFixed(1)}%</span>
            <span>→</span>
            <span>{projection[11].effectiveRate.toFixed(1)}% après 12 mois</span>
          </div>
        </div>

        {/* ─── Disclaimer ─── */}
        <p className="text-[9px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          Les commissions s'appliquent par tranche (système marginal), pas sur le revenu total.
          Contrat résiliable sous 30 jours sans pénalité. Simulation indicative.
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function ResultCard({
  label,
  value,
  suffix,
  color,
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  decimals?: number;
}) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <p className="text-[9px] font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      <p className="text-sm font-bold tabular-nums" style={{ color }}>
        {value.toLocaleString("fr-FR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </p>
    </div>
  );
}

function ComparisonBar({
  label,
  amount,
  color,
  maxVal,
}: {
  label: string;
  amount: number;
  color: string;
  maxVal: number;
}) {
  const pct = (amount / maxVal) * 100;
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-semibold tabular-nums" style={{ color }}>
          {amount.toLocaleString("fr-FR")} €
        </span>
      </div>
      <div className="h-5 rounded-md overflow-hidden" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div
          className="h-full rounded-md transition-all duration-500"
          style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
