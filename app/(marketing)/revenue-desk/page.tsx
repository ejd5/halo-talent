import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquare, Shield, FileText, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Revenue Desk — Gérer les conversations sans perdre le contrôle. | WTF",
  description: "Priorisez les conversations, préparez les réponses, structurez les relances et suivez les ventes assistées. Revenue Desk par WTF.",
  openGraph: {
    title: "Revenue Desk — Gérer les conversations sans perdre le contrôle.",
    description: "Revenue Inbox, fan scoring, smart follow-ups, PPV planner. Gérez vos ventes assistées avec validation humaine et traçabilité complète.",
  },
};

const FAQ = [
  {
    q: "Revenue Desk est-il un bot de chatting ?",
    a: "Non. Revenue Desk ne parle pas à votre place. Il vous aide à prioriser, préparer et structurer vos conversations. Les messages sont des suggestions, pas des envois automatiques. Rien ne part sans votre validation.",
  },
  {
    q: "Comment fonctionne le success fee ?",
    a: "Le success fee de 3% (prix lancement) s'applique uniquement aux ventes assistées explicitement attribuées via Revenue Desk. Les revenus générés sans assistance WTF ne sont pas concernés.",
  },
  {
    q: "Puis-je utiliser Revenue Desk sans engagement longue durée ?",
    a: "Oui. Résiliable à tout moment avec 30 jours de préavis. Vous conservez l'accès à vos données et à votre historique de conversations.",
  },
  {
    q: "Revenue Desk est-il compatible avec toutes les plateformes ?",
    a: "Revenue Desk s'intègre avec les principales plateformes créateurs (OnlyFans, MYM, Fansly) et prépare les réponses dans le respect des CGU de chaque plateforme.",
  },
];

export default function RevenueDeskPage() {
  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#F4EFE7] pt-32 pb-24">
      {/* HERO */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-32 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--or)] mb-6 block font-mono">
          Revenue Desk
        </span>
        <h1
          className="text-5xl md:text-7xl mb-8"
          style={{ fontFamily: "var(--font-couture), Georgia, serif", lineHeight: 1.1 }}
        >
          Gérer les conversations <br />
          <span className="italic text-[var(--or)]">sans perdre le contrôle.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Revenue Desk aide à prioriser les conversations, préparer les réponses, structurer les relances,
          suivre les ventes assistées et garder une cohérence d&apos;image.
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

      {/* LE PROBLÈME */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl mb-6 font-serif">Le problème : volume, fatigue, opportunités perdues</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Trop de messages, pas assez de temps. Les fans chauds se noient dans la masse,
              les relances sont oubliées, les contenus envoyés au mauvais moment.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Les outils classiques répondent par l&apos;automatisation aveugle : des bots qui parlent
              à votre place, des promesses de revenus, des risques de ban. Ce n&apos;est pas la solution.
            </p>
          </div>
          <div className="bg-[#110E0C] p-10 border border-gray-800/50">
            <h3 className="text-xl font-serif mb-6 text-red-500">Ce que WTF ne fait pas</h3>
            <ul className="space-y-6">
              {[
                "Pas de bot caché qui se fait passer pour vous",
                "Pas de promesse de revenu garanti",
                "Pas de contournement des plateformes",
                "Pas de pression excessive sur les fans",
                "Pas d'automatisation invisible"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="w-6 h-px bg-red-900/50 block shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <h2 className="text-3xl md:text-4xl font-serif mb-16 text-center">Fonctionnalités</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Revenue Inbox", desc: "Priorisez les messages qui ont la plus haute probabilité de conversion." },
            { title: "Fan Scoring", desc: "Identifiez vos fans les plus engagés et adaptez votre approche." },
            { title: "Scripts Library", desc: "Vos propres messages sauvegardés. Gardez votre ton de voix intact." },
            { title: "Smart Follow-ups", desc: "Sachez exactement quand relancer un fan sans avoir l'air insistant." },
            { title: "PPV Planner", desc: "Organisez la sortie de vos contenus payants de manière stratégique." },
            { title: "Pricing Suggestions", desc: "Recommandations de prix basées sur l'historique du fan." },
            { title: "Message Drafts", desc: "Brouillons IA préparés, vous validez avant envoi." },
            { title: "Content Vault Matching", desc: "Associez le bon contenu au bon fan au bon moment." },
            { title: "Attribution & Audit", desc: "Tracez chaque vente assistée. Vous gardez la main." },
          ].map((feat, i) => (
            <div key={i} className="p-8 border border-gray-800 hover:border-[var(--or)]/50 transition-all">
              <h3 className="text-lg font-serif mb-3 text-[var(--or)]">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODES */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32 bg-[#14100D] p-12 md:p-20 border border-[var(--or)]/10">
        <h2 className="text-3xl font-serif mb-12 text-center">Quatre modes, un seul outil</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { mode: "Brouillons", desc: "L'IA prépare, vous validez." },
            { mode: "Validation", desc: "QA review avant chaque envoi." },
            { mode: "Assisted", desc: "Supervision humaine des échanges." },
            { mode: "Managed", desc: "Délégation complète et tracée." },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 border border-gray-800/50">
              <div className="text-[var(--or)] text-xs uppercase tracking-widest mb-3 font-mono">0{i + 1}</div>
              <h3 className="text-xl font-serif mb-2">{item.mode}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="max-w-[800px] mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Revenue Desk à partir de 79€/mois + 3%</h2>
        <p className="text-gray-400 mb-4">
          Prix lancement. Le success fee s&apos;applique uniquement aux ventes assistées attribuées.
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
            <strong className="text-gray-500">Avertissement :</strong> Les montants de revenus mentionnés
            sont des illustrations. Aucun revenu n&apos;est garanti. Revenue Desk est un outil d&apos;aide
            à la structuration des conversations. Les fonctionnalités doivent être utilisées dans le respect
            des règles des plateformes et des limites fixées par le créateur. Le success fee s&apos;applique
            uniquement aux ventes assistées attribuées via Revenue Desk selon les règles affichées.
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
