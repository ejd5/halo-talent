"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type CellIcon = "green-check" | "red-x" | "red-dot" | "yellow-dot" | "green-dot" | "none";

interface CellData {
  text: string;
  icon: CellIcon;
  tooltip?: string;
}

interface RowData {
  label: string;
  agency: CellData;
  stack: CellData;
  halo: CellData;
}

const ROWS: RowData[] = [
  {
    label: "Commission sur revenus",
    agency: {
      text: "30-70% (souvent opaque)",
      icon: "red-dot",
    },
    stack: {
      text: "0% (flat fee)",
      icon: "green-dot",
    },
    halo: {
      text: "30% → 10% dégressif (public)",
      icon: "green-dot",
      tooltip: "Système marginal : vous payez moins à mesure que vous grandissez",
    },
  },
  {
    label: "Coût mensuel outils",
    agency: {
      text: "0€ (inclus dans la commission), mais vous payez 50%",
      icon: "yellow-dot",
    },
    stack: {
      text: "500-1 200€/mois",
      icon: "red-dot",
    },
    halo: {
      text: "0-199€/mois (selon plan)",
      icon: "green-dot",
    },
  },
  {
    label: "Création de contenu IA",
    agency: {
      text: "À votre charge",
      icon: "red-x",
    },
    stack: {
      text: "Canva + CapCut + ChatGPT séparément",
      icon: "red-x",
    },
    halo: {
      text: "Texte, image, vidéo, audio, avatars — intégré",
      icon: "green-check",
    },
  },
  {
    label: "CRM Fans & Chatting",
    agency: {
      text: "Chatters humains (que vous ne contrôlez pas)",
      icon: "green-check",
    },
    stack: {
      text: "Infloww ou Supercreator",
      icon: "green-check",
    },
    halo: {
      text: "Atlas CRM + Chat Copilot IA (vous gardez le contrôle)",
      icon: "green-check",
    },
  },
  {
    label: "Analytics avancés",
    agency: {
      text: "Rapport mensuel PDF (si vous avez de la chance)",
      icon: "yellow-dot",
    },
    stack: {
      text: "Séparé par plateforme",
      icon: "green-check",
    },
    halo: {
      text: "Toutes plateformes unifiées + Trend Hub + prédictions IA",
      icon: "green-check",
    },
  },
  {
    label: "Protection juridique",
    agency: {
      text: "L'agence rédige le contrat… qui la protège elle",
      icon: "red-x",
    },
    stack: {
      text: "Aucun outil",
      icon: "red-x",
    },
    halo: {
      text: "Bouclier Légal gratuit + analyse de contrats + base juridique",
      icon: "green-check",
    },
  },
  {
    label: "Clause de sortie",
    agency: {
      text: "3-12 mois d'engagement + pénalités",
      icon: "red-dot",
    },
    stack: {
      text: "Mensuel sans engagement",
      icon: "green-dot",
    },
    halo: {
      text: "30 jours, sans pénalité, sans justification",
      icon: "green-dot",
    },
  },
  {
    label: "Données & propriété",
    agency: {
      text: "L'agence contrôle souvent le compte",
      icon: "red-dot",
    },
    stack: {
      text: "Vos données",
      icon: "green-dot",
    },
    halo: {
      text: "Export complet (CSV, JSON, PDF) à tout moment",
      icon: "green-dot",
    },
  },
  {
    label: "Nombre d'outils à gérer",
    agency: {
      text: "3-5 (l'agence gère le reste)",
      icon: "none",
    },
    stack: {
      text: "5-7 outils différents",
      icon: "red-dot",
    },
    halo: {
      text: "1 seul",
      icon: "green-dot",
    },
  },
];

function CellIcon({ type }: { type: CellIcon }) {
  if (type === "green-check") {
    return (
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 mt-0.5 text-[10px] font-bold"
        style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}
      >
        ✓
      </span>
    );
  }
  if (type === "red-x") {
    return (
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 mt-0.5 text-[10px] font-bold"
        style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}
      >
        ✗
      </span>
    );
  }
  if (type === "red-dot") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ backgroundColor: "var(--danger)" }}
      />
    );
  }
  if (type === "yellow-dot") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ backgroundColor: "var(--warning)" }}
      />
    );
  }
  if (type === "green-dot") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ backgroundColor: "var(--success)" }}
      />
    );
  }
  return null;
}

function CellWithTooltip({ data, isHalo }: { data: CellData; isHalo?: boolean }) {
  return (
    <div className="group/cell relative">
      <div className={`flex items-start gap-2 text-sm leading-relaxed ${isHalo ? "font-medium" : ""}`}>
        <CellIcon type={data.icon} />
        <span style={{ color: isHalo ? "var(--accent)" : "var(--text-secondary)" }}>{data.text}</span>
      </div>
      {data.tooltip && (
        <div
          className="opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 delay-200 absolute bottom-full left-0 mb-2 z-20 pointer-events-none"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div
            className="text-[0.65rem] leading-relaxed px-3 py-2 rounded-sm whitespace-normal max-w-[240px]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {data.tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

export function ComparisonSection() {
  const locale = useLocale();
  const l = norm(locale);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Title + subtitle */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2
            className="font-display font-bold text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-[1.15] tracking-[-0.02em]"
            style={{ color: "var(--text-primary)" }}
          >
            {t("home.comparison.title", l)}
          </h2>
          <p
            className="text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("home.comparison.subtitle", l)}
          </p>
        </div>

        {/* ─── DESKTOP ─── */}
        <div className="hidden md:block max-w-6xl mx-auto overflow-x-auto">
          <div
            className="min-w-[680px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-surface)" }}>
              <div className="grid grid-cols-[160px_1fr_1fr_1fr] gap-0">
                <div
                  className="px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-default)" }}
                >
                  {t("home.comparison.col_critere", l)}
                </div>
                <div
                  className="px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-default)" }}
                >
                  {t("home.comparison.col_agency", l)}
                </div>
                <div
                  className="px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-default)" }}
                >
                  Stack OFM classique (5-7 outils)
                </div>
                <div
                  className="px-4 py-3"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                      style={{ color: "var(--accent)" }}
                    >
                      {t("home.comparison.col_halo", l)}
                    </span>
                    <span
                      className="text-[0.55rem] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-sm"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
                    >
                      {t("home.comparison.recommended", l)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className="group/row grid grid-cols-[160px_1fr_1fr_1fr] gap-0 transition-colors duration-150 hover:[&>div]:bg-[var(--bg-hover)]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${200 + i * 50}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 50}ms`,
                }}
              >
                {/* Label */}
                <div
                  className="px-4 py-3 text-sm font-semibold leading-relaxed flex items-center"
                  style={{
                    color: "var(--text-primary)",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  {row.label}
                </div>

                {/* Agency */}
                <div
                  className="px-4 py-3 transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--border-default)" }}
                >
                  <CellWithTooltip data={row.agency} />
                </div>

                {/* Stack OFM */}
                <div
                  className="px-4 py-3 transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--border-default)" }}
                >
                  <CellWithTooltip data={row.stack} />
                </div>

                {/* Halo (accent bg) */}
                <div
                  className="px-4 py-3 transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid var(--border-default)",
                    backgroundColor: "var(--accent-soft)",
                  }}
                >
                  <CellWithTooltip data={row.halo} isHalo />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── MOBILE ─── */}
        <div className="md:hidden space-y-4 max-w-lg mx-auto">
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className="transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${200 + i * 50}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                className="p-4"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <p
                  className="text-sm font-semibold mb-3 pb-2"
                  style={{
                    color: "var(--text-primary)",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  {row.label}
                </p>

                {/* Agency */}
                <div className="flex items-start gap-2 mb-2">
                  <CellIcon type={row.agency.icon} />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {row.agency.text}
                  </span>
                </div>

                {/* Stack */}
                <div className="flex items-start gap-2 mb-2">
                  <CellIcon type={row.stack.icon} />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {row.stack.text}
                  </span>
                </div>

                {/* Halo */}
                <div className="flex items-start gap-2">
                  <CellIcon type={row.halo.icon} />
                  <span className="text-xs leading-relaxed font-medium" style={{ color: "var(--accent)" }}>
                    {row.halo.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 md:mt-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "1000ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
          >
            {t("home.comparison.cta", l)}
          </Link>
        </div>
      </div>
    </section>
  );
}
