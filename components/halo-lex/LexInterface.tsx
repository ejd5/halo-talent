"use client";

import { useState, useRef, useCallback } from "react";
import { AvatarPlayer } from "./AvatarPlayer";
import { ChatPanel } from "./ChatPanel";
import { QuickQuestions } from "./QuickQuestions";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { Questionnaire } from "./Questionnaire";
import { DocumentGenerator } from "./DocumentGenerator";
import { LawyerEscalation } from "./LawyerEscalation";
import type { LexMessage } from "@/lib/halo-lex/types";

type LexTab = "chat" | "diagnostic" | "documents" | "lawyer";

interface LexInterfaceProps {
  locale?: string;
  platforms?: string[];
  defaultTab?: LexTab;
}

const TAB_ICONS: Record<LexTab, string> = {
  chat: "💬",
  diagnostic: "🔍",
  documents: "📝",
  lawyer: "⚖️",
};

export function LexInterface({ locale = "fr", platforms = [], defaultTab = "chat" }: LexInterfaceProps) {
  const [activeTab, setActiveTab] = useState<LexTab>(defaultTab);
  const [messages, setMessages] = useState<LexMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [avatarAvailable, setAvatarAvailable] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Init session
  useState(() => {
    fetch("/api/lex/session", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setSessionToken(data.sessionToken);
        setAvatarAvailable(data.avatarAvailable);
      })
      .catch(() => {});
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: LexMessage = {
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setStreamingText("");

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const response = await fetch("/api/lex/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            locale,
            platforms,
            newSession: messages.length === 0,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) throw new Error("Chat API error");

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "text") {
                  fullText += event.text;
                  setStreamingText(fullText);
                } else if (event.type === "guardrail") {
                  fullText += `\n\n⚠️ ${event.text}`;
                  setStreamingText(fullText);
                }
              } catch {}
            }
          }
        }

        const assistantMessage: LexMessage = {
          role: "assistant",
          content: fullText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Chat error:", err);
        }
      } finally {
        setIsStreaming(false);
        setStreamingText("");
        abortRef.current = null;
      }
    },
    [messages, isStreaming, locale, platforms]
  );

  const handleQuickQuestion = useCallback(
    (question: string) => {
      setActiveTab("chat");
      sendMessage(question);
    },
    [sendMessage]
  );

  const handleDiagnosticComplete = useCallback(
    (_data: unknown, diagnosis: string) => {
      setActiveTab("chat");
      sendMessage(`Voici mon diagnostic :\n\n${diagnosis}\n\nQue me conseilles-tu ?`);
    },
    [sendMessage]
  );

  const handleLawyerAction = useCallback(
    (action: string) => {
      if (action === "escalate_lawyer") {
        setActiveTab("lawyer");
      } else if (action === "start_questionnaire") {
        setActiveTab("diagnostic");
      } else if (action === "generate_letter") {
        setActiveTab("documents");
      }
    },
    []
  );

  const handleAction = useCallback(
    (action: string) => {
      if (action === "generate_letter") {
        setActiveTab("documents");
      } else if (action === "start_diagnostic" || action === "start_questionnaire") {
        setActiveTab("diagnostic");
      } else if (action === "escalate_lawyer") {
        setActiveTab("lawyer");
      }
    },
    []
  );

  const tabs: { id: LexTab; label: string }[] = [
    { id: "chat", label: locale === "en" ? "Chat" : "Chat" },
    { id: "diagnostic", label: locale === "en" ? "Diagnosis" : "Diagnostic" },
    { id: "documents", label: locale === "en" ? "Documents" : "Documents" },
    { id: "lawyer", label: locale === "en" ? "Lawyer" : "Avocat" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]" style={{ background: "var(--bg-primary)" }}>
      {/* Tab navigation */}
      <div className="flex gap-0 mb-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowMobileChat(false); }}
            className="px-4 py-2.5 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            <span className="flex items-center gap-1.5">
              {TAB_ICONS[tab.id]} {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--accent)" }} />
            )}
          </button>
        ))}
      </div>

      {/* Diagnostic tab */}
      {activeTab === "diagnostic" && (
        <div className="flex-1 overflow-y-auto">
          <Questionnaire
            locale={locale}
            onComplete={handleDiagnosticComplete}
            onClose={() => setActiveTab("chat")}
          />
        </div>
      )}

      {/* Documents tab */}
      {activeTab === "documents" && (
        <div className="flex-1 overflow-y-auto">
          <DocumentGenerator
            locale={locale}
            onClose={() => setActiveTab("chat")}
          />
        </div>
      )}

      {/* Lawyer tab */}
      {activeTab === "lawyer" && (
        <div className="flex-1 overflow-y-auto">
          <LawyerEscalation
            locale={locale}
            onClose={() => setActiveTab("chat")}
          />
        </div>
      )}

      {/* Chat tab */}
      {activeTab === "chat" && (
        <>
          {/* Mobile: toggle chat/avatar */}
          <div className="md:hidden flex gap-2 mb-3">
            <button
              onClick={() => setShowMobileChat(false)}
              className="flex-1 py-2 text-sm font-medium text-center"
              style={{
                color: !showMobileChat ? "var(--accent)" : "var(--text-secondary)",
                borderBottom: !showMobileChat ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              Avatar
            </button>
            <button
              onClick={() => setShowMobileChat(true)}
              className="flex-1 py-2 text-sm font-medium text-center"
              style={{
                color: showMobileChat ? "var(--accent)" : "var(--text-secondary)",
                borderBottom: showMobileChat ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              Chat
            </button>
          </div>

          <div className="flex gap-4 flex-1 min-h-0">
            {/* Left panel, Avatar + Quick questions */}
            <div
              className={`w-[40%] md:w-[40%] flex flex-col gap-4 ${
                showMobileChat ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Avatar */}
              {avatarAvailable && sessionToken ? (
                <div className="h-[55%] min-h-[250px]">
                  <AvatarPlayer
                    sessionToken={sessionToken}
                    voiceEnabled={true}
                  />
                </div>
              ) : (
                <div
                  className="h-[55%] min-h-[200px] flex items-center justify-center"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚖️</div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Lex
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {locale === "en" ? "Legal advisor" : "Conseiller juridique IA"}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick questions */}
              <div className="flex-1 overflow-y-auto">
                <QuickQuestions locale={locale} onSelect={handleQuickQuestion} />
              </div>

              {/* Disclaimer */}
              <DisclaimerBanner locale={locale} compact />
            </div>

            {/* Right panel, Chat */}
            <div
              className={`flex-1 flex flex-col ${
                !showMobileChat ? "hidden md:flex" : "flex"
              }`}
              style={{ border: "1px solid var(--border-default)" }}
            >
              <ChatPanel
                locale={locale}
                onSendMessage={sendMessage}
                messages={messages}
                isStreaming={isStreaming}
                streamingText={streamingText}
                onAction={handleAction}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
