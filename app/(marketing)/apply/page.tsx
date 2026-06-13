import type { Metadata } from "next";
import { ApplyClient } from "./ApplyClient";

export const metadata: Metadata = {
  title: "Candidater, Where Talent Forms",
  description:
    "Candidater chez Where Talent Forms. Une candidature, pas un formulaire de vente. Gratuit, confidentiel, réponse sous 7 jours. Découvrez ce que nous analysons et préparez votre candidature.",
  openGraph: {
    title: "Candidater chez Where Talent Forms, Pour les créateurs qui veulent construire plus qu'une audience",
    description:
      "10 minutes. Gratuit. Confidentiel. Réponse sous 7 jours. Identité, plateformes, audience, objectifs : dites-nous qui vous êtes et ce que vous cherchez.",
  },
};

export default function ApplyPage() {
  return <ApplyClient />;
}
