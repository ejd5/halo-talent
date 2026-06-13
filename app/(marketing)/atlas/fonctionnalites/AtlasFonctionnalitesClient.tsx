"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Users, Layers, Clock, MessageCircle, Bell, FolderOpen, FileText, TrendingUp, Shield, Sparkles } from "lucide-react";
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

interface Fonctionnalite {
  id: string;
  icon: React.ElementType;
  titre: string;
  description: string;
  exemple: string;
  benefice: string;
  limite: string;
}

const FONCTIONNALITES: Fonctionnalite[] = [
  {
    id: "vue-ensemble",
    icon: Sparkles,
    titre: "Vue d'ensemble",
    description: "Atlas est un CRM conçu spécifiquement pour les créateurs de contenu. Il centralise toutes les dimensions de votre activité, contacts, conversations, revenus, contenus, documents, dans une interface unique, épurée et rapide.",
    exemple: "En ouvrant Atlas le matin, une créatrice voit immédiatement : 3 nouveaux fans premium à contacter, 2 brand deals en attente de relance, et une alerte de contrat arrivant à échéance dans 7 jours.",
    benefice: "Vous passez de «&nbsp;je ne sais plus où j'en suis&nbsp;» à «&nbsp;je sais exactement quoi faire aujourd'hui&nbsp;».",
    limite: "Atlas ne crée pas de contenu à votre place. Il organise votre activité pour que vous puissiez vous concentrer sur la création.",
  },
  {
    id: "profils",
    icon: Users,
    titre: "Profils créateurs et audience",
    description: "Chaque contact dispose d'une fiche détaillée : nom, plateformes, score d'engagement, historique des interactions, tags personnalisés, notes internes. Vous pouvez créer des champs personnalisés pour suivre ce qui compte pour vous.",
    exemple: "Une influenceuse lifestyle tague ses contacts par marque partenaire (L'Oréal, Sephora, etc.). Quand L'Oréal la contacte, elle retrouve en un clic l'historique complet de leurs échanges, les contrats signés, et les briefs reçus.",
    benefice: "Vous connaissez chaque contact comme si vous l'aviez rencontré hier, même après 6 mois sans interaction.",
    limite: "Atlas ne remplace pas la relation humaine. Il vous donne les informations, c'est à vous de créer le lien.",
  },
  {
    id: "segmentation",
    icon: Layers,
    titre: "Segmentation dynamique",
    description: "Créez des segments qui se mettent à jour automatiquement selon les critères que vous définissez : niveau d'engagement, valeur des transactions, localisation, plateforme, date du dernier contact, tags personnalisés.",
    exemple: "Un YouTuber crée un segment «&nbsp;Top sponsors 2026&nbsp;» qui inclut automatiquement toute marque ayant dépensé plus de 5000€ sur les 12 derniers mois. Le segment se met à jour seul à chaque nouvelle transaction.",
    benefice: "Plus besoin de trier manuellement vos contacts avant chaque campagne. Les segments sont toujours à jour.",
    limite: "La segmentation est basée sur les données disponibles. Si une information n'est pas renseignée, le contact n'apparaîtra pas dans les segments correspondants.",
  },
  {
    id: "historique",
    icon: Clock,
    titre: "Historique et notes",
    description: "Chaque interaction est horodatée et enregistrée automatiquement : messages, emails, appels, transactions, modifications de statut. Vous pouvez ajouter des notes manuelles pour capturer le contexte que les données brutes ne montrent pas.",
    exemple: "Après un appel avec un sponsor potentiel, un musicien ajoute une note : «&nbsp;Intéressé par un placement produit dans le prochain clip, budget ~3000€, à relancer le 20 juin&nbsp;». Atlas lui rappellera cette date.",
    benefice: "Votre mémoire est externe, consultable, et ne vous fait jamais défaut.",
    limite: "L'historique est aussi bon que les données qui l'alimentent. Les interactions hors plateformes connectées doivent être saisies manuellement.",
  },
  {
    id: "conversations",
    icon: MessageCircle,
    titre: "Suivi des conversations",
    description: "Toutes vos conversations sont centralisées dans une inbox unifiée. DMs Instagram, TikTok, emails, SMS, chaque fil de discussion est rattaché au profil du contact correspondant. Les réponses assistées par IA vous proposent des brouillons contextuels.",
    exemple: "Une créatrice reçoit 200 DMs par jour. Atlas regroupe les conversations par contact, surligne celles qui nécessitent une réponse urgente (fan VIP, partenaire, demande presse), et suggère des réponses pour les questions fréquentes.",
    benefice: "Plus de DM qui passe à travers. Vous répondez aux bonnes personnes, au bon moment, avec le bon ton.",
    limite: "Atlas ne répond pas automatiquement sans votre validation. L'IA propose, vous validez. C'est un copilote, pas un pilote automatique.",
  },
  {
    id: "relances",
    icon: Bell,
    titre: "Relances intelligentes",
    description: "Définissez des règles de relance basées sur le comportement ou l'inaction. Atlas vous signale les contacts qui n'ont pas interagi depuis X jours, les propositions commerciales sans réponse, les contrats en attente de signature.",
    exemple: "Un athlète définit une règle : si un sponsor n'a pas répondu à une proposition 7 jours après l'envoi, Atlas propose une relance automatique avec un message personnalisé. L'athlète valide ou modifie avant envoi.",
    benefice: "Vous ne perdez plus d'opportunités par oubli ou procrastination.",
    limite: "Les relances sont des suggestions, pas des obligations. Une relance mal calibrée peut agacer. Atlas recommande des délais, c'est à vous de les adapter à votre relation.",
  },
  {
    id: "content-vault",
    icon: FileText,
    titre: "Content Vault",
    description: "Stockez, indexez et retrouvez tous vos contenus et assets : photos, vidéos, contrats, briefs, maquettes, captures d'écran. Chaque fichier est tagué, daté, et relié aux contacts ou projets concernés.",
    exemple: "Une influenceuse prépare une campagne pour une marque de cosmétiques. Dans le Content Vault, elle retrouve le brief original, les visuels approuvés, le contrat signé, et les statistiques de la campagne précédente avec la même marque.",
    benefice: "Tout est au même endroit, classé, retrouvable en une recherche. Finis les «&nbsp;c'était dans quel dossier déjà&nbsp;?&nbsp;».",
    limite: "Le Content Vault n'est pas un outil d'édition ni un drive collaboratif. Il stocke et indexe vos assets, mais ne les modifie pas.",
  },
  {
    id: "revenus",
    icon: TrendingUp,
    titre: "Revenus et priorités",
    description: "Suivez chaque euro : commissions de plateforme, tips, brand deals, ventes de merchandising, affiliations. Visualisez vos revenus par source, par mois, par contact. Atlas identifie ce qui rapporte le plus pour vous aider à prioriser.",
    exemple: "Un musicien découvre que ses ventes de merch rapportent 3x plus que ses revenus de streaming. Il décide d'investir plus de temps dans sa boutique en ligne. Sans Atlas, il n'aurait jamais fait ce calcul.",
    benefice: "Vous prenez des décisions basées sur des données, pas sur des impressions.",
    limite: "Atlas ne prédit pas vos revenus futurs. Il vous montre ce qui a fonctionné, pas ce qui fonctionnera demain. Les performances passées ne garantissent pas les résultats futurs.",
  },
  {
    id: "documents",
    icon: FolderOpen,
    titre: "Documents et preuves",
    description: "Tous vos documents importants sont archivés, horodatés et horodatés. Contrats, captures d'écran, échanges importants, preuves de diffusion, attestations. Chaque document est relié au contact ou au projet correspondant.",
    exemple: "Une agence conteste les termes d'un contrat signé il y a 8 mois. Le créateur retrouve en 30 secondes le contrat original horodaté, les échanges d'emails de négociation, et la confirmation de paiement. Dossier clos.",
    benefice: "En cas de litige, vous avez un dossier complet, horodaté, prêt à être transmis à votre conseil juridique.",
    limite: "Atlas constitue un dossier de preuves, mais ne remplace pas un avocat. En cas de litige sérieux, consultez un professionnel du droit.",
  },
  {
    id: "integrations",
    icon: Sparkles,
    titre: "Intégrations WTF",
    description: "Atlas est le centre de gravité de l'écosystème WTF. Il s'intègre nativement avec Chat AI (conversations), WTF Lex (contrats), et le Bouclier Légal (surveillance des contenus). Les données circulent entre les outils sans double saisie.",
    exemple: "Quand Chat AI génère une réponse à un fan, la conversation est automatiquement enregistrée dans la fiche Atlas du contact. Quand WTF Lex analyse un contrat, le rapport est archivé dans le dossier Documents du contact concerné.",
    benefice: "Un écosystème cohérent plutôt qu'un empilement d'outils déconnectés.",
    limite: "Les intégrations fonctionnent au sein de l'écosystème WTF. Atlas n'est pas (encore) connecté à des outils tiers externes.",
  },
  {
    id: "securite",
    icon: Shield,
    titre: "Permissions et sécurité",
    description: "Contrôlez qui accède à quoi. Vous pouvez inviter des collaborateurs (manager, assistant, comptable) avec des permissions granulaires : lecture seule, accès limité à certains contacts, administration complète. Toutes les données sont chiffrées au repos et en transit.",
    exemple: "Une créatrice donne un accès limité à son assistant : il peut voir les conversations et ajouter des notes, mais pas accéder aux données financières ni aux contrats. Chaque action de l'assistant est tracée.",
    benefice: "Vous travaillez en équipe sans perdre le contrôle de vos données sensibles.",
    limite: "Aucun système n'est inviolable. Nous appliquons les meilleures pratiques de sécurité, mais la vigilance reste nécessaire. Utilisez l'authentification à deux facteurs.",
  },
  {
    id: "faq",
    icon: MessageCircle,
    titre: "FAQ technique",
    description: "",
    exemple: "",
    benefice: "",
    limite: "",
  },
];

const FAQ_TECHNIQUE = [
  { q: "Sur quels appareils fonctionne Atlas ?", r: "Atlas est une application web progressive (PWA). Elle fonctionne sur n'importe quel navigateur moderne (Chrome, Safari, Firefox, Edge) sur desktop, tablette et mobile. Une version mobile native est en préparation." },
  { q: "Puis-je exporter mes données ?", r: "Oui, à tout moment. Export CSV de vos contacts, historique, et transactions. Vos données vous appartiennent. Si vous souhaitez quitter Atlas, nous vous fournissons un export complet sous 48h." },
  { q: "Comment fonctionne l'import de contacts ?", r: "Import CSV depuis n'importe quel outil (Excel, Google Contacts, autre CRM). Pour les migrations plus complexes (API, volume important), notre équipe vous accompagne gratuitement." },
  { q: "Combien de contacts puis-je gérer ?", r: "Le plan Free inclut jusqu'à 500 contacts. Le plan Pro monte à 5000 contacts. Le plan Enterprise est illimité. Au-delà de 100 000 contacts, contactez-nous pour une infrastructure dédiée." },
  { q: "Atlas respecte-t-il le RGPD ?", r: "Oui. Atlas est conçu pour respecter le RGPD : données hébergées en Europe, chiffrement au repos et en transit, gestion des consentements, droit à l'oubli, registre des traitements. Nous ne revendons aucune donnée." },
  { q: "Puis-je utiliser Atlas sans les autres outils WTF ?", r: "Oui, absolument. Atlas est un produit autonome. Les intégrations avec Chat AI, WTF Lex et le Bouclier Légal sont optionnelles. Vous pouvez utiliser Atlas seul, ou avec l'écosystème complet." },
];

function FoncDetailSection({ fonc, index, inView }: { fonc: Fonctionnalite; index: number; inView: boolean }) {
  const Icon = fonc.icon;
  const fond = index % 2 === 0 ? "var(--encre)" : "var(--creme)";
  const couleurTexte = index % 2 === 0 ? "var(--ivoire)" : "var(--encre)";
  const couleurSecondaire = index % 2 === 0 ? "var(--pierre)" : "var(--encre)";
  const opacite = index % 2 === 0 ? 1 : 0.65;

  return (
    <section id={fonc.id} className="couture-section" style={{ backgroundColor: fond, paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap-eco" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-4 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
            <Icon size={22} />
          </div>
          <h2 className="display-small" style={{ color: couleurTexte }}>{fonc.titre}</h2>
        </motion.div>

        <motion.p className="text-[15px] leading-relaxed mb-8" style={{ color: couleurSecondaire, opacity: opacite, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          {fonc.description}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
            <Cartouche label="Exemple concret" texte={fonc.exemple} couleurLabel="var(--or)" couleurTexte={couleurTexte} couleurSecondaire={couleurSecondaire} />
          </motion.div>
          <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.22}>
            <Cartouche label="Bénéfice" texte={fonc.benefice} couleurLabel="#5A7D4A" couleurTexte={couleurTexte} couleurSecondaire={couleurSecondaire} />
          </motion.div>
          <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.29}>
            <Cartouche label="Limite / Garde-fou" texte={fonc.limite} couleurLabel="#C44536" couleurTexte={couleurTexte} couleurSecondaire={couleurSecondaire} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Cartouche({ label, texte, couleurLabel, couleurTexte, couleurSecondaire }: { label: string; texte: string; couleurLabel: string; couleurTexte: string; couleurSecondaire: string }) {
  return (
    <div className="p-5 h-full" style={{ border: "1px solid var(--ligne-faible)", background: couleurTexte === "var(--ivoire)" ? "rgba(244,238,227,0.02)" : "rgba(12,10,8,0.02)" }}>
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: couleurLabel, fontFamily: "var(--font-util), monospace" }}>{label}</p>
      <p className="text-[13px] leading-relaxed" style={{ color: couleurSecondaire, opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}>{texte}</p>
    </div>
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

export function AtlasFonctionnalitesClient() {
  const featuresSansFaq = FONCTIONNALITES.filter((f) => f.id !== "faq");

  return (
    <main>
      <HeroSection />
      {featuresSansFaq.map((fonc, i) => (
        <FoncDetailWithObserver key={fonc.id} fonc={fonc} index={i} />
      ))}
      <FAQTechniqueSection />
      <CTASection />
    </main>
  );
}

function FoncDetailWithObserver({ fonc, index }: { fonc: Fonctionnalite; index: number }) {
  const { ref, inView } = useReveal(0.08);
  return (
    <div ref={ref}>
      <FoncDetailSection fonc={fonc} index={index} inView={inView} />
    </div>
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
          Documentation produit
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Fonctionnalités Atlas
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Chaque fonctionnalité décrite en détail, avec un exemple concret, son bénéfice, et ses limites honnêtes. Parce que la transparence commence par la documentation.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/atlas/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres <ArrowRight size={14} /></Link>
          <Link href="#vue-ensemble" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Explorer les fonctionnalités</Link>
        </motion.div>
      </div>
    </section>
  );
}

function FAQTechniqueSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions techniques
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          FAQ technique
        </motion.h2>
        <div className="space-y-3">
          {FAQ_TECHNIQUE.map((item, i) => (
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
          Prêt à essayer Atlas ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Découvrez le CRM pensé pour les créateurs. Centralisez, comprenez, priorisez, sans risque.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/atlas/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les offres <ArrowRight size={14} /></Link>
          <Link href="/atlas" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Retour à Atlas</Link>
        </motion.div>
      </div>
    </section>
  );
}
