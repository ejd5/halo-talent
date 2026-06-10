"use client";

import { useState } from "react";
import { X, Check, Users, Shield } from "lucide-react";
import { MODULES, ROLE_LABELS, DEFAULT_PERMISSIONS, ALL_ACTIONS } from "../../permissions";
import type { TeamMember, AssignedCreator, PermissionModule } from "../../types";

const ALL_MODULES = Object.keys(MODULES) as PermissionModule[];
const MODULE_ICONS: Record<PermissionModule, string> = {
  pilotage: "📊",
  createurs: "👥",
  finances: "💰",
  contenu: "📝",
  juridique: "⚖️",
  chat: "💬",
  parametres: "⚙️",
};

const MOCK_CREATORS: AssignedCreator[] = [
  { id: "c1", name: "Clara W." }, { id: "c2", name: "Marc T." },
  { id: "c3", name: "Léa R." }, { id: "c4", name: "Inès D." },
  { id: "c5", name: "Alex M." }, { id: "c6", name: "Emma V." }, { id: "c7", name: "Hugo P." },
];

export function PermissionEditModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember;
  onClose: () => void;
  onSave: (updated: TeamMember) => void;
}) {
  const [activeModule, setActiveModule] = useState<PermissionModule>("createurs");
  const [customPerms, setCustomPerms] = useState<Record<string, boolean>>({ ...member.custom_permissions });
  const [selectedCreators, setSelectedCreators] = useState<string[]>(
    member.assigned_creators.map((c) => c.id)
  );
  const [hasChanges, setHasChanges] = useState(false);

  const effectivePerm = (action: string): boolean => {
    if (action in customPerms) return customPerms[action];
    const defaults = DEFAULT_PERMISSIONS[member.role];
    return defaults?.[action] ?? false;
  };

  const togglePerm = (action: string) => {
    const defaultValue = DEFAULT_PERMISSIONS[member.role]?.[action] ?? false;
    const currentOverride = action in customPerms ? customPerms[action] : undefined;
    let next: Record<string, boolean>;

    if (currentOverride === undefined) {
      next = { ...customPerms, [action]: !defaultValue };
    } else if (currentOverride === defaultValue) {
      const { [action]: _, ...rest } = customPerms;
      next = rest;
    } else {
      next = { ...customPerms, [action]: defaultValue };
    }

    setCustomPerms(next);
    setHasChanges(true);
  };

  const toggleCreator = (id: string) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setHasChanges(true);
  };

  const moduleActions = ALL_MODULES.reduce(
    (acc, mod) => ({ ...acc, [mod]: MODULES[mod].actions }),
    {} as Record<PermissionModule, string[]>
  );

  const handleSave = () => {
    onSave({
      ...member,
      custom_permissions: customPerms,
      assigned_creators: MOCK_CREATORS.filter((c) => selectedCreators.includes(c.id)),
    });
  };

  const activeActions = moduleActions[activeModule];
  const statsPerModule = ALL_MODULES.map((mod) => ({
    module: mod,
    enabled: MODULES[mod].actions.filter((a) => effectivePerm(a)).length,
    total: MODULES[mod].actions.length,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose}>
      <div
        className="w-[600px] max-h-[85vh] flex flex-col border border-[var(--color-border)] card-accent"
        style={{ backgroundColor: "var(--color-base)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              {member.full_name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Permissions — {member.full_name}
              </h2>
              <p className="text-[10px] opacity-40">{ROLE_LABELS[member.role]} · {member.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Module sidebar */}
          <div className="w-[140px] shrink-0 border-r border-[var(--color-border)] overflow-y-auto">
            <div className="p-2 space-y-0.5">
              {statsPerModule.map(({ module: mod, enabled, total }) => (
                <button
                  key={mod}
                  onClick={() => setActiveModule(mod)}
                  className={`w-full text-left px-2.5 py-2 text-[11px] font-medium transition-colors border-l-2 ${
                    activeModule === mod
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{MODULES[mod].label}</span>
                    <span className="text-[9px] opacity-40">{enabled}/{total}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Module description */}
            <div>
              <h3 className="text-xs font-semibold flex items-center gap-1.5">
                <Shield size={13} />
                {MODULES[activeModule].label}
              </h3>
              <p className="text-[10px] opacity-40 mt-0.5">{MODULES[activeModule].description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              {activeActions.map((action) => {
                const actionDef = ALL_ACTIONS.find((a) => a.action === action);
                const enabled = effectivePerm(action);
                const isOverridden = action in customPerms;
                return (
                  <div
                    key={action}
                    className="flex items-center justify-between p-2.5 border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors cursor-pointer"
                    onClick={() => togglePerm(action)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{actionDef?.label ?? action}</span>
                        {isOverridden && (
                          <span className="text-[8px] uppercase tracking-wider font-semibold text-[var(--warning)] border border-[var(--warning)]/30 px-1 py-0.5 leading-none">
                            Override
                          </span>
                        )}
                      </div>
                      {actionDef?.description && (
                        <p className="text-[10px] opacity-40 mt-0.5">{actionDef.description}</p>
                      )}
                    </div>
                    <div
                      className={`w-8 h-[18px] rounded-[0px] relative transition-colors shrink-0 ml-3 ${
                        enabled ? "opacity-100" : "opacity-20"
                      }`}
                      style={{ backgroundColor: enabled ? "var(--success)" : "var(--color-border)" }}
                    >
                      <div
                        className={`absolute top-0.5 w-[14px] h-[14px] bg-white transition-transform ${
                          enabled ? "translate-x-[18px]" : "translate-x-[1px]"
                        }`}
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Creator assignment */}
            <div className="pt-3 border-t border-[var(--color-border)]">
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2 flex items-center gap-1.5">
                <Users size={12} />
                Créateurs assignés ({selectedCreators.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 border border-[var(--color-border)]">
                {MOCK_CREATORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCreator(c.id)}
                    className={`px-2 py-1 text-[10px] font-medium border transition-colors ${
                      selectedCreators.includes(c.id)
                        ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                        : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] shrink-0">
          <span className="text-[10px] opacity-30">
            {Object.keys(customPerms).length > 0
              ? `${Object.keys(customPerms).length} permission(s) personnalisée(s)`
              : "Aucune permission personnalisée — valeurs par défaut du rôle"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Check size={12} />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
