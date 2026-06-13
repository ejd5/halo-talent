"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import { AGENCE_VS_HALO, MARKET_ARGUMENTS, BESOIN_SOLUTIONS } from "@/lib/marketing/comparisons";
import type { ComparisonRow, MarketArgument, BesoinSolution } from "@/lib/marketing/comparisons";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const fadeItem = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function ComparaisonsClient() {
  return (
    <div style={{ backgroundColor: "var(--creme)" }}>
      {/* Hero */}
      <HeroSection />

      {/* Tableau 1 : Agence vs WTF */}
      <AgenceVsHaloSection />

      {/* Tableau 2 : Arguments marché */}
      <MarketArgumentsSection />

      {/* Tableau 3 : Besoin / Solution */}
      <BesoinSolutionSection />

      {/* CTA */}
      <CTASection />
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "var(--encre)" }}>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6 }}
          className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
        >
          Comparaisons
        </motion.p>
        <motion.h1
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.08] mb-4"
          style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
        >
          Where Talent Forms &amp; le marché
        </motion.h1>
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[1rem] md:text-[1.1rem] leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--ivoire)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}
        >
          Une comparaison factuelle entre l'approche WTF et les modèles plus classiques du marché. Pas de généralisation : chaque agence est différente.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Tableau 1 : Agence vs WTF ─── */
function AgenceVsHaloSection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-4"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            Tableau 1
          </p>
          <h2
            className="text-[1.8rem] md:text-[2.2rem] font-bold leading-[1.1]"
            style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Agence traditionnelle vs Where Talent Forms
          </h2>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block overflow-hidden"
          style={{ border: "1px solid var(--ligne-faible)", borderRadius: "2px" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ligne)", backgroundColor: "rgba(12,10,8,0.02)" }}>
                <th
                  className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--encre)", fontFamily: "var(--font-util), monospace", width: "20%" }}
                >
                  Critère
                </th>
                <th
                  className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", width: "40%" }}
                >
                  Modèles plus classiques
                </th>
                <th
                  className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", width: "40%" }}
                >
                  Where Talent Forms
                </th>
              </tr>
            </thead>
            <tbody>
              {AGENCE_VS_HALO.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < AGENCE_VS_HALO.length - 1 ? "1px solid var(--ligne-faible)" : "none",
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(12,10,8,0.01)",
                  }}
                >
                  <td
                    className="p-4 text-[0.85rem] font-semibold"
                    style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {row.critere}
                  </td>
                  <td
                    className="p-4 text-[0.82rem] leading-relaxed"
                    style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {row.agenceTraditionnelle}
                  </td>
                  <td
                    className="p-4 text-[0.82rem] leading-relaxed"
                    style={{ color: "var(--encre)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {row.halo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-6">
          {AGENCE_VS_HALO.map((row, i) => (
            <MobileComparisonCard key={i} row={row} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileComparisonCard({ row, index, inView }: { row: ComparisonRow; index: number; inView: boolean }) {
  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={riseItem}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="p-5"
      style={{ border: "1px solid var(--ligne-faible)", borderRadius: "2px" }}
    >
      <p
        className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] mb-3"
        style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
      >
        {row.critere}
      </p>
      <div className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>
            Modèles classiques
          </p>
          <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
            {row.agenceTraditionnelle}
          </p>
        </div>
        <div className="pt-2" style={{ borderTop: "1px solid var(--ligne-faible)" }}>
          <p className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            Where Talent Forms
          </p>
          <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}>
            {row.halo}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tableau 2 : Arguments marché ─── */
function MarketArgumentsSection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-20 md:py-28" style={{ backgroundColor: "var(--encre)" }}>
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-4"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            Tableau 2
          </p>
          <h2
            className="text-[1.8rem] md:text-[2.2rem] font-bold leading-[1.1] mb-3"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Arguments du marché, limites et réponse WTF
          </h2>
          <p
            className="text-[0.9rem] leading-relaxed max-w-2xl"
            style={{ color: "var(--ivoire)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}
          >
            Les arguments que vous entendez, ce qu'ils cachent parfois, et comment WTF répond différemment.
          </p>
        </motion.div>

        <div className="space-y-8">
          {MARKET_ARGUMENTS.map((arg, i) => (
            <MarketArgumentCard key={i} arg={arg} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketArgumentCard({ arg, index, inView }: { arg: MarketArgument; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={riseItem}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <p
            className="text-[0.95rem] md:text-[1.05rem] font-semibold leading-relaxed"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            {arg.argument}
          </p>
        </div>
        <span
          className="text-[0.7rem] mt-1 transition-transform duration-300"
          style={{
            color: "var(--or)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            fontFamily: "var(--font-util), monospace",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
          <div>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] mb-2"
              style={{ color: "rgba(199,91,57,0.7)", fontFamily: "var(--font-util), monospace" }}
            >
              Limite possible
            </p>
            <p
              className="text-[0.85rem] leading-relaxed"
              style={{ color: "var(--ivoire)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}
            >
              {arg.limite}
            </p>
          </div>
          <div>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] mb-2"
              style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
            >
              Réponse WTF
            </p>
            <p
              className="text-[0.85rem] leading-relaxed"
              style={{ color: "var(--ivoire)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
            >
              {arg.reponseHalo}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Tableau 3 : Besoin / Solution ─── */
function BesoinSolutionSection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-4"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            Tableau 3
          </p>
          <h2
            className="text-[1.8rem] md:text-[2.2rem] font-bold leading-[1.1] mb-3"
            style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Quel est votre besoin ? Quelle solution WTF ?
          </h2>
          <p
            className="text-[0.9rem] leading-relaxed max-w-2xl"
            style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}
          >
            Parcourez les cas d'usage les plus courants et découvrez comment WTF y répond, pour quel profil, avec quel niveau d'autonomie.
          </p>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block overflow-hidden"
          style={{ border: "1px solid var(--ligne-faible)", borderRadius: "2px" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ligne)", backgroundColor: "rgba(12,10,8,0.02)" }}>
                <th className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--encre)", fontFamily: "var(--font-util), monospace", width: "20%" }}>
                  Besoin
                </th>
                <th className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", width: "28%" }}>
                  Solution WTF
                </th>
                <th className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", width: "20%" }}>
                  Pour qui
                </th>
                <th className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", width: "16%" }}>
                  Options
                </th>
                <th className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", width: "16%" }}>
                  Autonomie
                </th>
              </tr>
            </thead>
            <tbody>
              {BESOIN_SOLUTIONS.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < BESOIN_SOLUTIONS.length - 1 ? "1px solid var(--ligne-faible)" : "none",
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(12,10,8,0.01)",
                  }}
                >
                  <td className="p-4 text-[0.85rem] font-semibold" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>
                    {row.besoin}
                  </td>
                  <td className="p-4 text-[0.82rem] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}>
                    {row.solutionHalo}
                  </td>
                  <td className="p-4 text-[0.8rem] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                    {row.pourQui}
                  </td>
                  <td className="p-4 text-[0.8rem] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                    {row.optionPossible}
                  </td>
                  <td className="p-4">
                    <span
                      className="text-[0.7rem] px-2 py-0.5 inline-block"
                      style={{
                        backgroundColor:
                          row.niveauAutonomie === "Autonome"
                            ? "rgba(216,169,91,0.08)"
                            : row.niveauAutonomie === "Guidé"
                            ? "rgba(12,10,8,0.06)"
                            : "rgba(199,91,57,0.06)",
                        color:
                          row.niveauAutonomie === "Autonome"
                            ? "var(--or)"
                            : row.niveauAutonomie === "Guidé"
                            ? "var(--encre)"
                            : "#C75B39",
                        fontFamily: "var(--font-util), monospace",
                        borderRadius: "2px",
                      }}
                    >
                      {row.niveauAutonomie}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {BESOIN_SOLUTIONS.map((row, i) => (
            <MobileBesoinCard key={i} row={row} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileBesoinCard({ row, index, inView }: { row: BesoinSolution; index: number; inView: boolean }) {
  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={riseItem}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="p-5"
      style={{ border: "1px solid var(--ligne-faible)", borderRadius: "2px" }}
    >
      <p className="text-[0.9rem] font-semibold mb-3" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>
        {row.besoin}
      </p>
      <p className="text-[0.8rem] leading-relaxed mb-3" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>
        {row.solutionHalo}
      </p>
      <div className="flex flex-wrap gap-2 text-[0.7rem]">
        <span className="px-2 py-0.5" style={{ background: "rgba(12,10,8,0.03)", color: "var(--pierre)", fontFamily: "var(--font-util), monospace", borderRadius: "2px" }}>
          {row.pourQui}
        </span>
        <span
          className="px-2 py-0.5"
          style={{
            backgroundColor:
              row.niveauAutonomie === "Autonome"
                ? "rgba(216,169,91,0.08)"
                : row.niveauAutonomie === "Guidé"
                ? "rgba(12,10,8,0.06)"
                : "rgba(199,91,57,0.06)",
            color:
              row.niveauAutonomie === "Autonome"
                ? "var(--or)"
                : row.niveauAutonomie === "Guidé"
                ? "var(--encre)"
                : "#C75B39",
            fontFamily: "var(--font-util), monospace",
            borderRadius: "2px",
          }}
        >
          {row.niveauAutonomie}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-20 md:py-28" style={{ backgroundColor: "var(--encre)" }}>
      <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            Et maintenant ?
          </p>
          <h2
            className="text-[1.8rem] md:text-[2.2rem] font-bold leading-[1.1] mb-4"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Faites votre propre comparaison
          </h2>
          <p
            className="text-[0.95rem] leading-relaxed mb-10"
            style={{ color: "var(--ivoire)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}
          >
            Chaque créateur a des besoins différents. Explorez nos outils, testez le simulateur de commissions, ou
            contactez-nous pour en discuter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-3 text-[0.8rem] font-semibold transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: "var(--or)",
                color: "var(--encre)",
                fontFamily: "var(--font-body), sans-serif",
                borderRadius: "2px",
              }}
            >
              Demander une démo
            </Link>
            <Link
              href="/features"
              className="px-8 py-3 text-[0.8rem] font-semibold transition-all duration-300 hover:opacity-70"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--ivoire)",
                fontFamily: "var(--font-body), sans-serif",
                borderRadius: "2px",
              }}
            >
              Explorer les outils
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
