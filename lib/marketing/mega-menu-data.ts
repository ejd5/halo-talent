// ═══════════════════════════════════════════════════════════
// MEGA MENU — Data (Chargeflow-style, 6 catégories)
// Chaque catégorie a sa propre couleur de glow
// ═══════════════════════════════════════════════════════════

export interface MegaMenuItem {
  labelKey: string;
  href: string;
  descriptionKey?: string;
}

export interface MegaMenuColumn {
  titleKey: string;
  href?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuEntry {
  labelKey: string;
  href?: string;
  columns?: MegaMenuColumn[];
}

/* ─── NEW: Card-based mega-menu structure ─── */

export interface MegaCard {
  labelKey: string;
  descriptionKey: string;
  href: string;
  badge?: string;           // "NEW" | "FREE" | "PRO" | "BETA" etc.
  glowColor: string;        // CSS color for the card's unique glow
  iconPath?: string;         // SVG path data for abstract icon
}

export interface NavSection {
  labelKey: string;          // Translation key for top-level label
  href?: string;             // If no cards, direct link
  cards?: MegaCard[];        // Card-based mega-menu
}

/* ─── 6 Top-Level Navigation Sections ─── */

export const NAV_SECTIONS: NavSection[] = [
  {
    labelKey: "mega.services",
    cards: [
      {
        labelKey: "mega.management_creatif",
        descriptionKey: "mega.management_creatif_desc",
        href: "/commissions",
        glowColor: "#C75B39",
        iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
      },
      {
        labelKey: "mega.strategie_image",
        descriptionKey: "mega.strategie_image_desc",
        href: "/departements",
        glowColor: "#F59E0B",
        iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      },
      {
        labelKey: "mega.croissance",
        descriptionKey: "mega.croissance_desc",
        href: "/saas",
        badge: "PRO",
        glowColor: "#10B981",
        iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      },
      {
        labelKey: "mega.studio_ia",
        descriptionKey: "mega.studio_ia_desc",
        href: "/saas",
        badge: "NEW",
        glowColor: "#8B5CF6",
        iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      },
      {
        labelKey: "mega.protection_comptes",
        descriptionKey: "mega.protection_comptes_desc",
        href: "/protection",
        glowColor: "#EF4444",
        iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      },
    ],
  },
  {
    labelKey: "mega.solutions",
    cards: [
      {
        labelKey: "mega.atlas_crm",
        descriptionKey: "mega.atlas_crm_desc",
        href: "/atlas",
        glowColor: "#3B82F6",
        iconPath: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      },
      {
        labelKey: "mega.chat_ai",
        descriptionKey: "mega.chat_ai_desc",
        href: "/chat-ai",
        badge: "NEW",
        glowColor: "#8B5CF6",
        iconPath: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      },
      {
        labelKey: "mega.wtf_companion",
        descriptionKey: "mega.wtf_companion_desc",
        href: "/wtf-companion",
        badge: "BETA",
        glowColor: "#10B981",
        iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
    ],
  },
  {
    labelKey: "mega.tarifs",
    href: "/pricing",
  },
  {
    labelKey: "mega.juridique",
    cards: [
      {
        labelKey: "mega.lex",
        descriptionKey: "mega.lex_desc",
        href: "/lex",
        glowColor: "#D8A95B",
        iconPath: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      },
      {
        labelKey: "mega.protection",
        descriptionKey: "mega.protection_desc",
        href: "/protection",
        glowColor: "#EF4444",
        iconPath: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      },
      {
        labelKey: "mega.ia_juridique",
        descriptionKey: "mega.ia_juridique_desc",
        href: "/lex-ai",
        badge: "NEW",
        glowColor: "#8B5CF6",
        iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      },
    ],
  },
  {
    labelKey: "mega.ressources",
    cards: [
      {
        labelKey: "mega.blog",
        descriptionKey: "mega.blog_desc",
        href: "/blog",
        glowColor: "#06B6D4",
        iconPath: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      },
      {
        labelKey: "mega.guides",
        descriptionKey: "mega.guides_desc",
        href: "/guides",
        glowColor: "#10B981",
        iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        labelKey: "mega.glossaire",
        descriptionKey: "mega.glossaire_desc",
        href: "/glossaire",
        glowColor: "#F59E0B",
        iconPath: "M4 6h16M4 12h16M4 18h7",
      },
      {
        labelKey: "mega.faq",
        descriptionKey: "mega.faq_desc",
        href: "/pricing",
        badge: "FREE",
        glowColor: "#3B82F6",
        iconPath: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
    ],
  },
  {
    labelKey: "mega.qui_sommes_nous",
    cards: [
      {
        labelKey: "mega.notre_histoire",
        descriptionKey: "mega.notre_histoire_desc",
        href: "/qui-sommes-nous",
        glowColor: "#C75B39",
        iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        labelKey: "mega.notre_manifeste",
        descriptionKey: "mega.notre_manifeste_desc",
        href: "/manifeste",
        glowColor: "#D8A95B",
        iconPath: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      },
      {
        labelKey: "mega.commissions_transparentes",
        descriptionKey: "mega.commissions_transparentes_desc",
        href: "/commissions",
        badge: "OPEN",
        glowColor: "#10B981",
        iconPath: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      },
    ],
  },
];

/* ─── Keep old format for backward compatibility ─── */
export const MEGA_MENU: MegaMenuEntry[] = [
  {
    labelKey: "mega.qui_sommes_nous",
    columns: [
      {
        titleKey: "mega.qui_sommes_nous",
        href: "/qui-sommes-nous",
        items: [
          { labelKey: "mega.notre_histoire", href: "/qui-sommes-nous", descriptionKey: "mega.notre_histoire_desc" },
          { labelKey: "mega.constat_marche", href: "/qui-sommes-nous#constat", descriptionKey: "mega.constat_marche_desc" },
          { labelKey: "mega.notre_manifeste", href: "/manifeste", descriptionKey: "mega.notre_manifeste_desc" },
          { labelKey: "mega.notre_difference", href: "/qui-sommes-nous#pourquoi", descriptionKey: "mega.notre_difference_desc" },
          { labelKey: "mega.ce_que_nous_refusons", href: "/qui-sommes-nous#refusons", descriptionKey: "mega.ce_que_nous_refusons_desc" },
          { labelKey: "mega.vision_long_terme", href: "/qui-sommes-nous#conviction", descriptionKey: "mega.vision_long_terme_desc" },
          { labelKey: "mega.commissions_transparentes", href: "/commissions", descriptionKey: "mega.commissions_transparentes_desc" },
          { labelKey: "mega.maison_creative", href: "/qui-sommes-nous#construisons", descriptionKey: "mega.maison_creative_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.services",
    columns: [
      {
        titleKey: "mega.management_creatif",
        items: [
          { labelKey: "mega.management_creatif", href: "/commissions", descriptionKey: "mega.management_creatif_desc" },
          { labelKey: "mega.strategie_image", href: "/departements", descriptionKey: "mega.strategie_image_desc" },
          { labelKey: "mega.croissance", href: "/saas", descriptionKey: "mega.croissance_desc" },
          { labelKey: "mega.studio_ia", href: "/saas", descriptionKey: "mega.studio_ia_desc" },
          { labelKey: "mega.crm", href: "/atlas", descriptionKey: "mega.crm_desc" },
          { labelKey: "mega.juridique_preparatoire", href: "/lex", descriptionKey: "mega.juridique_preparatoire_desc" },
          { labelKey: "mega.protection_comptes", href: "/protection", descriptionKey: "mega.protection_comptes_desc" },
          { labelKey: "mega.reporting", href: "/atlas/fonctionnalites", descriptionKey: "mega.reporting_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.tarifs",
    href: "/pricing",
  },
  {
    labelKey: "mega.ressources",
    columns: [
      {
        titleKey: "mega.ressources",
        items: [
          { labelKey: "mega.blog", href: "/blog", descriptionKey: "mega.blog_desc" },
          { labelKey: "mega.guides", href: "/guides", descriptionKey: "mega.guides_desc" },
          { labelKey: "mega.glossaire", href: "/glossaire", descriptionKey: "mega.glossaire_desc" },
          { labelKey: "mega.contrat_type", href: "/contrat-type", descriptionKey: "mega.contrat_type_desc" },
          { labelKey: "mega.faq", href: "/pricing", descriptionKey: "mega.faq_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.contact",
    href: "/contact",
  },
];
