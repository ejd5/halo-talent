"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, CheckCircle2, Zap, Users, BarChart3, ShieldCheck } from "lucide-react";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: d } }),
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
};

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

const PLANS: Plan[] = [
  {
    name: "Free",
    tagline: "Pour découvrir Atlas",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Users,
    features: [
      { text: "1 canal (email)", included: true },
      { text: "Jusqu'à 100 fans", included: true },
      { text: "Templates email de base", included: true },
      { text: "Statistiques simplifiées", included: true },
      { text: "SMS / Push", included: false },
      { text: "Moteur de règles", included: false },
      { text: "Funnels automatisés", included: false },
      { text: "Analytics avancé", included: false },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/dashboard/atlas/onboarding",
  },
  {
    name: "Pro",
    tagline: "Pour les créateurs en croissance",
    monthlyPrice: 29,
    annualPrice: 290,
    icon: Zap,
    features: [
      { text: "3 canaux (email, SMS, Push)", included: true },
      { text: "Jusqu'à 10 000 fans", included: true },
      { text: "Templates avancés + personnalisation", included: true },
      { text: "Moteur de règles \"Si-Alors\"", included: true },
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
      { text: "Fans illimités", included: true },
      { text: "API Webhooks & custom integrations", included: true },
      { text: "Conformité avancée (audit, logs, DPO)", included: true },
      { text: "Workflows visuels illimités", included: true },
      { text: "Modération IA incluse", included: true },
      { text: "SLAs & support prioritaire 24/7", included: true },
      { text: "Onboarding dédié", included: true },
      { text: "Multi-comptes & rôles", included: true },
    ],
    cta: "Contacter l'équipe",
    ctaHref: "/dashboard/atlas/onboarding?plan=enterprise",
  },
];

const FAQ_ATLAS = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui. Vous pouvez passer du plan Free au plan Pro (ou Enterprise) quand vous voulez. Le passage est immédiat et vous ne perdez aucune donnée. Si vous décidez de réduire votre plan, les fonctionnalités non incluses sont simplement désactivées.",
  },
  {
    q: "Comment Atlas protège-t-il contre les restrictions de compte ?",
    a: "Atlas intègre des limites de taux, une vérification de contenu et un suivi de conformité pour aider à réduire les risques. Si une action initiée par Atlas cause la suspension de votre compte, nous remboursons les 12 derniers mois d'abonnement, sous réserve du respect de nos recommandations.",
  },
  {
    q: "Les prix sont-ils TTC ?",
    a: "Oui, tous les prix affichés sont TTC (TVA incluse). Pour les clients professionnels, une facture avec TVA intracommunautaire est générée automatiquement à chaque paiement.",
  },
  {
    q: "Quelle est la différence entre les canaux ?",
    a: "Chaque \"canal\" correspond à un mode de communication : email, SMS, Push notification, DM Instagram/TikTok. Le plan Free inclut 1 canal (email). Le plan Pro en inclut 3 (email, SMS, Push). Le plan Enterprise débloque 5+ canaux, y compris les DM et l'API.",
  },
  {
    q: "Y a-t-il des frais cachés ?",
    a: "Non. Les prix affichés sont les prix complets. Pas de frais d'installation, pas de frais de résiliation, pas de surprise. L'abonnement est le seul coût, et vous pouvez l'arrêter à tout moment.",
  },
];

export function AtlasPricingClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <PlansSection />
      <ProtectionSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Atlas CRM
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Des prix transparents<br />pour Atlas CRM
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Automatisation marketing, segmentation fans et campagnes multi-canal. Pas de frais cachés. Pas de surprise.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#plans" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les plans</Link>
          <Link href="/atlas" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Découvrir Atlas <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function PourquoiSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Notre approche
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Pourquoi un CRM pensé pour les créateurs
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Les CRM traditionnels sont conçus pour des forces de vente B2B, pipelines, leads, deals. Un créateur n'a pas de pipeline. Il a des fans, des abonnés, des communautés. La relation n'est pas transactionnelle, elle est continue.</p>
          <p>Atlas CRM a été conçu spécifiquement pour cette réalité : suivre les fans à travers les plateformes, segmenter par niveau d'engagement, automatiser les campagnes sans perdre la personnalisation, et mesurer ce qui compte vraiment, la rétention, la conversion, la valeur à long terme.</p>
          <p>Trois plans, une logique : Free pour découvrir, Pro pour structurer, Enterprise pour scaler. Pas d'engagement. Pas de frais cachés. Vous pouvez changer de plan à tout moment.</p>
        </motion.div>
      </div>
    </section>
  );
}

function PlansSection() {
  const { ref, inView } = useReveal(0.08);
  const [annual, setAnnual] = useState(false);

  return (
    <section ref={ref} id="plans" className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 1060, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Plans
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Choisissez votre plan Atlas
        </motion.h2>

        {/* Annual toggle */}
        <motion.div className="flex items-center justify-center gap-4 mb-12" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.14}>
          <span className="text-[14px]" style={{ color: annual ? "var(--pierre)" : "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>Mensuel</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ background: annual ? "var(--or)" : "rgba(244,238,227,0.2)" }}
          >
            <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: annual ? "translateX(28px)" : "translateX(4px)" }} />
          </button>
          <span className="text-[14px]" style={{ color: annual ? "var(--ivoire)" : "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
            Annuel <span style={{ color: "#5A7D4A", fontSize: "0.65rem", fontFamily: "var(--font-util), monospace", textTransform: "uppercase" }}>-2 mois</span>
          </span>
        </motion.div>

        {/* Plan cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.2}>
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div key={plan.name} className={`flex flex-col p-8 ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`} style={{ border: plan.highlighted ? "1px solid var(--or)" : "1px solid var(--ligne-faible)", background: plan.highlighted ? "rgba(216,169,91,0.04)" : "rgba(244,238,227,0.02)" }}>
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]" style={{ background: "rgba(216,169,91,0.15)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                    <Zap size={10} />Le plus populaire
                  </div>
                )}
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                  <Icon size={18} />
                </div>
                <h3 className="text-[1.3rem] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{plan.name}</h3>
                <p className="text-[13px] mb-6" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{plan.tagline}</p>
                <div className="mb-8">
                  <span className="text-[2.5rem] font-bold leading-none" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                    {price === 0 ? "Gratuit" : `${price}€`}
                  </span>
                  {price > 0 && <span className="text-sm ml-1" style={{ color: "var(--pierre)" }}>/{annual ? "an" : "mois"}</span>}
                  {annual && plan.annualPrice > 0 && (
                    <p className="text-xs mt-1" style={{ color: "#5A7D4A", fontFamily: "var(--font-body), sans-serif" }}>
                      Soit {Math.round(plan.annualPrice / 12)}€/mois (économisez {plan.monthlyPrice * 12 - plan.annualPrice}€)
                    </p>
                  )}
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-[13px]" style={{ color: feat.included ? "var(--ivoire)" : "rgba(244,238,227,0.25)", fontFamily: "var(--font-body), sans-serif" }}>
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: feat.included ? "var(--or)" : "rgba(244,238,227,0.12)" }} />
                      {feat.text}
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaHref} className="inline-flex items-center justify-center gap-2 w-full py-4 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-all" style={{ background: plan.highlighted ? "var(--or)" : "transparent", color: plan.highlighted ? "var(--encre)" : "var(--ivoire)", border: plan.highlighted ? "none" : "1px solid var(--ligne)", fontFamily: "var(--font-util), monospace" }}>
                  {plan.cta}
                  <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProtectionSection() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex flex-col md:flex-row items-start gap-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-14 h-14 flex items-center justify-center shrink-0" style={{ background: "rgba(90,125,74,0.1)", color: "#5A7D4A" }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-[1.1rem] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Protection anti-ban proactive sur tous les plans</h3>
            <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
              Si votre compte est restreint à cause d'une action initiée par Atlas, nous vous remboursons les 12 derniers mois d'abonnement. C'est notre engagement, sous réserve du respect de nos recommandations de configuration.
            </p>
            <Link href="/atlas/conformite" className="text-[14px] font-semibold underline underline-offset-4" style={{ color: "var(--or)" }}>
              En savoir plus sur la conformité →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.08);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Tout savoir sur Atlas CRM
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {FAQ_ATLAS.map((faq, i) => (
            <div key={i} style={{ border: "1px solid rgba(244,238,227,0.08)", background: openIndex === i ? "rgba(244,238,227,0.03)" : "transparent", transition: "background 0.2s" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left" style={{ background: "none", border: "none", cursor: "pointer" }} aria-expanded={openIndex === i}>
                <span className="text-[15px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{faq.q}</span>
                <ChevronDown size={16} style={{ transform: openIndex === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--or)", flexShrink: 0 }} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--creme)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.4, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Pas convaincu ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Commencez gratuitement. Pas de carte bancaire. Pas d'engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/dashboard/atlas/onboarding" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer gratuitement <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}
