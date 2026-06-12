"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  LEGAL_SHIELD_TITLE,
  LEGAL_SHIELD_TEXT,
  LEGAL_SHIELD_DISCLAIMER,
} from "@/lib/marketing/couture-homepage";

export function CoutureLegalShield() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section
      ref={ref}
      className="py-32 md:py-48 relative overflow-hidden"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-start">
          
          {/* Text */}
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
              Bouclier Légal
            </span>
            <h2 
              className="mb-8"
              style={{
                fontFamily: "var(--font-couture), Georgia, serif",
                fontSize: "clamp(36px, 4.5vw, 64px)",
                fontWeight: 400,
                color: "var(--encre)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em"
              }}
            >
              {LEGAL_SHIELD_TITLE}
            </h2>
            <p
              className="mb-12 text-[16px] leading-relaxed"
              style={{ color: "rgba(12,10,8,0.7)" }}
            >
              {LEGAL_SHIELD_TEXT}
            </p>
            <Link 
              href="/protection" 
              className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] transition-all duration-300 group"
              style={{
                fontFamily: "var(--font-util), monospace",
                color: "var(--encre)",
              }}
            >
              <span 
                className="block w-8 h-px transition-all duration-300 group-hover:w-16" 
                style={{ background: "var(--encre)" }}
              />
              Analyser mon contrat
            </Link>
            <p
              className="mt-12 text-[11px]"
              style={{ color: "rgba(12,10,8,0.4)", fontStyle: "italic" }}
            >
              {LEGAL_SHIELD_DISCLAIMER}
            </p>
          </motion.div>

          {/* Audit Report (Editorial style) */}
          <motion.div
            className="flex-1 w-full max-w-[500px] lg:mt-32"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div
              className="mb-10 text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "rgba(12,10,8,0.4)" }}
            >
              Extrait d&apos;analyse · contrat_agence.pdf
            </div>

            <div className="flex flex-col">
              {[
                { text: "Clause d'exclusivité 36 mois", flag: "Abusive", color: "rgba(12,10,8,0.8)" },
                { text: "Pénalité de sortie 15 000 €", flag: "Abusive", color: "rgba(12,10,8,0.8)" },
                { text: "Propriété des comptes → agence", flag: "Critique", color: "var(--encre)" },
                { text: "Reversement sous 30 jours", flag: "Conforme", color: "rgba(12,10,8,0.4)" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-5"
                  style={{ 
                    borderTop: "1px solid rgba(12,10,8,0.08)",
                    borderBottom: i === 3 ? "1px solid rgba(12,10,8,0.08)" : "none",
                  }}
                >
                  <span 
                    style={{ 
                      fontFamily: "var(--font-couture), Georgia, serif", 
                      fontSize: "20px", 
                      color: item.color,
                      fontStyle: item.flag === "Critique" ? "italic" : "normal"
                    }}
                  >
                    {item.text}
                  </span>
                  <span 
                    style={{ 
                      color: item.color, 
                      fontSize: 10,
                      fontFamily: "var(--font-util), monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      opacity: item.flag === "Critique" ? 1 : 0.6
                    }}
                  >
                    {item.flag}
                  </span>
                </div>
              ))}
            </div>
            
            <div
              className="mt-10 text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--encre)" }}
            >
              SCORE DE RISQUE : <span style={{ color: "var(--or)" }}>ÉLEVÉ</span> — 3 CLAUSES À RENÉGOCIER
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
