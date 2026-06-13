import type { Metadata } from "next";
import { GlossaireClient } from "./GlossaireClient";

export const metadata: Metadata = {
  title: "Glossaire, Where Talent Forms",
  description:
    "Glossaire du créateur : tous les termes et concepts essentiels du monde OFM expliqués simplement. Management, CRM, contrats, IA, sécurité, monétisation. De A à Z.",
  openGraph: {
    title: "Glossaire du créateur | Where Talent Forms",
    description:
      "Tous les termes et concepts essentiels pour comprendre et maîtriser votre activité de créateur. Définitions, explications, exemples concrets et liens utiles.",
  },
};

export default function GlossairePage() {
  return <GlossaireClient />;
}
