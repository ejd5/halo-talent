"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { filterConversations, sortConversations } from "@/lib/mock/chat-copilot";
import type { ChatConversation, FilterTab, SortMode } from "@/lib/chat-copilot/types";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "unread", label: "Non lus" },
  { key: "vip", label: "VIP" },
  { key: "at_risk", label: "À risque" },
  { key: "pending", label: "En attente" },
];

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: "recent", label: "Récent" },
  { key: "ai_priority", label: "Priorité IA" },
  { key: "revenue_potential", label: "Revenu" },
];

export function ChatConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  sortMode,
  onSortChange,
  loading,
}: {
  conversations: ChatConversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  activeFilter: FilterTab;
  onFilterChange: (f: FilterTab) => void;
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  loading?: boolean;
}) {
  const [ready, setReady] = useState(true);

  const filtered = useMemo(
    () => sortConversations(filterConversations(conversations, activeFilter, search), sortMode),
    [conversations, activeFilter, search, sortMode],
  );

  if (loading || !ready) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="p-3 space-y-3">
          <Skeleton variant="text" />
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="text" className="flex-1 h-6" />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-2 p-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Skeleton variant="avatar" className="w-9 h-9" />
              <div className="flex-1 space-y-1.5">
                <Skeleton variant="text" className="h-3 w-24" />
                <Skeleton variant="text" className="h-2.5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-surface)" }}>
      {/* Header */}
      <div className="px-3 pt-3 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Messages
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            {filtered.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher..."
            className="w-full text-[12px] outline-none px-7 py-1.5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              borderRadius: "6px",
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-tertiary)" }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className="text-[11px] px-2 py-1 font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeFilter === tab.key ? "var(--accent)" : "var(--text-secondary)",
                borderBottom: activeFilter === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onSortChange(opt.key)}
              className="text-[10px] px-2 py-0.5 font-medium transition-colors"
              style={{
                backgroundColor: sortMode === opt.key ? "var(--accent-soft)" : "transparent",
                color: sortMode === opt.key ? "var(--accent)" : "var(--text-tertiary)",
                borderRadius: "4px",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--border-default)" }} />

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <span className="text-lg mb-2">💬</span>
            <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Aucune conversation trouvée
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
