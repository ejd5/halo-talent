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
  title: "CHATEENG, Where Talent Forms",
  description:
    "Une IA de conversation pensée pour le contrôle, pas pour l'abandon. L'IA prépare, l'humain valide, le créateur contrôle. Brouillons, audit logs, conformité.",
  openGraph: {
    title: "CHATEENG, Copilote de conversation, Where Talent Forms",
    description:
      "Préparez des réponses, priorisez les conversations, contrôlez les risques. Validation humaine obligatoire avant chaque envoi.",
  },
};

const PROBLEM_ITEMS = [
  { icon: "💬", title: "Messages dispersés", desc: "Les conversations arrivent de partout. Impossible d'avoir une vue d'ensemble ni de prioriser." },
  { icon: "👥", title: "Chatters difficiles à contrôler", desc: "Chaque membre de l'équipe a son style. La qualité et la conformité varient sans standards clairs." },
  { icon: "🔄", title: "PPV envoyés en doublon", desc: "Sans historique centralisé, un même contenu est proposé plusieurs fois au même fan." },
  { icon: "⭐", title: "Fans importants mal priorisés", desc: "Les fans à fort potentiel se noient dans le volume. Aucun système ne les remonte automatiquement." },
  { icon: "⚠️", title: "Risques compliance peu documentés", desc: "Pas de trace de qui a dit quoi, quand, et avec quelle validation. En cas de litige, rien n'est traçable." },
  { icon: "🧩", title: "Outils IA isolés", desc: "Des chatbots séparés qui ne comprennent ni le contexte business, ni les règles de la plateforme, ni l'historique du fan." },
];

const PPV_ITEMS = [
  { title: "Suggestion de prix", desc: "Prix recommandé basé sur l'historique d'achat du fan, les prix pratiqués et la valeur du contenu." },
  { title: "Vérification déjà vendu", desc: "Croisement automatique avec l'historique des ventes pour éviter les doublons." },
  { title: "Historique Vault complet", desc: "Visualisez tout votre catalogue PPV, les ventes passées et les contenus sous-exploités." },
  { title: "Détection fatigue risque", desc: "Identifier les fans approchés trop souvent ou trop récemment pour un PPV." },
  { title: "Période de cooldown", desc: "Respect d'un délai minimum entre deux recommandations au même fan, configurable par le créateur." },
  { title: "Estimation indicative", desc: "Projection de conversion basée sur des données historiques, présentée comme une estimation non garantie." },
];

const QA_ITEMS = [
  { title: "QA Review", desc: "Scan automatisé de chaque brouillon pour détecter les risques : ton inapproprié, promesses non autorisées, fans vulnérables." },
  { title: "Severity badges", desc: "Chaque item QA reçoit un score de sévérité (1-5). Les alertes critiques sont remontées en priorité." },
  { title: "Escalade & blocage", desc: "Un brouillon à risque peut être escaladé à un superviseur ou bloqué avant d'atteindre le fan." },
  { title: "Pause urgence", desc: "Possibilité de mettre en pause le module CHATEENG en un clic. Toutes les générations s'arrêtent immédiatement." },
  { title: "Consent checklist", desc: "Checklist de 11 points que chaque créateur doit compléter avant d'activer le module. Traçable et auditée." },
  { title: "Audit logs complets", desc: "Qui a généré quoi, quand, avec quelle validation. Historique horodaté de chaque action." },
  { title: "Supervision admin", desc: "Les managers et admins ont une vue d'ensemble sur tous les créateurs, avec contrôles QA et conformité." },
  { title: "Module paused", desc: "État de pause visible dans l'interface admin. Permet de désactiver temporairement le module par créateur." },
];

export default function ChatAIPage() {
  return (
    <main>
      <PageLoader />
      <ChatAIHero />
      <MarqueeStrip />

      {/* Problem */}
      <RevealSection staggerMs={80}>
        <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Le chatting créateur est devenu trop fragmenté.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>Des messages dispersés, des outils qui ne communiquent pas, des risques mal documentés.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROBLEM_ITEMS.map((item, i) => (
                <div key={i} className="p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="text-xl mb-3">{item.icon}</div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />
      <MarqueeStrip />

      {/* Features Grid */}
      <RevealSection staggerMs={80}>
        <section className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--encre)" }}>Un système complet, pas juste une boîte de dialogue IA.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Huit piliers qui couvrent l'ensemble du cycle de vie d'un message, de la priorisation à l'audit.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-5" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }}>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{f.title}</h3>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{f.description}</p>
                  <p className="text-[11px] font-medium" style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}>{f.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* Workflow */}
      <RevealSection staggerMs={100}>
        <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>De la conversation au contrôle final.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>L'IA prépare. L'humain valide. Le créateur contrôle. WTF mesure.</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {workflowSteps.map((w) => (
                <div key={w.step} className="text-center p-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold" style={{ background: "rgba(216,169,91,0.12)", color: "var(--or)" }}>{w.step}</div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{w.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{w.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] mt-8" style={{ color: "var(--pierre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>Aucun bouton "Envoyer automatiquement" par défaut.</p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* PPV Copilot */}
      <RevealSection staggerMs={80}>
        <section className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--encre)" }}>Recommander le bon contenu, sans vendre deux fois la même chose.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Le PPV Copilot analyse l'historique du fan, votre catalogue et le marché pour suggérer le contenu le plus pertinent.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {PPV_ITEMS.map((item, i) => (
                <div key={i} className="p-5" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }}>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] mt-8 px-4 py-2 mx-auto max-w-2xl" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif", border: "1px solid rgba(12,10,8,0.08)", background: "rgba(12,10,8,0.02)" }}>
              Les recommandations PPV sont indicatives et ne garantissent aucun revenu. Les résultats dépendent du créateur, du fan et du contexte.
            </p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />
      <MarqueeStrip />

      {/* QA & Compliance */}
      <RevealSection staggerMs={70}>
        <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Une IA utile seulement si elle reste contrôlable.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>Chaque brouillon est vérifié. Chaque action est tracée. Le créateur garde le dernier mot.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {QA_ITEMS.map((item, i) => (
                <div key={i} className="p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <h3 className="text-[14px] font-semibold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] mt-8" style={{ color: "var(--pierre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>WTF aide à structurer les contrôles, mais les règles de chaque plateforme restent applicables.</p>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* Comparison Table */}
      <RevealSection>
        <section className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco" style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--encre)" }}>Comparaison par catégories</h2>
            <p className="text-center text-[14px] mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Comment WTF se positionne face aux approches existantes.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--or)" }}>
                    <th className="text-left py-3 px-4 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Critère</th>
                    <th className="text-center py-3 px-4 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>CHATEENG isolé</th>
                    <th className="text-center py-3 px-4 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>Chatter freelance</th>
                    <th className="text-center py-3 px-4 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>CRM classique</th>
                    <th className="text-center py-3 px-4 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>WTF CHATEENG</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(12,10,8,0.06)", background: i % 2 === 0 ? "white" : "transparent" }}>
                      <td className="py-3 px-4 text-left text-[13px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{row.category}</td>
                      <td className="py-3 px-4 text-center text-[13px]" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>{row.chatAiIsolated}</td>
                      <td className="py-3 px-4 text-center text-[13px]" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>{row.chatterFreelance}</td>
                      <td className="py-3 px-4 text-center text-[13px]" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>{row.crmClassic}</td>
                      <td className="py-3 px-4 text-center text-[13px] font-medium" style={{ color: "#5A7D4A", fontFamily: "var(--font-body), sans-serif" }}>{row.haloSovereign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* Profiles */}
      <RevealSection staggerMs={90}>
        <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--ivoire)" }}>Conçu pour chaque rôle de l'écosystème créateur.</h2>
            <p className="text-center text-[14px] mb-12" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>Du créateur indépendant à l'agence qui manage des dizaines de comptes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {profiles.map((p, i) => (
                <div key={i} className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <h3 className="text-[1rem] font-semibold mb-3" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{p.title}</h3>
                  <p className="text-[13px] mb-3" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}><span style={{ color: "#C44536" }}>Problème :</span> {p.problem}</p>
                  <p className="text-[13px]" style={{ color: "#5A7D4A", fontFamily: "var(--font-body), sans-serif" }}>{p.solution}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <TrackedLink href="/demo" eventName={ChatAITrackingEvents.LANDING_PROFILES_DEMO} className="inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: "var(--or)", fontFamily: "var(--font-body), sans-serif" }}>
                Voir une démo →
              </TrackedLink>
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* No Promise */}
      <RevealSection staggerMs={80}>
        <section className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco">
            <h2 className="display-medium text-center mb-4" style={{ color: "var(--encre)" }}>Ce que nous ne promettons pas.</h2>
            <p className="text-center text-[14px] mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Nous préférons un produit contrôlable à des promesses irréalistes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {noPromiseItems.map((item, i) => (
                <div key={i} className="p-5" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }}>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{item.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* FAQ */}
      <RevealSection staggerMs={60}>
        <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
          <div className="wrap-eco" style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 className="display-medium text-center mb-8" style={{ color: "var(--ivoire)" }}>Questions fréquentes</h2>
            <div className="space-y-2">
              {faqItems.map((faq, i) => (
                <details key={i} className="p-4" style={{ border: "1px solid rgba(244,238,227,0.08)", background: "rgba(244,238,227,0.02)" }}>
                  <summary className="text-[15px] font-medium cursor-pointer" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{faq.question}</summary>
                  <p className="text-[14px] mt-2 leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <SectionDivider />

      {/* Final CTA */}
      <RevealSection>
        <section className="couture-section relative text-center" style={{ backgroundColor: "var(--creme)", paddingTop: 100, paddingBottom: 100 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 600, height: 400, background: "radial-gradient(ellipse at center, rgba(216,169,91,0.06) 0%, transparent 70%)" }} aria-hidden="true" />
          <div className="wrap-eco relative" style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 className="display-medium mb-4" style={{ color: "var(--encre)" }}>Construisez une équipe de chatting plus claire, plus traçable et mieux contrôlée.</h2>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>WTF CHATEENG est le copilote qui prépare, structure et sécurise vos conversations, sans jamais prendre le contrôle à votre place.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <TrackedLink href="/demo" eventName={ChatAITrackingEvents.LANDING_FINAL_DEMO} className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
                Demander une démo
              </TrackedLink>
              <TrackedLink href="/saas" eventName={ChatAITrackingEvents.LANDING_FINAL_LEX} className="btn-eco" style={{ borderColor: "var(--or)", color: "var(--encre)" }}>
                Explorer la suite
              </TrackedLink>
            </div>
            <p className="text-[11px] mt-5" style={{ color: "var(--encre)", opacity: 0.35, fontFamily: "var(--font-body), sans-serif" }}>Démo avec données exemples. Aucun revenu garanti.</p>
          </div>
        </section>
      </RevealSection>
    </main>
  );
}
