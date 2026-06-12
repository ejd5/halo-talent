import { Metadata } from "next";
import { LexLandingSection } from "@/components/halo-lex/LexLandingSection";

export const metadata: Metadata = {
  title: "Halo Lex — Assistant juridique IA pour créateurs de contenu",
  description:
    "Assistant IA pour comprendre vos contrats et obligations légales. Avatar interactif, base juridique actualisée, génération de lettres, diagnostic guidé.",
};

export default function LexAIPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12 text-center">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] mb-4 px-3 py-1"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(199,91,57,0.15))", border: "1px solid rgba(16,185,129,0.3)", color: "rgb(16,185,129)" }}
          >
            ✨ Nouveau — Halo Lex
          </span>
          <h1
            className="text-[2.8rem] md:text-[4.5rem] font-bold tracking-[-0.03em] leading-[1.05] max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Votre conseiller juridique IA{" "}
            <span style={{ background: "linear-gradient(135deg, rgb(16,185,129), rgb(199,91,57))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              disponible 24/7
            </span>
          </h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Halo Lex est votre première ligne de défense légale. Un conseiller juridique IA spécialisé créateurs,
            avec avatar humain interactif, base juridique actualisée en temps réel, et réseau d&apos;avocats partenaires.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="/halo/lex"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Essayer Halo Lex gratuitement
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            >
              Voir les offres
            </a>
          </div>
        </div>
      </section>

      {/* Full feature section */}
      <LexLandingSection />

      {/* How it works */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Posez votre question", desc: "Discutez avec Lex en texte ou vocal. Notre avatar humain vous répond en temps réel." },
              { step: "2", title: "Analyse juridique", desc: "Lex consulte sa base juridique (CGU, lois, jurisprudence) et applique le RAG pour une réponse sourcée." },
              { step: "3", title: "Actions concrètes", desc: "Générez une lettre, lancez un diagnostic, ou préparez votre dossier pour un avocat." },
              { step: "4", title: "Escalade si nécessaire", desc: "Cas complexe ? Lex vous met en relation avec notre réseau d'avocats partenaires." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold"
                  style={{ background: "rgba(16,185,129,0.15)", color: "rgb(16,185,129)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Halo Lex vs les alternatives
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Critère</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "rgb(16,185,129)" }}>Halo Lex</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>Avocat traditionnel</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>Chatbot juridique</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Disponibilité", "24/7, réponse instantanée", "Sur RDV, 48-72h", "24/7 mais générique"],
                  ["Avatar humain", "✅ Temps réel", "❌", "❌"],
                  ["Coût", "À partir de 0€ (inclus dans Premium)", "150-300€ la consultation", "Souvent gratuit, limité"],
                  ["Base juridique", "CGU + lois + jurisprudence actualisée", "Expertise humaine", "Générique, non spécialisé"],
                  ["Génération lettres", "✅ 30 secondes", "✅ Sur demande", "❌ Généralement pas"],
                  ["Réseau avocats", "✅ Partenaires tarifs négociés", "❌", "❌"],
                  ["RAG sourcé", "✅ Citations précises", "N/A", "❌ Souvent non sourcé"],
                  ["Spécialisation", "Créateurs de contenu", "Généraliste souvent", "Droit général"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-default)" }}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-3 px-4 ${j === 0 ? "text-left font-medium" : "text-center"}`}
                        style={{
                          color: j === 1 ? "rgb(16,185,129)" : j === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                          fontWeight: j === 1 ? 500 : j === 0 ? 500 : 400,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {[
              { q: "Halo Lex remplace-t-il un avocat ?", a: "Non. Halo Lex fournit une information juridique générale et vous aide à préparer vos démarches. Pour les conseils personnalisés et les cas complexes, nous vous orientons vers notre réseau d'avocats partenaires." },
              { q: "Mes données sont-elles protégées ?", a: "Oui. Toutes les conversations avec Lex sont chiffrées. Vos documents juridiques sont stockés de manière sécurisée. Nous ne partageons aucune donnée sans votre consentement explicite." },
              { q: "Quels plans ont accès à Halo Lex ?", a: "Halo Lex est inclus dans les plans Premium (30 min/mois), Elite (crédits généreux) et Icon (crédits généreux + avocat dédié). Le plan Free/Creator n'y a pas accès." },
              { q: "Dans quelles langues puis-je parler à Lex ?", a: "Lex parle français et anglais. La génération de lettres supporte 6 langues : français, anglais, espagnol, portugais, allemand, italien." },
              { q: "Est-ce que Lex connaît les CGU de ma plateforme ?", a: "Oui. Lex a accès aux CGU d'OnlyFans, Fansly, MYM, Instagram, TikTok, YouTube, Twitter et Twitch, mises à jour quotidiennement via notre système de scan automatique." },
            ].map((faq, i) => (
              <details key={i} className="p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <summary className="text-sm font-medium cursor-pointer" style={{ color: "var(--text-primary)" }}>
                  {faq.q}
                </summary>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Prêt à sécuriser votre activité ?
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Rejoignez les créateurs qui utilisent déjà Halo Lex pour protéger leurs droits et leurs revenus.
          </p>
          <a
            href="/halo/lex"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Commencer avec Halo Lex
          </a>
        </div>
      </section>
    </div>
  );
}
