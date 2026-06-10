"use client";

import { useState } from "react";
import { ShieldCheck, X, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { ToneGuardConfig, ToneGuardSensitivity } from "@/lib/chat-copilot/types";

const CHECK_LABELS: Record<keyof ToneGuardConfig["checks"], string> = {
  dna: "Cohérence ADN Créatif",
  taboo: "Respect des tabous",
  tos: "Conformité TOS plateforme",
  legal: "Protection juridique",
  quality: "Qualité & professionnalisme",
};

const CHECK_DESCRIPTIONS: Record<keyof ToneGuardConfig["checks"], string> = {
  dna: "Vérifie que le message correspond au ton et au vocabulaire défini dans votre ADN Créatif.",
  taboo: "Bloque les messages mentionnant vos sujets tabous ou mots interdits.",
  tos: "Vérifie que le message respecte les conditions d'utilisation des plateformes.",
  legal: "Détecte les promesses, engagements ou partage d'informations personnelles.",
  quality: "Vérifie l'orthographe, la longueur et la pertinence du message.",
};

export function ToneGuardSettings({
  config,
  open,
  onClose,
  onSave,
}: {
  config: ToneGuardConfig;
  open: boolean;
  onClose: () => void;
  onSave: (config: ToneGuardConfig) => void;
}) {
  const [localConfig, setLocalConfig] = useState<ToneGuardConfig>(config);
  const [newWord, setNewWord] = useState("");

  const toggleCheck = (key: keyof ToneGuardConfig["checks"]) => {
    setLocalConfig((prev) => ({
      ...prev,
      checks: { ...prev.checks, [key]: !prev.checks[key] },
    }));
  };

  const setSensitivity = (sensitivity: ToneGuardSensitivity) => {
    setLocalConfig((prev) => ({ ...prev, sensitivity }));
  };

  const addBlockedWord = () => {
    const word = newWord.trim().toLowerCase();
    if (word && !localConfig.blockedWords.includes(word)) {
      setLocalConfig((prev) => ({
        ...prev,
        blockedWords: [...prev.blockedWords, word],
      }));
      setNewWord("");
    }
  };

  const removeBlockedWord = (word: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      blockedWords: prev.blockedWords.filter((w) => w !== word),
    }));
  };

  const toggleEnabled = () => {
    setLocalConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <Modal open={open} onClose={onClose} title="Tone Guard">
      <div className="space-y-4" style={{ minWidth: 380, maxWidth: 480 }}>
        {/* Master toggle */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: "var(--bg-card)" }}
          onClick={toggleEnabled}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} style={{ color: localConfig.enabled ? "var(--success)" : "var(--text-tertiary)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
              Activer le Tone Guard
            </span>
          </div>
          <div
            className="w-8 h-4 rounded-full transition-colors relative"
            style={{
              backgroundColor: localConfig.enabled ? "var(--accent)" : "var(--border-default)",
            }}
          >
            <div
              className="w-3 h-3 rounded-full absolute top-0.5 transition-all"
              style={{
                backgroundColor: "#fff",
                left: localConfig.enabled ? "18px" : "2px",
              }}
            />
          </div>
        </div>

        {/* Sensitivity */}
        <div>
          <label className="text-[10px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Niveau de sensibilité
          </label>
          <div className="flex gap-1">
            {(["strict", "moderate", "flexible"] as ToneGuardSensitivity[]).map((s) => (
              <button
                key={s}
                onClick={() => setSensitivity(s)}
                className="flex-1 py-1.5 text-[10px] font-medium rounded transition-colors"
                style={{
                  backgroundColor: localConfig.sensitivity === s ? "var(--accent)" : "var(--bg-card)",
                  color: localConfig.sensitivity === s ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {s === "strict" ? "Strict" : s === "moderate" ? "Modéré" : "Souple"}
              </button>
            ))}
          </div>
        </div>

        {/* Per-check toggles */}
        <div>
          <p className="text-[10px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Vérifications
          </p>
          <div className="space-y-1">
            {(Object.keys(CHECK_LABELS) as (keyof ToneGuardConfig["checks"])[]).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer"
                style={{ backgroundColor: "var(--bg-card)" }}
                onClick={() => toggleCheck(key)}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {CHECK_LABELS[key]}
                  </p>
                  <p className="text-[8px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    {CHECK_DESCRIPTIONS[key]}
                  </p>
                </div>
                <div
                  className="w-7 h-3.5 rounded-full transition-colors relative shrink-0 ml-2"
                  style={{
                    backgroundColor: localConfig.checks[key] ? "var(--accent)" : "var(--border-default)",
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full absolute top-0.5 transition-all"
                    style={{
                      backgroundColor: "#fff",
                      left: localConfig.checks[key] ? "16px" : "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom blocked words */}
        <div>
          <p className="text-[10px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Mots bloqués personnalisés
          </p>
          <div className="flex items-center gap-1 mb-1.5">
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBlockedWord()}
              placeholder="Ajouter un mot..."
              className="flex-1 px-2 py-1 text-[10px] outline-none rounded"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={addBlockedWord}
              className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium rounded"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              <Plus size={10} />
            </button>
          </div>
          {localConfig.blockedWords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {localConfig.blockedWords.map((word) => (
                <span
                  key={word}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] rounded"
                  style={{
                    backgroundColor: "var(--danger-bg, #2d1b1b)",
                    color: "var(--danger-text, #f5a5a5)",
                  }}
                >
                  {word}
                  <button onClick={() => removeBlockedWord(word)} className="hover:opacity-70">
                    <X size={8} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSave(localConfig)}
            className="flex-1 py-1.5 text-[10px] font-medium rounded text-center"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-1.5 text-[10px] font-medium rounded text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
}
