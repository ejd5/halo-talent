import type { Metadata } from "next";
import { AtlasClient } from "./AtlasClient";

export const metadata: Metadata = {
  title: "Atlas CRM, Where Talent Forms",
  description:
    "Atlas CRM : le centre de gravité de votre activité créateur. Centralisez contacts, conversations, revenus, contenus et documents. Segmentation intelligente, relances automatiques, conforme RGPD.",
  openGraph: {
    title: "Atlas CRM, Le CRM pensé pour les créateurs | Where Talent Forms",
    description:
      "Centralisez vos contacts, conversations, revenus et documents. Comprenez votre audience, priorisez vos actions, protégez votre activité. Le CRM créateur par Where Talent Forms.",
  },
};

export default function AtlasPage() {
  return <AtlasClient />;
}
