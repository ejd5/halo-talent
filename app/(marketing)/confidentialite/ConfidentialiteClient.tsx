"use client";

import Link from "next/link";

export function ConfidentialiteClient() {
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
            Politique de confidentialité
          </p>
          <h1
            className="text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.08]"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Politique de confidentialité
          </h1>
        </div>
      </section>

      {/* Legal review notice */}
      <div className="mx-auto w-full max-w-4xl px-6 md:px-12 py-8">
        <div
          className="p-4 text-center text-[12px]"
          style={{
            background: "rgba(199, 91, 57, 0.06)",
            border: "1px solid rgba(199, 91, 57, 0.15)",
            color: "var(--encre)",
            opacity: 0.6,
            fontFamily: "var(--font-body), sans-serif",
          }}
        >
          Document informatif à finaliser avec un conseil juridique avant production.
          Les bases légales mentionnées sont indicatives et doivent être validées.
        </div>
      </div>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="space-y-10">
            <Section title="1. Introduction">
              <p>
                La présente politique de confidentialité décrit comment Where Talent Forms
                collecte, utilise et protège vos données personnelles lorsque vous
                utilisez le site halotalent.com et les services associés (Studio IA,
                Atlas CRM, WTF Lex, Bouclier Légal).
              </p>
              <p>
                Nous nous engageons à respecter la réglementation applicable en
                matière de protection des données, notamment le Règlement Général
                sur la Protection des Données (RGPD) et la Loi Informatique et
                Libertés.
              </p>
            </Section>

            <Section title="2. Données collectées">
              <SubSection title="2.1 Formulaire de contact">
                <p>Lorsque vous utilisez notre formulaire de contact, nous collectons :</p>
                <ul>
                  <li>Nom</li>
                  <li>Adresse email</li>
                  <li>Profil (optionnel)</li>
                  <li>Sujet du message</li>
                  <li>Contenu du message</li>
                  <li>Consentement à être contacté</li>
                </ul>
                <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Finalité : répondre à votre demande. Base légale : consentement
                  (à confirmer juridiquement).
                </p>
              </SubSection>

              <SubSection title="2.2 Formulaire de candidature (Apply)">
                <p>Lorsque vous postulez pour rejoindre la maison Where Talent Forms, nous collectons :</p>
                <ul>
                  <li>Prénom, nom</li>
                  <li>Email</li>
                  <li>Âge, pays</li>
                  <li>WhatsApp (optionnel)</li>
                  <li>Départements sélectionnés</li>
                  <li>Plateformes et revenus déclarés</li>
                  <li>Objectifs et motivations</li>
                </ul>
                <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Finalité : évaluer votre candidature. Base légale : exécution de
                  mesures précontractuelles (à confirmer juridiquement).
                </p>
              </SubSection>

              <SubSection title="2.3 Compte utilisateur">
                <p>Lors de la création d'un compte, nous collectons :</p>
                <ul>
                  <li>Adresse email</li>
                  <li>Mot de passe (hashé)</li>
                  <li>Nom d'affichage</li>
                  <li>Informations de profil</li>
                </ul>
                <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Finalité : fournir l'accès aux services. Base légale : exécution
                  du contrat (à confirmer juridiquement).
                </p>
              </SubSection>

              <SubSection title="2.4 Données Chat AI et CRM (Atlas)">
                <p>
                  Les conversations avec nos assistants IA, les données de fans,
                  segments, campagnes et analyses sont stockées pour fournir le
                  service. Les modèles d'IA utilisés (Claude by Anthropic) ne
                  sont pas entraînés sur vos données.
                </p>
                <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Finalité : fournir les fonctionnalités du service. Base légale :
                  exécution du contrat (à confirmer).
                </p>
              </SubSection>

              <SubSection title="2.5 Données WTF Lex">
                <p>
                  Les contrats soumis à l'analyse WTF Lex sont traités de manière
                  confidentielle. Ils ne sont ni conservés au-delà de la durée
                  nécessaire à l'analyse, ni utilisés pour entraîner des modèles,
                  ni partagés avec des tiers, sauf en cas d'escalade vers un
                  avocat partenaire avec votre consentement explicite.
                </p>
              </SubSection>

              <SubSection title="2.6 Newsletter">
                <p>Lors de l'inscription à notre newsletter, nous collectons :</p>
                <ul>
                  <li>Adresse email</li>
                  <li>Source d'inscription</li>
                </ul>
                <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  Finalité : envoi de communications sur les mises à jour produit et
                  guides. Base légale : consentement (à confirmer).
                </p>
              </SubSection>

              <SubSection title="2.7 Données techniques">
                <p>
                  Lors de votre navigation, nous collectons automatiquement des
                  données techniques : adresse IP, type de navigateur, pages
                  consultées, temps de visite. Ces données sont collectées via
                  des cookies et technologies similaires.
                </p>
              </SubSection>
            </Section>

            <Section title="3. Finalités du traitement">
              <p>Vos données sont collectées pour les finalités suivantes :</p>
              <ul>
                <li>Fournir et améliorer nos services (Studio IA, Atlas CRM, WTF Lex)</li>
                <li>Répondre à vos demandes de contact et de candidature</li>
                <li>Envoyer des communications produit et guides (newsletter)</li>
                <li>Assurer la sécurité et le bon fonctionnement du site</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                Ces finalités et leurs bases légales respectives doivent être
                validées par un conseil juridique avant production.
              </p>
            </Section>

            <Section title="4. Durées de conservation">
              <ul>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Données de compte :</strong> durée du compte + 3 ans
                  après la dernière activité
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Messages de contact :</strong> 2 ans à compter du dernier
                  échange
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Candidatures :</strong> 2 ans à compter de la candidature
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Données de newsletter :</strong> jusqu'au
                  désabonnement
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Données techniques (logs) :</strong> 12 mois maximum
                </li>
              </ul>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                Ces durées sont indicatives et doivent être ajustées en fonction
                des obligations légales applicables (à confirmer).
              </p>
            </Section>

            <Section title="5. Sous-traitants et transferts">
              <p>Nous faisons appel aux sous-traitants suivants :</p>
              <ul>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Vercel Inc. (USA) :</strong> hébergement du site et des
                  API (Edge Network)
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Supabase Inc. (USA / UE) :</strong> base de données et
                  authentification
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Anthropic PBC (USA) :</strong> modèles d'IA (Claude)
                  pour WTF Lex et Chat AI
                </li>
              </ul>
              <p>
                Certains sous-traitants sont situés hors de l'Union européenne.
                Des garanties appropriées sont mises en place (clauses contractuelles
                types, Data Processing Agreements) pour encadrer ces transferts,
                dans la mesure où ces documents ont été signés. Cette section doit
                être vérifiée par un conseil juridique.
              </p>
            </Section>

            <Section title="6. Vos droits">
              <p>
                Conformément au RGPD, vous disposez des droits suivants sur vos
                données personnelles :
              </p>
              <ul>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit de rectification :</strong> corriger des données
                  inexactes
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit à l'effacement :</strong> demander la suppression
                  de vos données
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit à la portabilité :</strong> recevoir vos données dans
                  un format structuré
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit d'opposition :</strong> vous opposer au traitement
                  de vos données
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Droit de retrait du consentement :</strong> retirer votre
                  consentement à tout moment
                </li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous via le{" "}
                <Link href="/contact" className="font-medium transition-colors duration-200 hover:opacity-70" style={{ color: "var(--or)" }}>
                  formulaire de contact
                </Link>{" "}
                ou par email à [À compléter, email DPO ou privacy].
              </p>
            </Section>

            <Section title="7. Sécurité">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles
                appropriées pour protéger vos données : chiffrement en transit (TLS),
                chiffrement au repos, accès restreint aux données, authentification
                forte, audits de sécurité réguliers.
              </p>
              <p>
                En cas de violation de données, nous nous engageons à notifier les
                personnes concernées et l'autorité de contrôle compétente dans
                les délais légaux.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                Le site utilise des cookies strictement nécessaires à son
                fonctionnement (authentification, sécurité, préférences de langue).
                Des cookies analytiques peuvent être utilisés pour mesurer
                l'audience de manière anonyme.
              </p>
              <p>
                Vous pouvez configurer votre navigateur pour bloquer les cookies.
                Cela peut affecter certaines fonctionnalités du site.
              </p>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                Une bannière de consentement aux cookies devra être mise en place
                avant production si des cookies non-essentiels sont déployés
                (à confirmer).
              </p>
            </Section>

            <Section title="9. Contact">
              <p>Pour toute question relative à cette politique :</p>
              <ul>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Email :</strong> [À compléter, email DPO ou privacy]
                </li>
                <li>
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Formulaire :</strong>{" "}
                  <Link href="/contact" className="font-medium transition-colors duration-200 hover:opacity-70" style={{ color: "var(--or)" }}>
                    halotalent.com/contact
                  </Link>
                </li>
              </ul>
            </Section>

            <p
              className="text-[12px] pt-8"
              style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
            >
              Dernière mise à jour : juin 2026. Cette politique pourra être modifiée
              pour refléter les évolutions de nos pratiques ou de la réglementation.
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-sm md:text-base font-semibold mt-5 mb-2"
        style={{ color: "var(--encre)", opacity: 0.85, fontFamily: "var(--font-display-alt), serif" }}
      >
        {title}
      </h3>
      <div
        className="text-[0.95rem] leading-relaxed space-y-2"
        style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
      >
        {children}
      </div>
    </div>
  );
}
