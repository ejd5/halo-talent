"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Globe, FileText, CreditCard, Shield, HelpCircle } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

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

const POURQUOI_POINTS = [
  "Les plateformes modifient régulièrement leurs conditions d'utilisation, parfois sans notification explicite.",
  "Une nouvelle clause peut affecter vos revenus, vos droits, ou votre visibilité sans que vous le sachiez.",
  "Les changements de politique de contenu peuvent rendre votre activité soudainement non conforme.",
  "Documenter les changements vous protège en cas de litige : vous pouvez prouver ce qui était en vigueur à une date donnée.",
];

const FAQ = [
  { q: "À quelle fréquence les plateformes changent-elles leurs règles ?", r: "Cela varie. Certaines plateformes modifient leurs CGU tous les 3-6 mois, d'autres une fois par an. Les politiques de contenu et de paiement évoluent plus fréquemment. Nous scannons les principales plateformes chaque semaine." },
  { q: "Que faire si une nouvelle règle affecte mon activité ?", r: "D'abord, lisez le changement pour comprendre sa portée exacte. Ensuite, évaluez si votre activité est concernée. Si le changement est significatif, nous vous recommandons de consulter un professionnel du droit pour évaluer vos options." },
  { q: "WTF peut-il m'alerter automatiquement des changements ?", r: "Nous travaillons sur un système d'alertes personnalisées par plateforme et par type de changement. Pour le moment, cette page est votre source la plus à jour. Les utilisateurs Premium et Elite reçoivent des notifications prioritaires." },
  { q: "Les informations de cette page sont-elles garanties ?", r: "Non. Nous faisons de notre mieux pour détecter et résumer les changements avec précision, mais nous ne pouvons pas garantir l'exhaustivité ni l'absence d'erreur. Cette page est un outil d'information, pas un conseil juridique." },
  { q: "Puis-je me fier uniquement à cette page pour ma conformité ?", r: "Non. Cette page est un point de départ pour votre veille personnelle. Nous vous recommandons de toujours lire les CGU officielles des plateformes que vous utilisez et de consulter un avocat pour les questions spécifiques à votre situation." },
];

function FAQItem({ q, r }: { q: string; r: string }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ border: "1px solid var(--ligne-faible)" }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: ouvert ? "rgba(216,169,91,0.04)" : "transparent", transition: "background 0.3s ease" }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function ChangementsClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <PlateformesSection />
      <ChangementsContractuelsSection />
      <PolitiqueContenuSection />
      <ChangementsPaiementSection />
      <ChangementsConformiteSection />
      <CommentHaloAideSection />
      <QuandConsulterSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 80 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Veille juridique
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Journal des changements
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Les règles des plateformes évoluent en permanence. Nous les surveillons pour vous, avec prudence et transparence.
        </motion.p>
      </div>
    </section>
  );
}

function PourquoiSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} id="pourquoi" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Pourquoi suivre les changements
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que vous ne savez pas peut vous coûter cher
        </motion.h2>
        <motion.div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {POURQUOI_POINTS.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <span style={{ color: "var(--or)", fontWeight: 700, flexShrink: 0 }}>, </span>
              <span>{point}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PlateformesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <SectionDetaillee
      ref={ref}
      inView={inView}
      icon={Globe}
      titre="Plateformes et règles mouvantes"
      fond="var(--encre)"
      couleurTexte="var(--ivoire)"
      couleurSecondaire="var(--pierre)"
    >
      <p>Instagram, TikTok, YouTube, OnlyFans, Fansly, MYM, Twitch, Twitter/X, chaque plateforme a ses propres conditions d'utilisation, qui évoluent de façon autonome et parfois sans préavis.</p>
      <p>Un changement peut concerner : les types de contenu autorisés, les restrictions d'âge, les règles de monétisation, les algorithmes de visibilité, ou les obligations de transparence.</p>
      <p>Notre veille scanne régulièrement les CGU des principales plateformes. Les changements détectés sont analysés, résumés, et publiés ci-dessous avec un indicateur d'impact.</p>
    </SectionDetaillee>
  );
}

function ChangementsContractuelsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <SectionDetaillee
      ref={ref}
      inView={inView}
      icon={FileText}
      titre="Changements contractuels"
      fond="var(--creme)"
      couleurTexte="var(--encre)"
      couleurSecondaire="var(--encre)"
    >
      <p>Les modifications de CGU sont des changements contractuels unilatéraux. La plateforme modifie les termes, et vous devez les accepter pour continuer à utiliser le service. Vous n'avez généralement pas de marge de négociation.</p>
      <p>Les changements les plus fréquents concernent : les clauses de responsabilité, les droits que vous concédez à la plateforme sur votre contenu, les limitations d'utilisation, et les procédures de réclamation.</p>
      <p>Nous résumons chaque changement dans un langage clair, en indiquant les articles concernés et le niveau d'impact estimé pour les créateurs.</p>
    </SectionDetaillee>
  );
}

function PolitiqueContenuSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <SectionDetaillee
      ref={ref}
      inView={inView}
      icon={FileText}
      titre="Changements de politique de contenu"
      fond="var(--encre)"
      couleurTexte="var(--ivoire)"
      couleurSecondaire="var(--pierre)"
    >
      <p>Les politiques de contenu définissent ce que vous pouvez (et ne pouvez pas) publier. Elles couvrent : la nudité, le langage, les sujets sensibles, les droits d'auteur, les marques, et les contenus sponsorisés.</p>
      <p>Ces politiques évoluent souvent en réaction à des événements extérieurs : pression des annonceurs, régulation gouvernementale, scandales médiatiques. Un contenu conforme aujourd'hui peut devenir non conforme demain.</p>
      <p>Notre veille surveille ces changements et vous alerte sur ceux qui pourraient impacter votre type de contenu.</p>
    </SectionDetaillee>
  );
}

function ChangementsPaiementSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <SectionDetaillee
      ref={ref}
      inView={inView}
      icon={CreditCard}
      titre="Changements de paiement"
      fond="var(--creme)"
      couleurTexte="var(--encre)"
      couleurSecondaire="var(--encre)"
    >
      <p>Les conditions de paiement définissent comment et quand vous êtes rémunéré. Elles peuvent changer sur : le pourcentage de commission de la plateforme, les seuils minimum de retrait, les délais de versement, ou les frais de traitement.</p>
      <p>Un changement de commission de quelques pourcents peut représenter des milliers d'euros sur une année. Ces changements sont parfois communiqués de manière peu visible.</p>
      <p>Nous résumons chaque changement tarifaire avec son impact estimé pour différents niveaux de revenus.</p>
    </SectionDetaillee>
  );
}

function ChangementsConformiteSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <SectionDetaillee
      ref={ref}
      inView={inView}
      icon={Shield}
      titre="Changements de conformité"
      fond="var(--encre)"
      couleurTexte="var(--ivoire)"
      couleurSecondaire="var(--pierre)"
    >
      <p>Les obligations de conformité évoluent avec les réglementations : RGPD, DSA (Digital Services Act), régulation des influenceurs, obligations de transparence publicitaire, lutte contre le blanchiment.</p>
      <p>Ces changements peuvent vous imposer de nouvelles obligations : déclaration de revenus spécifique, mention de contenu sponsorisé, vérification d'identité renforcée, ou collecte de consentements supplémentaires.</p>
      <p>Notre veille couvre les évolutions réglementaires européennes et françaises qui concernent les créateurs de contenu.</p>
    </SectionDetaillee>
  );
}

function CommentHaloAideSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Notre rôle
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Comment WTF vous aide à documenter
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>WTF ne se contente pas de vous informer des changements. Nous vous aidons à les documenter pour protéger votre activité sur le long terme.</p>
          <p>Chaque changement détecté est horodaté, résumé, et archivé. Vous pouvez consulter l'historique à tout moment. En cas de litige avec une plateforme, vous pouvez démontrer ce qui était en vigueur à une date donnée et comment vous avez adapté votre activité.</p>
          <p>Les utilisateurs d'Atlas CRM peuvent relier chaque changement à leurs contacts et campagnes, créant un fil documentaire continu en cas d'audit ou de contestation.</p>
        </motion.div>
      </div>
    </section>
  );
}

function QuandConsulterSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <HelpCircle size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Quand demander un avis professionnel</h2>
        </motion.div>
        <motion.div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si un changement affecte directement votre source principale de revenus.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si une nouvelle règle rend votre contenu actuel potentiellement non conforme.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si vous recevez un avertissement ou une menace de suspension.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si le changement implique des obligations légales complexes (fiscalité, déclaration, protection des données).</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>En cas de doute. Un avis juridique coûte moins cher qu'un litige.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionDetaillee({
  ref,
  inView,
  icon: Icon,
  titre,
  fond,
  couleurTexte,
  couleurSecondaire,
  children,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
  icon: React.ElementType;
  titre: string;
  fond: string;
  couleurTexte: string;
  couleurSecondaire: string;
  children: React.ReactNode;
}) {
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: fond, paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Icon size={22} />
          </div>
          <h2 className="display-small" style={{ color: couleurTexte }}>{titre}</h2>
        </motion.div>
        <motion.div className="space-y-4 text-[15px] leading-relaxed" style={{ color: couleurSecondaire, opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Veille juridique
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} />
            </motion.div>
          ))}
        </div>
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
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Restez informé, protégez votre activité
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Consultez régulièrement cette page pour suivre l'évolution des règles qui impactent votre activité de créateur.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/lex" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Découvrir WTF Lex <ArrowRight size={14} /></Link>
          <Link href="/protection" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>Protéger mon activité</Link>
        </motion.div>
      </div>
    </section>
  );
}
