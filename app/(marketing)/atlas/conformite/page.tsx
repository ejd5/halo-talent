"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  Gavel,
  Mail,
  Globe,
  Smartphone,
  Clock,
  Ban,
} from "lucide-react";

/* ─── Compliance sections ─── */
const complianceSections = [
  {
    icon: FileCheck,
    title: "RGPD",
    desc: "Conformité totale avec le Règlement Général sur la Protection des Données.",
    items: [
      "Recueil explicite du consentement pour chaque traitement",
      "Droit à l'oubli : suppression immédiate sur demande",
      "Portabilité des données : export complet à tout moment",
      "DPO dédié et registre des traitements mis à jour",
      "Pas de transfert hors UE sans garanties contractuelles",
    ],
  },
  {
    icon: Mail,
    title: "CAN-SPAM",
    desc: "Conformité avec le Controlling the Assault of Non-Solicited Pornography And Marketing Act.",
    items: [
      "Mention expéditeur claire et non trompeuse",
      "Objet non trompeur et en rapport avec le contenu",
      "Lien de désabonnement visible dans tout email",
      "Traitement des désabonnements sous 10 jours ouvrés",
      "Adresse physique valide dans chaque envoi",
    ],
  },
  {
    icon: Globe,
    title: "Anti-spam",
    desc: "Protection contre les pratiques de spam, conformément aux lois Loi pour la Confiance dans l'Économie Numérique (LCEN).",
    items: [
      "Limites de fréquence strictes : max 3 emails/semaine par contact",
      "Validation des listes : pas d'achat de listes externes",
      "Double opt-in obligatoire pour toute nouvelle inscription",
      "Header DKIM, SPF et DMARC sur tous les envois",
      "Registre des plaintes et traitement sous 48h",
    ],
  },
  {
    icon: Smartphone,
    title: "Platform TOS",
    desc: "Respect des conditions d'utilisation des plateformes pour éviter tout risque de ban.",
    items: [
      "Limites de DM : max 50/jour par compte (Instagram, TikTok)",
      "Pas d'automatisation de contenus contrevenant aux CGU",
      "Respect des périodes de cooldown entre actions",
      "Modération IA pour détecter les contenus à risque",
      "logs de conformité exportables pour justification",
    ],
  },
];

/* ─── Checklist ─── */
const checklist = [
  "Consentement explicite pour chaque contact",
  "Double opt-in actif sur tous les formulaires",
  "Limites de fréquence configurées",
  "Mention de désabonnement dans tout email",
  "Header DKIM/SPF/DMARC validés",
  "Registre des traitements à jour",
  "Audit trail activé pour toutes les actions",
  "Limites DM plateformes respectées",
  "DPO nommé et joignable",
  "Politique de confidentialité affichée",
];

/* ─── Section component ─── */
function ComplianceSection({
  section,
  index,
  visible,
}: {
  section: (typeof complianceSections)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = section.icon;

  return (
    <div
      className="card-accent p-8 md:p-10"
      style={{
        background: "var(--color-dark-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease-out ${index * 120}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms`,
      }}
    >
      <div className="flex items-start gap-5">
        <div
          className="w-12 h-12 flex items-center justify-center shrink-0"
          style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--color-dark-text)" }}>
            {section.title}
          </h3>
          <p className="text-sm mb-5" style={{ color: "rgba(245, 240, 235, 0.55)" }}>
            {section.desc}
          </p>
          <ul className="space-y-3">
            {section.items.map((item, fi) => (
              <li
                key={fi}
                className="flex items-start gap-3 text-sm"
                style={{
                  color: "rgba(245, 240, 235, 0.75)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(12px)",
                  transition: `opacity 0.5s ease-out ${index * 120 + fi * 80 + 200}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120 + fi * 80 + 200}ms`,
                }}
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--color-success)" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ConformitePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const sectionsRef = useRef<HTMLDivElement>(null);
  const [sectionsVisible, setSectionsVisible] = useState(false);

  const checklistRef = useRef<HTMLDivElement>(null);
  const [checklistVisible, setChecklistVisible] = useState(false);

  const zeroBanRef = useRef<HTMLDivElement>(null);
  const [zeroBanVisible, setZeroBanVisible] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionsRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSectionsVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = checklistRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setChecklistVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = zeroBanRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setZeroBanVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCtaVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    o.observe(el);
    return () => o.disconnect();
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
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)",
          }}
        />

        <div ref={headerRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            <ShieldCheck size={12} />
            La conformité d'abord
          </div>

          <h1
            className="font-display text-[2.2rem] md:text-[4rem] font-bold uppercase tracking-[-0.02em] leading-[1.05] max-w-4xl"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Atlas est le seul CRM 100% conforme aux règles 2026
          </h1>
          <p
            className="text-base md:text-lg mt-4 max-w-2xl"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            Pendant que les autres outils jouent avec le feu, Atlas a été audité
            et certifié conforme. RGPD, CAN-SPAM, anti-spam, conditions des
            plateformes — nous couvrons tout.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* COMPLIANCE SECTIONS                      */}
      {/* ════════════════════════════════════════ */}
      <section ref={sectionsRef} className="pb-16 md:pb-20">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceSections.map((section, i) => (
              <ComplianceSection
                key={section.title}
                section={section}
                index={i}
                visible={sectionsVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* RATE LIMITING                            */}
      {/* ════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div
            className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12"
            style={{
              opacity: sectionsVisible ? 1 : 0,
              transition: "opacity 0.7s ease-out",
            }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center shrink-0"
              style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
            >
              <Clock size={24} />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-3" style={{ color: "var(--color-dark-text)" }}>
                Rate limiting intelligent
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(245, 240, 235, 0.6)" }}>
                Atlas ne se contente pas de respecter les limites. Il les anticipe.
                Notre moteur de rate limiting ajuste automatiquement le volume et
                la fréquence de vos envois en fonction des contraintes de chaque
                plateforme, du fuseau horaire de vos contacts, et de leur
                historique d&apos;engagement. Résultat : zero ban, zero plainte,
                zero stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* CHECKLIST                                */}
      {/* ════════════════════════════════════════ */}
      <section ref={checklistRef} className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <h2
            className="font-display text-[1.8rem] md:text-[2.5rem] font-bold uppercase tracking-[-0.02em] text-center mb-4"
            style={{ color: "var(--color-dark-text)" }}
          >
            Checklist conformité
          </h2>
          <p
            className="text-sm text-center mb-12 max-w-lg mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.4)" }}
          >
            Chaque point est vérifié automatiquement par Atlas avant chaque campagne.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2"
                style={{
                  opacity: checklistVisible ? 1 : 0,
                  transform: checklistVisible ? "translateX(0)" : "translateX(16px)",
                  transition: `opacity 0.5s ease-out ${i * 50}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms`,
                }}
              >
                <CheckCircle2
                  size={16}
                  className="shrink-0"
                  style={{ color: "var(--color-success)" }}
                />
                <span className="text-sm" style={{ color: "rgba(245, 240, 235, 0.75)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* ZERO BAN GARANTI                         */}
      {/* ════════════════════════════════════════ */}
      <section ref={zeroBanRef} className="py-20 md:py-28" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div
            className="text-center"
            style={{
              opacity: zeroBanVisible ? 1 : 0,
              transform: zeroBanVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(122, 154, 101, 0.1)", color: "var(--color-success)" }}
            >
              <Ban size={36} />
            </div>

            <h2 className="font-display text-[2rem] md:text-[3rem] font-bold uppercase tracking-[-0.02em] leading-[1.1] mb-4" style={{ color: "var(--color-dark-text)" }}>
              Zero ban garanti
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.6)" }}>
              Si votre compte est suspendu ou banni à cause d&apos;une action
              initiée par Atlas, nous vous remboursons intégralement les 12
              derniers mois d&apos;abonnement. Sans condition. Sans paperasse.
            </p>
            <div
              className="mt-10 p-6 md:p-8 text-left max-w-xl mx-auto"
              style={{
                background: "rgba(122, 154, 101, 0.05)",
                border: "1px solid rgba(122, 154, 101, 0.15)",
              }}
            >
              <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--color-success)" }}>
                <FileCheck size={16} />
                Comment ça marche ?
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(245, 240, 235, 0.7)" }}>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">1.</span>
                  <span>Vous utilisez Atlas en respectant les règles de configuration recommandées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">2.</span>
                  <span>Une action initiée par Atlas cause un ban ou une suspension de votre compte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">3.</span>
                  <span>Vous nous notifiez sous 30 jours, nous remboursons les 12 derniers mois</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* CTA                                      */}
      {/* ════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
              opacity: ctaVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            <ShieldCheck size={12} />
            Garanti sans risque
          </div>

          <h2
            className="font-display text-[1.8rem] md:text-[3rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{
              color: "var(--color-dark-text)",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Commencez en toute sécurité
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-lg mx-auto"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            Créez votre compte Atlas en 2 minutes. Aucune donnée sensible requise
            pour commencer.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s",
            }}
          >
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Commencer
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
