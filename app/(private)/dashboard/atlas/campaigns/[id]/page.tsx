"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader, Send, Eye, MousePointerClick, Users,
  Clock, Calendar, Trash2, Play, AlertCircle, CheckCircle,
  XCircle, Mail, Activity, FileText, Smartphone, Monitor,
} from "lucide-react";

interface CampaignDetail {
  id: string;
  name: string;
  type: string;
  goal: string | null;
  status: string;
  subject: string | null;
  preheader: string | null;
  from_name: string | null;
  from_email: string | null;
  content: any;
  personalize_with_ai: boolean;
  schedule_at: string | null;
  throttle_hours: number;
  ab_test_enabled: boolean;
  recipients_count: number;
  sent_at: string | null;
  completed_at: string | null;
  created_at: string;
  audience_segment: { id: string; name: string } | null;
  stats: {
    total: number;
    sent: number;
    opened: number;
    open_rate: number;
    clicked: number;
    click_rate: number;
    failed: number;
    bounced: number;
  };
  recent_sends: {
    id: string;
    status: string;
    email_id: string | null;
    subject: string | null;
    sent_at: string | null;
    opened_at: string | null;
    clicked_at: string | null;
    error: string | null;
    fan: { id: string; display_name: string; email: string } | null;
  }[];
}

const STATUS_BADGES: Record<string, { bg: string; color: string; label: string }> = {
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

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  async function fetchCampaign() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/dashboard/atlas/campaigns/${id}`);
      if (!res.ok) throw new Error("Campagne introuvable");
      const data = await res.json();
      setCampaign(data.campaign);
    } catch (e: any) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!confirm("Lancer l'envoi de cette campagne ?")) return;
    setSending(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/dashboard/atlas/campaigns/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg(`❌ ${data.error || "Erreur"}`);
      } else {
        setActionMsg(`✅ Envoyée à ${data.total} fans (${data.failed} échecs)`);
        fetchCampaign();
      }
    } catch {
      setActionMsg("❌ Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  }

  async function handleTestSend() {
    setSending(true);
    try {
      const res = await fetch(`/api/dashboard/atlas/campaigns/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg("✅ Email de test envoyé !");
      } else {
        setActionMsg(`❌ ${data.error || "Erreur test"}`);
      }
    } catch {
      setActionMsg("❌ Erreur lors du test");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>;
  }

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <AlertCircle size={24} style={{ color: "rgba(239,68,68,0.3)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>{error || "Campagne introuvable"}</p>
        <Link href="/dashboard/atlas/campaigns/email" className="mt-3 text-xs px-3 py-1.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>
          Retour aux campagnes
        </Link>
      </div>
    );
  }

  const badge = STATUS_BADGES[campaign.status] || STATUS_BADGES.draft;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/atlas/campaigns/email" className="p-1 transition-opacity hover:opacity-70" style={{ color: "var(--text-primary)" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{campaign.name}</h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              {TYPE_LABELS[campaign.type] || campaign.type}
              {campaign.personalize_with_ai && " · IA personnalisée"}
              {campaign.schedule_at && ` · Programmée le ${new Date(campaign.schedule_at).toLocaleDateString("fr-FR")}`}
            </p>
          </div>
        </div>

        {/* Actions */}
        {campaign.status === "draft" && (
          <div className="flex items-center gap-2">
            <button onClick={handleTestSend} disabled={sending}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-sm transition-colors hover:bg-white/[0.05] disabled:opacity-40"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>
              <Mail size={12} /> Test
            </button>
            <button onClick={handleSend} disabled={sending}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-sm transition-all hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
              {sending ? <><Loader size={12} className="animate-spin" /> Envoi...</> : <><Send size={12} /> Envoyer</>}
            </button>
          </div>
        )}
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="p-3 rounded-sm text-xs" style={{ backgroundColor: actionMsg.startsWith("✅") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", color: actionMsg.startsWith("✅") ? "var(--success)" : "var(--danger)" }}>
          {actionMsg}
        </div>
      )}

      {/* Stats grid */}
      {campaign.stats.sent > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Envoyés" value={campaign.stats.sent.toLocaleString()} icon={Send} color="#3B82F6" />
          <StatCard label="Ouverture" value={`${campaign.stats.open_rate}%`} sub={campaign.stats.opened.toLocaleString()} icon={Eye} color="var(--success)" />
          <StatCard label="Clics" value={`${campaign.stats.click_rate}%`} sub={campaign.stats.clicked.toLocaleString()} icon={MousePointerClick} color="var(--accent)" />
          <StatCard label="Échecs" value={campaign.stats.failed.toLocaleString()} icon={AlertCircle} color="var(--danger)" />
        </div>
      )}

      {/* Detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Campaign info */}
        <div className="p-4 rounded-sm" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Détails</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Type</span>
              <span style={{ color: "var(--text-primary)" }}>{TYPE_LABELS[campaign.type] || campaign.type}</span>
            </div>
            {campaign.goal && (
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Objectif</span>
                <span style={{ color: "var(--text-primary)" }}>{campaign.goal}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Audience</span>
              <span style={{ color: "var(--text-primary)" }}>{campaign.audience_segment?.name || "Custom"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Destinataires</span>
              <span style={{ color: "var(--text-primary)" }}>{campaign.recipients_count || "-"}</span>
            </div>
            {campaign.throttle_hours && (
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Throttling</span>
                <span style={{ color: "var(--text-primary)" }}>{campaign.throttle_hours}h</span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.3)" }}>IA personnalisée</span>
              <span style={{ color: campaign.personalize_with_ai ? "var(--success)" : "rgba(255,255,255,0.3)" }}>{campaign.personalize_with_ai ? "Oui" : "Non"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.3)" }}>A/B Test</span>
              <span style={{ color: campaign.ab_test_enabled ? "var(--success)" : "rgba(255,255,255,0.3)" }}>{campaign.ab_test_enabled ? "Oui" : "Non"}</span>
            </div>
          </div>
        </div>

        {/* Subject & From */}
        <div className="p-4 rounded-sm" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Email</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>De :</span>
              <p style={{ color: "var(--text-primary)" }}>{campaign.from_name} &lt;{campaign.from_email}&gt;</p>
            </div>
            <div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Objet :</span>
              <p style={{ color: "var(--text-primary)" }}>{campaign.subject || "Sans objet"}</p>
            </div>
            {campaign.preheader && (
              <div>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Preheader :</span>
                <p style={{ color: "rgba(255,255,255,0.5)" }}>{campaign.preheader}</p>
              </div>
            )}
            <div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>Créée le :</span>
              <p style={{ color: "var(--text-primary)" }}>{new Date(campaign.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            {campaign.sent_at && (
              <div>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>Envoyée le :</span>
                <p style={{ color: "var(--text-primary)" }}>{new Date(campaign.sent_at).toLocaleDateString("fr-FR")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content preview */}
        <div className="p-4 rounded-sm" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Contenu</h3>
          {campaign.content?.blocks?.length > 0 ? (
            <div className="space-y-1">
              {campaign.content.blocks.slice(0, 5).map((block: any, i: number) => (
                <div key={i} className="text-xs py-1" style={{ color: "rgba(255,255,255,0.5)", borderBottom: "1px solid var(--border-default)" }}>
                  <span className="text-[10px] uppercase mr-2" style={{ color: "rgba(255,255,255,0.2)" }}>{block.type}</span>
                  {block.content?.substring(0, 60) || block.label || ""}
                </div>
              ))}
              {campaign.content.blocks.length > 5 && (
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>+{campaign.content.blocks.length - 5} blocs supplémentaires</p>
              )}
            </div>
          ) : (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun contenu</p>
          )}
        </div>
      </div>

      {/* Activity log */}
      {campaign.recent_sends.length > 0 && (
        <div className="rounded-sm" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-xs font-semibold flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Activity size={12} /> Activité d'envoi ({campaign.recent_sends.length})
            </h3>
          </div>
          <div className="divide-y max-h-[300px] overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
            {campaign.recent_sends.slice(0, 20).map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                <SendIcon status={s.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate" style={{ color: "var(--text-primary)" }}>{s.fan?.display_name || s.fan?.email || "Inconnu"}</p>
                  {s.error && <p className="text-[10px] mt-0.5" style={{ color: "var(--danger)" }}>{s.error}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.opened_at && <Eye size={10} style={{ color: "var(--success)" }} />}
                  {s.clicked_at && <MousePointerClick size={10} style={{ color: "var(--accent)" }} />}
                </div>
                <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {s.sent_at ? new Date(s.sent_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      {(campaign.status === "draft" || campaign.status === "scheduled") && (
        <div className="p-4 rounded-sm" style={{ backgroundColor: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--danger)" }}><Trash2 size={14} /> Zone dangereuse</h3>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Supprimer définitivement cette campagne</p>
            </div>
            <button
              onClick={async () => {
                if (!confirm("Supprimer définitivement cette campagne ?")) return;
                const res = await fetch(`/api/dashboard/atlas/campaigns/${id}`, { method: "DELETE" });
                if (res.ok) router.push("/dashboard/atlas/campaigns/email");
              }}
              className="text-xs px-3 py-1.5 rounded-sm transition-colors"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "var(--danger)" }}
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: any; color: string;
}) {
  return (
    <div className="p-4 rounded-sm" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
      </div>
      <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{sub} total</p>}
    </div>
  );
}

function SendIcon({ status }: { status: string }) {
  const styles: Record<string, { bg: string; icon: any; color: string }> = {
    sent: { bg: "rgba(16,185,129,0.1)", icon: CheckCircle, color: "var(--success)" },
    failed: { bg: "rgba(239,68,68,0.1)", icon: XCircle, color: "var(--danger)" },
    opened: { bg: "rgba(59,130,246,0.1)", icon: Eye, color: "#3B82F6" },
    clicked: { bg: "rgba(199,91,57,0.1)", icon: MousePointerClick, color: "var(--accent)" },
    bounced: { bg: "rgba(239,68,68,0.1)", icon: AlertCircle, color: "var(--danger)" },
    pending: { bg: "rgba(255,255,255,0.04)", icon: Clock, color: "rgba(255,255,255,0.3)" },
  };
  const s = styles[status] || styles.pending;
  return (
    <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
      <s.icon size={11} style={{ color: s.color }} />
    </div>
  );
}
