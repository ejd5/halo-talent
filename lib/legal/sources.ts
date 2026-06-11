export interface CguSource {
  slug: string;
  label: string;
  url: string;
  docType: string;
  jurisdiction: string;
  delayMs: number; // delay between fetches (respectful crawling)
}

export const CGU_SOURCES: CguSource[] = [
  {
    slug: "onlyfans",
    label: "OnlyFans",
    url: "https://onlyfans.com/terms",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1000,
  },
  {
    slug: "fansly",
    label: "Fansly",
    url: "https://fansly.com/tos",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1000,
  },
  {
    slug: "mym",
    label: "MYM",
    url: "https://mym.com/terms",
    docType: "terms_of_service",
    jurisdiction: "france",
    delayMs: 1000,
  },
  {
    slug: "instagram",
    label: "Instagram",
    url: "https://help.instagram.com/terms",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1500,
  },
  {
    slug: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/terms",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1500,
  },
  {
    slug: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/terms",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1500,
  },
  {
    slug: "x",
    label: "X (Twitter)",
    url: "https://x.com/terms",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1500,
  },
  {
    slug: "twitch",
    label: "Twitch",
    url: "https://www.twitch.tv/p/legal/terms-of-service/",
    docType: "terms_of_service",
    jurisdiction: "international",
    delayMs: 1000,
  },
];
