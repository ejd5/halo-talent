"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─── Marginal commission brackets ─── */
const BRACKETS: [number, number, number][] = [
  [0, 5_000, 0.30],
  [5_000, 20_000, 0.25],
  [20_000, 50_000, 0.20],
  [50_000, 150_000, 0.15],
  [150_000, Infinity, 0.10],
];

function calcHaloCommission(revenue: number): number {
  let total = 0;
  for (const [lo, hi, rate] of BRACKETS) {
    if (revenue <= lo) break;
    const taxable = Math.min(revenue, hi) - lo;
    total += taxable * rate;
  }
  return total;
}

function calcEffectiveRate(revenue: number): number {
  if (revenue <= 0) return 0;
  return (calcHaloCommission(revenue) / revenue) * 100;
}

function calcSaaSCost(revenue: number): number {
  if (revenue < 5_000) return 0;
  if (revenue < 20_000) return 29;
  if (revenue < 50_000) return 79;
  return 199;
}

function planName(revenue: number): string {
  if (revenue < 5_000) return "Free";
  if (revenue < 20_000) return "Creator";
  if (revenue < 50_000) return "Premium";
  return "Elite";
}

/* ─── Animated counter hook ─── */
function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    prevRef.current = to;
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return display;
}

/* ─── Format helpers ─── */
const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const fmtNum = (n: number) => n.toLocaleString("fr-FR");

/* ─── Slider component ─── */
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Math.min(max, Math.max(min, Number(e.target.value) || 0));
              onChange(v);
            }}
            className="w-20 text-right text-sm font-semibold bg-transparent border-none outline-none"
            style={{ color: "var(--accent)" }}
            min={min}
            max={max}
            step={step}
          />
          {suffix && (
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {suffix}
            </span>
          )}
        </div>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-1.5 appearance-none cursor-pointer rounded-full"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border-default) ${pct}%, var(--border-default) 100%)`,
            outline: "none",
          }}
        />
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: 2px solid var(--bg-primary);
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: 2px solid var(--bg-primary);
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

/* ─── Tool count selector ─── */
function ToolSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Nombre d&apos;outils payants
        </label>
        <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
          {value}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="flex-1 h-8 text-xs font-medium rounded-sm transition-all duration-150"
            style={{
              backgroundColor: i === value ? "var(--accent)" : "var(--bg-hover)",
              color: i === value ? "var(--accent-text, #fff)" : "var(--text-secondary)",
            }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CalculatorSection() {
  const [revenue, setRevenue] = useState(20_000);
  const [commissionPct, setCommissionPct] = useState(50);
  const [toolCount, setToolCount] = useState(5);
  const [avgToolCost, setAvgToolCost] = useState(80);

  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Current situation ──
  const agencyCommission = revenue * (commissionPct / 100);
  const toolCost = toolCount * avgToolCost;
  const currentTotal = agencyCommission + toolCost;
  const currentRemaining = revenue - currentTotal;

  // ── Halo situation ──
  const haloCommission = calcHaloCommission(revenue);
  const effectiveRate = calcEffectiveRate(revenue);
  const saasCost = calcSaaSCost(revenue);
  const saasLabel = planName(revenue);
  const haloTotal = haloCommission + saasCost;
  const haloRemaining = revenue - haloTotal;

  // ── Savings ──
  const monthlySavings = currentTotal - haloTotal;
  const yearlySavings = monthlySavings * 12;
  const savesMoney = monthlySavings > 0;

  // ── Animated values ──
  const animAgencyCommission = useCountUp(agencyCommission);
  const animToolCost = useCountUp(toolCost);
  const animCurrentTotal = useCountUp(currentTotal);
  const animCurrentRemaining = useCountUp(currentRemaining);

  const animHaloCommission = useCountUp(haloCommission);
  const animSaaSCost = useCountUp(saasCost);
  const animHaloTotal = useCountUp(haloTotal);
  const animHaloRemaining = useCountUp(haloRemaining);

  const animMonthlySavings = useCountUp(monthlySavings);
  const animYearlySavings = useCountUp(yearlySavings);

  const maxTotal = Math.max(currentTotal, haloTotal, 1);

  return (
    <section
      ref={ref}
      id="calculator"
      className="scroll-mt-24 py-24 md:py-36"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Title + subtitle */}
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2
            className="font-display font-bold text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-[1.15] tracking-[-0.02em]"
            style={{ color: "var(--text-primary)" }}
          >
            Calculez vos économies
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Comparez le coût réel de votre setup actuel avec Halo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* ─── LEFT: Inputs ─── */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="p-6 md:p-8"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <h3
                className="text-sm font-semibold uppercase tracking-[0.08em] mb-6"
                style={{ color: "var(--text-tertiary)" }}
              >
                Vos paramètres
              </h3>

              <Slider
                label="Vos revenus mensuels"
                value={revenue}
                onChange={setRevenue}
                min={0}
                max={100_000}
                step={1_000}
                suffix="€"
              />

              <Slider
                label="Commission actuelle de votre agence"
                value={commissionPct}
                onChange={setCommissionPct}
                min={0}
                max={70}
                step={1}
                suffix="%"
              />

              <ToolSelector value={toolCount} onChange={setToolCount} />

              <Slider
                label="Coût moyen mensuel par outil"
                value={avgToolCost}
                onChange={setAvgToolCost}
                min={0}
                max={200}
                step={5}
                suffix="€"
              />
            </div>
          </div>

          {/* ─── RIGHT: Results ─── */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transitionDelay: "150ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Current situation card */}
            <div
              className="p-6 md:p-8 mb-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <h3
                className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] mb-5"
                style={{ color: "var(--danger)" }}
              >
                Votre situation actuelle
              </h3>

              <div className="space-y-3">
                <LineItem
                  label="Commission agence"
                  value={animAgencyCommission}
                  pct={commissionPct}
                />
                <LineItem
                  label="Outils"
                  value={animToolCost}
                  sub={`${toolCount} outils × ${fmtNum(avgToolCost)}€`}
                />
                <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--border-default)" }}>
                  <LineItem label="Total prélevé" value={animCurrentTotal} bold />
                </div>
                <LineItem
                  label="Il vous reste"
                  value={animCurrentRemaining}
                  bold
                  color="var(--danger)"
                />
              </div>
            </div>

            {/* Halo card */}
            <div
              className="p-6 md:p-8 mb-4"
              style={{
                backgroundColor: "var(--accent-soft)",
                border: "1px solid var(--accent)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <h3
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--accent)" }}
                >
                  Avec Halo
                </h3>
                <span
                  className="text-[0.55rem] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-sm"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
                >
                  Recommandé
                </span>
              </div>

              <div className="space-y-3">
                <LineItem
                  label="Commission Halo"
                  value={animHaloCommission}
                  pct={effectiveRate}
                  color="var(--accent)"
                />
                <LineItem
                  label={`Plan SaaS — ${saasLabel}`}
                  value={animSaaSCost}
                  color="var(--accent)"
                />
                <div className="border-t pt-3 mt-3" style={{ borderColor: "var(--accent-border, var(--border-default))" }}>
                  <LineItem label="Total prélevé" value={animHaloTotal} bold color="var(--accent)" />
                </div>
                <LineItem
                  label="Il vous reste"
                  value={animHaloRemaining}
                  bold
                  color="var(--success)"
                />
              </div>
            </div>

            {/* Savings highlight */}
            <div
              className="p-6 md:p-8 text-center transition-all duration-500"
              style={{
                backgroundColor: savesMoney ? "var(--success-bg)" : "var(--bg-card)",
                border: `1px solid ${savesMoney ? "var(--success)" : "var(--border-default)"}`,
              }}
            >
              {savesMoney && (
                <span className="text-2xl mb-2 block">🎉</span>
              )}
              <p className="text-lg font-bold" style={{ color: savesMoney ? "var(--success)" : "var(--text-primary)" }}>
                Vous économisez <AnimatedNumber value={animMonthlySavings} /> /mois
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Soit <AnimatedNumber value={animYearlySavings} /> /an
              </p>

              {/* Progress bar comparison */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-[0.65rem] font-medium">
                  <span style={{ color: "var(--text-tertiary)" }}>Actuel</span>
                  <span style={{ color: "var(--text-tertiary)" }}>{fmt(animCurrentTotal)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-hover)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentTotal / maxTotal) * 100}%`,
                      backgroundColor: "var(--danger)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[0.65rem] font-medium mt-2">
                  <span style={{ color: "var(--text-tertiary)" }}>Halo</span>
                  <span style={{ color: "var(--text-tertiary)" }}>{fmt(animHaloTotal)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-hover)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(haloTotal / maxTotal) * 100}%`,
                      backgroundColor: "var(--success)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-[0.75rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
              >
                Commencer gratuitement
              </Link>
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-[0.75rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                Télécharger le calcul en PDF
              </button>
            </div>

            {/* Disclaimer */}
            <p
              className="text-[0.6rem] mt-4 text-center"
              style={{ color: "var(--text-tertiary)" }}
            >
              Estimation indicative basée sur notre grille tarifaire publique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function LineItem({
  label,
  value,
  pct,
  sub,
  bold,
  color,
}: {
  label: string;
  value: number;
  pct?: number;
  sub?: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span
          className={`text-sm ${bold ? "font-semibold" : ""}`}
          style={{ color: color || "var(--text-secondary)" }}
        >
          {label}
        </span>
        {pct !== undefined && (
          <span className="text-[0.6rem] ml-1.5" style={{ color: "var(--text-tertiary)" }}>
            ({pct.toFixed(1)}%)
          </span>
        )}
        {sub && (
          <span className="block text-[0.6rem]" style={{ color: "var(--text-tertiary)" }}>
            {sub}
          </span>
        )}
      </div>
      <span
        className={`text-sm tabular-nums ${bold ? "font-bold" : "font-semibold"}`}
        style={{ color: color || "var(--text-primary)" }}
      >
        <AnimatedNumber value={value} />
      </span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return <span>{fmt(value)}</span>;
}
