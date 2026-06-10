"use client";

import { useState } from "react";
import { Plus, Search, XCircle, CheckCircle, Shield, Users } from "lucide-react";
import { teamMembers as initialMembers } from "../../data";
import { ROLE_LABELS, ROLE_COLORS, ROLE_CATEGORIES, MODULES, DEFAULT_PERMISSIONS } from "../../permissions";
import type { TeamMember, Role, PermissionModule } from "../../types";
import { InviteMemberModal } from "./InviteMemberModal";
import { PermissionEditModal } from "./PermissionEditModal";

const ALL_ROLES: Role[] = ["owner", "admin", "manager", "assistant", "chatter", "comptable", "viewer"];
const ALL_MODULES = Object.keys(MODULES) as PermissionModule[];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Jamais";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  return `il y a ${days}j`;
}

function getModuleAccess(member: TeamMember): PermissionModule[] {
  const perms = { ...DEFAULT_PERMISSIONS[member.role], ...member.custom_permissions };
  return ALL_MODULES.filter((mod) =>
    MODULES[mod].actions.some((a) => perms[a] === true)
  );
}

export function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filtered = members.filter((m) => {
    if (search && !m.full_name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && m.role !== roleFilter) return false;
    return true;
  });

  const toggleActive = (id: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
  };

  const changeRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role } : m));
  };

  const handleInvite = (member: TeamMember) => {
    setMembers((prev) => [member, ...prev]);
    setShowInvite(false);
  };

  const handlePermissionSave = (updated: TeamMember) => {
    setMembers((prev) => prev.map((m) => m.id === updated.id ? updated : m));
    setEditingMember(null);
  };

  const hasChanges = members.some((m, i) => {
    const orig = initialMembers.find((o) => o.id === m.id);
    return !orig || orig.role !== m.role || orig.active !== m.active ||
      JSON.stringify(orig.custom_permissions) !== JSON.stringify(m.custom_permissions) ||
      JSON.stringify(orig.assigned_creators) !== JSON.stringify(m.assigned_creators);
  });

  const handleSaveAll = () => {
    // In a real app, this would call an API
    // For now it just keeps the current state
  };

  return (
    <div className="flex flex-col gap-4 p-6 card-accent" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Équipe</h1>
          <p className="text-xs opacity-40 mt-0.5">{members.filter((m) => m.active).length} membres actifs · {members.length} total</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Inviter un membre
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent">
          <option value="">Tous les rôles</option>
          {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-[var(--color-border)]">
        <div className="grid grid-cols-[1fr_160px_110px_120px_100px_120px_120px] gap-3 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)] items-center">
          <div>Membre</div>
          <div>Rôle</div>
          <div>Modules</div>
          <div>Cœurs</div>
          <div>Connexion</div>
          <div>Statut</div>
          <div>Actions</div>
        </div>
        {filtered.map((m) => {
          const modules = getModuleAccess(m);
          return (
            <div key={m.id} className="grid grid-cols-[1fr_160px_110px_120px_100px_120px_120px] gap-3 px-4 py-3 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)] transition-colors">
              {/* Name + avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                  {m.full_name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate flex items-center gap-2">
                    {m.full_name}
                  </div>
                  <div className="text-[10px] opacity-40 truncate">{m.email}</div>
                </div>
              </div>

              {/* Role */}
              <div>
                {m.role === "owner" ? (
                  <span className="text-[10px] font-medium px-2 py-0.5" style={{ color: ROLE_COLORS[m.role], backgroundColor: `${ROLE_COLORS[m.role]}15` }}>
                    {ROLE_LABELS[m.role]}
                  </span>
                ) : (
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value as Role)}
                    className="text-[10px] font-medium px-2 py-0.5 border border-[var(--color-border)] bg-transparent"
                    style={{ color: ROLE_COLORS[m.role] }}
                  >
                    {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                )}
              </div>

              {/* Module badges */}
              <div className="flex flex-wrap gap-1">
                {ALL_MODULES.map((mod) => {
                  const hasAccess = modules.includes(mod);
                  return (
                    <span
                      key={mod}
                      className={`text-[8px] font-medium px-1 py-0.5 border transition-colors ${
                        hasAccess
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                          : "border-[var(--color-border)] opacity-20"
                      }`}
                      title={MODULES[mod].label}
                    >
                      {mod === "pilotage" ? "📊" : mod === "createurs" ? "👥" : mod === "finances" ? "💰" : mod === "contenu" ? "📝" : mod === "juridique" ? "⚖️" : mod === "chat" ? "💬" : "⚙️"}
                    </span>
                  );
                })}
              </div>

              {/* Assigned creators */}
              <div className="text-xs opacity-50">{m.assigned_creators.length}</div>

              {/* Last login */}
              <div className="text-xs opacity-50">{timeAgo(m.last_login)}</div>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${m.active ? "" : "opacity-30"}`} style={{ backgroundColor: m.active ? "var(--success)" : "var(--danger)" }} />
                <span className="text-[10px]" style={{ color: m.active ? "var(--success)" : "var(--danger)" }}>
                  {m.active ? "Actif" : "Inactif"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {m.role !== "owner" && (
                  <>
                    <button
                      onClick={() => toggleActive(m.id)}
                      className="p-1 hover:opacity-60 transition-opacity"
                      title={m.active ? "Désactiver" : "Activer"}
                    >
                      {m.active ? <XCircle size={14} className="opacity-40" /> : <CheckCircle size={14} className="text-[var(--success)]" />}
                    </button>
                    <button
                      onClick={() => setEditingMember(m)}
                      className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
                      title="Modifier les permissions"
                    >
                      <Shield size={10} />
                      Perms
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs opacity-30">Aucun membre trouvé</div>
        )}
        {filtered.map((m) => {
          const modules = getModuleAccess(m);
          return (
            <div key={m.id} className="border border-[var(--color-border)] p-3 space-y-2">
              {/* Header row */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                  {m.full_name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{m.full_name}</div>
                  <div className="text-[10px] opacity-40 truncate">{m.email}</div>
                </div>
                <div className="flex items-center gap-1">
                  {m.role !== "owner" && (
                    <>
                      <button onClick={() => toggleActive(m.id)} className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center hover:opacity-60 transition-opacity">
                        {m.active ? <XCircle size={14} className="opacity-40" /> : <CheckCircle size={14} className="text-[var(--success)]" />}
                      </button>
                      <button onClick={() => setEditingMember(m)} className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center hover:opacity-60 transition-opacity">
                        <Shield size={14} className="opacity-40" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Role + status row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {m.role === "owner" ? (
                    <span className="text-[10px] font-medium px-2 py-0.5" style={{ color: ROLE_COLORS[m.role], backgroundColor: `${ROLE_COLORS[m.role]}15` }}>
                      {ROLE_LABELS[m.role]}
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) => changeRole(m.id, e.target.value as Role)}
                      className="text-[10px] font-medium px-2 py-0.5 border border-[var(--color-border)] bg-transparent"
                      style={{ color: ROLE_COLORS[m.role] }}
                    >
                      {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.active ? "" : "opacity-30"}`} style={{ backgroundColor: m.active ? "var(--success)" : "var(--danger)" }} />
                  <span className="text-[10px]" style={{ color: m.active ? "var(--success)" : "var(--danger)" }}>
                    {m.active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>

              {/* Details row */}
              <div className="flex items-center gap-3 text-[10px] opacity-40">
                <span>{m.assigned_creators.length} créateur(s)</span>
                <span>·</span>
                <span>{timeAgo(m.last_login)}</span>
              </div>

              {/* Module badges */}
              <div className="flex flex-wrap gap-1">
                {ALL_MODULES.map((mod) => {
                  const hasAccess = modules.includes(mod);
                  return (
                    <span
                      key={mod}
                      className={`text-[8px] font-medium px-1 py-0.5 border transition-colors ${
                        hasAccess
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/8"
                          : "border-[var(--color-border)] opacity-20"
                      }`}
                      title={MODULES[mod].label}
                    >
                      {mod === "pilotage" ? "📊" : mod === "createurs" ? "👥" : mod === "finances" ? "💰" : mod === "contenu" ? "📝" : mod === "juridique" ? "⚖️" : mod === "chat" ? "💬" : "⚙️"}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite modal */}
      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}

      {/* Permission edit modal */}
      {editingMember && (
        <PermissionEditModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handlePermissionSave}
        />
      )}
    </div>
  );
}
