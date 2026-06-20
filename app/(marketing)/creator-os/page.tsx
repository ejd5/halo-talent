import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Database, MessagesSquare, BarChart, CheckCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Creator OS — Les outils d'une agence. Sans dépendance. | Where Talent Forms",
  description: "CRM, Revenue Desk, IA, Content Vault, protection et droit à l'image dans un seul OS. Commencez seul, ajoutez l'accompagnement quand vous êtes prêt.",
  openGraph: {
    title: "Creator OS — Les outils d'une agence. Sans dépendance.",
    description: "CRM, Revenue Desk, IA, Content Vault, protection et droit à l'image dans un seul espace. Commencez par les outils, pas par une commission.",
  },
};

const FAQ = [
  {
    q: "Creator OS est-il une agence ou un outil SaaS ?",
    a: "C'est un Creator OS. Vous utilisez les outils en autonomie (CRM, Content Vault, IA). L'accompagnement humain est une option que vous activez quand vous le souhaitez, pas une obligation.",
  },
  {
    q: "Puis-je commencer par les outils puis ajouter l'accompagnement ?",
    a: "Oui, c'est exactement le principe. Commencez avec Creator OS Starter ou Pro en totale autonomie. Ajoutez Revenue Desk, Assisted Chat ou Maison Managed quand vous en avez besoin.",
  },
  {
    q: "Quels sont les frais si j'utilise seulement les outils ?",
    a: "Aucun frais caché. L'abonnement mensuel (29€ ou 59€ en prix lancement) couvre tous les outils. Les commissions ne s'appliquent jamais aux outils seuls, uniquement aux ventes assistées si vous activez un accompagnement.",
  },
  {
    q: "Mes données sont-elles protégées si je quitte WTF ?",
    a: "Oui. Vous pouvez exporter toutes vos données à tout moment. Rien n'est confisqué. Votre indépendance est la condition de notre relation.",
  },
];

export default function CreatorOSPage() {
  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#F4EFE7] pt-32 pb-24">
      {/* HERO */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-32 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--or)] mb-6 block font-mono">
          WTF Creator OS
        </span>
        <h1
          className="text-5xl md:text-7xl mb-8"
          style={{ fontFamily: "var(--font-couture), Georgia, serif", lineHeight: 1.1 }}
        >
          Les outils d&apos;une agence. <br />
          <span className="italic text-[var(--or)]">Sans dépendance.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          CRM, contenus, conversations, protection, droit à l&apos;image et reporting dans un seul espace.
          Vous commencez seul. Vous ajoutez l&apos;accompagnement si vous en avez besoin.
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

      {/* POURQUOI PLUS D'AUTONOMIE */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl mb-6 font-serif">Pourquoi les créateurs veulent plus d&apos;autonomie</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Agences opaques, commissions mal comprises, accès aux comptes volés, outils invisibles...
              Le marché des agences a grandi trop vite, au détriment des créateurs.
            </p>
            <p className="text-gray-400 leading-relaxed">
              WTF Creator OS est construit pour celles et ceux qui veulent reprendre le pouvoir sur
              leurs données, leur image et leur stratégie — avec la liberté d&apos;activer un accompagnement
              quand le besoin s&apos;en fait sentir.
            </p>
          </div>
          <div className="bg-[#110E0C] p-10 border border-gray-800/50">
            <ul className="space-y-6">
              {[
                "Commissions opaques et abusives",
                "Perte de contrôle sur l'image",
                "Outils confisqués à la fin du contrat",
                "Automatisation cachée risquée",
                "Pas de visibilité sur les données"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="w-6 h-px bg-red-900/50 block"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CE QUE WTF CENTRALISE */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Ce que WTF centralise</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Tous vos outils créateurs dans un même écosystème, sans silos.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Atlas CRM", icon: <Database size={24} />, desc: "Segmentez vos fans, personnalisez vos campagnes, suivez vos revenus." },
            { title: "Revenue Desk", icon: <BarChart size={24} />, desc: "Priorisez vos conversations, préparez les réponses, suivez les ventes." },
            { title: "CHATEENG", icon: <MessagesSquare size={24} />, desc: "Des brouillons et relances intelligentes, sous votre validation." },
            { title: "Protection & Lex", icon: <Shield size={24} />, desc: "Analyse de contrats, veille juridique, protection de votre image." }
          ].map((mod, i) => (
            <div key={i} className="p-8 border border-gray-800/50 hover:border-[var(--or)]/30 transition-all bg-[#0F0C0A]">
              <div className="text-[var(--or)] mb-6">{mod.icon}</div>
              <h3 className="text-xl font-serif mb-3">{mod.title}</h3>
              <p className="text-sm text-gray-500">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TABLEAU COMPARAISON */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Seul / SaaS / Agence / WTF</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 pr-8 font-serif text-gray-400">Critère</th>
                <th className="py-4 px-4 text-center font-serif text-gray-500">Seul</th>
                <th className="py-4 px-4 text-center font-serif text-gray-500">Outil SaaS</th>
                <th className="py-4 px-4 text-center font-serif text-gray-500">Agence</th>
                <th className="py-4 px-4 text-center font-serif text-[var(--or)]">WTF</th>
              </tr>
            </thead>
            <tbody>
              {[
                { crit: "CRM fans", seul: "✗", saas: "✓", agence: "✓", wtf: "✓" },
                { crit: "Conversations", seul: "✗", saas: "✓", agence: "✗", wtf: "✓" },
                { crit: "Relances", seul: "✗", saas: "✓", agence: "✓", wtf: "✓" },
                { crit: "IA", seul: "✗", saas: "✓", agence: "✗", wtf: "✓" },
                { crit: "Content Vault", seul: "✗", saas: "✓", agence: "✓", wtf: "✓" },
                { crit: "Droit à l'image", seul: "✗", saas: "✗", agence: "✓", wtf: "✓" },
                { crit: "Protection", seul: "✗", saas: "✗", agence: "✓", wtf: "✓" },
                { crit: "Accompagnement", seul: "✗", saas: "✗", agence: "✓", wtf: "Optionnel" },
                { crit: "Prix", seul: "Gratuit", saas: "29-99€", agence: "30-50%", wtf: "29€ +0%" },
                { crit: "Contrôle", seul: "Total", saas: "Total", agence: "Faible", wtf: "Total" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/30">
                  <td className="py-4 pr-8 text-gray-300 font-medium">{row.crit}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{row.seul}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{row.saas}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{row.agence}</td>
                  <td className="py-4 px-4 text-center text-[var(--or)] font-semibold">{row.wtf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 mb-32 bg-[#14100D] p-12 md:p-20 border border-[var(--or)]/10">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Pour qui est fait Creator OS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Glamour Premium", desc: "Mode, beauté, lifestyle haut de gamme" },
            { title: "Influence", desc: "Créateurs de contenu et réseaux sociaux" },
            { title: "YouTube / Podcast", desc: "Formats longs, monétisation, droits" },
            { title: "Musique & Sport", desc: "Artistes, sportifs, performance" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-[var(--or)] text-3xl mb-4 font-serif">{item.title.charAt(0)}</div>
              <h3 className="text-lg font-serif mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="max-w-[800px] mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">À partir de 29€/mois</h2>
        <p className="text-gray-400 mb-8">
          Prix lancement réservés aux accès fondateurs. Aucune commission sur les outils seuls.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-4 px-8 py-4 bg-[var(--or)] text-[#0C0A08] uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-[var(--or)] border border-[var(--or)] transition-all"
        >
          Voir tous les plans <ArrowRight size={16} />
        </Link>
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

      {/* DISCLAIMER */}
      <section className="max-w-[800px] mx-auto px-6 mb-20">
        <div className="border border-gray-800/50 p-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-500">Avertissement :</strong> WTF ne promet pas de revenus garantis,
            ne garantit pas l&apos;absence de risque plateforme et ne remplace pas un avocat.
            Les fonctionnalités d&apos;assistance conversationnelle doivent être utilisées dans le respect
            des règles des plateformes, des limites fixées par le créateur et du niveau de validation choisi.
            Les frais variables s&apos;appliquent uniquement aux ventes attribuées ou assistées selon les règles affichées.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center max-w-[800px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif mb-8">Demander un accès fondateur</h2>
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
