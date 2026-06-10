"use client";

import { useState } from "react";
import { HealthScore } from "./HealthScore";
import { SegmentBadge } from "./SegmentBadge";
import { PlatformBadge } from "./PlatformBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { FanBrain } from "@/lib/chat-copilot/types";
import {
  DollarSign, Heart, MessageCircle, AlertTriangle, FileText,
  ChevronDown, Plus,
} from "lucide-react";

// ─── Collapsible section ─────────────────────────────────

function BrainSection({
  icon: Icon,
  title,
  defaultOpen = true,
  accent = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  defaultOpen?: boolean;
  accent?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--border-default)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
        style={{ backgroundColor: accent ? "var(--accent-soft)" : "transparent" }}
      >
        <Icon size={13} style={{ color: accent ? "var(--accent)" : "var(--text-secondary)" }} />
        <span
          className="text-[11px] font-semibold uppercase tracking-wider flex-1"
          style={{ color: accent ? "var(--accent)" : "var(--text-secondary)" }}
        >
          {title}
        </span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            color: "var(--text-tertiary)",
          }}
        />
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

// ─── KPI row ──────────────────────────────────────────────

function KPI({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
      <p className="text-[13px] font-semibold" style={{ color: color || "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-8">
      {data.slice(-7).map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: `${color}50`,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}

// ─── Tag pill ─────────────────────────────────────────────

function TagPill({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-medium"
      style={{
        backgroundColor: `${color || "var(--accent)"}15`,
        color: color || "var(--accent)",
        borderRadius: "4px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Main panel ───────────────────────────────────────────

export function FanBrainPanel({
  fanBrain,
  isOpen,
  onToggle,
  onClose,
  onUpdateNote,
  loading,
  error,
  onRetry,
}: {
  fanBrain: FanBrain | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onUpdateNote: (content: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [noteText, setNoteText] = useState("");

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="flex flex-col w-full lg:w-[320px] shrink-0" style={{ borderLeft: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <div className="p-3 space-y-3">
          <Skeleton variant="card" className="h-12" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full lg:w-[320px] shrink-0 items-center justify-center p-6" style={{ borderLeft: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <AlertTriangle size={20} style={{ color: "var(--danger)" }} />
        <p className="text-[12px] mt-2" style={{ color: "var(--text-secondary)" }}>{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-[11px] font-medium"
            style={{ color: "var(--accent)" }}
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (!fanBrain) {
    return (
      <div className="flex flex-col w-full lg:w-[320px] shrink-0" style={{ borderLeft: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <span className="text-lg mb-2">🧠</span>
          <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
            Aucune donnée cerveau
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            Les données apparaissent après quelques conversations
          </p>
        </div>
      </div>
    );
  }

  const healthScore = 100 - fanBrain.risk.churn_score;
  const name = fanBrain.custom_name || `Fan #${fanBrain.fan_id.slice(0, 8)}`;

  const handleAddNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onUpdateNote(trimmed);
    setNoteText("");
  };

  return (
    <div
      className="flex flex-col w-full lg:w-[320px] shrink-0 overflow-hidden"
      style={{ borderLeft: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <HealthScore score={healthScore} size="sm" className="flex-1 min-w-0" />
        <span className="text-[13px] font-semibold truncate flex-1" style={{ color: "var(--text-primary)" }}>
          Cerveau de {name}
        </span>
        <button onClick={onToggle} className="hidden xl:flex p-1" style={{ color: "var(--text-tertiary)" }}>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Financial */}
        <BrainSection icon={DollarSign} title="Financier" accent>
          <div className="grid grid-cols-2 gap-2">
            <KPI label="Total dépensé" value={`${fanBrain.ltv_predicted.toFixed(0)}€`} color="var(--accent)" />
            <KPI label="LTV prédite" value={`${(fanBrain.ltv_predicted * 1.4).toFixed(0)}€`} />
            <KPI label="Dernier achat" value={fanBrain.updated_at ? new Date(fanBrain.updated_at).toLocaleDateString("fr-FR") : "—"} />
            <KPI
              label="Segment"
              value={fanBrain.segment === "whale" ? "🐋 Baleine" : fanBrain.segment === "tipper" ? "💰 Tip" : fanBrain.segment}
            />
          </div>
          {fanBrain.tip_history.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Historique d'achats</span>
              <MiniChart data={fanBrain.tip_history} color="var(--accent)" />
            </div>
          )}
        </BrainSection>

        {/* Personality */}
        <BrainSection icon={Heart} title="Personnalité" accent>
          <div>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Style de communication</span>
            <div className="mt-0.5">
              <TagPill label={fanBrain.personality.communication_style} />
            </div>
          </div>
          {fanBrain.personality.interests.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Centres d'intérêt</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {fanBrain.personality.interests.map((i) => (
                  <TagPill key={i} label={i} />
                ))}
              </div>
            </div>
          )}
          {fanBrain.personality.triggers_positive.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Déclencheurs +</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {fanBrain.personality.triggers_positive.map((t) => (
                  <TagPill key={t} label={t} color="var(--success)" />
                ))}
              </div>
            </div>
          )}
          {fanBrain.personality.triggers_negative.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Déclencheurs -</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {fanBrain.personality.triggers_negative.map((t) => (
                  <TagPill key={t} label={t} color="var(--danger)" />
                ))}
              </div>
            </div>
          )}
        </BrainSection>

        {/* Conversation */}
        <BrainSection icon={MessageCircle} title="Conversation" accent>
          {fanBrain.conversation.last_messages_summary && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Résumé IA</span>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {fanBrain.conversation.last_messages_summary}
              </p>
            </div>
          )}
          {fanBrain.conversation.topics_discussed.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Sujets</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {fanBrain.conversation.topics_discussed.map((t) => (
                  <TagPill key={t} label={t} />
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Sentiment</span>
            <p className="text-[12px] font-medium mt-0.5" style={{
              color: fanBrain.conversation.sentiment_trend === "positive" ? "var(--success)"
                : fanBrain.conversation.sentiment_trend === "declining" ? "var(--danger)"
                  : "var(--text-secondary)",
            }}>
              {fanBrain.conversation.sentiment_trend === "positive" ? "📈 Positif"
                : fanBrain.conversation.sentiment_trend === "declining" ? "📉 En baisse"
                  : "➡️ Neutre"}
            </p>
          </div>
          {fanBrain.conversation.open_threads.length > 0 && (
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Fils ouverts</span>
              <ul className="mt-0.5 space-y-0.5">
                {fanBrain.conversation.open_threads.map((t, i) => (
                  <li key={i} className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    • {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </BrainSection>

        {/* Risk */}
        <BrainSection icon={AlertTriangle} title="Risque" accent>
          <div className="space-y-2">
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Score de churn</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--bg-card)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fanBrain.risk.churn_score}%`,
                      backgroundColor: fanBrain.risk.churn_score > 66 ? "var(--danger)"
                        : fanBrain.risk.churn_score > 33 ? "var(--warning)"
                          : "var(--success)",
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold shrink-0" style={{
                  color: fanBrain.risk.churn_score > 66 ? "var(--danger)"
                    : fanBrain.risk.churn_score > 33 ? "var(--warning)"
                      : "var(--success)",
                }}>
                  {fanBrain.risk.churn_score}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <KPI label="Jours sans message" value={`${fanBrain.risk.days_since_last_message}j`} />
              <KPI label="Jours sans achat" value={`${fanBrain.risk.days_since_last_purchase}j`} />
            </div>
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Tendance d'engagement</span>
              <p className="text-[12px] font-medium mt-0.5" style={{
                color: fanBrain.risk.engagement_trend === "rising" ? "var(--success)"
                  : fanBrain.risk.engagement_trend === "declining" ? "var(--danger)"
                    : "var(--text-secondary)",
              }}>
                {fanBrain.risk.engagement_trend === "rising" ? "📈 En hausse"
                  : fanBrain.risk.engagement_trend === "declining" ? "📉 En baisse"
                    : "➡️ Stable"}
              </p>
            </div>
            {fanBrain.risk.churn_score > 50 && (
              <div
                className="px-2 py-1.5 text-[11px] leading-relaxed"
                style={{
                  backgroundColor: "var(--warning)10",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  borderLeft: "2px solid var(--warning)",
                }}
              >
                💡 Recommandation : Relancer avec un message personnalisé
              </div>
            )}
          </div>
        </BrainSection>

        {/* Notes */}
        <div style={{ borderBottom: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-2 px-3 py-2">
            <FileText size={13} style={{ color: "var(--text-secondary)" }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider flex-1" style={{ color: "var(--text-secondary)" }}>
              Notes
            </span>
          </div>
          <div className="px-3 pb-3 space-y-2">
            <div className="flex gap-1.5">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 text-[11px] outline-none px-2 py-1.5"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  borderRadius: "6px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNote();
                }}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "6px",
                  backgroundColor: noteText.trim() ? "var(--accent)" : "var(--border-default)",
                  color: noteText.trim() ? "#fff" : "var(--text-tertiary)",
                }}
              >
                <Plus size={12} />
              </button>
            </div>
            {fanBrain.personality.notes_manuelles ? (
              <div
                className="px-2 py-1.5 max-h-32 overflow-y-auto custom-scrollbar text-[11px] leading-relaxed whitespace-pre-wrap"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                {fanBrain.personality.notes_manuelles}
              </div>
            ) : (
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                Aucune note pour ce fan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
