"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Shield, User, Globe, Info } from "lucide-react";

interface AuditEntry {
  id: string;
  co_management_id: string;
  action: string;
  performed_by: string;
  device_info: { source: string } | null;
  performed_at: string;
  platform_co_management: {
    platform: string;
    manager_email: string;
    access_level: string;
  } | null;
}

const ACTION_LABELS: Record<string, string> = {
  created: "Invitation envoyée",
  revoked: "Accès révoqué",
  activated: "Accès activé",
};

const ACTION_COLORS: Record<string, string> = {
  created: "#7A9A65",
  revoked: "#C44536",
  activated: "#C75B39",
};

export default function CoManagementAuditPage() {
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/integrations/co-management/audit")
      .then((r) => r.json())
      .then((d) => setAudit(d.audit ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/integrations/co-management"
          className="transition-all hover:opacity-70"
        >
          <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Clock size={14} style={{ color: "#C75B39" }} />
            <h1
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
            >
              Journal d&apos;audit
            </h1>
          </div>
          <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            Toutes les actions effectuées sur tes accès co-management
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!loading && audit.length === 0 && (
        <div className="p-8 text-center" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
          <Info size={20} className="mx-auto mb-2" style={{ color: "rgba(245,240,235,0.15)" }} />
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>
            Aucune action enregistrée pour le moment.
          </p>
          <Link
            href="/dashboard/integrations/co-management"
            className="inline-block mt-3 text-[10px] font-medium py-2 px-3"
            style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
          >
            Configurer un accès
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse"
              style={{ backgroundColor: "rgba(245,240,235,0.03)" }}
            />
          ))}
        </div>
      )}

      {/* Timeline */}
      {!loading && audit.length > 0 && (
        <div className="space-y-1">
          {audit.map((entry, i) => {
            const label = ACTION_LABELS[entry.action] || entry.action;
            const color = ACTION_COLORS[entry.action] || "rgba(245,240,235,0.3)";
            const date = new Date(entry.performed_at);

            return (
              <div key={entry.id} className="flex gap-3">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {i < audit.length - 1 && (
                    <div className="flex-1 w-px" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div
                    className="p-3"
                    style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5"
                          style={{
                            backgroundColor: `${color}15`,
                            color,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                        {date.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1 text-[10px]">
                      {entry.platform_co_management && (
                        <div className="flex items-center gap-1.5">
                          <Globe size={8} style={{ color: "rgba(245,240,235,0.2)" }} />
                          <span style={{ color: "rgba(245,240,235,0.5)" }}>
                            {entry.platform_co_management.platform}
                          </span>
                          <span style={{ color: "rgba(245,240,235,0.15)" }}>·</span>
                          <span style={{ color: "rgba(245,240,235,0.3)" }}>
                            {entry.platform_co_management.manager_email}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <User size={8} style={{ color: "rgba(245,240,235,0.2)" }} />
                        <span style={{ color: "rgba(245,240,235,0.3)" }}>
                          Par {entry.performed_by || "inconnu"}
                        </span>
                        {entry.device_info?.source && (
                          <>
                            <span style={{ color: "rgba(245,240,235,0.15)" }}>·</span>
                            <Shield size={8} style={{ color: "rgba(245,240,235,0.2)" }} />
                            <span style={{ color: "rgba(245,240,235,0.2)" }}>
                              {entry.device_info.source}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Back link */}
      <div className="pt-2">
        <Link
          href="/dashboard/integrations/co-management"
          className="inline-flex items-center gap-1.5 text-[10px] font-medium transition-all hover:opacity-70"
          style={{ color: "rgba(245,240,235,0.3)" }}
        >
          <ArrowLeft size={10} />
          Retour au co-management
        </Link>
      </div>
    </div>
  );
}
