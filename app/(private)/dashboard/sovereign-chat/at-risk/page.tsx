"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle, Users, DollarSign, TrendingDown, Send,
  MessageSquare, Shield, ArrowRight, Zap, Filter, RefreshCw,
} from "lucide-react";

interface AtRiskFan {
  fan: Record<string, any>;
  churn: {
    score: number;
    level: string;
    factors: string[];
    recommended_action: string;
    potential_loss: number;
  };
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Critique", color: "var(--danger)", bg: "rgba(196,69,54,0.1)" },
  high: { label: "Élevé", color: "var(--accent)", bg: "rgba(199,91,57,0.1)" },
  medium: { label: "Modéré", color: "var(--text-primary)", bg: "rgba(245,240,235,0.04)" },
  low: { label: "Faible", color: "var(--success)", bg: "rgba(122,154,101,0.1)" },
};

const ACTION_LABELS: Record<string, string> = {
  win_back_campaign_high_value: "Campagne win-back prioritaire",
  personal_outreach: "Contact personnalisé",
  engagement_content: "Contenu d'engagement",
  continue_normal: "Continuer stratégie",
};

export default function AtRiskPage() {
  const [data, setData] = useState<{ at_risk: AtRiskFan[]; total: number; total_fans: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/sovereign-chat/vault/at-risk");
      const d = await r.json();
      setData(d);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = data?.at_risk.filter((r) => {
    if (levelFilter && r.churn.level !== levelFilter) return false;
    return true;
  }) || [];

  const totalPotentialLoss = filtered.reduce((s, r) => s + (r.churn.potential_loss || 0), 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} style={{ color: "var(--danger)" }} />
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Fans à risque
          </h1>
          {data && (
            <span className="text-[10px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(196,69,54,0.1)", color: "var(--danger)" }}>
              {data.total} at-risk
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
          Fans avec risque de churn élevé — classés par perte potentielle
        </p>
      </div>

      {/* KPI row */}
      {data && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3" style={{ backgroundColor: "rgba(196,69,54,0.04)", border: "1px solid rgba(196,69,54,0.1)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--danger)" }}>{data.total}</p>
            <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>Fans à risque</p>
          </div>
          <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
              {Math.round((data.total / Math.max(data.total_fans, 1)) * 100)}%
            </p>
            <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>Taux d&apos;attrition potentiel</p>
          </div>
          <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.04)", border: "1px solid rgba(122,154,101,0.1)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--success)" }}>{totalPotentialLoss}€</p>
            <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>Perte potentielle estimée</p>
          </div>
        </div>
      )}

      {/* Filter + refresh */}
      <div className="flex items-center gap-2">
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          className="text-[10px] py-1.5 px-2 bg-transparent"
          style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <option value="">Tous les niveaux</option>
          <option value="critical">Critique</option>
          <option value="high">Élevé</option>
          <option value="medium">Modéré</option>
        </select>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1 text-[10px] py-1.5 px-2 disabled:opacity-30"
          style={{ color: "rgba(245,240,235,0.5)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Actualiser
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map((i) => <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <TrendingDown size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>Aucun fan à risque</p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>Tout va bien — tes fans sont engagés</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((item, i) => {
            const lvl = LEVEL_CONFIG[item.churn.level] || LEVEL_CONFIG.low;
            return (
              <div key={item.fan.id || i} className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-start justify-between gap-3">
                  {/* Fan info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center text-[8px] font-medium shrink-0" style={{ backgroundColor: lvl.bg, color: lvl.color }}>
                        {(item.fan.display_name || item.fan.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {item.fan.display_name || item.fan.email}
                      </span>
                      <span className="text-[8px] px-1 py-px" style={{ backgroundColor: lvl.bg, color: lvl.color }}>
                        {lvl.label} · {item.churn.score}/100
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {item.churn.factors.slice(0, 2).map((f, fi) => (
                        <span key={fi} className="text-[8px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                          • {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-[9px] mt-1" style={{ color: lvl.color }}>
                      <Zap size={8} className="inline mr-0.5" />
                      {ACTION_LABELS[item.churn.recommended_action] || item.churn.recommended_action}
                    </p>
                  </div>

                  {/* Loss value + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
                        {item.churn.potential_loss || 0}€
                      </p>
                      <p className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>perte potentielle</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        className="flex items-center gap-1 text-[9px] py-1 px-2 whitespace-nowrap"
                        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                        onClick={() => window.location.href = `/dashboard/atlas/fans/${item.fan.id}`}>
                        <MessageSquare size={9} /> Contacter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
