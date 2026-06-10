"use client";

import { useEffect, useState } from "react";
import {
  Shield, CheckCircle, XCircle, AlertTriangle, FileText, Users,
  ScrollText, Scale, FileSignature, RefreshCw, Download, Trash2,
} from "lucide-react";
import { Section, Spinner, StatusBadge, Toggle, CopyBlock } from "./components/shared";

// ─── Types ───

interface ComplianceChannel {
  channel: string; status: "ok" | "warning" | "error"; label: string; details: string;
}

interface ConsentEntry {
  id: string; consent_type: string; granted: boolean; source: string;
  ip_address: string | null; created_at: string; proof_url: string | null;
  fan: { id: string; display_name: string; email: string; fan_tier: string } | null;
}

interface AuditEntry {
  id: string; event_type: string; entity_type: string; description: string;
  created_at: string;
}

interface Settings {
  ai_disclosure_email: boolean; ai_watermark_drafts: boolean;
  ai_disclose_dm: boolean; detailed_audit_logging: boolean;
  max_emails_per_day_per_fan: number; max_dms_per_day_per_fan: number;
  quiet_hours_start: string; quiet_hours_end: string;
  strict_compliance: boolean;
  retention_drafts: number; retention_audit_logs: number;
  retention_inactive_fans: number; retention_conversations: number;
}

const CONSENT_TYPES = [
  { id: "email", label: "Email consent" },
  { id: "sms", label: "SMS consent" },
  { id: "push", label: "Push consent" },
  { id: "marketing_ai", label: "Marketing AI" },
];

export default function CompliancePage() {
  // Data
  const [statusData, setStatusData] = useState<{ score: number; channels: ComplianceChannel[] } | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [consents, setConsents] = useState<ConsentEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedConsentType, setSelectedConsentType] = useState("");
  const [auditFilter, setAuditFilter] = useState("");
  const [exportFanId, setExportFanId] = useState("");
  const [exportResult, setExportResult] = useState<any>(null);
  const [deleteFanId, setDeleteFanId] = useState("");
  const [privacyTemplate, setPrivacyTemplate] = useState("");
  const [dpaTemplate, setDpaTemplate] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [sRes, settingsRes, consentsRes, auditRes, templatesRes] = await Promise.all([
          fetch("/api/atlas/compliance/status"),
          fetch("/api/atlas/compliance/settings"),
          fetch("/api/atlas/compliance/consents"),
          fetch("/api/atlas/compliance/audit?limit=50"),
          fetch("/api/atlas/compliance/templates"),
        ]);
        if (sRes.ok) setStatusData(await sRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
        if (consentsRes.ok) { const d = await consentsRes.json(); setConsents(d.consents ?? []); }
        if (auditRes.ok) { const d = await auditRes.json(); setAuditLogs(d.logs ?? []); }
        if (templatesRes.ok) { const d = await templatesRes.json(); setTemplates(d.templates ?? []); }
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="space-y-6 animate-fade-in"><Spinner /></div>;

  // ─── Computed ───
  const consentCounts = CONSENT_TYPES.map((ct) => ({
    ...ct,
    count: consents.filter((c) => c.consent_type === ct.id && c.granted).length,
  }));

  async function saveSettings(updates: Partial<Settings>) {
    setSaving(true);
    try {
      const res = await fetch("/api/atlas/compliance/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const d = await res.json();
        setSettings(d);
        setSavedMessage("Paramètres sauvegardés");
        setTimeout(() => setSavedMessage(""), 2000);
      }
    } catch {} finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    if (!exportFanId) return;
    const res = await fetch("/api/atlas/compliance/rgpd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export", fan_id: exportFanId }),
    });
    const d = await res.json();
    setExportResult(d.data);
  }

  async function handleDelete() {
    if (!deleteFanId) return;
    const ok = confirm("Confirmer l'anonymisation totale de ce fan ? (Action irréversible)");
    if (!ok) return;
    await fetch("/api/atlas/compliance/rgpd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", fan_id: deleteFanId }),
    });
    setDeleteFanId("");
    alert("Fan anonymisé avec succès.");
  }

  async function generatePrivacy() {
    const res = await fetch("/api/atlas/compliance/rgpd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_privacy" }),
    });
    const d = await res.json();
    setPrivacyTemplate(d.template);
  }

  async function generateDpa() {
    const res = await fetch("/api/atlas/compliance/rgpd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_dpa" }),
    });
    const d = await res.json();
    setDpaTemplate(d.template);
  }

  // ─── Render ───

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Centre de Conformité
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
          RGPD, CAN-SPAM, TCPA — tout est sous contrôle
        </p>
      </div>

      {/* ─── SECTION 1: STATUS COMPLIANCE ─── */}
      <Section title="Status Compliance" icon={Shield}>
        {statusData && (
          <>
            {/* Score */}
            <div className="flex items-center gap-4 mb-4 p-4" style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: statusData.score >= 80 ? "var(--success)" : statusData.score >= 50 ? "var(--accent)" : "var(--danger)" }}>
                  {statusData.score}%
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>Score conformité</p>
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {statusData.score === 100
                    ? "Tout est conforme. Aucune action requise."
                    : statusData.score >= 80
                      ? "Quasi parfait. Vérifie les points d'attention ci-dessous."
                      : "Des actions sont nécessaires pour être en conformité."}
                </p>
              </div>
            </div>

            {/* Channel statuses */}
            <div className="space-y-2">
              {statusData.channels.map((ch) => (
                <div key={ch.channel} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ch.status} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{ch.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>{ch.details}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* ─── SECTION 2: DISCLOSURES ─── */}
      <Section title="Disclosures IA" icon={FileText}>
        {settings && (
          <>
            <p className="text-xs mb-3" style={{ color: "var(--color-ink-tertiary)" }}>
              Configure comment l'utilisation de l'IA est disclosed à tes fans
            </p>
            <Toggle
              label="Disclosure AI sur les emails"
              desc='Ajoute "Cette communication peut être personnalisée par IA" dans les emails'
              checked={settings.ai_disclosure_email}
              onChange={(v) => saveSettings({ ai_disclosure_email: v })}
            />
            <Toggle
              label="Watermark 'AI-assisted' sur les drafts OnlyFans"
              desc="Marque les drafts générés par IA sur OnlyFans"
              checked={settings.ai_watermark_drafts}
              onChange={(v) => saveSettings({ ai_watermark_drafts: v })}
            />
            <Toggle
              label="Disclose AI use dans les DM"
              desc='Ajoute un bouton "Disclose AI use" dans les conversations DM'
              checked={settings.ai_disclose_dm}
              onChange={(v) => saveSettings({ ai_disclose_dm: v })}
            />
            <Toggle
              label="Logging détaillé pour audit"
              desc="Conserve un log complet de toutes les actions pour preuve juridique"
              checked={settings.detailed_audit_logging}
              onChange={(v) => saveSettings({ detailed_audit_logging: v })}
            />
            {saving && <p className="text-xs mt-2" style={{ color: "var(--color-ink-tertiary)" }}>Sauvegarde...</p>}
            {savedMessage && <p className="text-xs mt-2" style={{ color: "var(--success)" }}>{savedMessage}</p>}
          </>
        )}
      </Section>

      {/* ─── SECTION 3: CONSENTS REGISTRY ─── */}
      <Section title="Consents Registry" icon={Users}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {consentCounts.map((ct) => (
            <div key={ct.id} className="p-3 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{ct.count}</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>{ct.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--color-ink-tertiary)" }}>{consents.length} entrées de consent</p>

        {/* Filter */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => { setSelectedConsentType(""); }} className="text-xs px-3 py-1"
            style={{ backgroundColor: !selectedConsentType ? "rgba(199,91,57,0.12)" : "transparent", color: !selectedConsentType ? "var(--accent)" : "var(--color-ink-tertiary)", border: "1px solid rgba(245,240,235,0.06)" }}>
            Tous
          </button>
          {CONSENT_TYPES.map((ct) => (
            <button key={ct.id} onClick={() => setSelectedConsentType(ct.id)} className="text-xs px-3 py-1"
              style={{ backgroundColor: selectedConsentType === ct.id ? "rgba(199,91,57,0.12)" : "transparent", color: selectedConsentType === ct.id ? "var(--accent)" : "var(--color-ink-tertiary)", border: "1px solid rgba(245,240,235,0.06)" }}>
              {ct.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {consents.filter((c) => !selectedConsentType || c.consent_type === selectedConsentType).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header"><th className="px-3 py-2 text-left font-normal">Fan</th><th className="px-3 py-2 text-left font-normal">Type</th><th className="px-3 py-2 text-left font-normal">Source</th><th className="px-3 py-2 text-left font-normal">Date</th><th className="px-3 py-2 text-left font-normal">IP</th></tr>
              </thead>
              <tbody>
                {consents.filter((c) => !selectedConsentType || c.consent_type === selectedConsentType).slice(0, 30).map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="px-3 py-2" style={{ color: "var(--text-primary)" }}>{c.fan?.display_name ?? "Inconnu"}</td>
                    <td className="px-3 py-2"><span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>{c.consent_type}</span></td>
                    <td className="px-3 py-2"><span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>{c.source}</span></td>
                    <td className="px-3 py-2"><span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</span></td>
                    <td className="px-3 py-2"><span className="text-xs font-mono" style={{ color: "var(--color-ink-tertiary)" }}>{c.ip_address ?? "-"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-tertiary)" }}>Aucun consent enregistré</p>
        )}
      </Section>

      {/* ─── SECTION 4: AUDIT LOGS ─── */}
      <Section title="Audit Logs" icon={ScrollText}>
        <div className="flex gap-2 mb-3 flex-wrap">
          <button onClick={() => setAuditFilter("")} className="text-xs px-3 py-1"
            style={{ backgroundColor: !auditFilter ? "rgba(199,91,57,0.12)" : "transparent", color: !auditFilter ? "var(--accent)" : "var(--color-ink-tertiary)", border: "1px solid rgba(245,240,235,0.06)" }}>
            Tous
          </button>
          {["fan", "campaign", "draft", "rule", "compliance"].map((t) => (
            <button key={t} onClick={() => setAuditFilter(t)} className="text-xs px-3 py-1"
              style={{ backgroundColor: auditFilter === t ? "rgba(199,91,57,0.12)" : "transparent", color: auditFilter === t ? "var(--accent)" : "var(--color-ink-tertiary)", border: "1px solid rgba(245,240,235,0.06)" }}>
              {t}
            </button>
          ))}
        </div>

        {auditLogs.filter((l) => !auditFilter || l.entity_type === auditFilter).length > 0 ? (
          <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
            {auditLogs.filter((l) => !auditFilter || l.entity_type === auditFilter).map((log) => (
              <div key={log.id} className="flex items-center justify-between px-3 py-2 text-sm" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>{log.entity_type}</span>
                  <span style={{ color: "var(--text-primary)" }}>{log.description}</span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--color-ink-tertiary)" }}>
                  {new Date(log.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-tertiary)" }}>Aucun log d'audit</p>
        )}
      </Section>

      {/* ─── SECTION 5: RGPD COMPLIANCE ─── */}
      <Section title="RGPD Compliance" icon={Scale}>
        <div className="space-y-4">
          {/* Export data */}
          <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Export des données fan (Art. 15)</p>
            <div className="flex gap-2">
              <input
                value={exportFanId}
                onChange={(e) => setExportFanId(e.target.value)}
                placeholder="ID du fan"
                className="flex-1 px-3 py-2 text-sm"
                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.06)", color: "var(--text-primary)", outline: "none" }}
              />
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                <Download size={12} /> Exporter
              </button>
            </div>
            {exportResult && (
              <pre className="text-xs mt-2 p-2 max-h-32 overflow-y-auto" style={{ backgroundColor: "var(--bg-primary)", color: "var(--success)", fontFamily: "var(--font-mono)" }}>
                {JSON.stringify(exportResult.fan, null, 2).slice(0, 500)}
              </pre>
            )}
          </div>

          {/* Delete fan */}
          <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Anonymisation fan (Art. 17)</p>
            <div className="flex gap-2">
              <input
                value={deleteFanId}
                onChange={(e) => setDeleteFanId(e.target.value)}
                placeholder="ID du fan à anonymiser"
                className="flex-1 px-3 py-2 text-sm"
                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.06)", color: "var(--text-primary)", outline: "none" }}
              />
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium" style={{ backgroundColor: "rgba(196,69,54,0.12)", color: "var(--danger)" }}>
                <Trash2 size={12} /> Anonymiser
              </button>
            </div>
          </div>

          {/* Generate privacy policy */}
          <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Politique de confidentialité (Art. 30)</p>
            <button onClick={generatePrivacy} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium mb-2" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
              <RefreshCw size={12} /> Générer le template
            </button>
            {privacyTemplate && <CopyBlock content={privacyTemplate} />}
          </div>

          {/* DPA */}
          <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Data Processing Agreement (DPA)</p>
            <button onClick={generateDpa} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium mb-2" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
              <FileSignature size={12} /> Générer le DPA
            </button>
            {dpaTemplate && <CopyBlock content={dpaTemplate} />}
          </div>
        </div>
      </Section>

      {/* ─── SECTION 6: CONTRAT TYPE ─── */}
      <Section title="Templates de contrats" icon={FileSignature}>
        <div className="space-y-4">
          {templates.map((t: any) => (
            <div key={t.id} className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.title}</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>{t.subtitle}</p>
                </div>
              </div>
              <CopyBlock content={t.content} />
            </div>
          ))}
        </div>
      </Section>

      {/* ─── AUTO-COMPLIANCE INFO ─── */}
      <Section title="Protections automatiques" icon={Shield}>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3" style={{ backgroundColor: "rgba(122,154,101,0.04)", border: "1px solid rgba(122,154,101,0.1)" }}>
            <CheckCircle size={16} style={{ color: "var(--success)", marginTop: 2 }} />
            <div>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>Anti-spam check automatique</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>Avant chaque campagne, le contenu est analysé pour détecter les déclencheurs de spam. Score {'>'} 60% = blocage.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3" style={{ backgroundColor: "rgba(91,143,168,0.04)", border: "1px solid rgba(91,143,168,0.1)" }}>
            <CheckCircle size={16} style={{ color: "#5B8FA8", marginTop: 2 }} />
            <div>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>Rate limiting intelligent</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
                Max {settings?.max_emails_per_day_per_fan ?? 3} emails/jour/personne · Max {settings?.max_dms_per_day_per_fan ?? 1} DM/jour/personne · Fenêtre {settings?.quiet_hours_start ?? "21:00"}-{settings?.quiet_hours_end ?? "08:00"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3" style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
            <CheckCircle size={16} style={{ color: "var(--accent)", marginTop: 2 }} />
            <div>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>Unsubscribe automatique</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>Tout fan qui clique unsubscribe est retiré de toutes les futures campagnes. Effectif sous 24h max.</p>
            </div>
          </div>

          {/* Retention config */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Rétention des données</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2" style={{ backgroundColor: "var(--bg-card)" }}>
                <span style={{ color: "var(--color-ink-tertiary)" }}>Drafts IA</span>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{settings?.retention_drafts ?? 90} jours</p>
              </div>
              <div className="p-2" style={{ backgroundColor: "var(--bg-card)" }}>
                <span style={{ color: "var(--color-ink-tertiary)" }}>Logs d'audit</span>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{(settings?.retention_audit_logs ?? 2555) / 365} ans</p>
              </div>
              <div className="p-2" style={{ backgroundColor: "var(--bg-card)" }}>
                <span style={{ color: "var(--color-ink-tertiary)" }}>Fans inactifs</span>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{(settings?.retention_inactive_fans ?? 730)} jours puis archivage</p>
              </div>
              <div className="p-2" style={{ backgroundColor: "var(--bg-card)" }}>
                <span style={{ color: "var(--color-ink-tertiary)" }}>Conversations</span>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{settings?.retention_conversations === -1 ? "Indéfini" : settings?.retention_conversations + " jours"}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
