import type { Metadata } from "next";
import { AtlasFonctionnalitesClient } from "./AtlasFonctionnalitesClient";

export const metadata: Metadata = {
  title: "Fonctionnalités Atlas, Where Talent Forms",
  description:
    "Documentation détaillée des fonctionnalités Atlas CRM : profils, segmentation, conversations, relances, Content Vault, revenus, documents, intégrations et sécurité. Chaque fonction avec exemple, bénéfice et limites.",
  openGraph: {
    title: "Fonctionnalités Atlas CRM, Documentation | Where Talent Forms",
    description:
      "Explorez chaque fonctionnalité d'Atlas en détail : exemple concret, bénéfice, et garde-fou honnête. La transparence commence par la documentation.",
  },
};

export default function AtlasFonctionnalitesPage() {
  return <AtlasFonctionnalitesClient />;
}
