"use client";

import { useState } from "react";
import type { VoiceSection, VoiceTone } from "./types";
import { VOICE_TONE_OPTIONS } from "./types";

export function StepVoice({
  value,
  onChange,
}: {
  value: VoiceSection | null;
  onChange: (v: VoiceSection) => void;
}) {
  const [customText, setCustomText] = useState(value?.customDescription ?? "");

  const handleSelect = (tone: VoiceTone) => {
    onChange({ tone, customDescription: "", isCustom: false });
  };

  const handleCustom = () => {
    onChange({ tone: "chaleureuse", customDescription: customText, isCustom: true });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-2 text-4xl">🎙️</div>
      <h2
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Comment parlez-vous à votre audience&nbsp;?
      </h2>
      <p
        className="text-sm text-center mb-6"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
      >
        Choisissez le ton qui vous correspond le mieux
      </p>

      {/* Visual cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {VOICE_TONE_OPTIONS.map((opt) => {
          const selected = !value?.isCustom && value?.tone === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
              style={{
                backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-card)",
                border: selected
                  ? "2px solid var(--accent)"
                  : "1px solid var(--border-default)",
                color: selected ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-medium">{opt.label}</span>
              {selected && (
                <span className="ml-auto text-accent">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-default)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
          OU
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-default)" }} />
      </div>

      {/* Free text */}
      <div>
        <label
          className="text-xs font-medium block mb-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          Décrivez votre ton en quelques mots
        </label>
        <textarea
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            if (e.target.value.trim()) handleCustom();
          }}
          placeholder="Chaleureux mais direct, avec une pointe d'humour..."
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-xl outline-none resize-none"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            border: value?.isCustom
              ? "2px solid var(--accent)"
              : "1px solid var(--border-default)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>
    </div>
  );
}
