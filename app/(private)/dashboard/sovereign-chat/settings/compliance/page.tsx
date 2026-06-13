"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, AlertTriangle, Info, Check, Pause, Play, Eye, Clock, Activity, FileText, ChevronRight } from "lucide-react";

interface Settings {
  auto_disclaimer_email: boolean;
  watermark_ai_assisted: boolean;
  detailed_audit_logging: boolean;
  reject_on_ai_warning: boolean;
}

const TOGGLES = [
  {
    key: "auto_disclaimer_email" as const,
    title: "Disclaimer auto en pied d'email",
    desc: "Ajoute automatiquement une mention 'assistance IA, validé par le créateur' dans les emails générés.",
    legal: "Requis CAN-SPAM / RGPD",
    always_on: false,
  },
  {
    key: "watermark_ai_assisted" as const,
    title: "Watermark AI-assisted (OF/MYM)",
    desc: "Ajoute une note discrète sur les drafts OnlyFans/MYM pour respecter les règles de divulgation IA 2026.",
    legal: "Recommandé OnlyFans 2026",
    always_on: false,
  },
  {
    key: "detailed_audit_logging" as const,
    title: "Logging détaillé pour audit",
    desc: "Conserve l'intégralité des prompts, réponses Claude, modifications et timestamps. Conservation 7 ans.",
    legal: "Preuve juridique obligatoire",
    always_on: true,
  },
  {
    key: "reject_on_ai_warning" as const,
    title: "Refuser génération si warning",
    desc: "Si l'IA détecte un risque (mineur, harcèlement, demande illégale), bloque la génération et enregistre l'incident.",
    legal: "Protection légale",
    always_on: false,
  },
];

export default function ComplianceSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Enhanced state for Phase 2B
  const [consentComplete, setConsentComplete] = useState<boolean | null>(null);
  const [consentItems, setConsentItems] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [auditLogs, setAuditLogs] = useState<Array<{ action: string; created_at: string; metadata?: Record<string, unknown> }>>([]);
  const [complianceStats, setComplianceStats] = useState({ pending: 0, blocked: 0, escalated: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [settingsRes, consentRes, auditRes] = await Promise.all([
          fetch("/api/sovereign-chat/settings"),
          fetch("/api/chat-ai/consent"),
          fetch("/api/chat-ai/audit?limit=5"),
        ]);

        if (cancelled) return;

        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings);
        setIsPaused(settingsData.settings?.is_paused || false);

        const consentData = await consentRes.json();
        const checklist = consentData.checklist;
        if (checklist) {
          const items = [
            checklist.item_1_authorized, checklist.item_2_platform_rules,
            checklist.item_3_ia_limitations, checklist.item_4_no_guarantee,
            checklist.item_5_no_revenue_guarantee, checklist.item_6_human_approval,
            checklist.item_7_disclosure, checklist.item_8_boundaries,
            checklist.item_9_audit_logged, checklist.item_10_can_disable,
            checklist.item_11_legal_info_only,
          ];
          const completed = items.filter(Boolean).length;
          setConsentItems(completed);
          setConsentComplete(completed === 11);
        }

        const auditData = await auditRes.json();
        if (!cancelled) setAuditLogs(auditData.logs || []);

        try {
          const [pendingRes, blockedRes, escalatedRes] = await Promise.all([
            fetch("/api/chat-ai/qa-items?status=pending&limit=1"),
            fetch("/api/chat-ai/qa-items?status=blocked&limit=1"),
            fetch("/api/chat-ai/qa-items?status=escalated&limit=1"),
          ]);
          if (cancelled) return;
          const pendingData = await pendingRes.json();
          const blockedData = await blockedRes.json();
          const escalatedData = await escalatedRes.json();
          setComplianceStats({
            pending: pendingData.items?.length || 0,
            blocked: blockedData.items?.length || 0,
            escalated: escalatedData.items?.length || 0,
          });
        } catch { /* stats are optional */ }
      } catch {
        if (!cancelled) setError("Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const handlePauseToggle = async () => {
    setPausing(true);
    try {
      const res = await fetch("/api/sovereign-chat/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_paused: !isPaused }),
      });
      if (res.ok) setIsPaused(!isPaused);
    } catch { /* keep current state */ }
    setPausing(false);
  };

  const handleToggle = async (key: keyof Settings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/sovereign-chat/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: updated[key] }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSettings(settings);
      setError("Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={16} style={{ color: "var(--accent)" }} />
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Conformité IA
          </h1>
        </div>
        <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
          Paramètres de conformité pour les drafts IA, conformes aux régulations 2026
          (OnlyFans, Meta, TikTok, CAN-SPAM, RGPD)
        </p>
      </div>

      {/* Legal banner */}
      <div
        className="flex items-start gap-2 p-3 text-[10px] leading-relaxed"
        style={{
          backgroundColor: "rgba(199,91,57,0.06)",
          border: "1px solid rgba(199,91,57,0.1)",
          color: "rgba(245,240,235,0.5)",
        }}
      >
        <Info size={12} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
        <div>
          <strong style={{ color: "var(--accent)" }}>Souveraineté du créateur</strong>, Ces
          paramètres contrôlent comment l'IA assiste sans jamais remplacer la validation
          humaine. Le drafter ne s'envoie jamais automatiquement : c'est
          strictement <strong style={{ color: "var(--text-primary)" }}>DRAFT → VALIDATION → ENVOI</strong>.
          Tous les drafts conservent un audit trail complet (7 ans).
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse"
              style={{ backgroundColor: "rgba(245,240,235,0.03)" }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          className="text-[10px] p-2"
          style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)" }}
        >
          {error}
        </div>
      )}

      {/* Toggles */}
      {!loading && settings && (
        <div className="space-y-2">
          {TOGGLES.map((t) => {
            const isOn = settings[t.key];
            return (
              <div
                key={t.key}
                className="p-3 transition-all"
                style={{
                  backgroundColor: isOn
                    ? "rgba(122,154,101,0.04)"
                    : "rgba(245,240,235,0.02)",
                  border: isOn
                    ? "1px solid rgba(122,154,101,0.1)"
                    : "1px solid rgba(245,240,235,0.04)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.title}
                      </span>
                      <span
                        className="text-[8px] px-1 py-0.5 uppercase tracking-wider"
                        style={{
                          backgroundColor: "var(--accent-soft)",
                          color: "var(--accent)",
                        }}
                      >
                        {t.legal}
                      </span>
                    </div>
                    <p
                      className="text-[10px] leading-relaxed"
                      style={{ color: "rgba(245,240,235,0.3)" }}
                    >
                      {t.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.always_on ? (
                      <span
                        className="text-[9px] px-2 py-1"
                        style={{
                          backgroundColor: "rgba(122,154,101,0.1)",
                          color: "var(--success)",
                        }}
                      >
                        Toujours actif
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggle(t.key)}
                        disabled={saving}
                        className="w-9 h-5 rounded-full transition-all relative disabled:opacity-50"
                        style={{
                          backgroundColor: isOn
                            ? "var(--success)"
                            : "rgba(245,240,235,0.1)",
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                          style={{
                            backgroundColor: "var(--text-primary)",
                            left: isOn ? "18px" : "2px",
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save indicator */}
      {saved && (
        <div
          className="flex items-center gap-1.5 text-[10px] px-3 py-2"
          style={{
            backgroundColor: "rgba(122,154,101,0.08)",
            color: "var(--success)",
          }}
        >
          <Check size={10} />
          Paramètres sauvegardés
        </div>
      )}

      {/* Compliance overview cards */}
      {!loading && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Consent checklist card */}
          <div style={{ flex: "1 1 220px", padding: 14, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <FileText size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                Checklist consentement
              </span>
            </div>
            {consentComplete === null ? (
              <p style={{ fontSize: 11, color: "rgba(245,240,235,0.15)" }}>Chargement...</p>
            ) : consentComplete ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={14} style={{ color: "var(--success)" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success)" }}>Complète</span>
                </div>
                <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>11/11 items validés</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={14} style={{ color: "var(--accent)" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Incomplète</span>
                </div>
                <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>{consentItems}/11 items validés</p>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(245,240,235,0.06)", marginTop: 6 }}>
                  <div style={{ height: 4, borderRadius: 2, background: consentItems > 8 ? "var(--success)" : "var(--accent)", width: `${(consentItems / 11) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Pause control */}
          <div style={{ flex: "1 1 220px", padding: 14, borderRadius: 8, background: isPaused ? "rgba(196,69,54,0.04)" : "rgba(245,240,235,0.01)", border: isPaused ? "1px solid rgba(196,69,54,0.12)" : "1px solid rgba(245,240,235,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              {isPaused ? <Pause size={12} style={{ color: "var(--danger)" }} /> : <Activity size={12} style={{ color: "rgba(245,240,235,0.3)" }} />}
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                Module IA
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isPaused ? "var(--danger)" : "var(--success)" }}>
                  {isPaused ? "En pause" : "Actif"}
                </span>
                <p style={{ fontSize: 9, color: "rgba(245,240,235,0.2)", marginTop: 2 }}>
                  {isPaused ? "Génération IA bloquée" : "Fonctionnement normal"}
                </p>
              </div>
              <button
                onClick={handlePauseToggle}
                disabled={pausing}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", fontSize: 10, fontWeight: 500,
                  background: isPaused ? "var(--success)" : "var(--danger)",
                  color: "var(--text-primary)", border: "none", borderRadius: 4, cursor: "pointer",
                }}
              >
                {isPaused ? <><Play size={10} /> Reprendre</> : <><Pause size={10} /> Pause urgence</>}
              </button>
            </div>
          </div>

          {/* QA stats */}
          <div style={{ flex: "1 1 220px", padding: 14, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Eye size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
                QA en attente
              </span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(245,240,235,0.3)" }}>{complianceStats.pending}</span>
                <p style={{ fontSize: 8, color: "rgba(245,240,235,0.15)", marginTop: 1 }}>En attente</p>
              </div>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)" }}>{complianceStats.blocked}</span>
                <p style={{ fontSize: 8, color: "rgba(245,240,235,0.15)", marginTop: 1 }}>Bloqués</p>
              </div>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--or, #D8A95B)" }}>{complianceStats.escalated}</span>
                <p style={{ fontSize: 8, color: "rgba(245,240,235,0.15)", marginTop: 1 }}>Escaladés</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Link
                  href="/dashboard/sovereign-chat/qa-review"
                  style={{
                    display: "flex", alignItems: "center", gap: 3, fontSize: 9, padding: "3px 8px",
                    color: "var(--accent)", background: "rgba(199,91,57,0.06)", borderRadius: 3, textDecoration: "none",
                  }}
                >
                  Voir <ChevronRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent audit preview */}
      {!loading && auditLogs.length > 0 && (
        <div style={{ padding: 14, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Clock size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
              Derniers événements d'audit
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {auditLogs.slice(0, 5).map((log, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, padding: "2px 0" }}>
                <span style={{ color: "rgba(245,240,235,0.3)", minWidth: 140 }}>
                  {new Date(log.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span style={{ color: "rgba(245,240,235,0.5)", fontSize: 9 }}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info footer */}
      <div
        className="p-4 text-[10px] leading-relaxed space-y-2"
        style={{
          backgroundColor: "rgba(245,240,235,0.02)",
          border: "1px solid rgba(245,240,235,0.04)",
          color: "rgba(245,240,235,0.3)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={10} style={{ color: "var(--accent)" }} />
          <span style={{ color: "var(--accent)" }}>
            Important, Conservation légale 7 ans
          </span>
        </div>
        <p>
          Chaque draft conserve : prompt complet, réponse Claude, checks de
          conformité, timestamp, édition éventuelle, timestamp et canal d'envoi.
          Ces données constituent une preuve juridique en cas de litige ou de
          procès collectif (type OnlyFans 2026).
        </p>
        <p>
          Le logging détaillé n'est pas désactivable pour des raisons de
          conformité et de protection juridique du créateur.
        </p>
      </div>
    </div>
  );
}
