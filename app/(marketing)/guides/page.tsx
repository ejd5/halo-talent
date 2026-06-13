import type { Metadata } from "next";
import { GuidesClient } from "./GuidesClient";

export const metadata: Metadata = {
  title: "Guides, Where Talent Forms",
  description:
    "Guides pratiques et evergreen pour créateurs : image de marque, protection des accès, contrats, gestion de communauté, organisation des contenus, choix d'agence et IA.",
  openGraph: {
    title: "Guides pratiques pour créateurs | Where Talent Forms",
    description:
      "Des guides evergreen, rédigés par des experts, pour maîtriser tous les aspects de votre activité de créateur. Image, protection, contrats, communauté, contenus, agence, IA.",
  },
};

export default function GuidesPage() {
  return <GuidesClient />;
}
