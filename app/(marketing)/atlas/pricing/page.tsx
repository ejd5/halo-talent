import type { Metadata } from "next";
import { AtlasPricingClient } from "./AtlasPricingClient";

export const metadata: Metadata = {
  title: "Atlas CRM, Tarifs, Where Talent Forms",
  description:
    "Automatisation marketing, segmentation fans et campagnes multi-canal. Plans Free, Pro et Enterprise. Pas d'engagement, pas de frais cachés.",
  openGraph: {
    title: "Atlas CRM, Tarifs transparents, Where Talent Forms",
    description:
      "Plans Free, Pro et Enterprise pour l'automatisation marketing créateur. Segmentation fans, campagnes multi-canal, analytics.",
  },
};

export default function AtlasPricingPage() {
  return <AtlasPricingClient />;
}
