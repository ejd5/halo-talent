"use client";

import { useState } from "react";
import { Wand2, Check, Copy, RefreshCw, AlertTriangle, Shield, Loader2 } from "lucide-react";

interface DraftData {
  id: string;
  text: string;
  objective: string;
  tone: string;
  status: string;
  riskLevel: string;
  complianceStatus: string;
  requiresValidation: boolean;
  explanation?: string;
  complianceNotes?: string[];
}

interface Props {
  conversationId: string;
  fanPseudonym?: string;
  onGenerate: (objective: string, tone?: string) => Promise<DraftData | null>;
  onApprove: (draftId: string) => Promise<boolean>;
  onCopy: (draftId: string, text: string) => Promise<boolean>;
  generating: boolean;
  currentDraft: DraftData | null;
  error: string | null;
}

const quickObjectives = [
  { key: "relance", label: "Relance douce" },
  { key: "ppv_tease", label: "Tease PPV" },
  { key: "remerciement", label: "Remerciement" },
  { key: "engagement", label: "Engagement" },
  { key: "reactivation", label: "Réactivation" },
];

const tones = [
  { key: "chaleureux et naturel", label: "Chaleureux" },
  { key: "audacieux", label: "Audacieux" },
  { key: "doux", label: "Doux" },
  { key: "professionnel", label: "Pro" },
];

export function AIDraftComposer({
  conversationId: _conversationId, fanPseudonym, onGenerate, onApprove, onCopy,
  generating, currentDraft, error,
}: Props) {
  void _conversationId;
  const [objective, setObjective] = useState("");
  const [tone, setTone] = useState("chaleureux et naturel");
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleGenerate = async () => {
    if (!objective.trim() || generating) return;
    setCopied(false);
    setApproved(false);
    await onGenerate(objective.trim(), tone);
  };

  const handleApprove = async () => {
    if (!currentDraft) return;
    const ok = await onApprove(currentDraft.id);
    if (ok) setApproved(true);
  };

  const handleCopy = async () => {
    if (!currentDraft) return;
    const ok = await onCopy(currentDraft.id, currentDraft.text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Composer header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Wand2 size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
          Assistant de rédaction
        </span>
        {fanPseudonym && (
          <span style={{ fontSize: 10, color: "rgba(245,240,235,0.2)", marginLeft: "auto" }}>
            Pour {fanPseudonym}
          </span>
        )}
      </div>

      {/* Quick objectives */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {quickObjectives.map((obj) => (
          <button
            key={obj.key}
            onClick={() => setObjective(obj.label)}
            disabled={generating}
            style={{
              padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(245,240,235,0.08)",
              background: objective === obj.label ? "rgba(96,165,250,0.1)" : "rgba(245,240,235,0.02)",
              color: objective === obj.label ? "#60a5fa" : "rgba(245,240,235,0.4)",
              fontSize: 10, cursor: generating ? "default" : "pointer", fontWeight: 500,
              opacity: generating ? 0.5 : 1,
            }}
          >
            {obj.label}
          </button>
        ))}
      </div>

      {/* Tone selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 9, color: "rgba(245,240,235,0.2)" }}>Ton:</span>
        {tones.map((t) => (
          <button
            key={t.key}
            onClick={() => setTone(t.key)}
            disabled={generating}
            style={{
              padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(245,240,235,0.06)",
              background: tone === t.key ? "rgba(167,139,250,0.08)" : "transparent",
              color: tone === t.key ? "#a78bfa" : "rgba(245,240,235,0.3)",
              fontSize: 9, cursor: generating ? "default" : "pointer",
              opacity: generating ? 0.5 : 1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Custom objective input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
          placeholder="Objectif du message..."
          disabled={generating}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 6,
            border: "1px solid rgba(245,240,235,0.08)",
            background: "rgba(245,240,235,0.02)",
            color: "var(--text-primary)", fontSize: 11, outline: "none",
            opacity: generating ? 0.5 : 1,
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={!objective.trim() || generating}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 6,
            border: "1px solid rgba(96,165,250,0.2)",
            background: objective.trim() && !generating ? "rgba(96,165,250,0.1)" : "rgba(245,240,235,0.02)",
            color: objective.trim() && !generating ? "#60a5fa" : "rgba(245,240,235,0.2)",
            fontSize: 11, fontWeight: 600, cursor: objective.trim() && !generating ? "pointer" : "default",
          }}
        >
          {generating ? (
            <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Wand2 size={12} />
          )}
          {generating ? "Génération..." : "Générer"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 6,
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)",
        }}>
          <AlertTriangle size={12} style={{ color: "#f87171" }} />
          <span style={{ fontSize: 11, color: "#f87171" }}>{error}</span>
        </div>
      )}

      {/* Draft preview */}
      {currentDraft && (
        <div style={{
          padding: "12px 14px", borderRadius: 8,
          border: currentDraft.status === "blocked"
            ? "1px solid rgba(239,68,68,0.2)"
            : "1px solid rgba(96,165,250,0.15)",
          background: currentDraft.status === "blocked"
            ? "rgba(239,68,68,0.04)"
            : "rgba(96,165,250,0.04)",
        }}>
          {/* Preview header */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {currentDraft.status === "blocked" ? (
              <Shield size={12} style={{ color: "#f87171" }} />
            ) : (
              <Wand2 size={12} style={{ color: "#60a5fa" }} />
            )}
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: currentDraft.status === "blocked" ? "#f87171" : "#60a5fa",
            }}>
              {currentDraft.status === "blocked" ? "Brouillon bloqué" : "Brouillon généré"}
            </span>
            <span style={{ fontSize: 9, color: "rgba(245,240,235,0.2)", marginLeft: "auto" }}>
              {currentDraft.tone}
            </span>
          </div>

          {/* Draft text */}
          <div style={{
            fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5,
            padding: "10px 12px", borderRadius: 6,
            background: "rgba(0,0,0,0.15)", marginBottom: 8, whiteSpace: "pre-wrap",
          }}>
            {currentDraft.text}
          </div>

          {/* Compliance notes */}
          {currentDraft.complianceNotes && currentDraft.complianceNotes.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {currentDraft.complianceNotes.map((note, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 4, fontSize: 9,
                  color: "rgba(245,240,235,0.3)", marginBottom: 2,
                }}>
                  <AlertTriangle size={9} style={{ color: "#f59e0b" }} />
                  {note}
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {currentDraft.explanation && (
            <div style={{
              fontSize: 10, color: "rgba(245,240,235,0.3)", fontStyle: "italic",
              marginBottom: 8, padding: "6px 8px", borderRadius: 4,
              background: "rgba(245,240,235,0.02)",
            }}>
              {currentDraft.explanation}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 6 }}>
            {currentDraft.status !== "blocked" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={approved}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 5,
                    border: "1px solid rgba(52,211,153,0.2)",
                    background: approved ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.06)",
                    color: approved ? "#34d399" : "#34d399", fontSize: 10, fontWeight: 600,
                    cursor: approved ? "default" : "pointer",
                    opacity: approved ? 0.6 : 1,
                  }}
                >
                  <Check size={11} />
                  {approved ? "Approuvé" : "Approuver"}
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 5,
                    border: "1px solid rgba(96,165,250,0.15)",
                    background: copied ? "rgba(96,165,250,0.1)" : "rgba(96,165,250,0.04)",
                    color: copied ? "#60a5fa" : "#60a5fa", fontSize: 10, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? "Copié" : "Copier"}
                </button>
              </>
            )}
            <button
              onClick={() => handleGenerate()}
              disabled={!objective.trim() || generating}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 5,
                border: "1px solid rgba(245,240,235,0.08)",
                background: "rgba(245,240,235,0.02)", color: "rgba(245,240,235,0.3)",
                fontSize: 10, fontWeight: 500, cursor: generating ? "default" : "pointer", marginLeft: "auto",
              }}
            >
              <RefreshCw size={11} />
              Régénérer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
