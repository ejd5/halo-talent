"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
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
      className="py-32 md:py-48 relative overflow-hidden"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 lg:gap-32 items-start">
          
          {/* Left: explanation */}
          <motion.div
            className="flex-1 max-w-[500px]"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <span 
              className="block mb-8 text-[10px] uppercase tracking-[0.34em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
            >
              Commissions
            </span>
            <h2 
              className="mb-10"
              style={{
                fontFamily: "var(--font-couture), Georgia, serif",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                color: "var(--ivoire)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em"
              }}
            >
              {COMMISSION_TITLE.split(".")[0]}
              <span style={{ color: "var(--or)" }}>.</span>
            </h2>
            <p 
              className="mb-16 text-[15px] leading-relaxed" 
              style={{ color: "rgba(244, 238, 227, 0.6)" }}
            >
              {COMMISSION_SUBTITLE}
            </p>

            <div className="flex flex-col gap-0">
              {COMMISSION_TIERS.map((t, idx) => (
                <div
                  key={t.label}
                  className="flex justify-between items-center py-4 text-[13px]"
                  style={{
                    borderTop: idx === 0 ? "1px solid rgba(244,238,227,0.1)" : "none",
                    borderBottom: "1px solid rgba(244,238,227,0.1)",
                    fontFamily: "var(--font-util), monospace",
                    color: parseFloat(t.rate) <= 15 ? "var(--ivoire)" : "rgba(244, 238, 227, 0.5)",
                  }}
                >
                  <span className="tracking-[0.05em]">{t.label}</span>
                  <span style={{ color: "var(--or)" }}>{t.rate}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: simulator (Éditorial style) */}
          <motion.div
            className="flex-1 w-full max-w-[560px] lg:mt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="mb-16">
              <span
                className="text-[10px] uppercase tracking-[0.2em] block mb-4"
                style={{ fontFamily: "var(--font-util), monospace", color: "rgba(244, 238, 227, 0.5)" }}
              >
                Revenu mensuel
              </span>
              <div className="flex items-baseline gap-3 mb-8">
                <span
                  className="font-light"
                  style={{ 
                    fontFamily: "var(--font-couture), Georgia, serif", 
                    color: "var(--ivoire)",
                    fontSize: "clamp(64px, 7vw, 96px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em"
                  }}
                >
                  {fmt(revenue)}
                </span>
                <span 
                  style={{ 
                    fontFamily: "var(--font-util), monospace",
                    color: "var(--or)",
                    fontSize: 14,
                    letterSpacing: "0.1em"
                  }}
                >
                  € / mois
                </span>
              </div>

              <input
                type="range"
                className="w-full h-px appearance-none bg-transparent cursor-pointer"
                min="1000"
                max="200000"
                step="500"
                value={revenue}
                onChange={handleSlider}
                aria-label="Revenu mensuel"
                style={{
                  background: "rgba(244, 238, 227, 0.1)",
                  outline: "none",
                }}
              />
              {/* Le slider aura besoin de CSS custom pour la thumb, géré dans globals.css s'il existe, sinon on simplifie */}
            </div>

            <div className="flex flex-col gap-12">
              <div className="flex flex-wrap gap-12 md:gap-24">
                <div>
                  <div
                    className="text-[9px] uppercase tracking-[0.25em] mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "rgba(244, 238, 227, 0.5)" }}
                  >
                    Taux effectif
                  </div>
                  <div
                    style={{ 
                      fontFamily: "var(--font-couture), Georgia, serif", 
                      color: "var(--or)",
                      fontSize: "clamp(32px, 3vw, 42px)",
                      lineHeight: 1
                    }}
                  >
                    {effRate}
                  </div>
                </div>
                
                <div>
                  <div
                    className="text-[9px] uppercase tracking-[0.25em] mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "rgba(244, 238, 227, 0.5)" }}
                  >
                    Commission Halo
                  </div>
                  <div
                    style={{ 
                      fontFamily: "var(--font-couture), Georgia, serif", 
                      color: "var(--ivoire)",
                      fontSize: "clamp(32px, 3vw, 42px)",
                      lineHeight: 1
                    }}
                  >
                    {feeDisplay}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-12 md:gap-24">
                <div>
                  <div
                    className="text-[9px] uppercase tracking-[0.25em] mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "rgba(244, 238, 227, 0.5)" }}
                  >
                    Vous gardez
                  </div>
                  <div
                    style={{ 
                      fontFamily: "var(--font-couture), Georgia, serif", 
                      color: "var(--ivoire)",
                      fontSize: "clamp(32px, 3vw, 42px)",
                      lineHeight: 1
                    }}
                  >
                    {keepDisplay}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[9px] uppercase tracking-[0.25em] mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
                  >
                    vs agence à 50%
                  </div>
                  <div
                    style={{ 
                      fontFamily: "var(--font-couture), Georgia, serif", 
                      color: "var(--or)",
                      fontSize: "clamp(32px, 3vw, 42px)",
                      lineHeight: 1
                    }}
                  >
                    {savedDisplay}
                  </div>
                </div>
              </div>
            </div>

            <p
              className="mt-16 text-[10px] tracking-[0.05em]"
              style={{ color: "rgba(244, 238, 227, 0.3)", fontFamily: "var(--font-util), monospace" }}
            >
              {COMMISSION_DISCLAIMER}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
