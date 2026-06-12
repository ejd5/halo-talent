"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CGUPage() {
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
            CGU
          </p>
          <h1
            className="font-display text-[2.2rem] md:text-[3.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Conditions générales d&apos;utilisation
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="space-y-10">
            <Section title="1. Objet">
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
                l&apos;utilisation du site halotalent.com et des services associés,
                édités par [À compléter — raison sociale].
              </p>
              <p>
                Les services incluent : Studio IA (création de contenu assistée),
                Atlas CRM (gestion de fans et campagnes), Halo Lex (analyse de
                contrats), Bouclier Légal (vérification de conformité), et tout
                autre service proposé sur la plateforme.
              </p>
              <p>
                En accédant au site et en utilisant les services, vous acceptez
                sans réserve les présentes CGU. Si vous n&apos;acceptez pas ces
                conditions, veuillez ne pas utiliser le site.
              </p>
            </Section>

            <Section title="2. Accès au service">
              <p>
                Le site est accessible gratuitement. Certains services nécessitent
                la création d&apos;un compte utilisateur et/ou un abonnement payant.
              </p>
              <p>
                Nous nous efforçons d&apos;assurer un accès continu au site, mais ne
                pouvons garantir une disponibilité ininterrompue. Des interruptions
                pour maintenance, mise à jour ou cas de force majeure sont
                possibles.
              </p>
            </Section>

            <Section title="3. Compte utilisateur">
              <p>Lors de la création de votre compte, vous vous engagez à :</p>
              <ul>
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Ne pas créer de compte pour le compte d&apos;un tiers sans autorisation</li>
                <li>Nous informer immédiatement de toute utilisation non autorisée</li>
              </ul>
              <p>
                Vous êtes responsable de toute activité sur votre compte.
                Nous nous réservons le droit de suspendre ou supprimer un compte
                en cas de violation des présentes CGU.
              </p>
            </Section>

            <Section title="4. Usage acceptable">
              <p>En utilisant nos services, vous vous engagez à ne pas :</p>
              <ul>
                <li>Violer les lois et réglementations applicables</li>
                <li>Porter atteinte aux droits de tiers (propriété intellectuelle, vie privée)</li>
                <li>Usurper l&apos;identité d&apos;un tiers</li>
                <li>Diffuser des contenus illicites, diffamatoires ou discriminatoires</li>
                <li>Perturber le fonctionnement du site (virus, attaques, surcharge)</li>
                <li>Contourner les mesures techniques de protection</li>
              </ul>
            </Section>

            <Section title="5. Interdiction de scraping et contournement">
              <p>
                Sont expressément interdits :
              </p>
              <ul>
                <li>
                  Le scraping automatisé du site, de ses API, ou de ses données
                </li>
                <li>
                  L&apos;extraction massive de données par quelque moyen que ce soit
                </li>
                <li>
                  Le contournement des limites d&apos;usage (rate limits) des API
                </li>
                <li>
                  L&apos;utilisation non autorisée des services à des fins commerciales
                  concurrentes
                </li>
              </ul>
            </Section>

            <Section title="6. Modules IA">
              <p>
                Nos services intègrent des modules d&apos;intelligence artificielle
                (génération de contenu, analyse de contrats, suggestions). Ces
                modules :
              </p>
              <ul>
                <li>Sont fournis en l&apos;état, sans garantie de résultat spécifique</li>
                <li>
                  Peuvent produire des suggestions inappropriées ou inexactes —
                  une validation humaine est recommandée avant toute utilisation
                  en production
                </li>
                <li>
                  Ne sont pas entraînés sur vos données personnelles ou vos
                  conversations
                </li>
              </ul>
            </Section>

            <Section title="7. Absence de garantie de revenus">
              <p>
                Halo Talent fournit des outils et services destinés à accompagner
                les créateurs dans leur activité. Aucun service ne garantit un
                niveau de revenus, un nombre d&apos;abonnés, un taux d&apos;engagement,
                ou tout autre résultat commercial.
              </p>
              <p>
                Les performances passées, les études de cas et les simulations
                présentes sur le site sont fournies à titre illustratif et ne
                constituent pas un engagement contractuel.
              </p>
            </Section>

            <Section title="8. Absence de garantie relative aux plateformes tierces">
              <p>
                Les services de Halo Talent incluent des outils conçus pour aider
                à réduire les risques de restriction sur les plateformes tierces
                (OnlyFans, Instagram, TikTok, etc.). Cependant :
              </p>
              <ul>
                <li>
                  Nous ne garantissons pas l&apos;absence de restriction, suspension
                  ou bannissement de compte sur ces plateformes
                </li>
                <li>
                  Les décisions des plateformes relèvent uniquement de leurs
                  conditions d&apos;utilisation respectives
                </li>
                <li>
                  Notre outil Bouclier Légal et Halo Lex fournissent une aide
                  à la compréhension des risques, sans constituer une protection
                  absolue
                </li>
              </ul>
            </Section>

            <Section title="9. Responsabilité de l&apos;utilisateur">
              <p>Vous êtes seul responsable :</p>
              <ul>
                <li>Du contenu que vous créez, publiez et diffusez</li>
                <li>De votre conformité avec les CGU des plateformes tierces</li>
                <li>Des conséquences de vos décisions basées sur l&apos;utilisation de nos outils</li>
                <li>Du respect de vos obligations légales, fiscales et contractuelles</li>
              </ul>
            </Section>

            <Section title="10. Données et export">
              <p>
                Vous conservez la propriété des données et contenus que vous
                créez via nos services. Nous vous permettons d&apos;exporter vos
                données à tout moment dans un format standard, dans la limite
                des fonctionnalités disponibles.
              </p>
              <p>
                Les données personnelles sont traitées conformément à notre{" "}
                <Link href="/confidentialite" style={{ color: "var(--color-accent)" }}>
                  Politique de confidentialité
                </Link>
                .
              </p>
            </Section>

            <Section title="11. Suspension et résiliation">
              <p>
                Nous nous réservons le droit de suspendre ou résilier votre accès
                aux services en cas de :
              </p>
              <ul>
                <li>Violation des présentes CGU</li>
                <li>Utilisation frauduleuse ou abusive des services</li>
                <li>Non-paiement des frais d&apos;abonnement</li>
                <li>Injonction légale ou demande d&apos;une autorité compétente</li>
              </ul>
              <p>
                En cas de résiliation, vous pourrez exporter vos données dans un
                délai raisonnable, sauf en cas de violation grave justifiant une
                suspension immédiate.
              </p>
            </Section>

            <Section title="12. Propriété intellectuelle">
              <p>
                Le site, sa structure, son code source, ses éléments graphiques
                et sa base de données sont protégés par le droit de la propriété
                intellectuelle. Toute reproduction ou exploitation non autorisée
                est interdite.
              </p>
              <p>
                Les contenus que vous créez via nos services vous appartiennent.
                Vous nous concédez une licence limitée d&apos;utilisation de ces
                contenus aux seules fins de fournir le service.
              </p>
            </Section>

            <Section title="13. Limitation de responsabilité">
              <p>
                Dans les limites prévues par la loi applicable, Halo Talent ne
                pourra être tenu responsable :
              </p>
              <ul>
                <li>Des dommages indirects ou consécutifs</li>
                <li>Des pertes de revenus, de clientèle ou de données</li>
                <li>Des décisions prises sur la base des analyses ou suggestions des modules IA</li>
                <li>Des actions des plateformes tierces</li>
                <li>Des interruptions de service indépendantes de notre volonté</li>
              </ul>
            </Section>

            <Section title="14. Modification des conditions">
              <p>
                Nous nous réservons le droit de modifier les présentes CGU à tout
                moment. Les utilisateurs seront informés des modifications par
                email ou via le site. L&apos;utilisation continue des services après
                modification vaut acceptation des nouvelles conditions.
              </p>
            </Section>

            <Section title="15. Loi applicable">
              <p>
                Les présentes CGU sont soumises au droit français. En cas de
                litige, les parties s&apos;efforceront de trouver une solution amiable
                avant toute action judiciaire.
              </p>
              <p className="text-xs" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
                La juridiction compétente et les clauses de règlement des litiges
                doivent être validées par un conseil juridique avant production.
              </p>
            </Section>

            <Section title="16. Contact">
              <p>
                Pour toute question relative aux présentes CGU :{" "}
                <Link href="/contact" style={{ color: "var(--color-accent)" }}>
                  formulaire de contact
                </Link>
                .
              </p>
            </Section>

            <p
              className="text-xs pt-8"
              style={{ color: "rgba(245, 240, 235, 0.35)" }}
            >
              Dernière mise à jour : juin 2026. Ces conditions pourront être
              modifiées pour refléter les évolutions de nos services ou de la
              réglementation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-component ─── */
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
