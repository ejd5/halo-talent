"use client";

import { type StepId, DEMO_STEPS, type PersonaId } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function DemoStepNav({
  currentStep,
  completedSteps,
  selectedPersona,
  onSelectStep,
}: {
  currentStep: number;
  completedSteps: Set<StepId>;
  selectedPersona: PersonaId | null;
  onSelectStep: (step: number) => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  const isStepUnlocked = (index: number) => {
    if (index === 0) return true;
    if (index === 1 && selectedPersona) return true;
    const prevStep = DEMO_STEPS[index - 2];
    if (!prevStep) return false;
    return completedSteps.has(prevStep.id);
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between gap-1 md:gap-2">
        {DEMO_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const unlocked = isStepUnlocked(idx + 1);
          const completed = completedSteps.has(step.id);
          const active = currentStep === stepNum;

          return (
            <button
              key={step.id}
              onClick={() => unlocked && onSelectStep(stepNum)}
              disabled={!unlocked}
              className="flex items-center gap-1 md:gap-2 px-1 py-1 transition-all"
              style={{ opacity: unlocked ? 1 : 0.3, cursor: unlocked ? "pointer" : "not-allowed" }}
              title={t(step.titleKey, l)}
            >
              {/* Circle indicator */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 transition-colors"
                style={{
                  backgroundColor: completed ? "var(--success)" : active ? "var(--accent)" : "rgba(255,255,255,0.06)",
                  color: completed || active ? "var(--text-primary)" : "rgba(255,255,255,0.3)",
                }}
              >
                {completed ? "✓" : stepNum}
              </div>
              {/* Label (hidden on mobile) */}
              <span className="hidden md:block text-[9px] truncate max-w-[60px]" style={{ color: active ? "var(--accent)" : "rgba(255,255,255,0.5)" }}>
                {t(step.titleKey, l)}
              </span>
            </button>
          );
        })}
      </div>
      {/* Step counter + current title */}
      <div className="text-center mt-2">
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("demo_new.step.count", l).replace("{n}", String(currentStep))}
          {" — "}
          <span style={{ color: "rgba(255,255,255,0.6)" }}>
            {currentStep >= 1 && currentStep <= DEMO_STEPS.length
              ? t(DEMO_STEPS[currentStep - 1].titleKey, l)
              : ""}
          </span>
        </span>
      </div>
    </div>
  );
}
