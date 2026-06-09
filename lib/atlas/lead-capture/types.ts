/* ─── Lead Capture Types ─── */

export type PageType = "link_in_bio" | "capture_page" | "popup_form";
export type BackgroundType = "color" | "image" | "video";
export type LinkType = "social" | "content" | "custom" | "capture_form" | "store";
export type PageStatus = "draft" | "active" | "paused";
export type SubmissionStatus = "pending" | "confirmed" | "expired" | "abandoned";

export interface LeadCapturePage {
  id: string;
  creator_id?: string;
  page_type: PageType;
  title: string;
  slug: string;
  status: PageStatus;

  /* Design */
  background_type: BackgroundType;
  background_value: string;
  font_family: string;
  accent_color: string;
  text_color: string;
  avatar_url?: string;
  bio?: string;
  display_name?: string;

  /* Capture form */
  headline?: string;
  subtitle?: string;
  cta_text: string;
  confirmation_message: string;
  collect_first_name: boolean;
  consent_text: string;

  /* Stats */
  views: number;
  conversions: number;

  /* SEO */
  seo_title?: string;
  seo_description?: string;
  utm_campaign?: string;

  created_at: string;
  updated_at: string;
}

export interface LeadCaptureLink {
  id: string;
  page_id: string;
  creator_id?: string;
  link_type: LinkType;
  label: string;
  url: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  utm_enabled: boolean;
  created_at: string;
}

export interface LeadCaptureSubmission {
  id: string;
  page_id: string;
  creator_id: string;
  fan_id?: string;
  email: string;
  first_name?: string;
  source?: string;
  ip_address?: string;
  user_agent?: string;
  confirmed_at?: string;
  confirmation_token?: string;
  token_expires_at?: string;
  status: SubmissionStatus;
  created_at: string;
}

/* ─── Icons mapping ─── */

export const SOCIAL_ICONS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter",
  youtube: "YouTube",
  onlyfans: "OnlyFans",
  patreon: "Patreon",
  mym: "MYM",
  fansly: "Fansly",
  snapchat: "Snapchat",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  discord: "Discord",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  twitch: "Twitch",
  threads: "Threads",
  bluesky: "Bluesky",
};

export const SOCIAL_BRAND_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  tiktok: "#000000",
  twitter: "#1DA1F2",
  youtube: "#FF0000",
  onlyfans: "#00AFF0",
  patreon: "#FF424D",
  mym: "#E91E63",
  fansly: "#8B5CF6",
  snapchat: "#FFFC00",
  telegram: "#26A5E4",
  whatsapp: "#25D366",
  discord: "#5865F2",
  linkedin: "#0077B5",
  facebook: "#1877F2",
  twitch: "#9146FF",
  threads: "#101010",
  bluesky: "#0085FF",
};

/* ─── Templates presets ─── */

export const PAGE_TEMPLATES = [
  {
    name: "Link in Bio",
    description: "Page hub avec tous tes liens importants",
    page_type: "link_in_bio" as PageType,
    thumbnail: "🔗",
    config: {
      background_type: "color" as BackgroundType,
      background_value: "#1A1614",
      accent_color: "#C75B39",
      text_color: "#F5F0EB",
      display_name: "",
      bio: "Creator • Content",
      seo_title: "Link in Bio",
    },
  },
  {
    name: "Newsletter Opt-in",
    description: "Capture email avec double opt-in RGPD",
    page_type: "capture_page" as PageType,
    thumbnail: "📧",
    config: {
      background_type: "color" as BackgroundType,
      background_value: "#1A1614",
      accent_color: "#C75B39",
      text_color: "#F5F0EB",
      headline: "Recevez ma newsletter exclusive",
      subtitle: "Contenu premium, BTS, et exclusivités avant tout le monde",
      cta_text: "Je m'abonne",
      confirmation_message: "Vérifiez votre boîte mail pour confirmer votre inscription",
      collect_first_name: true,
      consent_text: "J'accepte de recevoir des communications",
      seo_title: "Newsletter exclusive",
    },
  },
  {
    name: "Page de lancement",
    description: "Comptez les pré-inscriptions avant un lancement",
    page_type: "capture_page" as PageType,
    thumbnail: "🚀",
    config: {
      background_type: "color" as BackgroundType,
      background_value: "#1A1614",
      accent_color: "#C75B39",
      text_color: "#F5F0EB",
      headline: "Quelque chose de grand arrive...",
      subtitle: "Soyez le premier à être notifié",
      cta_text: "Me prévenir",
      confirmation_message: "Merci ! Vous serez notifié au lancement",
      collect_first_name: true,
      consent_text: "J'accepte d'être contacté pour ce lancement",
      seo_title: "Coming soon",
    },
  },
  {
    name: "Pop-up Email",
    description: "Formulaire modal intégrable sur n'importe quelle page",
    page_type: "popup_form" as PageType,
    thumbnail: "💬",
    config: {
      background_type: "color" as BackgroundType,
      background_value: "#1A1614",
      accent_color: "#C75B39",
      text_color: "#F5F0EB",
      headline: "Ne rate rien de mon contenu",
      subtitle: "Reçois mes dernières actus chaque semaine",
      cta_text: "Je m'inscris",
      confirmation_message: "Check ta boîte mail !",
      collect_first_name: false,
      consent_text: "J'accepte de recevoir des communications",
      seo_title: "Inscription newsletter",
    },
  },
];

/* ─── Link presets ─── */

export const LINK_PRESETS = [
  { link_type: "social" as LinkType, label: "Instagram", icon: "instagram", url: "https://instagram.com/" },
  { link_type: "social" as LinkType, label: "TikTok", icon: "tiktok", url: "https://tiktok.com/@" },
  { link_type: "social" as LinkType, label: "YouTube", icon: "youtube", url: "https://youtube.com/@" },
  { link_type: "social" as LinkType, label: "Twitter", icon: "twitter", url: "https://twitter.com/" },
  { link_type: "social" as LinkType, label: "OnlyFans", icon: "onlyfans", url: "https://onlyfans.com/" },
  { link_type: "content" as LinkType, label: "Dernière vidéo", icon: "video", url: "" },
  { link_type: "content" as LinkType, label: "Mon store", icon: "store", url: "" },
  { link_type: "custom" as LinkType, label: "Lien personnalisé", icon: "link", url: "" },
];

/* ─── QR Code config ─── */

export function generateQRUrl(url: string, options?: { size?: number; fgColor?: string; centerImage?: string }): string {
  const size = options?.size || 300;
  const fg = (options?.fgColor || "#C75B39").replace("#", "");
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=${fg}&margin=12`;
}
