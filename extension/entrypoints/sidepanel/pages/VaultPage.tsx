// ─── Vault Page — Halo Companion ───────────

import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft, Search, Image, Video,
  ArrowUpDown, Send, Check, X,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import { searchVault } from "../lib/messaging";
import { VAULT_TYPE_LABELS, type VaultItem } from "@/src/types/vault";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

type SortKey = "revenue" | "date" | "conversion";
type SentimentFilter = "all" | "not_sent" | "sent_purchased" | "sent_not_purchased";

export function VaultPage({ navigate }: Props) {
  const { vaultResults, setVaultResults, isVaultLoading, fanContext } = useCompanionStore();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("revenue");
  const [filter, setFilter] = useState<SentimentFilter>("all");

  const doSearch = useCallback(async () => {
    if (!query.trim()) {
      const results = await searchVault("*");
      setVaultResults(results);
    } else {
      const results = await searchVault(query);
      setVaultResults(results);
    }
  }, [query]);

  useEffect(() => {
    doSearch();
  }, []);

  const handleSearch = () => {
    if (query.trim()) doSearch();
  };

  const results = vaultResults.map(r => r.item);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Vault</h1>
      </header>

      {/* Search */}
      <div className="shrink-0 p-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Search size={14} style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Rechercher par tag, type..."
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button onClick={handleSearch}
            className="text-[10px] font-medium px-2 py-1 rounded-md"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            Chercher
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-3 pb-2 flex gap-2 overflow-x-auto">
        {([
          { id: "all", label: "Tout" },
          { id: "not_sent", label: "Non envoyé à ce fan" },
          { id: "sent_purchased", label: "Acheté" },
        ] as { id: SentimentFilter; label: string }[]).map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors"
            style={{
              backgroundColor: filter === f.id ? "var(--accent-soft)" : "var(--bg-card)",
              color: filter === f.id ? "var(--accent)" : "var(--text-secondary)",
            }}>
            {f.label}
          </button>
        ))}
        <div className="w-px mx-1" style={{ backgroundColor: "var(--border-default)" }} />
        <button onClick={() => setSortBy(sortBy === "revenue" ? "date" : sortBy === "date" ? "conversion" : "revenue")}
          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full whitespace-nowrap"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)" }}>
          <ArrowUpDown size={10} />
          {sortBy === "revenue" ? "Revenus" : sortBy === "date" ? "Date" : "Conversion"}
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {isVaultLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl aspect-square animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {results.map((item) => (
              <VaultThumb key={item.id} item={item} fanName={fanContext?.displayName} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Image size={28} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {query ? "Aucun résultat" : "Recherchez dans votre vault"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function VaultThumb({ item, fanName }: { item: VaultItem; fanName?: string }) {
  const sentToFan = Math.random() > 0.5; // Simulated — in production from API
  const purchased = sentToFan && Math.random() > 0.4;

  return (
    <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      {/* Thumbnail */}
      <div className="aspect-square flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-surface)" }}>
        {item.type === "video" ? <Video size={28} style={{ color: "var(--text-tertiary)" }} />
          : <Image size={28} style={{ color: "var(--text-tertiary)" }} />}
      </div>
      {/* Info */}
      <div className="p-2">
        <p className="text-[10px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.title}</p>
        <p className="text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {VAULT_TYPE_LABELS[item.type] ?? item.type}
          {item.usageCount > 0 && ` · ${item.usageCount}x envoyé`}
        </p>
        {/* Sent to fan badge */}
        {fanName && (
          <div className="mt-1.5 flex items-center gap-1">
            {sentToFan ? (
              purchased ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                  style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}>
                  <Check size={9} /> Acheté
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "var(--danger)" }}>
                  <X size={9} /> Non acheté
                </span>
              )
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                ~15€ suggéré
              </span>
            )}
          </div>
        )}
        {/* Send button */}
        {!sentToFan && fanName && (
          <button className="w-full mt-1.5 flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-medium transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            <Send size={10} /> Envoyer PPV
          </button>
        )}
      </div>
    </div>
  );
}
