"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, X, ArrowLeft, Check, ChevronDown } from "lucide-react";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

const AVAILABLE_FIELDS = [
  { id: "total_spent", label: "LTV total", type: "number", category: "Fan" },
  { id: "fan_score", label: "Score fan", type: "number", category: "Fan" },
  { id: "fan_tier", label: "Tier", type: "select", options: ["cold", "warm", "engaged", "whale", "vip", "churned"], category: "Fan" },
  { id: "country", label: "Pays", type: "text", category: "Fan" },
  { id: "language", label: "Langue", type: "text", category: "Fan" },
  { id: "last_interaction_at", label: "Dernière interaction", type: "relative_date", category: "Fan" },
  { id: "last_purchase_at", label: "Dernier achat", type: "relative_date", category: "Fan" },
  { id: "purchases_count", label: "Nombre d'achats", type: "number", category: "Fan" },
  { id: "avg_order_value", label: "Panier moyen", type: "number", category: "Fan" },
  { id: "first_seen_at", label: "Inscrit depuis", type: "relative_date", category: "Fan" },
];

const OPERATORS: Record<string, { id: string; label: string }[]> = {
  number: [
    { id: "gte", label: "≥" },
    { id: "gt", label: ">" },
    { id: "lte", label: "≤" },
    { id: "lt", label: "<" },
    { id: "eq", label: "=" },
    { id: "neq", label: "≠" },
    { id: "between", label: "Entre" },
    { id: "is_null", label: "Est vide" },
    { id: "not_null", label: "N'est pas vide" },
  ],
  text: [
    { id: "eq", label: "=" },
    { id: "neq", label: "≠" },
    { id: "contains", label: "Contient" },
    { id: "is_null", label: "Est vide" },
    { id: "not_null", label: "N'est pas vide" },
  ],
  select: [
    { id: "eq", label: "=" },
    { id: "neq", label: "≠" },
    { id: "in", label: "Est dans" },
  ],
  relative_date: [
    { id: "gte", label: "Plus récent que" },
    { id: "lte", label: "Plus vieux que" },
    { id: "between", label: "Entre" },
    { id: "is_null", label: "Est vide" },
    { id: "not_null", label: "N'est pas vide" },
  ],
};

export default function EditSegmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"smart" | "static">("smart");
  const [rules, setRules] = useState<Rule[]>([createRule()]);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showFieldPicker, setShowFieldPicker] = useState<string | null>(null);
  const [showOperatorPicker, setShowOperatorPicker] = useState<string | null>(null);
  const [editingCount, setEditingCount] = useState<string | null>(null);

  function createRule(): Rule {
    return { id: crypto.randomUUID(), field: "", operator: "eq", value: "" };
  }

  const getFieldType = (fieldId: string) => AVAILABLE_FIELDS.find((f) => f.id === fieldId)?.type || "text";
  const getFieldOptions = (fieldId: string) => AVAILABLE_FIELDS.find((f) => f.id === fieldId)?.options || [];
  const getFieldOperators = (fieldId: string) => OPERATORS[getFieldType(fieldId)] || OPERATORS.text;

  // Load existing segment
  useEffect(() => {
    fetch(`/api/sovereign-chat/segments?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.segment) {
          setName(d.segment.name);
          setDescription(d.segment.description || "");
          setType(d.segment.type);
          setRules(
            (d.segment.rules || []).map((r: any) => ({
              id: crypto.randomUUID(),
              field: r.field,
              operator: r.operator,
              value: r.value,
            })),
          );
          if (d.segment.rules?.length === 0) {
            setRules([createRule()]);
          }
        }
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    setRules((prev) => {
      const next = prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r));
      if (updates.field) {
        const ops = getFieldOperators(updates.field);
        return next.map((r) =>
          r.id === ruleId ? { ...r, operator: ops[0]?.id || "eq", value: "" } : r,
        );
      }
      return next;
    });
  };

  const removeRule = (ruleId: string) => setRules((prev) => prev.filter((r) => r.id !== ruleId));
  const addRule = () => setRules((prev) => [...prev, createRule()]);

  // Preview
  useEffect(() => {
    const timer = setTimeout(async () => {
      const validRules = rules.filter((r) => r.field && r.value !== "");
      if (validRules.length === 0) { setPreviewCount(null); return; }
      try {
        const res = await fetch("/api/sovereign-chat/segments/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rules: validRules.map((r) => ({ field: r.field, operator: r.operator, value: r.value })) }),
        });
        const data = await res.json();
        setPreviewCount(data.estimated_count ?? null);
      } catch { setPreviewCount(null); }
    }, 500);
    return () => clearTimeout(timer);
  }, [rules]);

  const handleSave = async () => {
    if (!name.trim()) { setError("Le nom est requis"); return; }
    const validRules = rules.filter((r) => r.field && r.value !== "");
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/sovereign-chat/segments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: name.trim(),
          description: description.trim() || null,
          type,
          rules: validRules.map((r) => ({ field: r.field, operator: r.operator, value: r.value })),
        }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => router.push("/dashboard/sovereign-chat/segments"), 500);
    } catch {
      setError("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="h-8 animate-pulse mb-4" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-12 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/sovereign-chat/segments/${id}`} className="transition-all hover:opacity-70">
          <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
        </Link>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Éditer : {name}
        </h1>
      </div>

      {/* Name & Description */}
      <div className="space-y-3">
        <div>
          <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 text-sm mt-1 bg-transparent transition-all"
            style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 text-sm mt-1 bg-transparent transition-all"
            style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
        </div>
      </div>

      {/* Rules */}
      <div>
        <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>Règles</p>
        <div className="space-y-1">
          {rules.map((rule, index) => (
            <div key={rule.id} className="flex items-center gap-1.5">
              {index > 0 && (
                <div className="flex items-center gap-1.5 w-full mb-1">
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
                  <span className="text-[8px] font-semibold uppercase tracking-wider px-2" style={{ color: "rgba(245,240,235,0.15)" }}>ET</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
                </div>
              )}
              <div className="relative flex-1">
                <button
                  onClick={() => setShowFieldPicker(showFieldPicker === rule.id ? null : rule.id)}
                  className="w-full p-2 text-[10px] text-left transition-all flex items-center justify-between gap-1"
                  style={{
                    backgroundColor: rule.field ? "rgba(199,91,57,0.08)" : "rgba(245,240,235,0.04)",
                    border: "1px solid rgba(245,240,235,0.06)",
                    color: rule.field ? "var(--text-primary)" : "rgba(245,240,235,0.2)",
                  }}
                >
                  <span className="truncate">{rule.field ? AVAILABLE_FIELDS.find((f) => f.id === rule.field)?.label || rule.field : "Champ..."}</span>
                  <ChevronDown size={8} />
                </button>
                {showFieldPicker === rule.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFieldPicker(null)} />
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto py-1"
                      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}>
                      {AVAILABLE_FIELDS.map((f) => (
                        <button key={f.id} onClick={() => { updateRule(rule.id, { field: f.id }); setShowFieldPicker(null); }}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] transition-all hover:opacity-70"
                          style={{ color: rule.field === f.id ? "var(--accent)" : "rgba(245,240,235,0.5)", backgroundColor: rule.field === f.id ? "rgba(199,91,57,0.06)" : "transparent" }}>
                          <span>{f.label}</span>
                          <span className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>{f.category}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {rule.field && (
                <div className="relative w-16">
                  <button onClick={() => setShowOperatorPicker(showOperatorPicker === rule.id ? null : rule.id)}
                    className="w-full p-2 text-[10px] text-center transition-all"
                    style={{ backgroundColor: "rgba(245,240,235,0.04)", border: "1px solid rgba(245,240,235,0.06)", color: "rgba(245,240,235,0.5)" }}>
                    {getFieldOperators(rule.field).find((o) => o.id === rule.operator)?.label || rule.operator}
                  </button>
                  {showOperatorPicker === rule.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowOperatorPicker(null)} />
                      <div className="absolute top-full left-0 right-0 z-20 mt-1 py-1" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}>
                        {getFieldOperators(rule.field).map((op) => (
                          <button key={op.id} onClick={() => { updateRule(rule.id, { operator: op.id, value: ["is_null", "not_null"].includes(op.id) ? "true" : rule.value }); setShowOperatorPicker(null); }}
                            className="w-full px-3 py-1 text-[10px] text-left transition-all hover:opacity-70"
                            style={{ color: rule.operator === op.id ? "var(--accent)" : "rgba(245,240,235,0.5)" }}>
                            {op.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              {rule.field && !["is_null", "not_null"].includes(rule.operator) && (
                <div className="relative flex-1">
                  {getFieldType(rule.field) === "select" ? (
                    <div className="relative">
                      <button onClick={() => setEditingCount(editingCount === rule.id ? null : rule.id)}
                        className="w-full p-2 text-[10px] text-left transition-all"
                        style={{ backgroundColor: "rgba(245,240,235,0.04)", border: "1px solid rgba(245,240,235,0.06)", color: "rgba(245,240,235,0.5)" }}>
                        {Array.isArray(rule.value) ? rule.value.join(", ") : rule.value ? getFieldOptions(rule.field).find((o: string) => o === rule.value) || rule.value : "Valeur..."}
                      </button>
                      {editingCount === rule.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setEditingCount(null)} />
                          <div className="absolute top-full left-0 right-0 z-20 mt-1 py-1" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}>
                            {getFieldOptions(rule.field).map((opt: string) => (
                              <button key={opt} onClick={() => { updateRule(rule.id, { value: rule.operator === "in" ? [opt] : opt }); setEditingCount(null); }}
                                className="w-full px-3 py-1 text-[10px] text-left transition-all hover:opacity-70"
                                style={{ color: "rgba(245,240,235,0.5)" }}>{opt}</button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : getFieldType(rule.field) === "relative_date" ? (
                    <div className="flex items-center gap-1">
                      <input type="number" value={typeof rule.value === "string" ? rule.value.replace(/[^0-9]/g, "") : rule.value}
                        onChange={(e) => updateRule(rule.id, { value: `now-${e.target.value}d` })}
                        className="w-12 p-2 text-[10px] bg-transparent text-center"
                        style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>jours</span>
                    </div>
                  ) : (
                    <input type={getFieldType(rule.field) === "number" ? "number" : "text"} value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      className="w-full p-2 text-[10px] bg-transparent"
                      style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
                  )}
                </div>
              )}
              {rules.length > 1 && (
                <button onClick={() => removeRule(rule.id)} className="p-1.5 transition-all hover:opacity-70" style={{ color: "rgba(245,240,235,0.15)" }}>
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addRule} className="mt-2 text-[10px] font-medium py-1.5 px-3 transition-all hover:opacity-70 flex items-center gap-1"
          style={{ color: "rgba(245,240,235,0.3)" }}>
          <Plus size={10} /> Ajouter une condition
        </button>
      </div>

      {/* Type toggle */}
      <div>
        <label className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>Type</label>
        <div className="flex gap-2 mt-1">
          <button onClick={() => setType("smart")}
            className="flex-1 p-2 text-[10px] font-medium transition-all"
            style={{ backgroundColor: type === "smart" ? "rgba(122,154,101,0.1)" : "rgba(245,240,235,0.03)", border: type === "smart" ? "1px solid rgba(122,154,101,0.2)" : "1px solid rgba(245,240,235,0.06)", color: type === "smart" ? "var(--success)" : "rgba(245,240,235,0.3)" }}>
            Auto (Smart)
          </button>
          <button onClick={() => setType("static")}
            className="flex-1 p-2 text-[10px] font-medium transition-all"
            style={{ backgroundColor: type === "static" ? "rgba(199,91,57,0.1)" : "rgba(245,240,235,0.03)", border: type === "static" ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)", color: type === "static" ? "var(--accent)" : "rgba(245,240,235,0.3)" }}>
            Manuel (Static)
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 text-xs flex items-center justify-between"
        style={{ backgroundColor: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
        <span style={{ color: "rgba(245,240,235,0.5)" }}>
          Aperçu : {previewCount !== null ? <strong style={{ color: "var(--accent)" }}>{previewCount} membres</strong> : <span style={{ color: "rgba(245,240,235,0.2)" }}>Ajoute des conditions</span>}
        </span>
      </div>

      {error && <div className="text-[10px] p-2" style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "var(--danger)" }}>{error}</div>}

      <div className="flex gap-2">
        <Link href={`/dashboard/sovereign-chat/segments/${id}`}
          className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-70"
          style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}>
          Annuler
        </Link>
        <button onClick={handleSave} disabled={saving || saved}
          className="flex-1 text-[10px] font-semibold py-2.5 transition-all flex items-center justify-center gap-1.5 disabled:opacity-30"
          style={{ backgroundColor: saved ? "rgba(122,154,101,0.1)" : "var(--accent)", color: saved ? "var(--success)" : "var(--text-primary)" }}>
          {saved ? <><Check size={10} /> Sauvegardé !</> : saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
