"use client";

import { MessageSquare, User, Bot, AlertTriangle, Clock } from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  seq: number;
  direction: "in" | "out";
  text: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

interface Draft {
  id: string;
  conversation_id: string;
  text: string;
  objective: string;
  tone: string;
  status: string;
  risk_level: string;
  explanation?: string;
  created_at: string;
}

interface Props {
  messages: Message[];
  drafts: Draft[];
  loading: boolean;
  onSelectDraft?: (draft: Draft) => void;
}

export function ConversationThread({ messages, drafts, loading, onSelectDraft }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            height: 48, borderRadius: 6,
            background: "rgba(245,240,235,0.02)", animation: "pulse 2s infinite",
            width: i % 2 === 0 ? "70%" : "50%",
            alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
          }} />
        ))}
      </div>
    );
  }

  if (messages.length === 0 && drafts.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 32, color: "rgba(245,240,235,0.15)", gap: 8,
      }}>
        <MessageSquare size={24} />
        <span style={{ fontSize: 11 }}>Aucun message</span>
      </div>
    );
  }

  const allItems = [
    ...messages.map((m) => ({ type: "message" as const, time: m.created_at, data: m })),
    ...drafts.map((d) => ({ type: "draft" as const, time: d.created_at, data: d })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "4px 0" }}>
      {allItems.map((item) => {
        if (item.type === "message") {
          const msg = item.data as Message;
          const isFan = msg.direction === "in";
          return (
            <div key={msg.id} style={{
              display: "flex", gap: 8, alignSelf: isFan ? "flex-start" : "flex-end",
              maxWidth: "85%",
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 9999, flexShrink: 0,
                background: isFan ? "rgba(96,165,250,0.1)" : "rgba(52,211,153,0.1)",
                color: isFan ? "#60a5fa" : "#34d399",
              }}>
                {isFan ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div>
                <div style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 12,
                  background: isFan ? "rgba(245,240,235,0.04)" : "rgba(52,211,153,0.06)",
                  color: "var(--text-primary)", lineHeight: 1.5,
                  borderTopLeftRadius: isFan ? 2 : 8,
                  borderTopRightRadius: isFan ? 8 : 2,
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: 9, color: "rgba(245,240,235,0.2)", marginTop: 2,
                  paddingLeft: isFan ? 0 : 0, textAlign: isFan ? "left" : "right",
                }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        }

        const draft = item.data as Draft;
        return (
          <div key={draft.id} style={{ alignSelf: "center", maxWidth: "90%", width: "100%" }}>
            <button
              onClick={() => onSelectDraft?.(draft)}
              style={{
                width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 8,
                border: draft.status === "blocked"
                  ? "1px solid rgba(239,68,68,0.15)"
                  : "1px solid rgba(96,165,250,0.15)",
                background: draft.status === "blocked"
                  ? "rgba(239,68,68,0.04)"
                  : "rgba(96,165,250,0.04)",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  draft.status === "blocked" ? "rgba(239,68,68,0.08)" : "rgba(96,165,250,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  draft.status === "blocked" ? "rgba(239,68,68,0.04)" : "rgba(96,165,250,0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Bot size={12} style={{ color: draft.status === "blocked" ? "#f87171" : "#60a5fa" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                  Brouillon IA — {draft.objective}
                </span>
                {draft.status === "blocked" && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#f87171" }}>
                    <AlertTriangle size={10} />
                    Bloqué
                  </span>
                )}
                <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(245,240,235,0.2)" }}>
                  <Clock size={10} style={{ display: "inline", marginRight: 2 }} />
                  {new Date(draft.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(245,240,235,0.6)", lineHeight: 1.4 }}>
                {draft.text.length > 150 ? draft.text.slice(0, 150) + "..." : draft.text}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
