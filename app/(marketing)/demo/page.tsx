import type { Metadata } from "next";
import { DemoClient } from "./DemoClient";

export const metadata: Metadata = {
  title: "Démo, Where Talent Forms",
  description:
    "Voir comment WTF peut structurer votre activité. 30 minutes gratuites et sans engagement pour explorer vos objectifs, découvrir les outils adaptés à votre profil, et repartir avec des recommandations concrètes.",
  openGraph: {
    title: "Démo, Voir comment WTF peut structurer votre activité | Where Talent Forms",
    description:
      "Démonstration personnalisée de 30 minutes. Explorez vos objectifs, découvrez les outils WTF adaptés à votre profil, repartez avec des recommandations concrètes. Gratuit, sans engagement.",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}
