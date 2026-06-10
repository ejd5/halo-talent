// ─── Media Kit — Types ───────────────────────────────────
// Données structurées pour le générateur de Média Kit

export type TemplateId = "minimal" | "bold" | "creative";

export interface MediaKitProfile {
  name: string;
  pseudo: string;
  bio: string;
  avatarUrl: string;
  languages: string[];
  country: string;
  accentColor: string; // from creator DNA
}

export interface PlatformStat {
  platform: string;
  followers: number;
  engagement: number; // %
  avgViews: number;
  growth: number; // monthly %
}

export interface AudienceDemographics {
  ageGroups: { label: string; pct: number }[];
  gender: { label: string; pct: number }[];
  countries: { label: string; pct: number }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  platform: string;
  type: "photo" | "video" | "story" | "reel";
  thumbnailUrl: string;
  views: number;
  likes: number;
  engagement: number;
}

export interface PricingTier {
  id: string;
  label: string;
  price: number;
  description: string;
}

export interface MediaKitData {
  profile: MediaKitProfile;
  stats: PlatformStat[];
  demographics: AudienceDemographics;
  portfolio: PortfolioItem[];
  pricing: PricingTier[];
  contactEmail: string;
  socialLinks: { platform: string; url: string }[];
  bookingLink: string;
}

export interface MediaKitState {
  data: MediaKitData;
  template: TemplateId;
  selectedPortfolio: string[]; // portfolio item IDs to include
  showStats: boolean;
  showPricing: boolean;
  showPortfolio: boolean;
}
