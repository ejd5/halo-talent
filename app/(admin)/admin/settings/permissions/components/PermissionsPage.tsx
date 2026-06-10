"use client";

import { useState, useMemo } from "react";
import { Search, Shield, Save, RotateCcw, Plus, X, AlertCircle, Lock, Check } from "lucide-react";
import { DEFAULT_PERMISSIONS, ALL_ACTIONS, ROLE_LABELS, ROLE_COLORS, canAccessResource } from "../../permissions";
import type { Role } from "../../types";

const MANAGED_ROLES: Role[] = ["admin", "manager", "assistant"];
const ALL_ROLES: Role[] = ["owner", ...MANAGED_ROLES];

type PendingChange = {
  role: string;
  action: string;
  value: boolean;
};

type CustomRoleDef = {
  id: string;
  label: string;
  permissions: Record<string, boolean>;
};

export function PermissionsPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [saved, setSaved] = useState(false);
  const [customRoles, setCustomRoles] = useState<CustomRoleDef[]>([]);
  const [editingCustom, setEditingCustom] = useState<string | null>(null);
  const [newCustomLabel, setNewCustomLabel] = useState("");

  const filteredActions = useMemo(() => {
    return ALL_ACTIONS.filter((a) => {
      if (search && !a.label.toLowerCase().includes(search.toLowerCase()) && !a.action.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter && !a.action.includes(roleFilter)) return false;
      return true;
    });
  }, [search, roleFilter]);

  const getValue = (role: string, action: string): boolean => {
    const pending = pendingChanges.find((p) => p.role === role && p.action === action);
    if (pending !== undefined) return pending.value;
    const custom = customRoles.find((c) => c.id === role);
    if (custom && action in custom.permissions) return custom.permissions[action];
    return DEFAULT_PERMISSIONS[role]?.[action] ?? false;
  };

  const isChanged = (role: string, action: string): boolean => {
    return pendingChanges.some((p) => p.role === role && p.action === action);
  };

  const toggle = (role: string, action: string) => {
    if (role === "owner") return;
    const current = getValue(role, action);
    setPendingChanges((prev) => {
      const existing = prev.findIndex((p) => p.role === role && p.action === action);
      if (existing >= 0) {
        if (prev[existing].value === !current) return prev.filter((_, i) => i !== existing);
        const next = [...prev];
        next[existing] = { role, action, value: !current };
        return next;
      }
      return [...prev.filter((p) => !(p.role === role && p.action === action)), { role, action, value: !current }];
    });
    setSaved(false);
  };

  const resetAll = () => {
    setPendingChanges([]);
    setSaved(false);
  };

  const saveChanges = () => {
    // In real app: POST to API
    // Apply pending changes to DEFAULT_PERMISSIONS in state
    setPendingChanges([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCustomRole = () => {
    if (!newCustomLabel.trim()) return;
    const id = `custom-${Date.now()}`;
    const permissions: Record<string, boolean> = {};
    ALL_ACTIONS.forEach((a) => { permissions[a.action] = false; });
    setCustomRoles((prev) => [...prev, { id, label: newCustomLabel.trim(), permissions }]);
    setNewCustomLabel("");
    setEditingCustom(id);
  };

  const updateCustomPermission = (roleId: string, action: string, value: boolean) => {
    setCustomRoles((prev) => prev.map((c) => {
      if (c.id !== roleId) return c;
      return { ...c, permissions: { ...c.permissions, [action]: value } };
    }));
  };

  const removeCustomRole = (id: string) => {
    setCustomRoles((prev) => prev.filter((c) => c.id !== id));
    if (editingCustom === id) setEditingCustom(null);
  };

  const getRoleLabel = (role: string): string => {
    const custom = customRoles.find((c) => c.id === role);
    return custom?.label ?? ROLE_LABELS[role as Role] ?? role;
  };

  const getRoleColor = (role: string): string => {
    if (role.startsWith("custom-")) return ROLE_COLORS.custom;
    return ROLE_COLORS[role as Role] ?? "#999";
  };

  const allRoles = useMemo(() => {
    return [...ALL_ROLES, ...customRoles.map((c) => c.id)];
  }, [customRoles]);

  const counts = useMemo(() => {
    const result: Record<string, { enabled: number; total: number }> = {};
    allRoles.forEach((role) => {
      let enabled = 0;
      ALL_ACTIONS.forEach((a) => {
        if (getValue(role, a.action)) enabled++;
      });
      result[role] = { enabled, total: ALL_ACTIONS.length };
    });
    return result;
  }, [allRoles, pendingChanges, customRoles]);

  return (
    <div className="flex flex-col gap-4 p-6 card-accent" style={{ background: "var(--bg-primary)" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Permissions</h1>
          <p className="text-xs opacity-40 mt-0.5">Gérez les autorisations de chaque rôle · {ALL_ACTIONS.length} actions disponibles</p>
        </div>
        <div className="flex items-center gap-2">
          {pendingChanges.length > 0 && (
            <span className="text-[10px] opacity-40">{pendingChanges.length} modification{pendingChanges.length > 1 ? "s" : ""}</span>
          )}
          <button
            onClick={resetAll}
            disabled={pendingChanges.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors disabled:opacity-20"
          >
            <RotateCcw size={12} />
            Réinitialiser
          </button>
          <button
            onClick={saveChanges}
            disabled={pendingChanges.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            {saved ? (
              <><Check size={12} /> Enregistré</>
            ) : (
              <><Save size={12} /> Enregistrer</>
            )}
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une action..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none" />
        </div>
      </div>

      {/* Custom roles */}
      <div className="flex items-center gap-2 flex-wrap">
        {customRoles.map((cr) => (
          <div key={cr.id} className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium border border-[var(--color-border)]">
            <span style={{ color: ROLE_COLORS.custom }}>{ROLE_LABELS.custom}</span>
            <span className="opacity-60">·</span>
            <span>{cr.label}</span>
            <button onClick={() => removeCustomRole(cr.id)} className="ml-1 opacity-30 hover:opacity-100"><X size={10} /></button>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newCustomLabel}
            onChange={(e) => setNewCustomLabel(e.target.value)}
            placeholder="Nouveau rôle..."
            className="w-32 px-2 py-1 text-[10px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && addCustomRole()}
          />
          <button
            onClick={addCustomRole}
            disabled={!newCustomLabel.trim()}
            className="p-1 disabled:opacity-20 hover:opacity-60 transition-opacity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Matrix table */}
      <div className="border border-[var(--color-border)] overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_200px_repeat(5,140px)] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider border-b border-[var(--color-border)] items-center sticky top-0" style={{ backgroundColor: "var(--color-base)" }}>
            <div>Action</div>
            <div className="text-[9px] opacity-40">Description</div>
            {allRoles.map((role) => (
              <div key={role} className="text-center relative">
                <div className="flex items-center justify-center gap-1">
                  <span style={{ color: getRoleColor(role) }}>{getRoleLabel(role)}</span>
                  {role === "owner" && <Lock size={10} className="opacity-30" />}
                </div>
                <div className="text-[9px] opacity-30 mt-0.5 font-normal normal-case">
                  {counts[role].enabled}/{counts[role].total}
                </div>
              </div>
            ))}
          </div>

          {/* Action rows */}
          {filteredActions.map((action) => (
            <div
              key={action.action}
              className="grid grid-cols-[1fr_200px_repeat(5,140px)] gap-4 px-5 py-2.5 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors"
            >
              <div>
                <div className="text-xs font-medium">{action.label}</div>
                <div className="text-[10px] opacity-30 mt-0.5 font-mono">{action.action}</div>
              </div>
              <div className="text-[10px] opacity-40 leading-relaxed">{action.description}</div>
              {allRoles.map((role) => {
                const enabled = getValue(role, action.action);
                const changed = isChanged(role, action.action);
                return (
                  <div key={role} className="flex justify-center">
                    <button
                      onClick={() => toggle(role, action.action)}
                      disabled={role === "owner"}
                      className={`relative w-9 h-5 rounded-[0px] transition-all duration-150 ${
                        role === "owner" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      } ${enabled ? "opacity-100" : "opacity-20 hover:opacity-40"}`}
                      style={{
                        backgroundColor: enabled ? getRoleColor(role) : "var(--color-border)",
                      }}
                      title={`${enabled ? "Désactiver" : "Activer"} ${action.label} pour ${getRoleLabel(role)}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-150 ${
                          enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                        }`}
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] opacity-30">
        <span>Les modifications sont appliquées en temps réel</span>
        <span>·</span>
        <span>Le rôle Propriétaire est verrouillé</span>
        <span>·</span>
        <span>{filteredActions.length} action{filteredActions.length > 1 ? "s" : ""} affichée{filteredActions.length > 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
