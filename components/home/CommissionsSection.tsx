"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* ─── Data ─── */
const tiers = [
  { name: "Découverte", range: "0 — 5 000€", pct: 30, barPct: 100 },
  { name: "Croissance", range: "5 000 — 20 000€", pct: 25, barPct: 83 },
  { name: "Scale", range: "20 000 — 50 000€", pct: 20, barPct: 67 },
  { name: "Elite", range: "50 000 — 150 000€", pct: 15, barPct: 50 },
  { name: "Icon", range: "150 000€+", pct: 10, barPct: 33 },
];

/* ─── Commission calculator ─── */
function calcCommission(revenue: number) {
  const brackets = [
    { limit: 5_000, rate: 0.3 },
    { limit: 20_000, rate: 0.25 },
    { limit: 50_000, rate: 0.2 },
    { limit: 150_000, rate: 0.15 },
    { limit: Infinity, rate: 0.1 },
  ];

  let total = 0;
  let remaining = revenue;
  let prev = 0;

  for (const b of brackets) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, b.limit - prev);
    total += taxable * b.rate;
    remaining -= taxable;
    prev = b.limit;
  }

  return {
    total: Math.round(total),
    effective: revenue > 0 ? (total / revenue) * 100 : 0,
    keep: Math.round(revenue - total),
  };
}

/* ─── Animated tier row ─── */
function TierRow({
  tier,
  index,
  visible,
}: {
  tier: (typeof tiers)[number];
  index: number;
  visible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const delay = 200 * index + 300;
    const timeout = setTimeout(() => {
      const duration = 1000;
      const start = performance.now();
      let frame: number;
      const animate = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * tier.pct));
        if (p < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, index, tier.pct]);

  const delay = 200 * index;

  return (
    <div
      className="flex flex-col"
      style={{
        paddingLeft: visible ? `${index * 48}px` : "0px",
        transition: `padding-left 0.8s cubic-bezier(0.77, 0, 0.18, 1) ${delay}ms`,
      }}
    >
      {/* Bar wrapper */}
      <div
        className="relative h-10 bg-dark-muted/10 overflow-hidden"
        style={{
          width: visible ? `${tier.barPct}%` : "0%",
          maxWidth: "480px",
          transition: `width 1s cubic-bezier(0.77, 0, 0.18, 1) ${delay}ms`,
        }}
      >
        <div className="absolute inset-0 bg-accent" />
      </div>
      {/* Info */}
      <div
        className="mt-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.5s ease-out ${delay + 200}ms, transform 0.5s ease-out ${delay + 200}ms`,
        }}
      >
        <span className="font-display text-[36px] md:text-[40px] font-bold text-dark-text leading-none tabular-nums">
          {count}%
        </span>
        <p className="text-[13px] font-sans font-semibold uppercase tracking-[0.1em] text-dark-text mt-1.5">
          {tier.name}
        </p>
        <p className="text-[13px] font-sans text-dark-muted mt-0.5">
          {tier.range}
        </p>
      </div>
    </div>
  );
}

/* ─── Calculator modal ─── */
function Calculator({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [revenue, setRevenue] = useState(30_000);
  const result = calcCommission(revenue);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-dark border border-dark-muted/20 p-8 md:p-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-muted hover:text-dark-text transition-colors"
          aria-label="Fermer"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <h3 className="font-display text-2xl font-bold text-dark-text mb-2">
          Simulateur de commission
        </h3>
        <p className="text-sm text-dark-muted mb-8">
          Ajustez vos revenus mensuels pour voir le calcul.
        </p>

        {/* Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-dark-muted font-sans uppercase tracking-[0.08em]">
              Revenus mensuels
            </span>
            <span className="font-display text-2xl font-bold text-dark-text tabular-nums">
              {revenue.toLocaleString("fr-FR")}€
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={200_000}
            step={1_000}
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full h-1.5 appearance-none bg-dark-muted/20 rounded-none cursor-pointer accent-accent
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-none"
          />
          <div className="flex justify-between text-[11px] text-dark-muted mt-1">
            <span>0€</span>
            <span>200 000€</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-dark-muted/10 p-4">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-dark-muted mb-1">
              Commission
            </p>
            <p className="font-display text-xl font-bold text-accent tabular-nums">
              {result.total.toLocaleString("fr-FR")}€
            </p>
          </div>
          <div className="bg-dark-muted/10 p-4">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-dark-muted mb-1">
              Taux effectif
            </p>
            <p className="font-display text-xl font-bold text-dark-text tabular-nums">
              {result.effective.toFixed(1)}%
            </p>
          </div>
          <div className="bg-dark-muted/10 p-4">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-dark-muted mb-1">
              Vous gardez
            </p>
            <p className="font-display text-xl font-bold text-success tabular-nums">
              {result.keep.toLocaleString("fr-FR")}€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─── */
export function CommissionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Header animation */
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="py-32 md:py-44 bg-dark overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        {/* ─── Header ─── */}
        <div
          className="mb-20 max-w-2xl"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4 font-sans font-semibold">
            Transparence radicale
          </p>
          <h2 className="font-display text-[36px] md:text-[44px] font-bold text-dark-text tracking-tight leading-[1.1]">
            Plus vous grandissez,<br />moins vous payez.
          </h2>
          <p className="text-lg text-dark-muted leading-relaxed mt-4 max-w-[580px]">
            Notre commission baisse à mesure que vos revenus augmentent.
            Publiquement. Sans astérisque.
          </p>
        </div>

        {/* ─── Escalier inversé ─── */}
        <div className="max-w-2xl">
          {tiers.map((tier, i) => (
            <div key={tier.name} className={i > 0 ? "mt-12 md:mt-14" : ""}>
              <TierRow tier={tier} index={i} visible={visible} />
            </div>
          ))}
        </div>

        {/* ─── Callout box ─── */}
        <div
          className="mt-16 max-w-2xl bg-white/5 p-6 md:p-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease-out 1.4s",
          }}
        >
          <p className="text-sm text-dark-muted leading-relaxed">
            <strong className="text-dark-text">Les commissions s&apos;appliquent par tranche, pas sur le total.</strong>{" "}
            Si vous gagnez 25 000€, vous payez 30% sur les 5 000 premiers, 25%
            sur les 15 000 suivants, et 20% sur les 5 000 derniers. Soit une
            commission moyenne de ~25%.
          </p>
        </div>

        {/* ─── CTA ─── */}
        <div
          className="mt-12 flex flex-col sm:flex-row gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out 1.6s, transform 0.5s ease-out 1.6s",
          }}
        >
          <button
            onClick={() => setCalcOpen(true)}
            className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
          >
            Simuler ma commission
          </button>
          <Link
            href="/contrat-type"
            className="inline-flex items-center justify-center px-8 py-3 border border-dark-text/20 text-dark-text text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-white/5 transition-colors"
          >
            Télécharger notre contrat type
          </Link>
        </div>
      </div>

      {/* Calculator modal */}
      <Calculator open={calcOpen} onClose={() => setCalcOpen(false)} />
    </section>
  );
}
