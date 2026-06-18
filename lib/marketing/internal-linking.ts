// ─── Groupes de maillage interne pour "Continuer avec" et CTA transversaux ───

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface LinkGroup {
  page: string;
  title: string;
  links: RelatedLink[];
}

// Groupes "Continuer avec" pour chaque page clé
export const CONTINUER_AVEC: LinkGroup[] = [
  {
    page: "/qui-sommes-nous",
    title: "Continuer avec",
    links: [
      { label: "Notre Manifeste", href: "/manifeste", description: "Ce que nous croyons, ce que nous refusons." },
      { label: "Commissions transparentes", href: "/commissions", description: "Comprenez notre modèle de rémunération." },
      { label: "Départements", href: "/departements", description: "Découvrez comment WTF est organisé." },
    ],
  },
  {
    page: "/manifeste",
    title: "Continuer avec",
    links: [
      { label: "Qui nous sommes", href: "/qui-sommes-nous", description: "L'histoire et l'équipe derrière WTF." },
      { label: "Comparaisons", href: "/comparaisons", description: "WTF vs les modèles plus classiques." },
      { label: "Guide du créateur", href: "/protection/guide", description: "Vos droits fondamentaux." },
    ],
  },
  {
    page: "/commissions",
    title: "Continuer avec",
    links: [
      { label: "Simulateur de commissions", href: "/demo", description: "Visualisez l'impact sur vos revenus." },
      { label: "Comparaisons", href: "/comparaisons", description: "Agence traditionnelle vs WTF." },
      { label: "Tarifs", href: "/pricing", description: "Nos formules et services." },
    ],
  },
  {
    page: "/atlas",
    title: "Continuer avec",
    links: [
      { label: "CHATEENG", href: "/chat-ai", description: "L'assistant IA qui comprend votre activité." },
      { label: "Protection", href: "/protection", description: "Bouclier Légal et conformité." },
      { label: "Scénarios d'usage", href: "/atlas/testimonials", description: "Comment les créateurs utilisent Atlas." },
    ],
  },
  {
    page: "/chat-ai",
    title: "Continuer avec",
    links: [
      { label: "Atlas CRM", href: "/atlas", description: "Le CRM qui alimente votre CHATEENG." },
      { label: "Protection", href: "/protection", description: "Sécurisez vos comptes et contenus." },
      { label: "Démo", href: "/demo", description: "Essayez CHATEENG par vous-même." },
    ],
  },
  {
    page: "/lex-ai",
    title: "Continuer avec",
    links: [
      { label: "Contrat-type créateur", href: "/contrat-type", description: "Un modèle de contrat équilibré." },
      { label: "Protection", href: "/protection", description: "Bouclier Légal et conformité." },
      { label: "Contact", href: "/contact", description: "Parlez à un avocat partenaire." },
    ],
  },
  {
    page: "/protection",
    title: "Continuer avec",
    links: [
      { label: "Protection OnlyFans", href: "/protection/onlyfans", description: "Spécifique à OnlyFans." },
      { label: "Protection Instagram", href: "/protection/instagram", description: "Spécifique à Instagram." },
      { label: "Guide du créateur", href: "/protection/guide", description: "Vos droits, les signaux d'alerte." },
      { label: "WTF Lex", href: "/lex-ai", description: "Analysez vos contrats." },
    ],
  },
  {
    page: "/departements",
    title: "Continuer avec",
    links: [
      { label: "Atlas CRM", href: "/atlas", description: "Département CRM." },
      { label: "CHATEENG", href: "/chat-ai", description: "Département IA conversationnelle." },
      { label: "Lex AI", href: "/lex-ai", description: "Département juridique." },
      { label: "Protection", href: "/protection", description: "Département protection." },
    ],
  },
  {
    page: "/pricing",
    title: "Continuer avec",
    links: [
      { label: "Commissions", href: "/commissions", description: "Comprenez notre modèle." },
      { label: "Comparaisons", href: "/comparaisons", description: "WTF vs les alternatives." },
      { label: "Démo", href: "/demo", description: "Testez avant de choisir." },
    ],
  },
  {
    page: "/demo",
    title: "Continuer avec",
    links: [
      { label: "Tarifs", href: "/pricing", description: "Nos formules." },
      { label: "CHATEENG", href: "/chat-ai", description: "Découvrez l'assistant IA." },
      { label: "Contact", href: "/contact", description: "Parlez-nous de votre projet." },
    ],
  },
  {
    page: "/contact",
    title: "Continuer avec",
    links: [
      { label: "FAQ", href: "/faq", description: "Votre question a peut-être déjà une réponse." },
      { label: "Guides", href: "/guides", description: "Nos guides pratiques." },
      { label: "Démo", href: "/demo", description: "Essayez la plateforme." },
    ],
  },
  {
    page: "/blog",
    title: "Continuer avec",
    links: [
      { label: "Guides", href: "/guides", description: "Des guides pratiques et détaillés." },
      { label: "Glossaire", href: "/glossaire", description: "Les termes à connaître." },
      { label: "FAQ", href: "/faq", description: "Questions fréquentes." },
    ],
  },
  {
    page: "/guides",
    title: "Continuer avec",
    links: [
      { label: "Blog", href: "/blog", description: "Articles de fond." },
      { label: "Glossaire", href: "/glossaire", description: "Comprendre les termes." },
      { label: "FAQ", href: "/faq", description: "Vos questions, nos réponses." },
    ],
  },
  {
    page: "/glossaire",
    title: "Continuer avec",
    links: [
      { label: "Guides", href: "/guides", description: "Approfondissez avec nos guides." },
      { label: "Blog", href: "/blog", description: "Articles et analyses." },
      { label: "FAQ", href: "/faq", description: "Questions fréquentes." },
    ],
  },
  {
    page: "/comparaisons",
    title: "Continuer avec",
    links: [
      { label: "Commissions", href: "/commissions", description: "Notre modèle transparent." },
      { label: "Qui nous sommes", href: "/qui-sommes-nous", description: "Découvrez notre approche." },
      { label: "Démo", href: "/demo", description: "Faites votre propre comparaison." },
    ],
  },
  {
    page: "/faq",
    title: "Continuer avec",
    links: [
      { label: "Contact", href: "/contact", description: "Vous n'avez pas trouvé votre réponse ?" },
      { label: "Guides", href: "/guides", description: "Des guides détaillés." },
      { label: "Démo", href: "/demo", description: "Voyez la plateforme en action." },
    ],
  },
  {
    page: "/contrat-type",
    title: "Continuer avec",
    links: [
      { label: "WTF Lex", href: "/lex-ai", description: "Analysez vos contrats." },
      { label: "Protection", href: "/protection", description: "Bouclier Légal." },
      { label: "Guide du créateur", href: "/protection/guide", description: "Vos droits." },
    ],
  },
];

// Cross-CTAs transversaux (blocs réutilisables)
export const CROSS_CTA = {
  demo: {
    label: "Demander une démo",
    href: "/demo",
    description: "Voyez la plateforme en action, posez vos questions.",
  },
  contact: {
    label: "Nous contacter",
    href: "/contact",
    description: "Une question spécifique ? Écrivez-nous.",
  },
  commissions: {
    label: "Simuler vos commissions",
    href: "/commissions",
    description: "Comparez et visualisez l'impact sur vos revenus.",
  },
  atlas: {
    label: "Découvrir Atlas CRM",
    href: "/atlas",
    description: "Le CRM pensé pour les créateurs.",
  },
  chatAi: {
    label: "Essayer CHATEENG",
    href: "/chat-ai",
    description: "L'assistant IA disponible 24/7.",
  },
  lex: {
    label: "Analyser un contrat",
    href: "/lex-ai",
    description: "WTF Lex analyse vos contrats en minutes.",
  },
};
