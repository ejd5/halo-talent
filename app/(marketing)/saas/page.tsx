import type { Metadata } from "next";
import { SaasClient } from "./SaasClient";

export const metadata: Metadata = {
  title: "Suite technologique, Where Talent Forms",
  description:
    "Un système d'exploitation pour créateurs. Atlas CRM, Studio IA, Chat AI, WTF Lex, des outils pensés pour produire, gérer, protéger et développer votre activité.",
  openGraph: {
    title: "Suite technologique, Where Talent Forms",
    description:
      "CRM, IA, protection juridique, reporting. Tout ce dont un créateur a besoin, dans une suite intégrée.",
  },
};

export default function SaasPage() {
  return <SaasClient />;
}
