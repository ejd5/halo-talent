"use client";

import { useState } from "react";
import { Brain, RefreshCw, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { formatEuro } from "../../creators/utils";
import type { Forecast } from "../types";

export function ForecastTab() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/forecast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          revenueData: [
            { month: "Juil", total_gross: 85000, total_commission: 12750, total_net: 72250 },
            { month: "Août", total_gross: 92000, total_commission: 13800, total_net: 78200 },
            { month: "Sep", total_gross: 88000, total_commission: 13200, total_net: 74800 },
            { month: "Oct", total_gross: 95000, total_commission: 14250, total_net: 80750 },
            { month: "Nov", total_gross: 102000, total_commission: 15300, total_net: 86700 },
            { month: "Déc", total_gross: 115000, total_commission: 17250, total_net: 97750 },
            { month: "Jan", total_gross: 78000, total_commission: 11700, total_net: 66300 },
            { month: "Fév", total_gross: 82000, total_commission: 12300, total_net: 69700 },
            { month: "Mar", total_gross: 91000, total_commission: 13650, total_net: 77350 },
            { month: "Avr", total_gross: 98000, total_commission: 14700, total_net: 83300 },
            { month: "Mai", total_gross: 105000, total_commission: 15750, total_net: 89250 },
            { month: "Jun", total_gross: 110000, total_commission: 16500, total_net: 93500 },
          ],
          platformSummary: {
            OnlyFans: { revenue: 420000, share: 35 },
            YouTube: { revenue: 280000, share: 23 },
            Instagram: { revenue: 240000, share: 20 },
            TikTok: { revenue: 150000, share: 12 },
            others: { revenue: 120000, share: 10 },
          },
          creatorCount: 7,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setForecast(data as Forecast);
      }
    } catch {
      setError("Erreur de connexion à l'API de prévision");
    } finally {
      setLoading(false);
    }
  };

  if (!forecast && !loading && !error) {
    return (
      <div className="text-center py-16" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <Brain size={40} strokeWidth={1.5} style={{ color: "#E0D8D0" }} className="mx-auto mb-4" />
        <p className="font-display text-lg font-bold mb-2" style={{ color: "#F5F0EB" }}>
          Prévisions IA
        </p>
        <p className="text-sm font-sans mb-6" style={{ color: "#F5F0EB" }}>
          Analyse prédictive basée sur les 12 derniers mois de données
        </p>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mx-auto transition-colors hover:opacity-90"
          style={{ background: "#C75B39", color: "#F5F0EB" }}
        >
          <Brain size={14} strokeWidth={1.5} />
          Générer les prévisions
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="animate-pulse">
              <div className="h-3 w-24 mb-3" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-8 w-40 mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-4 w-32" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <AlertTriangle size={32} strokeWidth={1.5} style={{ color: "#C44536" }} className="mx-auto mb-3" />
        <p className="text-sm font-sans mb-4" style={{ color: "#D0CCC6" }}>{error}</p>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mx-auto transition-colors"
          style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
        >
          <RefreshCw size={12} strokeWidth={1.5} />
          Réessayer
        </button>
      </div>
    );
  }

  const periods = [
    { key: "next_month", label: "Mois prochain", period: forecast!.next_month },
    { key: "next_quarter", label: "Trimestre prochain", period: forecast!.next_quarter },
    { key: "next_year", label: "Année prochaine", period: forecast!.next_year },
  ];

  const confidenceColors: Record<string, string> = {
    high: "#7A9A65",
    medium: "#C75B39",
    low: "#C44536",
  };

  return (
    <div className="space-y-6 card-accent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} strokeWidth={1.5} style={{ color: "#C75B39" }} />
          <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
            Prévisions générées par IA
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
          style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
        >
          <RefreshCw size={11} strokeWidth={1.5} className={loading ? "animate-spin" : ""} />
          Régénérer
        </button>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-3 gap-4">
        {periods.map(({ key, label, period }) => (
          <div key={key} className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "#F5F0EB" }}>
              {label}
            </p>
            <p className="font-display text-2xl font-bold mb-1" style={{ color: "#F5F0EB" }}>
              {formatEuro(period.estimate)}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                {formatEuro(period.lower_bound)} – {formatEuro(period.upper_bound)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5" style={{ background: confidenceColors[period.confidence] }} />
              <span className="text-[10px] font-sans capitalize" style={{ color: confidenceColors[period.confidence] }}>
                Confiance {period.confidence === "high" ? "élevée" : period.confidence === "medium" ? "moyenne" : "faible"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="font-display text-base font-bold mb-2" style={{ color: "#F5F0EB" }}>
          Résumé
        </p>
        <p className="text-sm font-sans leading-relaxed" style={{ color: "#E0D8D0" }}>
          {forecast!.summary}
        </p>
      </div>

      {/* Risks & Opportunities */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={12} strokeWidth={1.5} style={{ color: "#C44536" }} />
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
              Risques
            </p>
          </div>
          <ul className="space-y-2">
            {forecast!.risk_factors.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
                <span className="text-[10px] font-semibold shrink-0" style={{ color: "#C44536" }}>!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={12} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em]" style={{ color: "#F5F0EB" }}>
              Opportunités
            </p>
          </div>
          <ul className="space-y-2">
            {forecast!.opportunities.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-sans" style={{ color: "#D0CCC6" }}>
                <span className="text-[10px] font-semibold shrink-0" style={{ color: "#7A9A65" }}>+</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
