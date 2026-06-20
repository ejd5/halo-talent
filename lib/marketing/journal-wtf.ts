// ═══════════════════════════════════════════════════════════
// LE JOURNAL WTF — Configuration éditoriale
// Style : magazine premium, maison de management créateur
// ═══════════════════════════════════════════════════════════

export const JOURNAL_WTF = {
  name: "LE JOURNAL WTF",
  signature: "WHERE TALENT FORMS — EDITORIAL HOUSE",
  subtitle:
    "Perspectives, stratégies et dossiers pour créateurs qui veulent construire une marque, pas seulement une audience.",
  description:
    "Un espace éditorial pour comprendre l'image, la protection, les outils, les plateformes et les choix qui permettent à un créateur de structurer son activité avec plus de contrôle.",

  seo: {
    title: "Le Journal WTF — Image, IA, protection et management créateur",
    description:
      "Guides, dossiers et perspectives par Where Talent Forms pour créateurs, influenceurs, artistes et sportifs qui veulent structurer leur image, protéger leur activité et garder le contrôle.",
    ogTitle: "Le Journal WTF — Where Talent Forms",
    ogDescription:
      "Perspectives, stratégies et dossiers pour créateurs qui veulent construire une marque, pas seulement une audience.",
  },

  aRetenir:
    "WTF ne publie pas des promesses. Nous publions des méthodes, des questions à poser, des cadres de décision et des guides pour aider les créateurs à construire avec plus de clarté.",

  newsletter: {
    title: "Recevoir les prochains dossiers WTF",
    text: "Une sélection de perspectives, guides et analyses pour créateurs, équipes et marques qui veulent structurer leur image avec plus de contrôle.",
    cta: "S'inscrire",
  },
} as const;

/* ─── Rubriques ─── */

export interface JournalRubrique {
  id: string;
  label: string;
  slug: string;
  description: string;
  accent: string;
  ordre: number;
  ctaCourt: string;
}

export const RUBRIQUES: JournalRubrique[] = [
  {
    id: "maison",
    label: "Maison",
    slug: "maison",
    description:
      "La vision, le manifeste et les choix qui fondent Where Talent Forms.",
    accent: "var(--or, #D8A95B)",
    ordre: 1,
    ctaCourt: "Découvrir la Maison",
  },
  {
    id: "image-influence",
    label: "Image & Influence",
    slug: "image-influence",
    description:
      "Construire une image premium, cohérente et durable.",
    accent: "#C96A4A",
    ordre: 2,
    ctaCourt: "Explorer",
  },
  {
    id: "atlas-ia",
    label: "Atlas & IA",
    slug: "atlas-ia",
    description:
      "CRM, IA contrôlée, organisation, outils et workflows.",
    accent: "#8FB58A",
    ordre: 3,
    ctaCourt: "Découvrir Atlas",
  },
  {
    id: "protection",
    label: "Protection",
    slug: "protection",
    description:
      "Sécurité, plateformes, preuves, accès et prévention des risques.",
    accent: "#7A8A95",
    ordre: 4,
    ctaCourt: "Voir les guides",
  },
  {
    id: "lex",
    label: "Lex",
    slug: "lex",
    description:
      "Contrats, droits d'image, dossiers préparatoires et questions juridiques courantes.",
    accent: "#9B8E7A",
    ordre: 5,
    ctaCourt: "Explorer Lex",
  },
  {
    id: "departements",
    label: "Départements",
    slug: "departements",
    description:
      "Glamour premium, influence, vidéo, musique et sport.",
    accent: "#A08070",
    ordre: 6,
    ctaCourt: "Voir les départements",
  },
  {
    id: "dossiers",
    label: "Dossiers",
    slug: "dossiers",
    description:
      "Analyses longues, comparatifs et prises de position sur le marché créateur.",
    accent: "var(--or, #D8A95B)",
    ordre: 7,
    ctaCourt: "Lire les dossiers",
  },
];

/* ─── Article couverture (featured) ─── */

export const COUVERTURE = {
  slug: "pourquoi-createur-centre-modele",
  title:
    "Pourquoi le créateur doit redevenir le centre du modèle",
  category: "maison",
  excerpt:
    "Le marché du management créateur a grandi vite. Trop vite parfois. Le Journal WTF ouvre une réflexion sur la transparence, le contrôle, la protection et la place réelle du talent dans un modèle qui doit redevenir plus humain.",
  cta: "Lire le dossier",
};

/* ─── Dossier du mois ─── */

export const DOSSIER_DU_MOIS = {
  title: "Le dossier du mois",
  slug: "pourquoi-createurs-changent-agence",
  articleTitle:
    "Pourquoi les créateurs changent d'agence tous les six mois — et comment construire un modèle plus durable",
  description:
    "Un dossier sur la confiance, les commissions, les outils, la transparence et les modèles d'accompagnement à long terme.",
  cta: "Lire le dossier",
};

/* ─── Guides essentiels ─── */

export interface GuideEssentiel {
  title: string;
  description: string;
  rubrique: string;
  slug: string;
}

export const GUIDES_ESSENTIELS: GuideEssentiel[] = [
  {
    title: "Sécurité des comptes créateurs",
    description:
      "La checklist essentielle pour protéger vos accès et votre activité.",
    rubrique: "Protection",
    slug: "securite-comptes-createurs-checklist",
  },
  {
    title: "Comprendre les commissions",
    description:
      "Comment fonctionnent les commissions marginales et pourquoi elles changent la donne.",
    rubrique: "Dossiers",
    slug: "commissions-createurs-avant-signer",
  },
  {
    title: "Préparer un contrat",
    description:
      "Les questions à poser et les points à vérifier avant d'engager une collaboration.",
    rubrique: "Lex",
    slug: "droit-image-questions-collaboration",
  },
  {
    title: "Centraliser son activité",
    description:
      "Pourquoi un CRM créateur change la manière de travailler avec sa communauté.",
    rubrique: "Atlas & IA",
    slug: "crm-createur-centraliser-activite",
  },
  {
    title: "Utiliser l'IA sans perdre le contrôle",
    description:
      "Les principes pour une utilisation responsable et efficace de l'IA.",
    rubrique: "Atlas & IA",
    slug: "ia-messages-prives-controle",
  },
];

/* ─── Type article ─── */

export interface ArticleWTF {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  rubrique: string;
  readingTime: number;
  publishedAt: string;
  author?: string;
  heroImage?: string;
  metaTitle: string;
  metaDescription: string;
  content: ArticleSectionWTF[];
  internalLinks?: { label: string; href: string }[];
  cta?: {
    title: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

export type ArticleSectionWTF =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "pullquote"; content: string; author?: string }
  | { type: "list"; content: string; items: string[] }
  | { type: "a-retenir"; content: string }
  | { type: "faq"; question: string; answer: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "cta"; label: string; href: string };
