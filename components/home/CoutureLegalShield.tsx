"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
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
      className="couture-section couture-section-fumee relative overflow-hidden"
      style={{ backgroundColor: "var(--fumee, #15110D)" }}
    >
      {/* Ambient ring */}
      <div
        className="halo-ring"
        style={{
          width: 520,
          height: 520,
          left: -200,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.5,
        }}
      />

      <div className="wrap-eco relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="couture-ornament mb-8" style={{ justifyContent: "flex-start" }}>
              <CoutureEmblem size={22} color="var(--or)" />
            </div>
            <span className="eyebrow">Bouclier Légal — gratuit</span>
            <h2 className="display-small mt-4 mb-6">
              {LEGAL_SHIELD_TITLE}
            </h2>
            <p
              className="mb-8 text-[15px] leading-relaxed"
              style={{ color: "var(--pierre)" }}
            >
              {LEGAL_SHIELD_TEXT}
            </p>
            <Link href="/protection" className="btn-eco btn-eco-gold">
              Analyser mon contrat &rarr;
            </Link>
            <p
              className="mt-6 text-[12px]"
              style={{ color: "var(--pierre)", opacity: 0.6, fontStyle: "italic" }}
            >
              {LEGAL_SHIELD_DISCLAIMER}
            </p>
          </motion.div>

          {/* Scan card visual */}
          <motion.div
            className="p-10"
            style={{
              border: "1px solid var(--ligne)",
              background: "linear-gradient(180deg, rgba(216,169,91,0.04), transparent 60%)",
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div
              className="mb-5 text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--pierre)" }}
            >
              Analyse · contrat_agence.pdf
            </div>
            {[
              { text: "Clause d'exclusivité 36 mois", flag: "⚠ Abusive", color: "var(--terre)" },
              { text: "Pénalité de sortie 15 000 €", flag: "⚠ Abusive", color: "var(--terre)" },
              { text: "Propriété des comptes → agence", flag: "⚠ Critique", color: "var(--terre)" },
              { text: "Reversement sous 30 jours", flag: "✓ Conforme", color: "var(--sauge)" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 text-[13px]"
                style={{ borderTop: "1px solid var(--ligne-faible)" }}
              >
                <span style={{ color: "var(--pierre)" }}>{item.text}</span>
                <span style={{ color: item.color, fontSize: 12 }}>{item.flag}</span>
              </div>
            ))}
            <div
              className="mt-5 h-[1px]"
              style={{ background: "linear-gradient(90deg, var(--or), transparent 70%)" }}
            />
            <div
              className="mt-3 text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--terre)" }}
            >
              SCORE DE RISQUE : ÉLEVÉ — 3 CLAUSES À RENÉGOCIER
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
