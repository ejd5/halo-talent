import type { Metadata } from "next";
import { DepartementsClient } from "./DepartementsClient";

export const metadata: Metadata = {
  title: "Départements, Where Talent Forms",
  description:
    "Cinq départements, une même exigence : construire une image qui dure. Glamour Premium, Influenceurs, YouTube/Podcast, Musique, Sport/Fitness. Découvrez l'expertise WTF.",
  openGraph: {
    title: "Cinq départements. Une même exigence. | Where Talent Forms",
    description:
      "Glamour Premium, Influenceurs, YouTube/Podcast, Musique, Sport/Fitness. Découvrez le département qui correspond à votre ambition et construisez une image qui dure.",
  },
};

export default function DepartementsPage() {
  return <DepartementsClient />;
}
