import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, FileText, Headphones, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Assisted Chat — Assistance structurée avec validation humaine | WTF",
  description: "Déléguez avec des limites claires : voice guide, QA review, supervision humaine, audit logs. Pas d'automatisation invisible.",
  openGraph: {
    title: "Assisted Chat — Assistance structurée avec validation humaine",
    description: "Voice guide, QA review, supervision humaine, audit logs. Une assistance structurée, validée et documentée pour les créateurs exigeants.",
  },
};

const FAQ = [
  {
    q: "Assisted Chat est-il un chatter automatique ?",
    a: "Non. C'est une assistance structurée avec validation humaine obligatoire. L'IA prépare des suggestions, mais rien ne part sans votre validation ou celle de votre superviseur. Aucun envoi automatique.",
  },
  {
    q: "Comment sont fixées les limites de mon assistance ?",
    a: "Vous définissez vos limites écrites : types de messages autorisés, ton, mots interdits, créneaux horaires, tarifs minimum. Tout écart est bloqué ou signalé avant envoi.",
  },
  {
    q: "Quel est le taux de commission pour Assisted Chat ?",
    a: "5% en prix lancement (7% prix standard) sur les ventes assistées. L'abonnement de base est à 149€/mois (199€ prix standard). La commission ne s'applique pas aux revenus générés sans assistance.",
  },
  {
    q: "Puis-je passer d'Assisted Chat à un autre plan ?",
    a: "Oui. Vous pouvez évoluer vers Revenue Desk (plus d'autonomie) ou Maison Managed (plus de délégation) à tout moment, avec un préavis de 30 jours.",
  },
];

export default function AssistedChatPage() {
  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#F4EFE7] pt-32 pb-24">
      {/* HERO */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-32 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--or)] mb-6 block font-mono">
          Assisted Chat
        </span>
        <h1
          className="text-5xl md:text-7xl mb-8"
          style={{ fontFamily: "var(--font-couture), Georgia, serif", lineHeight: 1.1 }}
        >
          Déléguer avec des <br />
          <span className="italic text-[var(--or)]">limites claires.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Voice guide, QA review, supervision humaine, audit logs.
          Une assistance structurée pour les créateurs qui veulent déléguer sans perdre le contrôle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/pricing"
            className="px-8 py-4 bg-[var(--or)] text-[#0C0A08] uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-[var(--or)] border border-[var(--or)] transition-all"
          >
            Voir les offres
          </Link>
          <Link
            href="/demo"
            className="px-8 py-4 uppercase tracking-widest text-xs border border-gray-800 hover:border-[var(--or)] hover:text-[var(--or)] transition-all"
          >
            Demander une démo
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-6">Comment ça marche</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Le chatting est la principale source de revenus, mais aussi la principale source de fatigue.
              Les outils classiques proposent des bots qui parlent à votre place (ce qui est interdit par
              les plateformes) ou des chatters anonymes qui déforment votre image.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Assisted Chat repose sur la préparation : scripts, relances, suggestions préparées par l'IA,
              mais rien ne part sans validation humaine. Vous gardez le contrôle de votre voix et de votre image.
            </p>
          </div>
          <div className="bg-[#110E0C] p-10 border border-gray-800/50">
            <h3 className="text-xl font-serif mb-6 text-[var(--or)]">Le processus</h3>
            <ul className="space-y-6">
              {[
                "01. Voice Guide : Votre ton est documenté",
                "02. Limites écrites : Mots interdits stricts",
                "03. QA Review : Chaque suggestion est scannée",
                "04. Validation : Rien ne part sans approbation",
                "05. Audit : Tout est tracé et consultable"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="w-6 h-px bg-[var(--or)]/30 block shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CE QUE WTF GARANTIT / NE GARANTIT PAS */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#110E0C] p-10 border border-gray-800/50">
            <h3 className="text-xl font-serif mb-6 text-[var(--or)]">Nos engagements</h3>
            <ul className="space-y-4">
              {[
                "Respect total du mandat du créateur",
                "Validation humaine exigée",
                "Protection stricte des données des fans",
                "Audit logs disponibles pendant 12 mois",
                "Mots interdits configurables et appliqués",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-[var(--or)]/20 flex items-center justify-center text-[var(--or)] text-[10px] shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#110E0C] p-10 border border-gray-800/50">
            <h3 className="text-xl font-serif mb-6 text-red-500">Ce que WTF ne fait pas</h3>
            <ul className="space-y-4">
              {[
                "Pas de bot caché qui se fait passer pour vous",
                "Pas de contournement des conditions des plateformes",
                "Pas de manipulation psychologique excessive",
                "Pas de promesse de revenus garantis",
                "Pas d'automatisation sans validation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 text-[10px] shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="max-w-[800px] mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Assisted Chat à partir de 149€/mois + 5%</h2>
        <p className="text-gray-400 mb-4">
          Prix lancement. Commission sur ventes assistées uniquement.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-4 px-8 py-4 bg-[var(--or)] text-[#0C0A08] uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-[var(--or)] border border-[var(--or)] transition-all"
        >
          Voir les détails du plan <ArrowRight size={16} />
        </Link>
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-[800px] mx-auto px-6 mb-20">
        <div className="border border-gray-800/50 p-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-500">Avertissement :</strong> WTF ne promet pas de revenus
            garantis, ne garantit pas l&apos;absence de risque plateforme et ne remplace pas un avocat.
            Les fonctionnalités d&apos;assistance conversationnelle doivent être utilisées dans le respect
            des règles des plateformes, des limites fixées par le créateur et du niveau de validation choisi.
            Les frais variables s&apos;appliquent uniquement aux ventes attribuées ou assistées selon les règles affichées.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[800px] mx-auto px-6 mb-20">
        <h2 className="text-3xl font-serif mb-12 text-center">Questions fréquentes</h2>
        <div className="space-y-6">
          {FAQ.map((item, i) => (
            <details key={i} className="border-b border-gray-800 pb-6 group">
              <summary className="flex items-center justify-between cursor-pointer text-gray-300 hover:text-[var(--or)] transition-colors list-none">
                <span className="text-lg font-serif">{item.q}</span>
                <HelpCircle size={16} className="text-gray-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-[800px] mx-auto px-6">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-4 px-8 py-4 bg-[var(--or)] text-[#0C0A08] uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-[var(--or)] border border-[var(--or)] transition-all"
        >
          Voir les offres <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
