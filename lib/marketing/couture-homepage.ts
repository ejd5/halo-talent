// ═══════════════════════════════════════════════════════════
// COUTURE HOMEPAGE — Data
// Direction : éditorial magazine luxe + haute couture parisienne
// ═══════════════════════════════════════════════════════════

// --- Side Rail ---
export const RAIL_LABELS = ["PARIS", "NEW YORK", "MILAN", "TOKYO"] as const;

// --- Hero ---
export const HERO_BADGE = "HALO TALENT — MAISON DE CRÉATION";
export const HERO_TITLE = {
  line1: "Votre image.",
  line2: "Votre croissance.",
  line3: "Notre stratégie.",
  line4: "Votre contrôle.",
};
export const HERO_SUBTITLE =
  "Halo Talent réunit management, IA, CRM, protection juridique et stratégie de croissance pour aider les créateurs à structurer leur activité sans perdre le contrôle.";
export const HERO_MICRO =
  "Pas une agence opaque. Pas un outil isolé. Une maison créative + un système d'exploitation.";
export const HERO_REASSURANCE =
  "Accompagnement humain. Outils traçables. Décisions contrôlées.";

export const HERO_CTAS = [
  { label: "Demander une démo", href: "/demo", variant: "fill" as const },
  { label: "Découvrir Halo", href: "#maison", variant: "outline" as const },
  { label: "Explorer Chat AI", href: "/chat-ai", variant: "ghost" as const },
];

export const FLOATING_CARD_LABELS = [
  { label: "Management", x: "6%", y: "16%", delay: 0 },
  { label: "Studio IA", x: "80%", y: "10%", delay: 0.6 },
  { label: "Atlas CRM", x: "84%", y: "52%", delay: 0.3 },
  { label: "Chat AI", x: "10%", y: "60%", delay: 1.0 },
  { label: "Halo Lex", x: "48%", y: "76%", delay: 0.5 },
  { label: "Commissions", x: "54%", y: "18%", delay: 0.8 },
];

// --- Signal Strip (Marquee words) ---
export const SIGNAL_WORDS = [
  "STRATÉGIE",
  "IMAGE",
  "PROTECTION",
  "CRM",
  "IA STUDIO",
  "CHAT AI",
  "LEGAL",
  "CREATOR OS",
];

// --- Editorial Vignettes ---
export interface Vignette {
  id: string;
  num: string;
  title: string;
  desc: string;
  href: string;
}

export const VIGNETTES: Vignette[] = [
  {
    id: "management",
    num: "01",
    title: "Management",
    desc: "Représentation, négociation, planification — une équipe dédiée payée au résultat, jamais à l'opacité.",
    href: "/commissions",
  },
  {
    id: "studio",
    num: "02",
    title: "Studio IA",
    desc: "Génération, retouche, montage assisté — créer plus vite sans perdre l'intention ni le style.",
    href: "/studio",
  },
  {
    id: "atlas",
    num: "03",
    title: "Atlas CRM",
    desc: "Comprendre votre audience, segmenter, personnaliser, relancer — sans chatter à votre place.",
    href: "/atlas",
  },
  {
    id: "chat",
    num: "04",
    title: "Sovereign Chat AI",
    desc: "Assistant qui prépare, vérifie et structure — l'IA propose, l'humain valide, le créateur contrôle.",
    href: "/chat-ai",
  },
  {
    id: "lex",
    num: "05",
    title: "Halo Lex",
    desc: "Analyse de contrats, veille juridique, conformité — structurer et documenter les risques.",
    href: "/protection",
  },
  {
    id: "commissions",
    num: "06",
    title: "Commissions",
    desc: "Un barème transparent et dégressif — plus vous générez, moins vous partagez.",
    href: "/commissions",
  },
];

// --- Editorial Intro ---
export const EDITORIAL_INTRO_TITLE = "Tout ce qu'il faut. Dans une seule maison.";
export const EDITORIAL_INTRO_TEXT =
  "Créer demande du temps. Protéger demande de la rigueur. Grandir demande de la clarté. Halo Talent rassemble management humain, intelligence artificielle, CRM et protection juridique dans un même écosystème pensé pour les créateurs ambitieux.";

// --- Services Grid ---
export interface CoutureService {
  id: string;
  title: string;
  desc: string;
  capabilities: string[];
  cta: { label: string; href: string };
}

export const SERVICES: CoutureService[] = [
  {
    id: "management",
    title: "Management",
    desc: "De la stratégie à l'exécution, une équipe dédiée à votre croissance.",
    capabilities: [
      "Représentation et négociation",
      "Planification stratégique",
      "Direction d'image et branding",
      "Développement de revenus",
    ],
    cta: { label: "Explorer le management", href: "/commissions" },
  },
  {
    id: "studio",
    title: "Studio IA",
    desc: "Créer plus vite, sans perdre l'intention ni la qualité.",
    capabilities: [
      "Génération d'images et de textes",
      "Montage et retouche assistés",
      "Templates et kits réutilisables",
      "Export multi-formats",
    ],
    cta: { label: "Explorer le Studio", href: "/studio" },
  },
  {
    id: "atlas",
    title: "Atlas CRM",
    desc: "Comprendre, segmenter, relancer — avec précision.",
    capabilities: [
      "Segmentation d'audience",
      "Campagnes personnalisées",
      "Revenue Radar et prédictions",
      "Brand deal pipeline",
    ],
    cta: { label: "Explorer Atlas", href: "/atlas" },
  },
  {
    id: "chat",
    title: "Sovereign Chat AI",
    desc: "L'IA prépare. L'humain valide. Le créateur contrôle.",
    capabilities: [
      "Préparation de réponses",
      "Vérification de conformité",
      "Brouillons réutilisables",
      "Mode multi-langues",
    ],
    cta: { label: "Explorer Chat AI", href: "/chat-ai" },
  },
  {
    id: "lex",
    title: "Halo Lex",
    desc: "Structurer les risques, documenter les décisions.",
    capabilities: [
      "Analyse de contrats",
      "Veille juridique",
      "Suivi de conformité",
      "Pistes d'audit",
    ],
    cta: { label: "Explorer Halo Lex", href: "/protection" },
  },
  {
    id: "commissions",
    title: "Commissions",
    desc: "Plus de clarté sur ce que vous gardez.",
    capabilities: [
      "Barème public et transparent",
      "Calcul en temps réel",
      "Aucun frais caché",
      "Dégressif avec la croissance",
    ],
    cta: { label: "Voir le barème", href: "/commissions" },
  },
];

// --- Carousel Slides ---
export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  system: string;
  benefit: string;
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "solo",
    title: "Créateur solo",
    subtitle: "Vous voulez professionnaliser sans vous perdre dans la gestion.",
    problem: "Trop d'outils éparpillés, pas de vision d'ensemble.",
    system: "Management dédié + Studio IA + CRM centralisé.",
    benefit: "Clarifie les priorités et libère du temps de création.",
  },
  {
    id: "premium",
    title: "Créateur premium",
    subtitle: "Votre marque grandit, vos enjeux aussi.",
    problem: "Contrats complexes, audience à segmenter, partenariats à sécuriser.",
    system: "Halo Lex + Atlas CRM + Management stratégique.",
    benefit: "Aide à structurer la croissance et documenter les décisions.",
  },
  {
    id: "team",
    title: "Équipe créative",
    subtitle: "Vous gérez une équipe de création et de production.",
    problem: "Coordination difficile, droits flous, validation lente.",
    system: "Studio IA collaboratif + Chat AI + Content Vault.",
    benefit: "Améliore la traçabilité et réduit la dispersion.",
  },
  {
    id: "brand",
    title: "Marque personnelle",
    subtitle: "Vous construisez une marque, pas seulement une audience.",
    problem: "Image à contrôler, deals à négocier, protection à assurer.",
    system: "Direction d'image + Halo Lex + Atlas CRM.",
    benefit: "Centralise les décisions et renforce la cohérence.",
  },
  {
    id: "agency",
    title: "Agence existante",
    subtitle: "Vous dirigez une agence, vous voulez un système.",
    problem: "Process manuels, marge réduite, qualité variable.",
    system: "Studio IA + Atlas CRM + Revenue Inbox.",
    benefit: "Améliore l'efficacité opérationnelle sans perte de qualité.",
  },
  {
    id: "international",
    title: "Expansion internationale",
    subtitle: "Vous percez à l'international, les règles changent.",
    problem: "Contrats multi-juridictions, fiscalité complexe, audience fragmentée.",
    system: "Halo Lex multi-droit + Atlas CRM global + Chat AI 6 langues.",
    benefit: "Structure la conformité et facilite la coordination.",
  },
];

// --- Reassurance Items (qualitative only, no fake numbers) ---
export interface ReassuranceItem {
  title: string;
  desc: string;
}

export const REASSURANCE_ITEMS: ReassuranceItem[] = [
  {
    title: "Une vision plus claire",
    desc: "Tous vos outils, données et décisions dans un même espace, piloté avec transparence.",
  },
  {
    title: "Des outils connectés",
    desc: "Studio IA, CRM, Chat AI, Legal — des modules qui communiquent entre eux, sans silos.",
  },
  {
    title: "Des décisions documentées",
    desc: "Chaque contrat, chaque campagne, chaque validation laisse une trace consultable.",
  },
  {
    title: "Une croissance mieux pilotée",
    desc: "Des indicateurs clairs, des projections prudentes, des ajustements réguliers.",
  },
  {
    title: "Un contrôle renforcé",
    desc: "Vous restez propriétaire de vos comptes, de votre image et de vos décisions.",
  },
  {
    title: "Un accompagnement humain",
    desc: "Des experts en management, droit et stratégie — pas des algorithmes seuls.",
  },
];

// --- Statement Section ---
export const STATEMENT_TITLE =
  "Nous ne suivons pas l'industrie. Nous construisons une maison plus juste.";
export const STATEMENT_TEXT =
  "Pas d'opacité sur les marges. Pas de contrats pièges. Pas de chatterie automatisée. Halo Talent est né d'une conviction : les créateurs méritent un management à la hauteur de leur ambition — transparent, exigeant, humain et technologique.";

// --- Commission Section (logic preserved from existing) ---
export const COMMISSION_TITLE = "Pas 50%. Une logique plus juste.";
export const COMMISSION_SUBTITLE =
  "Notre barème est marginal et dégressif — vous ne payez le taux que sur la tranche concernée, pas sur la totalité.";
export const COMMISSION_DISCLAIMER =
  "Les montants affichés sont indicatifs et basés sur le barème public Halo Talent. Aucun revenu n'est garanti.";

export const COMMISSION_TIERS = [
  { label: "0 € → 5 000 €", rate: "30%" },
  { label: "5 000 € → 20 000 €", rate: "25%" },
  { label: "20 000 € → 50 000 €", rate: "20%" },
  { label: "50 000 € → 150 000 €", rate: "15%" },
  { label: "150 000 € et plus", rate: "10%" },
];

// --- Legal Shield Section ---
export const LEGAL_SHIELD_TITLE = "Vos contrats, vos droits, votre contrôle.";
export const LEGAL_SHIELD_TEXT =
  "Halo Lex analyse vos contrats, surveille les clauses à risque et vous aide à documenter vos obligations — sans remplacer l'avocat.";
export const LEGAL_SHIELD_DISCLAIMER =
  "Halo Talent ne fournit pas de conseil juridique. Halo Lex est un outil d'aide à la structuration, à la documentation et à la surveillance des risques contractuels. Consultez un avocat pour toute décision juridique.";

// --- Footer ---
export const FOOTER_WORDMARK = "Halo Talent";
export const FOOTER_TAGLINE =
  "La maison des créateurs qui construisent une marque, pas seulement une audience.";

export const FOOTER_LINKS = {
  navigation: [
    { label: "Manifeste", href: "/manifeste" },
    { label: "Commissions", href: "/commissions" },
    { label: "Bouclier Légal", href: "/protection" },
    { label: "Chat AI", href: "/chat-ai" },
    { label: "Studio", href: "/studio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "CGU", href: "/cgu" },
    { label: "Contrat type", href: "/contrat-type" },
  ],
};

export const NEWSLETTER_TEXT =
  "Recevez les mises à jour produit et guides Halo.";
