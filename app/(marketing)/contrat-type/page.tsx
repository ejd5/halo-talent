import type { Metadata } from "next";
import { ContratTypeClient } from "./ContratTypeClient";

export const metadata: Metadata = {
  title: "Contrat type créateur, Where Talent Forms",
  description:
    "Comprendre avant de signer. Guide pour décrypter les clauses essentielles d'un contrat créateur, savoir quoi surveiller, et quand consulter un avocat. Transparence contractuelle pour créateurs.",
  openGraph: {
    title: "Contrat type créateur, Transparence contractuelle | Where Talent Forms",
    description:
      "Décryptez les clauses essentielles d'un contrat créateur : durée, exclusivité, commission, droits d'image, rupture, confidentialité. Checklist avant signature et engagements WTF.",
  },
};

export default function ContratTypePage() {
  return <ContratTypeClient />;
}
