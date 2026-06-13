import type { Metadata } from "next";
import { ComparaisonsClient } from "./ComparaisonsClient";

export const metadata: Metadata = {
  title: "Comparaisons, Agence traditionnelle vs Where Talent Forms",
  description:
    "Tableaux comparatifs : agence traditionnelle vs Where Talent Forms sur les commissions, la transparence, les outils, le contrôle créateur. Arguments du marché décryptés, besoins et solutions.",
  openGraph: {
    title: "Where Talent Forms vs le marché, Tableaux comparatifs",
    description:
      "Commission, transparence, outils, contrôle : comparez l'approche WTF aux modèles plus classiques. Arguments du marché analysés, solutions concrètes.",
  },
};

export default function ComparaisonsPage() {
  return <ComparaisonsClient />;
}
