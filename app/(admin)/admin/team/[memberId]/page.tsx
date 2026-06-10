"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Mail,
  CalendarDays,
  UserPlus,
  X,
  Plus,
  Loader2,
  AlertTriangle,
  Check,
  Clock,
  FileText,
  Shield,
  Activity,
  Users,
} from "lucide-react";

// ----- Types -----
type TeamMember = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  notes: string | null;
  hired_at: string | null;
  metadata: any;
  assignments: Assignment[];
  permissions: { permission: string; granted_by: string; granted_at: string }[];
  availability: Availability[];
};

type Assignment = {
  id: string;
  is_primary: boolean;
  is_backup: boolean;
  assigned_at: string;
  notes: string | null;
  creator: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string;
    department: string | null;
    status: string;
    avatar_url: string | null;
  } | null;
};

type Availability = {
  id: string;
  date_from: string;
  date_to: string;
  type: string;
  notes: string | null;
};

type Performance = {
  total_creators: number;
  total_revenue: number;
  revenue_growth: number;
  pending_drafts: number;
  avg_revenue_per_creator: number;
};

type AuditLog = {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: any;
  performed_at: string;
};

// ----- Constants -----
const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  senior_manager: "Senior Manager",
  manager: "Manager",
  drafter_assistant: "Drafter Assistant",
  analyst: "Analyste",
  compliance_officer: "Compliance Officer",
};

const ROLE_COLORS: Record<string, string> = {
  owner: "var(--accent)",
  senior_manager: "var(--success)",
  manager: "#4A8FE7",
  drafter_assistant: "#E8A838",
  analyst: "#9B59B6",
  compliance_officer: "#E74C3C",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  on_leave: "En congé",
  archived: "Archivé",
};

const STATUS_COLORS: Record<string, string> = {
  active: "var(--success)",
  on_leave: "#E8A838",
  archived: "rgba(255,255,255,0.2)",
};

// ----- Component -----
export default function TeamMemberDetail() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.memberId as string;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("assignments");
  const supabase = createClient();

  const fetchMember = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/team/${memberId}`);
    if (!res.ok) {
      setError("Erreur chargement");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMember(data.member);
    setPerformance(data.performance);
    setLoading(false);
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-8">
        <div
          className="flex items-center gap-2 px-4 py-3 text-sm"
          style={{ background: "rgba(196,69,54,0.1)", color: "var(--danger)" }}
        >
          <AlertTriangle size={14} />
          {error || "Membre introuvable"}
        </div>
        <button
          onClick={() => router.push("/admin/team")}
          className="mt-4 px-4 py-2 text-sm"
          style={{ color: "var(--accent)" }}
        >
          ← Retour à l'équipe
        </button>
      </div>
    );
  }

  const RoleBadge = ({ role }: { role: string }) => (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-semibold"
      style={{
        background: `${ROLE_COLORS[role] || "#666"}20`,
        color: ROLE_COLORS[role] || "#666",
      }}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );

  const tabs = [
    { id: "assignments", label: "Créateurs", icon: Users },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "availability", label: "Disponibilités", icon: Clock },
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "audit", label: "Audit", icon: FileText },
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Back */}
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={14} />
        Retour à l'équipe
      </Link>

      {/* Identity Section */}
      <div
        className="p-6 mb-8 flex items-start gap-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
          style={{
            background: member.avatar_url
              ? `url(${member.avatar_url}) center/cover`
              : "rgba(255,255,255,0.08)",
            color: "var(--text-secondary)",
          }}
        >
          {!member.avatar_url &&
            (member.full_name?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase())}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {member.full_name || member.email.split("@")[0]}
            </h1>
            <RoleBadge role={member.role} />
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: STATUS_COLORS[member.status] }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: STATUS_COLORS[member.status] }}
              />
              {STATUS_LABELS[member.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="flex items-center gap-1.5">
              <Mail size={12} />
              {member.email}
            </span>
            {member.hired_at && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} />
                Embauché le {new Date(member.hired_at).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
          {member.notes && (
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {member.notes}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.filter((t) => t.id !== "performance" || performance).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "assignments" && (
        <AssignmentsTab memberId={memberId} assignments={member.assignments} onUpdate={fetchMember} />
      )}
      {activeTab === "performance" && performance && (
        <PerformanceTab performance={performance} />
      )}
      {activeTab === "availability" && (
        <AvailabilityTab memberId={memberId} availability={member.availability} onUpdate={fetchMember} />
      )}
      {activeTab === "permissions" && (
        <PermissionsTab memberId={memberId} permissions={member.permissions} onUpdate={fetchMember} />
      )}
      {activeTab === "audit" && (
        <AuditLogTab memberId={memberId} />
      )}
    </div>
  );
}

// ============= TAB: ASSIGNMENTS =============
function AssignmentsTab({
  memberId,
  assignments,
  onUpdate,
}: {
  memberId: string;
  assignments: Assignment[];
  onUpdate: () => void;
}) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [search, setSearch] = useState("");
  const [creators, setCreators] = useState<any[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(false);

  const openAssign = async () => {
    setShowAssignModal(true);
    setLoadingCreators(true);
    const res = await fetch("/api/admin/team?role=manager&status=active");
    const data = await res.json();
    const res2 = await fetch("/api/admin/command-center?status=active");
    const data2 = await res2.json();
    setCreators(data2.creators || []);
    setLoadingCreators(false);
  };

  const assignCreator = async (creatorId: string) => {
    await fetch("/api/admin/team/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creator_id: creatorId, manager_id: memberId, is_primary: true }),
    });
    onUpdate();
  };

  const unassignCreator = async (assignmentId: string) => {
    await fetch(`/api/admin/team/assign?id=${assignmentId}`, { method: "DELETE" });
    onUpdate();
  };

  const primary = assignments.filter((a) => a.is_primary);
  const backup = assignments.filter((a) => a.is_backup);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Créateurs assignés ({assignments.length})
        </h2>
        <button
          onClick={openAssign}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <UserPlus size={12} />
          Assigner un créateur
        </button>
      </div>

      {assignments.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Aucun créateur assigné
        </div>
      )}

      {/* Primary */}
      {primary.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--success)" }}>
            Principal
          </h3>
          <CreatorAssignmentList creators={primary} onUnassign={unassignCreator} />
        </div>
      )}

      {/* Backup */}
      {backup.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#E8A838" }}>
            Backup
          </h3>
          <CreatorAssignmentList creators={backup} onUnassign={unassignCreator} />
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-lg p-6"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Assigner un créateur
              </h3>
              <button onClick={() => setShowAssignModal(false)} style={{ color: "var(--text-secondary)" }}>
                <X size={16} />
              </button>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)" }}
            >
              <SearchIcon size={14} style={{ color: "var(--text-secondary)" }} />
              <input
                type="text"
                placeholder="Rechercher un créateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1">
              {loadingCreators && (
                <div className="py-8 text-center">
                  <Loader2 size={20} className="animate-spin mx-auto" style={{ color: "var(--accent)" }} />
                </div>
              )}
              {!loadingCreators &&
                creators
                  .filter(
                    (c: any) =>
                      !assignments.find((a) => a.creator?.id === c.id) &&
                      (c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                        c.display_name?.toLowerCase().includes(search.toLowerCase()) ||
                        c.email?.toLowerCase().includes(search.toLowerCase()))
                  )
                  .slice(0, 20)
                  .map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => assignCreator(c.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors hover:bg-white/[0.04]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span>
                        {c.display_name || c.full_name || c.email}
                        {c.department && (
                          <span className="ml-2 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {c.department}
                          </span>
                        )}
                      </span>
                      <Plus size={14} style={{ color: "var(--accent)" }} />
                    </button>
                  ))}
              {!loadingCreators &&
                creators.filter((c: any) => !assignments.find((a) => a.creator?.id === c.id)).length ===
                  0 && (
                  <div className="py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Aucun créateur disponible
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreatorAssignmentList({
  creators,
  onUnassign,
}: {
  creators: Assignment[];
  onUnassign: (id: string) => void;
}) {
  return (
    <div style={{ border: "1px solid var(--border-default)" }}>
      {creators.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: a.creator?.avatar_url
                  ? `url(${a.creator.avatar_url}) center/cover`
                  : "rgba(255,255,255,0.06)",
                color: "var(--text-secondary)",
              }}
            >
              {!a.creator?.avatar_url &&
                (a.creator?.full_name?.charAt(0)?.toUpperCase() ||
                  a.creator?.display_name?.charAt(0)?.toUpperCase() ||
                  "?")}
            </div>
            <div>
              <Link
                href={`/admin/creators/${a.creator?.id}`}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {a.creator?.display_name || a.creator?.full_name || a.creator?.email || "Inconnu"}
              </Link>
              {a.creator?.department && (
                <span className="ml-2 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {a.creator.department}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {a.notes && (
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {a.notes}
              </span>
            )}
            <Link
              href={`/admin/creators/${a.creator?.id}`}
              className="text-xs px-2 py-1"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
            >
              Voir
            </Link>
            <button
              onClick={() => onUnassign(a.id)}
              className="text-xs px-2 py-1 transition-colors"
              style={{ background: "rgba(196,69,54,0.15)", color: "var(--danger)" }}
            >
              Retirer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============= TAB: PERFORMANCE =============
function PerformanceTab({ performance }: { performance: Performance }) {
  const cards = [
    { label: "Créateurs", value: performance.total_creators, icon: Users },
    {
      label: "Revenu total",
      value: `${performance.total_revenue.toLocaleString()} €`,
      icon: null,
    },
    {
      label: "Croissance",
      value: `${performance.revenue_growth > 0 ? "+" : ""}${performance.revenue_growth}%`,
      color: performance.revenue_growth >= 0 ? "var(--success)" : "var(--danger)",
      icon: null,
    },
    {
      label: "Drafts en attente",
      value: performance.pending_drafts,
      icon: null,
    },
    {
      label: "Moy. / créateur",
      value: `${performance.avg_revenue_per_creator.toLocaleString()} €`,
      icon: null,
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Performance 30 jours
      </h2>
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
              {card.label}
            </div>
            <div
              className="text-lg font-semibold"
              style={{ color: card.color || "var(--text-primary)" }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= TAB: AVAILABILITY =============
function AvailabilityTab({
  memberId,
  availability,
  onUpdate,
}: {
  memberId: string;
  availability: Availability[];
  onUpdate: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState("vacation");
  const [notes, setNotes] = useState("");

  const addAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/team/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: memberId, date_from: dateFrom, date_to: dateTo, type, notes }),
    });
    setShowForm(false);
    setDateFrom("");
    setDateTo("");
    setNotes("");
    onUpdate();
  };

  const removeAvailability = async (id: string) => {
    await fetch(`/api/admin/team/availability?id=${id}`, { method: "DELETE" });
    onUpdate();
  };

  const typeLabels: Record<string, string> = {
    vacation: "Congés",
    sick: "Maladie",
    training: "Formation",
  };

  const typeColors: Record<string, string> = {
    vacation: "#4A8FE7",
    sick: "#E8A838",
    training: "var(--success)",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Disponibilités ({availability.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={12} />
          Ajouter
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addAvailability}
          className="p-4 mb-4 flex items-end gap-3"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        >
          <div>
            <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Du
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              required
              className="px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Au
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              required
              className="px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              <option value="vacation">Congés</option>
              <option value="sick">Maladie</option>
              <option value="training">Formation</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            Ajouter
          </button>
        </form>
      )}

      {availability.length === 0 && !showForm && (
        <div className="py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Aucune période de disponibilité
        </div>
      )}

      <div className="space-y-2">
        {availability.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-4 py-3"
            style={{ border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: typeColors[a.type] || "rgba(255,255,255,0.2)" }}
              />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                {typeLabels[a.type] || a.type}
              </span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {new Date(a.date_from).toLocaleDateString("fr-FR")} —{" "}
                {new Date(a.date_to).toLocaleDateString("fr-FR")}
              </span>
              {a.notes && (
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {a.notes}
                </span>
              )}
            </div>
            <button
              onClick={() => removeAvailability(a.id)}
              className="p-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= TAB: PERMISSIONS =============
const ALL_PERMISSIONS = [
  { id: "drafts:edit", label: "Éditer les drafts" },
  { id: "drafts:submit", label: "Soumettre les drafts" },
  { id: "analytics:read", label: "Voir les analytics" },
  { id: "analytics:export", label: "Exporter les données" },
  { id: "creators:read", label: "Voir les créateurs" },
  { id: "creators:edit", label: "Modifier les créateurs" },
  { id: "reports:generate", label: "Générer des rapports" },
  { id: "settings:read", label: "Voir les paramètres" },
  { id: "billing:read", label: "Voir la facturation" },
  { id: "compliance:view_logs", label: "Accès aux logs d'audit" },
  { id: "messages:read", label: "Lire les messages" },
  { id: "messages:send", label: "Envoyer des messages (sensible)" },
];

function PermissionsTab({
  memberId,
  permissions,
  onUpdate,
}: {
  memberId: string;
  permissions: { permission: string; granted_by: string; granted_at: string }[];
  onUpdate: () => void;
}) {
  const [toggling, setToggling] = useState<string | null>(null);
  const hasPerm = (permId: string) => permissions.some((p) => p.permission === permId);

  const togglePermission = async (permId: string) => {
    setToggling(permId);
    if (hasPerm(permId)) {
      await fetch(`/api/admin/team/permissions?member_id=${memberId}&permission=${permId}`, {
        method: "DELETE",
      });
    } else {
      await fetch("/api/admin/team/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, permission: permId }),
      });
    }
    setToggling(null);
    onUpdate();
  };

  return (
    <div>
      <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        Permissions granulaires
      </h2>
      <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
        Les permissions par défaut sont définies par le rôle. Ajoutez ou retirez des permissions spécifiques.
      </p>

      <div className="space-y-1">
        {ALL_PERMISSIONS.map((perm) => {
          const active = hasPerm(perm.id);
          const grantInfo = permissions.find((p) => p.permission === perm.id);
          return (
            <div
              key={perm.id}
              className="flex items-center justify-between px-4 py-2.5"
              style={{ border: "1px solid var(--border-default)" }}
            >
              <div>
                <span className="text-sm" style={{ color: active ? "var(--text-primary)" : "rgba(255,255,255,0.3)" }}>
                  {perm.label}
                </span>
                {grantInfo && (
                  <span className="ml-2 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    · {new Date(grantInfo.granted_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              <button
                onClick={() => togglePermission(perm.id)}
                disabled={toggling === perm.id}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: active ? "var(--success)" : "rgba(255,255,255,0.1)",
                }}
              >
                {toggling === perm.id ? (
                  <Loader2 size={12} className="animate-spin mx-auto" style={{ color: "var(--text-primary)" }} />
                ) : (
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                    style={{
                      background: "var(--text-primary)",
                      left: active ? 22 : 2,
                    }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============= TAB: AUDIT LOG =============
function AuditLogTab({ memberId }: { memberId: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("member_id", memberId);
    if (actionFilter) params.set("action", actionFilter);
    params.set("page", String(page));
    params.set("limit", "30");

    const res = await fetch(`/api/admin/team/audit-log?${params.toString()}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setTotalPages(data.pagination?.pages || 1);
    setLoading(false);
  }, [memberId, actionFilter, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const actionLabels: Record<string, string> = {
    member_created: "Membre créé",
    member_updated: "Membre modifié",
    member_archived: "Membre archivé",
    creator_assigned: "Créateur assigné",
    creator_unassigned: "Créateur retiré",
    permission_granted: "Permission accordée",
    permission_revoked: "Permission retirée",
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Journal d'audit
        </h2>
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="px-2 py-1 text-xs outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          <option value="">Toutes les actions</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="py-8 text-center">
          <Loader2 size={20} className="animate-spin mx-auto" style={{ color: "var(--accent)" }} />
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Aucune entrée d'audit
        </div>
      )}

      {!loading && logs.length > 0 && (
        <>
          <div style={{ border: "1px solid var(--border-default)" }}>
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {actionLabels[log.action] || log.action}
                  </span>
                  {log.metadata?.permission && (
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {log.metadata.permission}
                    </span>
                  )}
                </div>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {new Date(log.performed_at).toLocaleString("fr-FR")}
                </span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: page === 1 ? "rgba(255,255,255,0.2)" : "var(--text-secondary)",
                }}
              >
                Précédent
              </button>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: page === totalPages ? "rgba(255,255,255,0.2)" : "var(--text-secondary)",
                }}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// SearchIcon alias for lucide Search
function SearchIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
