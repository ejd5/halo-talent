"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Search, X, Edit3, Trash2, FileText, Globe, Shield, AlertTriangle, CheckCircle, BookOpen, ExternalLink, Database, RefreshCw, Layers } from "lucide-react";

type KnowledgeEntry = {
  id: string;
  category: string;
  platform: string | null;
  jurisdiction: string;
  title: string;
  content: string;
  summary: string | null;
  source_url: string | null;
  source_name: string | null;
  severity_score: number;
  tags: string[];
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
};

type SourceStatus = {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  documentCount: number;
  chunkCount: number;
  lastIngestedAt: string | null;
  status: "pending" | "done" | "error";
};

type IngestionTotals = {
  totalSources: number;
  totalDocuments: number;
  totalChunks: number;
  doneCount: number;
  pendingCount: number;
};

const CATEGORIES = ["cgu", "loi", "jurisprudence", "pratique", "réglementation"];
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Twitch", "X", "LinkedIn", "Snapchat", "autre"];
const JURISDICTIONS = ["international", "france", "europe", "usa"];

export default function LegalKnowledgePage() {
  const [activeTab, setActiveTab] = useState<"knowledge" | "ingestion">("knowledge");
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterPlat, setFilterPlat] = useState("");
  const [filterJur, setFilterJur] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    category: "cgu",
    platform: "",
    jurisdiction: "international",
    title: "",
    content: "",
    summary: "",
    source_url: "",
    source_name: "",
    severity_score: 3,
    tags: "",
    auto_generated: false,
  });

  // --- Ingestion state ---
  const [ingestionTab, setIngestionTab] = useState(false);
  const [sources, setSources] = useState<SourceStatus[]>([]);
  const [totals, setTotals] = useState<IngestionTotals | null>(null);
  const [ingestionLoading, setIngestionLoading] = useState(false);
  const [ingestionRunning, setIngestionRunning] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCat) params.set("category", filterCat);
      if (filterPlat) params.set("platform", filterPlat);
      if (filterJur) params.set("jurisdiction", filterJur);
      const res = await fetch(`/api/admin/legal/knowledge?${params}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterCat, filterPlat, filterJur]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const filtered = entries.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ category: "cgu", platform: "", jurisdiction: "international", title: "", content: "", summary: "", source_url: "", source_name: "", severity_score: 3, tags: "", auto_generated: false });
    setShowModal(true);
  };

  const openEdit = (entry: KnowledgeEntry) => {
    setEditing(entry);
    setForm({
      category: entry.category,
      platform: entry.platform || "",
      jurisdiction: entry.jurisdiction,
      title: entry.title,
      content: entry.content,
      summary: entry.summary || "",
      source_url: entry.source_url || "",
      source_name: entry.source_name || "",
      severity_score: entry.severity_score,
      tags: entry.tags.join(", "),
      auto_generated: entry.auto_generated,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.category) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        category: form.category,
        platform: form.platform || null,
        jurisdiction: form.jurisdiction,
        title: form.title,
        content: form.content,
        summary: form.summary || null,
        source_url: form.source_url || null,
        source_name: form.source_name || null,
        severity_score: form.severity_score,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        auto_generated: form.auto_generated,
      };
      if (editing) {
        await fetch("/api/admin/legal/knowledge", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...body }),
        });
      } else {
        await fetch("/api/admin/legal/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchEntries();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette entrée ?")) return;
    try {
      await fetch(`/api/admin/legal/knowledge?id=${id}`, { method: "DELETE" });
      fetchEntries();
    } catch (e) { console.error(e); }
  };

  const severityColor = (s: number) => {
    if (s <= 2) return "var(--success)";
    if (s <= 4) return "#D4A24C";
    return "var(--danger)";
  };

  // --- Ingestion helpers ---
  const fetchSources = useCallback(async () => {
    setIngestionLoading(true);
    try {
      const res = await fetch("/api/admin/legal/ingest");
      const data = await res.json();
      setSources(data.sources || []);
      setTotals(data.totals || null);
    } catch (e) { console.error(e); }
    setIngestionLoading(false);
  }, []);

  const runIngestion = async () => {
    setIngestionRunning(true);
    setIngestionResult(null);
    try {
      const res = await fetch("/api/admin/legal/ingest", { method: "POST" });
      const data = await res.json();
      const msg = `Ingestion terminée : ${data.chunksCreated} chunks créés en ${Math.round(data.durationMs / 1000)}s${data.errors?.length ? ` (${data.errors.length} erreurs)` : ""}`;
      setIngestionResult(msg);
      fetchSources();
    } catch (e) {
      setIngestionResult("Erreur lors de l'ingestion");
    }
    setIngestionRunning(false);
  };

  useEffect(() => { fetchSources(); }, []);

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={24} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
              Base juridique
            </h1>
          </div>
        </div>
        {activeTab === "knowledge" && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={16} /> Ajouter
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => setActiveTab("knowledge")}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
          style={{
            color: activeTab === "knowledge" ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === "knowledge" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          <BookOpen size={16} />
          Base de connaissances
        </button>
        <button
          onClick={() => { setActiveTab("ingestion"); fetchSources(); }}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
          style={{
            color: activeTab === "ingestion" ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: activeTab === "ingestion" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          <Database size={16} />
          Ingestion vectorielle
          {totals && (
            <span className="text-xs px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
              {totals.totalChunks}
            </span>
          )}
        </button>
      </div>

      {activeTab === "knowledge" && (
      <><div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} style={{ color: "rgba(255,255,255,0.3)" }} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full text-sm pl-9 pr-3 py-2 outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="text-sm px-3 py-2 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterPlat}
          onChange={(e) => setFilterPlat(e.target.value)}
          className="text-sm px-3 py-2 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
        >
          <option value="">Toutes plateformes</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterJur}
          onChange={(e) => setFilterJur(e.target.value)}
          className="text-sm px-3 py-2 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
        >
          <option value="">Toutes juridictions</option>
          {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        {(filterCat || filterPlat || filterJur) && (
          <button
            onClick={() => { setFilterCat(""); setFilterPlat(""); setFilterJur(""); }}
            className="text-xs px-2 py-1"
            style={{ color: "var(--accent)" }}
          >
            Réinitialiser
          </button>
        )}
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
                {["Titre", "Catégorie", "Plateforme", "Juridiction", "Sévérité", "Tags", "Source", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{entry.title}</span>
                      {entry.auto_generated && (
                        <span className="text-[10px] px-1.5 py-0.5 font-medium" style={{ background: "rgba(212,162,76,0.12)", color: "#D4A24C" }}>
                          auto
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{entry.platform || "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{entry.jurisdiction}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5" style={{ background: `${severityColor(entry.severity_score)}20`, color: severityColor(entry.severity_score) }}>
                      {entry.severity_score}/10
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {entry.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>{t}</span>
                      ))}
                      {entry.tags.length > 3 && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>+{entry.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {entry.source_name && <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{entry.source_name}</span>}
                      {entry.source_url && (
                        <a href={entry.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={12} style={{ color: "var(--accent)" }} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(entry)} className="p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--text-secondary)" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--danger)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune entrée trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </>)}

      {activeTab === "ingestion" && (
        <div>
          {totals && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Sources</div>
                <div className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{totals.totalSources}</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Documents</div>
                <div className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{totals.totalDocuments}</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Chunks</div>
                <div className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>{totals.totalChunks}</div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "16px" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Ingérés</div>
                <div className="text-2xl font-semibold" style={{ color: "rgb(34,197,94)" }}>{totals.doneCount}/{totals.totalSources}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={runIngestion}
              disabled={ingestionRunning}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}
            >
              {ingestionRunning ? (
                <><Loader2 size={16} className="animate-spin" /> Ingestion en cours...</>
              ) : (
                <><RefreshCw size={16} /> Lancer l'ingestion</>
              )}
            </button>
            <button onClick={fetchSources} className="px-3 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <RefreshCw size={14} /> Actualiser
            </button>
          </div>

          {ingestionResult && (
            <div className="mb-4 px-4 py-3 text-sm" style={{ background: "rgba(199,91,57,0.1)", border: "1px solid rgba(199,91,57,0.3)", color: "var(--accent)" }}>
              {ingestionResult}
            </div>
          )}

          {ingestionLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
            </div>
          ) : (
            <div style={{ border: "1px solid var(--border-default)" }}>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-card)" }}>
                    {["Source", "Type", "Documents", "Chunks", "Dernière ingestion", "Statut"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: "var(--text-secondary)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sources.map((src) => (
                    <tr key={src.sourceId} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{src.sourceName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>{src.sourceType}</span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{src.documentCount}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{src.chunkCount}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {src.lastIngestedAt ? new Date(src.lastIngestedAt).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {src.status === "done" ? (
                          <span className="text-xs font-medium" style={{ color: "rgb(34,197,94)" }}>Ingéré</span>
                        ) : src.status === "error" ? (
                          <span className="text-xs font-medium" style={{ color: "var(--danger)" }}>Erreur</span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: "#D4A24C" }}>En attente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sources.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune source trouvée</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {editing ? "Modifier l'entrée" : "Nouvelle entrée"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: "var(--text-secondary)" }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Catégorie</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Plateforme</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                    <option value="">—</option>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Juridiction</label>
                  <select value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                    {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Titre *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Contenu *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="w-full text-sm px-3 py-2 outline-none resize-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Résumé</label>
                  <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} className="w-full text-sm px-3 py-2 outline-none resize-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tags (séparés par virgules)</label>
                    <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Sévérité (1-10)</label>
                    <input type="number" min={1} max={10} value={form.severity_score} onChange={(e) => setForm({ ...form, severity_score: parseInt(e.target.value) || 3 })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nom de la source</label>
                    <input value={form.source_name} onChange={(e) => setForm({ ...form, source_name: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>URL source</label>
                <input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} className="w-full text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.auto_generated} onChange={(e) => setForm({ ...form, auto_generated: e.target.checked })} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Généré automatiquement</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.content} className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
                {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
