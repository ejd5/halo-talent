"use client";

import Link from "next/link";

export function CGUClient() {
  return (
    <div style={{ backgroundColor: "var(--creme)" }}>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "var(--encre)" }}>
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            CGU
          </p>
          <h1
            className="text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.08]"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Conditions générales d'utilisation
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="space-y-10">
            <Section title="1. Objet">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) régissent
                l'utilisation du site halotalent.com et des services associés,
                édités par [À compléter, raison sociale].
              </p>
              <p>
                Les services incluent : Studio IA (création de contenu assistée),
                Atlas CRM (gestion de fans et campagnes), WTF Lex (analyse de
                contrats), Bouclier Légal (vérification de conformité), et tout
                autre service proposé sur la plateforme.
              </p>
              <p>
                En accédant au site et en utilisant les services, vous acceptez
                sans réserve les présentes CGU. Si vous n'acceptez pas ces
                conditions, veuillez ne pas utiliser le site.
              </p>
            </Section>

            <Section title="2. Accès au service">
              <p>
                Le site est accessible gratuitement. Certains services nécessitent
                la création d'un compte utilisateur et/ou un abonnement payant.
              </p>
              <p>
                Nous nous efforçons d'assurer un accès continu au site, mais ne
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
                <li>Ne pas créer de compte pour le compte d'un tiers sans autorisation</li>
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
                <li>Usurper l'identité d'un tiers</li>
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
                  L'extraction massive de données par quelque moyen que ce soit
                </li>
                <li>
                  Le contournement des limites d'usage (rate limits) des API
                </li>
                <li>
                  L'utilisation non autorisée des services à des fins commerciales
                  concurrentes
                </li>
              </ul>
            </Section>

            <Section title="6. Modules IA">
              <p>
                Nos services intègrent des modules d'intelligence artificielle
                (génération de contenu, analyse de contrats, suggestions). Ces
                modules :
              </p>
              <ul>
                <li>Sont fournis en l'état, sans garantie de résultat spécifique</li>
                <li>
                  Peuvent produire des suggestions inappropriées ou inexactes,
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
                Where Talent Forms fournit des outils et services destinés à accompagner
                les créateurs dans leur activité. Aucun service ne garantit un
                niveau de revenus, un nombre d'abonnés, un taux d'engagement,
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
                Les services de Where Talent Forms incluent des outils conçus pour aider
                à réduire les risques de restriction sur les plateformes tierces
                (OnlyFans, Instagram, TikTok, etc.). Cependant :
              </p>
              <ul>
                <li>
                  Nous ne garantissons pas l'absence de restriction, suspension
                  ou bannissement de compte sur ces plateformes
                </li>
                <li>
                  Les décisions des plateformes relèvent uniquement de leurs
                  conditions d'utilisation respectives
                </li>
                <li>
                  Notre outil Bouclier Légal et WTF Lex fournissent une aide
                  à la compréhension des risques, sans constituer une protection
                  absolue
                </li>
              </ul>
            </Section>

            <Section title="9. Responsabilité de l'utilisateur">
              <p>Vous êtes seul responsable :</p>
              <ul>
                <li>Du contenu que vous créez, publiez et diffusez</li>
                <li>De votre conformité avec les CGU des plateformes tierces</li>
                <li>Des conséquences de vos décisions basées sur l'utilisation de nos outils</li>
                <li>Du respect de vos obligations légales, fiscales et contractuelles</li>
              </ul>
            </Section>

            <Section title="10. Données et export">
              <p>
                Vous conservez la propriété des données et contenus que vous
                créez via nos services. Nous vous permettons d'exporter vos
                données à tout moment dans un format standard, dans la limite
                des fonctionnalités disponibles.
              </p>
              <p>
                Les données personnelles sont traitées conformément à notre{" "}
                <Link href="/confidentialite" className="font-medium transition-colors duration-200 hover:opacity-70" style={{ color: "var(--or)" }}>
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
                <li>Non-paiement des frais d'abonnement</li>
                <li>Injonction légale ou demande d'une autorité compétente</li>
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
                Vous nous concédez une licence limitée d'utilisation de ces
                contenus aux seules fins de fournir le service.
              </p>
            </Section>

            <Section title="13. Limitation de responsabilité">
              <p>
                Dans les limites prévues par la loi applicable, Where Talent Forms ne
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
                email ou via le site. L'utilisation continue des services après
                modification vaut acceptation des nouvelles conditions.
              </p>
            </Section>

            <Section title="15. Loi applicable">
              <p>
                Les présentes CGU sont soumises au droit français. En cas de
                litige, les parties s'efforceront de trouver une solution amiable
                avant toute action judiciaire.
              </p>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                La juridiction compétente et les clauses de règlement des litiges
                doivent être validées par un conseil juridique avant production.
              </p>
            </Section>

            <Section title="16. Contact">
              <p>
                Pour toute question relative aux présentes CGU :{" "}
                <Link href="/contact" className="font-medium transition-colors duration-200 hover:opacity-70" style={{ color: "var(--or)" }}>
                  formulaire de contact
                </Link>
                .
              </p>
            </Section>

            <p
              className="text-[12px] pt-8"
              style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-lg md:text-xl font-bold mb-4"
        style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
      >
        {title}
      </h2>
      <div
        className="text-[0.95rem] leading-relaxed space-y-3"
        style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
      >
        {children}
      </div>
    </div>
  );
}
