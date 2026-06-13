"use client";

import { useState } from "react";
import { RefreshCw, Database, Globe, Bot, CreditCard, Mail, Camera, Video, Music, Lock, HardDrive, Activity, AlertTriangle, CheckCircle, XCircle, Clock, Download, Upload, Trash2, RotateCcw } from "lucide-react";
import { systemStatuses, cronJobs, backups, quotaUsage } from "../../logs/data";
import type { SystemStatus, CronJobStatus, BackupEntry, QuotaUsage } from "../../types";

// ── Helpers ─────────────────────────────────────────────

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Jamais";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.round(hours / 24);
  return `Il y a ${days}j`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const SERVICE_ICONS: Record<string, typeof Database> = {
  database: Database, globe: Globe, bot: Bot, "credit-card": CreditCard,
  mail: Mail, camera: Camera, video: Video, music: Music, lock: Lock,
};

// ── ServiceCard ─────────────────────────────────────────

function ServiceCard({ service }: { service: SystemStatus }) {
  const Icon = SERVICE_ICONS[service.icon] ?? Activity;
  const statusColor = service.status === "healthy" ? "var(--success)" : service.status === "degraded" ? "var(--warning)" : "var(--danger)";
  const statusLabel = service.status === "healthy" ? "Opérationnel" : service.status === "degraded" ? "Dégradé" : "Indisponible";

  return (
    <div className="p-3 border border-[var(--color-border)] flex items-start gap-3">
      <div className="p-1.5 border border-[var(--color-border)] shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{service.label}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-medium" style={{ color: statusColor }}>{statusLabel}</span>
          {service.latency_ms !== null && <span className="text-[10px] opacity-30">{service.latency_ms}ms</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
      </div>
    </div>
  );
}

// ── QuotaBar ────────────────────────────────────────────

function QuotaBar({ quota }: { quota: QuotaUsage }) {
  const pct = Math.min((quota.used / quota.limit) * 100, 100);
  const color = pct > 90 ? "var(--danger)" : pct > 70 ? "var(--warning)" : "var(--success)";
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-40 shrink-0 truncate opacity-70">{quota.resource}</span>
      <div className="flex-1 h-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="w-28 text-right font-mono text-[10px] opacity-40">
        {quota.used} / {quota.limit} {quota.unit}
      </span>
    </div>
  );
}

// ── CronRow ─────────────────────────────────────────────

function CronRow({ job }: { job: CronJobStatus }) {
  return (
    <div className="grid grid-cols-[1fr_120px_80px_100px_120px] gap-3 px-4 py-2.5 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors text-xs">
      <div>
        <div className="font-mono text-[11px]">{job.name}</div>
        <div className="text-[10px] opacity-30 mt-0.5">{job.description}</div>
      </div>
      <div className="text-[10px] opacity-40">{timeAgo(job.last_run)}</div>
      <div className="text-[10px] opacity-40">
        {job.last_duration_ms ? `${(job.last_duration_ms / 1000).toFixed(1)}s` : ", "}
      </div>
      <div className="flex justify-center">
        {job.last_success === null ? (
          <span className="text-[10px] opacity-20">, </span>
        ) : job.last_success ? (
          <CheckCircle size={12} className="text-[var(--success)]" />
        ) : (
          <XCircle size={12} className="text-[var(--danger)]" />
        )}
      </div>
      <div className="text-[10px] opacity-40">{timeAgo(job.next_run)}</div>
    </div>
  );
}

// ── BackupRow ───────────────────────────────────────────

function BackupRow({ backup }: { backup: BackupEntry }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="grid grid-cols-[1fr_80px_80px_120px_100px] gap-3 px-4 py-2.5 items-center border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors text-xs">
      <div className="text-[10px] opacity-40">{formatDate(backup.created_at)}</div>
      <div className="text-[10px]">{backup.size_mb} MB</div>
      <div className="text-[10px]">
        <span className={`font-medium ${backup.status === "completed" ? "text-[var(--success)]" : backup.status === "failed" ? "text-[var(--danger)]" : "text-[var(--warning)]"}`}>
          {backup.status === "completed" ? "Complété" : backup.status === "failed" ? "Échec" : "En cours"}
        </span>
      </div>
      <div className="text-[10px]">
        <span className={`px-1.5 py-0.5 text-[9px] font-medium ${backup.type === "manual" ? "border border-[var(--color-accent)] text-[var(--color-accent)]" : "opacity-40"}`}>
          {backup.type === "manual" ? "Manuel" : "Auto"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {backup.status === "completed" && !confirming && (
          <button onClick={() => setConfirming(true)} className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors">
            <RotateCcw size={10} /> Restaurer
          </button>
        )}
        {confirming && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[var(--danger)]">Confirmer?</span>
            <button onClick={() => setConfirming(false)} className="px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ backgroundColor: "var(--danger)" }}>Oui</button>
            <button onClick={() => setConfirming(false)} className="px-1.5 py-0.5 text-[9px] font-medium border border-[var(--color-border)]">Non</button>
          </div>
        )}
        {backup.restored_at && (
          <span className="text-[9px] opacity-30">Rétabli {timeAgo(backup.restored_at)}</span>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────

export function SystemPage() {
  const [activeTab, setActiveTab] = useState<"status" | "crons" | "backups">("status");
  const [backingUp, setBackingUp] = useState(false);
  const [healthRunning, setHealthRunning] = useState(false);
  const [healthResults, setHealthResults] = useState<SystemStatus[] | null>(null);

  const runHealthCheck = () => {
    setHealthRunning(true);
    setHealthResults(null);
    setTimeout(() => {
      setHealthResults(systemStatuses.map((s) => ({
        ...s,
        latency_ms: s.latency_ms ? Math.round(s.latency_ms * (0.8 + Math.random() * 0.4)) : null,
        last_check: new Date().toISOString(),
      })));
      setHealthRunning(false);
    }, 2000);
  };

  const triggerManualBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      // In real app: refresh backup list
    }, 3000);
  };

  const tabs = [
    { key: "status" as const, label: "Statut des services", icon: Activity },
    { key: "crons" as const, label: "Crons", icon: Clock },
    { key: "backups" as const, label: "Backups", icon: HardDrive },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 card-accent">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Système</h1>
        <p className="text-xs opacity-40 mt-0.5">Statut des services, maintenance et configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-transparent opacity-40 hover:opacity-100"
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Status Tab ── */}
      {activeTab === "status" && (
        <div className="flex flex-col gap-4">
          {/* Service grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {systemStatuses.map((s) => <ServiceCard key={s.service} service={s} />)}
          </div>

          {/* Quota usage */}
          <div>
            <h2 className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Utilisation des quotas</h2>
            <div className="p-4 border border-[var(--color-border)] space-y-3">
              {quotaUsage.map((q) => <QuotaBar key={q.resource} quota={q} />)}
            </div>
          </div>

          {/* Health check */}
          <div>
            <h2 className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Health Check</h2>
            <div className="p-4 border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs opacity-50">
                  {healthResults
                    ? `Dernière vérification: ${formatDate(new Date().toISOString())}`
                    : "Vérifiez la disponibilité de tous les services"
                  }
                </span>
                <button
                  onClick={runHealthCheck}
                  disabled={healthRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors disabled:opacity-30"
                >
                  <RefreshCw size={12} className={healthRunning ? "animate-spin" : ""} />
                  {healthRunning ? "Vérification..." : "Lancer le check"}
                </button>
              </div>
              {healthResults && (
                <div className="space-y-1">
                  {healthResults.map((r) => (
                    <div key={r.service} className="flex items-center gap-2 text-xs py-1">
                      {r.status === "healthy" ? <CheckCircle size={10} className="text-[var(--success)]" /> : <XCircle size={10} className="text-[var(--danger)]" />}
                      <span>{r.label}</span>
                      <span className="opacity-30 text-[10px]">{r.latency_ms}ms</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Crons Tab ── */}
      {activeTab === "crons" && (
        <div className="border border-[var(--color-border)]">
          <div className="grid grid-cols-[1fr_120px_80px_100px_120px] gap-3 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)] items-center">
            <div>Nom</div>
            <div>Dernier run</div>
            <div>Durée</div>
            <div className="text-center">Statut</div>
            <div>Prochain run</div>
          </div>
          {cronJobs.map((job) => <CronRow key={job.name} job={job} />)}
        </div>
      )}

      {/* ── Backups Tab ── */}
      {activeTab === "backups" && (
        <div className="flex flex-col gap-4">
          {/* Manual backup button */}
          <div className="flex items-center justify-between p-4 border border-[var(--color-border])">
            <div>
              <div className="text-xs font-medium">Backup manuel</div>
              <div className="text-[10px] opacity-30 mt-0.5">Les backups quotidiens sont automatiques (00:00 UTC)</div>
            </div>
            <button
              onClick={triggerManualBackup}
              disabled={backingUp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors disabled:opacity-30"
            >
              {backingUp ? (
                <><RefreshCw size={12} className="animate-spin" /> Sauvegarde...</>
              ) : (
                <><Upload size={12} /> Backup manuel</>
              )}
            </button>
          </div>

          {/* Backup history */}
          <div className="border border-[var(--color-border)]">
            <div className="grid grid-cols-[1fr_80px_80px_120px_100px] gap-3 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)] items-center">
              <div>Date</div>
              <div>Taille</div>
              <div>Statut</div>
              <div>Type</div>
              <div>Actions</div>
            </div>
            {backups.map((b) => <BackupRow key={b.id} backup={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
