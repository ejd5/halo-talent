import type { Metadata } from "next";
import { OutilsClient } from "./OutilsClient";

export const metadata: Metadata = {
  title: "Outils gratuits, Where Talent Forms",
  description:
    "Bouclier Légal, simulateur de commission, média kit generator, contrat-type. Tous les outils gratuits WTF pour gérer, protéger et développer votre activité.",
  openGraph: {
    title: "Outils gratuits pour créateurs, Where Talent Forms",
    description:
      "Simulateur de commission, Bouclier Légal, Média Kit, Studio IA gratuit. Des outils pensés pour les créateurs, sans engagement.",
  },
};

export default function OutilsPage() {
  return <OutilsClient />;
}
