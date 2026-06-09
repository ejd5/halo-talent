"use client";

import {
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

type Props = {
  title: string;
  type: "top-creators" | "at-risk" | "deadlines" | "ai-suggestions";
};

const creators = [
  { name: "Clara W.", revenue: "12 400 €", platform: "YouTube" },
  { name: "Marc T.", revenue: "9 800 €", platform: "Instagram" },
  { name: "Léa R.", revenue: "8 200 €", platform: "TikTok" },
  { name: "Inès D.", revenue: "7 900 €", platform: "OnlyFans" },
  { name: "Hugo P.", revenue: "6 500 €", platform: "YouTube" },
];

const atRisk = [
  { name: "Alex M.", drop: "-23%", reason: "Baisse d'engagement Instagram" },
  { name: "Sarah K.", drop: "-15%", reason: "Candidature non finalisée" },
  { name: "Emma V.", drop: "-12%", reason: "Contrat arrive à terme" },
];

const deadlines = [
  { label: "Renouvellement contrat", creator: "Emma V.", date: "14 juin 2026" },
  { label: "Paiement à valider", creator: "Alex M.", date: "16 juin 2026" },
  { label: "Revue trimestrielle", creator: "Tous les créateurs", date: "30 juin 2026" },
];

const suggestions = [
  "Relancer Sarah K. — sa candidature est en attente depuis 6 jours.",
  "Le taux d'engagement de Marc T. est en hausse de 18% ce mois. Envisager une augmentation de commission ?",
  "Le contrat d'Emma V. expire dans 14 jours. Planifier un entretien de renouvellement.",
  "Les revenus OnlyFans sont en hausse de 34% ce trimestre. Envisager un recrutement spécialisé.",
];

export function InsightsWidget({ title, type }: Props) {
  const iconMap = {
    "top-creators": TrendingUp,
    "at-risk": AlertTriangle,
    deadlines: CalendarClock,
    "ai-suggestions": Lightbulb,
  };

  const colorMap = {
    "top-creators": "#7A9A65",
    "at-risk": "#C44536",
    deadlines: "#C75B39",
    "ai-suggestions": "#F5F0EB",
  };

  const Icon = iconMap[type];
  const color = colorMap[type];

  return (
    <div
      className="flex flex-col card-accent"
      style={{
        background: "#1A1614",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: `${color}15` }}
          >
            <Icon size={14} strokeWidth={1.5} style={{ color }} />
          </div>
          <h3
            className="font-display text-sm font-bold"
            style={{ color: "#F5F0EB" }}
          >
            {title}
          </h3>
        </div>
        {type !== "ai-suggestions" && (
          <button
            className="flex items-center gap-1 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-70"
            style={{ color: "#F5F0EB" }}
          >
            Voir tout <ArrowUpRight size={12} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {type === "top-creators" && (
          <div className="space-y-3">
            {creators.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-sans font-semibold w-4"
                    style={{ color: "#E0D8D0" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className="text-[13px] font-sans font-medium"
                      style={{ color: "#D0CCC6" }}
                    >
                      {c.name}
                    </p>
                    <p
                      className="text-[10px] font-sans"
                      style={{ color: "#E0D8D0" }}
                    >
                      {c.platform}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-display font-bold"
                  style={{ color: "#C75B39" }}
                >
                  {c.revenue}
                </span>
              </div>
            ))}
          </div>
        )}

        {type === "at-risk" && (
          <div className="space-y-3">
            {atRisk.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between">
                  <p
                    className="text-[13px] font-sans font-medium"
                    style={{ color: "#D0CCC6" }}
                  >
                    {c.name}
                  </p>
                  <span
                    className="text-[11px] font-sans font-semibold"
                    style={{ color: "#C44536" }}
                  >
                    {c.drop}
                  </span>
                </div>
                <p
                  className="text-[11px] font-sans mt-0.5"
                  style={{ color: "#E0D8D0" }}
                >
                  {c.reason}
                </p>
              </div>
            ))}
          </div>
        )}

        {type === "deadlines" && (
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.label + d.creator}>
                <div className="flex items-center justify-between">
                  <p
                    className="text-[13px] font-sans font-medium"
                    style={{ color: "#D0CCC6" }}
                  >
                    {d.label}
                  </p>
                  <span
                    className="text-[10px] font-sans"
                    style={{ color: "#C75B39" }}
                  >
                    {d.date}
                  </span>
                </div>
                <p
                  className="text-[11px] font-sans mt-0.5"
                  style={{ color: "#E0D8D0" }}
                >
                  {d.creator}
                </p>
              </div>
            ))}
          </div>
        )}

        {type === "ai-suggestions" && (
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex gap-2.5">
                <span
                  className="text-[10px] font-sans font-semibold mt-0.5 shrink-0"
                  style={{ color: "#E0D8D0" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[12px] font-sans leading-relaxed"
                  style={{ color: "#E0D8D0" }}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
