"use client";

import { useState } from "react";
import type { Application } from "../../types";
import { Brain, RefreshCw, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

type Props = { application: Application };

const criteriaLabels: Record<string, string> = {
  coherence: "Cohérence du parcours",
  potential: "Potentiel de croissance",
  communication: "Qualité de communication",
  alignment: "Alignement valeurs",
  feasibility: "Faisabilité accompagnement",
};

function scoreColor(score: number): string {
  if (score >= 80) return "#7A9A65";
  if (score >= 60) return "#C75B39";
  if (score >= 40) return "#9A9590";
  return "#C44536";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "À examiner";
  return "Doutes";
}

function recIcon(rec: string) {
  switch (rec) {
    case "approve":
      return <ThumbsUp size={14} strokeWidth={1.5} style={{ color: "#7A9A65" }} />;
    case "reject":
      return <ThumbsDown size={14} strokeWidth={1.5} style={{ color: "#C44536" }} />;
    default:
      return <Minus size={14} strokeWidth={1.5} style={{ color: "#C75B39" }} />;
  }
}

export function AIScoreTab({ application }: Props) {
  const [regenerating, setRegenerating] = useState(false);
  const analysis = application.ai_analysis;

  const handleRegenerate = async () => {
    setRegenerating(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    setRegenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Score total */}
      {analysis && (
        <div className="text-center py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div
            className="w-20 h-20 flex items-center justify-center mx-auto mb-2"
            style={{
              border: `3px solid ${scoreColor(analysis.score_total)}`,
            }}
          >
            <span
              className="font-display text-[36px] font-bold"
              style={{ color: scoreColor(analysis.score_total) }}
            >
              {analysis.score_total}
            </span>
          </div>
          <p
            className="text-xs font-sans font-semibold uppercase tracking-[0.1em]"
            style={{ color: scoreColor(analysis.score_total) }}
          >
            {scoreLabel(analysis.score_total)}
          </p>
        </div>
      )}

      {/* Scores détaillés */}
      {analysis && (
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#7A736B" }}>
            Scores détaillés
          </p>
          <div className="space-y-2.5">
            {Object.entries(analysis.scores).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                    {criteriaLabels[key] ?? key}
                  </span>
                  <span
                    className="text-[11px] font-sans font-semibold"
                    style={{ color: scoreColor(value * 5) }}
                  >
                    {value}/20
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-none overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-none transition-all"
                    style={{
                      width: `${(value / 20) * 100}%`,
                      background: scoreColor(value * 5),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandation */}
      {analysis && (
        <div className="flex items-center gap-2 p-3" style={{ background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${analysis.recommendation === "approve" ? "#7A9A65" : analysis.recommendation === "reject" ? "#C44536" : "#C75B39"}` }}>
          {recIcon(analysis.recommendation)}
          <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
            Recommandation : <strong style={{ color: "#F5F0EB" }}>
              {analysis.recommendation === "approve" ? "Approuver" : analysis.recommendation === "reject" ? "Refuser" : "Examiner"}
            </strong>
          </span>
        </div>
      )}

      {/* Reasoning */}
      {analysis && (
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "#7A736B" }}>
            Analyse
          </p>
          <p className="text-sm font-sans leading-relaxed" style={{ color: "#9A9590" }}>
            {analysis.reasoning}
          </p>
        </div>
      )}

      {/* Forces */}
      {analysis && analysis.strengths.length > 0 && (
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "#7A9A65" }}>
            Forces
          </p>
          <ul className="space-y-1.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
                <span style={{ color: "#7A9A65" }}>+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Faiblesses */}
      {analysis && analysis.weaknesses.length > 0 && (
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "#C44536" }}>
            Points d'attention
          </p>
          <ul className="space-y-1.5">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
                <span style={{ color: "#C44536" }}>−</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Regenerate */}
      <button
        onClick={handleRegenerate}
        disabled={regenerating}
        className="flex items-center gap-2 w-full justify-center py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5 disabled:opacity-50"
        style={{ color: "#7A736B", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <RefreshCw
          size={14}
          strokeWidth={1.5}
          className={regenerating ? "animate-spin" : ""}
        />
        {regenerating ? "Régénération en cours..." : "Régénérer l'analyse"}
      </button>
    </div>
  );
}
