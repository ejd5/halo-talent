import type { Metadata } from "next";
import { ConfidentialiteClient } from "./ConfidentialiteClient";

export const metadata: Metadata = {
  title: "Politique de confidentialité, Where Talent Forms",
  description:
    "Comment Where Talent Forms collecte, utilise et protège vos données personnelles. Conforme RGPD. Données de contact, compte, Chat AI, CRM, WTF Lex. Vos droits, sécurité, cookies.",
  openGraph: {
    title: "Politique de confidentialité, Where Talent Forms",
    description:
      "Transparence sur la collecte et l'utilisation de vos données. Sous-traitants, durées de conservation, exercice de vos droits RGPD.",
  },
};

export default function ConfidentialitePage() {
  return <ConfidentialiteClient />;
}
