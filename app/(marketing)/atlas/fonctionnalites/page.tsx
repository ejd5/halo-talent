"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Users,
  Send,
  GitBranch,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

/* ─── Sections data ─── */
const sections = [
  {
    id: "crm",
    icon: Users,
    title: "CRM & Fans",
    desc: "Un CRM pensé pour les créateurs. Pas de surplus corporate, juste ce qu'il faut pour connaître, segmenter et engager votre audience.",
    features: [
      "Scoring automatique basé sur l'engagement réel (likes, partages, comments, temps passé)",
      "Segmentation dynamique : fans chauds, dormants, VIP, whale detection",
      "Historique complet des interactions : messages, emails, dons, achats",
      "Tags et champs personnalisés (fair use)",
      "Export et sync avec vos outils existants",
    ],
  },
  {
    id: "messagerie",
    icon: MessageSquare,
    title: "Messagerie unifiée",
    desc: "Toutes vos conversations au même endroit. Plus besoin de basculer entre Instagram, TikTok, email et SMS.",
    features: [
      "Inbox unique centralisant Instagram DM, TikTok, email, SMS",
      "Réponses assistées par IA : suggestions contextuelles et réponses automatiques",
      "Brouillards et drafts intelligents générés en un clic",
      "Bibliothèque de templates personnalisables et réutilisables",
      "Mode silencieux et planification des messages",
    ],
  },
  {
    id: "campagnes",
    icon: Send,
    title: "Campagnes multi-canaux",
    desc: "Créez, lancez et mesurez des campagnes coordonnées sur tous vos canaux en quelques minutes.",
    features: [
      "Email : templates responsive, tracking ouvertures/clics, A/B testing",
      "SMS : envoi groupé, personnalisation dynamique, suivi des conversions",
      "Push notifications : campagnes programmées et déclenchées par événement",
      "DM automatisés : séquences Instagram et TikTok avec limites de sécurité intégrées",
      "Coordination cross-canal avec règles d'enchaînement intelligentes",
    ],
  },
  {
    id: "funnels",
    icon: GitBranch,
    title: "Funnels & Automatisation",
    desc: "Des séquences prêtes à l'emploi et un moteur de règles puissant pour automatiser sans coder.",
    features: [
      "Funnel Welcome : onboarding automatique des nouveaux abonnés",
      "Lead Capture : formulaire intégré + séquence de nurturing",
      "Funnel de vente : annonces, rappels, relances avec délais optimisés",
      "Moteur de règles 'Si-Alors' : conditions, délais, actions multi-canaux",
      "Workflows visuels : glissez-déposez vos automatismes sans code",
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics & ROI",
    desc: "Chaque action est mesurée. Chaque euro dépensé est tracé. Vous savez ce qui marche.",
    features: [
      "Tableau de bord temps réel avec métriques clés (open rate, CTR, conversion)",
      "Attribution multi-touch : comprenez quel canal génère les ventes",
      "Cohorts d'engagement : fidélisation, rétention, taux d'activation",
      "Rapports exportables (PDF, CSV) et alertes personnalisées",
      "Calcul automatique du ROI par campagne et par canal",
    ],
  },
  {
    id: "conformite",
    icon: ShieldCheck,
    title: "Conformité",
    desc: "Atlas intègre une surveillance continue des risques de conformité pour vous aider à respecter les régulations en vigueur.",
    features: [
      "Score compliance en temps réel : chaque action est notée avant envoi",
      "Registre des consentements : opt-in, opt-out, historique complet",
      "Audit trail : toutes les actions sont horodatées et signées",
      "Anti-spam intégré : limites de fréquence, validation des listes",
      "RGPD, CAN-SPAM, anti-spam : outils de conformité multi-juridiction",
    ],
  },
];

/* ─── Section component ─── */
function FeatureSection({
  section,
  index,
  visible,
}: {
  section: (typeof sections)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = section.icon;
  const isReversed = index % 2 === 1;

  return (
    <section
      className="py-20 md:py-28"
      style={{
        background: index % 2 === 0 ? "var(--color-dark)" : "var(--color-dark-surface)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${
            isReversed ? "md:direction-rtl" : ""
          }`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.7s ease-out ${index * 100}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
          }}
        >
          {/* Left: Content */}
          <div className={isReversed ? "md:order-2" : "md:order-1"}>
            <div
              className="w-14 h-14 flex items-center justify-center mb-6"
              style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
            >
              <Icon size={24} />
            </div>
            <h2
              className="font-display text-[1.8rem] md:text-[2.4rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
              style={{ color: "var(--color-dark-text)" }}
            >
              {section.title}
            </h2>
            <p
              className="text-base md:text-lg mt-4 leading-relaxed max-w-[480px]"
              style={{ color: "rgba(245, 240, 235, 0.55)" }}
            >
              {section.desc}
            </p>
          </div>

          {/* Right: Features list */}
          <div className={isReversed ? "md:order-1" : "md:order-2"}>
            <ul className="space-y-4">
              {section.features.map((feat, fi) => (
                <li
                  key={fi}
                  className="flex items-start gap-3 text-sm md:text-base leading-relaxed"
                  style={{
                    color: "rgba(245, 240, 235, 0.75)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(16px)",
                    transition: `opacity 0.5s ease-out ${index * 100 + fi * 80 + 200}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 100 + fi * 80 + 200}ms`,
                  }}
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--color-success)" }}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ─── */
export default function FonctionnalitesPage() {
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  /* ─── Header animation ─── */
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  /* ─── Observe each section ─── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [s.id]: true }));
            o.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{ background: "#1A1614" }}>
      {/* ════════════════════════════════════════ */}
      {/* HEADER                                   */}
      {/* ════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-full opacity-[0.03] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)",
          }}
        />

        <div ref={headerRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.12em] mb-6"
            style={{
              color: "var(--color-accent)",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            Atlas
          </p>
          <h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Fonctionnalités Atlas
          </h1>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            De la capture à la fidélisation, en passant par la conformité —
            Atlas est un outil tout-en-un conçu pour accompagner les créateurs
            face aux règles actuelles des plateformes.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* FEATURE SECTIONS                         */}
      {/* ════════════════════════════════════════ */}
      {sections.map((section, i) => (
        <div key={section.id} id={`section-${section.id}`}>
          <FeatureSection
            section={section}
            index={i}
            visible={visibleSections[section.id]}
          />
        </div>
      ))}

      {/* ════════════════════════════════════════ */}
      {/* CTA                                      */}
      {/* ════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <h2
            className="font-display text-[1.8rem] md:text-[2.8rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{ color: "var(--color-dark-text)" }}
          >
            Prêt à tout automatiser ?
          </h2>
          <p
            className="text-base mt-4 max-w-md mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Créez votre premier workflow en 5 minutes. Sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Commencer gratuitement
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/atlas/pricing"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                border: "2px solid rgba(245, 240, 235, 0.15)",
                color: "var(--color-dark-text)",
              }}
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
