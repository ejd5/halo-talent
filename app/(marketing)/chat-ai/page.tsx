import { Metadata } from "next";
import { ChatAIHero } from "@/components/chat-ai/ChatAIHero";
import { RevealSection, SectionDivider } from "@/components/chat-ai/RevealSection";
import { PageLoader } from "@/components/chat-ai/PageLoader";
import { MarqueeStrip } from "@/components/chat-ai/MarqueeStrip";
import { TrackedLink } from "@/components/chat-ai/TrackedLink";
import { ChatAITrackingEvents } from "@/lib/tracking/chat-ai-events";
import {
  features,
  workflowSteps,
  comparisonRows,
  profiles,
  noPromiseItems,
  faqItems,
} from "@/lib/marketing/chat-ai-landing";

export const metadata: Metadata = {
  title: "Halo Sovereign Chat AI — Copilote de chatting pour créateurs et agences",
  description:
    "Préparez des réponses, priorisez les conversations, recommandez des PPV, contrôlez les risques et gardez une trace des actions avec validation humaine.",
};

export default function ChatAIPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* ─── Page Loader ─── */}
      <PageLoader />

      {/* ─── 1. Hero ─── */}
      <ChatAIHero />

      <MarqueeStrip />

      {/* ─── 2. Problem ─── */}
      <RevealSection staggerMs={80}>
        <section
          className="py-20 section-alt-a"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Le chatting créateur est devenu trop fragmenté.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              Des messages dispersés, des outils qui ne communiquent pas, des risques mal documentés.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "💬", title: "Messages dispersés", desc: "Les conversations arrivent de partout. Impossible d'avoir une vue d'ensemble ni de prioriser." },
                { icon: "👥", title: "Chatters difficiles à contrôler", desc: "Chaque membre de l'équipe a son style. La qualité et la conformité varient sans standards clairs." },
                { icon: "🔄", title: "PPV envoyés en doublon", desc: "Sans historique centralisé, un même contenu est proposé plusieurs fois au même fan." },
                { icon: "⭐", title: "Fans importants mal priorisés", desc: "Les fans à fort potentiel se noient dans le volume. Aucun système ne les remonte automatiquement." },
                { icon: "⚠️", title: "Risques compliance peu documentés", desc: "Pas de trace de qui a dit quoi, quand, et avec quelle validation. En cas de litige, rien n'est traçable." },
                { icon: "🧩", title: "Outils IA isolés", desc: "Des chatbots séparés qui ne comprennent ni le contexte business, ni les règles de la plateforme, ni l'historique du fan." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card-glow p-5"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <div className="text-xl mb-3">{item.icon}</div>
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
      </RevealSection>

      <SectionDivider />

      <MarqueeStrip />

      {/* ─── 3. Solution / Features Grid ─── */}
      <RevealSection staggerMs={80}>
        <section className="py-20 section-alt-b">
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Un système complet, pas juste une boîte de dialogue IA.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              Huit piliers qui couvrent l&apos;ensemble du cycle de vie d&apos;un message, de la priorisation à l&apos;audit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="card-glow p-5"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                    {f.description}
                  </p>
                  <p className="text-[10px] font-medium" style={{ color: "rgb(16,185,129)" }}>
                    {f.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 4. Workflow ─── */}
      <RevealSection staggerMs={100}>
        <section
          id="workflow"
          className="py-20 section-alt-a"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              De la conversation au contrôle final.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              L&apos;IA prépare. L&apos;humain valide. Le créateur contrôle. Halo mesure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {workflowSteps.map((w) => (
                <div key={w.step} className="text-center p-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold transition-all duration-500"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      color: "rgb(16,185,129)",
                    }}
                  >
                    {w.step}
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {w.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {w.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {["Préparer", "Approuver", "Copier", "Bloquer", "Escalader"].map((label) => (
                <span
                  key={label}
                  className="text-[10px] font-medium px-3 py-1 transition-all duration-300 hover:border-[rgba(16,185,129,0.3)] hover:text-[rgb(16,185,129)]"
                  style={{
                    border: "1px solid var(--border-default)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-center text-[10px] mt-4" style={{ color: "var(--text-secondary)", opacity: 0.4 }}>
              Aucun bouton &quot;Envoyer automatiquement&quot; par défaut.
            </p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 5. PPV Copilot ─── */}
      <RevealSection staggerMs={80}>
        <section className="py-20 section-alt-b">
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Recommander le bon contenu, sans vendre deux fois la même chose.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              Le PPV Copilot analyse l&apos;historique du fan, votre catalogue et le marché pour suggérer le contenu le plus pertinent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { title: "Suggestion de prix", desc: "Prix recommandé basé sur l'historique d'achat du fan, les prix pratiqués et la valeur du contenu." },
                { title: "Vérification déjà vendu", desc: "Croisement automatique avec l'historique des ventes pour éviter les doublons." },
                { title: "Historique Vault complet", desc: "Visualisez tout votre catalogue PPV, les ventes passées et les contenus sous-exploités." },
                { title: "Détection fatigue risque", desc: "Identifier les fans approchés trop souvent ou trop récemment pour un PPV." },
                { title: "Période de cooldown", desc: "Respect d'un délai minimum entre deux recommandations au même fan, configurable par le créateur." },
                { title: "Estimation indicative", desc: "Projection de conversion basée sur des données historiques, présentée comme une estimation non garantie." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card-glow p-5"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] mt-8 px-4 py-2 mx-auto max-w-2xl" style={{ color: "var(--text-secondary)", opacity: 0.6, border: "1px solid var(--border-default)", background: "var(--bg-surface)" }}>
              Les recommandations PPV sont indicatives et ne garantissent aucun revenu. Les résultats dépendent du créateur, du fan et du contexte.
            </p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      <MarqueeStrip />

      {/* ─── 6. QA & Compliance ─── */}
      <RevealSection staggerMs={70}>
        <section
          className="py-20 section-alt-a"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Une IA utile seulement si elle reste contrôlable.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              Chaque brouillon est vérifié. Chaque action est tracée. Le créateur garde le dernier mot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "QA Review", desc: "Scan automatisé de chaque brouillon pour détecter les risques : ton inapproprié, promesses non autorisées, fans vulnérables." },
                { title: "Severity badges", desc: "Chaque item QA reçoit un score de sévérité (1-5). Les alertes critiques sont remontées en priorité." },
                { title: "Escalade & blocage", desc: "Un brouillon à risque peut être escaladé à un superviseur ou bloqué avant d'atteindre le fan." },
                { title: "Pause urgence", desc: "Possibilité de mettre en pause le module Chat AI en un clic. Toutes les générations s'arrêtent immédiatement." },
                { title: "Consent checklist", desc: "Checklist de 11 points que chaque créateur doit compléter avant d'activer le module. Traçable et auditée." },
                { title: "Audit logs complets", desc: "Qui a généré quoi, quand, avec quelle validation. Historique horodaté de chaque action." },
                { title: "Supervision admin", desc: "Les managers et admins ont une vue d'ensemble sur tous les créateurs, avec contrôles QA et conformité." },
                { title: "Module paused", desc: "État de pause visible dans l'interface admin. Permet de désactiver temporairement le module par créateur." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card-glow p-4"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] mt-8" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
              Halo aide à structurer les contrôles, mais les règles de chaque plateforme restent applicables.
            </p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 7. Comparison Table ─── */}
      <RevealSection>
        <section className="py-20 section-alt-b">
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Comparaison par catégories
            </h2>
            <p className="text-center text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
              Comment Halo se positionne face aux approches existantes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Critère
                    </th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Chat IA isolé
                    </th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Chatter freelance
                    </th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                      CRM classique
                    </th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: "rgb(16,185,129)" }}>
                      Halo Sovereign Chat AI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className="transition-colors duration-300"
                      style={{ borderBottom: "1px solid var(--border-default)" }}
                    >
                      <td className="py-3 px-4 text-left font-medium" style={{ color: "var(--text-primary)" }}>
                        {row.category}
                      </td>
                      <td className="py-3 px-4 text-center" style={{ color: "var(--text-secondary)" }}>
                        {row.chatAiIsolated}
                      </td>
                      <td className="py-3 px-4 text-center" style={{ color: "var(--text-secondary)" }}>
                        {row.chatterFreelance}
                      </td>
                      <td className="py-3 px-4 text-center" style={{ color: "var(--text-secondary)" }}>
                        {row.crmClassic}
                      </td>
                      <td className="py-3 px-4 text-center font-medium" style={{ color: "rgb(16,185,129)" }}>
                        {row.haloSovereign}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 8. For Whom ─── */}
      <RevealSection staggerMs={90}>
        <section
          className="py-20 section-alt-a"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Conçu pour chaque rôle de l&apos;écosystème créateur.
            </h2>
            <p className="text-center text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
              Du créateur indépendant à l&apos;agence qui manage des dizaines de comptes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="card-glow p-6"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "rgba(196,69,54,0.7)" }}>Problème :</span> {p.problem}
                  </p>
                  <p className="text-xs" style={{ color: "rgb(16,185,129)" }}>
                    {p.solution}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
              {profiles.slice(3).map((p, i) => (
                <div
                  key={i}
                  className="card-glow p-6"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "rgba(196,69,54,0.7)" }}>Problème :</span> {p.problem}
                  </p>
                  <p className="text-xs" style={{ color: "rgb(16,185,129)" }}>
                    {p.solution}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <TrackedLink
                href="/demo"
                eventName={ChatAITrackingEvents.LANDING_PROFILES_DEMO}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              >
                Voir une démo →
              </TrackedLink>
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 9. What Halo Does NOT Promise ─── */}
      <RevealSection staggerMs={80}>
        <section className="py-20 section-alt-b">
          <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Ce que nous ne promettons pas.
            </h2>
            <p className="text-center text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
              Nous préférons un produit contrôlable à des promesses irréalistes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {noPromiseItems.map((item, i) => (
                <div
                  key={i}
                  className="card-glow p-5"
                  style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}
                >
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 10. FAQ ─── */}
      <RevealSection staggerMs={60}>
        <section
          className="py-20 section-alt-a"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div className="mx-auto w-full max-w-3xl px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-center mb-8"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {faqItems.map((faq, i) => (
                <details
                  key={i}
                  className="card-glow p-4 group"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                >
                  <summary
                    className="text-sm font-medium cursor-pointer transition-colors duration-200"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.question}
                  </summary>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* ─── 11. Final CTA ─── */}
      <RevealSection>
        <section className="py-20 md:py-28 section-alt-b relative overflow-hidden">
          {/* Background glow for final CTA */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "600px",
              height: "400px",
              background:
                "radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center relative">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Construisez une équipe de chatting plus claire, plus traçable et mieux contrôlée.
            </h2>
            <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
              Halo Sovereign Chat AI est le copilote qui prépare, structure et sécurise vos conversations — sans jamais prendre
              le contrôle à votre place.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <TrackedLink
                href="/demo"
                eventName={ChatAITrackingEvents.LANDING_FINAL_DEMO}
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "var(--accent)",
                  color: "#1C1917",
                  boxShadow: "0 0 24px rgba(216,169,91,0.15)",
                }}
              >
                Demander une démo
              </TrackedLink>
              <TrackedLink
                href="/lex-ai"
                eventName={ChatAITrackingEvents.LANDING_FINAL_LEX}
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              >
                Explorer Halo Lex
              </TrackedLink>
            </div>
            <p className="text-[11px] mt-5" style={{ color: "var(--text-secondary)", opacity: 0.5 }}>
              Démo avec données exemples. Aucun revenu garanti.
            </p>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
