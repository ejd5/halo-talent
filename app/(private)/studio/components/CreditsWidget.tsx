"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Coins, KeyRound, ArrowUpRight, Loader } from "lucide-react";
import type { WalletBalance } from "@/lib/studio/types";

export function CreditsWidget() {
  const [data, setData] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/studio/credits")
      .then((r) => r.json())
      .then((d) => {
        if (d.tier) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 border animate-pulse" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
        <div className="h-4 w-24 mb-3" style={{ background: "rgba(245,240,235,0.04)" }} />
        <div className="h-1.5 w-full mb-3" style={{ background: "rgba(245,240,235,0.04)" }} />
        <Loader size={14} className="animate-spin" style={{ color: "var(--color-ink-tertiary)" }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
        <div className="flex items-center gap-2 mb-3">
          <Coins size={16} style={{ color: "#C75B39" }} />
          <span className="font-sans text-xs font-medium" style={{ color: "#F5F0EB" }}>Crédits IA</span>
        </div>
        <p className="font-sans text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>Indisponible</p>
      </div>
    );
  }

  const balance = data.balance ?? 0;
  const monthlyQuota = data.monthly_quota ?? 0;
  const tierName = data.tier?.name ?? "Free";
  const pct = data.is_unlimited || !monthlyQuota ? 0 : Math.min(100, Math.round(((monthlyQuota - balance) / monthlyQuota) * 100));
  const isLow = pct > 80;

  return (
    <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#2A2420" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins size={16} style={{ color: "#C75B39" }} />
          <span className="font-sans text-xs font-medium" style={{ color: "#F5F0EB" }}>Crédits IA</span>
        </div>
        <span
          className="font-sans text-[9px] uppercase tracking-wider px-1.5 py-0.5"
          style={{
            border: "1px solid rgba(199,91,57,0.2)",
            color: "#C75B39",
          }}
        >
          {data.is_admin ? "Admin" : tierName}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 w-full mb-3" style={{ background: "rgba(245,240,235,0.06)" }}>
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: isLow && !data.is_unlimited ? "#C44536" : "#C75B39",
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xl font-semibold" style={{ color: "#F5F0EB" }}>
          {data.is_unlimited ? "∞" : balance.toLocaleString("fr-FR")}
          <span className="font-sans text-xs font-normal" style={{ color: "var(--color-ink-tertiary)" }}>
            {data.is_unlimited || !monthlyQuota ? "" : ` / ${monthlyQuota.toLocaleString("fr-FR")}`}
          </span>
        </span>
      </div>

      <p className="font-sans text-[10px] mb-3" style={{ color: "var(--color-ink-tertiary)" }}>
        Reset le {new Date(data.reset_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="flex gap-2">
        {data.is_admin ? (
          <span className="font-sans text-[9px] px-2 py-1" style={{ color: "var(--color-ink-tertiary)" }}>
            Mode Admin · Illimité
          </span>
        ) : (
          <>
            {!data.is_unlimited && (
              <Link
                href="/studio/credits"
                className="flex items-center gap-1 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
                style={{ background: "#C75B39", color: "#FFFFFF" }}
              >
                <ArrowUpRight size={10} />
                Crédits
              </Link>
            )}
            <Link
              href="/studio/api-keys"
              className="flex items-center gap-1 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
              style={{ border: "1px solid rgba(245,240,235,0.1)", color: "#F5F0EB" }}
            >
              <KeyRound size={10} />
              BYOK
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
