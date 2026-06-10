"use client";

import { useState } from "react";
import { X, Mail, Send } from "lucide-react";
import { teamMembers } from "../../data";
import { ROLE_LABELS } from "../../permissions";
import type { Role, TeamMember } from "../../types";

const ALL_ROLES: Role[] = ["admin", "manager", "assistant", "chatter", "comptable", "viewer"];

const mockCreators = [
  { id: "c1", name: "Clara W." }, { id: "c2", name: "Marc T." },
  { id: "c3", name: "Léa R." }, { id: "c4", name: "Inès D." },
  { id: "c5", name: "Alex M." }, { id: "c6", name: "Emma V." }, { id: "c7", name: "Hugo P." },
];

export function InviteMemberModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (member: TeamMember) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("manager");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const toggleCreator = (id: string) => {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!email || !name) return;
    onInvite({
      id: `u-${Date.now()}`,
      email,
      full_name: name,
      role,
      avatar_url: null,
      assigned_creators: mockCreators.filter((c) => selectedCreators.includes(c.id)),
      last_login: null,
      active: true,
      custom_permissions: {},
      invited_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  };

  const isValid = email && name && selectedCreators.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center" onClick={onClose}>
        <div className="w-[520px] border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-base)" }} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Mail size={14} />
              Inviter un membre
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)] transition-colors"><X size={16} /></button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Email */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" className="w-full p-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>

            {/* Full name */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom" className="w-full p-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px]" />
            </div>

            {/* Role */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Rôle</label>
              <div className="flex gap-2">
                {ALL_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors ${role === r ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] hover:bg-[var(--color-card)]"}`}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator assignment */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">
                Créateurs assignés ({selectedCreators.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-2 border border-[var(--color-border)]">
                {mockCreators.map((c) => (
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

            {/* Invitation note */}
            <div className="p-3 border border-[var(--color-border)] text-[11px] opacity-50 leading-relaxed">
              Une invitation sera envoyée à <strong>{email || "cet email"}</strong>.
              {role === "admin" && " Les admins doivent configurer le 2FA à leur première connexion."}
              {role === "manager" && " Les managers peuvent modifier les profils et contrats de leurs créateurs assignés."}
              {role === "assistant" && " Les assistants ont un accès lecture seule + messagerie."}
              {role === "chatter" && " Les chatters voient et répondent aux messages des créateurs qui leur sont assignés."}
              {role === "comptable" && " Les comptables ont accès aux finances globales et à l'export des données."}
              {role === "viewer" && " Les viewers ont un accès en lecture seule au dashboard analytics et aux créateurs."}
              {role === "custom" && " Les rôles personnalisés permettent de configurer chaque permission individuellement."}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-border)]">
            <button onClick={onClose} className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors">Annuler</button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Send size={12} />
              Envoyer l&apos;invitation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
