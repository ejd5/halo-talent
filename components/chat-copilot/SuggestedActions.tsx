"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { SuggestedActionPanel } from "./SuggestedActionPanel";
import type { SuggestedAction } from "@/lib/chat-copilot/types";

export function SuggestedActions({
  actions,
  onSend,
  onEdit,
  onFeedback,
}: {
  actions: SuggestedAction[];
  onSend: (message: string) => void;
  onEdit: (message: string) => void;
  onFeedback: (id: string, relevant: boolean) => void;
}) {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (actions.length === 0) return null;

  const visible = actions.filter((a) => !dismissedIds.has(a.id));
  if (visible.length === 0) return null;

  const openAction = visible.find((a) => a.id === openActionId) || null;

  return (
    <>
      <div
        className="px-3 py-2"
        style={{ borderTop: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Lightbulb size={12} style={{ color: "var(--warning)" }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Actions suggérées
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-0.5">
          {visible.slice(0, 3).map((action) => (
            <button
              key={action.id}
              onClick={() =>
                setOpenActionId(openActionId === action.id ? null : action.id)
              }
              className="flex items-center gap-1.5 px-2 py-1.5 text-left shrink-0 transition-colors min-w-0"
              style={{
                backgroundColor:
                  openActionId === action.id
                    ? "var(--accent-soft)"
                    : "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: "8px",
                maxWidth: 200,
              }}
              onMouseEnter={(e) => {
                if (openActionId !== action.id)
                  e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                if (openActionId !== action.id)
                  e.currentTarget.style.borderColor = "var(--border-default)";
              }}
            >
              <span className="text-sm">{action.icon}</span>
              <div className="min-w-0">
                <p
                  className="text-[11px] font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {action.title}
                </p>
                <p
                  className="text-[9px] truncate"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {openAction && (
        <SuggestedActionPanel
          action={openAction}
          onClose={() => setOpenActionId(null)}
          onSend={onSend}
          onEdit={onEdit}
        />
      )}
    </>
  );
}
