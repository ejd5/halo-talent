import type { Metadata } from "next";
import { LexAIClient } from "./LexAIClient";

export const metadata: Metadata = {
  title: "Lex AI, Assistant juridique préparatoire | Where Talent Forms",
  description:
    "Lex AI : une IA juridique spécialisée créateurs pour analyser vos documents, expliquer vos contrats et préparer vos dossiers. Sans remplacer un avocat.",
  openGraph: {
    title: "Lex AI, Votre conseiller juridique IA | Where Talent Forms",
    description:
      "Préparer mieux. Comprendre plus vite. Transmettre plus clairement. Lex AI analyse, explique et prépare, sans remplacer un professionnel du droit.",
  },
};

export default function LexAIPage() {
  return <LexAIClient />;
}
