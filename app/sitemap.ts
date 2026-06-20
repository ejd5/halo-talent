import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wheretalentforms.com";
  const now = new Date();

  const marketingRoutes = [
    "",
    "/pricing",
    "/contact",
    "/faq",
    "/qui-sommes-nous",
    "/apply",
    "/creator-os",
    "/atlas",
    "/chat-ai",
    "/lex",
    "/lex-ai",
    "/assisted-chat",
    "/wtf-companion",
    "/revenue-desk",
    "/departements",
    "/commissions",
    "/mentions-legales",
    "/cgu",
    "/confidentialite",
  ];

  return marketingRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/mentions") || route.startsWith("/cgu") || route.startsWith("/confidentialite") ? 0.3 : 0.8,
  }));
}
