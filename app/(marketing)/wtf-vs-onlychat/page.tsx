import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldAlert, AlertTriangle, Scale, Lock, DollarSign, HelpCircle, ShieldCheck } from "lucide-react";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";

export const metadata: Metadata = {
  title: "OnlyChat vs Where Talent Forms : L'Alternative Sécurisée & Professionnelle",
  description:
    "Comparatif complet entre OnlyChat (Only-chat.ai) et WTF (Where Talent Forms). Pourquoi choisir WTF pour automatiser et sécuriser vos revenus OnlyFans.",
};

export default function OnlyChatVsWtfPage() {
  return (
    <main style={{ backgroundColor: "var(--encre)" }}>
      {/* ─── ACTE 1 : HERO ÉDITORIAL ─── */}
      <section className="couture-section relative overflow-hidden" style={{ paddingTop: 180, paddingBottom: 110 }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }} />
        <div className="wrap-eco text-center" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] mb-6 block" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            RAPPORT COMPARATIF RENTABILITÉ & PROTECTION DES AGENCES
          </span>
          <h1 className="display-large mb-8 text-white" style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.05 }}>
            Une automatisation à risque <br />ou un copilote IA supervisé.
          </h1>
          <p className="text-[1.2rem] leading-relaxed mx-auto mb-10 text-balance" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 800 }}>
            Comparez le modèle à frais fixes cachés d'OnlyChat avec la commission à la performance IA de Where Talent Forms, et sécurisez votre compte contre le gel des fonds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Voir nos tarifs (12% · 8% · 5%)
            </Link>
            <Link href="#comparaison-technique" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
              Comparer les spécifications <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ─── ACTE 2 : LE RISQUE D'AUTO-SEND DÉCOMPILÉ ─── */}
      <section className="couture-section" style={{ backgroundColor: "rgba(199, 91, 57, 0.03)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="p-8 border border-[rgba(199,91,57,0.2)] bg-black/60 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              RISQUE DE CONFORMITÉ
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Lock size={36} className="text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[20px] text-white mb-3" style={{ fontFamily: "var(--font-display-alt), serif" }}>
                  Pourquoi l'envoi direct (Auto-Send) d'OnlyChat est un danger permanent
                </h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--ivoire)" }}>
                  OnlyChat met en avant un envoi automatique de messages piloté à 100% par son robot. Cependant, les algorithmes comportementaux d'OnlyFans en 2026 analysent de manière drastique les flux réseau et les frappes de touche virtuels. L'usage d'une IA autonome qui envoie directement les messages sans intervention humaine est facilement détecté comme une activité suspecte d'impersonation.
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", borderLeft: "2px solid var(--or)", paddingLeft: 12 }}>
                  <strong>L'alternative WTF :</strong> Notre solution **WTF Revenue Desk** élimine ce risque en intégrant obligatoirement une validation humaine dans le flux. L'IA génère les suggestions et scénarios PPV, et le chatter valide le message d'un clic. Cela permet également de conserver une touche humaine essentielle et d'éviter les réponses "hors sujet" caractéristiques d'OnlyChat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 3 : ANALYSE FINANCIÈRE SELON LA TAILLE DU COMPTE ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Analyse financière : Combien coûte réellement OnlyChat ?</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ color: "var(--ivoire)", opacity: 0.7 }}>
            OnlyChat facture un abonnement mensuel de 20 $ + 10% sur les revenus générés. Faisons le calcul par profil de gains.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Solo */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>01 · SOLO</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 2 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 1 000 € générés par l'IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> OnlyChat : ~118 € / mois (20$ + 10%)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Performance) : 120 € / mois (0 € fixe)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    Pour un coût similaire, WTF Performance vous offre un accès complet à l'IA d'aide à la vente sans frais fixes d'abonnement.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Lancer avec WTF <ArrowRight size={12} /></Link>
            </div>

            {/* Confirmé */}
            <div className="p-6 border border-[var(--or)] flex flex-col justify-between" style={{ background: "rgba(216,169,91,0.03)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-500 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>02 · CRÉATEUR CONFIRMÉ</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 10 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 5 000 € générés par l'IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> OnlyChat : ~518 € / mois (20$ + 10%)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Pro) : 439 € / mois (39 € fixe + 8% com IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    <strong>WTF est moins cher de 79 € / mois</strong> tout en intégrant des funnels SMS et e-mail (Atlas CRM) absents chez OnlyChat.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Découvrir WTF Pro <ArrowRight size={12} /></Link>
            </div>

            {/* Agence / Elite */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>03 · ROSTER ELITE / AGENCE</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 50 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 25 000 € générés par l'IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> OnlyChat : ~2 518 € / mois</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Enterprise) : 1 379 € / mois (129 € fixe + 5% com IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    <strong>Une économie phénoménale de 1 139 € / mois</strong>. Vous bénéficiez en plus du support et des analyses juridiques WTF Lex.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Voir WTF Enterprise <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 4 : LIMITATIONS D'ONLYCHAT DÉPISTÉES ─── */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto", color: "var(--ivoire)" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Pourquoi se limiter à un simple bot de chat ?</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ opacity: 0.7 }}>Les agences OnlyFans d'élite cherchent une plateforme de marque globale et non un simple outil isolé.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body), sans-serif" }}>
            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><DollarSign size={16} /> Tarification lourde à l'échelle</h3>
              <p style={{ opacity: 0.8 }}>
                Le taux de commission d'OnlyChat reste bloqué à 10% peu importe votre chiffre d'affaires. Pour une agence générant de gros volumes, cette absence de dégressivité représente un manque à gagner de milliers d'euros par an. WTF propose un plan Enterprise avec une commission réduite à seulement **5%**.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><Scale size={16} /> Pas d'outils juridiques pour vous protéger</h3>
              <p style={{ opacity: 0.8 }}>
                OnlyChat n'inclut aucune protection de contenu contre le vol (DMCA), aucun outil d'analyse de vos contrats de sponsoring ou de droits à l'image. En cas de litige avec un affilié ou de vol de photos, vous devez gérer seul vos démarches juridiques.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <h3 className="font-bold text-[15px] mb-2 text-red-400 flex items-center gap-2"><Lock size={16} /> Risque de réponses absurdes du bot</h3>
              <p style={{ opacity: 0.8 }}>
                Les bots qui fonctionnent de façon entièrement automatisée et sans relecture ont tendance à répondre à côté de la plaque face à des questions complexes (demande de prix négocié, demandes de vidéos personnalisées très spécifiques). Cela détruit le lien de confiance construit avec le fan.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-emerald-700">
              <h3 className="font-bold text-[15px] mb-2 text-emerald-400 flex items-center gap-2"><ShieldCheck size={16} /> WTF : Une synergie globale Premium</h3>
              <p style={{ opacity: 0.8 }}>
                Where Talent Forms associe le Revenue Desk (messagerie assistée sécurisée) à Atlas CRM (funnels marketing pour vos réseaux sociaux) et WTF Lex (assistance juridique et contractuelle). Un accompagnement d'élite pour votre marque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 5 : TABLEAU COMPARATIF DÉTAILLÉ ─── */}
      <section id="comparaison-technique" className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Comparatif Technique objectif</h2>
          <p className="text-center text-[14px] mb-12" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Analyse factuelle des fonctionnalités WTF vs OnlyChat</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white" style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]">Caractéristique</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]" style={{ opacity: 0.6 }}>OnlyChat</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-emerald-400">WTF Revenue Desk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Validation Humaine par défaut</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non (Auto-send dangereux)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Contrôle total)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Commission maximale agence</td>
                  <td className="py-4 px-4 text-center text-red-400">10% fixe (sans dégressivité)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Dégressive jusqu'à 5% (plan Enterprise)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Funnels CRM de relance (Atlas CRM)</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (SMS, Email, relances ciblées)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Protection juridique & DMCA (WTF Lex)</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Inclus)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Accès à des infrastructures physiques</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non (Logiciel pur)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Maisons de création WTF)</td>
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
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">OnlyChat propose un envoi 100% automatique. Pourquoi le déconseillez-vous ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Les conditions d'utilisation d'OnlyFans interdisent formellement l'utilisation de bots automatisant complètement le chat. En cas de contrôle ou de détection algorithmique, votre compte risque une clôture immédiate avec perte de votre solde de gains en attente. WTF choisit la sécurité en proposant une IA d'assistance où chaque brouillon est vérifié et validé par un clic humain.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Qu'est-ce qu'Atlas CRM apporte de plus que le chat ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Atlas CRM vous permet de créer de véritables campagnes marketing en dehors d'OnlyFans. Vous pouvez programmer des relances SMS, des newsletters par e-mail, ou segmenter vos fans selon leurs dépenses passées et leurs préférences pour maximiser la conversion de vos ventes PPV.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Comment fonctionne le transfert de données depuis OnlyChat ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Nos équipes de support technique s'occupent d'importer l'historique de vos scripts et les préférences de vos abonnés pour configurer votre interface WTF Revenue Desk en moins de 48 heures, sans interruption de votre activité de chatting.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="couture-section relative text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
        <div className="wrap-eco relative animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Bâtissez une marque solide et pérenne.</h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Passez de l'automatisation risquée à un copilote de vente IA sécurisé.</p>
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Commencer avec WTF Revenue Desk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
