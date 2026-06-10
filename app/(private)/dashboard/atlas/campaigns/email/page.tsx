"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Loader, Plus, Send, BarChart3, Clock, Eye, MousePointerClick,
  MoreHorizontal, Play, Pause, Trash2, FileText, AlertCircle,
  Search, Filter, CheckCircle, XCircle, Calendar,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  goal: string | null;
  recipients_count: number;
  schedule_at: string | null;
  personalize_with_ai: boolean;
  audience_segment: { id: string; name: string } | null;
  sent_at: string | null;
  created_at: string;
  stats: {
    total: number;
    sent: number;
    opened: number;
    open_rate: number;
    clicked: number;
    click_rate: number;
    unsubscribed: number;
  };
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", label: "Brouillon" },
  scheduled: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", label: "Programmée" },
  sending: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "En cours" },
  sent: { bg: "rgba(16,185,129,0.15)", color: "var(--success)", label: "Envoyée" },
  paused: { bg: "rgba(239,68,68,0.15)", color: "var(--danger)", label: "Pausée" },
  failed: { bg: "rgba(239,68,68,0.15)", color: "var(--danger)", label: "Échouée" },
};

const TYPE_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  new_content: "Nouveau contenu",
  promo_ppv: "Promo PPV",
  welcome: "Welcome",
  reengagement: "Re-engagement",
  birthday: "Anniversaire",
  custom: "Custom",
};

export default function EmailCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/dashboard/atlas/campaigns?${params}`);
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setCampaigns(data.campaigns ?? []);
    } catch (e: any) {
      setError(e.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  async function deleteCampaign(id: string, name: string) {
    if (!confirm(`Supprimer la campagne "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/dashboard/atlas/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erreur");
        return;
      }
      fetchCampaigns();
    } catch {}
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Email Marketing
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Crée, envoie et tracke tes campagnes email
          </p>
        </div>
        <Link
          href="/dashboard/atlas/campaigns/new?channel=email"
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={14} /> Nouvelle campagne
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-sm outline-none cursor-pointer"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: statusFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid transparent" }}
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="scheduled">Programmée</option>
          <option value="sending">En cours</option>
          <option value="sent">Envoyée</option>
          <option value="paused">Pausée</option>
          <option value="failed">Échouée</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-sm outline-none cursor-pointer"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", color: typeFilter ? "var(--text-primary)" : "rgba(255,255,255,0.3)", border: "1px solid transparent" }}
        >
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle size={24} style={{ color: "rgba(239,68,68,0.3)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>{error}</p>
          <button onClick={fetchCampaigns} className="mt-3 text-xs px-3 py-1.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>Réessayer</button>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center border border-dashed" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Send size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3 font-medium" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune campagne email</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>Crée ta première campagne pour atteindre tes fans</p>
          <Link href="/dashboard/atlas/campaigns/new?channel=email"
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
            <Plus size={14} /> Créer une campagne
          </Link>
        </div>
      ) : (
        <div className="border overflow-x-auto" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Campagne</th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Audience</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Envoyés</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Open</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Click</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Date</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {campaigns.map((c) => {
                const st = STATUS_STYLES[c.status] || STATUS_STYLES.draft;
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/atlas/campaigns/email/${c.id}`)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                          <Mail size={14} style={{ color: "var(--accent)" }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {TYPE_LABELS[c.type] || c.type}
                            {c.personalize_with_ai && " · IA personnalisée"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {c.audience_segment?.name || "Custom"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs" style={{ color: "var(--text-primary)" }}>
                      {c.stats.sent || c.recipients_count || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {c.stats.sent > 0 ? (
                        <span className="text-xs" style={{ color: c.stats.open_rate > 30 ? "var(--success)" : "rgba(255,255,255,0.5)" }}>
                          {c.stats.open_rate}%
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {c.stats.clicked > 0 ? (
                        <span className="text-xs" style={{ color: c.stats.click_rate > 10 ? "var(--success)" : "rgba(255,255,255,0.5)" }}>
                          {c.stats.click_rate}%
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {c.sent_at
                        ? new Date(c.sent_at).toLocaleDateString("fr-FR")
                        : new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id, c.name); }}
                        className="p-1 rounded-sm hover:bg-white/[0.05] transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {campaigns.length > 0 && (
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span>{campaigns.length} campagne{campaigns.length > 1 ? "s" : ""}</span>
          {campaigns.filter((c) => c.status === "sent").length > 0 && (
            <span>{campaigns.filter((c) => c.status === "sent").length} envoyée(s)</span>
          )}
          {campaigns.filter((c) => c.status === "draft").length > 0 && (
            <span>{campaigns.filter((c) => c.status === "draft").length} brouillon(s)</span>
          )}
        </div>
      )}
    </div>
  );
}
