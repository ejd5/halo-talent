import type { Metadata } from "next";
import { LexClient } from "./LexClient";

export const metadata: Metadata = {
  title: "WTF Lex, Assistant juridique pour créateurs | Where Talent Forms",
  description:
    "WTF Lex : une IA juridique préparatoire pour comprendre vos contrats, détecter les clauses à risque et préparer vos dossiers. Sans remplacer un avocat.",
  openGraph: {
    title: "WTF Lex, Comprenez vos contrats avant de signer | Where Talent Forms",
    description:
      "Préparer mieux. Comprendre plus vite. Transmettre plus clairement. WTF Lex analyse vos documents juridiques et vous aide à poser les bonnes questions.",
  },
};

export default function LexPage() {
  return <LexClient />;
}
