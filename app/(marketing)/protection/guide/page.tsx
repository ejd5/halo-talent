import type { Metadata } from "next";
import { BookOpen, ShieldCheck, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide pratique du créateur, Where Talent Forms",
  description:
    "Vos droits fondamentaux, les signaux d'alerte face à une agence, et les étapes pour reprendre le contrôle de votre compte et de vos revenus de créateur.",
  openGraph: {
    title: "Guide pratique du créateur, Where Talent Forms",
    description:
      "Droits fondamentaux, signaux d'alerte, étapes pratiques : tout ce qu'un créateur doit savoir pour protéger son activité.",
  },
};
import Link from "next/link";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { SourceTag } from "@/components/legal/SourceTag";

const WARNINGS = [
  "L'agence insiste pour créer votre email professionnel",
  "L'agence refuse de vous donner accès à vos relevés de revenus",
  "Le contrat contient des mots comme « à vie », « irrévocable », « exclusivité totale »",
  "L'agence menace de poursuites si vous voulez partir",
  "Vous ne pouvez pas contacter directement le support de la plateforme",
];

const STEPS = [
  {
    title: "1. Récupérez le contrôle de votre compte",
    items: [
      "Contactez le support de la plateforme avec votre pièce d'identité pour vérifier votre identité",
      "Demandez la réinitialisation de l'email et du mot de passe si l'agence les détient",
      "Activez l'authentification à deux facteurs (2FA) immédiatement",
      "Ne partagez plus jamais vos identifiants, utilisez des outils de délégation officiels si disponibles",
    ],
  },
  {
    title: "2. Conservez tous les échanges",
    items: [
      "Sauvegardez tous les emails, messages, et contrats signés",
      "Faites des captures d'écran des relevés de revenus de la plateforme",
      "Archivez les preuves de vos paiements à l'agence",
      "Notez les dates et horaires des échanges importants",
    ],
  },
  {
    title: "3. Résiliez votre contrat d'agence",
    items: [
      "Vérifiez la clause de résiliation dans votre contrat (préavis, pénalités)",
      "Envoyez une lettre de résiliation recommandée avec accusé de réception",
      "Conservez une copie de tous les documents envoyés",
      "Si l'agence conteste, ne cédez pas à la pression, les clauses abusives sont nulles",
    ],
  },
  {
    title: "4. Mettez-vous en conformité",
    items: [
      "Assurez-vous que votre nouveau contrat respecte vos droits fondamentaux",
      "Vérifiez que l'agence est conforme RGPD (contrat de sous-traitance)",
      "Utilisez des outils déclarés pour la gestion de compte (pas d'automation interdite)",
      "Consultez notre contrat-type pour comparer",
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <BookOpen size={26} style={{ color: "var(--color-accent)" }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Guide pratique du créateur
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Vos droits, les signaux d'alerte, et les étapes pour reprendre le contrôle
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-8">
        <LegalDisclaimer variant="short" />
      </div>

      {/* Droits fondamentaux */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          Vos droits fondamentaux
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Vous êtes propriétaire de votre contenu",
              desc: "Dès que vous créez quelque chose (photo, vidéo, texte), vous en êtes automatiquement le propriétaire. Aucun dépôt requis. Votre agence ne peut pas utiliser votre contenu sans votre autorisation.",
            },
            {
              title: "Votre compte vous appartient",
              desc: "Les CGU de toutes les plateformes exigent que le compte soit celui d'une personne réelle. Votre agence ne peut PAS être propriétaire de votre compte.",
            },
            {
              title: "Vous pouvez vérifier vos revenus",
              desc: "Vous avez le droit de savoir exactement combien la plateforme vous verse. Votre agence doit vous montrer les relevés.",
            },
            {
              title: "Vous pouvez partir",
              desc: "Sauf clause de préavis raisonnable (30-60 jours), vous pouvez résilier votre contrat d'agence. Les pénalités excessives peuvent être contestées devant le juge.",
            },
            {
              title: "Vos données sont protégées (RGPD)",
              desc: "Si vous êtes en Europe, le RGPD vous donne le contrôle de vos données personnelles et de celles de vos fans.",
            },
          ].map((right, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} style={{ color: "var(--color-accent)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {right.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {right.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <SourceTag
            sources={[
              { label: "Code Propriété Intellectuelle Art. L111-1", date: "2025" },
              { label: "RGPD Art. 5-7", date: "2018" },
            ]}
          />
        </div>
      </section>

      {/* Signaux d'alerte */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          Signaux d'alerte
        </h2>
        <div
          className="p-5"
          style={{
            border: "1px solid rgba(196,69,54,0.2)",
            backgroundColor: "rgba(196,69,54,0.04)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: "var(--color-alert)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--color-alert)" }}>
              Ces signaux doivent vous alerter immédiatement
            </span>
          </div>
          <ul className="space-y-2">
            {WARNINGS.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5" style={{ backgroundColor: "var(--color-alert)" }} />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Étapes pratiques */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          Que faire en cas de problème
        </h2>
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
                {step.title}
              </h3>
              <ul className="space-y-1.5">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="p-6 text-center space-y-4 mb-8"
        style={{
          backgroundColor: "rgba(199,91,57,0.04)",
          border: "1px solid rgba(199,91,57,0.2)",
        }}
      >
        <ShieldCheck size={24} style={{ color: "var(--color-accent)" }} className="mx-auto" />
        <div>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Analysez votre contrat d'agence
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Vérifiez si votre contrat contient des clauses abusives en 2 minutes
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/protection"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            Analyser mon contrat
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contrat-type"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            Voir le contrat-type WTF
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      <LegalDisclaimer variant="full" />
    </div>
  );
}
