"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Info, Check } from "lucide-react";

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

  useEffect(() => {
    fetch("/api/sovereign-chat/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

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
          <Shield size={16} style={{ color: "#C75B39" }} />
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Conformité IA
          </h1>
        </div>
        <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
          Paramètres de conformité pour les drafts IA — conformes aux régulations 2026
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
        <Info size={12} className="shrink-0 mt-0.5" style={{ color: "#C75B39" }} />
        <div>
          <strong style={{ color: "#C75B39" }}>Souveraineté du créateur</strong> — Ces
          paramètres contrôlent comment l&apos;IA assiste sans jamais remplacer la validation
          humaine. Le drafter ne s&apos;envoie jamais automatiquement : c&apos;est
          strictement <strong style={{ color: "#F5F0EB" }}>DRAFT → VALIDATION → ENVOI</strong>.
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
          style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "#C44536" }}
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
                        style={{ color: "#F5F0EB" }}
                      >
                        {t.title}
                      </span>
                      <span
                        className="text-[8px] px-1 py-0.5 uppercase tracking-wider"
                        style={{
                          backgroundColor: "rgba(199,91,57,0.08)",
                          color: "#C75B39",
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
                          color: "#7A9A65",
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
                            ? "#7A9A65"
                            : "rgba(245,240,235,0.1)",
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                          style={{
                            backgroundColor: "#F5F0EB",
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
            color: "#7A9A65",
          }}
        >
          <Check size={10} />
          Paramètres sauvegardés
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
          <AlertTriangle size={10} style={{ color: "#C75B39" }} />
          <span style={{ color: "#C75B39" }}>
            Important — Conservation légale 7 ans
          </span>
        </div>
        <p>
          Chaque draft conserve : prompt complet, réponse Claude, checks de
          conformité, timestamp, édition éventuelle, timestamp et canal d&apos;envoi.
          Ces données constituent une preuve juridique en cas de litige ou de
          procès collectif (type OnlyFans 2026).
        </p>
        <p>
          Le logging détaillé n&apos;est pas désactivable pour des raisons de
          conformité et de protection juridique du créateur.
        </p>
      </div>
    </div>
  );
}
