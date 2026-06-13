// ═══════════════════════════════════════════════════════════
// MEGA MENU, Data
// Style : éditorial luxe + couture parisienne
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
    labelKey: "mega.departements",
    href: "/departements",
    columns: [
      {
        titleKey: "mega.departements",
        href: "/departements",
        items: [
          { labelKey: "mega.glamour_premium", href: "/departements/glamour-premium", descriptionKey: "mega.glamour_premium_desc" },
          { labelKey: "mega.influenceurs", href: "/departements/influenceurs", descriptionKey: "mega.influenceurs_desc" },
          { labelKey: "mega.youtube_podcast", href: "/departements/youtube-podcast", descriptionKey: "mega.youtube_podcast_desc" },
          { labelKey: "mega.musique", href: "/departements/musique", descriptionKey: "mega.musique_desc" },
          { labelKey: "mega.sport_fitness", href: "/departements/sport-fitness", descriptionKey: "mega.sport_fitness_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.atlas_crm",
    href: "/atlas",
    columns: [
      {
        titleKey: "mega.atlas_crm",
        href: "/atlas",
        items: [
          { labelKey: "mega.fonctionnalites", href: "/atlas/fonctionnalites", descriptionKey: "mega.fonctionnalites_desc" },
          { labelKey: "mega.crm_suite", href: "/atlas", descriptionKey: "mega.crm_suite_desc" },
          { labelKey: "mega.dashboard", href: "/atlas/fonctionnalites", descriptionKey: "mega.dashboard_desc" },
          { labelKey: "mega.automatisation_controlee", href: "/atlas/fonctionnalites", descriptionKey: "mega.automatisation_controlee_desc" },
          { labelKey: "mega.reporting_atlas", href: "/atlas/fonctionnalites", descriptionKey: "mega.reporting_atlas_desc" },
          { labelKey: "mega.conformite", href: "/atlas/conformite", descriptionKey: "mega.conformite_desc" },
          { labelKey: "mega.tarifs_atlas", href: "/atlas/pricing", descriptionKey: "mega.tarifs_atlas_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.chat_ai",
    href: "/chat-ai",
    columns: [
      {
        titleKey: "mega.chat_ai",
        href: "/chat-ai",
        items: [
          { labelKey: "mega.comment_ca_marche", href: "/chat-ai", descriptionKey: "mega.comment_ca_marche_desc" },
          { labelKey: "mega.ia_validation_humaine", href: "/chat-ai", descriptionKey: "mega.ia_validation_humaine_desc" },
          { labelKey: "mega.fan_brain", href: "/chat-ai", descriptionKey: "mega.fan_brain_desc" },
          { labelKey: "mega.qa_review", href: "/chat-ai", descriptionKey: "mega.qa_review_desc" },
          { labelKey: "mega.audit_logs", href: "/chat-ai", descriptionKey: "mega.audit_logs_desc" },
          { labelKey: "mega.ppv_copilot", href: "/chat-ai", descriptionKey: "mega.ppv_copilot_desc" },
          { labelKey: "mega.securite_chat", href: "/chat-ai", descriptionKey: "mega.securite_chat_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.wtf_companion",
    href: "/wtf-companion",
    columns: [
      {
        titleKey: "mega.wtf_companion",
        href: "/wtf-companion",
        items: [
          { labelKey: "mega.wtf_decouvrir", href: "/wtf-companion", descriptionKey: "mega.wtf_decouvrir_desc" },
          { labelKey: "mega.wtf_fonctionnalites", href: "/wtf-companion#features", descriptionKey: "mega.wtf_fonctionnalites_desc" },
          { labelKey: "mega.wtf_plans", href: "/wtf-companion#pricing", descriptionKey: "mega.wtf_plans_desc" },
          { labelKey: "mega.wtf_installer", href: "/wtf-companion#install", descriptionKey: "mega.wtf_installer_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.lex",
    href: "/lex",
    columns: [
      {
        titleKey: "mega.lex",
        href: "/lex",
        items: [
          { labelKey: "mega.ia_juridique", href: "/lex-ai", descriptionKey: "mega.ia_juridique_desc" },
          { labelKey: "mega.contrats", href: "/lex", descriptionKey: "mega.contrats_desc" },
          { labelKey: "mega.droits_image", href: "/lex", descriptionKey: "mega.droits_image_desc" },
          { labelKey: "mega.dossiers_avocat", href: "/lex-ai", descriptionKey: "mega.dossiers_avocat_desc" },
          { labelKey: "mega.guides_juridiques", href: "/protection/guide", descriptionKey: "mega.guides_juridiques_desc" },
          { labelKey: "mega.changements_legaux", href: "/lex/changements", descriptionKey: "mega.changements_legaux_desc" },
        ],
      },
    ],
  },
  {
    labelKey: "mega.protection",
    href: "/protection",
    columns: [
      {
        titleKey: "mega.protection",
        href: "/protection",
        items: [
          { labelKey: "mega.guide_global", href: "/protection/guide", descriptionKey: "mega.guide_global_desc" },
          { labelKey: "mega.onlyfans", href: "/protection/onlyfans", descriptionKey: "mega.onlyfans_desc" },
          { labelKey: "mega.fansly", href: "/protection/fansly", descriptionKey: "mega.fansly_desc" },
          { labelKey: "mega.mym", href: "/protection/mym", descriptionKey: "mega.mym_desc" },
          { labelKey: "mega.instagram", href: "/protection/instagram", descriptionKey: "mega.instagram_desc" },
          { labelKey: "mega.youtube", href: "/protection/youtube", descriptionKey: "mega.youtube_desc" },
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
