"use client";

import { useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { AISuggestions } from "./AISuggestions";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
import { SuggestedActions } from "./SuggestedActions";
import { ContextualAlerts } from "./ContextualAlerts";
import { SegmentBadge } from "./SegmentBadge";
import { PlatformBadge } from "./PlatformBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft, User, FileText, Flag, MessageCircle,
} from "lucide-react";
import type {
  ChatConversation, ChatMessage, FanBrain,
  QuickReply, SuggestedAction, ContextualAlert, ToneCheckResult,
} from "@/lib/chat-copilot/types";

function formatDateDivider(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Aujourd'hui";
  if (isYesterday) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export function ChatConversationView({
  conversation,
  messages,
  fanBrain,
  isGeneratingSuggestion,
  aiSuggestion,
  quickReplies,
  suggestedActions,
  alerts,
  toneCheck,
  onBack,
  onOpenFanBrain,
  onOpenProfile,
  onBlockFan,
  onAddNote,
  onSendMessage,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRegenerateSuggestion,
  onQuickReplySend,
  onQuickReplyEdit,
  onQuickReplyFeedback,
  onActionSend,
  onActionEdit,
  onActionFeedback,
  onAlertDismiss,
  onAttachMedia,
  onSendPPV,
  onUseScript,
  onRecordAudio,
  onOpenToneGuardSettings,
  loading,
  error,
  onRetry,
}: {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  fanBrain: FanBrain | null;
  isGeneratingSuggestion: boolean;
  aiSuggestion: string | null;
  quickReplies: QuickReply[];
  suggestedActions: SuggestedAction[];
  alerts: ContextualAlert[];
  toneCheck: ToneCheckResult | null;
  onBack: () => void;
  onOpenFanBrain: () => void;
  onOpenProfile: () => void;
  onBlockFan: () => void;
  onAddNote: () => void;
  onSendMessage: (text: string) => void;
  onAcceptSuggestion: () => void;
  onDismissSuggestion: () => void;
  onRegenerateSuggestion: () => void;
  onQuickReplySend: (text: string) => void;
  onQuickReplyEdit: (text: string) => void;
  onQuickReplyFeedback: (id: string, relevant: boolean) => void;
  onActionSend: (message: string) => void;
  onActionEdit: (message: string) => void;
  onActionFeedback: (id: string, relevant: boolean) => void;
  onAlertDismiss: (id: string) => void;
  onAttachMedia: () => void;
  onSendPPV: () => void;
  onUseScript: () => void;
  onRecordAudio: () => void;
  onOpenToneGuardSettings?: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiSuggestion]);

  // No conversation selected
  if (!conversation) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center" style={{ backgroundColor: "var(--bg-surface)" }}>
        <MessageCircle size={32} style={{ color: "var(--text-tertiary)" }} />
        <p className="text-sm font-medium mt-3" style={{ color: "var(--text-secondary)" }}>
          Sélectionnez une conversation
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col flex-1" style={{ backgroundColor: "var(--bg-surface)" }}>
        <Header
          conversation={conversation}
          fanBrain={fanBrain}
          onBack={onBack}
          onOpenFanBrain={onOpenFanBrain}
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorState
            title="Erreur de chargement"
            message={error}
            retry={onRetry}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col flex-1" style={{ backgroundColor: "var(--bg-surface)" }}>
        <Header
          conversation={conversation}
          fanBrain={fanBrain}
          onBack={onBack}
          onOpenFanBrain={onOpenFanBrain}
        />
        <div className="flex-1 space-y-3 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <Skeleton variant="text" className={i % 2 === 0 ? "w-48 h-8" : "w-56 h-8"} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0" style={{ backgroundColor: "var(--bg-surface)" }}>
      {/* Header */}
      <Header
        conversation={conversation}
        fanBrain={fanBrain}
        onBack={onBack}
        onOpenFanBrain={onOpenFanBrain}
      />

      {/* Contextual Alerts */}
      <ContextualAlerts alerts={alerts} onDismiss={onAlertDismiss} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle size={24} style={{ color: "var(--text-tertiary)" }} />
            <p className="text-[12px] mt-2" style={{ color: "var(--text-secondary)" }}>
              Aucun message dans cette conversation
            </p>
          </div>
        ) : (
          <>
            {renderMessageGroups(messages)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Replies */}
      <QuickReplies
        replies={quickReplies}
        onSend={onQuickReplySend}
        onEdit={onQuickReplyEdit}
        onFeedback={onQuickReplyFeedback}
      />

      {/* AI Suggestions (legacy single-suggestion) */}
      <AISuggestions
        suggestion={aiSuggestion}
        isGenerating={isGeneratingSuggestion}
        onAccept={onAcceptSuggestion}
        onDismiss={onDismissSuggestion}
        onRegenerate={onRegenerateSuggestion}
      />

      {/* Suggested Actions */}
      <SuggestedActions
        actions={suggestedActions}
        onSend={onActionSend}
        onEdit={onActionEdit}
        onFeedback={onActionFeedback}
      />

      {/* Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        onAttachMedia={onAttachMedia}
        onSendPPV={onSendPPV}
        onUseScript={onUseScript}
        onRecordAudio={onRecordAudio}
        onOpenToneGuardSettings={onOpenToneGuardSettings}
        toneCheck={toneCheck}
      />

      {/* Disclaimer */}
      <div className="px-3 py-1 text-center">
        <span className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
          Suggestions IA, vérifiez avant d'envoyer
        </span>
      </div>
    </div>
  );
}

// ─── Header sub-component ───────────────────────────────

function Header({
  conversation,
  fanBrain,
  onBack,
  onOpenFanBrain,
}: {
  conversation: ChatConversation;
  fanBrain: FanBrain | null;
  onBack: () => void;
  onOpenFanBrain: () => void;
}) {
  const lastActive = fanBrain?.risk.days_since_last_message
    ? `Inactif depuis ${fanBrain.risk.days_since_last_message}j`
    : "Actif récemment";

  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 shrink-0"
      style={{ borderBottom: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)" }}
    >
      {/* Mobile back */}
      <button onClick={onBack} className="lg:hidden p-1" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={16} />
      </button>

      {/* Avatar */}
      <div
        className="w-8 h-8 flex items-center justify-center text-[11px] font-semibold shrink-0"
        style={{
          borderRadius: "50%",
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        {conversation.avatarInitials}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {conversation.nickname || conversation.fanName}
          </span>
          <SegmentBadge segment={conversation.segment} />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <PlatformBadge platform={conversation.platform} />
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {lastActive}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <HeaderButton icon={User} label="Profil" onClick={() => {}} />
        <HeaderButton icon={FileText} label="Notes" onClick={() => {}} />
        <HeaderButton icon={Flag} label="Bloquer" onClick={() => {}} />
        <HeaderButton icon={null} label="🧠" onClick={onOpenFanBrain} className="xl:hidden" />
      </div>
    </div>
  );
}

function HeaderButton({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: React.ElementType | null;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-7 h-7 ${className || ""}`}
      style={{ color: "var(--text-tertiary)", borderRadius: "4px" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      title={label}
    >
      {Icon ? <Icon size={13} /> : <span className="text-[13px]">{label}</span>}
    </button>
  );
}

// ─── Message grouping with date dividers ────────────────

function renderMessageGroups(messages: ChatMessage[]) {
  const groups: { date: string; items: ChatMessage[] }[] = [];
  let lastDate = "";

  for (const msg of messages) {
    const dateKey = new Date(msg.timestamp).toDateString();
    if (dateKey !== lastDate) {
      groups.push({ date: msg.timestamp, items: [msg] });
      lastDate = dateKey;
    } else {
      groups[groups.length - 1].items.push(msg);
    }
  }

  return groups.map((group, gi) => (
    <div key={gi}>
      {/* Date divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1" style={{ borderTop: "1px solid var(--border-default)" }} />
        <span className="text-[10px] font-medium shrink-0" style={{ color: "var(--text-tertiary)" }}>
          {formatDateDivider(group.date)}
        </span>
        <div className="flex-1" style={{ borderTop: "1px solid var(--border-default)" }} />
      </div>

      {/* Messages */}
      {group.items.map((msg, mi) => {
        const prev = mi > 0 ? group.items[mi - 1] : null;
        const isConsecutive = !!(prev && prev.role === msg.role);
        return <ChatBubble key={msg.id} message={msg} isConsecutive={isConsecutive} />;
      })}
    </div>
  ));
}
