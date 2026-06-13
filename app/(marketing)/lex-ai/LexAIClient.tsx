"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, AlertTriangle, Scale } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import { LexLandingSection } from "@/components/halo-lex/LexLandingSection";

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

function PhraseForte({ texte }: { texte: string }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={24} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[1.25rem] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          {texte}
        </motion.p>
      </div>
    </section>
  );
}

const COMMENT_CA_MARCHE = [
  { step: "1", titre: "Posez votre question", description: "Décrivez votre situation ou importez un document. Lex analyse le contexte et identifie les enjeux juridiques." },
  { step: "2", titre: "Analyse et explication", description: "Lex consulte sa base juridique et vous explique les points clés en langage clair, avec références aux textes applicables." },
  { step: "3", titre: "Actions concrètes", description: "Lex vous propose des actions : générer une lettre, structurer un dossier, identifier les clauses à renégocier." },
  { step: "4", titre: "Orientation si nécessaire", description: "Si votre situation dépasse le cadre de l'assistance préparatoire, Lex vous oriente vers un avocat partenaire." },
];

const FAQ = [
  { q: "WTF Lex remplace-t-il un avocat ?", r: "Non. WTF Lex est un outil d'aide à la compréhension et à la préparation. Il ne remplace pas un avocat et ne constitue pas un exercice illégal du droit. Pour toute décision juridique, consultez un professionnel." },
  { q: "Mes données sont-elles protégées ?", r: "Oui. Toutes les conversations avec Lex sont chiffrées de bout en bout. Vos documents sont stockés de manière sécurisée. Nous ne partageons aucune donnée sans votre consentement explicite." },
  { q: "Quels plans ont accès à WTF Lex ?", r: "L'analyse de base est accessible à tous les créateurs. Les fonctionnalités avancées (génération de lettres, dossier complet, mise en relation avocat) sont incluses dans les plans Premium, Elite et Icon." },
  { q: "Dans quelles langues puis-je utiliser Lex ?", r: "Lex comprend et répond en français et en anglais. La génération de lettres est disponible en français, anglais, espagnol, portugais, allemand et italien." },
  { q: "Lex connaît-il les CGU des plateformes ?", r: "Lex est entraîné sur les CGU d'OnlyFans, Fansly, MYM, Instagram, TikTok, YouTube, Twitter/X et Twitch. Ces connaissances sont mises à jour régulièrement, mais un décalage avec les dernières versions est possible." },
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

export function LexAIClient() {
  return (
    <main>
      <HeroSection />
      <CommentCaMarcheSection />
      <PhraseForte texte="«&nbsp;L'IA prépare, l'humain décide, l'avocat conseille. Dans cet ordre.&nbsp;»" />
      <LexLandingSection />
      <DisclaimerSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Lex AI ,  Assistant juridique préparatoire
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Votre conseiller juridique IA
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-6" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          WTF Lex est votre première ligne de compréhension juridique. Une IA spécialisée créateurs pour analyser, expliquer et préparer, sans remplacer un avocat.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/halo/lex" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer WTF Lex <ArrowRight size={14} /></Link>
          <Link href="/lex" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>En savoir plus</Link>
        </motion.div>
      </div>
    </section>
  );
}

function CommentCaMarcheSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Fonctionnement
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Comment ça marche
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ maxWidth: 900, margin: "0 auto" }}>
          {COMMENT_CA_MARCHE.map((item, i) => (
            <motion.div key={item.step} className="text-center p-5" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.07}>
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)", fontFamily: "var(--font-display-alt), serif", fontSize: "1.1rem", fontWeight: 700 }}>
                {item.step}
              </div>
              <h3 className="text-[14px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DisclaimerSection() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="flex items-center justify-center gap-2 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <Scale size={20} style={{ color: "var(--or)" }} />
          <AlertTriangle size={16} style={{ color: "#C44536" }} />
        </motion.div>
        <motion.p className="text-[14px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          WTF Lex fournit une aide à la compréhension des documents juridiques et ne remplace pas un avocat. Il ne constitue pas un exercice illégal du droit. Pour des conseils juridiques personnalisés, nous vous recommandons de consulter un professionnel du droit.
        </motion.p>
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
          Tout savoir sur Lex AI
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
          Prêt à sécuriser votre activité ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Essayez WTF Lex gratuitement. Importez un document, posez une question, découvrez ce que Lex peut faire pour vous.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/halo/lex" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Commencer avec WTF Lex <ArrowRight size={14} /></Link>
          <Link href="/pricing" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>Voir les offres</Link>
        </motion.div>
      </div>
    </section>
  );
}
