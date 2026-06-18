"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Wand2, MessageCircle, Shield, FileText, TrendingUp, Users } from "lucide-react";

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

const OUTILS = [
  { icon: Users, nom: "Atlas CRM", couleur: "#5A7D4A", description: "Centralisez votre audience, automatisez vos campagnes email/SMS/push, segmentez vos fans par niveau d'engagement, et mesurez votre ROI en temps réel. Le CRM pensé pour les créateurs, pas pour les forces de vente B2B.", fonctionnalites: ["CRM avec scoring et segmentation", "Campagnes email, SMS et push automatisées", "Messagerie unifiée multi-plateforme", "Funnels de conversion prêts à l'emploi", "Analytics et rapports exportables"], lien: "/atlas" },
  { icon: Wand2, nom: "Studio IA", couleur: "var(--or)", description: "L'outil de création de contenu augmenté par IA. Générez des visuels, des vidéos, des légendes et des stratégies éditoriales optimisées pour chaque plateforme.", fonctionnalites: ["Compositeur de contenu assisté par IA", "Génération vidéo et image", "Planification éditoriale multi-plateforme", "Analyse de tendances en temps réel", "Bibliothèque de templates personnalisables"], lien: "/studio" },
  { icon: MessageCircle, nom: "CHATEENG", couleur: "#C44536", description: "Un assistant IA entraîné sur votre ton, votre historique et vos règles. Il rédige vos réponses, filtre vos messages, et vous alerte sur les conversations prioritaires, sans jamais envoyer sans votre validation.", fonctionnalites: ["Rédaction assistée contextuelle", "Filtrage intelligent des messages", "Détection des conversations urgentes", "Mémoire conversationnelle par fan", "Validation humaine obligatoire avant envoi"], lien: "/chat-ai" },
  { icon: Shield, nom: "WTF Lex", couleur: "#C44536", description: "Analysez vos contrats, suivez les changements de CGU des plateformes, préparez vos dossiers juridiques. WTF Lex ne remplace pas un avocat, il vous donne les outils pour comprendre vos obligations et identifier les risques.", fonctionnalites: ["Analyse de contrats assistée", "Veille CGU multi-plateforme", "Préparation de dossiers pour avocats", "Bouclier Légal intégré", "Alertes de conformité"], lien: "/lex" },
  { icon: FileText, nom: "Reporting", couleur: "#5A7D4A", description: "Des rapports clairs, mensuels, qui vous montrent exactement d'où viennent vos revenus, quels contenus performent, et comment votre audience évolue. Pas de chiffres opaques, des données actionnables.", fonctionnalites: ["Décompte mensuel détaillé", "Analyse de performance par contenu", "Suivi d'évolution d'audience", "Projections et scénarios", "Export CSV/PDF"], lien: "/studio/insights" },
  { icon: TrendingUp, nom: "Protection", couleur: "var(--or)", description: "Protégez votre contenu contre le vol, le repost non autorisé et l'usurpation d'identité. Surveillance proactive, alertes en temps réel, procédures de retrait documentées.", fonctionnalites: ["Surveillance anti-repost", "Détection d'usurpation", "Procédures de retrait guidées", "Watermarking automatique", "Rapports de protection mensuels"], lien: "/protection" },
];

const CAS_USAGE = [
  { profil: "Créatrice glamour", besoin: "Produire du contenu qualitatif sans y passer 10h par jour", outils: "Studio IA pour la génération de visuels, CHATEENG pour filtrer les messages, Atlas CRM pour fidéliser les fans" },
  { profil: "Influenceuse lifestyle", besoin: "Publier régulièrement sur 4 plateformes sans équipe", outils: "Studio IA pour le planning éditorial multi-plateforme, Reporting pour mesurer ce qui marche, CHATEENG pour les réponses" },
  { profil: "YouTuber / vidéaste", besoin: "Monétiser son audience au-delà de YouTube", outils: "Atlas CRM pour les campagnes email/SMS, Protection pour éviter le repost, Reporting pour le suivi des revenus" },
  { profil: "Musicien / artiste", besoin: "Gérer une communauté fragmentée sur plusieurs plateformes", outils: "Atlas CRM pour centraliser les fans, CHATEENG pour l'engagement personnalisé, Protection pour le contenu exclusif" },
  { profil: "Sportive / athlète", besoin: "Protéger son image et monétiser ses partenariats", outils: "WTF Lex pour les contrats de sponsoring, Protection pour l'image, Studio IA pour le contenu de marque" },
];

const TABLEAU_SANS_AVEC = [
  { tache: "Répondre aux messages", sansHalo: "Heures passées chaque jour à trier et répondre manuellement", avecHalo: "CHATEENG filtre, priorise et prépare les réponses, vous validez en un clic" },
  { tache: "Créer du contenu", sansHalo: "Applications multiples, pas de cohérence, temps de production élevé", avecHalo: "Studio IA génère, propose, adapte, vous choisissez et publiez" },
  { tache: "Suivre son audience", sansHalo: "Données éparpillées, aucune vue d'ensemble, décisions instinctives", avecHalo: "Atlas CRM centralise, segmente, analyse, vous décidez avec des données" },
  { tache: "Protéger son contenu", sansHalo: "Repost non détecté, procédures complexes, perte de revenus", avecHalo: "Surveillance proactive, alertes automatiques, procédures de retrait guidées" },
  { tache: "Comprendre ses revenus", sansHalo: "Décomptes opaques, calculs manuels, pas de projection", avecHalo: "Reporting mensuel clair, détail par plateforme, projections à 3 et 6 mois" },
  { tache: "Gérer les contrats", sansHalo: "Lecture seule, pas d'analyse, risque de signer sans comprendre", avecHalo: "WTF Lex analyse, alerte sur les clauses sensibles, prépare le dossier pour l'avocat" },
  { tache: "Fidéliser les fans", sansHalo: "Communication de masse, pas de personnalisation, taux d'engagement faible", avecHalo: "Campagnes segmentées, messages personnalisés, funnels de conversion automatisés" },
];

const FAQ_SAAS = [
  { q: "Est-ce que je peux utiliser un seul outil ?", a: "Oui. Chaque outil est utilisable indépendamment. Vous pouvez commencer avec Atlas CRM gratuit, puis ajouter Studio IA, puis activer CHATEENG. Rien n'est imposé, vous composez votre suite selon vos besoins." },
  { q: "Les outils sont-ils inclus dans la commission ?", a: "Les outils essentiels (CRM, CHATEENG, Reporting) sont inclus dans la commission de management. Les options avancées (Studio IA crédits supplémentaires, WTF Lex analyse approfondie) sont disponibles en option." },
  { q: "Mes données sont-elles en sécurité ?", a: "Oui. Vos données vous appartiennent. Elles sont stockées de manière sécurisée, jamais partagées avec des tiers, et vous pouvez les exporter à tout moment. Si vous quittez WTF, vous partez avec toutes vos données." },
  { q: "L'IA remplace-t-elle le créateur ?", a: "Non. L'IA propose, l'humain valide, le créateur contrôle. Aucun message n'est envoyé automatiquement. Aucune décision n'est déléguée à un algorithme. L'IA est un assistant, pas un remplacement." },
  { q: "Puis-je tester avant de m'engager ?", a: "Oui. Atlas CRM a un plan Free permanent. Studio IA propose des crédits gratuits chaque mois. CHATEENG est inclus dans l'accompagnement. Vous pouvez tester chaque outil sans engagement." },
];

export function SaasClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <PhraseForte>La technologie doit servir le créateur, pas le remplacer.</PhraseForte>
      <OutilsGridSection />
      <CasUsageSection />
      <TableauSansAvecSection />
      <AgenceOmbreSection />
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
          Technologie
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Un système d'exploitation<br />pour créateurs
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          WTF n'est pas seulement une agence. C'est une maison créative augmentée par des outils, CRM, IA, protection juridique, reporting. Le tout intégré.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#outils" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Découvrir les outils</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Demander une démo <ArrowRight size={14} /></Link>
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
          Pourquoi des outils
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Centraliser, tracer, comprendre, protéger, décider
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Un créateur gère en moyenne 4 à 6 plateformes, des centaines de messages par jour, des dizaines de contenus par semaine, des contrats, des partenariats, une fiscalité complexe. Sans outils, c'est ingérable. Avec les mauvais outils, c'est pire, données éparpillées, automatisations risquées, dépendance à des SaaS qui ne comprennent pas le métier.</p>
          <p>Les outils WTF ont été conçus spécifiquement pour les créateurs. Ils couvrent toute la chaîne : produire, publier, converser, analyser, protéger, monétiser. Et ils sont intégrés : les données circulent entre eux sans friction.</p>
          <p>C'est la différence entre une suite d'outils et un système d'exploitation. Une suite d'outils, vous la composez. Un système d'exploitation, il est déjà cohérent. Tout est connecté, tout est pensé ensemble.</p>
        </motion.div>
      </div>
    </section>
  );
}

function OutilsGridSection() {
  const { ref, inView } = useReveal(0.05);
  return (
    <section ref={ref} id="outils" className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          La suite
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les outils WTF
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OUTILS.map((outil, i) => {
            const Icon = outil.icon;
            return (
              <motion.div key={outil.nom} className="p-7 flex flex-col" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: outil.couleur }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[1rem] font-bold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{outil.nom}</h3>
                </div>
                <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{outil.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {outil.fonctionnalites.map((f) => (
                    <li key={f} className="text-[12px] flex items-start gap-2" style={{ color: "var(--pierre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>
                      <span style={{ color: outil.couleur, fontSize: "0.6rem", lineHeight: "1.5" }}>&#x2022;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={outil.lien} className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-all" style={{ color: outil.couleur, fontFamily: "var(--font-util), monospace" }}>
                  Découvrir <ArrowRight size={11} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CasUsageSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Cas d'usage
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Des outils adaptés à chaque profil
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAS_USAGE.map((c, i) => (
            <motion.div key={c.profil} className="p-6" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.05}>
              <h3 className="text-[1rem] font-bold mb-3" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{c.profil}</h3>
              <p className="text-[12px] mb-2" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Besoin</p>
              <p className="text-[13px] mb-4" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{c.besoin}</p>
              <p className="text-[12px] mb-2" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Outils recommandés</p>
              <p className="text-[13px]" style={{ color: "var(--or)", fontFamily: "var(--font-body), sans-serif" }}>{c.outils}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableauSansAvecSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Comparaison
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Sans WTF / Avec WTF
        </motion.h2>
        <motion.div className="overflow-x-auto" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <table className="w-full text-left border-collapse" style={{ minWidth: 650 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--ivoire)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Tâche</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}>Sans WTF</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}>Avec WTF</th>
              </tr>
            </thead>
            <tbody>
              {TABLEAU_SANS_AVEC.map((r, i) => (
                <tr key={r.tache} style={{ borderBottom: "1px solid rgba(244,238,227,0.06)", background: i % 2 === 0 ? "rgba(244,238,227,0.01)" : "transparent" }}>
                  <td className="py-3 px-5 text-[13px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{r.tache}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "#C44536", fontFamily: "var(--font-body), sans-serif" }}>{r.sansHalo}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "#5A7D4A", fontFamily: "var(--font-body), sans-serif" }}>{r.avecHalo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function AgenceOmbreSection() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Transparence
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          L'agence ne garde pas tout dans l'ombre
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Beaucoup d'agences utilisent des outils, mais elles les gardent pour elles. Le créateur ne voit pas les données, n'a pas accès aux analyses, ne peut pas exporter son historique. C'est pratique pour l'agence : le créateur qui part perd tout, donc il reste.</p>
          <p>Chez WTF, chaque outil est accessible au créateur. Vous voyez vos données en temps réel. Vous pouvez les exporter. Vous pouvez les utiliser même si vous partez. L'outil est à votre service, pas une chaîne dorée.</p>
          <p>C'est plus exigeant pour nous. Cela nous oblige à ce que nos outils soient assez bons pour que vous ayez envie de les garder, pas assez opaques pour que vous ne puissiez pas partir. C'est la seule approche qui respecte le créateur.</p>
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
          Tout savoir sur nos outils
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {FAQ_SAAS.map((faq, i) => (
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
          Prêt à découvrir la suite ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Commencez avec les outils gratuits. Pas de carte bancaire. Pas d'engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/studio" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer Studio <ArrowRight size={14} /></Link>
          <Link href="/atlas" className="btn-eco" style={{ borderColor: "var(--or)", color: "var(--encre)" }}>Découvrir Atlas</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>Demander une démo</Link>
        </motion.div>
      </div>
    </section>
  );
}
