"use client";

import { X, TrendingUp, Clock, AlertTriangle, Lightbulb } from "lucide-react";

const INSIGHTS = [
  {
    type: "best_time",
    icon: <Clock size={14} />,
    title: "Meilleurs créneaux",
    items: [
      "Instagram : lun-mer 18h-20h",
      "TikTok : jeu-dim 15h-17h",
      "YouTube : sam-dim 10h-12h",
      "OnlyFans : ven 21h-23h",
    ],
  },
  {
    type: "trend",
    icon: <TrendingUp size={14} />,
    title: "Tendances",
    items: [
      "Le contenu Reel génère +45% d'engagement",
      "Les vidéos >5min performent mieux le weekend",
      "Le hashtag #exclusif est en hausse +120%",
    ],
  },
  {
    type: "warning",
    icon: <AlertTriangle size={14} />,
    title: "Alertes",
    items: [
      "Clara W. n'a pas de contenu programmé cette semaine",
      "Inès D. a 3 posts en attente de relecture",
      "Le compte Twitter de Marc T. est inactif depuis 2 semaines",
    ],
  },
  {
    type: "suggestion",
    icon: <Lightbulb size={14} />,
    title: "Suggestions IA",
    items: [
      "Publier le reel de Léa R. en même temps que le nouveau single",
      "Augmenter la fréquence LinkedIn pour Hugo P. à 2x/semaine",
      "Planifier un live Instagram pour la sortie collection Inès D.",
    ],
  },
];

export function InsightsSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 z-50 h-full w-[380px] border-l border-[var(--color-border)] overflow-y-auto"
        style={{ backgroundColor: "var(--color-base)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Lightbulb size={14} className="text-[var(--color-accent)]" />
            Insights
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)] transition-colors rounded-[0px]">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {INSIGHTS.map((section) => (
            <div key={section.type}>
              <div className="flex items-center gap-2 mb-2">
                <span className="opacity-50">{section.icon}</span>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider opacity-60">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-[12px] leading-relaxed opacity-70 pl-5 border-l border-[var(--color-border)] py-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Summary card */}
          <div className="p-3 border border-[var(--color-border)]">
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1">
              Score de couverture
            </div>
            <div className="text-2xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              B+
            </div>
            <div className="text-[11px] opacity-50 mt-1">
              Bonne couverture sur les 14 prochains jours. 3 créneaux à optimiser.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
