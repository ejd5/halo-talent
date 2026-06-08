"use client";

import { useState } from "react";
import { Plus, Search, Mail, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { teamMembers as initialMembers } from "../../data";
import { ROLE_LABELS, ROLE_COLORS } from "../../permissions";
import type { TeamMember, Role } from "../../types";
import { InviteMemberModal } from "./InviteMemberModal";

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

export function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
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

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Équipe</h1>
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
          {(["owner", "admin", "manager", "assistant"] as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[var(--color-border)]">
        <div className="grid grid-cols-[1fr_200px_120px_140px_140px_100px] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)] items-center">
          <div>Membre</div>
          <div>Email</div>
          <div>Rôle</div>
          <div>Ceurs assignés</div>
          <div>Dernière connexion</div>
          <div>Actions</div>
        </div>
        {filtered.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_200px_120px_140px_140px_100px] gap-4 px-5 py-3 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)] transition-colors">
            {/* Name + avatar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                {m.full_name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {m.full_name}
                  {!m.active && <span className="text-[9px] font-medium text-[#C44536]">Désactivé</span>}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="text-xs opacity-50">{m.email}</div>

            {/* Role */}
            <div>
              <span className="text-[10px] font-medium px-2 py-0.5" style={{ color: ROLE_COLORS[m.role], backgroundColor: `${ROLE_COLORS[m.role]}15` }}>
                {ROLE_LABELS[m.role]}
              </span>
            </div>

            {/* Assigned creators */}
            <div className="text-xs opacity-50">{m.assigned_creators.length} créateurs</div>

            {/* Last login */}
            <div className="text-xs opacity-50">{timeAgo(m.last_login)}</div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {m.role !== "owner" && (
                <>
                  <button
                    onClick={() => toggleActive(m.id)}
                    className="p-1 hover:opacity-60 transition-opacity"
                    title={m.active ? "Désactiver" : "Activer"}
                  >
                    {m.active ? <XCircle size={14} className="opacity-40" /> : <CheckCircle size={14} className="text-[#7A9A65]" />}
                  </button>
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value as Role)}
                    className="text-[9px] px-1 py-0.5 border border-[var(--color-border)] bg-transparent"
                  >
                    {(["admin", "manager", "assistant"] as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </div>
  );
}
