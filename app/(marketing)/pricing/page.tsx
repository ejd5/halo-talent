"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CommissionSimulator } from "@/components/pricing/CommissionSimulator";
import { PricingTabs, type PricingTab } from "@/components/pricing/PricingTabs";
import { PricingPlans, STUDIO_PLANS, ATLAS_PLANS } from "@/components/pricing/PricingPlans";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { CreditPacks } from "@/components/pricing/CreditPacks";

/* ─── Commission tiers ─── */
const COMMISSION_TIERS = [
  { label: "Découverte", range: "0 – 5 000 €", rate: 30 },
  { label: "Croissance", range: "5 000 – 20 000 €", rate: 25 },
  { label: "Scale", range: "20 000 – 50 000 €", rate: 20 },
  { label: "Elite", range: "50 000 – 150 000 €", rate: 15 },
  { label: "Icon", range: "150 000 € +", rate: 10 },
];

const GUARANTEES = [
  "Sortie 30 jours",
  "Pas de frais d'entrée",
  "Contrat type public",
  "Données exportables",
];

export default function PricingPage() {
  const [tab, setTab] = useState<PricingTab>("commission");

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* ─── Hero ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
          >
            Tarifs transparents
          </span>
          <h1
            className="text-[2.5rem] md:text-[4rem] font-bold tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Tout est public. Comparez.
          </h1>
          <p className="text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Commissions, abonnements, crédits IA. Aucun frais caché. Aucune surprise.
          </p>
        </div>
      </section>

      {/* ─── Tab Navigation ─── */}
      <section className="pb-6">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <PricingTabs active={tab} onChange={setTab} />
        </div>
      </section>

      {/* ─── Tab: Commission ─── */}
      {tab === "commission" && (
        <section className="py-10 pb-20" style={{ backgroundColor: "var(--bg-surface)" }}>
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Commission de management
              </h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                Plus vous grandissez, moins vous payez. Système marginal par tranche.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Tiers */}
              <div>
                <div className="space-y-2">
                  {COMMISSION_TIERS.map((tier) => (
                    <div
                      key={tier.label}
                      className="flex items-center justify-between p-3.5 rounded-xl"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {tier.label}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                          {tier.range}
                        </p>
                      </div>
                      <span
                        className="text-xl font-bold"
                        style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
                      >
                        {tier.rate}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {GUARANTEES.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--success, #7A9A65) 10%, transparent)",
                        color: "var(--success, #7A9A65)",
                      }}
                    >
                      <Check size={10} />
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <CreditPacks />
                </div>
              </div>

              {/* Calculator */}
              <CommissionSimulator />
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/commissions"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: "var(--accent)" }}
              >
                En savoir plus sur nos commissions
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tab: Studio IA ─── */}
      {tab === "studio" && (
        <section className="py-10 pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Studio IA
              </h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                Créez, éditez et publiez avec des agents IA personnalisés à votre ADN créatif.
              </p>
            </div>

            <PricingPlans plans={STUDIO_PLANS} badge="Studio IA" />

            <div className="mt-12">
              <CreditPacks />
            </div>
          </div>
        </section>
      )}

      {/* ─── Tab: Atlas CRM ─── */}
      {tab === "atlas" && (
        <section className="py-10 pb-20" style={{ backgroundColor: "var(--bg-surface)" }}>
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Atlas CRM
              </h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                Automatisation marketing, segmentation fans et campagnes multi-canal.
              </p>
            </div>

            <PricingPlans plans={ATLAS_PLANS} badge="Atlas CRM" />
          </div>
        </section>
      )}

      {/* ─── Tab: Comparatif ─── */}
      {tab === "comparison" && (
        <section className="py-10 pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Comparatif des plans
              </h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                Toutes les fonctionnalités détaillées plan par plan.
              </p>
            </div>

            <PricingComparison />
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <h2
            className="text-2xl font-bold text-center mb-8"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Questions fréquentes
          </h2>
          <PricingFAQ />
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-2xl px-6 md:px-12 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Prêt à commencer&nbsp;?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Postulez à la maison ou commencez avec le Studio gratuitement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="px-8 py-3 text-sm font-semibold rounded-xl transition-all"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
            >
              Postuler à la maison
            </Link>
            <Link
              href="/studio"
              className="px-8 py-3 text-sm font-semibold rounded-xl transition-all"
              style={{
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              Essayer le Studio gratuitement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
