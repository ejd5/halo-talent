"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Loader, Plus, Trash2, ToggleLeft, ToggleRight,
  ArrowLeft, Zap, MessageCircle, Heart, Eye, Bell,
  AlertTriangle, GitBranch, Shuffle,
} from "lucide-react";
import type { CommentRule, RuleActions } from "@/lib/atlas/comments/types";
import { RULE_PRESETS, DEFAULT_TEMPLATES } from "@/lib/atlas/comments/types";

const ACTION_ICONS: Record<string, any> = {
  like: Heart, auto_reply: MessageCircle, hide: Eye,
  notify: Bell, flag_spam: AlertTriangle,
};

const ACTION_LABELS: Record<string, string> = {
  like: "Like auto", auto_reply: "Auto-réponse", hide: "Masquer",
  notify: "Notification", flag_spam: "Signaler spam",
};

export default function CommentRulesPage() {
  const [rules, setRules] = useState<CommentRule[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPresets, setShowPresets] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [rRes, tRes] = await Promise.all([
        fetch("/api/dashboard/atlas/comments/rules"),
        fetch("/api/dashboard/atlas/comments/templates"),
      ]);
      const r = await rRes.json();
      const t = await tRes.json();
      setRules(r.rules ?? []);
      setTemplates(t.templates ?? []);
    } catch {} finally { setLoading(false); }
  }

  async function toggleRule(id: string, currentActive: boolean) {
    try {
      await fetch("/api/dashboard/atlas/comments/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule_id: id, is_active: !currentActive }),
      });
      setRules((prev) => prev.map((r) => r.id === id ? { ...r, is_active: !currentActive } : r));
    } catch {}
  }

  async function deleteRule(id: string) {
    if (!confirm("Supprimer cette règle ?")) return;
    try {
      await fetch(`/api/dashboard/atlas/comments/rules?rule_id=${id}`, { method: "DELETE" });
      setRules((prev) => prev.filter((r) => r.id !== id));
    } catch {}
  }

  async function addPreset(preset: typeof RULE_PRESETS[number]) {
    try {
      const res = await fetch("/api/dashboard/atlas/comments/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: preset.name,
          description: preset.description,
          conditions: preset.conditions,
          actions: preset.actions,
        }),
      });
      const d = await res.json();
      if (d.rule) {
        setRules((prev) => [d.rule, ...prev]);
        setShowPresets(false);
      }
    } catch {}
  }

  async function addTemplate(name: string, responses: string[]) {
    try {
      await fetch("/api/dashboard/atlas/comments/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, responses }),
      });
      fetchData();
    } catch {}
  }

  const activeRules = rules.filter((r) => r.is_active).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/atlas/comments" className="p-1 transition-opacity hover:opacity-70" style={{ color: "var(--color-ink-tertiary)" }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Règles d&apos;auto-réponse
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-secondary)" }}>
              {rules.length} règle{rules.length > 1 ? "s" : ""} · {activeRules} active{activeRules > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={14} /> Nouvelle règle
        </button>
      </div>

      {/* ─── Presets ─── */}
      {showPresets && (
        <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
              Templates de règles
            </h3>
            <button onClick={() => setShowPresets(false)} className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>Annuler</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RULE_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => addPreset(preset)}
                className="p-3 text-left rounded-sm transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(245,240,235,0.06)" }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{preset.name}</span>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{preset.description}</p>
                <div className="flex gap-1 mt-2">
                  {preset.actions.map((action, ai) => (
                    <span key={ai} className="text-[8px] px-1 py-0.5 rounded-sm" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                      {ACTION_LABELS[action.type] || action.type}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Templates section ─── */}
      <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
            Templates de réponses ({templates.length})
          </h3>
          <div className="flex gap-1">
            {DEFAULT_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                onClick={() => addTemplate(tpl.name, tpl.responses)}
                className="text-[8px] px-1.5 py-0.5 rounded-sm transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--accent)" }}
              >
                + {tpl.name}
              </button>
            ))}
          </div>
        </div>
        {templates.length > 0 ? (
          <div className="space-y-1">
            {templates.map((tpl) => (
              <div key={tpl.id} className="flex items-center justify-between p-2 rounded-sm" style={{ border: "1px solid rgba(245,240,235,0.04)" }}>
                <div>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>{tpl.name}</span>
                  <span className="text-[8px] ml-2" style={{ color: "var(--color-ink-tertiary)" }}>
                    {tpl.responses?.length || 0} variations
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {tpl.responses?.slice(0, 3).map((r: string, i: number) => (
                    <span key={i} className="text-[8px] px-1 py-0.5 rounded-sm max-w-[100px] truncate" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--color-ink-tertiary)" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
            Ajoute des templates de réponses pour les auto-réponses
          </p>
        )}
      </div>

      {/* ─── Rules list ─── */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : rules.length === 0 && !showPresets ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Shield size={36} style={{ color: "rgba(255,255,255,0.05)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune règle d'auto-réponse</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Configure des règles pour répondre automatiquement aux commentaires
          </p>
          <button
            onClick={() => setShowPresets(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm mt-4 transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={14} /> Ajouter une règle
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 border transition-colors" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{rule.name}</span>
                    {rule.is_active ? (
                      <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}>Active</span>
                    ) : (
                      <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--color-ink-tertiary)" }}>Inactive</span>
                    )}
                  </div>
                  {rule.description && <p className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>{rule.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Conditions summary */}
                    <div className="flex items-center gap-1 text-[8px]" style={{ color: "var(--color-ink-tertiary)" }}>
                      <GitBranch size={9} />
                      {rule.conditions?.conditions?.length || 0} condition{(rule.conditions?.conditions?.length || 0) > 1 ? "s" : ""}
                    </div>
                    {/* Actions summary */}
                    <div className="flex items-center gap-1 text-[8px]" style={{ color: "var(--color-ink-tertiary)" }}>
                      <Zap size={9} />
                      {rule.actions?.length || 0} action{(rule.actions?.length || 0) > 1 ? "s" : ""}
                    </div>
                    {/* Execution count */}
                    <span className="text-[8px]" style={{ color: "var(--color-ink-tertiary)" }}>
                      {rule.execution_count || 0} exécution{(rule.execution_count || 0) > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {expandedId === rule.id && (
                    <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                      {/* Actions detail */}
                      <div>
                        <span className="text-[8px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Actions</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.actions.map((action, ai) => {
                            const AIcon = ACTION_ICONS[action.type] || Zap;
                            return (
                              <div key={ai} className="flex items-center gap-1 px-2 py-1 rounded-sm text-[9px]" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--text-primary)" }}>
                                <AIcon size={10} style={{ color: "var(--accent)" }} />
                                <span>{ACTION_LABELS[action.type] || action.type}</span>
                                {action.probability && action.probability < 100 && (
                                  <span className="text-[8px]" style={{ color: "var(--color-ink-tertiary)" }}>({action.probability}%)</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Conditions detail */}
                      <div>
                        <span className="text-[8px] uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>Conditions ({rule.conditions?.operator || "and"})</span>
                        <div className="space-y-0.5 mt-1">
                          {rule.conditions?.conditions?.map((cond, ci) => (
                            <div key={ci} className="flex items-center gap-1 text-[9px]" style={{ color: "var(--color-ink-tertiary)" }}>
                              <span className="px-1 rounded-sm" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>{cond.field}</span>
                              <span>{cond.operator}</span>
                              <span className="px-1 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>{Array.isArray(cond.value) ? cond.value.join(", ") : String(cond.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                  >
                    <Shuffle size={13} style={{ color: "var(--color-ink-tertiary)" }} />
                  </button>
                  <button
                    onClick={() => toggleRule(rule.id, rule.is_active)}
                    className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                    style={{ color: rule.is_active ? "var(--success)" : "var(--color-ink-tertiary)" }}
                  >
                    {rule.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="p-1.5 rounded-sm transition-colors hover:bg-white/5" style={{ color: "var(--danger)" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-[9px] p-3 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)", color: "var(--color-ink-tertiary)" }}>
        <strong style={{ color: "var(--accent)" }}>Important :</strong> Les réponses automatiques via API officielle sont autorisées par les plateformes (Meta, TikTok, YouTube). Les DMs privés restent en brouillon. Une variabilité est appliquée pour éviter la détection de bot.
      </div>
    </div>
  );
}
