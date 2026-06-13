import type { Metadata } from "next";
import { SecurityClient } from "./SecurityClient";

export const metadata: Metadata = {
  title: "Sécurité, Where Talent Forms",
  description:
    "La confiance commence par les accès. Sécurité des comptes, gestion des permissions, données et confidentialité, audit logs, exports, bonnes pratiques. Centre de Confiance Where Talent Forms.",
  openGraph: {
    title: "Centre de Confiance, La confiance commence par les accès | Where Talent Forms",
    description:
      "Sécurité, confidentialité, contrôle. Propriété des comptes, 2FA, permissions granulaires, RGPD, BYOK, audit logs. Tout ce que vous devez savoir sur la protection de vos données.",
  },
};

export default function SecurityPage() {
  return <SecurityClient />;
}
