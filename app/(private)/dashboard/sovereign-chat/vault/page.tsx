"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Search, Plus, X, DollarSign, Send, Target,
  Users, Download, AlertTriangle, Bot,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  tags: string[];
  total_sends: number;
  total_unlocks: number;
  total_revenue: number;
  is_active: boolean;
}

interface RecommendationFan {
  id?: string;
  display_name?: string;
  email?: string;
}

interface Recommendation {
  fan: RecommendationFan;
  score: number;
  reason: string;
  probability: number;
  cooldown?: {
    blocked: boolean;
    blockReasons: string[];
    weeklyPpvCount: number;
    hoursSinceLastPpv: number;
  };
}

// ─── Stats row per product ──────────────────────────────────

function ProductStats({ p }: { p: Product }) {
  const rate = p.total_sends > 0 ? Math.round((p.total_unlocks / p.total_sends) * 100) : 0;
  return (
    <div className="flex gap-3 text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
      <span><Send size={9} className="inline mr-0.5" />{p.total_sends} envois</span>
      <span><Target size={9} className="inline mr-0.5" />{rate}% unlock</span>
      <span><DollarSign size={9} className="inline mr-0.5" />{p.total_revenue}€</span>
    </div>
  );
}

// ─── Filter bar ─────────────────────────────────────────────

function FilterBar({
  products,
  filters,
  onFilter,
}: {
  products: Product[];
  filters: { category: string; search: string; minRate: number };
  onFilter: (f: typeof filters) => void;
}) {
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[150px] max-w-[200px]">
        <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "rgba(245,240,235,0.2)" }} />
        <input
          value={filters.search}
          onChange={(e) => onFilter({ ...filters, search: e.target.value })}
          placeholder="Rechercher..."
          className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-transparent"
          style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.06)" }}
        />
      </div>
      <select
        value={filters.category}
        onChange={(e) => onFilter({ ...filters, category: e.target.value })}
        className="text-[10px] py-1.5 px-2 bg-transparent"
        style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.06)" }}
      >
        <option value="">Toutes catégories</option>
        {categories.map((c) => <option key={c} value={c!}>{c}</option>)}
      </select>
    </div>
  );
}

// ─── "Optimiser prix" AI Modal ─────────────────────────────

function PriceOptimizeModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    recommendedPrice: number; minPrice: number; maxPrice: number;
    justification: string; fatigueRisk: string; conversionEstimate: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/chat-ai/ppv-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vaultAssetId: product.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.recommendation) setResult(d.recommendation);
        else setError(d.error || "Analyse impossible");
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoading(false));
  }, [product.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 border"
        style={{ backgroundColor: "var(--bg-primary)", borderColor: "rgba(245,240,235,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          <div>
            <div className="flex items-center gap-2">
              <Bot size={14} style={{ color: "var(--accent)" }} />
              <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Optimisation IA, &quot;{product.name}&quot;</h3>
            </div>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>
              Prix actuel: {product.price}€ · {product.total_sends} envois
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-70"><X size={14} style={{ color: "rgba(245,240,235,0.3)" }} /></button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-10 animate-pulse" style={{ background: "rgba(245,240,235,0.03)" }} />
              <div className="h-16 animate-pulse" style={{ background: "rgba(245,240,235,0.03)" }} />
            </div>
          ) : error ? (
            <div className="flex items-start gap-2 p-3" style={{ background: "rgba(196,69,54,0.04)", borderRadius: 4 }}>
              <AlertTriangle size={12} style={{ color: "var(--danger)", minWidth: 12, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "var(--danger)", margin: 0 }}>{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-3">
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, textAlign: "center", padding: 10, background: "rgba(199,91,57,0.08)", borderRadius: 6 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", margin: 0 }}>{result.recommendedPrice}€</p>
                  <p style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", marginTop: 2 }}>Prix IA recommandé</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: 10, background: "rgba(245,240,235,0.02)", borderRadius: 6, border: "1px solid rgba(245,240,235,0.04)" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{result.minPrice}€ – {result.maxPrice}€</p>
                  <p style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", marginTop: 2 }}>Fourchette</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: "rgba(245,240,235,0.3)" }}>Analyse</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.6)" }}>{result.justification}</p>
              </div>
              <div className="flex gap-2 text-[10px] flex-wrap">
                <span className="px-2 py-1" style={{ background: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.4)", borderRadius: 4 }}>
                  Fatigue: {result.fatigueRisk}
                </span>
                <span className="px-2 py-1" style={{ background: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.4)", borderRadius: 4 }}>
                  {result.conversionEstimate}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── "Pour qui?" Modal ──────────────────────────────────────

function RecommendModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/sovereign-chat/vault/recommend-fans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id }),
    })
      .then((r) => r.json())
      .then((d) => setRecs(d.recommendations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [product.id]);

  const handleSendAll = async () => {
    setSending(true);
    const targetIds = recs.filter((r) => !r.cooldown?.blocked).map((r) => r.fan.id);
    // Would trigger a Smart Messages campaign, for MVP, log and notify
    await fetch("/api/sovereign-chat/smart-messages/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fan_ids: targetIds,
        product_id: product.id,
        template: `Découvre mon nouveau PPV "${product.name}"`,
      }),
    }).catch(() => {});
    setSending(false);
    onClose();
  };

  const handleSendTop10 = async () => {
    setSending(true);
    const top10 = recs
      .filter((r) => !r.cooldown?.blocked)
      .slice(0, 10)
      .map((r) => r.fan.id);
    await fetch("/api/sovereign-chat/smart-messages/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fan_ids: top10,
        product_id: product.id,
        template: `Découvre mon nouveau PPV "${product.name}"`,
      }),
    }).catch(() => {});
    setSending(false);
    onClose();
  };

  const exportCSV = () => {
    const header = "Fan,Score,Raison,Probabilité,Cooldown\n";
    const rows = recs
      .map(
        (r) =>
          `"${r.fan.display_name || r.fan.email}","${r.score}","${r.reason}","${r.probability}%","${r.cooldown?.blocked ? r.cooldown.blockReasons.join("; ") : "Non"}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ciblage-${product.name}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCount = recs.filter((r) => !r.cooldown?.blocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 border flex flex-col max-h-[80vh]"
        style={{ backgroundColor: "var(--bg-primary)", borderColor: "rgba(245,240,235,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          <div>
            <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Cibler pour &quot;{product.name}&quot;</h3>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>
              {product.price}€ · {loading ? "..." : `${activeCount} fans disponibles`}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-70"><X size={14} style={{ color: "rgba(245,240,235,0.3)" }} /></button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          <button onClick={handleSendAll} disabled={sending || activeCount === 0}
            className="flex items-center gap-1 text-[10px] font-medium py-1 px-2 disabled:opacity-30"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
            <Send size={10} /> Envoyer aux {activeCount} fans
          </button>
          <button onClick={handleSendTop10} disabled={sending || activeCount === 0}
            className="flex items-center gap-1 text-[10px] font-medium py-1 px-2 disabled:opacity-30"
            style={{ backgroundColor: "rgba(245,240,235,0.06)", color: "var(--text-primary)" }}>
            Top 10 uniquement
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1 text-[10px] font-medium py-1 px-2"
            style={{ backgroundColor: "rgba(245,240,235,0.06)", color: "rgba(245,240,235,0.5)" }}>
            <Download size={10} /> CSV
          </button>
        </div>

        {/* Fan list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-12 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>
          ) : recs.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "rgba(245,240,235,0.3)" }}>Aucune recommandation</p>
          ) : (
            recs.map((r, i) => (
              <div key={i} className="p-2.5" style={{ backgroundColor: r.cooldown?.blocked ? "rgba(196,69,54,0.04)" : "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {r.fan.display_name || r.fan.email}
                      </span>
                      {r.cooldown?.blocked && <AlertTriangle size={10} style={{ color: "var(--danger)", minWidth: 10 }} />}
                    </div>
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{r.reason}</p>
                    {r.cooldown?.blocked && (
                      <p className="text-[8px] mt-0.5" style={{ color: "var(--danger)" }}>
                        ⚠ {r.cooldown.blockReasons.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold" style={{ color: r.probability > 60 ? "var(--success)" : r.probability > 30 ? "var(--text-primary)" : "rgba(245,240,235,0.3)" }}>
                      {r.probability}%
                    </p>
                    <p className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>probabilité</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────

export default function VaultPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [recommendFor, setRecommendFor] = useState<Product | null>(null);
  const [optimizeFor, setOptimizeFor] = useState<Product | null>(null);
  const [filters, setFilters] = useState({ category: "", search: "", minRate: 0 });

  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "", tags: "",
  });

  const loadProducts = async () => {
    const r = await fetch("/api/sovereign-chat/ppv/products");
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sovereign-chat/ppv/products")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setProducts(d.products || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.price) return;
    await fetch("/api/sovereign-chat/ppv/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      }),
    });
    setForm({ name: "", description: "", price: "", category: "", tags: "" });
    setShowForm(false);
    loadProducts();
  };

  // Filtered + sorted
  const filtered = products.filter((p) => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    const rate = p.total_sends > 0 ? (p.total_unlocks / p.total_sends) * 100 : 0;
    if (rate < filters.minRate) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b.total_revenue - a.total_revenue);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package size={16} style={{ color: "var(--accent)" }} />
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Vault PPV
            </h1>
            {!loading && <span className="text-[10px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>{products.length} produits</span>}
          </div>
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
            Recommandations intelligentes, quel contenu envoyer à quel fan
          </p>
          <Link href="/dashboard/sovereign-chat/ppv-copilot" className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium py-1 px-2" style={{ color: "var(--accent)", background: "rgba(199,91,57,0.06)", borderRadius: 4, textDecoration: "none" }}>
            <Bot size={10} /> PPV Copilot, stratégie IA avancée →
          </Link>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-medium py-2 px-3"
          style={{ backgroundColor: showForm ? "rgba(245,240,235,0.04)" : "var(--accent)", color: "var(--text-primary)" }}>
          <Plus size={12} /> {showForm ? "Annuler" : "Nouveau produit"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="p-3 space-y-2" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <input placeholder="Nom du produit" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full p-2 text-xs bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full p-2 text-xs bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
          <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="Prix (€)" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="flex-1 p-2 text-xs bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
            <input placeholder="Catégorie" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="flex-1 p-2 text-xs bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
          </div>
          <input placeholder="Tags (séparés par des virgules)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            className="w-full p-2 text-xs bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
          <button onClick={handleCreate} className="text-[10px] font-semibold py-1.5 px-3" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
            Créer
          </button>
        </div>
      )}

      {/* Filters */}
      <FilterBar products={products} filters={filters} onFilter={setFilters} />

      {/* Product list */}
      {loading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <Package size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>Aucun produit PPV</p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>Crée ton premier produit pour activer les recommandations</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((p) => {
            const rate = p.total_sends > 0 ? Math.round((p.total_unlocks / p.total_sends) * 100) : 0;
            return (
              <div key={p.id} className="p-3 transition-all" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-start justify-between gap-3">
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                      <span className="text-[10px] font-semibold" style={{ color: "var(--accent)" }}>{p.price}€</span>
                      {p.category && (
                        <span className="text-[8px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)" }}>
                          {p.category}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-[9px] mt-0.5 line-clamp-1" style={{ color: "rgba(245,240,235,0.2)" }}>{p.description}</p>
                    )}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {p.tags.map((t) => (
                          <span key={t} className="text-[7px] px-1 py-px" style={{ backgroundColor: "rgba(199,91,57,0.06)", color: "rgba(199,91,57,0.6)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <ProductStats p={p} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => setRecommendFor(p)}
                      className="flex items-center gap-1 text-[9px] font-medium py-1.5 px-2.5 whitespace-nowrap"
                      style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                      <Users size={10} /> Pour qui&nbsp;?
                    </button>
                    <button onClick={() => setOptimizeFor(p)}
                      className="flex items-center gap-1 text-[9px] font-medium py-1.5 px-2.5 whitespace-nowrap"
                      style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.5)" }}>
                      <Bot size={10} /> Optimiser prix
                    </button>
                    <div className="flex gap-1">
                      <span className="text-[10px] font-semibold px-2 py-1 text-center" style={{
                        backgroundColor: rate > 50 ? "rgba(122,154,101,0.1)" : "rgba(245,240,235,0.04)",
                        color: rate > 50 ? "var(--success)" : "rgba(245,240,235,0.3)",
                      }}>
                        {rate}%
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-1" style={{ backgroundColor: "rgba(199,91,57,0.06)", color: "var(--accent)" }}>
                        {p.total_revenue}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommend modal */}
      {recommendFor && <RecommendModal product={recommendFor} onClose={() => setRecommendFor(null)} />}

      {/* AI Price Optimize modal */}
      {optimizeFor && <PriceOptimizeModal product={optimizeFor} onClose={() => setOptimizeFor(null)} />}
    </div>
  );
}
