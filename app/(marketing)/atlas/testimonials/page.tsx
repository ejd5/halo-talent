import type { Metadata } from "next";
import { TestimonialsClient } from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Scénarios d'usage, Atlas CRM | Where Talent Forms",
  description:
    "Comment les créateurs utilisent Atlas CRM pour structurer leur activité. Des scénarios illustratifs, pas des témoignages. 5 profils, 5 usages concrets.",
  openGraph: {
    title: "Scénarios d'usage Atlas CRM | Where Talent Forms",
    description:
      "Découvrez comment Atlas CRM s'utilise concrètement : créatrice glamour, influenceuse lifestyle, podcaster, musicien, sportive fitness. Scénarios illustratifs, pas de faux témoignages.",
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
