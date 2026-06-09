"use client";

import { useState } from "react";
import { aiReports } from "../../../data";
import { relativeTime } from "../../../utils";
import { Brain, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";

type Props = { creatorId: string };

function scoreColor(score: number): string {
  if (score >= 80) return "#7A9A65";
  if (score >= 60) return "#C75B39";
  return "#C44536";
}

export function AIAnalysisTab({ creatorId }: Props) {
  const [generating, setGenerating] = useState(false);
  const reports = aiReports[creatorId] ?? [];

  const handleRegenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain size={32} strokeWidth={1.5} style={{ color: "#E0D8D0" }} className="mx-auto mb-3" />
        <p className="text-sm font-sans" style={{ color: "#E0D8D0" }}>
          Aucun rapport IA généré pour ce créateur.
        </p>
      </div>
    );
  }

  const latest = reports[0];

  return (
    <div className="space-y-6 card-accent">
      {/* Score + regenerate */}
      <div className="flex items-center justify-between p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center"
            style={{ border: `2px solid ${scoreColor(latest.performance_score)}` }}
          >
            <span className="font-display text-2xl font-bold" style={{ color: scoreColor(latest.performance_score) }}>
              {latest.performance_score}
            </span>
          </div>
          <div>
            <p className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
              Performance globale
            </p>
            <p className="text-[10px] font-sans mt-0.5" style={{ color: "#E0D8D0" }}>
              Généré {relativeTime(latest.generated_at)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
        >
          <RefreshCw size={12} strokeWidth={1.5} className={generating ? "animate-spin" : ""} />
          {generating ? "Génération..." : "Nouveau rapport"}
        </button>
      </div>

      {/* Trends */}
      <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={13} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
            Tendances
          </p>
        </div>
        <ul className="space-y-2">
          {latest.trends.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
              <TrendingUp size={11} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: t.includes("Hausse") || t.includes("Croissance") ? "#7A9A65" : "#E0D8D0" }} />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={13} strokeWidth={1.5} style={{ color: "#C75B39" }} />
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
            Suggestions stratégiques
          </p>
        </div>
        <ul className="space-y-2">
          {latest.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
              <span className="text-[10px] font-sans font-semibold shrink-0" style={{ color: "#C75B39" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={13} strokeWidth={1.5} style={{ color: "#C44536" }} />
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
            Risques détectés
          </p>
        </div>
        <ul className="space-y-2">
          {latest.risks.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
              <span className="text-[10px] font-sans font-semibold shrink-0" style={{ color: "#C44536" }}>
                !
              </span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
