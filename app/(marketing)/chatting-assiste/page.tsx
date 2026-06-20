import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import { RevealSection, SectionDivider } from "@/components/chat-ai/RevealSection";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";

export const metadata: Metadata = {
  title: "Chatting Assisté & Revenue Desk, Where Talent Forms",
  description:
    "Gérez votre volume OnlyFans & MYM sans perdre le contrôle. WTF Revenue Desk : l'IA prépare vos brouillons de réponses, l'humain valide, le bouclier légal protège. Commission de 12% à 5%.",
};

export default function ChattingAssistePage() {
  return (
    <main style={{ backgroundColor: "var(--encre)" }}>
      {/* Hero Section */}
      <section className="couture-section relative overflow-hidden" style={{ paddingTop: 160, paddingBottom: 100 }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }} />
        <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6 animate-pulse" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            WTF REVENUE DESK
          </p>
          <h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }}>
            Le chatting assisté,<br />sans abandonner le contrôle.
          </h1>
          <p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>
            WTF aide les créateurs et leurs équipes à gérer le volume, prioriser les conversations, structurer les relances et suivre les ventes avec validation humaine et conformité absolue.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--ivoire)", borderColor: "var(--or)" }}>
              Voir les tarifs (12% - 5%)
            </Link>
            <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
              Demander une démo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* Le problème du marché */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium mb-8 text-center" style={{ color: "var(--ivoire)" }}>Pourquoi ne pas déléguer à un bot IA caché ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>
            <div className="space-y-4">
              <h3 className="font-bold text-[16px] text-red-800">Le risque de bannissement</h3>
              <p style={{ opacity: 0.8 }}>OnlyFans et les principales plateformes interdisent formellement l'utilisation de chatbots automatisés invisibles dans les DMs. Les comptes enfreignant ces règles risquent un blocage définitif avec gel des fonds.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-[16px] text-red-800">La perte d'authenticité</h3>
              <p style={{ opacity: 0.8 }}>Un bot autonome ne comprend pas les nuances de votre voix ni l'historique relationnel complexe de vos fans. Une réponse robotique ou mal formulée détruit instantanément la confiance de vos abonnés les plus fidèles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* La solution WTF */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-12" style={{ color: "var(--ivoire)" }}>WTF Revenue Desk : Le juste équilibre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>IA Assistée</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>L'IA prépare des brouillons de réponses contextuels et ultra-personnalisés basés sur l'historique d'achat du fan.</p>
            </div>
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>Validation Humaine</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>Aucun message ne part automatiquement. Vous ou vos chatters relisez, adaptez et envoyez d'un clic.</p>
            </div>
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>Bouclier Légal & QA</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>L'IA scanne en continu pour bloquer les mots sensibles, les fausses promesses ou les comportements à risque.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau Comparatif */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 className="display-medium text-center mb-10" style={{ color: "var(--ivoire)" }}>
            WTF vs Bots IA du marché
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse", color: "var(--ivoire)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)", opacity: 0.8 }}>
                  <th className="text-left py-3 px-4 font-semibold">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-semibold">Bot IA classique (ex: Desirely)</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--or)" }}>WTF Revenue Desk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(12,10,8,0.08)" }}>
                  <td className="py-4 px-4 font-medium">Automatisation du chat</td>
                  <td className="py-4 px-4 text-center text-red-700">Envoi direct non contrôlé (risque ToS)</td>
                  <td className="py-4 px-4 text-center text-emerald-800 font-semibold">Brouillons pré-générés + Validation humaine</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(12,10,8,0.08)" }}>
                  <td className="py-4 px-4 font-medium">Contrôle de conformité & QA</td>
                  <td className="py-4 px-4 text-center">Aucun ou basique</td>
                  <td className="py-4 px-4 text-center text-emerald-800 font-semibold">Filtre mots sensibles & Bouclier Légal</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(12,10,8,0.08)" }}>
                  <td className="py-4 px-4 font-medium">Audit logs (Qui a écrit quoi)</td>
                  <td className="py-4 px-4 text-center">Inexistant</td>
                  <td className="py-4 px-4 text-center text-emerald-800 font-semibold">Horodatage de chaque action (Conformité)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(12,10,8,0.08)" }}>
                  <td className="py-4 px-4 font-medium">Dossier juridique en cas de litige</td>
                  <td className="py-4 px-4 text-center">Non</td>
                  <td className="py-4 px-4 text-center text-emerald-800 font-semibold">Inclus via WTF Lex</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tarifs dégressifs */}
      <section className="couture-section" style={{ paddingTop: 90, paddingBottom: 90 }}>
        <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Une commission juste et dégressive</h2>
          <p className="text-[15px] mb-8" style={{ color: "var(--ivoire)" }}>
            Nos commissions de succès sont indexées sur vos abonnements pour s'adapter à votre volume d'activité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <div className="text-[11px] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--or)" }}>Performance</div>
              <div className="text-3xl font-bold mb-2 text-white">0€ / mo</div>
              <div className="text-sm font-semibold" style={{ color: "var(--or)" }}>+ 12% commission IA</div>
            </div>
            <div className="p-6 border border-[var(--or)]" style={{ background: "rgba(216,169,91,0.03)" }}>
              <div className="text-[11px] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--or)" }}>Pro</div>
              <div className="text-3xl font-bold mb-2 text-white">39€ / mo</div>
              <div className="text-sm font-semibold" style={{ color: "var(--or)" }}>+ 8% commission IA</div>
            </div>
            <div className="p-6 border border-[var(--ligne-faible)]" style={{ background: "rgba(244,238,227,0.02)" }}>
              <div className="text-[11px] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--or)" }}>Enterprise</div>
              <div className="text-3xl font-bold mb-2 text-white">129€ / mo</div>
              <div className="text-sm font-semibold" style={{ color: "var(--or)" }}>+ 5% commission IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 60, paddingBottom: 60 }}>
        <div className="wrap-eco" style={{ maxWidth: 800, margin: "0 auto", borderLeft: "4px solid var(--or)", paddingLeft: 20 }}>
          <div className="flex gap-3 items-start">
            <ShieldAlert size={20} className="shrink-0" style={{ color: "var(--or)" }} />
            <div>
              <h4 className="font-bold text-[14px]" style={{ color: "var(--ivoire)" }}>Engagement de Conformité & Sécurité Légale</h4>
              <p className="text-[12px] leading-relaxed mt-2" style={{ color: "var(--ivoire)", opacity: 0.8 }}>
                WTF ne vend pas une promesse d’automatisation invisible. Notre approche repose sur l’assistance, la supervision et la traçabilité. Selon les plateformes utilisées, certaines fonctionnalités peuvent être limitées, désactivées ou nécessiter une validation humaine. Le client reste responsable du respect des conditions d’utilisation des plateformes, de ses obligations légales et du niveau de délégation qu’il accepte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
