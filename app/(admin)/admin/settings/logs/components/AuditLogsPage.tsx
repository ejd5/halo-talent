"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Search, Download, Filter, X, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, Info, CheckCircle, XCircle,
  Clock, Shield, Eye, EyeOff, FileJson, FileText,
  Bell, BellOff, RefreshCw,
} from "lucide-react";
import { auditLogs as allLogs } from "../data";
import type { AuditLogDetail, LogSeverity, LogStatus, LogActionType, LogResourceType, LogFilterState } from "../../types";

// ── Helpers ─────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

const SEVERITY_ICONS: Record<LogSeverity, typeof AlertCircle> = {
  info: Info, warning: AlertTriangle, critical: AlertCircle,
};
const SEVERITY_COLORS: Record<LogSeverity, string> = {
  info: "#4A90D9", warning: "#C7A254", critical: "#C44536",
};
const ACTION_TYPE_LABELS: Record<LogActionType, string> = {
  create: "Création", update: "Modification", delete: "Suppression",
  view: "Consultation", login: "Connexion", export: "Export",
  system: "Système", other: "Autre",
};
const RESOURCE_TYPE_LABELS: Record<LogResourceType, string> = {
  creator: "Créateurs", application: "Candidatures", contract: "Contrats",
  payment: "Paiements", commission: "Commissions", settings: "Paramètres",
  permissions: "Permissions", user: "Utilisateurs", message: "Messages",
  analytics: "Analytics", cms: "Site web", system: "Système",
  cron: "Cron", platform_sync: "Sync plateforme", login: "Connexion",
};

const PAGE_SIZE = 15;

// ── FilterBar ───────────────────────────────────────────

function FilterBar({
  filters, setFilters, users, onExport,
}: {
  filters: LogFilterState;
  setFilters: (f: LogFilterState) => void;
  users: { id: string; name: string }[];
  onExport: (format: "csv" | "json") => void;
}) {
  const [showExport, setShowExport] = useState(false);
  const update = (key: keyof LogFilterState, value: unknown) => setFilters({ ...filters, [key]: value });

  const allActionTypes: LogActionType[] = ["create", "update", "delete", "view", "login", "export", "system"];
  const allResourceTypes: LogResourceType[] = ["creator", "application", "contract", "payment", "commission", "settings", "permissions", "user", "message", "analytics", "cms", "cron", "platform_sync", "login"];
  const severities: LogSeverity[] = ["info", "warning", "critical"];
  const statuses: LogStatus[] = ["success", "failed"];

  const toggleArray = (key: "action_types" | "resource_types" | "severity" | "status", value: string) => {
    const arr = [...filters[key]];
    const idx = arr.indexOf(value as never);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(value as never);
    update(key, arr);
  };

  const activeFilters = filters.action_types.length + filters.resource_types.length + filters.severity.length + filters.status.length + (filters.search ? 1 : 0) + (filters.ip_address ? 1 : 0) + (filters.date_from ? 1 : 0);

  return (
    <div className="border border-[var(--color-border)]">
      {/* Main row */}
      <div className="flex items-center gap-2 p-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Recherche full-text..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
          />
          {filters.search && (
            <button onClick={() => update("search", "")} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100">
              <X size={12} />
            </button>
          )}
        </div>

        {/* User */}
        <select
          value={filters.user_ids[0] ?? ""}
          onChange={(e) => update("user_ids", e.target.value ? [e.target.value] : [])}
          className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent min-w-[130px]"
        >
          <option value="">Tous les utilisateurs</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          <option value="system">Système</option>
        </select>

        {/* IP */}
        <input
          type="text"
          value={filters.ip_address}
          onChange={(e) => update("ip_address", e.target.value)}
          placeholder="IP address..."
          className="w-28 px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
        />

        {/* Date range */}
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => update("date_from", e.target.value)}
          className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none w-[130px]"
          title="Date début"
        />
        <span className="text-[10px] opacity-30">→</span>
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => update("date_to", e.target.value)}
          className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none w-[130px]"
          title="Date fin"
        />

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
          >
            <Download size={12} />
            Exporter
          </button>
          {showExport && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-32 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
                <button onClick={() => { onExport("csv"); setShowExport(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-[var(--color-card)] transition-colors">
                  <FileText size={12} /> CSV
                </button>
                <button onClick={() => { onExport("json"); setShowExport(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-[11px] hover:bg-[var(--color-card)] transition-colors">
                  <FileJson size={12} /> JSON
                </button>
              </div>
            </>
          )}
        </div>

        {/* Active filter count */}
        {activeFilters > 0 && (
          <button onClick={() => setFilters({ search: "", user_ids: [], action_types: [], resource_types: [], severity: [], status: [], date_from: "", date_to: "", ip_address: "" })} className="flex items-center gap-1 text-[10px] opacity-40 hover:opacity-100">
            <X size={10} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex items-center gap-1.5 px-3 pb-3 flex-wrap">
        {/* Action type pills */}
        {allActionTypes.map((at) => (
          <button key={at} onClick={() => toggleArray("action_types", at)}
            className={`px-2 py-0.5 text-[9px] font-medium border transition-colors ${
              filters.action_types.includes(at) ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] opacity-50 hover:opacity-100"
            }`}
          >{ACTION_TYPE_LABELS[at]}</button>
        ))}
        <span className="w-px h-3 bg-[var(--color-border)] mx-1" />
        {/* Severity pills */}
        {severities.map((s) => (
          <button key={s} onClick={() => toggleArray("severity", s)}
            className={`px-2 py-0.5 text-[9px] font-medium border transition-colors ${
              filters.severity.includes(s) ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] opacity-50 hover:opacity-100"
            }`}
          >{s === "info" ? "Info" : s === "warning" ? "Warning" : "Critical"}</button>
        ))}
        <span className="w-px h-3 bg-[var(--color-border)] mx-1" />
        {/* Status pills */}
        {statuses.map((s) => (
          <button key={s} onClick={() => toggleArray("status", s)}
            className={`px-2 py-0.5 text-[9px] font-medium border transition-colors ${
              filters.status.includes(s) ? (s === "success" ? "border-[#7A9A65] text-[#7A9A65]" : "border-[#C44536] text-[#C44536]") : "border-[var(--color-border)] opacity-50 hover:opacity-100"
            }`}
          >{s === "success" ? "Succès" : "Échec"}</button>
        ))}
      </div>
    </div>
  );
}

// ── LogRow ──────────────────────────────────────────────

function LogRow({ log, isExpanded, onToggle }: { log: AuditLogDetail; isExpanded: boolean; onToggle: () => void }) {
  const SevIcon = SEVERITY_ICONS[log.severity];
  const sevColor = SEVERITY_COLORS[log.severity];
  const hasDiff = log.old_value && log.new_value;

  return (
    <>
      {/* Main row */}
      <div
        className="grid grid-cols-[140px_1fr_160px_1fr_100px_60px_24px] gap-3 px-4 py-2.5 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors text-xs cursor-pointer"
        onClick={onToggle}
      >
        {/* Timestamp */}
        <div className="flex items-center gap-1.5" title={formatDate(log.created_at)}>
          <Clock size={10} className="opacity-30 shrink-0" />
          <span className="text-[11px]">{timeAgo(log.created_at)}</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 border border-[var(--color-border)] flex items-center justify-center text-[9px] font-semibold shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
            {log.user_name === "Système" ? "⚙" : log.user_name === "Inconnu" ? "?" : log.user_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="truncate">{log.user_name}</span>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-medium px-1.5 py-0.5 shrink-0" style={{ color: sevColor, backgroundColor: `${sevColor}15` }}>
            {ACTION_TYPE_LABELS[log.action_type]}
          </span>
          <span className="truncate">{log.action_verb}</span>
        </div>

        {/* Resource */}
        <div className="min-w-0">
          {log.resource_href ? (
            <a href={log.resource_href} onClick={(e) => e.stopPropagation()} className="text-[var(--color-accent)] hover:underline truncate block">
              {log.resource_label ?? log.resource_type}
            </a>
          ) : (
            <span className="truncate block opacity-50">{log.resource_label ?? log.resource_type}</span>
          )}
        </div>

        {/* IP */}
        <div className="font-mono text-[10px] opacity-40">{log.ip_address}</div>

        {/* Status */}
        <div className="flex justify-center">
          {log.status === "success" ? <CheckCircle size={12} className="text-[#7A9A65]" /> : <XCircle size={12} className="text-[#C44536]" />}
        </div>

        {/* Expand */}
        <div className="flex justify-center">
          {isExpanded ? <ChevronUp size={12} className="opacity-30" /> : <ChevronDown size={12} className="opacity-30" />}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="px-4 py-3 space-y-3 text-xs">
            {/* Diff view */}
            {hasDiff && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1">Ancienne valeur</div>
                  <pre className="text-[10px] p-2 border border-[var(--color-border)] overflow-x-auto" style={{ backgroundColor: "var(--color-base)", maxHeight: 160 }}>
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1">Nouvelle valeur</div>
                  <pre className="text-[10px] p-2 border border-[var(--color-border)] overflow-x-auto" style={{ backgroundColor: "var(--color-base)", maxHeight: 160 }}>
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1">Contexte</div>
                <pre className="text-[10px] p-2 border border-[var(--color-border)] overflow-x-auto" style={{ backgroundColor: "var(--color-base)", maxHeight: 160 }}>
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Error + stack trace */}
            {log.error_message && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 flex items-center gap-1">
                  <AlertCircle size={10} className="text-[#C44536]" /> Erreur
                </div>
                <div className="text-[#C44536] mb-1">{log.error_message}</div>
                {log.stack_trace && (
                  <pre className="text-[10px] p-2 border border-[var(--color-border)] overflow-x-auto opacity-60" style={{ backgroundColor: "var(--color-base)", maxHeight: 160 }}>
                    {log.stack_trace}
                  </pre>
                )}
              </div>
            )}

            {/* Context footer */}
            <div className="flex items-center gap-3 text-[10px] opacity-30">
              <span>ID: {log.id}</span>
              <span>·</span>
              <span title={log.user_agent ?? undefined}>UA: {log.user_agent?.slice(0, 40)}...</span>
              {log.resource_href && (
                <><span>·</span><a href={log.resource_href} className="text-[var(--color-accent)] hover:underline">Voir la ressource →</a></>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── AlertConfigPanel ────────────────────────────────────

function AlertConfigPanel({ onClose }: { onClose: () => void }) {
  const [alerts, setAlerts] = useState([
    { id: "a1", label: "Connexion suspecte (nouvelle IP / pays)", enabled: true, channel: "telegram" },
    { id: "a2", label: "Suppression de créateur", enabled: true, channel: "telegram" },
    { id: "a3", label: "Modification commission > 5%", enabled: true, channel: "telegram" },
    { id: "a4", label: "Paiement > 10 000€", enabled: true, channel: "telegram" },
    { id: "a5", label: "Erreurs critiques système", enabled: true, channel: "telegram" },
    { id: "a6", label: "Tentatives brute force (5+ échecs)", enabled: true, channel: "telegram" },
    { id: "a7", label: "Quota API près de la limite", enabled: false, channel: "email" },
    { id: "a8", label: "Export de données massif", enabled: false, channel: "telegram" },
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-[560px] border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Bell size={14} />
            Alertes Telegram
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--color-card)] transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAlerts((prev) => prev.map((x) => x.id === a.id ? { ...x, enabled: !x.enabled } : x))}
                  className={`relative w-8 h-4 rounded-[0px] transition-all duration-150 ${a.enabled ? "opacity-100" : "opacity-20"}`}
                  style={{ backgroundColor: a.enabled ? "#7A9A65" : "var(--color-border)" }}
                >
                  <div className={`absolute top-0.5 w-3.5 h-3 bg-white transition-transform duration-150 ${a.enabled ? "translate-x-[16px]" : "translate-x-[2px]"}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                </button>
                <span className="text-xs">{a.label}</span>
              </div>
              <span className="text-[10px] opacity-30 flex items-center gap-1">
                <Bell size={10} /> {a.channel}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[var(--color-border)]">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors">Fermer</button>
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-medium text-white" style={{ backgroundColor: "var(--color-accent)" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────

export function AuditLogsPage() {
  const [filters, setFilters] = useState<LogFilterState>({
    search: "", user_ids: [], action_types: [], resource_types: [],
    severity: [], status: [], date_from: "", date_to: "", ip_address: "",
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAlerts, setShowAlerts] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return allLogs
      .filter((log) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const haystack = [log.action_verb, log.resource_label, log.user_name, log.user_email, log.error_message, log.ip_address, ...Object.values(log.metadata ?? {}).map(String)].filter(Boolean).join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (filters.user_ids.length > 0) {
          if (filters.user_ids.includes("system") && log.user_id !== "") {
            if (!filters.user_ids.includes(log.user_id)) return false;
          } else if (log.user_id && !filters.user_ids.includes(log.user_id)) return false;
          else if (!log.user_id && !filters.user_ids.includes("system")) return false;
        }
        if (filters.action_types.length > 0 && !filters.action_types.includes(log.action_type)) return false;
        if (filters.severity.length > 0 && !filters.severity.includes(log.severity)) return false;
        if (filters.status.length > 0 && !filters.status.includes(log.status)) return false;
        if (filters.ip_address) {
          if (!log.ip_address.includes(filters.ip_address)) return false;
        }
        if (filters.date_from) {
          const from = new Date(filters.date_from).getTime();
          if (new Date(log.created_at).getTime() < from) return false;
        }
        if (filters.date_to) {
          const to = new Date(filters.date_to).getTime() + 86400000;
          if (new Date(log.created_at).getTime() > to) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [filters]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  // Reset on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setExpanded(new Set());
  }, [filters]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleExport = (format: "csv" | "json") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ["ID", "Date", "Utilisateur", "Email", "Action", "Type", "Ressource", "IP", "Severite", "Statut", "Erreur"];
      const rows = filtered.map((l) => [l.id, l.created_at, l.user_name, l.user_email, l.action_verb, l.action_type, l.resource_label ?? "", l.ip_address, l.severity, l.status, l.error_message ?? ""].map((v) => `"${v.replace(/"/g, '""')}"`).join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const uniqueUsers = useMemo(() => {
    const map = new Map<string, string>();
    allLogs.forEach((l) => { if (l.user_id) map.set(l.user_id, l.user_name); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6 card-accent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Audit Logs</h1>
          <p className="text-xs opacity-40 mt-0.5">
            {filtered.length} entrée{filtered.length !== 1 ? "s" : ""} · {allLogs.length} au total · Rétention 2 ans
          </p>
        </div>
        <button
          onClick={() => setShowAlerts(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors"
        >
          <Bell size={12} />
          Alertes
        </button>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} users={uniqueUsers} onExport={handleExport} />

      {/* Table */}
      <div className="border border-[var(--color-border)]">
        {/* Table header */}
        <div className="grid grid-cols-[140px_1fr_160px_1fr_100px_60px_24px] gap-3 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)] items-center">
          <div>Date</div>
          <div>Utilisateur</div>
          <div>Action</div>
          <div>Ressource</div>
          <div>IP</div>
          <div className="text-center">Statut</div>
          <div />
        </div>

        {visible.length === 0 ? (
          <div className="px-4 py-12 text-center text-xs opacity-30">Aucun résultat pour ces filtres</div>
        ) : (
          visible.map((log) => (
            <LogRow key={log.id} log={log} isExpanded={expanded.has(log.id)} onToggle={() => toggleExpanded(log.id)} />
          ))
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="py-4 text-center text-[10px] opacity-20">
          {hasMore ? "Scrollez pour charger plus..." : visible.length > 0 ? `Affichage de ${visible.length} résultat${visible.length !== 1 ? "s" : ""}` : ""}
        </div>
      </div>

      {/* Alert config modal */}
      {showAlerts && <AlertConfigPanel onClose={() => setShowAlerts(false)} />}
    </div>
  );
}
