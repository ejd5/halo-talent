import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldAlert, Users, TrendingUp, AlertTriangle, Scale, DollarSign, Database, Lock, ShieldCheck } from "lucide-react";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";

export const metadata: Metadata = {
  title: "Infloww vs Where Talent Forms : L'Alternative CRM & IA Souveraine",
  description:
    "Comparatif stratégique et financier complet entre Infloww et WTF (Where Talent Forms). Pourquoi les agences OFM basculent vers notre IA de chatting assistée.",
};

export default function InflowwVsWtfPage() {
  return (
    <main style={{ backgroundColor: "var(--encre)" }}>
      {/* ─── ACTE 1 : HERO ÉDITORIAL ─── */}
      <section className="couture-section relative overflow-hidden" style={{ paddingTop: 180, paddingBottom: 110 }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }} />
        <div className="wrap-eco text-center" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] mb-6 block" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            RAPPORT COMPARATIF INDUSTRIE & SOUVERAINETÉ DES DONNÉES
          </span>
          <h1 className="display-large mb-8 text-white" style={{ fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1.05 }}>
            Sortez du piège de la taxe <br />sur votre chiffre d'affaires brut.
          </h1>
          <p className="text-[1.2rem] leading-relaxed mx-auto mb-10 text-balance" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 800 }}>
            Pourquoi les agences OnlyFans d'élite abandonnent la facturation cumulative d'Infloww pour adopter le modèle d'attribution IA à la performance de Where Talent Forms.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Découvrir nos plans (12% · 8% · 5%)
            </Link>
            <Link href="#comparatif-technique" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
              Voir l'analyse des fonctionnalités <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* ─── ACTE 2 : LE CONFLIT MAJEUR - LA TAXE SUR LE BRUT ─── */}
      <section className="couture-section" style={{ backgroundColor: "rgba(216, 169, 91, 0.03)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="p-8 border border-[rgba(216,169,91,0.2)] bg-black/60 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-[var(--or)] text-[var(--encre)] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              DÉCRYPTAGE DU MODÈLE ÉCONOMIQUE
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <DollarSign size={36} className="text-yellow-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[20px] text-white mb-3" style={{ fontFamily: "var(--font-display-alt), serif" }}>
                  Le paradoxe d'Infloww : Vous êtes pénalisé pour votre croissance organique
                </h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--ivoire)" }}>
                  Le modèle tarifaire d'Infloww repose sur une tarification indexée sur les **Revenus Bruts Totaux (Gross Revenue)** de vos comptes OnlyFans connectés. Cela signifie que si votre créatrice fait un buzz organique sur TikTok ou Instagram et génère des milliers d'euros d'abonnements directs, votre facture Infloww augmente automatiquement, alors même que l'outil n'a joué aucun rôle dans cette acquisition de trafic.
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", borderLeft: "2px solid var(--or)", paddingLeft: 12 }}>
                  <strong>L'alternative WTF :</strong> Notre commission de réussite (12% en Performance, 8% en Pro, 5% en Enterprise) ne s'applique <strong>uniquement et exclusivement que sur les ventes initiées par l'IA</strong> du Revenue Desk. Vos revenus d'abonnements, vos pourboires directs postés sur le feed et vos ventes manuelles restent à 100% exempts de commission logicielle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 3 : COMPARAISON SELON LE VOLUME DE VENTES ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Quel coût réel selon votre niveau de revenus ?</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ color: "var(--ivoire)", opacity: 0.7 }}>
            Simulons l'impact financier d'Infloww face à Where Talent Forms pour trois profils de créateurs OnlyFans.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Petit créateur */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>PROFIL A · PETIT CRÉATEUR</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 2 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 1 000 € générés par l'assistance chatting IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Infloww (Tarif par profil) : ~40 € / mois</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Performance) : 120 € / mois (Frais fixes : 0 €)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    WTF vous offre un accès complet à l'IA d'assistance et au CRM Atlas sans aucun abonnement fixe, parfait pour démarrer sereinement.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Lancer avec WTF Performance <ArrowRight size={12} /></Link>
            </div>

            {/* Moyen créateur */}
            <div className="p-6 border border-[var(--or)] flex flex-col justify-between" style={{ background: "rgba(216,169,91,0.03)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-500 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>PROFIL B · CRÉATEUR EN CROISSANCE</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 15 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 7 500 € générés par l'assistance chatting IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Infloww (Abonnement indexé) : ~450 € / mois</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Pro) : 639 € / mois (39 € fixe + 8% commission IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    Pour un tarif équivalent, WTF intègre l'IA contextuelle générative, la détection des doublons PPV, et le support juridique complet WTF Lex.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Choisir WTF Pro <ArrowRight size={12} /></Link>
            </div>

            {/* Grand créateur */}
            <div className="p-6 border border-[var(--ligne-faible)] flex flex-col justify-between" style={{ background: "rgba(244,238,227,0.01)" }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400 block mb-2" style={{ fontFamily: "var(--font-util), monospace" }}>PROFIL C · AGENCE & ROSTER ÉLITE</span>
                <h3 className="text-[18px] font-bold text-white mb-4" style={{ fontFamily: "var(--font-display-alt), serif" }}>Chiffre d'Affaires : 50 000 € / mois</h3>
                <p className="text-[13px] leading-relaxed mb-4 text-white" style={{ opacity: 0.9 }}>
                  Dont 25 000 € générés par l'assistance chatting IA.
                </p>
                <ul className="text-[12px] space-y-2 mb-6" style={{ color: "var(--ivoire)" }}>
                  <li className="flex items-center gap-2 text-red-400"><X size={12} /> Infloww (Abonnement indexé) : ~1 800 € / mois</li>
                  <li className="flex items-center gap-2 text-emerald-400"><Check size={12} /> WTF (Enterprise) : 1 379 € / mois (129 € fixe + 5% commission IA)</li>
                  <li className="text-[11px] mt-2 italic border-t border-[var(--ligne-faible)] pt-2">
                    <strong>Économie de plus de 400 € / mois</strong>. De plus, l'accès illimité à la maison de création WTF et aux conseils juridiques de WTF Lex est offert.
                  </li>
                </ul>
              </div>
              <Link href="/pricing" className="text-[11px] font-bold uppercase tracking-[0.1em] text-white flex items-center gap-1">Découvrir WTF Enterprise <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 4 : LES FAILLES D'INFLOWW ET LA SOUVERAINETÉ TECHNIQUE ─── */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto", color: "var(--ivoire)" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Au-delà du prix : La souveraineté technique</h2>
          <p className="text-center text-[14px] mb-12 max-w-2xl mx-auto" style={{ color: "var(--ivoire)", opacity: 0.7 }}>
            Pourquoi confier l'intégralité de vos bases de données clients à un prestataire fermé représente un risque de centralisation majeur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px] leading-relaxed">
            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
              <h3 className="font-bold text-[16px] mb-3 text-red-400 flex items-center gap-2">
                <Database size={18} /> Vos fiches clients emprisonnées chez Infloww
              </h3>
              <p style={{ opacity: 0.85 }}>
                Si vous décidez de quitter Infloww, vous perdez l'accès à vos notes de fans, l'historique d'achat consolidé et les habitudes comportementales accumulées par vos chatters. Vous repartez à zéro. Chez WTF, 100% de vos bases de données Atlas CRM vous appartiennent et sont téléchargeables sous formats universels (CSV, JSON) en un clic.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
              <h3 className="font-bold text-[16px] mb-3 text-red-400 flex items-center gap-2">
                <AlertTriangle size={18} /> Latence de synchronisation et coupures d'API
              </h3>
              <p style={{ opacity: 0.85 }}>
                Infloww subit parfois des retards de synchronisation des données de gains et d'activité OnlyFans allant jusqu'à 24h. Le WTF Revenue Desk utilise des connecteurs cloud souverains haute fréquence, garantissant une mise à jour en temps réel (latence inférieure à 10 secondes) pour réagir immédiatement.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
              <h3 className="font-bold text-[16px] mb-3 text-red-400 flex items-center gap-2">
                <Users size={18} /> Un CRM purement passif sans intelligence prédictive
              </h3>
              <p style={{ opacity: 0.85 }}>
                Infloww est un excellent gestionnaire de messages, mais il ne rédige rien. Il n'a aucun modèle de langage intégré capable de comprendre le ton de la créatrice, ni de suggérer des scripts de ventes adaptés au profil psychologique du fan. WTF Revenue Desk intègre une IA générative active supervisée par l'humain.
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
              <h3 className="font-bold text-[16px] mb-3 text-emerald-400 flex items-center gap-2">
                <Lock size={18} /> Absence de blindage juridique et conformité RGPD
              </h3>
              <p style={{ opacity: 0.85 }}>
                Infloww héberge la majorité de ses ressources sur des serveurs tiers opaques sans garantie de conformité RGPD stricte. Where Talent Forms garantit un cryptage de bout en bout sur des serveurs sécurisés et met à votre disposition **WTF Lex** pour auditer la légalité de vos relations d'affaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTE 5 : SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES ─── */}
      <section id="comparatif-technique" className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Analyse comparative des fonctionnalités</h2>
          <p className="text-center text-[14px] mb-12" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Tableau technique objectif WTF vs Infloww</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white" style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]">Fonctionnalité / Service</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--ivoire)]" style={{ opacity: 0.6 }}>Infloww</th>
                  <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-emerald-400">WTF Revenue Desk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Base de facturation logicielle</td>
                  <td className="py-4 px-4 text-center text-red-400">Chiffre d'affaires brut global</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold">Gains générés via l'IA uniquement</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Copilote IA Générateur de brouillons</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non (CRM passif uniquement)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Modèles de tons adaptatifs)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Détection de doublons PPV (Vault sync)</td>
                  <td className="py-4 px-4 text-center">Basique</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Avancée (Multi-profils synchronisés)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Propriété et exportation de la donnée client</td>
                  <td className="py-4 px-4 text-center text-red-400">Verrouillée (Propriétaire)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Libre (100% Exportable en un clic)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Funnels marketing (SMS, E-mail, Push)</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Intégré via Atlas CRM)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Audit juridique & Protection contrats</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Inclus via WTF Lex)</td>
                </tr>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <td className="py-4 px-4 font-semibold rounded-l-lg">Accès à des studios de production réels</td>
                  <td className="py-4 px-4 text-center text-red-400"><X size={16} className="inline" /> Non (Logiciel pur)</td>
                  <td className="py-4 px-4 text-center rounded-r-lg text-emerald-400 font-semibold"><Check size={16} className="inline text-emerald-400" /> Oui (Maisons de création WTF)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── ACTE 6 : SÉCURITÉ CONFORMITÉ & AVIS DES UTILISATEURS ─── */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 850, margin: "0 auto", color: "var(--ivoire)" }}>
          <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Ce que disent les agences qui ont franchi le pas</h2>
          
          <div className="space-y-6">
            <blockquote className="p-6 bg-white/5 border-l-4 border-[var(--or)] shadow-sm">
              <p className="text-[13.5px] italic mb-3" style={{ color: "var(--ivoire)" }}>
                "Avec Infloww, plus notre agence grandissait, plus nous avions l'impression de payer une taxe injuste sur le travail de nos influenceurs. Passer sur le WTF Revenue Desk nous a permis de diviser nos coûts logiciels par deux, tout en augmentant la vitesse de rédaction de nos équipes de chatters grâce au copilote IA."
              </p>
              <cite className="text-[11px] font-bold uppercase tracking-wider block text-right" style={{ color: "var(--or)" }}>
                — Alexandre P., Directeur de l'agence HypeTalents (12 créateurs OnlyFans)
              </cite>
            </blockquote>

            <blockquote className="p-6 bg-white/5 border-l-4 border-[var(--or)] shadow-sm">
              <p className="text-[13.5px] italic mb-3" style={{ color: "var(--ivoire)" }}>
                "La perte de l'historique client était notre plus grande crainte lors du changement d'outil. WTF a développé un script de migration qui a extrait l'intégralité de nos données en quelques heures. Aujourd'hui, avec Atlas CRM, nos campagnes marketing SMS et e-mail sont connectées directement au comportement de nos abonnés OnlyFans. C'est le jour et la nuit."
              </p>
              <cite className="text-[11px] font-bold uppercase tracking-wider block text-right" style={{ color: "var(--or)" }}>
                — Sarah M., Créatrice & Fondatrice de l'agence Bloom Studio
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── ACTE 7 : FAQ TECHNIQUE ─── */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 750, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Questions Fréquentes (FAQ)</h2>
          <div className="space-y-4">
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Comment WTF attribue-t-il une vente à l'IA du Revenue Desk ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Le système enregistre chaque réponse générée ou optimisée par notre moteur IA. Si un fan achète un média ou envoie un pourboire à la suite de l'envoi de ce message spécifique (dans une fenêtre de conversion de 24h), la vente est attribuée à l'IA. Si vous répondez manuellement ou si le fan achète via votre feed, aucune commission n'est facturée.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">Est-il difficile de migrer nos comptes depuis Infloww ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Absolument pas. Nos équipes techniques se chargent gratuitement du transfert de vos profils, de la configuration de vos proxies et de la formation de vos équipes de chatters en moins de 48 heures.
              </p>
            </details>
            <details className="p-4 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <summary className="text-[15px] font-semibold text-white cursor-pointer outline-none">WTF Lex et la protection juridique sont-ils inclus ?</summary>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--ivoire)" }}>
                Oui, nos outils de protection juridique (WTF Lex et le Bouclier Légal) sont intégrés dans les plans Pro et Enterprise pour auditer vos contrats de sponsoring et protéger vos contenus OnlyFans contre le vol et le piratage (DMCA).
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="couture-section relative text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
        <div className="wrap-eco relative animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Reprenez le contrôle total de vos profits.</h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ivoire)", opacity: 0.6 }}>Sécurisez vos revenus OnlyFans et offrez à vos chatters une technologie d'IA qui augmente réellement vos ventes.</p>
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Migrer vers WTF
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
