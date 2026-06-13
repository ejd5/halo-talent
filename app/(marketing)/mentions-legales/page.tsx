import type { Metadata } from "next";
import { MentionsLegalesClient } from "./MentionsLegalesClient";

export const metadata: Metadata = {
  title: "Mentions légales, Where Talent Forms",
  description:
    "Mentions légales du site halotalent.com : éditeur, directeur de publication, hébergement (Vercel), propriété intellectuelle, limitation de responsabilité.",
  openGraph: {
    title: "Mentions légales, Where Talent Forms",
    description:
      "Informations légales sur l'éditeur du site halotalent.com, l'hébergement, la propriété intellectuelle et les limitations de responsabilité.",
  },
};

export default function MentionsLegalesPage() {
  return <MentionsLegalesClient />;
}
