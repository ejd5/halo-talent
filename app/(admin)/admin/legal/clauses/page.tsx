"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, X, Edit3, Trash2, ArrowUp, ArrowDown, FileSignature, Hash, Scale, Gavel } from "lucide-react";

type Clause = {
  id: string;
  label: string;
  description: string | null;
  category: string;
  icon: string | null;
  legal_argument: string;
  severity: number;
  cgu_references: string[];
  law_references: string[];
  sort_order: number;
  is_active: boolean;
};

const CATEGORIES = ["rémunération", "exclusivité", "droits_image", "propriété_intellectuelle", "résiliation", "confidentialité", "modification_unilatérale", "autres"];

export default function LegalClausesPage() {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Clause | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    label: "",
    description: "",
    category: "rémunération",
    icon: "",
    legal_argument: "",
    severity: 3,
    cgu_references: "",
    law_references: "",
    is_active: true,
  });

  const fetchClauses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/legal/clauses");
      const data = await res.json();
      setClauses(data.clauses || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClauses(); }, [fetchClauses]);

  const openCreate = () => {
    setEditing(null);
    setForm({ id: "", label: "", description: "", category: "rémunération", icon: "", legal_argument: "", severity: 3, cgu_references: "", law_references: "", is_active: true });
    setShowModal(true);
  };

  const openEdit = (c: Clause) => {
    setEditing(c);
    setForm({
      id: c.id,
      label: c.label,
      description: c.description || "",
      category: c.category,
      icon: c.icon || "",
      legal_argument: c.legal_argument,
      severity: c.severity,
      cgu_references: c.cgu_references.join("\n"),
      law_references: c.law_references.join("\n"),
      is_active: c.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.label || !form.category || !form.legal_argument) return;
    setSaving(true);
    try {
      const body = {
        id: form.id,
        label: form.label,
        description: form.description || null,
        category: form.category,
        icon: form.icon || null,
        legal_argument: form.legal_argument,
        severity: form.severity,
        cgu_references: form.cgu_references.split("\n").map((s) => s.trim()).filter(Boolean),
        law_references: form.law_references.split("\n").map((s) => s.trim()).filter(Boolean),
        is_active: form.is_active,
      };
      if (editing) {
        await fetch("/api/admin/legal/clauses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orig_id: editing.id, ...body }),
        });
      } else {
        await fetch("/api/admin/legal/clauses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchClauses();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette clause ?")) return;
    try {
      await fetch(`/api/admin/legal/clauses?id=${id}`, { method: "DELETE" });
      fetchClauses();
    } catch (e) { console.error(e); }
  };

  const moveClause = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= clauses.length) return;
    const updated = [...clauses];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((c, i) => (c.sort_order = i));
    setClauses(updated);
    // Persist both swapped items
    for (const c of [updated[index], updated[newIndex]]) {
      await fetch("/api/admin/legal/clauses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orig_id: c.id, sort_order: c.sort_order }),
      });
    }
  };

  const severityColor = (s: number) => {
    if (s <= 2) return "var(--success)";
    if (s <= 4) return "#D4A24C";
    return "var(--danger)";
  };

  const sorted = [...clauses].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileSignature size={24} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
              Clauses abusives
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {clauses.length} clauses, Références CGU et légales, seuil de sévérité
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border-default)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-card)" }}>
                {["", "ID", "Libellé", "Catégorie", "Sévérité", "Réf. CGU", "Réf. Lois", "Actif", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((clause, index) => (
                <tr key={clause.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-0.5">
                      <button onClick={() => moveClause(index, -1)} disabled={index === 0} className="p-0.5 disabled:opacity-20 hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                        <ArrowUp size={12} />
                      </button>
                      <button onClick={() => moveClause(index, 1)} disabled={index === sorted.length - 1} className="p-0.5 disabled:opacity-20 hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{clause.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{clause.label}</div>
                    {clause.description && (
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{clause.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                      {clause.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5" style={{ background: `${severityColor(clause.severity)}20`, color: severityColor(clause.severity) }}>
                      {clause.severity}/5
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {clause.cgu_references.length > 0 ? clause.cgu_references.slice(0, 2).map((r, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>{r}</span>
                      )) : <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>, </span>}
                      {clause.cgu_references.length > 2 && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>+{clause.cgu_references.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {clause.law_references.length > 0 ? clause.law_references.slice(0, 2).map((r, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(212,162,76,0.1)", color: "#D4A24C" }}>{r}</span>
                      )) : <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>, </span>}
                      {clause.law_references.length > 2 && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>+{clause.law_references.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 font-medium ${clause.is_active ? "" : ""}`}
                      style={{ background: clause.is_active ? "rgba(122,154,101,0.12)" : "rgba(196,69,54,0.12)", color: clause.is_active ? "var(--success)" : "var(--danger)" }}>
                      {clause.is_active ? "oui" : "non"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(clause)} className="p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--text-secondary)" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(clause.id)} className="p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--danger)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune clause</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {editing ? "Modifier la clause" : "Nouvelle clause"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--text-secondary)" }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>ID *</label>
                  <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} className="w-full text-sm px-3 py-2 outline-none disabled:opacity-40" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} placeholder="ex: exclusive_clause" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Catégorie *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Libellé *</label>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full text-sm px-3 py-2 outline-none resize-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Argument juridique *</label>
                <textarea value={form.legal_argument} onChange={(e) => setForm({ ...form, legal_argument: e.target.value })} rows={4} className="w-full text-sm px-3 py-2 outline-none resize-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Sévérité (1-5)</label>
                  <input type="number" min={1} max={5} value={form.severity} onChange={(e) => setForm({ ...form, severity: parseInt(e.target.value) || 3 })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Icône</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} placeholder="lucide icon name" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Active</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  <Hash size={12} className="inline mr-1" />Références CGU (une par ligne)
                </label>
                <textarea value={form.cgu_references} onChange={(e) => setForm({ ...form, cgu_references: e.target.value })} rows={3} className="w-full text-sm px-3 py-2 outline-none resize-none font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} placeholder="Art. 8.2 - Droits d'exploitation&#10;Art. 12.1 - Durée du contrat" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  <Scale size={12} className="inline mr-1" />Références légales (une par ligne)
                </label>
                <textarea value={form.law_references} onChange={(e) => setForm({ ...form, law_references: e.target.value })} rows={3} className="w-full text-sm px-3 py-2 outline-none resize-none font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} placeholder="L. 442-6 C.com.&#10;Art. 1171 C.civ." />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || !form.id || !form.label || !form.legal_argument} className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
                {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
