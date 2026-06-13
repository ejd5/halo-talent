import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact, Where Talent Forms",
  description:
    "Parlez-nous de votre projet. Une question sur Where Talent Forms, nos outils, ou votre activité de créateur ? Écrivez-nous. Réponse sous 24 à 48h ouvrées.",
  openGraph: {
    title: "Contact, Parlez-nous de votre projet | Where Talent Forms",
    description:
      "Une question, une proposition, une demande. Écrivez-nous. Nous répondons à chaque message sous 24 à 48h ouvrées. Confidentialité garantie.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
