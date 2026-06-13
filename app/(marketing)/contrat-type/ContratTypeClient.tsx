"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, FileText, Clock, Eye, AlertTriangle, Shield, Check, HelpCircle } from "lucide-react";
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

const CLAUSES_A_SURVEILLER = [
  { clause: "Durée d'engagement", description: "Méfiez-vous des durées supérieures à 12 mois sans clause de sortie. Un contrat devrait pouvoir être rompu avec un préavis raisonnable (30 jours), sans pénalités disproportionnées.", signal: true },
  { clause: "Exclusivité", description: "Une clause d'exclusivité peut vous empêcher de travailler avec d'autres partenaires, même pour des projets sans rapport avec l'agence. Vérifiez la portée exacte : quelles activités, quelles plateformes, quelle durée.", signal: true },
  { clause: "Commission", description: "Le taux de commission doit être clair, le mode de calcul explicite, et l'assiette (sur quels revenus) précisée. Méfiez-vous des formulations vagues comme « tous revenus liés à l'activité ».", signal: true },
  { clause: "Droits d'image", description: "Vérifiez l'étendue de la cession : territoire (France, Europe, monde), durée (limitée ou perpétuelle), supports (réseaux sociaux, publicité, produits dérivés). Une cession trop large peut vous empêcher de monétiser votre propre image.", signal: true },
  { clause: "Accès aux comptes", description: "Ne donnez jamais vos identifiants personnels à un tiers. Si l'agence doit publier pour vous, utilisez des outils de gestion de réseaux sociaux qui permettent des accès limités et révocables.", signal: true },
  { clause: "Rupture et pénalités", description: "Les pénalités de rupture doivent être proportionnées au préjudice réel. Une pénalité égale à 12 mois de commissions est généralement considérée comme abusive.", signal: true },
  { clause: "Confidentialité", description: "Une clause de confidentialité est normale, mais elle ne doit pas vous empêcher de parler de votre expérience ou de demander un avis extérieur sur le contrat lui-même.", signal: false },
  { clause: "Données personnelles", description: "Le contrat doit préciser comment vos données personnelles et celles de votre audience sont collectées, utilisées et protégées. Vous devez pouvoir les récupérer et les supprimer.", signal: false },
];

const CHECKLIST = [
  "Avez-vous lu et compris chaque clause du contrat ?",
  "La durée d'engagement et les conditions de sortie sont-elles claires ?",
  "Le taux de commission et son mode de calcul sont-ils explicites ?",
  "L'étendue de la cession des droits d'image est-elle limitée et définie ?",
  "Pouvez-vous continuer à travailler avec d'autres partenaires ?",
  "Conservez-vous la propriété de vos contenus existants et futurs ?",
  "Les pénalités de rupture sont-elles proportionnées ?",
  "Pouvez-vous récupérer vos données à tout moment ?",
  "Avez-vous montré le contrat à un professionnel du droit ?",
  "Si quelque chose n'est pas clair, avez-vous demandé une clarification écrite ?",
];

const FAQ = [
  { q: "Puis-je utiliser le contrat type WTF pour mes propres clients ?", r: "Le contrat type WTF est conçu pour la relation entre WTF et ses talents. Il est publié à titre informatif pour vous aider à comprendre ce qu'un contrat équilibré devrait contenir. Pour vos propres relations contractuelles, nous vous recommandons de faire rédiger un contrat par un avocat." },
  { q: "Le contrat type WTF a-t-il une valeur juridique ?", r: "Le contrat type actuellement en ligne est en cours de finalisation par notre cabinet juridique partenaire. La version définitive sera publiée prochainement. Ce document est fourni à titre informatif et ne constitue pas un conseil juridique." },
  { q: "Pourquoi WTF publie-t-il son contrat type ?", r: "Parce que la transparence commence par l'exemple. Nous pensons que les créateurs doivent pouvoir comparer les contrats avant de s'engager. Publier notre contrat type, c'est vous donner un point de référence pour évaluer d'autres propositions." },
  { q: "Que faire si on me propose un contrat très différent ?", r: "Comparez point par point avec ce que vous savez être équilibré. Utilisez WTF Lex pour analyser les clauses à risque. Si les différences sont importantes, consultez un avocat spécialisé avant de signer." },
  { q: "Le contrat type couvre-t-il tous les types de créateurs ?", r: "Notre contrat type est conçu pour les créateurs de contenu accompagnés par WTF. Chaque situation est unique. Ce document est un cadre général qui peut être adapté en fonction de votre activité spécifique." },
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
        <span className="text-[14px] font-medium pr-4" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function ContratTypeClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <StatusSection />
      <ClausesSurveillerSection />
      <CeQuUnContratNeDoitPasCacherSection />
      <CommentLexAideSection />
      <QuandConsulterSection />
      <ChecklistSection />
      <EngagementsSection />
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
          Transparence contractuelle
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Contrat type créateur
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Comprendre avant de signer. Un guide pour décrypter les clauses essentielles d'un contrat créateur, savoir quoi surveiller, et quand consulter un avocat.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#clauses" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les clauses à surveiller</Link>
          <Link href="/lex" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Analyser avec WTF Lex <ArrowRight size={14} /></Link>
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
          L'essentiel
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Pourquoi un contrat écrit compte
        </motion.h2>
        <motion.div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Un contrat écrit n'est pas un signe de méfiance. C'est un outil de clarté qui protège les deux parties. Il définit ce que chacun attend de l'autre, évite les malentendus, et sert de référence en cas de désaccord.</p>
          <p>Dans le monde des créateurs, beaucoup de relations restent informelles, un accord verbal, un échange de messages. Cela fonctionne jusqu'au jour où cela ne fonctionne plus. Sans contrat écrit, il est très difficile de faire valoir vos droits.</p>
          <p>Un bon contrat est clair, équilibré, et compréhensible sans être juriste. Si vous ne comprenez pas une clause, ne signez pas avant d'avoir obtenu une explication.</p>
        </motion.div>
      </div>
    </section>
  );
}

function StatusSection() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="p-6" style={{ border: "1px solid rgba(196,69,54,0.2)", background: "rgba(196,69,54,0.04)" }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "var(--or)" }}>
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold mb-2" style={{ color: "var(--or)", fontFamily: "var(--font-display-alt), serif" }}>Document en cours de finalisation</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Notre contrat type est actuellement en révision par notre cabinet juridique partenaire pour intégrer les dernières évolutions réglementaires de 2026. La version définitive sera publiée ici prochainement. En attendant, les principes ci-dessous reflètent fidèlement les engagements que nous prenons avec chaque talent.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ClausesSurveillerSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="clauses" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Vigilance
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les clauses à surveiller
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          {CLAUSES_A_SURVEILLER.map((item, i) => (
            <motion.div key={item.clause} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
              <div className="p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                <div className="flex items-center gap-2 mb-2">
                  {item.signal && <AlertTriangle size={14} style={{ color: "#C44536", flexShrink: 0 }} />}
                  <h3 className="text-[14px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.clause}</h3>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CeQuUnContratNeDoitPasCacherSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Transparence
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce qu'un contrat ne doit pas cacher
        </motion.h2>
        <motion.div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--or)", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Un contrat doit indiquer clairement <strong style={{ color: "var(--ivoire)" }}>qui fait quoi</strong>, <strong style={{ color: "var(--ivoire)" }}>qui paie quoi</strong>, et <strong style={{ color: "var(--ivoire)" }}>qui possède quoi</strong>. Si ces trois questions n'ont pas de réponse claire, ne signez pas.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--or)", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Les conditions de sortie doivent être explicites : préavis, formalités, conséquences financières, devenir des contenus et des données après la rupture.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--or)", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Les renvois à des documents externes (« conditions générales disponibles sur demande ») sont un signal d'alerte. Tout ce qui vous engage doit figurer dans le contrat que vous signez.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--or)", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Un contrat ne doit pas contenir de clause que vous n'osez pas demander à expliquer. Si une formulation vous semble volontairement obscure, elle l'est probablement.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CommentLexAideSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Eye size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--encre)" }}>Comment WTF Lex peut vous aider</h2>
        </motion.div>
        <motion.div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>WTF Lex est conçu pour vous aider à lire un contrat avant de le soumettre à un avocat. Il identifie les clauses importantes, explique leur signification en langage clair, et signale les points qui méritent une attention particulière.</p>
          <p>Lex ne remplace pas un avocat, il vous aide à mieux préparer votre consultation. En arrivant avec un contrat déjà analysé et des questions précises, vous gagnez du temps et réduisez vos frais juridiques.</p>
          <p>Importez votre contrat dans Lex, obtenez une analyse clause par clause, et préparez vos questions avant de consulter un professionnel du droit.</p>
        </motion.div>
        <motion.div className="mt-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.2}>
          <Link href="/lex-ai" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer WTF Lex <ArrowRight size={14} /></Link>
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
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
            <HelpCircle size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Quand consulter un avocat</h2>
        </motion.div>
        <motion.div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si le contrat implique des montants significatifs (brand deal, partenariat long terme, cession de droits).</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si vous ne comprenez pas une clause même après l'avoir fait analyser par Lex.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si le contrat contient des clauses d'exclusivité, de non-concurrence, ou de cession de droits perpétuelle.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span>Si vous avez un doute, même vague. Un avis juridique coûte moins cher qu'un litige.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChecklistSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Avant de signer
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Checklist avant signature
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          {CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3" style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: "#5A7D4A" }} />
              <span className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function EngagementsSection() {
  const { ref, inView } = useReveal(0.08);
  const engagements = [
    { icon: Clock, titre: "Préavis de 30 jours", description: "Vous pouvez résilier le contrat à tout moment avec un préavis de 30 jours calendaires. Pas de période d'engagement minimum, pas de pénalités de sortie abusives." },
    { icon: FileText, titre: "Aucune cession de propriété intellectuelle", description: "Vous restez l'unique propriétaire de votre contenu, de votre image et de vos données. WTF ne revendique aucun droit de propriété sur vos créations." },
    { icon: Eye, titre: "Commissions transparentes", description: "Notre barème de commission est public, progressif et marginal. Chaque mois, vous recevez un décompte détaillé. Aucun frais caché." },
    { icon: Shield, titre: "Export de données inclus", description: "À tout moment, exportez l'intégralité de vos données au format CSV et JSON. Vos données vous appartiennent et voyagent avec vous." },
  ];

  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos engagements
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Pourquoi notre contrat est différent
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 800, margin: "0 auto" }}>
          {engagements.map((eng, i) => {
            const Icon = eng.icon;
            return (
              <motion.div key={eng.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
                <div className="flex items-start gap-4 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>
                      <Check size={12} className="inline mr-1" style={{ color: "#5A7D4A" }} />
                      {eng.titre}
                    </h3>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{eng.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Contrat type
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
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à analyser votre contrat ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Importez votre contrat dans WTF Lex pour une analyse clause par clause. Gratuit pour une première analyse.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/lex-ai" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer WTF Lex <ArrowRight size={14} /></Link>
          <Link href="/protection" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Protéger mon activité</Link>
        </motion.div>
      </div>
    </section>
  );
}
