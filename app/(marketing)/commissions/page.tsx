import type { Metadata } from "next";
import { CommissionsClient } from "./CommissionsClient";

export const metadata: Metadata = {
  title: "Commissions, Where Talent Forms",
  description:
    "Un barème progressif et transparent : plus vous gagnez, moins nous prenons. Découvrez notre modèle de commissions marginales, sans frais cachés.",
  openGraph: {
    title: "Commissions transparentes, Where Talent Forms",
    description:
      "Barème progressif et marginal. Pas de frais cachés. Nous sommes payés uniquement quand vous l'êtes.",
  },
};

export default function CommissionsPage() {
  return <CommissionsClient />;
}
