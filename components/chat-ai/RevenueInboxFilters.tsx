"use client";

import { Filter } from "lucide-react";

interface Filters {
  platform: string;
  fanStatus: string;
  language: string;
  risk: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const platforms = ["", "onlyfans", "mym", "fansly", "fanvue"];
const statuses = ["", "new", "active", "vip", "whale", "dormant", "churn_risk", "do_not_contact"];
const languages = ["", "fr", "en", "es", "de", "pt-BR", "it"];
const risks = ["", "high"];

const selectStyle: React.CSSProperties = {
  padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(245,240,235,0.08)",
  background: "rgba(245,240,235,0.03)", color: "rgba(245,240,235,0.6)", fontSize: 10,
  cursor: "pointer", minWidth: 90,
};

export function RevenueInboxFilters({ filters, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <Filter size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
      <select value={filters.platform} onChange={e => onChange({ ...filters, platform: e.target.value })} style={selectStyle}>
        <option value="">Toutes plateformes</option>
        {platforms.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select value={filters.fanStatus} onChange={e => onChange({ ...filters, fanStatus: e.target.value })} style={selectStyle}>
        <option value="">Tous statuts</option>
        {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
      </select>
      <select value={filters.language} onChange={e => onChange({ ...filters, language: e.target.value })} style={selectStyle}>
        <option value="">Toutes langues</option>
        {languages.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select value={filters.risk} onChange={e => onChange({ ...filters, risk: e.target.value })} style={selectStyle}>
        <option value="">Tout risque</option>
        {risks.filter(Boolean).map(r => <option key={r} value={r}>{r === "high" ? "Risque élevé" : r}</option>)}
      </select>
    </div>
  );
}
