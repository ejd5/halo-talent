"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";

/* ─── Plan data ─── */
interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: React.ElementType;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "Pour découvrir Atlas",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Users,
    features: [
      { text: "1 canal (email)", included: true },
      { text: "Jusqu'à 100 fans", included: true },
      { text: "Templates email de base", included: true },
      { text: "Statistiques simplifiées", included: true },
      { text: "SMS / Push", included: false },
      { text: "Moteur de règles", included: false },
      { text: "Funnels automatisés", included: false },
      { text: "Analytics avancé", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/dashboard/atlas/onboarding",
  },
  {
    name: "Pro",
    tagline: "Pour les créateurs en croissance",
    monthlyPrice: 29,
    annualPrice: 290,
    icon: Zap,
    features: [
      { text: "3 canaux (email, SMS, Push)", included: true },
      { text: "Jusqu'à 10 000 fans", included: true },
      { text: "Templates avancés + personnalisation", included: true },
      { text: "Moteur de règles &quot;Si-Alors&quot;", included: true },
      { text: "Funnels Welcome, Lead, Vente", included: true },
      { text: "Analytics & ROI complet", included: true },
      { text: "Segmentation dynamique", included: true },
      { text: "Support email sous 24h", included: true },
      { text: "API access", included: false },
    ],
    cta: "Essayer Pro",
    ctaHref: "/dashboard/atlas/onboarding?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tagline: "Pour les studios et agences",
    monthlyPrice: 99,
    annualPrice: 990,
    icon: BarChart3,
    features: [
      { text: "5+ canaux (email, SMS, Push, DM, API)", included: true },
      { text: "Fans illimités", included: true },
      { text: "API Webhooks & custom integrations", included: true },
      { text: "Conformité avancée (audit, logs, DPO)", included: true },
      { text: "Workflows visuels illimités", included: true },
      { text: "Modération IA incluse", included: true },
      { text: "SLAs & support prioritaire 24/7", included: true },
      { text: "Onboarding dédié", included: true },
      { text: "Multi-comptes & rôles", included: true },
    ],
    cta: "Contacter l'équipe",
    ctaHref: "/dashboard/atlas/onboarding?plan=enterprise",
  },
];

/* ─── FAQ data ─── */
const faqs = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui. Vous pouvez passer du plan Free au plan Pro (ou Enterprise) quand vous voulez. Le passage est immédiat et vous ne perdez aucune donnée. Si vous décidez de réduire votre plan, les fonctionnalités non incluses seront simplement désactivées.",
  },
  {
    q: "Comment Atlas protège-t-il contre les bans ?",
    a: "Atlas intègre des limites de taux, une vérification de contenu et un suivi de conformité pour aider à réduire les risques. Si une action initiée par Atlas cause la suspension de votre compte, nous remboursons les 12 derniers mois d'abonnement, sous réserve du respect de nos recommandations.",
  },
  {
    q: "Les prix sont-ils TTC ?",
    a: "Oui, tous les prix affichés sont TTC (TVA incluse). Pour les clients professionnels, une facture avec TVA intracommunautaire est générée automatiquement à chaque paiement.",
  },
  {
    q: "Quelle est la différence entre les canaux ?",
    a: "Chaque &quot;canal&quot; correspond à un mode de communication : email, SMS, Push notification, DM Instagram/TikTok. Le plan Free inclut 1 canal (email). Le plan Pro en inclut 3 (email, SMS, Push). Le plan Enterprise débloque 5+ canaux, y compris les DM et l'API.",
  },
];

/* ─── Plan card ─── */
function PlanCard({
  plan,
  annual,
  index,
  visible,
}: {
  plan: Plan;
  annual: boolean;
  index: number;
  visible: boolean;
}) {
  const Icon = plan.icon;
  const price = annual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      className={`flex flex-col ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${index * 150}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 150}ms`,
      }}
    >
      <div
        className={`card-accent h-full flex flex-col p-8 md:p-10`}
        style={{
          background: plan.highlighted ? "var(--color-dark-surface)" : "rgba(42, 36, 32, 0.5)",
          border: plan.highlighted
            ? "1px solid var(--color-accent-border)"
            : "1px solid rgba(245, 240, 235, 0.06)",
        }}
      >
        {/* Highlighted badge */}
        {plan.highlighted && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 text-[0.6rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              background: "var(--color-accent-muted)",
              color: "var(--color-accent)",
            }}
          >
            <Zap size={10} />
            Le plus populaire
          </div>
        )}

        {/* Header */}
        <div
          className="w-10 h-10 flex items-center justify-center mb-5"
          style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
        >
          <Icon size={18} />
        </div>

        <h3 className="font-display text-2xl font-bold" style={{ color: "var(--color-dark-text)" }}>
          {plan.name}
        </h3>
        <p className="text-sm mt-1 mb-6" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
          {plan.tagline}
        </p>

        {/* Price */}
        <div className="mb-8">
          <span className="font-display text-[2.8rem] font-bold leading-none" style={{ color: "var(--color-dark-text)" }}>
            {price === 0 ? "Gratuit" : `${price}€`}
          </span>
          {price > 0 && (
            <span className="text-sm ml-1" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
              /{annual ? "an" : "mois"}
            </span>
          )}
          {annual && plan.annualPrice > 0 && (
            <p className="text-xs mt-1" style={{ color: "var(--color-success)" }}>
              Soit {Math.round(plan.annualPrice / 12)}€/mois (économisez{" "}
              {plan.monthlyPrice * 12 - plan.annualPrice}€)
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-10">
          {plan.features.map((feat, fi) => (
            <li
              key={fi}
              className="flex items-start gap-3 text-sm"
              style={{
                color: feat.included
                  ? "rgba(245, 240, 235, 0.75)"
                  : "rgba(245, 240, 235, 0.2)",
              }}
            >
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0"
                style={{
                  color: feat.included
                    ? "var(--color-success)"
                    : "rgba(245, 240, 235, 0.15)",
                }}
              />
              <span>{feat.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={plan.ctaHref}
          className="inline-flex items-center justify-center gap-2 w-full py-4 text-[0.75rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: plan.highlighted ? "var(--color-accent)" : "transparent",
            color: plan.highlighted ? "#F5F0EB" : "var(--color-dark-text)",
            border: plan.highlighted ? "none" : "1px solid rgba(245, 240, 235, 0.15)",
          }}
          onMouseEnter={(e) => {
            if (!plan.highlighted) {
              (e.currentTarget as HTMLElement).style.background = "rgba(245, 240, 235, 0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!plan.highlighted) {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }
          }}
        >
          {plan.cta}
          <ArrowRight size={12} />
        </Link>

        {/* Zero ban badge */}
        {price > 0 && (
          <div
            className="flex items-center justify-center gap-1.5 mt-4 text-[0.6rem] font-sans font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--color-success)" }}
          >
            <ShieldCheck size={10} />
            Protection anti-ban proactive
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── FAQ accordion ─── */
function FaqItem({
  faq,
  index,
  visible,
}: {
  faq: (typeof faqs)[0];
  index: number;
  visible: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b py-5"
      style={{
        borderColor: "rgba(245, 240, 235, 0.06)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.5s ease-out ${index * 100}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span
          className="text-sm md:text-base font-semibold flex-1"
          style={{ color: "var(--color-dark-text)" }}
        >
          {faq.q}
        </span>
        <span
          className="text-lg shrink-0 transition-transform duration-300"
          style={{
            color: "var(--color-accent)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "300px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.6)" }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const plansRef = useRef<HTMLDivElement>(null);
  const [plansVisible, setPlansVisible] = useState(false);

  const faqRef = useRef<HTMLDivElement>(null);
  const [faqVisible, setFaqVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = plansRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlansVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = faqRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setFaqVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div style={{ background: "#1A1614" }}>
      {/* ════════════════════════════════════════ */}
      {/* HEADER                                   */}
      {/* ════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full opacity-[0.03] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)",
          }}
        />

        <div ref={headerRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            <ShieldCheck size={12} />
            Protection anti-ban proactive sur toutes les offres
          </div>

          <h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Des prix transparents
          </h1>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            Pas de frais cachés. Pas de surprise. Vous ne payez que ce que vous
            utilisez.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* TOGGLE Annual / Monthly                  */}
      {/* ════════════════════════════════════════ */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 mb-12">
        <div
          className="flex items-center justify-center gap-4"
          style={{
            opacity: headerVisible ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.4s",
          }}
        >
          <span
            className="text-sm font-sans font-medium"
            style={{
              color: annual ? "rgba(245, 240, 235, 0.4)" : "var(--color-dark-text)",
            }}
          >
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full transition-colors duration-300"
            style={{
              background: annual ? "var(--color-accent)" : "rgba(245, 240, 235, 0.15)",
            }}
          >
            <span
              className="absolute top-1 w-5 h-5 rounded-full transition-transform duration-300"
              style={{
                background: "#F5F0EB",
                transform: annual ? "translateX(32px)" : "translateX(4px)",
              }}
            />
          </button>
          <span
            className="text-sm font-sans font-medium"
            style={{
              color: annual ? "var(--color-dark-text)" : "rgba(245, 240, 235, 0.4)",
            }}
          >
            Annuel
            <span
              className="ml-1.5 text-[0.6rem] font-sans font-semibold uppercase"
              style={{ color: "var(--color-success)" }}
            >
              -2 mois
            </span>
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════ */}
      {/* PLANS                                    */}
      {/* ════════════════════════════════════════ */}
      <section ref={plansRef} className="pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                annual={annual}
                index={i}
                visible={plansVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ZERO BAN BADGE                           */}
      {/* ════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div
            className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            style={{
              opacity: plansVisible ? 1 : 0,
              transition: "opacity 0.7s ease-out",
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center shrink-0"
              style={{ background: "rgba(122, 154, 101, 0.1)", color: "var(--color-success)" }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold mb-2" style={{ color: "var(--color-dark-text)" }}>
                Protection anti-ban proactive sur tous les plans
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.55)" }}>
                Si votre compte est restreint à cause d&apos;une action initiée par Atlas,
                nous vous remboursons les 12 derniers mois d&apos;abonnement. C&apos;est notre
                engagement, sous réserve du respect de nos recommandations de configuration.
              </p>
            </div>
            <Link
              href="/atlas/conformite"
              className="shrink-0 text-sm font-semibold underline underline-offset-4 whitespace-nowrap"
              style={{ color: "var(--color-accent)" }}
            >
              En savoir plus →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* FAQ                                      */}
      {/* ════════════════════════════════════════ */}
      <section ref={faqRef} className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12">
          <h2
            className="font-display text-[1.8rem] md:text-[2.5rem] font-bold uppercase tracking-[-0.02em] text-center mb-12"
            style={{ color: "var(--color-dark-text)" }}
          >
            Questions fréquentes
          </h2>

          <div>
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} visible={faqVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* CTA                                      */}
      {/* ════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <h2
            className="font-display text-[1.8rem] md:text-[2.8rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{ color: "var(--color-dark-text)" }}
          >
            Pas convaincu ?
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-md mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Commencez gratuitement. Pas de carte bancaire. Pas d&apos;engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Essayer gratuitement
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
