import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Tarifs, Where Talent Forms",
  description:
    "Commissions, abonnements, crédits IA. Tout est public, transparent et modulable. Découvrez notre structure de pricing sans frais cachés.",
  openGraph: {
    title: "Tarifs transparents, Where Talent Forms",
    description:
      "Commissions progressives, abonnements modulables, crédits IA. Comparez et choisissez votre niveau de contrôle.",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
