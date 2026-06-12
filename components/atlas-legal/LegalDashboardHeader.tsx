"use client";

import { RefreshCw, FileText, Clock, ShieldCheck } from "lucide-react";
import { t } from "@/lib/i18n/legal";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";

interface DashboardMeta {
  changes_this_month: number;
  pending_count: number;
  last_scan_at: string | null;
  total_sources: number;
}

export function LegalDashboardHeader({ meta, locale }: { meta: DashboardMeta | null; locale: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
        <div className="flex-1">
          <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {t("hero.badge", locale)}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
            {t("atlas.description", locale)}
          </p>
        </div>
        {meta?.last_scan_at && <FreshnessBadge date={meta.last_scan_at} />}
      </div>

      {meta && (
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-ink-secondary)" }}>
            <RefreshCw size={12} style={{ color: "var(--color-success)" }} />
            {t("atlas.sources_count", locale).replace("{count}", String(meta.total_sources))}
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-ink-secondary)" }}>
            <FileText size={12} style={{ color: "var(--accent)" }} />
            {t("atlas.changes_month", locale).replace("{count}", String(meta.changes_this_month))}
          </div>
          {meta.pending_count > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#F59E0B" }}>
              <Clock size={12} />
              {meta.pending_count} en attente de validation
            </div>
          )}
        </div>
      )}
    </div>
  );
}
