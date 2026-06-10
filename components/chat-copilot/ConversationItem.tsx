"use client";

import { PlatformBadge } from "./PlatformBadge";
import { SegmentBadge } from "./SegmentBadge";
import type { ChatConversation } from "@/lib/chat-copilot/types";

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}j`;
}

const PRIORITY_COLORS = {
  urgent: "var(--danger)",
  opportunity: "var(--warning)",
  normal: "var(--border-default)",
};

export function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { fanName, nickname, avatarInitials, lastMessage, lastMessageTimestamp, platform, segment, unreadCount, priority, priorityScore } = conversation;
  const priorityColor = PRIORITY_COLORS[priority];

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className="w-full text-left px-3 py-2.5 transition-colors duration-150 relative"
      style={{
        backgroundColor: isSelected ? "var(--accent-soft)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Priority bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: priorityColor }}
      />

      <div className="flex items-start gap-2.5 pl-2">
        {/* Avatar */}
        <div
          className="w-9 h-9 flex items-center justify-center text-xs font-semibold shrink-0"
          style={{
            borderRadius: "50%",
            backgroundColor: `${priorityColor}20`,
            color: priorityColor,
            border: `1.5px solid ${priorityColor}40`,
          }}
        >
          {avatarInitials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={`text-[13px] truncate ${unreadCount > 0 ? "font-semibold" : "font-medium"}`}
              style={{ color: "var(--text-primary)" }}
            >
              {nickname || fanName}
            </span>
            {unreadCount > 0 && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 shrink-0"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  borderRadius: "8px",
                  lineHeight: "1.2",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {/* Last message */}
          <p
            className="text-[11px] truncate mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {lastMessage}
          </p>

          {/* Bottom row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <PlatformBadge platform={platform} />
            <SegmentBadge segment={segment} />
            {priority === "urgent" && priorityScore >= 85 && (
              <span
                className="text-[9px] px-1 py-0.5 font-medium"
                style={{
                  backgroundColor: "var(--danger)15",
                  color: "var(--danger)",
                  borderRadius: "3px",
                }}
              >
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span
          className="text-[10px] shrink-0 mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {timeAgo(lastMessageTimestamp)}
        </span>
      </div>
    </button>
  );
}
