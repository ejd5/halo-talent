"use client";

import { useState } from "react";
import { Send, Edit3, ThumbsDown, Sparkles } from "lucide-react";
import type { QuickReply } from "@/lib/chat-copilot/types";

export function QuickReplies({
  replies,
  onSend,
  onEdit,
  onFeedback,
}: {
  replies: QuickReply[];
  onSend: (text: string) => void;
  onEdit: (text: string) => void;
  onFeedback: (id: string, relevant: boolean) => void;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (replies.length === 0) return null;

  const visible = replies.filter((r) => !dismissedIds.has(r.id));

  const handleSend = (reply: QuickReply) => {
    if (confirmingId === reply.id) {
      onSend(reply.text);
      setConfirmingId(null);
    } else {
      setConfirmingId(reply.id);
    }
  };

  const handleNotRelevant = (reply: QuickReply) => {
    setDismissedIds((prev) => new Set(prev).add(reply.id));
    onFeedback(reply.id, false);
  };

  return (
    <div
      className="px-3 py-2 border-l-2"
      style={{
        borderLeftColor: "var(--accent)",
        backgroundColor: "var(--accent-soft)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} style={{ color: "var(--accent)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
          Réponses rapides
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Plus aucune suggestion.{" "}
          <button
            onClick={() => setDismissedIds(new Set())}
            className="underline"
            style={{ color: "var(--accent)" }}
          >
            Réafficher
          </button>
        </p>
      ) : (
        <div className="space-y-1.5">
          {visible.map((reply) => (
            <div key={reply.id}>
              {confirmingId === reply.id ? (
                <div
                  className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "8px",
                    border: "1px solid var(--accent)",
                  }}
                >
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    Envoyer ce message ?
                  </span>
                  <button
                    onClick={() => handleSend(reply)}
                    className="px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    Envoyer
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="px-2 py-0.5 text-[10px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 group">
                  <button
                    onClick={() => handleSend(reply)}
                    className="flex-1 text-left px-2.5 py-1.5 text-[12px] leading-relaxed transition-colors"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-default)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-default)";
                    }}
                  >
                    {reply.text}
                  </button>
                  <div className="flex gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSend(reply)}
                      className="p-1"
                      style={{ color: "var(--accent)" }}
                      title="Envoyer"
                    >
                      <Send size={11} />
                    </button>
                    <button
                      onClick={() => onEdit(reply.text)}
                      className="p-1"
                      style={{ color: "var(--text-tertiary)" }}
                      title="Modifier dans l'input"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => handleNotRelevant(reply)}
                      className="p-1"
                      style={{ color: "var(--text-tertiary)" }}
                      title="Pas pertinent"
                    >
                      <ThumbsDown size={11} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex gap-1">
          {visible.map((r) => (
            <button
              key={r.id}
              onClick={() => handleNotRelevant(r)}
              className="text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ThumbsDown size={9} /> Pas pertinent
            </button>
          ))}
        </div>
        <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
          Suggestions IA
        </span>
      </div>
    </div>
  );
}
