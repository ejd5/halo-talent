"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import {
  COMMISSION_TITLE,
  COMMISSION_SUBTITLE,
  COMMISSION_TIERS,
  COMMISSION_DISCLAIMER,
} from "@/lib/marketing/couture-homepage";

const TIERS: [number, number, number][] = [
  [0, 5000, 0.3],
  [5000, 20000, 0.25],
  [20000, 50000, 0.2],
  [50000, 150000, 0.15],
  [150000, Infinity, 0.1],
];

function fmt(n: number): string {
  return n.toLocaleString("fr-FR");
}

export function CoutureCommissionSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const [revenue, setRevenue] = useState(12000);

  let fee = 0;
  for (const [a, b, t] of TIERS) {
    if (revenue > a) fee += (Math.min(revenue, b) - a) * t;
  }
  const effRate = ((fee / revenue) * 100).toFixed(1).replace(".", ",") + "%";
  const feeDisplay = fmt(Math.round(fee)) + " €";
  const keepDisplay = fmt(Math.round(revenue - fee)) + " €";
  const savedDisplay = "+" + fmt(Math.round(revenue * 0.5 - fee)) + " €";

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const r = +e.target.value;
    e.target.style.setProperty("--p", ((r - 1000) / (200000 - 1000)) * 100 + "%");
    setRevenue(r);
  }, []);

  return (
    <section
      id="commissions"
      ref={ref}
      className="couture-section couture-section-noir relative overflow-hidden"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      {/* Ambient ring */}
      <div
        className="halo-ring"
        style={{
          width: 500,
          height: 500,
          right: -180,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.25,
        }}
      />

      <div className="wrap-eco relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: explanation */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="couture-ornament mb-8" style={{ justifyContent: "flex-start" }}>
              <CoutureEmblem size={22} color="var(--or)" />
            </div>
            <span className="eyebrow">Commissions transparentes</span>
            <h2 className="display-small mt-4 mb-6">
              {COMMISSION_TITLE.split(".")[0]}
              <span className="serif-i">.</span>
            </h2>
            <p className="mb-10 text-[15px] leading-relaxed" style={{ color: "var(--pierre)" }}>
              {COMMISSION_SUBTITLE}
            </p>

            <div className="space-y-1 mb-8">
              {COMMISSION_TIERS.map((t) => (
                <div
                  key={t.label}
                  className="flex justify-between items-center py-3 px-4 text-[13px]"
                  style={{
                    borderLeft: "1px solid var(--ligne-faible)",
                    fontFamily: "var(--font-util), monospace",
                    color: parseFloat(t.rate) <= 15 ? "var(--sauge)" : "var(--pierre)",
                  }}
                >
                  <span>{t.label}</span>
                  <span style={{ color: "var(--or)" }}>{t.rate}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: simulator */}
          <motion.div
            className="p-10 md:p-12"
            style={{
              border: "1px solid var(--ligne)",
              background: "linear-gradient(180deg, rgba(216,169,91,0.03), transparent 60%)",
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <span
              className="block mb-6 text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
            >
              Simulateur
            </span>

            <div className="mb-6">
              <span
                className="text-[11px] uppercase tracking-[0.2em] block mb-1"
                style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
              >
                Revenu mensuel
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[36px] font-light"
                  style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--ivoire)" }}
                >
                  {fmt(revenue)}
                </span>
                <span style={{ color: "var(--pierre)" }}>€ / mois</span>
              </div>
            </div>

            <input
              type="range"
              className="simu-slider"
              min="1000"
              max="200000"
              step="500"
              value={revenue}
              onChange={handleSlider}
              aria-label="Revenu mensuel"
            />

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <div
                  className="text-[10px] uppercase tracking-[0.15em] mb-1"
                  style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
                >
                  Taux effectif
                </div>
                <div
                  className="text-[22px]"
                  style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--or)" }}
                >
                  {effRate}
                </div>
              </div>
              <div className="p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <div
                  className="text-[10px] uppercase tracking-[0.15em] mb-1"
                  style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
                >
                  Commission Halo
                </div>
                <div
                  className="text-[22px]"
                  style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--ivoire)" }}
                >
                  {feeDisplay}
                </div>
              </div>
              <div className="p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <div
                  className="text-[10px] uppercase tracking-[0.15em] mb-1"
                  style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
                >
                  Vous gardez
                </div>
                <div
                  className="text-[22px]"
                  style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--sauge)" }}
                >
                  {keepDisplay}
                </div>
              </div>
              <div className="p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <div
                  className="text-[10px] uppercase tracking-[0.15em] mb-1"
                  style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
                >
                  vs agence à 50%
                </div>
                <div
                  className="text-[22px]"
                  style={{ fontFamily: "var(--font-display-alt), serif", color: "var(--cuivre)" }}
                >
                  {savedDisplay}
                </div>
              </div>
            </div>

            <p
              className="mt-6 text-[11px] text-center"
              style={{ color: "var(--pierre)", opacity: 0.5 }}
            >
              {COMMISSION_DISCLAIMER}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
