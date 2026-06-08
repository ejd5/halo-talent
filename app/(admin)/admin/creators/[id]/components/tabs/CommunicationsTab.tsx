"use client";

import { messages } from "../../../data";
import { relativeTime } from "../../../utils";
import { MessageSquare, Send, Mail, Phone } from "lucide-react";

type Props = { creatorId: string };

export function CommunicationsTab({ creatorId }: Props) {
  const list = messages[creatorId] ?? [];

  return (
    <div className="space-y-4">
      {/* Action */}
      <button
        className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
        style={{ background: "#C75B39", color: "#F5F0EB" }}
      >
        <Send size={14} strokeWidth={1.5} />
        Envoyer un message
      </button>

      {list.length === 0 ? (
        <p className="text-sm font-sans text-center py-8" style={{ color: "#5A544C" }}>
          Aucune conversation pour ce créateur.
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((msg) => (
            <div
              key={msg.id}
              className="p-4 transition-colors hover:bg-white/[0.02]"
              style={{
                background: msg.read ? "transparent" : "rgba(199,91,57,0.04)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderLeft: msg.read ? "1px solid rgba(255,255,255,0.04)" : "2px solid rgba(199,91,57,0.4)",
              }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} strokeWidth={1.5} style={{ color: msg.read ? "#5A544C" : "#C75B39" }} />
                  <span className="text-xs font-sans font-semibold" style={{ color: "#D0CCC6" }}>
                    {msg.from} → {msg.to}
                  </span>
                </div>
                <span className="text-[10px] font-sans" style={{ color: "#5A544C" }}>
                  {relativeTime(msg.created_at)}
                </span>
              </div>
              <p className="text-xs font-sans font-medium mb-1" style={{ color: "#9A9590" }}>
                {msg.subject}
              </p>
              <p className="text-xs font-sans leading-relaxed" style={{ color: "#7A736B" }}>
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
