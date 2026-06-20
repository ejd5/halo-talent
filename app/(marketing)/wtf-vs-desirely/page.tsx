import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldAlert, AlertTriangle, HelpCircle, Sparkles, Scale, DollarSign, Database, Ban } from "lucide-react";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";

export const metadata: Metadata = {
  title: "Desirely.co vs Where Talent Forms : L'Alternative Premium",
  description:
    "Comparatif complet entre Desirely.co et WTF (Where Talent Forms). Découvrez pourquoi le WTF Revenue Desk est le choix sécurisé des créatrices OnlyFans.",
};

export default function DesirelyVsWtfPage() {
  return (
    <main style={{ backgroundColor: "var(--encre)" }}>
      {/* ─── ACTE 1 : HERO ÉDITORIAL ─── */}
      <section className="couture-section relative overflow-hidden" style={{ paddingTop: 180, paddingBottom: 110 }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }} />
        <div className="wrap-eco text-center" style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] mb-6 block" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            RAPPORT DE COMPARAISON TECHNIQUE & STRATÉGIQUE
          </span>
          <h1 className="display-large mb-8 text-white" style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.05 }}>
            L'illusion de l'autonomie <br />face à la sécurité des revenus.
          </h1>
          <p className="text-[1.2rem] leading-relaxed mx-auto mb-10 text-balance" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 750 }}>
            Pourquoi les agences OnlyFans / MYM et les créatrices premium refusent de déléguer leur chatting à un bot IA invisible et choisissent l'assistance supervisée de WTF.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Découvrir nos plans (12% · 8% · 5%)
            </Link>
            <Link href="#comparaison-technique" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
              Accéder au comparatif technique <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ─── ACTE 2 : ALERTE CONFORMITÉ & RISQUES PLATFORME ─── */}
      <section className="couture-section" style={{ backgroundColor: "rgba(199, 91, 57, 0.04)", paddingTop: 70, paddingBottom: 70 }}>
        <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="p-8 border border-[rgba(199,91,57,0.25)] bg-black/60 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              ALERTE TOS ONLYFANS
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Ban size={36} className="text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[18px] text-white mb-3" style={{ fontFamily: "var(--font-display-alt), serif" }}>
                  Pourquoi l'envoi 100% automatique (Auto-Send) est un suicide commercial
                </h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--ivoire)" }}>
                  OnlyFans, MYM et Fansly ont considérablement durci leurs algorithmes de détection comportementale en 2026. L'usage d'extensions qui bypassent la validation humaine en envoyant directement des messages (comme le propose l'IA autonome de Desirely) est facilement détecté par l'absence d'activité de clavier organique et les patterns de réponse ultra-rapides.
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", borderLeft: "2px solid var(--or)", paddingLeft: 12 }}>
                  <strong>La sanction :</strong> Clôture définitive du compte de la créatrice pour "impersonation automatisée" et <strong>confiscation irréversible de l'intégralité du solde en attente</strong>. Where Talent Forms a conçu le **WTF Revenue Desk** avec un principe de validation humaine obligatoire par défaut, éliminant tout risque de ban technique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 3 : ANALYSE DES LIMITATIONS DU MARCHÉ ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Les failles du modèle Desirely et des bots classiques</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ color: "var(--ivoire)", opacity: 0.7 }}>
            Voici pourquoi les créateurs et agences en cours de structuration se heurtent rapidement aux limites des solutions purement automatisées.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div className="flex gap-3 items-center mb-4">
                <AlertTriangle size={20} className="text-orange-500" />
                <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "var(--font-display-alt), serif" }}>Le syndrome du "bot fou" en conversation</h3>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                Les bots autonomes peinent à détecter le sarcasme, les demandes de médias personnalisés complexes ou les signaux de détresse de fans vulnérables. Résultat : l'IA envoie des propositions de vente (PPV) hors sujet ou insistantes, dégradant définitivement l'image de la créatrice et provoquant des désabonnements massifs.
              </p>
            </div>

            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div className="flex gap-3 items-center mb-4">
                <AlertTriangle size={20} className="text-orange-500" />
                <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "var(--font-display-alt), serif" }}>La facturation abusive sur le CA global</h3>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                De nombreux outils facturent leur commission sur le chiffre d'affaires total du compte. Chez WTF, la commission (de 12% à 5%) n'est calculée <strong>que sur les ventes PPV et tips attribués à l'action de l'IA</strong> du Revenue Desk. Vos abonnements organiques et pourboires directs restent à 100% dans votre poche.
              </p>
            </div>

            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div className="flex gap-3 items-center mb-4">
                <AlertTriangle size={20} className="text-orange-500" />
                <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "var(--font-display-alt), serif" }}>Pannes et instabilités d'extensions Chrome</h3>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                Une extension de navigateur seule dépend des performances de votre ordinateur et des mises à jour constantes d'OnlyFans. WTF Revenue Desk est basé sur une infrastructure cloud robuste, assurant une disponibilité et une vitesse de réponse inchangées, même lorsque vous gérez des dizaines de milliers de conversations en simultané.
              </p>
            </div>

            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div className="flex gap-3 items-center mb-4">
                <AlertTriangle size={20} className="text-orange-500" />
                <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: "var(--font-display-alt), serif" }}>L'absence totale de cadre légal</h3>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                Desirely ne propose aucun outil pour analyser vos contrats de sponsoring, protéger vos contenus contre le vol (DMCA) ou vous défendre en cas de litige. WTF intègre **WTF Lex** et le **Bouclier Légal** pour assurer votre sécurité juridique complète.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 4 : TABLE COMPARATIF TECHNIQUE DÉTAILLÉ ─── */}
      <section id="comparaison-technique" className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Spécifications Techniques : WTF vs Desirely</h2>
          <p className="text-center text-[14px] mb-12" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Analyse factuelle des fonctionnalités intégrées à chaque outil.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: "0 2px", color: "var(--ivoire)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-widest">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest" style={{ opacity: 0.6 }}>Desirely.co</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-emerald-400">WTF Revenue Desk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Validation Humaine obligatoire</td>
                  <td className="py-4 px-4 text-center"><X size={16} className="inline text-red-500" /> (Autonome par défaut)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg"><Check size={16} className="inline text-emerald-600 font-bold" /> (100% de contrôle)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Lieu d'hébergement des données</td>
                  <td className="py-4 px-4 text-center">Inconnu / Cloud standard</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Serveurs cloud souverains sécurisés RGPD</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Analyse anti-doublon du Vault PPV</td>
                  <td className="py-4 px-4 text-center">Basique</td>
                  <td className="py-4 px-4 text-center rounded-r-lg"><Check size={16} className="inline text-emerald-600 font-bold" /> (Croisement complet historique)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Funnels Marketing SMS/Email/Push</td>
                  <td className="py-4 px-4 text-center"><X size={16} className="inline text-red-500" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg"><Check size={16} className="inline text-emerald-600 font-bold" /> Oui (Atlas CRM intégré)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Analyse et protection juridique de contrats</td>
                  <td className="py-4 px-4 text-center"><X size={16} className="inline text-red-500" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg"><Check size={16} className="inline text-emerald-600 font-bold" /> Oui (WTF Lex inclus)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Attribution de performance par chatter</td>
                  <td className="py-4 px-4 text-center">Partielle</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Suivi complet des shifts et taux de conversion</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Accès à des studios de production physiques</td>
                  <td className="py-4 px-4 text-center"><X size={16} className="inline text-red-500" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg"><Check size={16} className="inline text-emerald-600 font-bold" /> Oui (Maison de création WTF)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── ACTE 5 : 5 PILIERS DE SUPÉRIORITÉ WTF ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-12" style={{ color: "var(--ivoire)" }}>Les 5 avantages réels d'intégrer WTF</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--or)" }}>1</div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-display-alt), serif" }}>La rentabilité à l'échelle (Enterprise à 5%)</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                  Desirely prend jusqu'à 8.5% de commission même sur son plan le plus cher. En choisissant WTF Enterprise, vous bloquez votre commission à **5%** sur les ventes IA, économisant des milliers d'euros chaque mois pour le développement de vos projets créatifs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--or)" }}>2</div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-display-alt), serif" }}>Le Fan Brain et la mémoire contextuelle</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                  Notre outil de chatting ne se contente pas de reformuler vos scripts de façon robotique. Il analyse la fiche complète du fan (préférences, limite de budget estimée par Revenue Radar, sujets sensibles) pour suggérer des réponses pertinentes et chaleureuses.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--or)" }}>3</div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-display-alt), serif" }}>Une conformité juridique béton (WTF Lex)</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                  Chaque message préparé par l'IA et chaque action de vos chatters laisse une piste d'audit horodatée. En cas de réclamation d'un fan ou de litige avec la plateforme, WTF Lex vous permet d'exporter un dossier complet prêt pour votre avocat.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--or)" }}>4</div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-display-alt), serif" }}>Zéro perte de données en cas de départ</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                  Contrairement aux SaaS du marché qui bloquent l'accès à vos fiches clients et statistiques si vous résiliez, WTF garantit que 100% de vos données sont exportables en un clic. Votre indépendance est totale.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "var(--or)" }}>5</div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2" style={{ fontFamily: "var(--font-display-alt), serif" }}>Une synergie Physique + Digital</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)" }}>
                  Desirely est une ligne de code. WTF est une maison de management physique avec des studios d'enregistrement, de tournage et des experts en marketing d'influence pour vous accompagner dans le monde réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 6 : SIMULATION COMPARATIVE SUR 1 AN ─── */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 850, margin: "0 auto", color: "var(--ivoire)" }}>
          <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Simulation financière : Combien économisez-vous sur un an ?</h2>
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-[14px] leading-relaxed mb-6">
              Prenons l'exemple d'une agence ou d'un créateur en croissance qui génère <strong>15 000 € / mois</strong> de chiffre d'affaires, avec 50% des ventes de DMs assistées par l'IA (soit 7 500 € / mois).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] leading-relaxed border-t border-b border-white/10 py-6 mb-6">
              <div>
                <h4 className="font-bold text-[14px] text-red-400 mb-2">Desirely (Pro)</h4>
                • Abonnement fixe : 70 € × 12 mois = 840 €<br />
                • Commission (10%) : 750 € × 12 mois = 9 000 €<br />
                • <strong>Coût total annuel : 9 840 €</strong>
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-emerald-400 mb-2">WTF Revenue Desk (Pro)</h4>
                • Abonnement fixe : 39 € × 12 mois = 468 €<br />
                • Commission (8%) : 600 € × 12 mois = 7 200 €<br />
                • <strong>Coût total annuel : 7 668 €</strong>
              </div>
            </div>
            <div className="text-center font-bold text-[16px] text-emerald-300">
              Économie annuelle réalisée : +2 172 € avec WTF
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 7 : FAQ ANTI-DOUTES ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 750, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Questions Fréquentes (FAQ)</h2>
          <div className="space-y-4">
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Est-il obligatoire d'avoir un chatter humain avec WTF ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Oui, et nous le recommandons fortement pour des raisons de conformité et de sécurité. Le WTF Revenue Desk prépare la réponse sous forme de brouillon instantané, mais une action de clic humain est requise pour valider et envoyer.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Comment WTF sait-il quel message a été envoyé par l'IA ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Notre système d'attribution et de tracking identifie les messages spécifiquement générés par l'IA du Revenue Desk et validés par l'humain. Vous ne payez la commission de succès que sur ces ventes-là. Tout le reste est à 0% de commission logicielle.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Est-ce que WTF Lex est inclus dans l'offre ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Oui, l'accès préparatoire à WTF Lex est intégré dès le plan Pro. Cela vous permet d'auditer vos contrats et d'assurer une traçabilité de vos documents d'affaires.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Que se passe-t-il si je veux stopper mon abonnement ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Notre offre est sans engagement de durée longue. Vous pouvez résilier votre plan à tout moment avec un préavis de 30 jours, et exporter immédiatement toutes vos données fans.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="couture-section relative text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
        <div className="wrap-eco relative animate-fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Choisissez une croissance pérenne et contrôlée.</h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Sécurisez votre compte OnlyFans et maximisez l'efficacité de vos chatters avec le WTF Revenue Desk.</p>
          <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
            Commencer maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
