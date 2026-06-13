"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import { PricingTabs, type PricingTab } from "@/components/pricing/PricingTabs";
import { PricingPlans, STUDIO_PLANS, ATLAS_PLANS } from "@/components/pricing/PricingPlans";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { CreditPacks } from "@/components/pricing/CreditPacks";
import { CommissionSimulator } from "@/components/pricing/CommissionSimulator";

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

function SectionBlock({ label, title, children, bg = "encre" }: { label: string; title: string; children: React.ReactNode; bg?: "encre" | "creme" }) {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: bg === "creme" ? "var(--creme)" : "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          {label}
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: bg === "creme" ? "var(--encre)" : "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          {title}
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: bg === "creme" ? "var(--encre)" : "var(--pierre)", opacity: bg === "creme" ? 0.7 : 1, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function PhraseForte({ children, bg = "encre" }: { children: React.ReactNode; bg?: "encre" | "creme" }) {
  const { ref, inView } = useReveal(0.25);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: bg === "creme" ? "var(--creme)" : "var(--encre)", paddingTop: 70, paddingBottom: 70 }}>
      <div className="wrap-eco" style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.blockquote className="display-medium mb-0" style={{ color: bg === "creme" ? "var(--encre)" : "var(--ivoire)", fontStyle: "normal" }} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: "easeOut" }}>
          {children}
        </motion.blockquote>
      </div>
    </section>
  );
}

const CONTROL_LEVELS = [
  { niveau: "Pour démarrer", controle: "Maximum", profil: "Créateur en début d'activité, besoin d'accompagnement complet", modele: "Commission 30% + outils essentiels inclus", autonomie: "Guidé, l'équipe WTF est très présente" },
  { niveau: "Pour structurer", controle: "Élevé", profil: "Créateur avec revenus récurrents, besoin d'outils et de stratégie", modele: "Commission 20-25% + options modulaires", autonomie: "Co-piloté, vous décidez, nous exécutons" },
  { niveau: "Pour accélérer", controle: "Partagé", profil: "Créateur établi, besoin de scalabilité et d'international", modele: "Commission 10-15% + services avancés", autonomie: "Autonome, nous intervenons sur les points clés" },
  { niveau: "Sur mesure", controle: "Configurable", profil: "Équipes, studios, collectifs avec besoins spécifiques", modele: "Sur devis, commission négociée + services dédiés", autonomie: "À la carte, vous composez votre accompagnement" },
];

const BESOIN_OFFRE = [
  { besoin: "Je veux comprendre mes revenus", offre: "Atlas CRM (gratuit)", options: "Reporting personnalisé (option)" },
  { besoin: "Je veux déléguer la gestion quotidienne", offre: "Management (commission)", options: "Chat AI pour les conversations" },
  { besoin: "Je veux produire plus de contenu", offre: "Studio IA (abonnement)", options: "Direction artistique dédiée" },
  { besoin: "Je veux protéger mon image", offre: "Bouclier Légal (inclus)", options: "WTF Lex analyse approfondie" },
  { besoin: "Je veux développer ma marque", offre: "Stratégie (commission)", options: "Brand deals internationaux" },
  { besoin: "Je veux automatiser mes fans", offre: "Atlas Pro (29€/mois)", options: "Workflows visuels avancés" },
  { besoin: "J'ai une équipe à coordonner", offre: "Sur devis", options: "Multi-comptes, rôles, API" },
  { besoin: "Je ne sais pas par où commencer", offre: "Démo gratuite", options: "Audit personnalisé offert" },
];

const FAQ_PRICE = [
  { q: "Les prix affichés sont-ils définitifs ?", a: "Les prix des abonnements (Atlas, Studio) sont publics et fixes. Les commissions suivent le barème marginal publié. Les services sur mesure font l'objet d'un devis personnalisé, discuté et validé avec vous avant tout engagement." },
  { q: "Y a-t-il des frais cachés ?", a: "Non. Tous nos tarifs sont publics. Il n'y a pas de frais d'entrée, pas de frais de dossier, pas de frais de résiliation. Vous ne payez que ce qui est convenu à l'avance." },
  { q: "Puis-je changer de formule en cours de route ?", a: "Oui, à tout moment. Si vous passez à une formule supérieure, la différence est calculée au prorata. Si vous réduisez, les fonctionnalités non incluses sont simplement désactivées, vous ne perdez aucune donnée." },
  { q: "Comment fonctionne la facturation ?", a: "Les abonnements sont facturés mensuellement ou annuellement (avec 2 mois offerts). Les commissions sont prélevées mensuellement sur la base d'un décompte détaillé que vous recevez avant tout prélèvement." },
  { q: "Proposez-vous des tarifs pour les équipes ?", a: "Oui. Pour les studios, agences ou collectifs, nous concevons une offre sur mesure avec gestion multi-comptes, rôles personnalisés et coordination dédiée. Contactez-nous pour un devis." },
];

export function PricingClient() {
  return (
    <main>
      <HeroSection />

      <SectionBlock label="Notre approche" title="Pourquoi tout est public" bg="creme">
        <p>Dans notre industrie, les tarifs sont souvent cachés, négociés dans le secret, différents pour chaque client. Nous faisons le choix inverse : tout est public. Nos commissions, nos abonnements, nos options, tout est documenté et accessible.</p>
        <p>Ce n'est pas seulement une question d'éthique. C'est une question d'efficacité. Quand les prix sont publics, le créateur peut comparer, projeter et décider en connaissance de cause. Il n'y a pas de mauvaise surprise. Il n'y a pas de négociation cachée dont il ne voit pas le résultat.</p>
        <p>Un tarif public, c'est aussi une discipline pour nous. Cela nous oblige à justifier notre valeur chaque mois. Si nous ne la créons pas, cela se voit. Si nous la créons, cela se voit aussi.</p>
      </SectionBlock>

      <PhraseForte>Des prix publics. Une relation claire.</PhraseForte>

      {/* Structure de pricing */}
      <StructureSection />

      <PhraseForte bg="creme">Vous ne payez que ce dont vous avez besoin.</PhraseForte>

      {/* Tabbed pricing content, existing components */}
      <TabsSection />

      {/* Niveaux de contrôle */}
      <NiveauxControleSection />

      {/* Besoin / Offre */}
      <BesoinOffreSection />

      {/* FAQ */}
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
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Tarifs transparents
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Tout est public.<br />Comparez, choisissez.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Commissions, abonnements, crédits IA. Aucun frais caché. Aucune surprise.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#pricing-tabs" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres</Link>
          <Link href="/commissions" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Comprendre les commissions <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function StructureSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Structure
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Quatre niveaux, une logique
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CONTROL_LEVELS.map((l, i) => (
            <motion.div key={l.niveau} className="p-7" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.06}>
              <h3 className="text-[1rem] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{l.niveau}</h3>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Contrôle : {l.controle}</p>
              <div className="space-y-3 text-[14px]" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>
                <p><span className="font-semibold" style={{ opacity: 1 }}>Pour qui :</span> {l.profil}</p>
                <p><span className="font-semibold" style={{ opacity: 1 }}>Modèle :</span> {l.modele}</p>
                <p><span className="font-semibold" style={{ opacity: 1 }}>Niveau d'autonomie :</span> {l.autonomie}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TabsSection() {
  const { ref, inView } = useReveal(0.05);
  const [tab, setTab] = useState<PricingTab>("commission");

  return (
    <section ref={ref} id="pricing-tabs" className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos offres
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Choisissez votre formule
        </motion.h2>

        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.16}>
          <PricingTabs active={tab} onChange={setTab} />
        </motion.div>

        <motion.div className="mt-10" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.22}>
          {tab === "commission" && (
            <div>
              <div className="mb-8">
                <CommissionSimulator />
              </div>
              <div className="mt-8">
                <CreditPacks />
              </div>
              <div className="mt-8 text-center">
                <Link href="/commissions" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--or)" }}>
                  En savoir plus sur nos commissions <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {tab === "studio" && (
            <div>
              <PricingPlans plans={STUDIO_PLANS} badge="Studio IA" />
              <div className="mt-12">
                <CreditPacks />
              </div>
            </div>
          )}

          {tab === "atlas" && (
            <div>
              <PricingPlans plans={ATLAS_PLANS} badge="Atlas CRM" />
            </div>
          )}

          {tab === "comparison" && (
            <PricingComparison />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function NiveauxControleSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Autonomie
        </motion.p>
        <motion.h2 className="display-medium mb-4 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Choisir un modèle selon votre niveau de contrôle
        </motion.h2>
        <motion.p className="text-center text-[14px] mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.14}>
          Chaque créateur a un rapport différent à son activité. Nos formules s'adaptent à votre besoin de contrôle, pas l'inverse.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CONTROL_LEVELS.map((l, i) => (
            <motion.div key={l.niveau} className="p-7 flex gap-5" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18 + i * 0.06}>
              <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)", fontSize: "0.9rem", fontWeight: 700, fontFamily: "var(--font-util), monospace" }}>{i + 1}</div>
              <div>
                <h3 className="text-[1rem] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{l.niveau}</h3>
                <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{l.profil}</p>
                <p className="text-[12px] font-medium" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>{l.modele}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BesoinOffreSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Guide
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Quel besoin, quelle offre ?
        </motion.h2>
        <motion.div className="overflow-x-auto" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <table className="w-full text-left border-collapse" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--ivoire)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Votre besoin</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--ivoire)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Offre recommandée</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--ivoire)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Options utiles</th>
              </tr>
            </thead>
            <tbody>
              {BESOIN_OFFRE.map((r, i) => (
                <tr key={r.besoin} style={{ borderBottom: "1px solid rgba(244,238,227,0.06)", background: i % 2 === 0 ? "rgba(244,238,227,0.01)" : "transparent" }}>
                  <td className="py-3 px-5 text-[13px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{r.besoin}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "var(--or)", fontFamily: "var(--font-body), sans-serif" }}>{r.offre}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{r.options}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.08);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Tout ce que vous devez savoir sur nos tarifs
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {FAQ_PRICE.map((faq, i) => (
            <div key={i} style={{ border: "1px solid rgba(12,10,8,0.08)", background: openIndex === i ? "rgba(12,10,8,0.02)" : "white", transition: "background 0.2s" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left" style={{ background: "none", border: "none", cursor: "pointer" }} aria-expanded={openIndex === i}>
                <span className="text-[15px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{faq.q}</span>
                <ChevronDown size={16} style={{ transform: openIndex === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--or)", flexShrink: 0 }} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{faq.a}</p>
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
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à commencer ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Postulez à la maison ou commencez avec le Studio gratuitement. Pas de carte bancaire. Pas d'engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/apply" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Postuler à la maison</Link>
          <Link href="/studio" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Essayer le Studio <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}
