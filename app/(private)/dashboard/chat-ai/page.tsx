"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatAIPageHeader } from "@/components/chat-ai/ChatAIPageHeader";
import { ChatAIMetricsGrid } from "@/components/chat-ai/ChatAIMetricsGrid";
import { RevenueInboxFilters } from "@/components/chat-ai/RevenueInboxFilters";
import { RevenueInboxList } from "@/components/chat-ai/RevenueInboxList";
import { AuditMiniFeed } from "@/components/chat-ai/AuditMiniFeed";

interface Filters {
  platform: string;
  fanStatus: string;
  language: string;
  risk: string;
}

export default function ChatAIOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [moduleStatus, setModuleStatus] = useState({
    isActive: true,
    isPaused: false,
    demoMode: true,
    consentComplete: false,
  });
  const [conversations, setConversations] = useState([]);
  const [fans, setFans] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filters, setFilters] = useState<Filters>({ platform: "", fanStatus: "", language: "", risk: "" });
  const fetchData = useCallback(async () => {
    try {
      const base = "/api/chat-ai";
      const params = new URLSearchParams();
      if (filters.platform) params.set("platform", filters.platform);
      if (filters.fanStatus) params.set("fanStatus", filters.fanStatus);
      if (filters.language) params.set("language", filters.language);
      if (filters.risk) params.set("risk", filters.risk);
      params.set("limit", "50");

      const [convRes, fansRes, auditRes] = await Promise.all([
        fetch(`${base}/conversations?${params.toString()}`),
        fetch(`${base}/fans?limit=200`),
        fetch(`${base}/audit?limit=15`),
      ]);

      const [convData, fansData, auditData] = await Promise.all([
        convRes.ok ? convRes.json() : { conversations: [] },
        fansRes.ok ? fansRes.json() : { fans: [] },
        auditRes.ok ? auditRes.json() : { logs: [] },
      ]);

      setConversations(convData.conversations || []);
      setFans(fansData.fans || []);
      setAuditLogs(auditData.logs || []);

      // Derive module status from data
      const hasData = (convData.conversations || []).length > 0;
      setModuleStatus({
        isActive: hasData,
        isPaused: false,
        demoMode: convData.conversations?.every?.((c: Record<string, unknown>) =>
          (c.priority_score as number) < 50
        ) || !hasData,
        consentComplete: hasData,
      });
    } catch (err) {
      console.error("[Chat AI Overview] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    async function init() {
      await fetchData();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePauseToggle = async () => {
    setModuleStatus((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Compute metrics
  const hotFans = fans.filter((f: Record<string, unknown>) => f.status === "active" || f.status === "vip").length;
  const vipWhales = fans.filter((f: Record<string, unknown>) => f.status === "vip" || f.status === "whale").length;
  const dormant = fans.filter((f: Record<string, unknown>) => f.status === "dormant").length;
  const churnRisk = fans.filter((f: Record<string, unknown>) => (f.churn_risk as number) >= 70).length;
  const priorityConversations = conversations.filter(
    (c: Record<string, unknown>) => (c.priority_score as number) >= 80
  ).length;

  return (
    <div>
      <ChatAIPageHeader
        isActive={moduleStatus.isActive}
        isPaused={moduleStatus.isPaused}
        demoMode={moduleStatus.demoMode}
        consentComplete={moduleStatus.consentComplete}
        onPauseToggle={handlePauseToggle}
      />

      <ChatAIMetricsGrid
        totalConversations={conversations.length}
        priorityConversations={priorityConversations}
        hotFans={hotFans}
        vipWhales={vipWhales}
        dormant={dormant}
        churnRisk={churnRisk}
        pendingDrafts={0}
        complianceAlerts={0}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start" }}>
        <div style={{ flex: "1 1 400px", minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
          }}>
            <h2 style={{
              fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}>
              Revenue Inbox
            </h2>
            <span style={{ fontSize: 9, color: "rgba(245,240,235,0.2)" }}>
              {conversations.length} conversations
            </span>
          </div>

          <RevenueInboxFilters filters={filters} onChange={setFilters} />
          <RevenueInboxList
            conversations={conversations}
            loading={loading}
          />
        </div>

        <div style={{ flex: "0 1 280px", minWidth: 200 }}>
          <AuditMiniFeed logs={auditLogs} loading={loading} />
        </div>
      </div>
    </div>
  );
}
