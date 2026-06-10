/* ─── Blog — Types ─── */

export type Category = "guides" | "juridique" | "outils" | "actualites";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "guides", label: "Guides" },
  { id: "juridique", label: "Juridique" },
  { id: "outils", label: "Outils" },
  { id: "actualites", label: "Actualités" },
];

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: Category;
  date: string; // ISO
  readingTime: number; // minutes
  author: string;
  content: ArticleSection[];
  cta?: ArticleCTA;
}

export interface ArticleSection {
  type: "heading" | "subheading" | "paragraph" | "list" | "quote" | "tip";
  content: string;
  items?: string[];
}

export interface ArticleCTA {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  letter: string;
}

export interface ToolEntry {
  slug: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  free: boolean;
}
