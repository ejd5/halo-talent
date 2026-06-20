import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldAlert, AlertTriangle, Cpu, Globe, Database, Scale, ShieldCheck, Zap } from "lucide-react";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";

export const metadata: Metadata = {
  title: "Supercreator.app vs Where Talent Forms : L'Alternative Premium",
  description:
    "Comparatif complet entre Supercreator.app et WTF (Where Talent Forms). Pourquoi choisir une infrastructure cloud sécurisée plutôt qu'une extension Chrome isolée.",
};

export default function SupercreatorVsWtfPage() {
  return (
    <main style={{ backgroundColor: "var(--encre)" }}>
      {/* ─── ACTE 1 : HERO ÉDITORIAL ─── */}
      <section className="couture-section relative overflow-hidden" style={{ paddingTop: 180, paddingBottom: 110 }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }} />
        <div className="wrap-eco text-center" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] mb-6 block" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            RAPPORT COMPARATIF ARCHITECTURE & GESTION DES RISQUES
          </span>
          <h1 className="display-large mb-8 text-white" style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.05 }}>
            Une extension instable <br />ou une infrastructure de marque.
          </h1>
          <p className="text-[1.2rem] leading-relaxed mx-auto mb-10 text-balance" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 800 }}>
            Découvrez pourquoi les agences OnlyFans structurées refusent de dépendre d'un plugin local et optent pour le WTF Revenue Desk connecté à Atlas CRM et WTF Lex.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Découvrir nos plans (12% · 8% · 5%)
            </Link>
            <Link href="#comparatif-technique" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
              Accéder au tableau de comparaison <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ─── ACTE 2 : DANGER DE L'EXTENSION CHROME ISOLÉE ─── */}
      <section className="couture-section" style={{ backgroundColor: "rgba(199, 91, 57, 0.03)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="p-8 border border-[rgba(199,91,57,0.2)] bg-black/60 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              ANALYSE DES RISQUES TECHNIQUES
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Cpu size={36} className="text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[20px] text-white mb-3" style={{ fontFamily: "var(--font-display-alt), serif" }}>
                  Pourquoi une extension Chrome locale bride votre rentabilité
                </h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--ivoire)" }}>
                  Supercreator fonctionne principalement sous la forme d'un script s'exécutant localement dans votre navigateur Chrome. Cette architecture pose trois problèmes majeurs : elle surcharge la mémoire RAM de l'ordinateur de vos chatters, elle ralentit le défilement de la messagerie OnlyFans, et elle s'arrête de fonctionner dès que Google Chrome met à jour ses règles d'extensions ou que la plateforme modifie son DOM.
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", borderLeft: "2px solid var(--or)", paddingLeft: 12 }}>
                  <strong>L'architecture WTF :</strong> Le **WTF Revenue Desk** est une solution hybride basée sur le cloud. Le traitement lourd de l'IA, la détection des doublons et la synchronisation des données s'exécutent sur nos serveurs distants sécurisés. Vos chatters profitent d'une interface fluide, ultra-rapide et insensible aux lenteurs de leur ordinateur local.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 3 : COMPARAISON DES PROFILS FINANCIERS ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Comparatif par profils d'usage et de gains</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ color: "var(--ivoire)", opacity: 0.7 }}>
            Voyons comment s'articulent les coûts de Supercreator.app par rapport aux plans Where Talent Forms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Solo */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>01 · SOLO</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Créateur Indépendant</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Génère 2 000 € / mois (dont 1 000 € via IA).
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Supercreator : de 15$ à 99$/mois (frais fixes)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Performance) : 120 €/mois (0 € fixe)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    WTF vous exempte de frais fixes. Idéal pour débuter et ne payer qu'en proportion des ventes réelles faites par l'IA.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Démarrer gratuitement <ArrowRight size={12} /></Link>
            </div>

            {/* Confirmé */}
            <div className="p-6 border border-[var(--or)] flex flex-col justify-between" style={{ background: "rgba(216,169,91,0.03)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-500 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>02 · CONFIRMÉ</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Compte en Croissance</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Génère 15 000 € / mois (dont 7 500 € via IA).
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Supercreator (Super AI) : 99$/mois + 5% com IA (~470 €/mois)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Pro) : 639 €/mois (39 € fixe + 8% com IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    Pour un tarif équivalent, WTF offre une suite CRM multicanale, la détection globale de doublons de médias et l'assistance WTF Lex.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Voir WTF Pro <ArrowRight size={12} /></Link>
            </div>

            {/* Agence */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>03 · ROSTER AGENCE</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 50 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 25 000 € générés par l'assistance chatting IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Supercreator : ~1 350 € / mois</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Enterprise) : 1 379 € / mois (129 € fixe + 5% com IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    WTF intègre un tableau de bord collaboratif pour vos équipes (shifts chatters), des proxies dédiés et une couverture juridique complète.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">WTF Enterprise <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 4 : PAIN POINTS CRITIQUES DE SUPERCREATOR ─── */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto", color: "var(--ivoire)" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Les faiblesses techniques constatées sur le terrain</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ opacity: 0.7 }}>Les retours d'agences OnlyFans mettent en lumière des limitations structurelles importantes.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body), sans-serif" }}>
            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><Zap size={16} /> Le danger d'envois de PPV en doublon</h3>
              <p style={{ opacity: 0.8 }}>
                Supercreator analyse le chat en temps réel mais manque parfois d'un historique d'achat interconnecté de vos abonnés sur l'ensemble de votre base de données. Il peut proposer un même média plusieurs fois à un abonné fidèle, nuisant à l'image de marque et provoquant des remboursements.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><Globe size={16} /> Blocages fréquents liés aux extensions</h3>
              <p style={{ opacity: 0.8 }}>
                Puisque Supercreator modifie directement le DOM (l'affichage de la page) OnlyFans de façon visible, la plateforme détecte facilement ces anomalies. En cas de mise à jour majeure d'OnlyFans, l'extension cesse de fonctionner jusqu'à la publication d'un correctif.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><Scale size={16} /> Aucun cadre légal ou juridique</h3>
              <p style={{ opacity: 0.8 }}>
                Supercreator est un outil de chat pur. Il n'offre aucun service d'analyse de vos contrats de sponsoring, aucune protection de propriété intellectuelle et aucune assistance juridique en cas de litige avec un prestataire ou une agence opaque.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-emerald-700">
              <h3 className="font-bold text-[15px] mb-2 text-emerald-400 flex items-center gap-2"><ShieldCheck size={16} /> L'écosystème souverain de WTF</h3>
              <p style={{ opacity: 0.8 }}>
                Where Talent Forms associe le Revenue Desk (messagerie assistée cloud) avec Atlas CRM (funnels marketing) et WTF Lex (le bouclier juridique premium de la créatrice). Vos données sont sécurisées et votre indépendance est totale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 5 : TABLE COMPARATIF DES SPÉCIFICATIONS ─── */}
      <section id="comparatif-technique" className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Comparatif Fonctionnel : WTF vs Supercreator</h2>
          <p className="text-center text-[14px] mb-12" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Analyse factuelle et rigoureuse des deux plateformes.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white" style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]">Fonctionnalité clé</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]" style={{ opacity: 0.6 }}>Supercreator.app</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-emerald-400">WTF Revenue Desk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Architecture principale</td>
                  <td className="py-4 px-4 text-center text-red-400">Extension de navigateur (locale)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Infrastructure Cloud souveraine sécurisée</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Validation Humaine obligatoire</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Optionnelle (Risque ToS)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Contrôle créateur par défaut)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Base de calcul de la commission IA</td>
                  <td className="py-4 px-4 text-center">Revenus du chat gérés par l'IA</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Ventes générées via l'IA uniquement</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">CRM Multicanal (SMS / Email / Push)</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Atlas CRM intégré)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Analyse et protection juridique (Lex)</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Inclus)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Studios physiques & Accompagnement</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non (SaaS pur)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Maison de création WTF)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── ACTE 6 : FAQ TECHNIQUE ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 750, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Questions Fréquentes (FAQ)</h2>
          <div className="space-y-4">
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Pourquoi WTF impose-t-il la validation humaine ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Parce que les algorithmes de détection d'OnlyFans sont de plus en plus stricts. L'envoi automatique de messages à la chaîne par un robot est facilement repéré par l'absence d'activité physique de clavier, entraînant le bannissement du compte. En obligeant une validation humaine (un simple clic sur le brouillon généré), WTF imite parfaitement le comportement humain et protège vos revenus.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Est-ce que WTF ralentit l'ordinateur comme Supercreator ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Non. Toute l'intelligence artificielle et la détection d'historique s'exécutent sur nos serveurs distants hautement optimisés. L'ordinateur de vos chatters n'a pas à traiter de calculs lourds, ce qui évite les plantages du navigateur.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Puis-je importer mes scripts Supercreator existants ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Oui. Notre module d'importation permet d'intégrer vos anciens scripts et notes de fans pour que vos modèles d'IA soient immédiatement opérationnels et entraînés sur votre ton habituel.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="couture-section relative text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
        <div className="wrap-eco relative animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Choisissez la stabilité de vos outils de travail.</h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Maximisez vos revenus de messagerie sans risquer la sécurité de votre compte OnlyFans.</p>
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Basculer sur le WTF Revenue Desk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

