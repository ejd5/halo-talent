"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Check, Shield, Globe, Users, Mail } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", label: "Instagram / Facebook", via: "Meta Business Suite" },
  { id: "tiktok", label: "TikTok", via: "Business Center" },
  { id: "youtube", label: "YouTube", via: "Brand Account" },
  { id: "onlyfans", label: "OnlyFans / MYM / Fansly", via: "Gestionnaire de mots de passe" },
];

const ACCESS_LEVELS = [
  { id: "admin", label: "Admin", desc: "Tous les accès, y compris la facturation", risk: "Élevé" },
  { id: "content_creator", label: "Content Creator", desc: "Publier et modifier du contenu", risk: "Modéré" },
  { id: "moderator", label: "Moderator", desc: "Modérer les commentaires et messages", risk: "Faible" },
  { id: "analyst", label: "Analyst", desc: "Lecture seule des performances", risk: "Minimal" },
  { id: "view_only", label: "View Only", desc: "Visualisation uniquement", risk: "Minimal" },
];

const VERIFICATION_ITEMS = [
  "J'ai suivi les étapes de configuration sur la plateforme concernée",
  "Le manager a accepté l'invitation avec son propre compte",
  "J'ai vérifié que le manager peut accéder sans mon mot de passe",
];

interface OnboardingWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingWizard({ onClose, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceed = () => {
    switch (step) {
      case 0: return !!platform;
      case 1: return !!accessLevel;
      case 2: return true;
      case 3: return !!managerEmail && VERIFICATION_ITEMS.every((_, i) => verified[i]);
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/integrations/co-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          manager_email: managerEmail,
          manager_name: managerName || null,
          access_level: accessLevel,
          notes: notes || null,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      onComplete();
    } catch {
      setError("Une erreur est survenue. Vérifie les informations et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg" style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: "#C75B39" }} />
            <span className="text-sm font-medium" style={{ color: "#F5F0EB" }}>Assistant configuration</span>
          </div>
          <button onClick={onClose} className="transition-all hover:opacity-60">
            <X size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-4 pt-4 gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 h-0.5 transition-all"
              style={{ backgroundColor: i <= step ? "#C75B39" : "rgba(245,240,235,0.06)" }}
            />
          ))}
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 min-h-[260px]">
          {/* Step 0: Platform selection */}
          {step === 0 && (
            <div>
              <h3 className="text-xs font-semibold mb-3" style={{ color: "#F5F0EB" }}>Choisis une plateforme</h3>
              <div className="space-y-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className="w-full flex items-center justify-between p-2.5 text-left transition-all text-xs"
                    style={{
                      backgroundColor: platform === p.id ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.03)",
                      border: platform === p.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
                    }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: platform === p.id ? "#F5F0EB" : "rgba(245,240,235,0.6)" }}>
                        {p.label}
                      </span>
                      <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.2)" }}>
                        Via {p.via}
                      </p>
                    </div>
                    {platform === p.id && <Check size={10} style={{ color: "#C75B39" }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Access level */}
          {step === 1 && (
            <div>
              <h3 className="text-xs font-semibold mb-3" style={{ color: "#F5F0EB" }}>Niveau d&apos;accès du manager</h3>
              <div className="space-y-1.5">
                {ACCESS_LEVELS.map((al) => (
                  <button
                    key={al.id}
                    onClick={() => setAccessLevel(al.id)}
                    className="w-full flex items-center justify-between p-2.5 text-left transition-all text-xs"
                    style={{
                      backgroundColor: accessLevel === al.id ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.03)",
                      border: accessLevel === al.id ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: accessLevel === al.id ? "#F5F0EB" : "rgba(245,240,235,0.6)" }}>
                          {al.label}
                        </span>
                        <span className="text-[8px] px-1" style={{
                          backgroundColor: al.risk === "Élevé" ? "rgba(196,69,54,0.1)" : al.risk === "Modéré" ? "rgba(199,91,57,0.1)" : "rgba(122,154,101,0.1)",
                          color: al.risk === "Élevé" ? "#C44536" : al.risk === "Modéré" ? "#C75B39" : "#7A9A65",
                        }}>
                          {al.risk}
                        </span>
                      </div>
                      <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.2)" }}>{al.desc}</p>
                    </div>
                    {accessLevel === al.id && <Check size={10} style={{ color: "#C75B39" }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Instructions */}
          {step === 2 && (
            <div>
              <h3 className="text-xs font-semibold mb-3" style={{ color: "#F5F0EB" }}>Configure sur la plateforme</h3>
              <div className="p-3 text-[10px] leading-relaxed" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
                {platform === "instagram" && (
                  <ol className="space-y-2" style={{ color: "rgba(245,240,235,0.5)" }}>
                    <li><strong style={{ color: "#F5F0EB" }}>1.</strong> Settings → Account → Switch to Professional → Business</li>
                    <li><strong style={{ color: "#F5F0EB" }}>2.</strong> Lie ton compte à une Page Facebook (Settings → Sharing)</li>
                    <li><strong style={{ color: "#F5F0EB" }}>3.</strong> Va sur business.facebook.com → Settings → People → Add People</li>
                    <li><strong style={{ color: "#F5F0EB" }}>4.</strong> Entre l&apos;email du manager, choisis Editor (recommandé)</li>
                    <li><strong style={{ color: "#F5F0EB" }}>5.</strong> Le manager reçoit une invitation par email</li>
                  </ol>
                )}
                {platform === "tiktok" && (
                  <ol className="space-y-2" style={{ color: "rgba(245,240,235,0.5)" }}>
                    <li><strong style={{ color: "#F5F0EB" }}>1.</strong> Va sur ads.tiktok.com → crée un compte Business Center</li>
                    <li><strong style={{ color: "#F5F0EB" }}>2.</strong> Business Center → Assets → TikTok Accounts → Add</li>
                    <li><strong style={{ color: "#F5F0EB" }}>3.</strong> Business Center → User Management → Members → Invite</li>
                    <li><strong style={{ color: "#F5F0EB" }}>4.</strong> Entre l&apos;email, choisis Operator (recommandé)</li>
                  </ol>
                )}
                {platform === "youtube" && (
                  <ol className="space-y-2" style={{ color: "rgba(245,240,235,0.5)" }}>
                    <li><strong style={{ color: "#F5F0EB" }}>1.</strong> Assure-toi que ta chaîne est un Brand Account</li>
                    <li><strong style={{ color: "#F5F0EB" }}>2.</strong> Settings → Permissions → Manage permissions</li>
                    <li><strong style={{ color: "#F5F0EB" }}>3.</strong> Add permissions → entre l&apos;email du manager</li>
                    <li><strong style={{ color: "#F5F0EB" }}>4.</strong> Choisis Manager (recommandé)</li>
                  </ol>
                )}
                {platform === "onlyfans" && (
                  <div className="space-y-2" style={{ color: "rgba(245,240,235,0.5)" }}>
                    <p>Pas de co-management officiel. Utilise un gestionnaire de mots de passe (Bitwarden Teams, 1Password Teams) pour partager l&apos;accès en toute sécurité.</p>
                    <p className="text-[9px]" style={{ color: "#C75B39" }}>⚠ Active la 2FA et change le mot de passe à chaque départ.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Verification & Details */}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold" style={{ color: "#F5F0EB" }}>Détails du manager</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Email *</label>
                  <input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="manager@example.com"
                    className="w-full p-2 text-xs mt-1 bg-transparent transition-all"
                    style={{
                      color: "#F5F0EB",
                      border: "1px solid rgba(245,240,235,0.1)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Nom (optionnel)</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full p-2 text-xs mt-1 bg-transparent transition-all"
                    style={{
                      color: "#F5F0EB",
                      border: "1px solid rgba(245,240,235,0.1)",
                    }}
                  />
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>Vérification</h4>
                <div className="space-y-1.5">
                  {VERIFICATION_ITEMS.map((item, i) => (
                    <label key={i} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!verified[i]}
                        onChange={() => setVerified((v) => ({ ...v, [i]: !v[i] }))}
                        className="mt-0.5 accent-[#C75B39] shrink-0"
                      />
                      <span className="text-[10px]" style={{ color: verified[i] ? "#F5F0EB" : "rgba(245,240,235,0.3)" }}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Rôle précis, instructions particulières..."
                  rows={2}
                  className="w-full p-2 text-xs mt-1 bg-transparent transition-all resize-none"
                  style={{
                    color: "#F5F0EB",
                    border: "1px solid rgba(245,240,235,0.1)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check size={14} style={{ color: "#7A9A65" }} />
                <h3 className="text-xs font-semibold" style={{ color: "#F5F0EB" }}>Récapitulatif</h3>
              </div>
              <div className="p-3 space-y-2 text-xs" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(245,240,235,0.3)" }}>Plateforme</span>
                  <span style={{ color: "#F5F0EB" }}>{PLATFORMS.find((p) => p.id === platform)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(245,240,235,0.3)" }}>Accès</span>
                  <span style={{ color: "#F5F0EB" }}>{ACCESS_LEVELS.find((a) => a.id === accessLevel)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "rgba(245,240,235,0.3)" }}>Manager</span>
                  <span style={{ color: "#F5F0EB" }}>{managerEmail}</span>
                </div>
                {managerName && (
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>Nom</span>
                    <span style={{ color: "#F5F0EB" }}>{managerName}</span>
                  </div>
                )}
              </div>
              {error && (
                <div className="text-[10px] p-2" style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "#C44536" }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <button
            onClick={step === 0 ? onClose : handleBack}
            className="text-[10px] font-medium py-2 px-3 transition-all hover:opacity-70 flex items-center gap-1"
            style={{ color: "rgba(245,240,235,0.3)" }}
          >
            <ArrowLeft size={10} />
            {step === 0 ? "Annuler" : "Retour"}
          </button>
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="text-[10px] font-semibold py-2 px-4 transition-all flex items-center gap-1 disabled:opacity-30"
              style={{
                backgroundColor: canProceed() ? "#C75B39" : "rgba(245,240,235,0.06)",
                color: canProceed() ? "#F5F0EB" : "rgba(245,240,235,0.2)",
              }}
            >
              Suivant
              <ArrowRight size={10} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="text-[10px] font-semibold py-2 px-4 transition-all flex items-center gap-1 disabled:opacity-30"
              style={{
                backgroundColor: loading ? "rgba(245,240,235,0.06)" : "#C75B39",
                color: loading ? "rgba(245,240,235,0.2)" : "#F5F0EB",
              }}
            >
              {loading ? "Création..." : "Confirmer et créer"}
              <Mail size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
