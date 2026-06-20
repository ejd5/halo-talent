import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Agence vs Creator OS — La comparaison honnête. | WTF",
  description: "Pourquoi le modèle d'agence classique est brisé, et comment le Creator OS redonne le contrôle aux créateurs.",
};

export default function AgenceVsCreatorOsPage() {
  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#F4EFE7] pt-32 pb-24">
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-32 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--or)] mb-6 block font-mono">
          Comparatif
        </span>
        <h1 
          className="text-5xl md:text-7xl mb-8"
          style={{ fontFamily: "var(--font-couture), Georgia, serif", lineHeight: 1.1 }}
        >
          Agence Classique vs <br />
          <span className="italic text-[var(--or)]">Creator OS</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Le modèle d'agence actuel repose sur la dépendance. Le Creator OS repose sur l'autonomie et l'accompagnement à la demande.
        </p>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 mb-32">
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#110E0C] border-b border-gray-800">
                <th className="p-6 font-serif text-xl w-1/3">Critère</th>
                <th className="p-6 font-serif text-xl text-gray-500 w-1/3">Agence Classique</th>
                <th className="p-6 font-serif text-xl text-[var(--or)] w-1/3">WTF Creator OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                { label: "Commissions", classic: "30% à 50% sur tous les revenus", wtf: "0% en Mode Solo, Dégressif en Managed" },
                { label: "Propriété des outils", classic: "Perdue en cas de départ", wtf: "Vos outils, vos données à vie" },
                { label: "Chatting", classic: "Géré par des inconnus via des bots", wtf: "Vous gérez (ou déléguez avec validation humaine)" },
                { label: "Contrats", classic: "Opacité et exclusivité longue", wtf: "Transparence et sans engagement long" },
                { label: "Protection juridique", classic: "Rarement incluse", wtf: "Inclus (WTF Lex & Audit Logs)" },
                { label: "Dépendance", classic: "Forte (l'agence a tous les accès)", wtf: "Faible (vous êtes le propriétaire)" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#110E0C]/50 transition-colors">
                  <td className="p-6 font-medium text-gray-300">{row.label}</td>
                  <td className="p-6 text-sm text-gray-500 flex items-start gap-2">
                    <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{row.classic}</span>
                  </td>
                  <td className="p-6 text-sm text-gray-300 flex items-start gap-2">
                    <Check size={16} className="text-[var(--or)] shrink-0 mt-0.5" />
                    <span>{row.wtf}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className="max-w-[800px] mx-auto px-6 md:px-12 mb-32 text-center">
        <h2 className="text-3xl font-serif mb-6">Ne signez pas à l'aveugle.</h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Nous ne disons pas que toutes les agences sont mauvaises. Nous disons que le modèle par défaut est déséquilibré. Si vous décidez de confier votre carrière à une équipe, faites-le avec les bons outils et les bonnes règles dès le départ.
        </p>
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-4 px-8 py-4 bg-[var(--or)] text-[#0C0A08] uppercase tracking-widest text-xs font-semibold hover:bg-transparent hover:text-[var(--or)] border border-[var(--or)] transition-all"
        >
          Reprendre le contrôle <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
