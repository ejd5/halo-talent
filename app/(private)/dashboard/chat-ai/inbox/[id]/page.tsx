"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Wand2 } from "lucide-react";
import { ConversationThread } from "@/components/chat-ai/ConversationThread";
import { FanBrainCompact } from "@/components/chat-ai/FanBrainCompact";
import { AIDraftComposer } from "@/components/chat-ai/AIDraftComposer";
import { ComplianceResultPanel } from "@/components/chat-ai/ComplianceResultPanel";
import { AuditMiniFeed } from "@/components/chat-ai/AuditMiniFeed";

interface Message {
  id: string; conversation_id: string; seq: number;
  direction: "in" | "out"; text: string; created_at: string;
  metadata?: Record<string, unknown>;
}

interface Draft {
  id: string; conversation_id: string; text: string;
  objective: string; tone: string; status: string;
  risk_level: string; explanation?: string; created_at: string;
}

interface FanData {
  id: string; pseudonym: string; platform: string; language: string;
  status: string; ltv: number; spend_30d: number;
  relationship_score: number; commercial_score: number;
  churn_risk: number; intent_score: number;
  preferences?: string[]; avoid_topics?: string[];
  risk_flags: string[]; notes?: string;
}

interface DraftResult {
  id: string;
  text: string;
  objective: string;
  tone: string;
  status: string;
  riskLevel: string;
  complianceStatus: string;
  requiresValidation: boolean;
  explanation?: string;
  complianceNotes?: string[];
}

interface ComplianceResult {
  allowed: boolean;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  requiredActions: string[];
  suggestedSafeAlternative: string | null;
}

export default function ChatAIInboxDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [fan, setFan] = useState<FanData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [generating, setGenerating] = useState(false);
  const [currentDraft, setCurrentDraft] = useState<DraftResult | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);

  const fetchConversationData = useCallback(async () => {
    setLoading(true);
    try {
      const [convRes, auditRes] = await Promise.all([
        fetch(`/api/chat-ai/conversations/${conversationId}`),
        fetch(`/api/chat-ai/audit?limit=15`),
      ]);

      const convData = await convRes.json();
      const auditData = await auditRes.json();
      setAuditLogs(auditData.logs || []);

      if (convRes.ok && convData.conversation) {
        const conv = convData.conversation;
        if (conv.fan) {
          setFan(conv.fan as FanData);
        }
        setMessages((convData.messages as Message[]) || []);
        setDrafts((convData.drafts as Draft[]) || []);
      }
    } catch (err) {
      console.error("[CHATEENG Inbox] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    async function init() {
      await fetchConversationData();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (objective: string, tone?: string): Promise<DraftResult | null> => {
    setGenerating(true);
    setDraftError(null);
    setComplianceResult(null);

    try {
      const res = await fetch("/api/chat-ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, objective, toneOverride: tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDraftError(data.error || data.reasons?.join(", ") || "Génération impossible");
        setComplianceResult({
          allowed: data.allowed ?? false,
          riskLevel: data.riskLevel || "high",
          reasons: data.reasons || [],
          requiredActions: data.requiredActions || [],
          suggestedSafeAlternative: data.suggestedSafeAlternative || null,
        });
        return null;
      }

      const draft = data.draft;
      setCurrentDraft({
        id: draft.id,
        text: draft.text,
        objective: draft.objective,
        tone: draft.tone,
        status: draft.status,
        riskLevel: draft.riskLevel,
        complianceStatus: draft.complianceStatus,
        requiresValidation: draft.requiresValidation,
        explanation: draft.explanation || data.explanation,
        complianceNotes: draft.complianceNotes || data.complianceNotes,
      });

      setComplianceResult({
        allowed: data.allowed,
        riskLevel: data.riskLevel,
        reasons: data.reasons || [],
        requiredActions: [],
        suggestedSafeAlternative: null,
      });

      // Refresh messages/drafts
      fetchConversationData();
      return draft;
    } catch {
      setDraftError("Erreur réseau lors de la génération.");
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (draftId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/chat-ai/drafts/${draftId}/approve`, { method: "POST" });
      if (res.ok) {
        await fetchConversationData();
        return true;
      }
      const data = await res.json();
      setDraftError(data.error || "Erreur approbation");
      return false;
    } catch {
      setDraftError("Erreur réseau");
      return false;
    }
  };

  const handleCopy = async (draftId: string, _text: string): Promise<boolean> => {
    void _text;
    try {
      const res = await fetch(`/api/chat-ai/drafts/${draftId}/copy`, { method: "POST" });
      if (res.ok) {
        await fetchConversationData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => router.push("/dashboard/chat-ai")}
          style={{
            display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 5,
            border: "1px solid rgba(245,240,235,0.08)", background: "rgba(245,240,235,0.03)",
            color: "rgba(245,240,235,0.5)", fontSize: 10, cursor: "pointer",
          }}
        >
          <ArrowLeft size={12} />
          Retour
        </button>
        <h1 style={{
          fontSize: 18, fontWeight: 700, color: "var(--text-primary)",
          fontFamily: "var(--font-display)", letterSpacing: "-0.02em",
        }}>
          Conversation
        </h1>
        {fan && (
          <span style={{ fontSize: 12, color: "rgba(245,240,235,0.4)" }}>
            avec {fan.pseudonym}
          </span>
        )}
      </div>

      {/* 2-column flexible layout */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start",
      }}>
        {/* Center: Thread + Composer */}
        <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Thread section */}
          <div style={{
            padding: "14px", borderRadius: 8,
            border: "1px solid rgba(245,240,235,0.05)", background: "rgba(245,240,235,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <MessageSquare size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                Fil de discussion
              </span>
            </div>
            <ConversationThread
              messages={messages}
              drafts={drafts}
              loading={loading}
              onSelectDraft={(draft) => {
                setCurrentDraft({
                  id: draft.id,
                  text: draft.text,
                  objective: draft.objective,
                  tone: draft.tone,
                  status: draft.status,
                  riskLevel: draft.risk_level,
                  complianceStatus: "needs_review",
                  requiresValidation: true,
                  explanation: draft.explanation,
                });
              }}
            />
          </div>

          {/* Draft Composer */}
          <div style={{
            padding: "14px", borderRadius: 8,
            border: "1px solid rgba(245,240,235,0.05)", background: "rgba(245,240,235,0.01)",
          }}>
            <AIDraftComposer
              conversationId={conversationId}
              fanPseudonym={fan?.pseudonym}
              onGenerate={handleGenerate}
              onApprove={handleApprove}
              onCopy={handleCopy}
              generating={generating}
              currentDraft={currentDraft}
              error={draftError}
            />
          </div>
        </div>

        {/* Right sidebar: Fan Brain + Compliance + Audit */}
        <div style={{ flex: "0 1 320px", minWidth: 250, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Fan Brain */}
          <div style={{
            padding: "14px", borderRadius: 8,
            border: "1px solid rgba(245,240,235,0.05)", background: "rgba(245,240,235,0.01)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Wand2 size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                Fan Brain
              </span>
            </div>
            <FanBrainCompact fan={fan} loading={loading} />
          </div>

          {/* Compliance */}
          <div style={{
            padding: "14px", borderRadius: 8,
            border: "1px solid rgba(245,240,235,0.05)", background: "rgba(245,240,235,0.01)",
          }}>
            <ComplianceResultPanel result={complianceResult} loading={false} />
          </div>

          {/* Audit feed */}
          <AuditMiniFeed logs={auditLogs} loading={loading} />
        </div>
      </div>
    </div>
  );
}
