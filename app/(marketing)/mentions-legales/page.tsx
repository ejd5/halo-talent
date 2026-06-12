"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function MentionsLegalesPage() {
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

  return (
    <div style={{ background: "#1A1614" }}>
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
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
            Mentions légales
          </p>
          <h1
            className="font-display text-[2.2rem] md:text-[3.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Admin banner */}
      <div className="mx-auto w-full max-w-4xl px-6 md:px-12 pb-8">
        <div
          className="p-4 text-center text-xs"
          style={{
            background: "rgba(199, 91, 57, 0.08)",
            border: "1px solid rgba(199, 91, 57, 0.15)",
            color: "rgba(245, 240, 235, 0.55)",
          }}
        >
          Certaines informations administratives doivent être complétées avant mise en production.
          Les champs marqués [À compléter] sont des placeholders.
        </div>
      </div>

      {/* Content */}
      <section className="py-16 md:py-20" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="prose-custom space-y-10">
            <Section title="1. Éditeur du site">
              <p>
                Le site internet <strong>halotalent.com</strong> est édité par :
              </p>
              <ul>
                <li><strong>Raison sociale :</strong> [À compléter — nom de la société]</li>
                <li><strong>Forme juridique :</strong> [À compléter — SARL, SAS, EI, etc.]</li>
                <li><strong>Capital social :</strong> [À compléter]</li>
                <li><strong>Adresse du siège social :</strong> [À compléter — adresse complète]</li>
                <li><strong>Numéro SIRET :</strong> [À compléter]</li>
                <li><strong>Numéro TVA intracommunautaire :</strong> [À compléter]</li>
                <li><strong>Email :</strong> contact@halotalent.com</li>
              </ul>
            </Section>

            <Section title="2. Directeur de la publication">
              <p>
                <strong>Nom :</strong> [À compléter — nom du directeur de publication]
              </p>
              <p className="text-xs" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
                Le directeur de la publication est responsable du contenu éditorial
                mis en ligne sur le site.
              </p>
            </Section>

            <Section title="3. Hébergement">
              <p>Le site halotalent.com est hébergé par :</p>
              <ul>
                <li><strong>Hébergeur :</strong> Vercel Inc.</li>
                <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Site web :</strong> https://vercel.com</li>
              </ul>
              <p className="text-xs" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
                Les données sont stockées sur des serveurs situés aux États-Unis
                (Vercel Edge Network) et dans l&apos;Union européenne (base de données
                Supabase). Si cette configuration change, cette page sera mise à jour.
              </p>
            </Section>

            <Section title="4. Propriété intellectuelle">
              <p>
                L&apos;ensemble du site halotalent.com — incluant sa structure, son design
                graphique, ses textes, ses logos, ses images et ses éléments logiciels —
                est la propriété exclusive de [À compléter], sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, adaptation ou
                exploitation non autorisée du site ou de son contenu est interdite
                et constitue une contrefaçon au sens du Code de la propriété
                intellectuelle.
              </p>
              <p>
                Les marques et logos figurant sur le site sont des marques déposées
                par [À compléter] ou par des tiers. Toute reproduction ou utilisation
                sans autorisation préalable est prohibée.
              </p>
            </Section>

            <Section title="5. Liens hypertextes">
              <p>
                Le site peut contenir des liens vers des sites tiers. L&apos;éditeur
                ne saurait être tenu responsable du contenu de ces sites ni des
                éventuels dommages résultant de leur consultation. La décision
                d&apos;accéder à un site tiers relève de la responsabilité de
                l&apos;utilisateur.
              </p>
            </Section>

            <Section title="6. Limitation de responsabilité">
              <p>
                L&apos;éditeur s&apos;efforce de fournir des informations exactes et
                à jour sur le site. Toutefois, il ne saurait garantir l&apos;exactitude,
                la précision ou l&apos;exhaustivité des informations mises à disposition.
              </p>
              <p>
                L&apos;utilisation du site et de ses services se fait sous la seule
                responsabilité de l&apos;utilisateur. L&apos;éditeur ne pourra être tenu
                responsable des dommages directs ou indirects résultant de
                l&apos;utilisation du site, y compris les pertes de données, les
                interruptions de service, ou les conséquences liées aux
                plateformes tierces.
              </p>
              <p>
                Les services de Halo Talent, incluant Halo Lex, Atlas CRM et
                le Studio IA, sont fournis en l&apos;état. Ils ne constituent pas
                un conseil juridique et ne garantissent ni revenus, ni absence
                de restriction de plateforme.
              </p>
            </Section>

            <Section title="7. Contact">
              <p>
                Pour toute question relative aux présentes mentions légales,
                vous pouvez nous contacter :
              </p>
              <ul>
                <li>
                  <strong>Par email :</strong>{" "}
                  <Link href="/contact" style={{ color: "var(--color-accent)" }}>
                    via le formulaire de contact
                  </Link>
                </li>
                <li><strong>Par courrier :</strong> [À compléter — adresse postale]</li>
              </ul>
            </Section>

            <p
              className="text-xs pt-8"
              style={{ color: "rgba(245, 240, 235, 0.35)" }}
            >
              Dernière mise à jour : juin 2026. Ce document pourra être modifié
              à tout moment pour refléter les évolutions légales ou
              organisationnelles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Section sub-component ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="font-display text-lg md:text-xl font-bold mb-4"
        style={{ color: "var(--color-dark-text)" }}
      >
        {title}
      </h2>
      <div
        className="text-sm md:text-base leading-relaxed space-y-3"
        style={{ color: "rgba(245, 240, 235, 0.7)" }}
      >
        {children}
      </div>
    </div>
  );
}
