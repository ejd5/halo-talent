export type BlockType =
  | "hero"
  | "editorial"
  | "grid"
  | "citation"
  | "gallery"
  | "cta"
  | "table"
  | "custom_html";

export type SiteBlock = {
  id: string;
  type: BlockType;
  content: Record<string, unknown>;
  order: number;
};

export type PageStatus = "published" | "draft" | "review";

export type PageVersion = {
  id: string;
  saved_at: string;
  saved_by: string;
  blocks: SiteBlock[];
  note: string;
};

export type SitePage = {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  title_es: string;
  status: PageStatus;
  updated_at: string;
  updated_by: string;
  blocks: SiteBlock[];
  versions: PageVersion[];
};

export type BlogStatus = "draft" | "published" | "scheduled";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  cover_url: string | null;
  tags: string[];
  category: string;
  content: string;
  status: BlogStatus;
  scheduled_at: string | null;
  published_at: string | null;
  views: number;
  seo_title: string;
  seo_description: string;
  seo_image: string | null;
  created_at: string;
  updated_at: string;
};

export type RosterItem = {
  creator_id: string;
  creator_name: string;
  visible: boolean;
  order: number;
  image_url: string | null;
  bio_fr: string;
  bio_en: string;
  bio_es: string;
  public_links: { platform: string; url: string }[];
};

export type Manifesto = {
  content_fr: string;
  content_en: string;
  content_es: string;
  commitments: { text_fr: string; text_en: string; text_es: string }[];
  founder_name: string;
  founder_signature: string;
  updated_at: string;
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  editorial: "Section éditoriale",
  grid: "Grille de cards",
  citation: "Citation",
  gallery: "Galerie d'images",
  cta: "CTA Banner",
  table: "Tableau",
  custom_html: "HTML personnalisé",
};

export const LANGUAGES = [
  { key: "fr", label: "Français" },
  { key: "en", label: "English" },
  { key: "es", label: "Español" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["key"];
