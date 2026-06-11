"use client";

import { AlertTriangle, Scale, FileText, Info } from "lucide-react";

type Variant = "short" | "agency" | "letter" | "full";

const DISCLAIMER_CONTENT: Record<
  Variant,
  { icon: typeof AlertTriangle; title?: string; body: string; nonDismissible?: boolean }
> = {
  short: {
    icon: AlertTriangle,
    title: undefined,
    body: "Cet outil fournit une information générale et ne remplace pas l'avis d'un avocat. Les résultats sont basés sur une analyse automatisée de clauses courantes et ne constituent pas un conseil juridique.",
    nonDismissible: true,
  },
  agency: {
    icon: Scale,
    title: "Avertissement juridique",
    body: "Les informations présentées sur cette page sont fournies à titre indicatif seulement. Elles ne constituent pas un avis juridique et ne peuvent pas être utilisées comme tel. Chaque contrat d'agence est unique. Nous vous recommandons de consulter un avocat spécialisé en droit des créateurs numériques avant de signer tout document. Halo Talent ne peut être tenu responsable des décisions prises sur la base de ces informations.",
  },
  letter: {
    icon: FileText,
    title: "À propos des lettres générées",
    body: "Ces templates de lettres sont fournis à titre d'exemple. Ils ne constituent pas des actes juridiques. Faites-les relire par un avocat avant envoi. Les informations légales (références de lois, articles) peuvent ne pas être à jour ou applicables à votre situation spécifique.",
    nonDismissible: true,
  },
  full: {
    icon: Info,
    title: "Mentions légales — Bouclier Légal",
    body: "L'outil Bouclier Légal est un service d'information automatisé proposé par Halo Talent. Il ne constitue pas une activité de conseil juridique au sens de la loi n°71-1130 du 31 décembre 1971. Les analyses sont générées par intelligence artificielle sur la base de données juridiques publiques et de CGU de plateformes. Ces informations peuvent être incomplètes ou ne pas refléter l'état le plus récent du droit. En utilisant cet outil, vous reconnaissez que Halo Talent n'est pas un cabinet d'avocats et que l'utilisation du service se fait sous votre seule responsabilité.",
  },
};

export function LegalDisclaimer({
  variant = "short",
}: {
  variant?: Variant;
}) {
  const content = DISCLAIMER_CONTENT[variant];
  const Icon = content.icon;

  return (
    <div
      className="flex items-start gap-3 px-5 py-4 text-sm leading-relaxed"
      style={{
        backgroundColor: "var(--color-accent-soft)",
        color: "var(--text-tertiary)",
        border: "1px solid transparent",
      }}
    >
      <Icon size={14} className="shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }} />
      <div className="space-y-1">
        {content.title && (
          <p className="font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
            {content.title}
          </p>
        )}
        <p>{content.body}</p>
      </div>
    </div>
  );
}
