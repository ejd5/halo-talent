"use client";

import { useState } from "react";
import { X, AlertTriangle, Shield } from "lucide-react";

interface CoManagement {
  id: string;
  platform: string;
  manager_email: string;
  manager_name: string | null;
  access_level: string;
  status: string;
}

interface RevokeModalProps {
  coManagement: CoManagement;
  onClose: () => void;
  onRevoked: () => void;
}

const PLATFORM_REVOKE_STEPS: Record<string, string[]> = {
  instagram: [
    "Ouvre business.facebook.com",
    "Va dans Settings → People",
    "Trouve le manager dans la liste",
    "Clique sur Remove → Confirm",
  ],
  tiktok: [
    "Ouvre ads.tiktok.com",
    "Va dans Business Center → User Management",
    "Trouve le membre dans la liste",
    "Clique sur Remove → Confirm",
  ],
  youtube: [
    "Ouvre youtube.com",
    "Va dans Settings → Permissions",
    "Trouve le manager dans la liste",
    "Clique sur Remove → Confirm",
  ],
  onlyfans: [
    "Change le mot de passe du compte partagé",
    "Retire l'accès depuis le gestionnaire de mots de passe",
    "Vérifie que la 2FA n'a pas été modifiée",
  ],
};

export function RevokeModal({ coManagement, onClose, onRevoked }: RevokeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const steps = PLATFORM_REVOKE_STEPS[coManagement.platform] || [
    "Connecte-toi à la plateforme",
    "Va dans les paramètres de gestion des accès",
    "Trouve le manager dans la liste",
    "Supprime son accès",
  ];

  const handleRevoke = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/integrations/co-management?id=${coManagement.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la révocation");
      onRevoked();
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} style={{ color: "var(--danger)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--danger)" }}>Révoquer l'accès</span>
          </div>
          <button onClick={onClose} className="transition-all hover:opacity-60">
            <X size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Manager info */}
          <div className="p-3 text-xs" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {coManagement.manager_name || coManagement.manager_email}
              </span>
            </div>
            <div className="space-y-1 text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
              <p>Email : {coManagement.manager_email}</p>
              <p>Plateforme : {coManagement.platform}</p>
              <p>Accès : {coManagement.access_level}</p>
            </div>
          </div>

          {/* Revoke steps */}
          <div>
            <h4 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>
              Étapes pour révoquer sur la plateforme
            </h4>
            <ol className="space-y-1">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>
                  <span style={{ color: "var(--accent)" }}>{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed((c) => !c)}
              className="mt-0.5 accent-[var(--danger)] shrink-0"
            />
            <span className="text-[10px]" style={{ color: confirmed ? "var(--text-primary)" : "rgba(245,240,235,0.3)" }}>
              Je confirme avoir révoqué l'accès sur la plateforme et je souhaite supprimer cette configuration
            </span>
          </label>

          {/* Actions */}
          {error && (
            <div className="text-[10px] p-2" style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 text-[10px] font-medium py-2.5 transition-all hover:opacity-70"
              style={{
                backgroundColor: "rgba(245,240,235,0.04)",
                color: "rgba(245,240,235,0.3)",
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleRevoke}
              disabled={!confirmed || loading}
              className="flex-1 text-[10px] font-semibold py-2.5 transition-all disabled:opacity-30"
              style={{
                backgroundColor: confirmed ? "var(--danger)" : "rgba(245,240,235,0.06)",
                color: confirmed ? "var(--text-primary)" : "rgba(245,240,235,0.2)",
              }}
            >
              {loading ? "Révocation..." : "Confirmer la révocation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
