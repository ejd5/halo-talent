import type { Metadata } from "next";
import { CGUClient } from "./CGUClient";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation, Where Talent Forms",
  description:
    "Conditions générales d'utilisation des services Where Talent Forms : Studio IA, Atlas CRM, WTF Lex, Bouclier Légal. Usage acceptable, responsabilités, modules IA, propriété intellectuelle.",
  openGraph: {
    title: "CGU, Where Talent Forms",
    description:
      "Les conditions qui régissent l'utilisation de halotalent.com et de ses services. Usage acceptable, modules IA, absence de garantie de revenus, protection des données.",
  },
};

export default function CGUPage() {
  return <CGUClient />;
}
