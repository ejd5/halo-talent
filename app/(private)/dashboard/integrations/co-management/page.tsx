"use client";

import { useState, useEffect } from "react";
import {
  Shield, AlertTriangle, Check, X, ExternalLink,
  ChevronDown, Users, Clock, Globe, Lock, Info,
} from "lucide-react";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { RevokeModal } from "./components/RevokeModal";

interface CoManagement {
  id: string;
  platform: string;
  manager_email: string;
  manager_name: string | null;
  access_level: string;
  status: string;
  invited_at: string;
}

const COMPARISON = [
  { criterion: "Légalité", antidetect: "Zone grise", comanage: "100% officiel", win: "comanage" },
  { criterion: "Risque de ban", antidetect: "Modéré à élevé", comanage: "Aucun", win: "comanage" },
  { criterion: "Setup", antidetect: "Complexe", comanage: "10 minutes", win: "comanage" },
  { criterion: "Coût", antidetect: "29-300 $/mois", comanage: "Gratuit", win: "comanage" },
  { criterion: "Audit trail", antidetect: "Manuel", comanage: "Automatique", win: "comanage" },
  { criterion: "Réversibilité", antidetect: "Manuelle", comanage: "Instantanée", win: "comanage" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "onlyfans", label: "OnlyFans / MYM / Fansly", special: true },
] as const;

export default function CoManagementPage() {
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [coManagements, setCoManagements] = useState<CoManagement[]>([]);
  const [revokeTarget, setRevokeTarget] = useState<CoManagement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/integrations/co-management")
      .then((r) => r.json())
      .then((d) => setCoManagements(d.co_managements ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeManagers = coManagements.filter((c) => c.status === "active");
  const pendingManagers = coManagements.filter((c) => c.status === "pending");

  const handleSetupDone = async (platform: string) => {
    setShowWizard(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* ═══ Header ═══ */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} style={{ color: "var(--accent)" }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5"
            style={{
              backgroundColor: "rgba(199,91,57,0.1)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
            }}
          >
            Officiel
          </span>
        </div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Co-management officiel
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "rgba(245,240,235,0.4)" }}
        >
          La solution conforme et sécurisée pour gérer plusieurs comptes
        </p>
      </div>

      {/* ═══ Stats bar ═══ */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3" style={{ backgroundColor: "rgba(122,154,101,0.06)", border: "1px solid rgba(122,154,101,0.1)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(122,154,101,0.5)" }}>Actifs</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--success)" }}>
            {loading ? "..." : activeManagers.length}
          </p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(199,91,57,0.5)" }}>En attente</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--accent)" }}>
            {loading ? "..." : pendingManagers.length}
          </p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Économie</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "var(--text-primary)" }}>
            ~{(activeManagers.length * 59).toFixed(0)}€
          </p>
        </div>
      </div>

      {/* ═══ Intro ═══ */}
      <div
        className="p-4 text-xs leading-relaxed"
        style={{
          backgroundColor: "rgba(245,240,235,0.03)",
          borderLeft: "3px solid var(--accent)",
          color: "rgba(245,240,235,0.5)",
        }}
      >
        Plutôt que de partager vos mots de passe ou d&apos;utiliser des outils
        risqués (anti-detect browsers), donnez à votre équipe un accès officiel
        via les systèmes des plateformes elles-mêmes. C&apos;est gratuit, instantané,
        révocable à tout moment, et entièrement conforme.
      </div>

      {/* ═══ Comparison Table ═══ */}
      <section>
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Anti-detect vs Co-management officiel
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="text-left font-medium py-2.5 px-3" style={{ color: "rgba(245,240,235,0.3)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Critère</th>
                <th className="text-left font-medium py-2.5 px-3" style={{ color: "var(--danger)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Anti-detect browser</th>
                <th className="text-left font-medium py-2.5 px-3" style={{ color: "var(--success)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Co-management officiel</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.criterion}>
                  <td className="py-2.5 px-3 font-medium" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{row.criterion}</td>
                  <td className="py-2.5 px-3" style={{ color: "rgba(196,69,54,0.6)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                    <div className="flex items-center gap-1.5">
                      <X size={10} style={{ color: "var(--danger)" }} />
                      {row.antidetect}
                    </div>
                  </td>
                  <td className="py-2.5 px-3" style={{ color: "rgba(122,154,101,0.7)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                    <div className="flex items-center gap-1.5">
                      <Check size={10} style={{ color: "var(--success)" }} />
                      {row.comanage}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ Platform guides (accordion) ═══ */}
      <section>
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Configurer par plateforme
        </h2>
        <div className="space-y-2">
          {PLATFORMS.map((pf) => {
            const isOpen = activePlatform === pf.id;
            return (
              <div key={pf.id} className="transition-all" style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
                <button
                  onClick={() => setActivePlatform(isOpen ? null : pf.id)}
                  className="w-full flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{pf.label}</span>
                    {"special" in pf && pf.special && (
                      <span className="text-[8px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                        Pas de système officiel
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={12}
                    style={{
                      color: "rgba(245,240,235,0.2)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="px-3 pb-4">
                    {pf.id === "instagram" && <InstagramGuide onDone={handleSetupDone} />}
                    {pf.id === "tiktok" && <TikTokGuide onDone={handleSetupDone} />}
                    {pf.id === "youtube" && <YouTubeGuide onDone={handleSetupDone} />}
                    {pf.id === "onlyfans" && <OnlyFansGuide />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ Active managers list ═══ */}
      {activeManagers.length > 0 && (
        <section>
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Accès configurés
          </h2>
          <div className="space-y-2">
            {activeManagers.map((cm) => (
              <div
                key={cm.id}
                className="flex items-center justify-between p-3"
                style={{ backgroundColor: "rgba(122,154,101,0.04)", border: "1px solid rgba(122,154,101,0.1)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: "rgba(122,154,101,0.1)" }}>
                    <Users size={12} style={{ color: "var(--success)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{cm.manager_name || cm.manager_email}</p>
                    <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                      {cm.platform} · {cm.manager_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] px-1.5 py-0.5 uppercase tracking-wider" style={{ backgroundColor: "rgba(122,154,101,0.1)", color: "var(--success)" }}>
                    {cm.access_level}
                  </span>
                  <button
                    onClick={() => setRevokeTarget(cm)}
                    className="text-[9px] px-2 py-1 transition-all hover:opacity-70"
                    style={{ color: "rgba(245,240,235,0.2)" }}
                  >
                    Révoquer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Commercial footer ═══ */}
      <div
        className="p-5 text-sm leading-relaxed"
        style={{
          backgroundColor: "rgba(199,91,57,0.04)",
          border: "1px solid rgba(199,91,57,0.1)",
          color: "rgba(245,240,235,0.6)",
        }}
      >
        <p className="font-medium mb-2" style={{ color: "var(--accent)" }}>
          Cette fonctionnalité couvre 90% des besoins réels en gestion multi-comptes
        </p>
        <p>
          Contrairement aux anti-detect browsers, elle est{" "}
          <strong style={{ color: "var(--text-primary)" }}>gratuite</strong>,{" "}
          <strong style={{ color: "var(--text-primary)" }}>instantanée</strong>,{" "}
          <strong style={{ color: "var(--text-primary)" }}>sécurisée</strong>, et préserve votre{" "}
          <strong style={{ color: "var(--text-primary)" }}>Zero Ban Guarantee</strong>.
        </p>
      </div>

      {/* ═══ Quick links ═══ */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setShowWizard(true)}
          className="flex-1 text-[10px] font-medium py-2.5 transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Globe size={10} />
          Assistant de configuration
        </button>
        <a
          href="/dashboard/integrations/co-management/audit"
          className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-70 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
        >
          <Clock size={10} />
          Journal d&apos;audit
        </a>
        <a
          href="/dashboard/integrations/pro-mode"
          className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-70 flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)", border: "1px solid rgba(196,69,54,0.15)" }}
        >
          <AlertTriangle size={10} />
          Anti-detect browsers (risqué)
        </a>
      </div>

      {/* ═══ Wizard modal ═══ */}
      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} onComplete={() => { window.location.reload(); }} />}

      {/* ═══ Revoke modal ═══ */}
      {revokeTarget && (
        <RevokeModal
          coManagement={revokeTarget}
          onClose={() => setRevokeTarget(null)}
          onRevoked={() => { window.location.reload(); }}
        />
      )}
    </div>
  );
}

// ─── Instagram Guide ──────────────────────────────────────────

function InstagramGuide({ onDone }: { onDone: (p: string) => void }) {
  const steps = [
    { num: 1, title: "Convertir en compte Business", detail: "Settings → Account → Switch to Professional → Business. Un compte Business est requis pour le co-management via Meta." },
    { num: 2, title: "Lier à une Page Facebook", detail: "Si tu n'as pas de Page Facebook, crée-en une (Settings → Sharing → Page). Le co-management Instagram passe par Meta Business Suite." },
    { num: 3, title: "Ouvrir Meta Business Suite", detail: "Va sur business.facebook.com  Settings → People → Add People." },
    { num: 4, title: "Inviter le manager", detail: "Entre l'email de ton manager. Il/elle doit avoir un compte Meta avec cet email." },
    { num: 5, title: "Choisir le niveau d'accès", detail: "Editor (recommandé) : créer du contenu, répondre aux DMs, modérer. Moderator : modérer + répondre. Analyst : lecture seule. Admin : tous les accès (à éviter)." },
    { num: 6, title: "Le manager accepte", detail: "Ton manager reçoit une invitation email. Il l'accepte avec SON propre compte Meta. Il accède via business.facebook.com sans jamais connaître ton mot de passe." },
  ];

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-3">
      <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
        Compte Business uniquement
      </p>
      {steps.map((s) => (
        <div key={s.num} className="flex gap-2.5" style={{ borderLeft: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="flex flex-col items-center">
            <div
              className="w-5 h-5 flex items-center justify-center text-[9px] font-medium shrink-0"
              style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
            >
              {s.num}
            </div>
            <div className="flex-1 w-px" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          </div>
          <div className="pb-3">
            <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.title}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{s.detail}</p>
          </div>
        </div>
      ))}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full text-[10px] font-semibold py-2.5 transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
      >
        <Check size={10} />
        J&apos;ai configuré l&apos;accès Instagram
      </button>
      {showConfirm && (
        <div className="text-[10px] p-2" style={{ backgroundColor: "rgba(122,154,101,0.06)", color: "var(--success)" }}>
          ✅ Enregistré. Ton manager peut maintenant accéder via business.facebook.com.
        </div>
      )}
    </div>
  );
}

// ─── TikTok Guide ────────────────────────────────────────────

function TikTokGuide({ onDone }: { onDone: (p: string) => void }) {
  const steps = [
    { num: 1, title: "Activer TikTok Business", detail: "Va sur ads.tiktok.com et crée un compte Business Center. C'est gratuit." },
    { num: 2, title: "Lier ton compte TikTok", detail: "Business Center → Assets → TikTok Accounts → Add. Connecte ton compte TikTok." },
    { num: 3, title: "Inviter un membre", detail: "Business Center → User Management → Members → Invite. Entre l'email du manager." },
    { num: 4, title: "Définir le rôle", detail: "Operator (recommandé) : gérer le contenu et les annonces sans accès billing. Admin : accès complet. Analyst : lecture seule des performances." },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
        Via TikTok Business Center
      </p>
      {steps.map((s) => (
        <div key={s.num} className="flex gap-2.5" style={{ borderLeft: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 flex items-center justify-center text-[9px] font-medium shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
              {s.num}
            </div>
            <div className="flex-1 w-px" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          </div>
          <div className="pb-3">
            <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.title}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── YouTube Guide ────────────────────────────────────────────

function YouTubeGuide({ onDone }: { onDone: (p: string) => void }) {
  const steps = [
    { num: 1, title: "Utiliser un Brand Account", detail: "Assure-toi que ta chaîne est un Brand Account (pas un compte personnel). Settings → Advanced Settings → Brand Account." },
    { num: 2, title: "Ouvrir les permissions", detail: "Settings → Permissions → Manage permissions. Tu vois la liste des accès actuels." },
    { num: 3, title: "Inviter par email", detail: "Clique sur Add permissions → entre l'email du manager." },
    { num: 4, title: "Choisir le rôle", detail: "Manager (recommandé) : gérer la chaîne, les vidéos, les analytics. Owner : tous les droits. Communications Manager : gérer les community posts et commentaires." },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
        Via Brand Account YouTube
      </p>
      {steps.map((s) => (
        <div key={s.num} className="flex gap-2.5" style={{ borderLeft: "1px solid rgba(245,240,235,0.06)" }}>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 flex items-center justify-center text-[9px] font-medium shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
              {s.num}
            </div>
            <div className="flex-1 w-px" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
          </div>
          <div className="pb-3">
            <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.title}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── OnlyFans / MYM / Fansly Guide ────────────────────────────

function OnlyFansGuide() {
  return (
    <div className="space-y-4">
      <div className="p-3 text-xs leading-relaxed flex items-start gap-2" style={{ backgroundColor: "var(--accent-soft)", border: "1px solid var(--accent-border)" }}>
        <Info size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <div>
          <p className="font-medium mb-1" style={{ color: "var(--accent)" }}>Pas de système de co-management officiel</p>
          <p style={{ color: "rgba(245,240,235,0.5)" }}>
            Ces plateformes ne proposent pas d&apos;API ou de rôles délégués. Voici des alternatives sécurisées.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <h4 className="text-xs font-medium mb-2" style={{ color: "var(--text-primary)" }}>Bitwarden Teams</h4>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            Gestionnaire de mots de passe chiffré end-to-end. Partage sécurisé, révocable, avec logs d&apos;audit. Gratuit pour les équipes de 2.
          </p>
        </div>
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <h4 className="text-xs font-medium mb-2" style={{ color: "var(--text-primary)" }}>1Password Teams</h4>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            Alternative premium. Partage par vault, accès révocable, audit trail complet, 2FA intégré.
          </p>
        </div>
      </div>

      <div className="p-3" style={{ backgroundColor: "rgba(196,69,54,0.06)", border: "1px solid rgba(196,69,54,0.1)" }}>
        <h4 className="text-[10px] font-semibold mb-1" style={{ color: "var(--danger)" }}>Si partage de mot de passe (dernier recours)</h4>
        <ul className="text-[9px] space-y-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>
          <li>• Active la 2FA SMS (le manager ne reçoit pas les codes)</li>
          <li>• Change le mot de passe à chaque départ d&apos;équipe</li>
          <li>• Signe un contrat écrit définissant les responsabilités</li>
          <li>• Logger les sessions inhabituelles</li>
        </ul>
      </div>
    </div>
  );
}
