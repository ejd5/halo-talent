// ─── Revenue Radar Page — WTF Companion ───────────────────
import { useState } from "react";
import { ChevronLeft, Radio, Search, DollarSign, MessageSquare, AlertTriangle, TrendingUp, Sparkles, Filter } from "lucide-react";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;
interface Props {
  navigate: NavigateFn;
}

const MOCK_RADAR_FANS = [
  { id: "1", name: "Alex_28", ltv: 420, online: true, risk: "low", status: "idle", lastMsg: "Il y a 2h", category: "whale" },
  { id: "2", name: "mike_fr", ltv: 285, online: true, risk: "medium", status: "typing", lastMsg: "En train d'écrire...", category: "active" },
  { id: "3", name: "sweet_p", ltv: 175, online: false, risk: "high", status: "offline", lastMsg: "Il y a 1j", category: "churn_risk" },
  { id: "4", name: "Marc_Paris", ltv: 850, online: true, risk: "low", status: "idle", lastMsg: "Il y a 10m", category: "whale" },
  { id: "5", name: "Lucas_UK", ltv: 95, online: true, risk: "low", status: "idle", lastMsg: "Il y a 5m", category: "new" },
  { id: "6", name: "David_Vip", ltv: 1250, online: false, risk: "medium", status: "offline", lastMsg: "Il y a 3j", category: "whale" },
];

export function RevenueRadarPage({ navigate }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "online" | "whale" | "risk">("all");

  const filteredFans = MOCK_RADAR_FANS.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === "online" && !f.online) return false;
    if (selectedCategory === "whale" && f.category !== "whale") return false;
    if (selectedCategory === "risk" && f.risk !== "high" && f.risk !== "medium") return false;

    return true;
  });

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}
      >
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Radio size={14} className="animate-pulse" style={{ color: "#C75B39" }} />
          <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Revenue Radar</h1>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="shrink-0 p-3 space-y-2 border-b" style={{ borderColor: "var(--border-default)" }}>
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <Search size={13} style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Rechercher un fan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[11px] outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto">
          {([
            { id: "all", label: "Tout" },
            { id: "online", label: "En ligne" },
            { id: "whale", label: "Whales 👑" },
            { id: "risk", label: "À surveiller ⚠️" },
          ] as const).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              style={{
                backgroundColor: selectedCategory === cat.id ? "var(--accent-soft)" : "var(--bg-card)",
                color: selectedCategory === cat.id ? "var(--accent)" : "var(--text-secondary)",
                border: selectedCategory === cat.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid var(--border-default)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fans list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredFans.length > 0 ? (
          filteredFans.map((fan) => (
            <div
              key={fan.id}
              className="p-3 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                background: fan.online
                  ? "linear-gradient(135deg, rgba(16,185,129,0.02) 0%, var(--bg-card) 60%)"
                  : "var(--bg-card)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: fan.category === "whale" ? "rgba(216,169,91,0.12)" : "rgba(199,91,57,0.12)",
                      color: fan.category === "whale" ? "#D8A95B" : "#C75B39",
                      border: fan.category === "whale" ? "1px solid rgba(216,169,91,0.2)" : "none",
                    }}
                  >
                    {fan.name[0].toUpperCase()}
                  </div>
                  {fan.online && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0B]"
                      style={{ backgroundColor: "#10B981" }}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {fan.name}
                    </span>
                    {fan.category === "whale" && (
                      <span className="text-[8px] px-1 font-bold rounded" style={{ backgroundColor: "rgba(216,169,91,0.1)", color: "#D8A95B" }}>
                        WHALE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                    <span style={{ fontFamily: "monospace" }}>LTV {fan.ltv}€</span>
                    <span>•</span>
                    <span>{fan.lastMsg}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Risk indicator */}
                <div
                  className="text-[8px] px-1.5 py-0.5 font-bold rounded"
                  style={{
                    backgroundColor:
                      fan.risk === "low"
                        ? "rgba(16,185,129,0.08)"
                        : fan.risk === "medium"
                        ? "rgba(245,158,11,0.08)"
                        : "rgba(239,68,68,0.08)",
                    color: fan.risk === "low" ? "#10B981" : fan.risk === "medium" ? "#F59E0B" : "#EF4444",
                  }}
                >
                  {fan.risk === "low" ? "Fidèle" : fan.risk === "medium" ? "Moyen" : "Risque"}
                </div>

                {fan.online ? (
                  <button
                    onClick={() => navigate("chat-assist")}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold transition-all hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
                      color: "#fff",
                    }}
                  >
                    <MessageSquare size={10} />
                    Chat
                  </button>
                ) : (
                  <button
                    onClick={() => navigate({ route: "fan-profile", params: { fanId: fan.id } })}
                    className="px-2.5 py-1.5 text-[10px] font-medium transition-all"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    Profil
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Radio size={24} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Aucun fan dans le radar correspondant aux filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
