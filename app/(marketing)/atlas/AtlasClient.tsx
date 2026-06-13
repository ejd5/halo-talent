"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Users, MessageCircle, Layers, TrendingUp, FileText, Bell, FolderOpen, Clock, Shield, Brain } from "lucide-react";
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

const CENTRALISATIONS = [
  { icon: Users, nom: "Profils créateurs", description: "Chaque fan, partenaire, marque ou contact professionnel dispose d'une fiche détaillée. Historique complet, notes, tags, score d'engagement.", couleur: "var(--or)" },
  { icon: MessageCircle, nom: "Conversations", description: "Tous vos échanges centralisés : DM, emails, commentaires. Plus besoin de jongler entre 5 plateformes pour savoir où vous en êtes.", couleur: "#C44536" },
  { icon: Layers, nom: "Segmentation intelligente", description: "Segmentez automatiquement par niveau d'engagement, valeur, localisation ou canal. Créez des listes dynamiques qui se mettent à jour seules.", couleur: "var(--or)" },
  { icon: TrendingUp, nom: "Revenus et transactions", description: "Suivez chaque euro : commissions, tips, ventes, brand deals. Visualisez vos revenus par source et identifiez ce qui rapporte vraiment.", couleur: "#5A7D4A" },
  { icon: FileText, nom: "Contenus et assets", description: "Content Vault : stockez, indexez et retrouvez tous vos contenus. Photos, vidéos, contrats, briefs, classés et accessibles.", couleur: "var(--or)" },
  { icon: Bell, nom: "Relances automatiques", description: "Définissez des règles de relance. Un fan influent n'a pas répondu depuis 14 jours ? Atlas vous le signale et propose une action.", couleur: "#C44536" },
  { icon: FolderOpen, nom: "Documents et preuves", description: "Contrats signés, captures d'écran, échanges importants. Tout est horodaté et archivé pour constituer un dossier de preuves en cas de litige.", couleur: "#5A7D4A" },
  { icon: Clock, nom: "Historique chronologique", description: "Chaque interaction est horodatée. Vous retrouvez en un clic ce qui s'est passé avec un contact, un fan ou un partenaire sur 12 mois.", couleur: "var(--or)" },
];

const BENEFICES = [
  { icon: Brain, titre: "Comprendre", texte: "Visualisez votre audience en un coup d'œil. Qui sont vos fans les plus engagés ? Quels canaux performent ? Quels contenus génèrent le plus d'interactions ?" },
  { icon: TrendingUp, titre: "Prioriser", texte: "Atlas calcule un score d'engagement par contact. Concentrez votre énergie là où elle a le plus d'impact, sans vous disperser." },
  { icon: Bell, titre: "Relancer", texte: "Ne perdez plus une opportunité par oubli. Relances programmées, rappels intelligents, suggestions d'actions basées sur le contexte." },
  { icon: FolderOpen, titre: "Documenter", texte: "Chaque échange important est archivé automatiquement. En cas de litige, vous avez un dossier complet, horodaté, prêt à être transmis." },
  { icon: Shield, titre: "Protéger", texte: "Conforme RGPD, données chiffrées, accès contrôlés. Vos données et celles de vos fans sont traitées avec le plus haut niveau de sécurité." },
];

const CAS_USAGE = [
  { profil: "Créatrice glamour", besoin: "Gérer 500+ DMs par jour sans perdre les fans premium.", usage: "Segmente par score d'engagement, priorise les top fans, délègue les réponses simples à Chat AI." },
  { profil: "Influenceuse lifestyle", besoin: "Coordonner brand deals, contenu sponsorisé et calendrier éditorial.", usage: "Utilise le Content Vault pour ses briefs, suit ses revenus brand deals, relaçe les marques après proposition." },
  { profil: "YouTuber / Vidéaste", besoin: "Suivre les sponsors, gérer les collaborations et les droits d'auteur.", usage: "Archive ses contrats dans Documents, suit les paiements sponsors, segmente ses contacts par type de collaboration." },
  { profil: "Musicien / Artiste", besoin: "Fédérer une communauté de fans, gérer les ventes directes.", usage: "Segmente par localisation pour ses tournées, suit les ventes de merch, centralise les échanges avec labels et producteurs." },
  { profil: "Athlète / Sportive", besoin: "Coordonner sponsors, apparitions, et contenu fitness.", usage: "Suit ses contrats de sponsoring, planifie ses apparitions, gère ses partenariats équipementiers avec rappels automatiques." },
];

const TABLEAU_COMPARATIF = [
  { critere: "Centralisation des contacts", excel: "Manuel, risque d'erreur", outils: "Partielle selon les apps", atlas: "Tout centralisé, automatique" },
  { critere: "Historique des conversations", excel: "Impossible", outils: "Fragmenté par plateforme", atlas: "Unifié, chronologique" },
  { critere: "Segmentation dynamique", excel: "Manuelle, vite obsolète", outils: "Limitée", atlas: "Automatique, temps réel" },
  { critere: "Suivi des revenus", excel: "Possible mais fastidieux", outils: "Variable", atlas: "Automatisé, multi-source" },
  { critere: "Relances automatiques", excel: "Non", outils: "Partiel", atlas: "Oui, contextuelles" },
  { critere: "Content Vault", excel: "Non", outils: "Stockage dispersé", atlas: "Indexé, recherchable" },
  { critere: "Dossier de preuves juridiques", excel: "Non", outils: "Non", atlas: "Horodaté, archivé automatiquement" },
  { critere: "Conformité RGPD", excel: "Aucune garantie", outils: "Variable", atlas: "Intégrée, chiffrement, contrôle d'accès" },
];

const INTEGRATIONS = [
  { nom: "Chat AI", description: "Les conversations gérées par Chat AI alimentent automatiquement l'historique Atlas. Chaque réponse, chaque relance, chaque intention détectée est enregistrée dans la fiche du contact.", href: "/chat-ai", couleur: "#C44536" },
  { nom: "WTF Lex", description: "Les contrats analysés par WTF Lex sont archivés dans le dossier Documents d'Atlas. Les alertes juridiques (clause abusive, date d'échéance) remontent dans le fil d'activité.", href: "/protection", couleur: "var(--or)" },
  { nom: "Protection", description: "Le Bouclier Légal surveille vos contenus. En cas d'atteinte détectée, l'incident est documenté dans Atlas avec captures, horodatage et suggestions d'action.", href: "/protection", couleur: "#5A7D4A" },
];

const FAQ = [
  { q: "Est-ce qu'Atlas remplace mon fichier Excel ?", r: "Oui, et il fait bien plus. Atlas centralise ce qu'un fichier Excel ne peut pas : historique des conversations, segmentation dynamique, relances automatiques, content vault, et dossier de preuves juridiques. Vous gagnez du temps et vous évitez les erreurs." },
  { q: "Mes données sont-elles en sécurité ?", r: "Oui. Atlas est conçu pour respecter le RGPD. Toutes les données sont chiffrées au repos et en transit. Vous contrôlez qui accède à quoi. Nous ne revendons aucune donnée, jamais." },
  { q: "Puis-je importer mes contacts existants ?", r: "Oui. Import CSV depuis n'importe quel outil. Nous proposons un accompagnement pour les migrations plus complexes." },
  { q: "Atlas fonctionne-t-il avec Chat AI ?", r: "Oui, l'intégration est native. Chat AI gère les conversations, Atlas centralise l'historique et les profils. Les deux outils se nourrissent mutuellement." },
  { q: "Quel est le prix d'Atlas ?", r: "Atlas est disponible en trois plans : Free (0€), Pro (29€/mois) et Enterprise (99€/mois). Chaque plan inclut des fonctionnalités adaptées à votre niveau d'activité. Consultez la page dédiée pour le détail." },
];

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

export function AtlasClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <CentralisationSection />
      <PhraseForte texte="«&nbsp;Un CRM n'est pas un fichier de contacts. C'est la mémoire de votre activité créative.&nbsp;»" />
      <BeneficesSection />
      <PhraseForte texte="«&nbsp;Atlas ne remplace pas votre intuition. Il vous donne les informations pour prendre de meilleures décisions.&nbsp;»" />
      <CasUsageSection />
      <TableauComparatifSection />
      <IntegrationsSection />
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
          CRM &middot; Intelligence &middot; Automatisation
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Atlas CRM<br />
          <span style={{ fontFamily: "var(--font-accent), serif", fontStyle: "italic", fontSize: "0.65em", fontWeight: 400, color: "var(--pierre)" }}>Le centre de gravité de votre activité créateur</span>
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Centralisez vos contacts, conversations, revenus, contenus et documents. Comprenez votre audience, priorisez vos actions, protégez votre activité.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/atlas/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres <ArrowRight size={14} /></Link>
          <Link href="#pourquoi" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Découvrir Atlas</Link>
        </motion.div>
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
          Pourquoi un CRM créateur
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Votre activité mérite mieux qu'un fichier Excel
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Les CRM classiques (HubSpot, Salesforce, Pipedrive) sont conçus pour des forces de vente B2B. Ils ne comprennent pas la réalité d'un créateur : fans, DMs, collaborations, brand deals, contenu sponsorisé, droits d'auteur.</p>
          <p>Atlas a été pensé pour cette réalité. Il centralise ce qui compte pour un créateur, pas des pipelines de vente, mais des relations, des conversations, des revenus éclatés sur 5 plateformes, et la nécessité de documenter chaque interaction pour se protéger.</p>
          <p>Atlas n'est pas un outil de plus. C'est le centre de gravité qui donne du sens à tous les autres.</p>
        </motion.div>
      </div>
    </section>
  );
}

function CentralisationSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Ce qu'Atlas centralise
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Huit dimensions de votre activité, en un seul endroit
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 880, margin: "0 auto" }}>
          {CENTRALISATIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.nom} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
                <div className="flex items-start gap-4 p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: item.couleur }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.nom}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
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

function BeneficesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Les bénéfices
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Comprendre, prioriser, relancer, documenter, protéger
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ maxWidth: 900, margin: "0 auto" }}>
          {BENEFICES.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.06}>
                <div className="p-6 text-center" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{b.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{b.texte}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CasUsageSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Cas par département
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Chaque créateur a son Atlas
        </motion.h2>
        <div className="space-y-4" style={{ maxWidth: 800, margin: "0 auto" }}>
          {CAS_USAGE.map((cas, i) => (
            <motion.div key={cas.profil} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.06}>
              <div className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="shrink-0">
                    <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{cas.profil}</h3>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>Besoin</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{cas.besoin}</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}><span style={{ color: "var(--or)", fontWeight: 600 }}>Avec Atlas :</span> {cas.usage}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableauComparatifSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Comparaison
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Fichier Excel / Outils dispersés / Atlas
        </motion.h2>
        <div className="overflow-x-auto" style={{ maxWidth: 860, margin: "0 auto" }}>
          <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Critère</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", fontSize: "0.65rem" }}>Fichier Excel</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace", fontSize: "0.65rem" }}>Outils dispersés</th>
                <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", fontSize: "0.65rem" }}>Atlas</th>
              </tr>
            </thead>
            <tbody>
              {TABLEAU_COMPARATIF.map((ligne, i) => (
                <motion.tr key={ligne.critere} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04} style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{ligne.critere}</td>
                  <td className="text-center py-3 px-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{ligne.excel}</td>
                  <td className="text-center py-3 px-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{ligne.outils}</td>
                  <td className="text-center py-3 px-4 font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{ligne.atlas}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Intégrations
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Atlas au cœur de l'écosystème WTF
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ maxWidth: 860, margin: "0 auto" }}>
          {INTEGRATIONS.map((integration, i) => (
            <motion.div key={integration.nom} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.06}>
              <div className="p-6 h-full flex flex-col" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <h3 className="text-[15px] font-bold mb-3" style={{ color: integration.couleur, fontFamily: "var(--font-display-alt), serif" }}>{integration.nom}</h3>
                <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{integration.description}</p>
                <Link href={integration.href} className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.06em] hover:gap-2" style={{ color: integration.couleur, fontFamily: "var(--font-util), monospace", transition: "gap 0.2s ease" }}>
                  Explorer <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
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
          Tout savoir sur Atlas
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
          Prêt à centraliser votre activité ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Atlas est le CRM pensé pour les créateurs, pas pour les forces de vente. Centralisez, comprenez, priorisez, protégez.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/atlas/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres <ArrowRight size={14} /></Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Demander une démo <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}
