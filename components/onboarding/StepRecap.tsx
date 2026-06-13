"use client";

import { useRouter } from "next/navigation";
import type { OnboardingState } from "./types";
import { calcCompletion } from "./types";

export function StepRecap({
  state,
  onBack,
}: {
  state: OnboardingState;
  onBack: () => void;
}) {
  const router = useRouter();
  const pct = calcCompletion(state);

  const sections = [
    { key: "voice" as const, label: "Voix 🎙️", value: state.voice?.isCustom ? state.voice.customDescription : state.voice?.tone ?? ", " },
    { key: "style" as const, label: "Style 🎨", value: state.style ? `${state.style.styles.length} styles` : ", " },
    { key: "audience" as const, label: "Audience 👥", value: state.audience ? `${state.audience.gender ?? ", "} · ${state.audience.ageRange ?? ", "}` : ", " },
    { key: "platforms" as const, label: "Plateformes 📱", value: state.platforms ? `${state.platforms.platforms.length} plateforme${state.platforms.platforms.length > 1 ? "s" : ""}` : ", " },
    { key: "content" as const, label: "Contenu 📸", value: state.content ? `${state.content.types.length} format${state.content.types.length > 1 ? "s" : ""}` : ", " },
    { key: "taboos" as const, label: "Tabous 🚫", value: state.taboos ? `${state.taboos.tags.length + state.taboos.custom.length} limite${state.taboos.tags.length + state.taboos.custom.length > 1 ? "s" : ""}` : ", " },
    { key: "goals" as const, label: "Objectifs 🎯", value: state.goals?.goalType ? state.goals.goalType === "custom" ? "Personnalisé" : state.goals.goalType : ", " },
    { key: "examples" as const, label: "Exemples ✍️", value: state.examples ? `${state.examples.examples.length} exemple${state.examples.examples.length > 1 ? "s" : ""}` : ", " },
  ] as const;

  return (
    <div className="max-w-lg mx-auto">
      {/* Completion ring */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-3"
          style={{
            background: `conic-gradient(var(--accent) ${pct}%, var(--border-default) ${pct}%`,
            color: "var(--text-primary)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {pct}%
          </div>
        </div>
        <h2
          className="text-xl font-bold text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Votre ADN Créatif
        </h2>
        <p
          className="text-sm text-center mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Votre ADN est complet à {pct}%, vous pouvez toujours le modifier dans vos paramètres.
        </p>
      </div>

      {/* Section summary */}
      <div className="space-y-1.5 mb-8">
        {sections.map((s) => {
          const filled = state[s.key] !== null;
          return (
            <div
              key={s.key}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl"
              style={{
                backgroundColor: filled ? "var(--accent-soft)" : "var(--bg-card)",
                border: filled
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              <div>
                <span
                  className="text-xs font-medium"
                  style={{ color: filled ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {s.label}
                </span>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {typeof s.value === "string" ? s.value : ", "}
                </p>
              </div>
              {filled ? (
                <span className="text-xs" style={{ color: "var(--accent)" }}>✓</span>
              ) : (
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>, </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/studio")}
          className="w-full py-3 text-sm font-semibold rounded-xl"
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
          }}
        >
          Accéder à mon Studio
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 text-sm font-medium rounded-xl"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          Compléter plus tard
        </button>
      </div>
    </div>
  );
}
