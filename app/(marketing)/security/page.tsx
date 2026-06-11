"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  UserCheck,
  Download,
  Key,
  FileText,
  Eye,
  Trash2,
  Globe,
  Layers,
} from "lucide-react";

/* ─── Section data ─── */
const SECTIONS = [
  {
    id: "propriete",
    icon: UserCheck,
    title: "Propriété des comptes",
    body: "Vous êtes propriétaire de vos comptes. Halo ne prend jamais possession de vos identifiants, de vos contenus, ni de vos relations fans. Les connexions plateformes (OAuth ou manuelles) restent sous votre contrôle. Vous pouvez les révoquer à tout moment.",
  },
  {
    id: "export",
    icon: Download,
    title: "Données exportables",
    body: "Exportez toutes vos données à tout moment. Formats CSV, JSON, PDF. Inclut : historique des conversations, données fans, contenus, analytics, transactions. Aucune donnée n'est retenue après votre départ.",
  },
  {
    id: "permissions",
    icon: Layers,
    title: "Permissions",
    body: "Contrôle d'accès granulaire. Vous définissez qui voit quoi : Admin, Manager, Chatter, Content, Viewer. Chaque action est loggée et attribuée. 2FA obligatoire pour les rôles Admin et Manager.",
  },
  {
    id: "audit",
    icon: FileText,
    title: "Logs d'audit",
    body: "Traçabilité complète. Chaque message envoyé, chaque modification de prix, chaque export est horodaté et attribué. Les logs sont conservés 12 mois et consultables à tout moment.",
  },
  {
    id: "ia",
    icon: Eye,
    title: "Validation humaine IA",
    body: "L'IA propose, vous décidez. Aucun message n'est envoyé automatiquement sans validation humaine. Chaque brouillon IA est présenté avec son score de confiance et le contexte utilisé. Vous pouvez auditer chaque message.",
  },
  {
    id: "byok",
    icon: Key,
    title: "BYOK (Bring Your Own Key)",
    body: "Utilisez vos propres clés API. Avec les plans Elite et Icon, vous pouvez connecter vos propres clés Anthropic, OpenAI, Replicate, ElevenLabs. Vos appels API passent par vos comptes, pas par les nôtres.",
  },
  {
    id: "suppression",
    icon: Trash2,
    title: "Suppression des données",
    body: "Effacement complet sur demande. Vous pouvez demander la suppression de votre ADN créatif, de vos données fans, et de l'ensemble de votre compte. Suppression confirmée par email sous 30 jours maximum.",
  },
  {
    id: "rgpd",
    icon: Globe,
    title: "RGPD & ePrivacy",
    body: "Conçu en Europe, pour l'Europe. Hébergement chez un fournisseur européen. Consentement explicite pour chaque traitement. Droit d'accès, de rectification, d'effacement et de portabilité. DPA (Data Processing Agreement) public.",
  },
];

/* ─── Page ─── */
export default function SecurityPage() {
  return (
    <div style={{ background: "#1A1614" }}>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield size={28} style={{ color: "#C75B39" }} />
          </div>
          <p
            className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "#C75B39" }}
          >
            Centre de Confiance
          </p>
          <h1
            className="font-display text-[2.5rem] md:text-[4rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{ color: "#F5F0EB" }}
          >
            Centre de Confiance
          </h1>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto"
            style={{ color: "rgba(245,240,235,0.55)" }}
          >
            Tout ce que vous devez savoir sur la sécurité, la confidentialité et le
            contrôle de vos données.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="space-y-10">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="grid grid-cols-1 md:grid-cols-[48px_1fr] gap-4 md:gap-6"
                  style={{
                    paddingBottom: i < SECTIONS.length - 1 ? 40 : 0,
                    borderBottom:
                      i < SECTIONS.length - 1
                        ? "1px solid rgba(245,240,235,0.06)"
                        : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="hidden md:flex items-start justify-center pt-1"
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        background: "rgba(199,91,57,0.08)",
                        border: "1px solid rgba(199,91,57,0.15)",
                      }}
                    >
                      <Icon size={18} style={{ color: "#C75B39" }} />
                    </div>
                  </div>

                  {/* Mobile icon + title row */}
                  <div>
                    <div className="flex items-center gap-3 mb-3 md:hidden">
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: "rgba(199,91,57,0.08)",
                          border: "1px solid rgba(199,91,57,0.15)",
                        }}
                      >
                        <Icon size={16} style={{ color: "#C75B39" }} />
                      </div>
                      <h3
                        className="text-lg font-bold"
                        style={{
                          color: "#F5F0EB",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {section.title}
                      </h3>
                    </div>

                    {/* Desktop title */}
                    <h3
                      className="hidden md:block text-lg font-bold mb-2"
                      style={{
                        color: "#F5F0EB",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {section.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(245,240,235,0.55)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {section.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="py-20 md:py-28"
        style={{ background: "rgba(245,240,235,0.01)" }}
      >
        <div className="mx-auto w-full max-w-2xl px-6 md:px-12 text-center">
          <h2
            className="font-display text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "#F5F0EB" }}
          >
            Des questions sur la sécurité ?
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "rgba(245,240,235,0.5)" }}
          >
            Consultez nos offres ou contactez notre équipe pour toute question
            relative à la protection de vos données.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
              style={{
                background: "#C75B39",
                color: "#F5F0EB",
                fontFamily: "var(--font-body)",
              }}
            >
              Voir les offres
              <ArrowRight
                size={14}
                className="inline ml-2"
                style={{ verticalAlign: "middle" }}
              />
            </Link>
            <Link
              href="/apply"
              className="px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
              style={{
                border: "1px solid rgba(245,240,235,0.15)",
                color: "#F5F0EB",
                fontFamily: "var(--font-body)",
              }}
            >
              Contacter l&apos;équipe
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/lex"
              className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "rgba(245,240,235,0.4)" }}
            >
              Voir aussi : Sécurité & Cadre légal — le hub juridique Halo
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </section>

      {/* Last updated note */}
      <div className="pb-16">
        <p
          className="text-center text-xs"
          style={{
            color: "rgba(245,240,235,0.25)",
            fontFamily: "var(--font-body)",
          }}
        >
          Cette page reflète l&apos;état actuel de notre infrastructure de
          sécurité. Nous la mettons à jour régulièrement. Dernière mise à jour
          : Juin 2026.
        </p>
      </div>
    </div>
  );
}
