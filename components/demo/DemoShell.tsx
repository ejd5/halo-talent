"use client";

import { useState, useCallback } from "react";
import { type PersonaId, type StepId, DEMO_STEPS, track } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { DemoStepNav } from "./DemoStepNav";
import { DemoPersonaSelector } from "./DemoPersonaSelector";
import { DemoStudioStep } from "./DemoStudioStep";
import { DemoRevenueInboxStep } from "./DemoRevenueInboxStep";
import { DemoAtlasStep } from "./DemoAtlasStep";
import { DemoProtectionStep } from "./DemoProtectionStep";
import { DemoFinalCTA } from "./DemoFinalCTA";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type DemoPhase = "intro" | "persona" | "steps" | "final";

export function DemoShell() {
  const locale = useLocale();
  const l = norm(locale);

  const [phase, setPhase] = useState<DemoPhase>("intro");
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const handleStart = useCallback(() => {
    track("demo_started");
    setPhase("persona");
  }, []);

  const handlePersonaConfirm = useCallback(() => {
    if (!selectedPersona) return;
    setPhase("steps");
  }, [selectedPersona]);

  const handleStepComplete = useCallback(() => {
    const step = DEMO_STEPS[currentStep - 1];
    if (!step) return;

    const newCompleted = new Set(completedSteps);
    newCompleted.add(step.id);
    setCompletedSteps(newCompleted);
    track("step_completed", { step: step.id, persona: selectedPersona || "" });

    if (currentStep >= DEMO_STEPS.length) {
      setPhase("final");
      track("demo_completed", { persona: selectedPersona || "" });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, completedSteps, selectedPersona]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSelectStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setSelectedPersona(null);
    setCurrentStep(1);
    setCompletedSteps(new Set());
  }, []);

  // ─── Intro Phase ───
  if (phase === "intro") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="max-w-lg mx-auto text-center space-y-6 animate-fade-in">
          <div className="text-center">
            <h1
              className="text-2xl md:text-3xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {t("demo_new.intro.title", l)}
            </h1>
            <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
              {t("demo_new.intro.subtitle", l)}
            </p>
          </div>

          <button
            onClick={handleStart}
            className="px-6 py-2.5 text-sm font-medium transition-all"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            {t("demo_new.intro.cta", l)}
          </button>

          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("demo_new.intro.disclaimer", l)}
          </p>
        </div>
      </div>
    );
  }

  // ─── Persona Phase ───
  if (phase === "persona") {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="max-w-2xl mx-auto pt-8">
          <DemoPersonaSelector
            selected={selectedPersona}
            onSelect={setSelectedPersona}
            onConfirm={handlePersonaConfirm}
          />
        </div>
      </div>
    );
  }

  // ─── Steps Phase ───
  const currentStepData = DEMO_STEPS[currentStep - 1];
  const canGoNext = completedSteps.has(currentStepData?.id) || false;
  const isFirstStep = currentStep === 1;

  const renderStepContent = () => {
    if (!currentStepData) return null;
    switch (currentStepData.id) {
      case "dna":
      case "studio":
        return <DemoStudioStep persona={selectedPersona!} />;
      case "inbox":
        return <DemoRevenueInboxStep persona={selectedPersona!} />;
      case "campaign":
      case "ppv":
      case "vault":
        return <DemoAtlasStep persona={selectedPersona!} />;
      case "protection":
      case "commission":
        return <DemoProtectionStep persona={selectedPersona!} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto pt-6">
        <DemoStepNav
          currentStep={currentStep}
          completedSteps={completedSteps}
          selectedPersona={selectedPersona}
          onSelectStep={handleSelectStep}
        />

        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto">
          {!isFirstStep ? (
            <button
              onClick={handlePreviousStep}
              className="text-xs transition-colors"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              {t("demo_new.nav.back", l)}
            </button>
          ) : <div />}

          <button
            onClick={() => {
              if (currentStep >= DEMO_STEPS.length) {
                setPhase("final");
                track("demo_completed", { persona: selectedPersona || "" });
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            className="px-4 py-1.5 text-xs transition-all"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            {t("demo_new.nav.next", l)}
          </button>
        </div>
      </div>
    </div>
  );
}
