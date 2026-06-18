"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Globe } from "lucide-react";
import { FanRiskBadge } from "@/components/chat-ai/FanRiskBadge";
import { FanBrainDrawer } from "@/components/chat-ai/FanBrainDrawer";
import { EmptyState } from "@/components/chat-ai/EmptyState";

interface Fan {
  id: string; pseudonym: string; platform: string; language: string;
  status: string; ltv: number; spend_30d: number;
  relationship_score: number; commercial_score: number;
  churn_risk: number; intent_score: number;
  preferences?: string[]; avoid_topics?: string[];
  risk_flags: string[]; notes?: string;
}

export default function ChatAIFansPage() {
  const [fans, setFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sortBy, setSortBy] = useState<"ltv" | "churn_risk" | "intent_score" | "pseudonym">("ltv");
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const fetchFans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (statusFilter) params.set("status", statusFilter);
      if (platformFilter) params.set("platform", platformFilter);

      const res = await fetch(`/api/chat-ai/fans?${params.toString()}`);
      const data = await res.json();
      setFans(data.fans || []);
    } catch (err) {
      console.error("[CHATEENG Fans] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, platformFilter]);

  useEffect(() => {
    async function init() {
      await fetchFans();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFanClick = async (fan: Fan) => {
    setSelectedFan(fan);
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const res = await fetch(`/api/chat-ai/fans?fanId=${fan.id}`);
      const data = await res.json();
      if (data.fan) setSelectedFan(data.fan);
    } catch (err) {
      console.error("[CHATEENG Fans] Detail fetch error:", err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const filtered = fans.filter((f) => {
    if (search && !f.pseudonym.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "pseudonym") return a.pseudonym.localeCompare(b.pseudonym);
    return (b[sortBy] as number) - (a[sortBy] as number);
  });

  const statuses = ["", "new", "active", "vip", "whale", "dormant", "churn_risk", "do_not_contact"];
  const platforms = ["", "onlyfans", "mym", "fansly", "fanvue"];

  const selectStyle: React.CSSProperties = {
    padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(245,240,235,0.08)",
    background: "rgba(245,240,235,0.03)", color: "rgba(245,240,235,0.6)", fontSize: 10,
    cursor: "pointer", minWidth: 90,
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
          fontFamily: "var(--font-display)", letterSpacing: "-0.02em", marginBottom: 4,
        }}>
          Fan Brain
        </h1>
        <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)", maxWidth: 480 }}>
          Profils enrichis, scores et signaux comportementaux pour chaque fan.
        </p>
      </div>

      {/* Filters toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 5,
          border: "1px solid rgba(245,240,235,0.08)", background: "rgba(245,240,235,0.02)",
          flex: "0 1 220px",
        }}>
          <Search size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un fan..."
            style={{
              border: "none", background: "none", color: "var(--text-primary)",
              fontSize: 11, outline: "none", width: "100%",
            }}
          />
        </div>

        <Filter size={12} style={{ color: "rgba(245,240,235,0.3)" }} />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">Tous statuts</option>
          {statuses.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>

        <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={selectStyle}>
          <option value="">Toutes plateformes</option>
          {platforms.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={selectStyle}
        >
          <option value="ltv">LTV décroissant</option>
          <option value="churn_risk">Risque churn</option>
          <option value="intent_score">Intention</option>
          <option value="pseudonym">Nom</option>
        </select>

        <span style={{ fontSize: 9, color: "rgba(245,240,235,0.2)", marginLeft: "auto" }}>
          {filtered.length} fans
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              height: 48, borderRadius: 6, background: "rgba(245,240,235,0.02)",
              animation: "pulse 2s infinite",
            }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucun fan trouvé"
          description="Aucun fan ne correspond aux filtres sélectionnés."
        />
      ) : (
        /* Fan table */
        <div style={{
          border: "1px solid rgba(245,240,235,0.06)", borderRadius: 8, overflowX: "auto",
        }}>
          <div style={{ minWidth: 640 }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "minmax(150px, 2fr) 80px 60px 90px 90px 80px 80px 80px",
            gap: 8, padding: "8px 14px", borderBottom: "1px solid rgba(245,240,235,0.04)",
            background: "rgba(245,240,235,0.015)",
          }}>
            {["Fan", "Plateforme", "Langue", "Statut", "LTV", "Intention", "Churn", "Relation"].map((h) => (
              <span key={h} style={{ fontSize: 9, fontWeight: 600, color: "rgba(245,240,235,0.25)", textTransform: "uppercase" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {filtered.map((fan) => (
            <button
              key={fan.id}
              onClick={() => handleFanClick(fan)}
              style={{
                display: "grid", gridTemplateColumns: "minmax(150px, 2fr) 80px 60px 90px 90px 80px 80px 80px",
                gap: 8, padding: "10px 14px", width: "100%", textAlign: "left",
                border: "none", borderBottom: "1px solid rgba(245,240,235,0.02)",
                background: "transparent", cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(245,240,235,0.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{fan.pseudonym}</span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
                <Globe size={9} />{fan.platform}
              </span>
              <span style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", display: "flex", alignItems: "center" }}>
                {fan.language?.toUpperCase()}
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <FanRiskBadge status={fan.status} riskFlags={fan.risk_flags} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", display: "flex", alignItems: "center" }}>
                {fan.ltv}€
              </span>
              <ScoreCell value={fan.intent_score} color="#60a5fa" />
              <ScoreCell value={fan.churn_risk} color={fan.churn_risk > 70 ? "#f87171" : "#f59e0b"} />
              <ScoreCell value={fan.relationship_score} color="#34d399" />
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Fan detail drawer */}
      <FanBrainDrawer
        fan={selectedFan}
        open={drawerOpen}
        loading={drawerLoading}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

function ScoreCell({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(245,240,235,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, borderRadius: 2, background: color }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, color, minWidth: 24, textAlign: "right" }}>{value}</span>
    </div>
  );
}
