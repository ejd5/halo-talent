"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Mail,
  UserPlus,
  Archive,
  AlertTriangle,
  Loader2,
} from "lucide-react";

type TeamMember = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  notes: string | null;
  hired_at: string | null;
  current_load: number;
  max_capacity: number | null;
  assignments: any[];
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  senior_manager: "Senior Manager",
  manager: "Manager",
  drafter_assistant: "Drafter Assistant",
  analyst: "Analyste",
  compliance_officer: "Compliance Officer",
};

const ROLE_COLORS: Record<string, string> = {
  owner: "#C75B39",
  senior_manager: "#7A9A65",
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

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/team?${params.toString()}`);
    if (!res.ok) {
      setError("Erreur chargement");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const getLoadPercent = (m: TeamMember) => {
    if (!m.max_capacity) return null;
    return Math.round((m.current_load / m.max_capacity) * 100);
  };

  const getLoadColor = (pct: number | null) => {
    if (pct === null) return "rgba(255,255,255,0.1)";
    if (pct < 70) return "#7A9A65";
    if (pct < 90) return "#E8A838";
    return "#C44536";
  };

  const RoleBadge = ({ role }: { role: string }) => (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: `${ROLE_COLORS[role] || "#666"}20`,
        color: ROLE_COLORS[role] || "#666",
      }}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );

  const StatusDot = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      active: "#7A9A65",
      on_leave: "#E8A838",
      archived: "rgba(255,255,255,0.2)",
    };
    return (
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: colors[status] || "rgba(255,255,255,0.2)" }}
      />
    );
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-display font-semibold"
            style={{ color: "#F5F0EB" }}
          >
            Équipe
          </h1>
          <p style={{ color: "#E0D8D0" }} className="text-sm mt-1">
            {members.length} membre{members.length !== 1 ? "s" : ""} · Gestion des rôles et assignations
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: "#C75B39", color: "#F5F0EB" }}
        >
          <Plus size={16} />
          Ajouter un membre
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 px-3 py-2 flex-1 max-w-xs"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search size={14} style={{ color: "#E0D8D0" }} />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1"
            style={{ color: "#F5F0EB" }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#F5F0EB",
          }}
        >
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#F5F0EB",
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="on_leave">En congé</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 mb-6 text-sm"
          style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}
        >
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: "#C75B39" }} />
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr
                className="text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: "#E0D8D0",
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <th className="py-3 px-4 font-medium">Membre</th>
                <th className="py-3 px-4 font-medium">Rôle</th>
                <th className="py-3 px-4 font-medium">Assignations</th>
                <th className="py-3 px-4 font-medium">Charge</th>
                <th className="py-3 px-4 font-medium">Statut</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm"
                    style={{ color: "#E0D8D0" }}
                  >
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    Aucun membre trouvé
                  </td>
                </tr>
              )}
              {members.map((m) => {
                const loadPct = getLoadPercent(m);
                return (
                  <tr
                    key={m.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/team/${m.id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: m.avatar_url
                              ? `url(${m.avatar_url}) center/cover`
                              : "rgba(255,255,255,0.08)",
                            color: "#E0D8D0",
                          }}
                        >
                          {!m.avatar_url &&
                            (m.full_name?.charAt(0)?.toUpperCase() ||
                              m.email.charAt(0).toUpperCase())}
                        </div>
                        <div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: "#F5F0EB" }}
                          >
                            {m.full_name || m.email.split("@")[0]}
                          </div>
                          <div
                            className="text-[11px]"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {m.email}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={m.role} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm" style={{ color: "#F5F0EB" }}>
                        {m.current_load}
                      </span>
                      {m.max_capacity && (
                        <span
                          className="text-[11px] ml-1"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          / {m.max_capacity}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {loadPct !== null && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 rounded-full flex-1 max-w-[100px]"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(loadPct, 100)}%`,
                                background: getLoadColor(loadPct),
                              }}
                            />
                          </div>
                          <span
                            className="text-[11px] w-8 text-right"
                            style={{ color: getLoadColor(loadPct) }}
                          >
                            {loadPct}%
                          </span>
                        </div>
                      )}
                      {loadPct === null && (
                        <span
                          className="text-[11px]"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <StatusDot status={m.status} />
                        <span className="text-sm" style={{ color: "#F5F0EB" }}>
                          {STATUS_LABELS[m.status] || m.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/team/${m.id}`}
                          className="text-xs px-3 py-1.5 transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#E0D8D0",
                          }}
                        >
                          Profil
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          supabase={supabase}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            fetchMembers();
          }}
        />
      )}
    </div>
  );
}

function AddMemberModal({
  supabase,
  onClose,
  onCreated,
}: {
  supabase: any;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("manager");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: fullName, role, notes }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      setSaving(false);
      return;
    }

    // Send invitation email via system
    try {
      await supabase.functions.invoke("send-team-invite", {
        body: { email, role, invited_by: "admin" },
      });
    } catch {}

    setSaving(false);
    onCreated();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="w-full max-w-md p-6"
        style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#F5F0EB" }}>
          Ajouter un membre
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#E0D8D0" }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0EB",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#E0D8D0" }}>
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0EB",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#E0D8D0" }}>
              Rôle *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0EB",
              }}
            >
              <option value="senior_manager">Senior Manager</option>
              <option value="manager">Manager</option>
              <option value="drafter_assistant">Drafter Assistant</option>
              <option value="analyst">Analyste</option>
              <option value="compliance_officer">Compliance Officer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#E0D8D0" }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm outline-none resize-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0EB",
              }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#C44536" }}>
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm"
              style={{ color: "#E0D8D0" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
              style={{ background: "#C75B39", color: "#F5F0EB" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {saving ? "Création..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
