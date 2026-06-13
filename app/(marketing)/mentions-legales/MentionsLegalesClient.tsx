"use client";

import Link from "next/link";

export function MentionsLegalesClient() {
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
            Mentions légales
          </p>
          <h1
            className="text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.08]"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Admin banner */}
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
          Certaines informations administratives doivent être complétées avant mise en production.
          Les champs marqués [À compléter] sont des placeholders.
        </div>
      </div>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          <div className="space-y-10">
            <Section title="1. Éditeur du site">
              <p>
                Le site internet <strong style={{ color: "var(--encre)", opacity: 0.85 }}>halotalent.com</strong> est édité par :
              </p>
              <ul>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Raison sociale :</strong> [À compléter, nom de la société]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Forme juridique :</strong> [À compléter, SARL, SAS, EI, etc.]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Capital social :</strong> [À compléter]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Adresse du siège social :</strong> [À compléter, adresse complète]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Numéro SIRET :</strong> [À compléter]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Numéro TVA intracommunautaire :</strong> [À compléter]</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Email :</strong> contact@halotalent.com</li>
              </ul>
            </Section>

            <Section title="2. Directeur de la publication">
              <p>
                <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Nom :</strong> [À compléter, nom du directeur de publication]
              </p>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                Le directeur de la publication est responsable du contenu éditorial
                mis en ligne sur le site.
              </p>
            </Section>

            <Section title="3. Hébergement">
              <p>Le site halotalent.com est hébergé par :</p>
              <ul>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Hébergeur :</strong> Vercel Inc.</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Site web :</strong> https://vercel.com</li>
              </ul>
              <p className="text-[12px] mt-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                Les données sont stockées sur des serveurs situés aux États-Unis
                (Vercel Edge Network) et dans l'Union européenne (base de données
                Supabase). Si cette configuration change, cette page sera mise à jour.
              </p>
            </Section>

            <Section title="4. Propriété intellectuelle">
              <p>
                L'ensemble du site halotalent.com, incluant sa structure, son design
                graphique, ses textes, ses logos, ses images et ses éléments logiciels , 
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
                Le site peut contenir des liens vers des sites tiers. L'éditeur
                ne saurait être tenu responsable du contenu de ces sites ni des
                éventuels dommages résultant de leur consultation. La décision
                d'accéder à un site tiers relève de la responsabilité de
                l'utilisateur.
              </p>
            </Section>

            <Section title="6. Limitation de responsabilité">
              <p>
                L'éditeur s'efforce de fournir des informations exactes et
                à jour sur le site. Toutefois, il ne saurait garantir l'exactitude,
                la précision ou l'exhaustivité des informations mises à disposition.
              </p>
              <p>
                L'utilisation du site et de ses services se fait sous la seule
                responsabilité de l'utilisateur. L'éditeur ne pourra être tenu
                responsable des dommages directs ou indirects résultant de
                l'utilisation du site, y compris les pertes de données, les
                interruptions de service, ou les conséquences liées aux
                plateformes tierces.
              </p>
              <p>
                Les services de Where Talent Forms, incluant WTF Lex, Atlas CRM et
                le Studio IA, sont fournis en l'état. Ils ne constituent pas
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
                  <strong style={{ color: "var(--encre)", opacity: 0.85 }}>Par email :</strong>{" "}
                  <Link href="/contact" className="font-medium transition-colors duration-200 hover:opacity-70" style={{ color: "var(--or)" }}>
                    via le formulaire de contact
                  </Link>
                </li>
                <li><strong style={{ color: "var(--encre)", opacity: 0.85 }}>Par courrier :</strong> [À compléter, adresse postale]</li>
              </ul>
            </Section>

            <p
              className="text-[12px] pt-8"
              style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
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
