"use client";

import { useState } from "react";
import { X, Send, Edit3 } from "lucide-react";
import type { SuggestedAction } from "@/lib/chat-copilot/types";

export function SuggestedActionPanel({
  action,
  onClose,
  onSend,
  onEdit,
}: {
  action: SuggestedAction;
  onClose: () => void;
  onSend: (message: string) => void;
  onEdit: (message: string) => void;
}) {
  const [message, setMessage] = useState(action.draftedMessage);

  return (
    <div
      className="px-3 py-2"
      style={{
        borderTop: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{action.icon}</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
            {action.title}
          </span>
        </div>
        <button onClick={onClose} style={{ color: "var(--text-tertiary)" }}>
          <X size={12} />
        </button>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full resize-none text-[12px] leading-relaxed outline-none px-2.5 py-1.5"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
          borderRadius: "8px",
        }}
      />

      <div className="flex items-center gap-1.5 mt-1.5">
        <button
          onClick={() => {
            onSend(message);
            onClose();
          }}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium"
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          <Send size={10} />
          Envoyer
        </button>
        <button
          onClick={() => {
            onEdit(message);
            onClose();
          }}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium"
          style={{
            color: "var(--text-secondary)",
            borderRadius: "4px",
          }}
        >
          <Edit3 size={10} />
          Modifier dans l'input
        </button>
        <button
          onClick={onClose}
          className="px-2.5 py-1 text-[10px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
