"use client";

import { Suspense } from "react";
import { Crown, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PLANS = [
  {
    name: "Creator",
    price: "Gratuit",
    tier: "creator",
    features: [
      "Dashboard créateur",
      "Accès aux agents IA de base",
      "5 crédits IA / mois",
      "Analytiques essentielles",
    ],
    cta: "Votre plan actuel",
    current: true,
  },
  {
    name: "Premium",
    price: "29 €",
    period: "/mois",
    tier: "premium",
    features: [
      "Tout le plan Creator",
      "Studio créatif complet",
      "Génération IA (fair use: usage commercial normal)",
      "Multi-publish",
      "50 crédits IA / mois",
      "Support prioritaire",
    ],
    cta: "Passer à Premium",
    current: false,
    highlight: true,
  },
  {
    name: "Elite",
    price: "79 €",
    period: "/mois",
    tier: "elite",
    features: [
      "Tout le plan Premium",
      "BYOK — Vos propres clés API",
      "Génération vidéo IA 4K",
      "Avatars parlants",
      "200 crédits IA / mois",
      "Manager dédié",
    ],
    cta: "Passer à Elite",
    current: false,
  },
  {
    name: "Icon",
    price: "199 €",
    period: "/mois",
    tier: "icon",
    features: [
      "Tout le plan Elite",
      "Crédits IA selon fair use",
      "Accès API prioritaire",
      "Modèles sur mesure",
      "Collaboration d'équipe",
      "Concierge 24/7",
    ],
    cta: "Passer à Icon",
    current: false,
  },
];

function UpgradePageInner() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen" data-theme="dark" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs mb-12 transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ArrowLeft size={14} />
          Retour au tableau de bord
        </Link>

        <div className="text-center mb-12">
          {reason === "studio" && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs mb-4"
              style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
            >
              <Crown size={12} />
              Studio requis
            </div>
          )}
          <h1
            className="text-3xl italic mb-3"
            style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}
          >
            Passez au niveau supérieur
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Le Studio créatif est accessible dès le plan Premium.
            Choisissez la formule qui correspond à vos ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className="relative flex flex-col p-5 border transition-all duration-200"
              style={{
                borderColor: plan.highlight ? "var(--accent)" : "rgba(255,255,255,0.08)",
                backgroundColor: plan.highlight ? "rgba(199,91,57,0.04)" : "var(--bg-primary)",
                transform: plan.highlight ? "scale(1.02)" : "none",
              }}
            >
              {plan.highlight && (
                <div className="absolute -top-[1px] left-0 right-0 h-[2px]" style={{ background: "var(--accent)" }} />
              )}
              <div className="mb-4">
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>}
                </div>
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <Check size={12} className="mt-0.5 shrink-0" style={{ color: plan.highlight ? "var(--accent)" : "rgba(255,255,255,0.2)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <div className="w-full text-center py-2 text-[11px] uppercase tracking-wider" style={{ border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.3)" }}>
                  Plan actuel
                </div>
              ) : (
                <button
                  className="w-full py-2 text-[11px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
                  style={{ background: plan.highlight ? "var(--accent)" : "rgba(255,255,255,0.06)", color: plan.highlight ? "var(--text-primary)" : "var(--text-primary)" }}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] mt-8" style={{ color: "rgba(255,255,255,0.2)" }}>
          Vous pouvez aussi configurer vos propres clés API (BYOK) sur le plan Elite et au-dessus.
        </p>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-primary)" }} />}>
      <UpgradePageInner />
    </Suspense>
  );
}
