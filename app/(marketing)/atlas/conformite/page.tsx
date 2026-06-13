import type { Metadata } from "next";
import { AtlasConformiteClient } from "./AtlasConformiteClient";

export const metadata: Metadata = {
  title: "Conformité Atlas, Where Talent Forms",
  description:
    "Notre approche de la conformité chez WTF : RGPD, consentement, audit logs, sécurité. Sans promesse absolue, avec transparence totale sur nos limites. Atlas ne remplace pas un avocat.",
  openGraph: {
    title: "Conformité et sécurité Atlas | Where Talent Forms",
    description:
      "Comment Atlas vous aide à respecter les réglementations en vigueur. Garde-fous techniques, documentation, transparence. Sans garantie absolue, avec honnêteté.",
  },
};

export default function AtlasConformitePage() {
  return <AtlasConformiteClient />;
}
