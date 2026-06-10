"use client";

import { useState, useCallback } from "react";
import { RevenueThreadList, type ThreadFilters, type SortMode } from "./RevenueThreadList";
import { RevenueThreadPanel } from "./RevenueThreadPanel";
import { FanOpportunityCard } from "./FanOpportunityCard";
import { RevenueAttributionPanel } from "./RevenueAttributionPanel";
import { revenueThreads, sortByPriority, type RevenueThread } from "@/lib/mock/atlas-revenue-inbox";

export function RevenueInbox() {
  const [threads, setThreads] = useState<RevenueThread[]>(() => sortByPriority(revenueThreads));
  const [selectedThread, setSelectedThread] = useState<RevenueThread | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "conv" | "profile">("list");
  const [sortMode, setSortMode] = useState<SortMode>("composite");
  const [filters, setFilters] = useState<ThreadFilters>({
    platform: "",
    language: "",
    fanStatus: "",
    riskLevel: "",
    vipOnly: false,
    dormantOnly: false,
    search: "",
  });
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestionReasoning, setSuggestionReasoning] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Apply filters + sort
  const filteredThreads = (() => {
    let result = [...threads];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.fanName.toLowerCase().includes(q) ||
          t.lastMessagePreview.toLowerCase().includes(q),
      );
    }
    if (filters.platform) result = result.filter((t) => t.platform === filters.platform);
    if (filters.language) result = result.filter((t) => t.language === filters.language);
    if (filters.fanStatus) result = result.filter((t) => t.fanStatus === filters.fanStatus);
    if (filters.riskLevel) result = result.filter((t) => t.riskLevel === filters.riskLevel);
    if (filters.vipOnly) result = result.filter((t) => t.fanStatus === "vip" || t.fanStatus === "loyal");
    if (filters.dormantOnly)
      result = result.filter((t) => t.fanStatus === "dormant" || t.fanStatus === "at-risk");

    switch (sortMode) {
      case "composite":
        return sortByPriority(result);
      case "intent":
        return [...result].sort((a, b) => b.intentScore - a.intentScore);
      case "revenue":
        return [...result].sort((a, b) => b.revenuePotential - a.revenuePotential);
      case "risk":
        return [...result].sort((a, b) => b.complianceRiskScore - a.complianceRiskScore);
      case "recency":
        return [...result].sort((a, b) => {
          if (!a.lastMessageDate) return 1;
          if (!b.lastMessageDate) return -1;
          return new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime();
        });
      default:
        return result;
    }
  })();

  const handleSelectThread = useCallback(
    (thread: RevenueThread) => {
      setSelectedThread(thread);
      setMobileView("conv");
      setAiSuggestion(null);
      setSuggestionReasoning("");
    },
    [],
  );

  const handleGenerateSuggestion = useCallback(() => {
    if (!selectedThread) return;
    setIsGenerating(true);
    setAiSuggestion(null);
    setSuggestionReasoning("");

    setTimeout(() => {
      setAiSuggestion(selectedThread.aiSuggestedReply);
      setSuggestionReasoning(selectedThread.aiReasoning);
      setIsGenerating(false);
    }, 1200);
  }, [selectedThread]);

  const handleApproveSuggestion = useCallback(() => {
    setAiSuggestion(null);
    setSuggestionReasoning("");
  }, []);

  const handleEditSuggestion = useCallback(() => {
    // In a real app, would open an editable textarea
  }, []);

  const handleRejectSuggestion = useCallback(() => {
    setAiSuggestion(null);
    setSuggestionReasoning("");
  }, []);

  const handleMarkSensitive = useCallback(() => {
    // Mark thread as sensitive
  }, []);

  const handleDoNotContact = useCallback(() => {
    // Remove from active list
  }, []);

  const handleEscalate = useCallback(() => {
    // Escalate to manager
  }, []);

  const handleAddNote = useCallback(
    (note: string) => {
      if (!selectedThread) return;
      const updated = threads.map((t) =>
        t.id === selectedThread.id ? { ...t, notes: [...t.notes, note] } : t,
      );
      setThreads(updated);
      const fresh = updated.find((t) => t.id === selectedThread.id);
      if (fresh) setSelectedThread(fresh);
    },
    [selectedThread, threads],
  );

  return (
    <div
      className="flex -m-4 md:-m-8 h-[calc(100vh-4rem)] overflow-hidden"
      style={{ backgroundColor: "var(--color-ink, #1A1614)" }}
    >
      {/* LEFT: Thread List */}
      <div
        className={`${
          mobileView === "conv" || mobileView === "profile" ? "hidden lg:flex" : "flex"
        } flex-col w-full lg:w-[340px] xl:w-[380px] shrink-0 border-r`}
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <RevenueThreadList
          threads={filteredThreads}
          selectedThreadId={selectedThread?.id ?? null}
          onSelectThread={handleSelectThread}
          sortMode={sortMode}
          onSortChange={setSortMode}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* CENTER: Conversation */}
      <div
        className={`${
          mobileView === "list" || mobileView === "profile" ? "hidden lg:flex" : "flex"
        } flex-col flex-1 min-w-0`}
      >
        <RevenueThreadPanel
          thread={selectedThread}
          onBack={() => setMobileView("list")}
          onOpenProfile={() => setMobileView("profile")}
          onGenerateSuggestion={handleGenerateSuggestion}
          onApproveSuggestion={handleApproveSuggestion}
          onEditSuggestion={handleEditSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
          onMarkSensitive={handleMarkSensitive}
          onDoNotContact={handleDoNotContact}
          onEscalate={handleEscalate}
          isGenerating={isGenerating}
          aiSuggestion={aiSuggestion}
          suggestionReasoning={suggestionReasoning}
        />
      </div>

      {/* RIGHT: Fan Opportunity + Attribution */}
      <div
        className={`${
          mobileView === "profile" ? "flex" : "hidden xl:flex"
        } flex-col w-full sm:w-[360px] shrink-0 border-l overflow-y-auto`}
        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "var(--color-ink, #1A1614)" }}
      >
        <FanOpportunityCard
          thread={selectedThread}
          onClose={() => setMobileView("list")}
        />
        {selectedThread && (
          <RevenueAttributionPanel thread={selectedThread} onAddNote={handleAddNote} />
        )}
      </div>
    </div>
  );
}
