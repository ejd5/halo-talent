"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { StepAccueil } from "@/components/bouclier-legal/StepAccueil";
import { StepPlateformes } from "@/components/bouclier-legal/StepPlateformes";
import { StepClauses } from "@/components/bouclier-legal/StepClauses";
import { StepResultat } from "@/components/bouclier-legal/StepResultat";
import { calculateRisk } from "@/lib/bouclier-legal/scoring";
import type { WizardStep, AnalysisReport } from "@/lib/bouclier-legal/types";

const STEP_LABELS: Record<WizardStep, string> = {
  welcome: "Accueil",
  platforms: "Plateformes",
  clauses: "Clauses",
  result: "Résultat",
};

const STEP_ORDER: WizardStep[] = ["welcome", "platforms", "clauses", "result"];

function getStepIndex(step: WizardStep): number {
  return STEP_ORDER.indexOf(step);
}

export default function ProtectionPage() {
  const [step, setStep] = useState<WizardStep>("welcome");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const goTo = useCallback((s: WizardStep) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePlatformsNext = useCallback((p: string[]) => {
    setPlatforms(p);
    goTo("clauses");
  }, [goTo]);

  const handleClausesNext = useCallback((clauseIds: string[]) => {
    setAnalyzing(true);
    // Calculate locally (no API call — fully client-side)
    setTimeout(() => {
      const result = calculateRisk(clauseIds, platforms);
      setReport(result);
      setAnalyzing(false);
      goTo("result");
    }, 600); // simulate brief analysis
  }, [platforms, goTo]);

  const handleNewAnalysis = useCallback(() => {
    setPlatforms([]);
    setReport(null);
    goTo("welcome");
  }, [goTo]);

  // Total steps count for progress bar (exclude result from progress)
  const currentIdx = getStepIndex(step);
  const progressMax = 3; // welcome=0, platforms=1, clauses=2
  const progressPercent = step === "result"
    ? 100
    : (currentIdx / progressMax) * 100;

  return (
    // Emerald accent scope
    <div
      style={{
        "--bl-accent": "var(--color-accent)",
        "--bl-accent-soft": "var(--color-accent-soft)",
      } as React.CSSProperties}
    >
      {/* Top bar (always visible) */}
      <div
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", borderBottom: "1px solid rgba(199,91,57,0.15)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            {/* Left: back arrow (only on sub-steps) */}
            <div className="w-20">
              {step !== "welcome" && step !== "result" && (
                <button
                  onClick={() => {
                    if (step === "clauses") goTo("platforms");
                    else if (step === "platforms") goTo("welcome");
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ChevronLeft size={16} />
                  Retour
                </button>
              )}
            </div>

            {/* Center: shield + step label */}
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} style={{ color: "var(--accent)" }} />
              <span className="text-base font-bold tracking-tight" style={{ color: "var(--accent)" }}>
                Bouclier Légal
              </span>
            </div>

            {/* Right: step indicator */}
            <div className="w-20 text-right">
              {step !== "welcome" && step !== "result" && (
                <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {currentIdx}/{progressMax}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {step !== "welcome" && (
            <div className="h-1 overflow-hidden" style={{ backgroundColor: "var(--border-default)" }}>
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: "var(--color-accent)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div
        className="min-h-[calc(100vh-4rem)]"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {step === "welcome" && <StepAccueil onStart={() => goTo("platforms")} />}
          {step === "platforms" && <StepPlateformes onNext={handlePlatformsNext} />}
          {step === "clauses" && (
            <>
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-accent-soft)" }}
                  >
                    <div
                      className="w-6 h-6 animate-spin"
                      style={{
                        border: "2px solid rgba(199,91,57,0.2)",
                        borderTopColor: "var(--color-accent)",
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Analyse de votre contrat en cours...
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                    Quelques instants
                  </p>
                </div>
              ) : (
                <StepClauses onNext={handleClausesNext} />
              )}
            </>
          )}
          {step === "result" && report && (
            <StepResultat report={report} onNewAnalysis={handleNewAnalysis} />
          )}
        </div>
      </div>
    </div>
  );
}
