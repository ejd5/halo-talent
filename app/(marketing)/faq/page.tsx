import type { Metadata } from "next";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ, Where Talent Forms",
  description:
    "Questions fréquentes sur Where Talent Forms : général, commissions, Atlas CRM, CHATEENG, WTF Lex, protection, départements, candidature, juridique, sécurité. 10 catégories, 80+ réponses.",
  openGraph: {
    title: "FAQ, Where Talent Forms",
    description:
      "Tout savoir sur Where Talent Forms en 10 catégories et plus de 80 questions-réponses. Commissions, outils, sécurité, candidature : vos questions, nos réponses.",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
