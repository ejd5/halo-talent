"use client";

import { useState } from "react";
import type { GoalsSection, GoalType } from "./types";
import { GOAL_OPTIONS } from "./types";

export function StepGoals({
  value,
  onChange,
}: {
  value: GoalsSection | null;
  onChange: (v: GoalsSection) => void;
}) {
  const data = value ?? { goalType: null, customText: "", targetValue: "" };
  const [customText, setCustomText] = useState(data.customText);

  const handleSelect = (id: GoalType) => {
    if (id === "custom") {
      onChange({ goalType: id, customText, targetValue: "" });
    } else {
      onChange({ goalType: id, customText: "", targetValue: data.targetValue });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">🎯</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Quel est votre objectif principal&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Pour les 3 prochains mois
      </p>

      {/* Goal cards */}
      <div className="space-y-2 mb-5">
        {GOAL_OPTIONS.map((opt) => {
          const sel = data.goalType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl text-left transition-all"
              style={{
                backgroundColor: sel ? "var(--accent-soft)" : "var(--bg-card)",
                border: sel
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border-default)",
              }}
            >
              <span className="text-xl">{opt.emoji}</span>
              <div className="flex-1">
                <span
                  className="text-sm font-medium block"
                  style={{ color: sel ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {opt.label}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {opt.hint}
                </span>
              </div>
              {sel && (
                <span style={{ color: "var(--accent)" }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Target value for non-custom */}
      {data.goalType && data.goalType !== "custom" && (
        <div className="mb-4">
          <label
            className="text-xs font-medium block mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Précisez votre objectif (optionnel)
          </label>
          <input
            value={data.targetValue ?? ""}
            onChange={(e) => onChange({ ...data, targetValue: e.target.value })}
            placeholder={
              data.goalType === "revenue"
                ? "Ex: +30% de revenus"
                : data.goalType === "followers"
                  ? "Ex: 10 000 nouveaux abonnés"
                  : "Ex: Détaillez votre objectif"
            }
            className="w-full px-3 py-2 text-sm rounded-xl outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          />
        </div>
      )}

      {/* Custom goal text */}
      {data.goalType === "custom" && (
        <div>
          <label
            className="text-xs font-medium block mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Décrivez votre objectif
          </label>
          <textarea
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              onChange({ ...data, customText: e.target.value });
            }}
            placeholder="Ex: Lancer ma propre newsletter et atteindre 5 000 abonnés d'ici septembre..."
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-xl outline-none resize-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      )}
    </div>
  );
}
