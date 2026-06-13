import type { Metadata } from "next";
import { ProtectionClient } from "./ProtectionClient";

export const metadata: Metadata = {
  title: "Protection créateur, Bouclier Légal | Where Talent Forms",
  description:
    "Protégez votre image, vos accès, vos preuves et vos décisions. Bouclier Légal, guides par plateforme, et méthode WTF pour sécuriser votre activité de créateur.",
  openGraph: {
    title: "Protection créateur, Bouclier Légal | Where Talent Forms",
    description:
      "Cartographie des risques, méthode de protection en 5 étapes, guides par plateforme et outil d'analyse de contrat. Protégez votre activité de créateur avec méthode.",
  },
};

export default function ProtectionPage() {
  return <ProtectionClient />;
}
