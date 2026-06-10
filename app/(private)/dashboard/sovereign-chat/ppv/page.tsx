"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, Package, FileText, Users, Clock, Beaker,
  TrendingUp, Send, DollarSign, Target, Zap, ChevronDown,
} from "lucide-react";

type Tab = "overview" | "products" | "scripts" | "fans" | "ttu" | "abtests";

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "products", label: "Par produit", icon: Package },
  { id: "scripts", label: "Par script", icon: FileText },
  { id: "fans", label: "Par fan", icon: Users },
  { id: "ttu", label: "Time-to-unlock", icon: Clock },
  { id: "abtests", label: "A/B tests", icon: Beaker },
];

// ─═══ OVERVIEW TAB ═══─

function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sovereign-chat/ppv/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-20 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;
  if (!data) return <p className="text-xs" style={{color:"rgba(245,240,235,0.3)"}}>Aucune donnée PPV</p>;

  const kpi = data.kpis || {};

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: "Revenus ce mois", value: `${kpi.revenue || 0}€`, icon: DollarSign, color: "var(--success)", change: `${kpi.revenue_change >= 0 ? "+" : ""}${kpi.revenue_change || 0}%` },
          { label: "PPV envoyés", value: kpi.sends || 0, icon: Send, color: "var(--accent)" },
          { label: "Unlock rate", value: `${kpi.unlock_rate || 0}%`, icon: Target, color: "var(--success)" },
          { label: "AOV PPV", value: `${kpi.aov || 0}€`, icon: DollarSign, color: "var(--text-primary)" },
          { label: "TTU moyen", value: `${kpi.avg_ttu_hours || 0}h`, icon: Clock, color: "rgba(245,240,235,0.5)" },
          { label: "Top PPV", value: kpi.top_product || "—", icon: Zap, color: "var(--accent)" },
        ].map((k, i) => (
          <div key={i} className="p-2.5" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}>
            <k.icon size={10} className="mb-1" style={{color: k.color}} />
            <p className="text-[9px]" style={{color:"rgba(245,240,235,0.2)"}}>{k.label}</p>
            <p className="text-sm font-semibold mt-0.5" style={{color: k.color}}>{k.value}</p>
            {"change" in k && <p className="text-[7px]" style={{color: kpi.revenue_change >= 0 ? "var(--success)" : "var(--danger)"}}>{(k as any).change}</p>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-3" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}>
        <p className="text-[9px] uppercase tracking-wider mb-3" style={{color:"rgba(245,240,235,0.2)"}}>Revenus PPV (30 jours)</p>
        <div className="flex items-end gap-0.5 h-32">
          {(data.chart || []).map((d: any, i: number) => {
            const maxRev = Math.max(...(data.chart || []).map((c: any) => c.revenue), 1);
            const h = (d.revenue / maxRev) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${d.date}: ${d.revenue}€`}>
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${Math.max(h, 1)}%`,
                    backgroundColor: d.revenue > 0 ? "var(--accent)" : "rgba(245,240,235,0.04)",
                    opacity: 0.8,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <div className="p-3 text-[10px] leading-relaxed" style={{backgroundColor:"rgba(199,91,57,0.04)", border:"1px solid rgba(199,91,57,0.1)", color:"rgba(245,240,235,0.5)"}}>
        <Zap size={12} className="inline mr-1" style={{color:"var(--accent)"}} />
        <strong style={{color:"var(--accent)"}}>Rapport mensuel</strong> — {kpi.sends || 0} PPV envoyés, taux d&apos;unlock de {kpi.unlock_rate || 0}%, revenu total de {kpi.revenue || 0}€. {kpi.revenue_change > 0 ? `Hausse de ${kpi.revenue_change}% vs mois dernier.` : kpi.revenue_change < 0 ? `Baisse de ${Math.abs(kpi.revenue_change)}% vs mois dernier.` : "Stable vs mois dernier."}
      </div>
    </div>
  );
}

// ─═══ PRODUCTS TAB ═══─

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", tags: "" });

  useEffect(() => { loadProducts(); }, []);
  const loadProducts = async () => {
    const r = await fetch("/api/sovereign-chat/ppv/products");
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  };

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
        tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : [],
      }),
    });
    setForm({ name: "", description: "", price: "", category: "", tags: "" });
    setShowForm(false);
    loadProducts();
  };

  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;

  const sorted = [...products].sort((a, b) => b.total_revenue - a.total_revenue);
  const formatScore = (p: any) => {
    if (p.total_sends === 0) return "—";
    const rate = p.total_unlocks / p.total_sends;
    return Math.round(rate * 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="text-[10px] font-medium py-1.5 px-3"
          style={{backgroundColor: showForm ? "rgba(245,240,235,0.04)" : "var(--accent)", color: "var(--text-primary)"}}>
          {showForm ? "Annuler" : "+ Produit"}
        </button>
      </div>

      {showForm && (
        <div className="p-3 space-y-2" style={{backgroundColor:"rgba(245,240,235,0.03)", border:"1px solid rgba(245,240,235,0.06)"}}>
          <input placeholder="Nom du produit" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="Prix (€)" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} className="flex-1 p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
            <input placeholder="Catégorie" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="flex-1 p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          </div>
          <input placeholder="Tags (séparés par des virgules)" value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          <button onClick={handleCreate} className="text-[10px] font-semibold py-1.5 px-3" style={{backgroundColor:"var(--accent)", color:"var(--text-primary)"}}>Créer</button>
        </div>
      )}

      {/* Product detail */}
      {selected && (
        <div className="p-3 space-y-2" style={{backgroundColor:"rgba(199,91,57,0.04)", border:"1px solid rgba(199,91,57,0.1)"}}>
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-medium" style={{color:"var(--text-primary)"}}>{selected.name}</h3>
            <button onClick={() => setSelected(null)} className="text-[9px]" style={{color:"rgba(245,240,235,0.2)"}}>Fermer</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div><span style={{color:"rgba(245,240,235,0.2)"}}>Prix :</span> <span style={{color:"var(--text-primary)"}}>{selected.price}€</span></div>
            <div><span style={{color:"rgba(245,240,235,0.2)"}}>Unlock rate :</span> <span style={{color:"var(--success)"}}>{selected.total_sends > 0 ? Math.round(selected.total_unlocks/selected.total_sends*100) : 0}%</span></div>
            <div><span style={{color:"rgba(245,240,235,0.2)"}}>Revenus :</span> <span style={{color:"var(--accent)"}}>{selected.total_revenue}€</span></div>
          </div>
          {selected.performance_by_tier && Object.keys(selected.performance_by_tier).length > 0 && (
            <div>
              <p className="text-[9px] mb-1" style={{color:"rgba(245,240,235,0.2)"}}>Par tier :</p>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(selected.performance_by_tier).map(([tier, d]: [string, any]) => (
                  <span key={tier} className="text-[8px] px-1.5 py-0.5" style={{backgroundColor:"rgba(199,91,57,0.08)",color:"var(--accent)"}}>
                    {tier}: {d.sends} envois, {d.unlocks} unlocks
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      {sorted.length === 0 ? (
        <p className="text-xs text-center py-8" style={{color:"rgba(245,240,235,0.3)"}}>Aucun produit PPV</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]" style={{borderCollapse:"separate", borderSpacing:0}}>
            <thead>
              <tr>
                {["Produit", "Prix", "Envoyés", "Unlocks", "Rate", "Revenus", "Score"].map(h => (
                  <th key={h} className="text-left font-medium py-2 px-2" style={{color:"rgba(245,240,235,0.2)", borderBottom:"1px solid rgba(245,240,235,0.06)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer transition-all hover:opacity-80">
                  <td className="py-2 px-2 font-medium" style={{color:"var(--text-primary)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{p.name}</td>
                  <td className="py-2 px-2" style={{color:"rgba(245,240,235,0.5)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{p.price}€</td>
                  <td className="py-2 px-2" style={{color:"rgba(245,240,235,0.5)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{p.total_sends}</td>
                  <td className="py-2 px-2" style={{color:"rgba(245,240,235,0.5)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{p.total_unlocks}</td>
                  <td className="py-2 px-2" style={{color: (p.total_sends > 0 && p.total_unlocks/p.total_sends > 0.5) ? "var(--success)" : "rgba(245,240,235,0.5)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>
                    {p.total_sends > 0 ? Math.round(p.total_unlocks/p.total_sends*100) : 0}%
                  </td>
                  <td className="py-2 px-2" style={{color:"var(--accent)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{p.total_revenue}€</td>
                  <td className="py-2 px-2" style={{color:"rgba(245,240,235,0.5)", borderBottom:"1px solid rgba(245,240,235,0.04)"}}>{formatScore(p)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─═══ SCRIPTS TAB ═══─

function ScriptsTab() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", script_text: "", target_segment_type: "" });

  useEffect(() => { loadScripts(); }, []);
  const loadScripts = async () => {
    const r = await fetch("/api/sovereign-chat/ppv/scripts");
    const d = await r.json();
    setScripts(d.scripts || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.script_text) return;
    await fetch("/api/sovereign-chat/ppv/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", script_text: "", target_segment_type: "" });
    setShowForm(false);
    loadScripts();
  };

  const sorted = [...scripts].sort((a, b) => (b.avg_unlock_rate || 0) - (a.avg_unlock_rate || 0));

  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="text-[10px] font-medium py-1.5 px-3" style={{backgroundColor:"var(--accent)", color:"var(--text-primary)"}}>
          {showForm ? "Annuler" : "+ Nouveau script"}
        </button>
      </div>

      {showForm && (
        <div className="p-3 space-y-2" style={{backgroundColor:"rgba(245,240,235,0.03)", border:"1px solid rgba(245,240,235,0.06)"}}>
          <input placeholder="Nom interne" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          <textarea
            placeholder="Texte du script (variables: {fan_name}, {last_purchase}, etc.)"
            value={form.script_text}
            onChange={e => setForm(p => ({...p, script_text: e.target.value}))}
            rows={3}
            className="w-full p-2 text-xs bg-transparent resize-none"
            style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}}
          />
          <select value={form.target_segment_type} onChange={e => setForm(p => ({...p, target_segment_type: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}}>
            <option value="">Tous les fans</option>
            <option value="whales">Whales</option>
            <option value="new">Nouveaux fans</option>
            <option value="vip">VIP</option>
          </select>
          <button onClick={handleSave} className="text-[10px] font-semibold py-1.5 px-3" style={{backgroundColor:"var(--accent)", color:"var(--text-primary)"}}>Sauvegarder</button>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-xs text-center py-8" style={{color:"rgba(245,240,235,0.3)"}}>Aucun script</p>
      ) : (
        <div className="space-y-1">
          {sorted.map((s) => (
            <div key={s.id} className="p-2.5" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium truncate" style={{color:"var(--text-primary)"}}>{s.name || "Sans nom"}</p>
                  <p className="text-[9px] mt-0.5 line-clamp-2" style={{color:"rgba(245,240,235,0.3)"}}>{s.script_text}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-semibold" style={{color:s.avg_unlock_rate && s.avg_unlock_rate > 50 ? "var(--success)" : "rgba(245,240,235,0.5)"}}>
                    {s.avg_unlock_rate ? `${s.avg_unlock_rate}%` : "—"}
                  </p>
                  <p className="text-[7px]" style={{color:"rgba(245,240,235,0.15)"}}>unlock rate</p>
                </div>
              </div>
              <div className="flex gap-2 text-[8px]" style={{color:"rgba(245,240,235,0.15)"}}>
                <span>{s.uses_count || 0} utilisations</span>
                <span>·</span>
                <span>{s.total_revenue || 0}€ revenus</span>
                {s.target_segment_type && <><span>·</span><span>Cible: {s.target_segment_type}</span></>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─═══ FANS TAB ═══─

function FansTab() {
  const [sends, setSends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fanId, setFanId] = useState<string | null>(null);
  const [fanDetail, setFanDetail] = useState<any>(null);

  useEffect(() => {
    fetch("/api/sovereign-chat/ppv/sends?limit=100")
      .then(r => r.json())
      .then(d => setSends(d.sends || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Aggregate by fan
  const fanMap = new Map<string, { sends: number; unlocks: number; revenue: number; fan: any }>();
  for (const s of sends) {
    const fan = s.atlas_fans;
    if (!fan?.display_name) continue;
    if (!fanMap.has(fan.display_name)) fanMap.set(fan.display_name, { sends: 0, unlocks: 0, revenue: 0, fan });
    const entry = fanMap.get(fan.display_name)!;
    entry.sends++;
    if (s.unlocked) { entry.unlocks++; entry.revenue += Number(s.unlock_revenue || 0); }
  }

  const sortedFans = [...fanMap.entries()].sort((a, b) => b[1].revenue - a[1].revenue);

  const loadFanDetail = async (fid: string) => {
    const r = await fetch(`/api/sovereign-chat/ppv/fan?fan_id=${fid}`);
    const d = await r.json();
    setFanDetail(d);
  };

  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;

  if (fanDetail) {
    const an = fanDetail.analytics || {};
    return (
      <div className="space-y-3">
        <button onClick={() => setFanDetail(null)} className="text-[9px]" style={{color:"rgba(245,240,235,0.2)"}}>← Retour</button>
        <div className="p-3" style={{backgroundColor:"rgba(245,240,235,0.03)", border:"1px solid rgba(245,240,235,0.06)"}}>
          <p className="text-sm font-medium" style={{color:"var(--text-primary)"}}>{fanDetail.fan?.display_name || fanDetail.fan?.email}</p>
          <p className="text-[9px]" style={{color:"rgba(245,240,235,0.2)"}}>{fanDetail.fan?.fan_tier} · LTV {fanDetail.fan?.total_spent}€</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "PPV achetés", value: an.total_unlocks },
            { label: "PPV refusés", value: an.total_sends - an.total_unlocks },
            { label: "Conv. rate", value: `${an.conv_rate || 0}%` },
            { label: "Revenus PPV", value: `${an.total_revenue || 0}€` },
            { label: "TTU moyen", value: an.avg_ttu_minutes ? `${an.avg_ttu_minutes}min` : "—" },
          ].map((s, i) => (
            <div key={i} className="p-2 text-center" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}>
              <p className="text-xs font-semibold" style={{color:"var(--text-primary)"}}>{s.value}</p>
              <p className="text-[8px]" style={{color:"rgba(245,240,235,0.2)"}}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {sortedFans.length === 0 ? (
        <p className="text-xs text-center py-8" style={{color:"rgba(245,240,235,0.3)"}}>Aucun envoi PPV enregistré</p>
      ) : (
        <div className="space-y-1">
          {sortedFans.map(([name, data]) => (
            <button key={name} onClick={() => loadFanDetail(data.fan.id)}
              className="w-full flex items-center justify-between p-2.5 text-left transition-all hover:opacity-80"
              style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 flex items-center justify-center text-[8px] font-medium shrink-0" style={{backgroundColor:"rgba(199,91,57,0.1)",color:"var(--accent)"}}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium truncate" style={{color:"var(--text-primary)"}}>{name}</p>
                  <p className="text-[8px]" style={{color:"rgba(245,240,235,0.15)"}}>{data.fan?.fan_tier}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[9px]">
                <span style={{color: data.sends > 0 && data.unlocks/data.sends > 0.5 ? "var(--success)" : "rgba(245,240,235,0.3)"}}>
                  {data.sends > 0 ? Math.round(data.unlocks/data.sends*100) : 0}%
                </span>
                <span style={{color:"var(--accent)"}}>{data.revenue}€</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─═══ TTU TAB ═══─

function TTUTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sovereign-chat/ppv/time-to-unlock")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1,2,3,4,5,6,7].map(i => <div key={i} className="h-6 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;
  if (!data) return <p className="text-xs text-center py-8" style={{color:"rgba(245,240,235,0.3)"}}>Aucune donnée</p>;

  const ins = data.insights || {};
  const dist = data.distribution?.buckets || {};

  const buckets = [
    { label: "< 5 min", key: "< 5 min" },
    { label: "5-30 min", key: "5-30 min" },
    { label: "30 min-1h", key: "30 min-1h" },
    { label: "1h-3h", key: "1h-3h" },
    { label: "3h-12h", key: "3h-12h" },
    { label: "12h-24h", key: "12h-24h" },
    { label: "> 24h", key: "> 24h" },
  ];

  const maxPct = Math.max(...buckets.map(b => (dist as any)[b.key]?.pct || 0), 1);

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5" style={{backgroundColor:"rgba(199,91,57,0.04)", border:"1px solid rgba(199,91,57,0.1)"}}>
          <p className="text-lg font-semibold" style={{color:"var(--accent)"}}>{ins.under_30min_pct || 0}%</p>
          <p className="text-[9px]" style={{color:"rgba(245,240,235,0.3)"}}>des unlocks en &lt;30 min</p>
        </div>
        <div className="p-2.5" style={{backgroundColor:"rgba(122,154,101,0.04)", border:"1px solid rgba(122,154,101,0.1)"}}>
          <p className="text-lg font-semibold" style={{color:"var(--success)"}}>{ins.best_window || "—"}</p>
          <p className="text-[9px]" style={{color:"rgba(245,240,235,0.3)"}}>meilleure fenêtre ({ins.best_window_rate || 0}%)</p>
        </div>
      </div>

      {/* Histogram */}
      <div className="space-y-1.5">
        <p className="text-[9px] uppercase tracking-wider" style={{color:"rgba(245,240,235,0.2)"}}>Distribution</p>
        {buckets.map((b) => {
          const bucket = (dist as any)[b.key] || { count: 0, pct: 0 };
          return (
            <div key={b.key} className="flex items-center gap-2">
              <span className="text-[9px] w-20 text-right" style={{color:"rgba(245,240,235,0.3)"}}>{b.label}</span>
              <div className="flex-1 h-4" style={{backgroundColor:"rgba(245,240,235,0.04)"}}>
                <div className="h-full" style={{width: `${(bucket.pct / maxPct) * 100}%`, backgroundColor:"var(--accent)", opacity: 0.7}} />
              </div>
              <span className="text-[9px] w-16" style={{color:"rgba(245,240,235,0.3)"}}>{bucket.pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Heatmap placeholder */}
      <div className="p-3 text-[10px]" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)", color:"rgba(245,240,235,0.3)"}}>
        <p className="font-medium mb-1" style={{color:"var(--text-primary)"}}>Heatmap jours × heures</p>
        <p>La heatmap complète sera affichée ici avec les données historiques.</p>
      </div>
    </div>
  );
}

// ─═══ AB TEST TAB ═══─

function ABTestsTab() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_id: "", name: "", variant_a_script_id: "", variant_b_script_id: "", split_ratio: 0.5,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/sovereign-chat/ppv/ab-tests").then(r => r.json()),
      fetch("/api/sovereign-chat/ppv/products").then(r => r.json()),
      fetch("/api/sovereign-chat/ppv/scripts").then(r => r.json()),
    ]).then(([t, p, s]) => {
      setTests(t.tests || []);
      setProducts(p.products || []);
      setScripts(s.scripts || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.product_id || !form.variant_a_script_id || !form.variant_b_script_id) return;
    await fetch("/api/sovereign-chat/ppv/ab-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ product_id: "", name: "", variant_a_script_id: "", variant_b_script_id: "", split_ratio: 0.5 });
    const t = await fetch("/api/sovereign-chat/ppv/ab-tests").then(r => r.json());
    setTests(t.tests || []);
  };

  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse" style={{backgroundColor:"rgba(245,240,235,0.03)"}} />)}</div>;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="text-[10px] font-medium py-1.5 px-3" style={{backgroundColor:"var(--accent)", color:"var(--text-primary)"}}>
          {showForm ? "Annuler" : "+ Nouveau test"}
        </button>
      </div>

      {showForm && (
        <div className="p-3 space-y-2" style={{backgroundColor:"rgba(245,240,235,0.03)", border:"1px solid rgba(245,240,235,0.06)"}}>
          <input placeholder="Nom du test" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}} />
          <select value={form.product_id} onChange={e => setForm(p => ({...p, product_id: e.target.value}))} className="w-full p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}}>
            <option value="">Produit</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.price}€)</option>)}
          </select>
          <div className="flex gap-2">
            <select value={form.variant_a_script_id} onChange={e => setForm(p => ({...p, variant_a_script_id: e.target.value}))} className="flex-1 p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}}>
              <option value="">Script A</option>
              {scripts.map(s => <option key={s.id} value={s.id}>{s.name || "Sans nom"}</option>)}
            </select>
            <select value={form.variant_b_script_id} onChange={e => setForm(p => ({...p, variant_b_script_id: e.target.value}))} className="flex-1 p-2 text-xs bg-transparent" style={{color:"var(--text-primary)", border:"1px solid rgba(245,240,235,0.1)"}}>
              <option value="">Script B</option>
              {scripts.map(s => <option key={s.id} value={s.id}>{s.name || "Sans nom"}</option>)}
            </select>
          </div>
          <button onClick={handleCreate} className="text-[10px] font-semibold py-1.5 px-3" style={{backgroundColor:"var(--accent)", color:"var(--text-primary)"}}>Lancer le test</button>
        </div>
      )}

      {tests.length === 0 ? (
        <p className="text-xs text-center py-8" style={{color:"rgba(245,240,235,0.3)"}}>Aucun A/B test</p>
      ) : (
        <div className="space-y-1">
          {tests.map((t: any) => (
            <div key={t.id} className="p-2.5" style={{backgroundColor:"rgba(245,240,235,0.02)", border:"1px solid rgba(245,240,235,0.04)"}}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium" style={{color:"var(--text-primary)"}}>{t.name}</span>
                <span className="text-[8px] px-1.5 py-0.5" style={{
                  backgroundColor: t.status === "running" ? "rgba(122,154,101,0.1)" : "rgba(245,240,235,0.04)",
                  color: t.status === "running" ? "var(--success)" : "rgba(245,240,235,0.3)",
                }}>
                  {t.status === "running" ? "En cours" : t.status === "completed" ? "Terminé" : "Annulé"}
                </span>
              </div>
              <div className="flex gap-2 text-[8px]" style={{color:"rgba(245,240,235,0.15)"}}>
                <span>Split: {Math.round((t.split_ratio || 0.5) * 100)}/{Math.round((1 - (t.split_ratio || 0.5)) * 100)}</span>
                {t.winner_variant && <><span>·</span><span>Gagnant: {t.winner_variant}</span></>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─═══ MAIN PAGE ═══─

export default function PPVPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={16} style={{ color: "var(--accent)" }} />
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            PPV Analytics
          </h1>
        </div>
        <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
          Analyse granulaire des performances PPV — produits, scripts, fans, time-to-unlock, A/B tests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 text-[10px] font-medium py-2 px-3 transition-all whitespace-nowrap"
              style={{
                backgroundColor: active ? "rgba(199,91,57,0.1)" : "rgba(245,240,235,0.03)",
                color: active ? "var(--accent)" : "rgba(245,240,235,0.3)",
                borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
              }}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {tab === "overview" && <OverviewTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "scripts" && <ScriptsTab />}
        {tab === "fans" && <FansTab />}
        {tab === "ttu" && <TTUTab />}
        {tab === "abtests" && <ABTestsTab />}
      </div>

      {/* Manual tracking note */}
      <div className="p-2.5 text-[9px]" style={{backgroundColor:"rgba(199,91,57,0.04)", border:"1px solid rgba(199,91,57,0.1)", color:"rgba(245,240,235,0.3)"}}>
        <strong style={{color:"var(--accent)"}}>🔵 Tracking manuel</strong> — Pour OnlyFans/MYM sans API, utilise la fiche fan pour logger les envois PPV et marquer les unlocks. Les A/B tests nécessitent 30+ envois par variant pour la significativité statistique.
      </div>
    </div>
  );
}
