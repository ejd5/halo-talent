import type { Metadata } from "next";
import { ManifesteClient } from "./ManifesteClient";

export const metadata: Metadata = {
  title: "Notre Manifeste, Where Talent Forms",
  description:
    "Le créateur n'est pas un produit. Son image est un actif. Son contrôle doit rester central. Découvrez les convictions fondatrices de Where Talent Forms.",
  openGraph: {
    title: "Notre Manifeste, Where Talent Forms",
    description:
      "Le créateur n'est pas un produit. Son image est un actif. Son contrôle doit rester central. Les convictions fondatrices de Where Talent Forms.",
  },
};

export default function ManifestePage() {
  return <ManifesteClient />;
}
