"use client";

import type { ChatMessage } from "@/lib/chat-copilot/types";

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({
  message,
  isConsecutive,
}: {
  message: ChatMessage;
  isConsecutive?: boolean;
}) {
  const isCreator = message.role === "creator";

  if (!message.content.trim()) return null;

  return (
    <div
      className={`flex ${isCreator ? "justify-end" : "justify-start"} ${isConsecutive ? "mt-0.5" : "mt-3"}`}
    >
      <div className="max-w-[75%] min-w-0">
        {message.isPPV ? (
          <PPVCard message={message} />
        ) : (
          <>
            <div
              className="px-3 py-2 text-[13px] leading-relaxed break-words"
              style={{
                backgroundColor: isCreator ? "var(--accent)" : "var(--bg-card)",
                color: isCreator ? "#fff" : "var(--text-primary)",
                borderRadius: isCreator ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              }}
            >
              {message.content}
            </div>
            <div
              className={`flex items-center gap-1 mt-0.5 ${isCreator ? "justify-end" : "justify-start"}`}
            >
              <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                {formatTime(message.timestamp)}
              </span>
              {isCreator && (
                <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                  {message.read ? "✓✓" : message.delivered ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PPVCard({ message }: { message: ChatMessage }) {
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{
          borderRadius: "14px 14px 4px 14px",
          border: "1px solid var(--accent)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        {/* Preview area */}
        <div
          className="relative flex items-center justify-center h-20"
          style={{
            background: "linear-gradient(135deg, var(--accent)20, var(--accent)08)",
          }}
        >
          {message.ppvPreviewBlurred && (
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: "var(--bg-card)" }}
            />
          )}
          <div
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold z-10"
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            <span>🔒</span>
            <span>{message.ppvPrice}€</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2 text-[13px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {message.content}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-0.5 justify-end">
        <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
