"use client";

import { useState, useMemo, useCallback } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { ChatConversationList } from "./ChatConversationList";
import { ChatConversationView } from "./ChatConversationView";
import { FanBrainPanel } from "./FanBrainPanel";
import {
  mockConversations,
  mockMessages,
  mockFanBrains,
  mockAISuggestions,
} from "@/lib/mock/chat-copilot";
import { getContextualMockSuggestions } from "@/lib/chat-copilot/suggestion-engine";
import { getMockToneCheck } from "@/lib/chat-copilot/tone-guard-service";
import { mockToneGuardConfig } from "@/lib/mock/tone-guard-settings";
import { ToneGuardSettings } from "./ToneGuardSettings";
import type {
  ChatConversation,
  ChatMessage,
  FanBrain,
  FilterTab,
  SortMode,
  QuickReply,
  SuggestedAction,
  ContextualAlert,
  ToneCheckResult,
  ToneGuardConfig,
} from "@/lib/chat-copilot/types";

export function ChatCopilot() {
  // ── Data state ──
  const [conversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fanBrain, setFanBrain] = useState<FanBrain | null>(null);
  const [fanBrainLoading, setFanBrainLoading] = useState(false);
  const [fanBrainError, setFanBrainError] = useState<string | null>(null);

  // ── UI state ──
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [mobileView, setMobileView] = useState<"list" | "chat" | "brain">("list");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  // ── Suggestions state ──
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const [alerts, setAlerts] = useState<ContextualAlert[]>([]);
  const [toneCheck, setToneCheck] = useState<ToneCheckResult | null>(null);
  const [toneGuardConfig, setToneGuardConfig] = useState<ToneGuardConfig>(mockToneGuardConfig);
  const [toneGuardSettingsOpen, setToneGuardSettingsOpen] = useState(false);

  // ── Computed ──
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  // ── Handlers ──

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setMessageLoading(true);
    setAiSuggestion(null);
    setFanBrainLoading(true);
    setFanBrainError(null);

    // Clear suggestions
    setQuickReplies([]);
    setSuggestedActions([]);
    setAlerts([]);
    setToneCheck(null);

    // Simulate loading
    setTimeout(() => {
      setMessages(mockMessages[id] || []);
      setMessageLoading(false);
    }, 200);

    // Load fan brain from mock data + generate suggestions
    const conv = mockConversations.find((c) => c.id === id);
    if (conv) {
      setTimeout(() => {
        const brain = mockFanBrains[conv.fanId];
        if (brain) {
          setFanBrain(brain);
          setFanBrainLoading(false);
          // Generate contextual suggestions based on fan brain
          const suggestions = getContextualMockSuggestions(brain);
          setQuickReplies(suggestions.quickReplies);
          setSuggestedActions(suggestions.suggestedActions);
          setAlerts(suggestions.alerts);
        } else {
          setFanBrain(null);
          setFanBrainLoading(false);
        }
      }, 300);
    }

    // Mobile: switch to chat view
    setMobileView("chat");
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    // Run tone guard check only if enabled
    const toneResult = toneGuardConfig.enabled ? getMockToneCheck(text) : null;
    setToneCheck(toneResult);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "creator",
      content: text,
      timestamp: new Date().toISOString(),
      platform: selectedConversation?.platform || "onlyfans",
      read: false,
      delivered: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  }, [selectedConversation, toneGuardConfig]);

  const handleGenerateSuggestion = useCallback(() => {
    setIsGeneratingSuggestion(true);
    setAiSuggestion(null);
    setTimeout(() => {
      const suggestion = mockAISuggestions[Math.floor(Math.random() * mockAISuggestions.length)];
      setAiSuggestion(suggestion);
      setIsGeneratingSuggestion(false);
    }, 1200);
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (aiSuggestion) {
      handleSendMessage(aiSuggestion);
      setAiSuggestion(null);
    }
  }, [aiSuggestion, handleSendMessage]);

  const handleDismissSuggestion = useCallback(() => {
    setAiSuggestion(null);
  }, []);

  const handleRegenerateSuggestion = useCallback(() => {
    handleGenerateSuggestion();
  }, [handleGenerateSuggestion]);

  const handleUpdateNote = useCallback((content: string) => {
    setFanBrain((prev) => {
      if (!prev) return prev;
      const timestamp = new Date().toLocaleString("fr-FR");
      const updatedNotes = prev.personality.notes_manuelles
        ? `${prev.personality.notes_manuelles}\n[${timestamp}] ${content}`
        : `[${timestamp}] ${content}`;
      return {
        ...prev,
        personality: {
          ...prev.personality,
          notes_manuelles: updatedNotes,
        },
      };
    });
  }, []);

  const handleToggleRightPanel = useCallback(() => {
    setRightPanelOpen((prev) => !prev);
    if (mobileView === "chat") setMobileView("brain");
  }, [mobileView]);

  const handleBack = useCallback(() => {
    setMobileView("list");
    setSelectedConversationId(null);
  }, []);

  const handleOpenFanBrain = useCallback(() => {
    setMobileView("brain");
    setRightPanelOpen(true);
  }, []);

  const handleAttachMedia = useCallback(() => {
    // Placeholder - not implemented in Phase 1
  }, []);

  const handleSendPPV = useCallback(() => {
    // Placeholder - not implemented in Phase 1
  }, []);

  const handleUseScript = useCallback(() => {
    handleGenerateSuggestion();
  }, [handleGenerateSuggestion]);

  const handleRecordAudio = useCallback(() => {
    // Placeholder - not implemented in Phase 1
  }, []);

  const handleOpenToneGuardSettings = useCallback(() => {
    setToneGuardSettingsOpen(true);
  }, []);

  const handleSaveToneGuardConfig = useCallback((config: ToneGuardConfig) => {
    setToneGuardConfig(config);
    setToneGuardSettingsOpen(false);
  }, []);

  // ── Suggestions handlers ──

  const handleQuickReplySend = useCallback((text: string) => {
    handleSendMessage(text);
  }, [handleSendMessage]);

  const handleQuickReplyEdit = useCallback((text: string) => {
    // Text will be set in input — the QuickReply component handles this
    // by passing to parent; for now this is a no-op as input editing
    // is handled client-side in QuickReplies
  }, []);

  const handleQuickReplyFeedback = useCallback((_id: string, _relevant: boolean) => {
    // Placeholder — would send feedback to analytics/AI service
  }, []);

  const handleActionSend = useCallback((message: string) => {
    handleSendMessage(message);
  }, [handleSendMessage]);

  const handleActionEdit = useCallback((_message: string) => {
    // Placeholder — would copy message to input field
  }, []);

  const handleActionFeedback = useCallback((_id: string, _relevant: boolean) => {
    // Placeholder — would send feedback to analytics/AI service
  }, []);

  const handleAlertDismiss = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ── Layout ──

  return (
    <div
      className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-lg"
      style={{
        border: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      {/* LEFT PANEL */}
      <div
        className={`${
          mobileView === "chat" || mobileView === "brain" ? "hidden lg:flex" : "flex"
        } flex-col w-[280px] shrink-0`}
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        <ChatConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />
      </div>

      {/* CENTER PANEL */}
      <div
        className={`${
          mobileView === "list" || mobileView === "brain" ? "hidden lg:flex" : "flex"
        } flex-col flex-1 min-w-0`}
      >
        <ChatConversationView
          conversation={selectedConversation}
          messages={messages}
          fanBrain={fanBrain}
          isGeneratingSuggestion={isGeneratingSuggestion}
          aiSuggestion={aiSuggestion}
          quickReplies={quickReplies}
          suggestedActions={suggestedActions}
          alerts={alerts}
          toneCheck={toneCheck}
          onBack={handleBack}
          onOpenFanBrain={handleOpenFanBrain}
          onOpenProfile={() => {}}
          onBlockFan={() => {}}
          onAddNote={() => {}}
          onSendMessage={handleSendMessage}
          onAcceptSuggestion={handleAcceptSuggestion}
          onDismissSuggestion={handleDismissSuggestion}
          onRegenerateSuggestion={handleRegenerateSuggestion}
          onQuickReplySend={handleQuickReplySend}
          onQuickReplyEdit={handleQuickReplyEdit}
          onQuickReplyFeedback={handleQuickReplyFeedback}
          onActionSend={handleActionSend}
          onActionEdit={handleActionEdit}
          onActionFeedback={handleActionFeedback}
          onAlertDismiss={handleAlertDismiss}
          onAttachMedia={handleAttachMedia}
          onSendPPV={handleSendPPV}
          onUseScript={handleUseScript}
          onRecordAudio={handleRecordAudio}
          onOpenToneGuardSettings={handleOpenToneGuardSettings}
          loading={messageLoading}
        />
      </div>

      {/* RIGHT PANEL TOGGLE */}
      {mobileView !== "brain" && (
        <button
          onClick={handleToggleRightPanel}
          className="hidden lg:flex items-center px-1.5"
          style={{
            borderLeft: "1px solid var(--border-default)",
            color: "var(--text-tertiary)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
        >
          {rightPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>
      )}

      {/* RIGHT PANEL */}
      {(rightPanelOpen || mobileView === "brain") && (
        <div
          className={`${
            mobileView === "brain" ? "flex" : "hidden xl:flex"
          } flex-col`}
        >
          <FanBrainPanel
            fanBrain={fanBrain}
            isOpen={true}
            onToggle={handleToggleRightPanel}
            onClose={() => setRightPanelOpen(false)}
            onUpdateNote={handleUpdateNote}
            loading={fanBrainLoading}
            error={fanBrainError}
            onRetry={() => {
              setFanBrainError(null);
              setFanBrainLoading(true);
              setTimeout(() => setFanBrainLoading(false), 500);
            }}
          />
        </div>
      )}
      {/* Tone Guard Settings Modal */}
      <ToneGuardSettings
        config={toneGuardConfig}
        open={toneGuardSettingsOpen}
        onClose={() => setToneGuardSettingsOpen(false)}
        onSave={handleSaveToneGuardConfig}
      />
    </div>
  );
}
