"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

/* ─── Commission brackets ─── */
const BRACKETS = [
  { name: "Découverte", range: "0 — 5k€", rate: "30%", barPct: 100 },
  { name: "Croissance", range: "5k — 20k€", rate: "25%", barPct: 83 },
  { name: "Scale", range: "20k — 50k€", rate: "20%", barPct: 67 },
  { name: "Elite", range: "50k — 150k€", rate: "15%", barPct: 50 },
  { name: "Icon", range: "150k€+", rate: "10%", barPct: 33 },
];

/* ─── SaaS plans ─── */
interface Plan {
  name: string;
  price: number;
  annualPrice: number;
  popular?: boolean;
  credits: string;
  features: string[];
}

const MONTHLY_PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    annualPrice: 0,
    credits: "50 crédits IA / mois",
    features: ["Accès Studio IA", "1 projet", "Génération texte", "Support email"],
  },
  {
    name: "Creator",
    price: 0,
    annualPrice: 0,
    credits: "200 crédits IA / mois",
    features: ["Tout Free +", "Atlas CRM", "Smart Segments", "Chat Copilot basique"],
  },
  {
    name: "Premium",
    price: 29,
    annualPrice: 23,
    popular: true,
    credits: "1 000 crédits IA / mois",
    features: [
      "Tout Creator +",
      "Génération image & vidéo",
      "Avatars parlants",
      "Bouclier Légal",
      "Analytics avancés",
    ],
  },
  {
    name: "Elite",
    price: 79,
    annualPrice: 63,
    credits: "5 000 crédits IA / mois",
    features: [
      "Tout Premium +",
      "ADN Créatif complet",
      "Multi-comptes (3)",
      "Revenue Inbox",
      "Support prioritaire 24/7",
    ],
  },
  {
    name: "Icon",
    price: 199,
    annualPrice: 159,
    credits: "Crédits généreux avec politique d'usage équitable",
    features: [
      "Tout Elite +",
      "Comptes multiples",
      "API dédiée",
      "Account manager",
      "Benchmark marché",
    ],
  },
];

function PricingCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annualPrice : plan.price;

  return (
    <div
      className="flex flex-col p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: plan.popular ? "var(--accent-soft)" : "var(--bg-card)",
        border: `1px solid ${plan.popular ? "var(--accent)" : "var(--border-default)"}`,
        position: "relative",
      }}
    >
      {plan.popular && (
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[0.5rem] font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
        >
          Populaire
        </span>
      )}

      <h4 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        {plan.name}
      </h4>

      <div className="mb-3">
        <span className="text-[1.75rem] font-bold" style={{ color: plan.popular ? "var(--accent)" : "var(--text-primary)" }}>
          {price}€
        </span>
        <span className="text-xs ml-1" style={{ color: "var(--text-tertiary)" }}>/mois</span>
        {annual && plan.annualPrice < plan.price && (
          <span
            className="block text-[0.55rem] font-semibold mt-0.5"
            style={{ color: "var(--success)" }}
          >
            Économisez {(plan.price - plan.annualPrice) * 12}€/an
          </span>
        )}
      </div>

      <p className="text-[0.6rem] font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
        {plan.credits}
      </p>

      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[0.65rem]">
            <Check size={10} className="shrink-0 mt-0.5" style={{ color: "var(--success)" }} strokeWidth={3} />
            <span style={{ color: "var(--text-secondary)" }}>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className="w-full inline-flex items-center justify-center px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition-all duration-300"
        style={{
          backgroundColor: plan.popular ? "var(--accent)" : "transparent",
          color: plan.popular ? "var(--accent-text, #fff)" : "var(--text-primary)",
          border: plan.popular ? "none" : "1px solid var(--border-default)",
        }}
      >
        Commencer
      </Link>
    </div>
  );
}

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToCalculator = () => {
    const el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Title */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700"
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
            Transparent. Dégressif. Équitable.
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Plus vous grandissez, moins vous payez. C&apos;est aussi simple que ça.
          </p>
        </div>

        {/* ─── Volet 1 : Commission Management ─── */}
        <div
          className="max-w-3xl mx-auto mb-20 md:mb-28 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h3
            className="text-center text-sm font-semibold uppercase tracking-[0.08em] mb-8"
            style={{ color: "var(--text-tertiary)" }}
          >
            Commission Management — Système marginal
          </h3>

          <div className="space-y-3">
            {BRACKETS.map((b) => (
              <div key={b.name} className="flex items-center gap-4">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-[0.65rem] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {b.name}
                  </span>
                  <span className="block text-[0.55rem]" style={{ color: "var(--text-tertiary)" }}>
                    {b.range}
                  </span>
                </div>
                <div className="flex-1 h-8 rounded-sm overflow-hidden" style={{ backgroundColor: "var(--bg-hover)" }}>
                  <div
                    className="h-full flex items-center justify-end px-3 transition-all duration-700"
                    style={{
                      width: `${b.barPct}%`,
                      backgroundColor: "var(--accent)",
                      opacity: visible ? 1 : 0,
                      transitionDelay: `${200 + BRACKETS.indexOf(b) * 80}ms`,
                    }}
                  >
                    <span className="text-[0.6rem] font-bold" style={{ color: "var(--accent-text, #fff)" }}>
                      {b.rate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-[0.6rem] mt-4 text-center max-w-lg mx-auto leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            Système marginal — comme l&apos;impôt sur le revenu. À 25k€, votre taux effectif est ~25%, pas 20%.
          </p>

          <div className="text-center mt-6">
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold transition-all duration-200 hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Simuler ma commission
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* ─── Volet 2 : Plans SaaS ─── */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "250ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h3
            className="text-center text-sm font-semibold uppercase tracking-[0.08em] mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Plans SaaS — Studio IA + Atlas CRM
          </h3>

          {/* Toggle mensuel/annuel */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span
              className="text-[0.65rem] font-medium"
              style={{ color: annual ? "var(--text-tertiary)" : "var(--text-primary)" }}
            >
              Mensuel
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-11 h-6 rounded-full transition-all duration-300"
              style={{
                backgroundColor: annual ? "var(--accent)" : "var(--border-default)",
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm"
                style={{ left: annual ? "5.5" : "0.5" }}
              />
            </button>
            <span
              className="text-[0.65rem] font-medium"
              style={{ color: annual ? "var(--text-primary)" : "var(--text-tertiary)" }}
            >
              Annuel <span className="text-[0.55rem]" style={{ color: "var(--success)" }}>-20%</span>
            </span>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {MONTHLY_PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} annual={annual} />
            ))}
          </div>

          {/* Fair use + beta note */}
          <p
            className="text-[0.55rem] mt-6 text-center max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            Crédits généreux soumis à une politique d&apos;usage équitable. Les prix et fonctionnalités
            peuvent évoluer pendant la phase beta. Aucun revenu n&apos;est garanti.
          </p>
        </div>
      </div>
    </section>
  );
}
