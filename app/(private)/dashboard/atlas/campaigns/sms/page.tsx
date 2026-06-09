"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Smartphone, Loader, Plus, Send, Clock, DollarSign,
  AlertCircle, CheckCircle, X, Users, MessageSquare,
  ArrowLeft, Eye, Trash2, BarChart3,
} from "lucide-react";

interface Campaign {
  id: string; name: string; type: string; status: string;
  message_text: string | null; recipients_count: number;
  sms_cost_estimate: number; sms_cost_actual: number;
  customize_with_ai: boolean;
  schedule_at: string | null; sent_at: string | null; created_at: string;
  audience_segment: { id: string; name: string } | null;
  stats: { total: number; sent: number; opened: number; open_rate: number; clicked: number; click_rate: number; failed: number };
}

const STATUS_BADGES: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", label: "Brouillon" },
  scheduled: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", label: "Programmée" },
  sending: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "En cours" },
  sent: { bg: "rgba(16,185,129,0.15)", color: "#10B981", label: "Envoyée" },
  paused: { bg: "rgba(239,68,68,0.15)", color: "#E5484D", label: "Pausée" },
  failed: { bg: "rgba(239,68,68,0.15)", color: "#E5484D", label: "Échouée" },
};

export default function SMSCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  // Compose form
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [estimatedCount, setEstimatedCount] = useState<number | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch("/api/dashboard/atlas/campaigns?type=sms");
      if (!res.ok) throw new Error("Erreur chargement");
      const d = await res.json();
      setCampaigns(d.campaigns ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/atlas/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, type: "sms", goal: "engagement",
          message_text: message,
          content: { blocks: [{ type: "text", content: message }] },
          status: "draft",
        }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Erreur"); return; }
      const d = await res.json();
      setShowCompose(false);
      setName(""); setMessage("");
      router.push(`/dashboard/atlas/campaigns/email/${d.campaign.id}`);
    } catch { alert("Erreur"); }
    finally { setSaving(false); }
  }

  async function deleteCampaign(id: string) {
    if (!confirm("Supprimer cette campagne SMS ?")) return;
    try {
      await fetch(`/api/dashboard/atlas/campaigns/${id}`, { method: "DELETE" });
      fetchCampaigns();
    } catch {}
  }

  const charsLeft = 160 - (message.length % 160 || 160);
  const segments = message.length === 0 ? 0 : Math.ceil(message.length / 160);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>SMS Marketing</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Campagnes SMS — Opt-in obligatoire · Mention STOP requise
          </p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "#C75B39", color: "#FFFFFF" }}
        >
          {showCompose ? <X size={14} /> : <Plus size={14} />}
          {showCompose ? "Annuler" : "Nouveau SMS"}
        </button>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <form onSubmit={handleCreate} className="p-5 rounded-sm space-y-4" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom de la campagne</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-sm outline-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#FFFFFF", border: "1px solid transparent" }}
              placeholder="Ex: Promo été" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Message</label>
              <div className="flex items-center gap-2 text-[10px]">
                <span style={{ color: message.length > 160 ? "#E5484D" : "rgba(255,255,255,0.2)" }}>
                  {message.length} / {segments > 1 ? `${segments * 160} (${segments} seg.)` : "160"}
                </span>
                {segments > 1 && <span style={{ color: "#E5484D" }}>{segments} segments → coût ×{segments}</span>}
              </div>
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              rows={4} maxLength={960}
              className="w-full text-sm px-3 py-2 rounded-sm outline-none resize-none"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#FFFFFF", border: "1px solid transparent" }}
              placeholder="Écris ton message SMS... (160 caratères par segment)" />
            <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              <span>Variables :</span>
              <code style={{ color: "#C75B39" }}>{`{{first_name}}`}</code>
              <code style={{ color: "#C75B39" }}>{`{{tier}}`}</code>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-sm text-xs" style={{ backgroundColor: "rgba(245,158,11,0.06)", color: "rgba(255,255,255,0.4)" }}>
              ⚠️ Les fans US/CA recevront automatiquement "Reply STOP to unsubscribe"
            </div>
          </div>

          <button type="submit" disabled={saving || !name.trim() || !message.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "#C75B39", color: "#FFFFFF" }}>
            {saving ? <><Loader size={14} className="animate-spin" /> Création...</> : <><Send size={14} /> Créer la campagne SMS</>}
          </button>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle size={24} style={{ color: "rgba(239,68,68,0.3)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>{error}</p>
          <button onClick={fetchCampaigns} className="mt-3 text-xs px-3 py-1.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "#C75B39" }}>Réessayer</button>
        </div>
      ) : campaigns.length === 0 && !showCompose ? (
        <div className="flex flex-col items-center py-16 text-center border border-dashed" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Smartphone size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3 font-medium" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune campagne SMS</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>Crée ta première campagne pour atteindre tes fans par SMS</p>
          <button onClick={() => setShowCompose(true)}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm rounded-sm"
            style={{ background: "#C75B39", color: "#FFFFFF" }}>
            <Plus size={14} /> Créer une campagne
          </button>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="border overflow-x-auto" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Campagne</th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Message</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Envoyés</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Coût</th>
                <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>Date</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {campaigns.map((c) => {
                const st = STATUS_BADGES[c.status] || STATUS_BADGES.draft;
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/atlas/campaigns/email/${c.id}`)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
                          <Smartphone size={14} style={{ color: "#10B981" }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{c.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{c.message_text || "(aucun message)"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs" style={{ color: "#FFFFFF" }}>{c.stats?.sent || c.recipients_count || "-"}</td>
                    <td className="px-4 py-3.5 text-right text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {c.sms_cost_actual > 0 ? `${c.sms_cost_actual.toFixed(2)}€` : c.sms_cost_estimate > 0 ? `~${c.sms_cost_estimate.toFixed(2)}€` : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {c.sent_at ? new Date(c.sent_at).toLocaleDateString("fr-FR") : new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}
                        className="p-1 rounded-sm hover:bg-white/[0.05] transition-colors" title="Supprimer">
                        <Trash2 size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {campaigns.length > 0 && (
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span>{campaigns.length} campagne{campaigns.length > 1 ? "s" : ""}</span>
          <span>{campaigns.reduce((s, c) => s + (c.stats?.sent || 0), 0)} SMS envoyés</span>
          <span>Coût total : {campaigns.reduce((s, c) => s + (c.sms_cost_actual || 0), 0).toFixed(2)}€</span>
        </div>
      )}
    </div>
  );
}
