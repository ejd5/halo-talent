import type { Metadata } from "next";
import { TalentsClient } from "./TalentsClient";

export const metadata: Metadata = {
  title: "Talents, Where Talent Forms",
  description:
    "Pour les créateurs qui veulent construire plus qu'une audience. Découvrez les profils que nous accompagnons, nos critères de sélection, et le parcours de candidature Where Talent Forms.",
  openGraph: {
    title: "Talents, Pour les créateurs qui veulent construire plus qu'une audience | Where Talent Forms",
    description:
      "Image, discipline, potentiel, cohérence, ambition, volonté long terme. Découvrez si votre profil correspond à l'accompagnement Where Talent Forms. Candidature gratuite et confidentielle.",
  },
};

export default function TalentsPage() {
  return <TalentsClient />;
}
