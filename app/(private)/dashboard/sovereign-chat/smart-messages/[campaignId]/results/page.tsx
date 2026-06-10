"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, XCircle, Clock, BarChart3, TrendingUp, Users } from "lucide-react";

interface CampaignResults {
  campaign: any;
  analytics: {
    total: number;
    validated: number;
    sent: number;
    rejected: number;
    pending: number;
    completion_pct: number;
    approaches: Record<string, { total: number; sent: number; rejected: number }>;
  };
}

export default function CampaignResultsPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const [results, setResults] = useState<CampaignResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sovereign-chat/smart-messages/results?campaign_id=${campaignId}`)
      .then((r) => r.json())
      .then((d) => setResults(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
        <div className="h-8 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>Résultats introuvables</p>
      </div>
    );
  }

  const { campaign, analytics } = results;
  const approachEntries = Object.entries(analytics.approaches || {});

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/sovereign-chat/smart-messages" className="transition-all hover:opacity-70">
          <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
        </Link>
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Résultats
          </h1>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            {campaign?.name || "Smart Message"} · {new Date(campaign?.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <BarChart3 size={12} className="mb-1" style={{ color: "rgba(245,240,235,0.2)" }} />
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{analytics.total}</p>
          <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Total drafts</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.06)", border: "1px solid rgba(122,154,101,0.1)" }}>
          <Send size={12} className="mb-1" style={{ color: "var(--success)" }} />
          <p className="text-lg font-semibold" style={{ color: "var(--success)" }}>{analytics.sent}</p>
          <p className="text-[8px]" style={{ color: "rgba(122,154,101,0.5)" }}>Envoyés</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(196,69,54,0.06)", border: "1px solid rgba(196,69,54,0.1)" }}>
          <XCircle size={12} className="mb-1" style={{ color: "var(--danger)" }} />
          <p className="text-lg font-semibold" style={{ color: "var(--danger)" }}>{analytics.rejected}</p>
          <p className="text-[8px]" style={{ color: "rgba(196,69,54,0.5)" }}>Rejetés</p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)" }}>
          <TrendingUp size={12} className="mb-1" style={{ color: "var(--accent)" }} />
          <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{analytics.completion_pct}%</p>
          <p className="text-[8px]" style={{ color: "rgba(199,91,57,0.5)" }}>Complétion</p>
        </div>
      </div>

      {/* Sent rate */}
      <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.04)", border: "1px solid rgba(122,154,101,0.1)" }}>
        <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(122,154,101,0.5)" }}>Taux d'envoi</p>
        <div className="h-2 w-full" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
          <div
            className="h-full"
            style={{
              width: `${analytics.total > 0 ? (analytics.sent / analytics.total) * 100 : 0}%`,
              backgroundColor: "var(--success)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[8px]">
          <span style={{ color: "rgba(245,240,235,0.2)" }}>Rejeté: {analytics.rejected}</span>
          <span style={{ color: "rgba(245,240,235,0.2)" }}>En attente: {analytics.pending}</span>
        </div>
      </div>

      {/* Approach breakdown */}
      {approachEntries.length > 0 && (
        <div>
          <h2 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>
            Performance par approche
          </h2>
          <div className="space-y-1">
            {approachEntries.map(([approach, data]) => {
              const sentRate = data.total > 0 ? Math.round((data.sent / data.total) * 100) : 0;
              return (
                <div key={approach}
                  className="flex items-center justify-between p-2.5"
                  style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}
                >
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {approach}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                      {data.total} drafts
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--success)" }}>
                      {sentRate}% envoyé
                    </span>
                    {sentRate >= 70 && (
                      <span className="text-[8px] px-1 py-0.5" style={{ backgroundColor: "rgba(122,154,101,0.1)", color: "var(--success)" }}>
                        Top performer
                      </span>
                    )}
                    {sentRate <= 30 && data.total > 0 && (
                      <span className="text-[8px] px-1 py-0.5" style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)" }}>
                        À améliorer
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign info */}
      <div className="p-3 text-[9px] space-y-1" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.2)" }}>
        <p>Plateforme : {campaign?.platform || "N/A"}</p>
        <p>Tonalité : {campaign?.tone || "N/A"}</p>
        <p>Objectif : {campaign?.goal || "N/A"}</p>
        {campaign?.completed_at && <p>Terminé le : {new Date(campaign.completed_at).toLocaleDateString("fr-FR")}</p>}
      </div>
    </div>
  );
}
