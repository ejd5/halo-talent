"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Send, CheckCircle, Clock, AlertTriangle, XCircle, ChevronRight } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  segment_id: string;
  platform: string;
  total_drafts: number;
  validated_count: number;
  sent_count: number;
  rejected_count: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  generating: { label: "Génération...", color: "#C75B39", bg: "rgba(199,91,57,0.1)" },
  ready_for_validation: { label: "Prêt à valider", color: "#7A9A65", bg: "rgba(122,154,101,0.1)" },
  in_progress: { label: "En cours", color: "#C75B39", bg: "rgba(199,91,57,0.1)" },
  completed: { label: "Terminé", color: "rgba(245,240,235,0.3)", bg: "rgba(245,240,235,0.04)" },
  cancelled: { label: "Annulé", color: "#C44536", bg: "rgba(196,69,54,0.08)" },
};

export default function SmartMessagesPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sovereign-chat/smart-messages")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Smart Messages
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            Campagnes de messages personnalisés générés par IA et validés humainement
          </p>
        </div>
        <Link
          href="/dashboard/sovereign-chat/smart-messages/new"
          className="text-[10px] font-semibold py-2.5 px-4 transition-all hover:opacity-80 flex items-center gap-1.5"
          style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
        >
          <Plus size={12} />
          Nouvelle campagne
        </Link>
      </div>

      {/* Stats */}
      {!loading && campaigns.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Total</p>
            <p className="text-lg font-semibold mt-1" style={{ color: "#F5F0EB" }}>{campaigns.length}</p>
          </div>
          <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.06)", border: "1px solid rgba(122,154,101,0.1)" }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(122,154,101,0.5)" }}>Prêtes</p>
            <p className="text-lg font-semibold mt-1" style={{ color: "#7A9A65" }}>
              {campaigns.filter((c) => c.status === "ready_for_validation").length}
            </p>
          </div>
          <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)" }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(199,91,57,0.5)" }}>En cours</p>
            <p className="text-lg font-semibold mt-1" style={{ color: "#C75B39" }}>
              {campaigns.filter((c) => c.status === "generating" || c.status === "in_progress").length}
            </p>
          </div>
          <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Envoyés</p>
            <p className="text-lg font-semibold mt-1" style={{ color: "#F5F0EB" }}>
              {campaigns.reduce((s, c) => s + c.sent_count, 0)}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && campaigns.length === 0 && (
        <div className="p-8 text-center" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <Send size={24} className="mx-auto mb-2" style={{ color: "rgba(245,240,235,0.15)" }} />
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>Aucune campagne Smart Message</p>
          <Link
            href="/dashboard/sovereign-chat/smart-messages/new"
            className="inline-block mt-3 text-[10px] font-medium py-2 px-3"
            style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
          >
            Créer une campagne
          </Link>
        </div>
      )}

      {/* Campaign cards */}
      {!loading && campaigns.length > 0 && (
        <div className="space-y-2">
          {campaigns.map((camp) => {
            const cfg = STATUS_CONFIG[camp.status] || STATUS_CONFIG.completed;
            const progress = camp.total_drafts > 0
              ? Math.round((camp.validated_count / camp.total_drafts) * 100)
              : 0;

            return (
              <div
                key={camp.id}
                className="p-3 transition-all"
                style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium truncate" style={{ color: "#F5F0EB" }}>
                        {camp.name || "Sans nom"}
                      </span>
                      <span
                        className="text-[8px] px-1.5 py-0.5 uppercase tracking-wider shrink-0"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                      {camp.platform} · {camp.total_drafts} drafts · {new Date(camp.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-32 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                        {camp.validated_count}/{camp.total_drafts}
                      </span>
                      <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>{progress}%</span>
                    </div>
                    <div className="h-1 w-full" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: camp.status === "completed" ? "#7A9A65" : "#C75B39",
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {camp.status === "ready_for_validation" && (
                      <Link
                        href={`/dashboard/sovereign-chat/smart-messages/${camp.id}/validate`}
                        className="text-[9px] font-medium py-1.5 px-2.5 transition-all hover:opacity-80 flex items-center gap-1"
                        style={{ backgroundColor: "#7A9A65", color: "#F5F0EB" }}
                      >
                        Valider
                        <ChevronRight size={8} />
                      </Link>
                    )}
                    {(camp.status === "completed" || camp.status === "in_progress") && (
                      <Link
                        href={`/dashboard/sovereign-chat/smart-messages/${camp.id}/results`}
                        className="text-[9px] font-medium py-1.5 px-2.5 transition-all hover:opacity-70"
                        style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
                      >
                        Résultats
                      </Link>
                    )}
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
