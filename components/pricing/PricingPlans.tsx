"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/* ─── Plan definition ─── */

export interface Plan {
  name: string;
  monthlyPrice: number; // 0 = free
  yearlyPrice: number; // yearly price per month (effort)
  credits?: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

/* ─── Plan data ─── */

export const STUDIO_PLANS: Plan[] = [
  { name: "Free", monthlyPrice: 0, yearlyPrice: 0, credits: 5, description: "Pour découvrir le Studio IA", features: ["Compositeur 3 plateformes", "Templates de base", "Inspiration feed", "Génération texte"], cta: "Commencer gratuitement", href: "/studio" },
  { name: "Creator", monthlyPrice: 19, yearlyPrice: 15, credits: 100, description: "Pour les créateurs actifs", features: ["Compositeur 5 plateformes", "Génération texte & image", "Templates premium", "Insights de base", "Programmation"], cta: "Commencer", href: "/studio" },
  { name: "Premium", monthlyPrice: 49, yearlyPrice: 39, credits: 500, description: "Pour les créateurs réguliers", features: ["10 plateformes", "Génération texte, image, vidéo, audio", "Templates premium", "Insights avancés", "Tone Guard intégré", "Éditeur photo"], cta: "Essayer Premium", href: "/studio", highlighted: true },
  { name: "Elite", monthlyPrice: 99, yearlyPrice: 79, credits: 1500, description: "Pour les professionnels", features: ["BYOK (vos clés API)", "Tous les modèles IA", "Éditeurs photo & vidéo", "Multi-publish & programmation", "Avatars parlants", "Support prioritaire"], cta: "Essayer Elite", href: "/studio" },
];

export const ATLAS_PLANS: Plan[] = [
  { name: "Free", monthlyPrice: 0, yearlyPrice: 0, description: "Pour découvrir Atlas CRM", features: ["1 canal (email)", "Jusqu'à 100 fans", "Templates email de base", "Statistiques simplifiées"], cta: "Commencer gratuitement", href: "/dashboard/atlas/onboarding" },
  { name: "Pro", monthlyPrice: 39, yearlyPrice: 29, description: "Pour les créateurs actifs", features: ["3 canaux (email, SMS, Push)", "Jusqu'à 10 000 fans", "Revenue Radar", "Moteur de règles Si-Alors", "Funnels automatisés", "Analytics avancés"], cta: "Essayer Pro", href: "/dashboard/atlas/onboarding?plan=pro", highlighted: true },
  { name: "Enterprise", monthlyPrice: 129, yearlyPrice: 99, description: "Pour les équipes", features: ["5+ canaux", "Fans illimités", "API & webhooks", "Conformité avancée", "Multi-comptes", "Support dédié"], cta: "Contacter l'équipe", href: "/apply" },
];

/* ─── Component ─── */

export function PricingPlans({
  plans,
  badge,
}: {
  plans: Plan[];
  badge?: string;
}) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-xs font-medium" style={{ color: yearly ? "var(--text-tertiary)" : "var(--text-primary)" }}>
          Mensuel
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className="w-10 h-5 rounded-full relative transition-colors"
          style={{ backgroundColor: yearly ? "var(--accent)" : "var(--border-default)" }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform"
            style={{ left: yearly ? "calc(100% - 16px)" : "3px" }}
          />
        </button>
        <span className="text-xs font-medium" style={{ color: yearly ? "var(--text-primary)" : "var(--text-tertiary)" }}>
          Annuel
        </span>
        <span
          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          -20%
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
          const period = yearly ? "/mois (an)" : "/mois";
          return (
            <div
              key={plan.name}
              className="flex flex-col p-5 rounded-xl transition-all"
              style={{
                backgroundColor: plan.highlighted ? "var(--accent-soft)" : "var(--bg-card)",
                border: plan.highlighted
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              {/* Badge */}
              {badge && (
                <span
                  className="text-[9px] font-medium px-2 py-0.5 rounded-full mb-2 self-start"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {badge}
                </span>
              )}

              <h3
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
              >
                {plan.name}
              </h3>
              <p className="text-[10px] mt-0.5 mb-3" style={{ color: "var(--text-tertiary)" }}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-3">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                >
                  {price === 0 ? "Gratuit" : `${price} €`}
                </span>
                {price > 0 && (
                  <span className="text-[10px] ml-1" style={{ color: "var(--text-tertiary)" }}>
                    {period}
                  </span>
                )}
              </div>

              {/* Credits info */}
              {plan.credits !== undefined && (
                <p className="text-[10px] mb-3" style={{ color: "var(--accent)" }}>
                  ✦ {plan.credits} crédits IA / mois
                </p>
              )}

              {/* Features */}
              <ul className="flex-1 space-y-1.5 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    <Check size={12} className="shrink-0 mt-0.5" style={{ color: "var(--success, #7A9A65)" }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className="block text-center py-2.5 text-[11px] font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: plan.highlighted ? "var(--accent)" : "transparent",
                  color: plan.highlighted ? "var(--accent-text, #fff)" : "var(--accent)",
                  border: plan.highlighted ? "none" : "1px solid var(--accent)",
                }}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
