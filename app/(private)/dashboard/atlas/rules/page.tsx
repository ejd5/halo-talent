"use client";

import { useState, useEffect } from "react";
import {
  Zap, Plus, Play, Clock, CheckCircle, XCircle, AlertTriangle, Filter,
  ToggleLeft, ToggleRight, Trash2, Eye, ExternalLink, Webhook, Key,
  ChevronRight, HelpCircle, Download, MessageSquare,
} from "lucide-react";
import {
  TRIGGER_LABELS, TRIGGER_DESCRIPTIONS, ACTION_LABELS, ACTION_DESCRIPTIONS,
  RULE_TEMPLATES,
} from "@/lib/atlas/automation/rules";
import type { Rule, TriggerType, ActionType, Condition, ActionConfig, TriggerConfig } from "@/lib/atlas/automation/rules";
import { Spinner, EmptyState, Modal, StepIndicator, SelectOption, Input, Badge, Alert } from "./components/shared";

// ─── Main Page ────────────────────────────────────────────────

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<"rules" | "templates" | "api-keys" | "webhooks">("rules");

  // Builder state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  async function loadRules() {
    try {
      const res = await fetch("/api/dashboard/atlas/rules");
      const d = await res.json();
      setRules(d.rules ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRules(); }, []);

  async function toggleRule(id: string, currentActive: boolean) {
    await fetch("/api/dashboard/atlas/rules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruleId: id, is_active: !currentActive }),
    });
    loadRules();
  }

  async function deleteRule(id: string) {
    if (!confirm("Supprimer cette règle ?")) return;
    await fetch(`/api/dashboard/atlas/rules/${id}`, { method: "DELETE" });
    loadRules();
  }

  const filteredRules = rules.filter((r) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return r.name.toLowerCase().includes(f)
      || r.trigger_event.toLowerCase().includes(f);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
            Moteur de règles
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
            Automatise chaque interaction sans coder
          </p>
        </div>
        <button
          onClick={() => { setEditingRule(null); setBuilderOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
        >
          <Plus size={14} /> Créer une règle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        {[
          { id: "rules" as const, label: "Règles", icon: Zap },
          { id: "templates" as const, label: "Templates", icon: Download },
          { id: "api-keys" as const, label: "API Keys", icon: Key },
          { id: "webhooks" as const, label: "Webhooks sortants", icon: Webhook },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all"
            style={{
              color: tab === t.id ? "#C75B39" : "var(--color-ink-tertiary)",
              borderBottom: tab === t.id ? "1px solid #C75B39" : "1px solid transparent",
              marginBottom: -1,
            }}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "rules" && (
        <>
          {/* Search + filters */}
          <div className="flex items-center gap-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Rechercher une règle..."
              className="flex-1 px-3 py-2 text-sm"
              style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }}
            />
            <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
              {filteredRules.length} / {rules.length} règles
            </span>
          </div>

          {loading ? <Spinner /> : filteredRules.length === 0 ? (
            <EmptyState icon={Zap} title={filter ? "Aucune règle trouvée" : "Aucune règle d'automation"}
              desc={filter ? "Essaie un autre filtre" : "Crée ta première règle pour automatiser tes interactions fans"} />
          ) : (
            <div className="space-y-2">
              {filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 transition-colors"
                  style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{rule.name}</span>
                        <Badge text={TRIGGER_LABELS[rule.trigger_event] ?? rule.trigger_event} />
                        {rule.test_mode && <Badge text="TEST" color="#5B8FA8" />}
                      </div>
                      {rule.description && (
                        <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                          {rule.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
                        <span className="flex items-center gap-1"><Play size={10} /> {rule.total_executions ?? 0} exécutions</span>
                        {rule.total_errors > 0 && (
                          <span className="flex items-center gap-1" style={{ color: "#C44536" }}><XCircle size={10} /> {rule.total_errors} erreurs</span>
                        )}
                        {rule.last_executed_at && (
                          <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(rule.last_executed_at)}</span>
                        )}
                      </div>
                      {/* Actions preview */}
                      {rule.actions && rule.actions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {rule.actions.map((a, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(91,143,168,0.08)", color: "#5B8FA8" }}>
                              {ACTION_LABELS[a.type as ActionType] ?? a.type}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <button onClick={() => toggleRule(rule.id, rule.is_active)} className="p-1.5 transition-colors hover:opacity-70"
                        style={{ color: rule.is_active ? "#7A9A65" : "var(--color-ink-tertiary)" }}>
                        {rule.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => deleteRule(rule.id)} className="p-1.5 transition-colors hover:opacity-70"
                        style={{ color: "var(--color-ink-tertiary)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats summary */}
          {!loading && rules.length > 0 && (
            <div className="grid grid-cols-3 gap-3 text-center text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
              <div className="p-3" style={{ backgroundColor: "#2A2420" }}>
                <p className="text-lg font-bold" style={{ color: "#7A9A65" }}>{rules.filter((r) => r.is_active).length}</p>
                <p>Actives</p>
              </div>
              <div className="p-3" style={{ backgroundColor: "#2A2420" }}>
                <p className="text-lg font-bold" style={{ color: "#F5F0EB" }}>{rules.reduce((s, r) => s + (r.total_executions ?? 0), 0)}</p>
                <p>Exécutions totales</p>
              </div>
              <div className="p-3" style={{ backgroundColor: "#2A2420" }}>
                <p className="text-lg font-bold" style={{ color: ruleHasErrors(rules) ? "#C44536" : "#7A9A65" }}>
                  {rules.reduce((s, r) => s + (r.total_errors ?? 0), 0)}
                </p>
                <p>Erreurs</p>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "templates" && (
        <TemplatesTab onSelect={(t) => { setEditingRule(null); setBuilderOpen(true); }} />
      )}

      {tab === "api-keys" && <ApiKeysTab />}
      {tab === "webhooks" && <OutgoingWebhooksTab />}

      {/* Rule Builder Modal */}
      <RuleBuilderModal
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        initialRule={editingRule}
        onSaved={loadRules}
      />
    </div>
  );
}

// ─── Templates Tab ────────────────────────────────────────────

function TemplatesTab({ onSelect }: { onSelect: (template: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
        Bibliothèque de templates prêts à l'emploi. Choisis-en un, personnalise-le et active-le.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {RULE_TEMPLATES.map((t, i) => (
          <div
            key={i}
            className="p-4 cursor-pointer transition-colors"
            style={{
              backgroundColor: selected === String(i) ? "rgba(199,91,57,0.08)" : "#2A2420",
              border: selected === String(i) ? "1px solid #C75B39" : "1px solid rgba(245,240,235,0.06)",
            }}
            onClick={() => setSelected(String(i))}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge text={TRIGGER_LABELS[t.trigger_event] ?? t.trigger_event} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{t.name}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>{t.description}</p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {t.actions.map((a, ai) => (
                <span key={ai} className="text-[10px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(91,143,168,0.08)", color: "#5B8FA8" }}>
                  {ACTION_LABELS[a.type as ActionType]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSelect(selected)}
        disabled={selected === null}
        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium disabled:opacity-40"
        style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
      >
        <Plus size={14} /> Utiliser le template
      </button>
    </div>
  );
}

// ─── API Keys Tab ─────────────────────────────────────────────

function ApiKeysTab() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  async function load() {
    try { const r = await fetch("/api/dashboard/atlas/rules/api-keys"); const d = await r.json(); setKeys(d.keys ?? []); } catch {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!newName) return;
    await fetch("/api/dashboard/atlas/rules/api-keys", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette clé API ?")) return;
    await fetch("/api/dashboard/atlas/rules/api-keys", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyId: id }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
        Les clés API permettent aux services externes (Stripe, Calendly, Typeform...) d'envoyer des événements à Atlas.
      </p>

      <div className="flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom de la clé (ex: Stripe)"
          className="flex-1 px-3 py-2 text-sm"
          style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }} />
        <button onClick={create} className="px-3 py-2 text-xs font-medium" style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}>
          <Plus size={14} className="inline mr-1" />Créer
        </button>
      </div>

      {loading ? <Spinner /> : keys.length === 0 ? (
        <EmptyState icon={Key} title="Aucune clé API" desc="Crée une clé pour connecter des services externes" />
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-3" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{k.name}</p>
                <code className="text-xs font-mono" style={{ color: "var(--color-ink-tertiary)" }}>{k.key.slice(0, 16)}...</code>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
                  Webhook URL: <code className="font-mono">/api/atlas/webhooks/{k.key}/hook-name</code>
                </p>
              </div>
              <button onClick={() => remove(k.id)} className="p-1.5" style={{ color: "var(--color-ink-tertiary)" }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Outgoing Webhooks Tab ────────────────────────────────────

function OutgoingWebhooksTab() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState("");

  async function load() {
    try { const r = await fetch("/api/dashboard/atlas/rules/outgoing"); const d = await r.json(); setWebhooks(d.webhooks ?? []); } catch {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!name || !url || !events) return;
    await fetch("/api/dashboard/atlas/rules/outgoing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, events: events.split(",").map((e) => e.trim()) }),
    });
    setName(""); setUrl(""); setEvents(""); setShowForm(false); load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce webhook ?")) return;
    await fetch("/api/dashboard/atlas/rules/outgoing", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ webhookId: id }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
          Envoie des événements Atlas vers des services externes (Zapier, Make, N8n...)
        </p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 text-xs" style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "#C75B39" }}>
          <Plus size={12} /> {showForm ? "Annuler" : "Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="p-4" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
          <Input label="Nom" value={name} onChange={setName} placeholder="Zapier CRM Sync" />
          <Input label="URL" value={url} onChange={setUrl} placeholder="https://hooks.zapier.com/..." />
          <Input label="Événements (séparés par des virgules)" value={events} onChange={setEvents} placeholder="fan.created, campaign.sent, draft.generated" />
          <button onClick={create} className="px-3 py-2 text-xs font-medium mt-2" style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}>
            Créer le webhook
          </button>
        </div>
      )}

      {loading ? <Spinner /> : webhooks.length === 0 ? (
        <EmptyState icon={Webhook} title="Aucun webhook sortant" desc="Configure des webhooks pour envoyer des événements à des services externes" />
      ) : (
        <div className="space-y-2">
          {webhooks.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-3" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#F5F0EB" }}>{w.name}</p>
                <code className="text-xs font-mono" style={{ color: "var(--color-ink-tertiary)" }}>{w.url}</code>
                <div className="flex gap-1 mt-1">
                  {(w.events ?? []).map((e: string, i: number) => (
                    <Badge key={i} text={e} />
                  ))}
                </div>
              </div>
              <button onClick={() => remove(w.id)} className="p-1.5" style={{ color: "var(--color-ink-tertiary)" }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Rule Builder Modal ───────────────────────────────────────

const WIZARD_STEPS = ["Déclencheur", "Conditions", "Actions", "Paramètres"];
const TRIGGER_OPTIONS = Object.entries(TRIGGER_LABELS).map(([value, label]) => ({ value, label }));

function RuleBuilderModal({ open, onClose, initialRule, onSaved }: {
  open: boolean; onClose: () => void; initialRule: Rule | null; onSaved: () => void;
}) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Rule form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] = useState<string>("fan_created");
  const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({ type: "fan_created" });
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [conditionsLogic, setConditionsLogic] = useState<"all" | "any">("all");
  const [actions, setActions] = useState<ActionConfig[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [rateLimit, setRateLimit] = useState(0);

  // Test results
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // Preset trigger value
  const [triggerValue, setTriggerValue] = useState("");

  function reset() {
    setStep(0); setName(""); setDescription("");
    setTriggerEvent("fan_created"); setTriggerConfig({ type: "fan_created" });
    setConditions([]); setConditionsLogic("all");
    setActions([]); setIsActive(false); setTestMode(false);
    setRateLimit(0); setTriggerValue(""); setTestResults(null);
  }

  useEffect(() => {
    if (!open) return;
    if (initialRule) {
      setName(initialRule.name);
      setDescription(initialRule.description ?? "");
      setTriggerEvent(initialRule.trigger_event);
      setTriggerConfig(initialRule.trigger_config);
      setConditions(initialRule.conditions ?? []);
      setConditionsLogic(initialRule.conditions_logic ?? "all");
      setActions(initialRule.actions ?? []);
      setIsActive(initialRule.is_active);
      setTestMode(initialRule.test_mode);
      setRateLimit(initialRule.rate_limit_per_hour ?? 0);
    } else {
      reset();
    }
  }, [open, initialRule]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name, description,
        trigger_event: triggerEvent,
        trigger_config: { ...triggerConfig, value: triggerValue || undefined },
        conditions, conditions_logic: conditionsLogic,
        actions, is_active: isActive, test_mode: testMode,
        rate_limit_per_hour: rateLimit,
      };

      if (initialRule) {
        await fetch("/api/dashboard/atlas/rules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruleId: initialRule.id, ...payload }),
        });
      } else {
        await fetch("/api/dashboard/atlas/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      onSaved();
      onClose();
    } catch {} finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    try {
      const res = await fetch("/api/dashboard/atlas/rules/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rule: { trigger_event: triggerEvent, conditions, actions, conditions_logic: conditionsLogic },
        }),
      });
      setTestResults(await res.json());
    } catch {} finally {
      setTesting(false);
    }
  }

  function addCondition() {
    setConditions([...conditions, { field: "", operator: "eq", value: "" }]);
  }

  function updateCondition(i: number, updates: Partial<Condition>) {
    setConditions(conditions.map((c, idx) => idx === i ? { ...c, ...updates } : c));
  }

  function removeCondition(i: number) {
    setConditions(conditions.filter((_, idx) => idx !== i));
  }

  function addAction() {
    setActions([...actions, { type: "add_tag" }]);
  }

  function updateAction(i: number, updates: Partial<ActionConfig>) {
    setActions(actions.map((a, idx) => idx === i ? { ...a, ...updates } : a));
  }

  function removeAction(i: number) {
    setActions(actions.filter((_, idx) => idx !== i));
  }

  function handleTriggerChange(type: string) {
    setTriggerEvent(type);
    setTriggerConfig({ type: type as TriggerType });
    setTriggerValue("");
  }

  const canProceed = step === 0 ? !!triggerEvent
    : step === 1 ? true
    : step === 2 ? actions.length > 0
    : !!name;

  return (
    <Modal open={open} onClose={onClose} title={initialRule ? "Modifier la règle" : "Nouvelle règle"}>
      <StepIndicator steps={WIZARD_STEPS} current={step} />

      {/* Step 0: Trigger */}
      {step === 0 && (
        <div className="space-y-4">
          <Input label="Nom de la règle" value={name} onChange={setName} placeholder="ex: Auto-upgrade VIP" />
          <Input label="Description" value={description} onChange={setDescription} placeholder="Ce que fait cette règle..." />

          <SelectOption label="Déclencheur" options={TRIGGER_OPTIONS} value={triggerEvent} onChange={handleTriggerChange} />

          {triggerEvent && (
            <p className="text-xs mb-3" style={{ color: "var(--color-ink-tertiary)" }}>
              {TRIGGER_DESCRIPTIONS[triggerEvent as TriggerType]}
            </p>
          )}

          {/* Conditional trigger value */}
          {(triggerEvent === "tag_added" || triggerEvent === "tag_removed") && (
            <Input label="Nom du tag" value={triggerValue} onChange={setTriggerValue} placeholder="premium" />
          )}
          {triggerEvent === "tier_change" && (
            <SelectOption label="Nouveau tier" options={[
              { value: "whale", label: "Whale" }, { value: "vip", label: "VIP" },
              { value: "engaged", label: "Engaged" }, { value: "warm", label: "Warm" },
              { value: "cold", label: "Cold" }, { value: "churned", label: "Churned" },
            ]} value={triggerValue} onChange={setTriggerValue} />
          )}
          {triggerEvent === "inactive_since" && (
            <Input label="Seuil d'inactivité (jours)" value={triggerValue} onChange={setTriggerValue} type="number" />
          )}
          {triggerEvent === "webhook_received" && (
            <Input label="Nom du hook" value={triggerValue} onChange={setTriggerValue} placeholder="stripe.subscription" />
          )}
        </div>
      )}

      {/* Step 1: Conditions */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
            Les conditions sont optionnelles. Si tu n'ajoutes aucune condition, la règle se déclenche à chaque fois.
          </p>

          {conditions.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs" style={{ color: "var(--color-ink-secondary)" }}>Logique :</span>
              <button onClick={() => setConditionsLogic("all")} className="text-xs px-2 py-1"
                style={{ backgroundColor: conditionsLogic === "all" ? "rgba(199,91,57,0.12)" : "transparent", color: conditionsLogic === "all" ? "#C75B39" : "var(--color-ink-tertiary)" }}>
                TOUTES les conditions
              </button>
              <button onClick={() => setConditionsLogic("any")} className="text-xs px-2 py-1"
                style={{ backgroundColor: conditionsLogic === "any" ? "rgba(199,91,57,0.12)" : "transparent", color: conditionsLogic === "any" ? "#C75B39" : "var(--color-ink-tertiary)" }}>
                N'IMPORTE QUELLE condition
              </button>
            </div>
          )}

          {conditions.map((cond, i) => (
            <div key={i} className="flex items-start gap-2 p-3" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <select value={cond.field} onChange={(e) => updateCondition(i, { field: e.target.value })}
                  className="px-2 py-1.5 text-xs" style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }}>
                  <option value="">Champ</option>
                  <option value="lifetime_value">LTV</option>
                  <option value="total_spent">Total dépensé</option>
                  <option value="purchases_count">Nb achats</option>
                  <option value="fan_tier">Tier</option>
                  <option value="fan_score">Score</option>
                  <option value="days_since_last_interaction">Inactivité (jours)</option>
                </select>
                <select value={cond.operator} onChange={(e) => updateCondition(i, { operator: e.target.value as any })}
                  className="px-2 py-1.5 text-xs" style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }}>
                  <option value="eq">=</option>
                  <option value="neq">≠</option>
                  <option value="gt">&gt;</option>
                  <option value="gte">≥</option>
                  <option value="lt">&lt;</option>
                  <option value="lte">≤</option>
                  <option value="contains">contient</option>
                </select>
                <input value={String(cond.value)} onChange={(e) => updateCondition(i, { value: e.target.value })}
                  placeholder="Valeur"
                  className="px-2 py-1.5 text-xs" style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.06)", color: "#F5F0EB", outline: "none" }} />
              </div>
              <button onClick={() => removeCondition(i)} className="p-1" style={{ color: "#C44536" }}>✕</button>
            </div>
          ))}

          <button onClick={addCondition} className="flex items-center gap-1 px-3 py-1.5 text-xs"
            style={{ color: "#C75B39" }}>
            <Plus size={12} /> Ajouter une condition
          </button>
        </div>
      )}

      {/* Step 2: Actions */}
      {step === 2 && (
        <div className="space-y-4">
          {actions.map((action, i) => (
            <div key={i} className="p-3" style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "#5B8FA8" }}>Action #{i + 1}</span>
                <button onClick={() => removeAction(i)} className="p-0.5" style={{ color: "#C44536" }}>✕</button>
              </div>
              <SelectOption label="Type d'action"
                options={Object.entries(ACTION_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                value={action.type} onChange={(v) => updateAction(i, { type: v as ActionType })} />

              {action.type === "add_tag" && <Input label="Tag à ajouter" value={action.tag ?? ""} onChange={(v) => updateAction(i, { tag: v })} />}
              {action.type === "remove_tag" && <Input label="Tag à retirer" value={action.tag ?? ""} onChange={(v) => updateAction(i, { tag: v })} />}
              {action.type === "change_tier" && (
                <SelectOption label="Nouveau tier"
                  options={[
                    { value: "whale", label: "Whale" }, { value: "vip", label: "VIP" },
                    { value: "engaged", label: "Engaged" }, { value: "warm", label: "Warm" },
                    { value: "cold", label: "Cold" }, { value: "churned", label: "Churned" },
                  ]}
                  value={action.target_tier ?? ""} onChange={(v) => updateAction(i, { target_tier: v })} />
              )}
              {action.type === "update_field" && <>
                <Input label="Nom du champ" value={action.field_name ?? ""} onChange={(v) => updateAction(i, { field_name: v })} />
                <Input label="Valeur" value={action.field_value ?? ""} onChange={(v) => updateAction(i, { field_value: v })} />
              </>}
              {(action.type === "send_email" || action.type === "send_sms") && <>
                <Input label="Sujet" value={action.subject ?? ""} onChange={(v) => updateAction(i, { subject: v })} />
                <Input label="Contenu" value={action.content ?? ""} onChange={(v) => updateAction(i, { content: v })} />
              </>}
              {action.type === "create_draft" && <>
                <Input label="Contenu du draft" value={action.content ?? ""} onChange={(v) => updateAction(i, { content: v })} />
              </>}
              {action.type === "notify_creator" && <>
                <Input label="Message" value={action.message ?? ""} onChange={(v) => updateAction(i, { message: v })} />
              </>}
              {action.type === "http_webhook" && <>
                <Input label="URL" value={action.webhook_url ?? ""} onChange={(v) => updateAction(i, { webhook_url: v })} />
              </>}

              {action.type !== "add_tag" && action.type !== "remove_tag" && action.type !== "change_tier" && action.type !== "update_field" && action.type !== "send_email" && action.type !== "send_sms" && action.type !== "create_draft" && action.type !== "notify_creator" && action.type !== "http_webhook" && (
                <Input label="Délai (minutes)" value={String(action.delay_minutes ?? 0)} onChange={(v) => updateAction(i, { delay_minutes: parseInt(v) || 0 })} type="number" />
              )}

              {action.type !== "add_tag" && action.type !== "remove_tag" && action.type !== "change_tier" && action.type !== "update_field" && action.type !== "send_email" && action.type !== "send_sms" && action.type !== "create_draft" && action.type !== "notify_creator" && action.type !== "http_webhook" && (
                <p className="text-xs mt-2" style={{ color: "var(--color-ink-tertiary)" }}>
                  {ACTION_DESCRIPTIONS[action.type as ActionType] ?? ""}
                </p>
              )}
            </div>
          ))}

          <button onClick={addAction} className="flex items-center gap-1 px-3 py-1.5 text-xs"
            style={{ color: "#5B8FA8" }}>
            <Plus size={12} /> Ajouter une action
          </button>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button" role="switch" aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className="relative w-9 h-5 shrink-0 transition-colors"
              style={{ backgroundColor: isActive ? "#C75B39" : "rgba(245,240,235,0.1)" }}
            >
              <span className="absolute top-0.5 left-0.5 w-4 h-4 transition-transform"
                style={{ backgroundColor: "#F5F0EB", transform: isActive ? "translateX(16px)" : "translateX(0)" }} />
            </button>
            <div>
              <span className="text-sm font-medium" style={{ color: "#F5F0EB" }}>Activer immédiatement</span>
              <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>La règle commence à s'exécuter dès sa création</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button" role="switch" aria-checked={testMode}
              onClick={() => setTestMode(!testMode)}
              className="relative w-9 h-5 shrink-0 transition-colors"
              style={{ backgroundColor: testMode ? "#5B8FA8" : "rgba(245,240,235,0.1)" }}
            >
              <span className="absolute top-0.5 left-0.5 w-4 h-4 transition-transform"
                style={{ backgroundColor: "#F5F0EB", transform: testMode ? "translateX(16px)" : "translateX(0)" }} />
            </button>
            <div>
              <span className="text-sm font-medium" style={{ color: "#F5F0EB" }}>Mode test (dry-run)</span>
              <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Les actions ne sont pas réellement exécutées, seulement loggées</p>
            </div>
          </label>

          <Input label="Rate limit (max exécutions/heure, 0 = illimité)" value={String(rateLimit)} onChange={(v) => setRateLimit(parseInt(v) || 0)} type="number" />

          {/* Test button */}
          <div className="pt-2">
            <button onClick={handleTest} disabled={testing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
              style={{ backgroundColor: "rgba(91,143,168,0.12)", color: "#5B8FA8" }}>
              <Play size={12} /> {testing ? "Test en cours..." : "Tester la règle (dry-run)"}
            </button>

            {testResults && (
              <div className="mt-3 p-3 text-xs" style={{
                backgroundColor: testResults.will_execute ? "rgba(122,154,101,0.04)" : "rgba(199,91,57,0.04)",
                border: `1px solid ${testResults.will_execute ? "rgba(122,154,101,0.1)" : "rgba(199,91,57,0.1)"}`,
              }}>
                <p style={{ color: testResults.will_execute ? "#7A9A65" : "#C75B39" }}>
                  <strong>{testResults.will_execute ? "✓ La règle s'exécutera" : "✗ La règle ne s'exécutera pas"}</strong>
                </p>
                {testResults.conditions?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {testResults.conditions.map((c: any, i: number) => (
                      <p key={i} style={{ color: c.passed ? "#7A9A65" : "#C44536" }}>
                        {c.field} {c.operator} {c.value} → actuel: {c.actual} ({c.passed ? "✓" : "✗"})
                      </p>
                    ))}
                  </div>
                )}
                {testResults.actions_to_execute?.length > 0 && (
                  <div className="mt-2">
                    <p style={{ color: "var(--color-ink-tertiary)" }}>Actions qui seront exécutées :</p>
                    {testResults.actions_to_execute.map((a: any, i: number) => (
                      <p key={i} style={{ color: "#5B8FA8" }}>→ {a.description}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {testMode && (
            <Alert type="info">
              Mode test activé. Les actions seront loggées mais pas exécutées.
            </Alert>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="px-3 py-2 text-xs disabled:opacity-30" style={{ color: "var(--color-ink-tertiary)" }}>
          ← Retour
        </button>

        <div className="flex gap-2">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium disabled:opacity-40"
              style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
            >
              Suivant <ChevronRight size={12} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || !canProceed}
              className="px-4 py-2 text-xs font-medium disabled:opacity-40"
              style={{ backgroundColor: "#7A9A65", color: "#F5F0EB" }}
            >
              {saving ? "Sauvegarde..." : initialRule ? "Mettre à jour" : "Créer la règle"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Utils ────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  return `il y a ${days}j`;
}

function ruleHasErrors(rules: Rule[]): boolean {
  return rules.some((r) => (r.total_errors ?? 0) > 0);
}
