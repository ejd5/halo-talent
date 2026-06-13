import type { Metadata } from "next";
import { BlogClient } from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog, Where Talent Forms",
  description:
    "Le journal WTF : articles, guides et analyses pour les créateurs qui veulent comprendre et maîtriser leur activité. Image, protection, juridique, IA, CRM, commissions, plateformes.",
  openGraph: {
    title: "Le journal WTF, Articles et analyses pour créateurs | Where Talent Forms",
    description:
      "Articles, guides et analyses pour les créateurs. Sans promesses, sans raccourcis. Image & stratégie, protection, juridique préparatoire, IA & CRM, commissions, plateformes.",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
