"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import type { OnboardingState, OnboardingStep } from "./types";
import { STEP_ORDER, initialState, calcCompletion } from "./types";
import { StepIntro } from "./StepIntro";
import { StepVoice } from "./StepVoice";
import { StepStyle } from "./StepStyle";
import { StepAudience } from "./StepAudience";
import { StepPlatforms } from "./StepPlatforms";
import { StepContent } from "./StepContent";
import { StepTaboos } from "./StepTaboos";
import { StepGoals } from "./StepGoals";
import { StepExamples } from "./StepExamples";
import { StepRecap } from "./StepRecap";

/* ─── Direction for slide transition ─── */
type Dir = 1 | -1;

export function OnboardingContainer() {
  const [stepIndex, setStepIndex] = useState(0);
  const [dir, setDir] = useState<Dir>(1);
  const [state, setState] = useState<OnboardingState>(initialState);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);

  const step = STEP_ORDER[stepIndex]?.id ?? "intro";

  /* ─── Touch swipe handlers ─── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(dx) > 80) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [stepIndex, step, state],
  );

  /* ─── Navigation ─── */
  const goNext = useCallback(() => {
    if (animating || stepIndex >= STEP_ORDER.length - 1) return;
    setAnimating(true);
    setDir(1);
    setStepIndex((i) => i + 1);
    setTimeout(() => setAnimating(false), 300);
  }, [animating, stepIndex]);

  const goPrev = useCallback(() => {
    if (animating || stepIndex <= 0) return;
    setAnimating(true);
    setDir(-1);
    setStepIndex((i) => i - 1);
    setTimeout(() => setAnimating(false), 300);
  }, [animating, stepIndex]);

  const goToStep = useCallback(
    (id: OnboardingStep) => {
      const idx = STEP_ORDER.findIndex((s) => s.id === id);
      if (idx >= 0) {
        setAnimating(true);
        setDir(idx > stepIndex ? 1 : -1);
        setStepIndex(idx);
        setTimeout(() => setAnimating(false), 300);
      }
    },
    [stepIndex],
  );

  const skipSection = useCallback(() => {
    goNext();
  }, [goNext]);

  /* ─── Update state ─── */
  const updateSection = useCallback(
    (key: keyof OnboardingState, value: any) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /* ─── Keyboard nav ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (step === "recap") return;
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, step]);

  /* ─── Render current step ─── */
  const renderStep = () => {
    switch (step) {
      case "intro":
        return <StepIntro onStart={goNext} />;
      case "voice":
        return (
          <StepVoice
            value={state.voice}
            onChange={(v) => updateSection("voice", v)}
          />
        );
      case "style":
        return (
          <StepStyle
            value={state.style}
            onChange={(v) => updateSection("style", v)}
          />
        );
      case "audience":
        return (
          <StepAudience
            value={state.audience}
            onChange={(v) => updateSection("audience", v)}
          />
        );
      case "platforms":
        return (
          <StepPlatforms
            value={state.platforms}
            onChange={(v) => updateSection("platforms", v)}
          />
        );
      case "content":
        return (
          <StepContent
            value={state.content}
            onChange={(v) => updateSection("content", v)}
          />
        );
      case "taboos":
        return (
          <StepTaboos
            value={state.taboos}
            onChange={(v) => updateSection("taboos", v)}
          />
        );
      case "goals":
        return (
          <StepGoals
            value={state.goals}
            onChange={(v) => updateSection("goals", v)}
          />
        );
      case "examples":
        return (
          <StepExamples
            value={state.examples}
            onChange={(v) => updateSection("examples", v)}
          />
        );
      case "recap":
        return <StepRecap state={state} onBack={() => goToStep("examples")} />;
      default:
        return null;
    }
  };

  const isContentStep = step !== "intro" && step !== "recap";
  const sectionNum = STEP_ORDER[stepIndex]?.number;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ═══ Progress bar (hidden on intro & recap) ═══ */}
      {isContentStep && (
        <div
          className="sticky top-0 z-40"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
            {/* Progress segments */}
            <div className="flex gap-1 mb-2">
              {STEP_ORDER.filter((s) => s.number > 0 && s.number <= 8).map((s, i) => {
                const isComplete = stepIndex > i + 1; // +1 because intro is at index 0
                const isCurrent = stepIndex === i + 1;
                return (
                  <div
                    key={s.id}
                    className="flex-1 h-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: isCurrent
                        ? "var(--accent)"
                        : isComplete
                          ? "var(--accent-soft)"
                          : "var(--border-default)",
                      opacity: isCurrent ? 1 : isComplete ? 0.6 : 0.4,
                    }}
                  />
                );
              })}
            </div>

            {/* Step label + skip */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-tertiary)" }}
              >
                {sectionNum}/8 · {STEP_ORDER[stepIndex]?.label}
              </span>
              <button
                onClick={skipSection}
                className="flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <SkipForward size={12} />
                Passer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Content area with slide transition ═══ */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full flex-shrink-0 flex flex-col justify-center px-4 py-8 overflow-y-auto"
          style={{
            transform: `translateX(${dir * 0}%)`,
            opacity: 1,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        >
          {renderStep()}
        </div>
      </div>

      {/* ═══ Bottom navigation (hidden on intro, recap) ═══ */}
      {isContentStep && (
        <div
          className="sticky bottom-0 z-40"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={goPrev}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-opacity"
              style={{
                color: "var(--text-secondary)",
                opacity: stepIndex > 1 ? 1 : 0.3,
              }}
              disabled={stepIndex <= 1}
            >
              <ChevronLeft size={16} />
              Retour
            </button>

            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold rounded-xl"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
              }}
            >
              {sectionNum === 8 ? "Voir mon ADN" : "Continuer"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
