"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, FileCheck, Clock, Users, FolderOpen, Download, Globe, AlertTriangle } from "lucide-react";

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
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={120} height={120} style={{ height: 120, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[1.25rem] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          {texte}
        </motion.p>
      </div>
    </section>
  );
}

const TABLEAU_RISQUES = [
  { risque: "Envoi massif non consenti", prevention: "Double opt-in obligatoire, registre des consentements", documentation: "Horodatage de chaque consentement, exportable" },
  { risque: "Non-respect des CGU plateformes", prevention: "Limites de fréquence paramétrées par plateforme", documentation: "Logs d'activité horodatés par action et par canal" },
  { risque: "Demande d'accès / suppression", prevention: "Interface de gestion des droits intégrée", documentation: "Traçabilité complète de chaque demande et action" },
  { risque: "Contestation juridique", prevention: "Archivage automatique des échanges et contrats", documentation: "Dossier horodaté exportable pour votre conseil" },
  { risque: "Faille de sécurité", prevention: "Chiffrement au repos et en transit, 2FA", documentation: "Audit trail de toutes les connexions et actions" },
  { risque: "Transfert de données hors UE", prevention: "Hébergement européen, pas de sous-traitance hors UE", documentation: "Registre des traitements, DPA disponible" },
  { risque: "Contenu inapproprié", prevention: "Modération IA des messages avant envoi", documentation: "Rapport de modération horodaté" },
];

const FAQ = [
  { q: "Atlas garantit-il que je ne serai jamais banni ?", r: "Non, et aucun outil ne peut le garantir. Les plateformes modifient leurs conditions d'utilisation régulièrement et de façon unilatérale. Atlas vous aide à respecter les règles connues au moment de l'utilisation, mais ne peut pas garantir l'absence de sanction." },
  { q: "Atlas est-il certifié conforme ?", r: "Atlas met en œuvre les mesures techniques et organisationnelles recommandées par le RGPD et les régulateurs. Cependant, la conformité dépend aussi de votre usage. Nous ne pouvons pas garantir que votre utilisation spécifique sera jugée conforme par une autorité." },
  { q: "Puis-je utiliser Atlas pour me défendre juridiquement ?", r: "Atlas vous aide à documenter votre activité et à constituer des dossiers de preuves. Mais Atlas ne remplace pas un avocat. En cas de litige, les documents générés par Atlas peuvent être transmis à votre conseil juridique, qui sera le seul habilité à vous défendre." },
  { q: "Que fait Atlas si une plateforme change ses règles ?", r: "Nous surveillons les évolutions des principales plateformes et mettons à jour nos paramètres de conformité. Mais il peut y avoir un délai entre un changement de règle et notre mise à jour. Nous vous recommandons de toujours lire les CGU des plateformes que vous utilisez." },
  { q: "Mes données sont-elles stockées en Europe ?", r: "Oui. Toutes les données Atlas sont hébergées chez un fournisseur européen, avec des garanties contractuelles conformes au RGPD. Aucun transfert hors UE n'est effectué sans les garanties appropriées." },
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

export function AtlasConformiteClient() {
  return (
    <main>
      <HeroSection />
      <CeQueSignifieSection />
      <PhraseForte texte="«&nbsp;La conformité n'est pas un label qu'on obtient une fois pour toutes. C'est une discipline quotidienne.&nbsp;»" />
      <CeQueHaloNePrometPasSection />
      <ConsentementSection />
      <AuditLogsSection />
      <GestionAccesSection />
      <PreuvesDossiersSection />
      <ExportSection />
      <PlateformesSection />
      <TableauRisquesSection />
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
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Conformité &amp; Sécurité
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          La conformité n'est pas une option
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Atlas intègre des garde-fous techniques et organisationnels pour vous aider à respecter les réglementations en vigueur. Sans promesse absolue, avec une transparence totale sur nos limites.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#signifie" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Comprendre notre approche</Link>
          <Link href="/atlas/pricing" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Voir les offres <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueSignifieSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} id="signifie" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Notre approche
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que signifie la conformité chez WTF
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Pour nous, la conformité n'est pas un argument marketing. C'est une contrainte d'ingénierie que nous prenons au sérieux dès la conception de chaque fonctionnalité. Atlas est construit avec des garde-fous intégrés, pas ajoutés après coup.</p>
          <p>Concrètement, cela signifie : des limites de fréquence par défaut, un registre des consentements obligatoire avant tout envoi, un chiffrement de bout en bout, un hébergement européen, et une traçabilité complète de toutes les actions.</p>
          <p>Mais la conformité dépend aussi de l'usage que vous faites de l'outil. Atlas vous donne les moyens d'être conforme ; c'est à vous de les utiliser correctement.</p>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueHaloNePrometPasSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-3 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <AlertTriangle size={20} style={{ color: "#C44536" }} />
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em]" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}>Important</p>
        </motion.div>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que WTF ne promet pas
        </motion.h2>
        <motion.div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span><strong style={{ color: "var(--ivoire)" }}>Nous ne promettons pas l'absence de sanction.</strong> Les plateformes (Instagram, TikTok, YouTube, etc.) modifient leurs conditions d'utilisation de façon unilatérale et parfois sans préavis. Aucun outil ne peut garantir que vous ne serez jamais sanctionné.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span><strong style={{ color: "var(--ivoire)" }}>Nous ne sommes pas une certification.</strong> Atlas met en œuvre des mesures techniques recommandées par les régulateurs, mais nous ne délivrons pas de certification de conformité et nous ne nous substituons pas à un audit juridique.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span><strong style={{ color: "var(--ivoire)" }}>Nous ne remplaçons pas un avocat.</strong> Les documents, rapports et suggestions générés par Atlas sont des outils d'aide à la décision. En cas de litige, seul un avocat peut vous conseiller et vous défendre.</span>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
            <span><strong style={{ color: "var(--ivoire)" }}>Nous ne pouvons pas garantir une conformité universelle.</strong> Les lois varient selon les pays. Atlas est conçu pour le cadre européen (RGPD) et américain (CAN-SPAM). Si vous opérez dans d'autres juridictions, consultez un professionnel local.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ConsentementSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <FileCheck size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--encre)" }}>Consentement et documentation</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Atlas documente chaque consentement : qui a consenti, quand, par quel canal, pour quel traitement. Ce registre est horodaté, infalsifiable, et exportable à tout moment.</p>
          <p>Le double opt-in est activé par défaut pour toute nouvelle inscription. Vous pouvez configurer des workflows de consentement spécifiques par type de communication (newsletter, offres commerciales, messages automatiques).</p>
          <p>Chaque contact peut exercer ses droits directement : accès, rectification, opposition, portabilité, effacement. Ces demandes sont traitées et documentées dans Atlas, avec une traçabilité complète.</p>
        </motion.div>
      </div>
    </section>
  );
}

function AuditLogsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Clock size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Audit logs</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Chaque action réalisée dans Atlas est enregistrée avec un horodatage, l'identité de l'utilisateur, le type d'action, et le résultat. Cet audit trail est infalsifiable : personne, pas même les administrateurs WTF, ne peut modifier ou supprimer un log.</p>
          <p>Les logs couvrent : les connexions et déconnexions, les modifications de données, les envois de messages, les exports, les changements de permissions, et les actions de modération.</p>
          <p>En cas d'audit externe ou de demande d'une autorité, vous pouvez exporter l'intégralité des logs sur une période donnée en quelques clics.</p>
        </motion.div>
      </div>
    </section>
  );
}

function GestionAccesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Users size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--encre)" }}>Gestion des accès</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Vous contrôlez qui accède à quoi dans Atlas. Les rôles sont granulaires : propriétaire, administrateur, éditeur, lecteur. Chaque rôle a des permissions spécifiques sur les contacts, les conversations, les données financières, les documents, et les paramètres.</p>
          <p>L'authentification à deux facteurs (2FA) est disponible et recommandée pour tous les comptes. Les connexions suspectes (nouvel appareil, localisation inhabituelle) déclenchent une alerte.</p>
          <p>Vous pouvez révoquer l'accès d'un collaborateur à tout moment, immédiatement et sans délai. Toutes les actions de chaque utilisateur restent tracées dans l'audit trail.</p>
        </motion.div>
      </div>
    </section>
  );
}

function PreuvesDossiersSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <FolderOpen size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Preuves et dossiers</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Atlas constitue automatiquement un dossier de preuves pour chaque interaction importante : contrats signés, consentements, échanges de messages, transactions, modifications de données. Chaque élément est horodaté et horodaté.</p>
          <p>Ce dossier peut être exporté et transmis à votre conseil juridique en cas de litige. Il constitue un faisceau d'éléments factuels documentés, mais ne constitue pas en lui-même une preuve juridique irréfutable.</p>
          <p>Nous vous recommandons de compléter ce dossier avec vos propres captures et documents, et de le faire vérifier par un avocat avant toute procédure.</p>
        </motion.div>
      </div>
    </section>
  );
}

function ExportSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Download size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--encre)" }}>Export pour professionnel</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Toutes les données documentées par Atlas peuvent être exportées dans des formats conçus pour être transmis à un professionnel du droit : PDF horodatés, CSV structurés, rapports chronologiques.</p>
          <p>L'export inclut : le registre des consentements, l'audit trail complet, les documents et contrats archivés, l'historique des conversations, et le journal des transactions.</p>
          <p>Ces exports sont conçus pour faciliter le travail de votre avocat, pas pour le remplacer. Nous vous encourageons à faire vérifier tout document avant de le produire dans un cadre juridique.</p>
        </motion.div>
      </div>
    </section>
  );
}

function PlateformesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Globe size={22} />
          </div>
          <h2 className="display-small" style={{ color: "var(--ivoire)" }}>Plateformes et règles variables</h2>
        </motion.div>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          <p>Les plateformes (Instagram, TikTok, YouTube, Twitter/X, Twitch, etc.) ont chacune leurs propres conditions d'utilisation, qui évoluent régulièrement et de façon unilatérale. Atlas configure par défaut des limites conservatrices pour chaque plateforme, mais ces limites peuvent ne pas refléter les dernières mises à jour.</p>
          <p>Nous surveillons les évolutions des CGU des principales plateformes et mettons à jour nos paramètres de conformité aussi rapidement que possible. Cependant, il peut y avoir un délai entre un changement de règle et notre mise à jour.</p>
          <p>Nous vous recommandons de toujours lire les conditions d'utilisation des plateformes que vous utilisez, et de ne pas vous fier exclusivement aux paramètres par défaut d'Atlas.</p>
        </motion.div>
      </div>
    </section>
  );
}

function TableauRisquesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Synthèse
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Risque / Prévention / Documentation
        </motion.h2>
        <div className="overflow-x-auto" style={{ maxWidth: 900, margin: "0 auto" }}>
          <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Risque</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", fontSize: "0.6rem" }}>Prévention Atlas</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", fontSize: "0.6rem" }}>Documentation</th>
              </tr>
            </thead>
            <tbody>
              {TABLEAU_RISQUES.map((ligne, i) => (
                <motion.tr key={ligne.risque} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04} style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{ligne.risque}</td>
                  <td className="py-3 px-4" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{ligne.prevention}</td>
                  <td className="py-3 px-4" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{ligne.documentation}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
          Conformité et sécurité
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
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={130} height={130} style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Une approche prudente de la conformité
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Atlas vous donne les outils pour documenter, tracer et sécuriser votre activité. Sans promesse absolue, avec une transparence totale sur nos limites.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/atlas/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres <ArrowRight size={14} /></Link>
          <Link href="/atlas" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>Retour à Atlas</Link>
        </motion.div>
      </div>
    </section>
  );
}
