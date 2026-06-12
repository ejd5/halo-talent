// ─── Site configuration — edit before production ───

export const SITE_CONFIG = {
  /** Legal entity name */
  editorName: "[À compléter — nom de la société]",
  /** Legal form (SARL, SAS, EI, etc.) */
  legalForm: "[À compléter — forme juridique]",
  /** Registered address */
  address: "[À compléter — adresse du siège social]",
  /** Contact email for legal/admin matters */
  contactEmail: "contact@halotalent.com",
  /** Publication director */
  publicationDirector: "[À compléter — nom du directeur de publication]",
  /** Hosting provider */
  hoster: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  /** SIRET / registration number */
  registrationNumber: "[À compléter — numéro SIRET]",
  /** Data protection officer email */
  dpoEmail: "[À compléter — email DPO ou privacy]",

  socialLinks: {
    instagram: "",
    tiktok: "",
    linkedin: "",
    x: "",
  },
} as const;

export type SocialPlatform = keyof typeof SITE_CONFIG.socialLinks;
