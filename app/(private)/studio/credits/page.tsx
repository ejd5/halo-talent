"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins, ArrowLeft, Loader, Sparkles, Check, AlertTriangle, KeyRound,
  TrendingUp, TrendingDown, ShoppingCart, BarChart3, Shield,
} from "lucide-react";
import { CREDIT_PACKS } from "@/lib/credits/pricing";

interface WalletData {
  balance: number;
  monthly_quota: number;
  reset_at: string;
  total_purchased: number;
  tier: { id: string; name: string; features: Record<string, unknown> };
  is_admin: boolean;
  is_unlimited: boolean;
  transactions: any[];
  category_consumption: Record<string, number>;
  chart_30d: { date: string; value: number }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  generate_image: "Images",
  generate_text: "Texte",
  video_: "Vidéo",
  transcribe: "Audio",
  voice_clone: "Clonage vocal",
  voice_: "Voix",
  music_: "Musique",
  upscale_: "Upscale",
  variation: "Variations",
  inpaint: "Inpainting",
  remove_bg: "Suppression fond",
  other: "Autre",
};

function getCategoryLabel(key: string): string {
  for (const [prefix, label] of Object.entries(CATEGORY_LABELS)) {
    if (key.startsWith(prefix)) return label;
  }
  return key.replace(/_/g, " ");
}

const PACKS = [
  { id: "credits_100", credits: 100, price: 9 },
  { id: "credits_500", credits: 500, price: 39, popular: true },
  { id: "credits_2000", credits: 2000, price: 129 },
];

export default function CreditsPage() {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCredits();
  }, []);

  async function fetchCredits() {
    try {
      const res = await fetch("/api/studio/credits");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy(packId: string) {
    setBuying(packId);
    setBuyError(null);
    setBuySuccess(null);
    try {
      const res = await fetch("/api/studio/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: packId }),
      });
      const d = await res.json();
      if (res.ok) {
        if (d.url) {
          // Redirect to Stripe
          window.location.href = d.url;
        } else if (d.demo) {
          setBuySuccess(d.message);
          fetchCredits();
        }
      } else {
        setBuyError(d.error || "Erreur d'achat");
      }
    } catch {
      setBuyError("Erreur réseau");
    } finally {
      setBuying(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        <Loader size={20} className="animate-spin" style={{ color: "#C75B39" }} />
      </div>
    );
  }

  const isUnlimited = data?.is_unlimited ?? false;
  const balance = data?.balance ?? 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/studio" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Crédits IA</h1>
        </div>

        {/* ─── Balance card ─── */}
        <div className="p-6 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(135deg, rgba(199,91,57,0.04) 0%, rgba(0,0,0,0) 100%)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Coins size={20} style={{ color: "#C75B39" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Solde actuel</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#C75B39" }}>
                  {isUnlimited ? "∞" : balance.toLocaleString("fr-FR")}
                </span>
                {!isUnlimited && data?.monthly_quota && data.monthly_quota > 0 && (
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                    / {data.monthly_quota.toLocaleString("fr-FR")}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm" style={{
                background: isUnlimited ? "rgba(199,91,57,0.1)" : "rgba(199,91,57,0.1)",
                color: isUnlimited ? "#C75B39" : "#C75B39",
              }}>
                {data?.tier?.name ?? "Free"}
              </span>
              {data?.reset_at && !isUnlimited && (
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Reset le {new Date(data.reset_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {!isUnlimited && data?.monthly_quota && data.monthly_quota > 0 && (
            <div className="relative h-1.5 w-full mb-1 rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="absolute left-0 top-0 h-full rounded-sm transition-all duration-500"
                style={{ width: `${Math.min(100, (balance / data.monthly_quota) * 100)}%`, background: balance < 100 ? "#E5484D" : "#C75B39" }}
              />
            </div>
          )}

          {/* Low credits warning */}
          {!isUnlimited && balance > 0 && balance < 100 && (
            <div className="flex items-center gap-1.5 text-[10px] mt-2" style={{ color: "#E5484D" }}>
              <AlertTriangle size={10} />
              Moins de 100 crédits restants
            </div>
          )}
        </div>

        {/* ─── 30-day chart ─── */}
        {data?.chart_30d && data.chart_30d.some((d) => d.value > 0) && (
          <div className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <BarChart3 size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Consommation 30 jours</span>
            </div>
            <div className="flex items-end gap-[2px] h-16">
              {data.chart_30d.map((day, i) => {
                const maxVal = Math.max(...data.chart_30d.map((d) => d.value), 1);
                const height = (day.value / maxVal) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    title={`${day.date}: ${day.value} crédits`}
                    style={{
                      height: `${Math.max(height, 1)}%`,
                      background: day.value > 0 ? "#C75B39" : "rgba(255,255,255,0.03)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Category consumption ─── */}
        {data?.category_consumption && Object.keys(data.category_consumption).length > 0 && (
          <div className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              Détail par catégorie
            </h2>
            <div className="space-y-2">
              {Object.entries(data.category_consumption)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const total = Object.values(data.category_consumption).reduce((a, b) => a + b, 0);
                  const pct = Math.round((amount / total) * 100);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span style={{ color: "#F5F0EB" }}>{getCategoryLabel(category)}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>{amount} crédits ({pct}%)</span>
                      </div>
                      <div className="relative h-1 w-full rounded-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="absolute left-0 top-0 h-full rounded-sm" style={{ width: `${pct}%`, background: "#C75B39" }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ─── Buy credits ─── */}
        {!isUnlimited && (
          <div className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <ShoppingCart size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
              <h2 className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Acheter plus de crédits</h2>
            </div>

            {buySuccess && (
              <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] mb-3 rounded-sm" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", color: "#10B981" }}>
                <Check size={10} /> {buySuccess}
              </div>
            )}
            {buyError && (
              <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] mb-3 rounded-sm" style={{ background: "rgba(229,72,77,0.06)", border: "1px solid rgba(229,72,77,0.15)", color: "#E5484D" }}>
                <AlertTriangle size={10} /> {buyError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleBuy(pack.id)}
                  disabled={buying === pack.id}
                  className="relative p-4 rounded-sm transition-all hover:bg-white/5 disabled:opacity-30 text-left"
                  style={{
                    border: `1px solid ${pack.popular ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: pack.popular ? "rgba(199,91,57,0.04)" : "transparent",
                  }}
                >
                  {pack.popular && (
                    <span className="absolute -top-2 right-2 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm" style={{ background: "#C75B39", color: "#FFFFFF" }}>
                      Populaire
                    </span>
                  )}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
                      {pack.credits.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>crédits</span>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: "#C75B39" }}>{pack.price} €</p>
                  <p className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
                    {(pack.price / pack.credits).toFixed(2)} €/crédit
                  </p>
                  {buying === pack.id && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-sm" style={{ background: "rgba(0,0,0,0.5)" }}>
                      <Loader size={14} className="animate-spin" style={{ color: "#C75B39" }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Quick actions ─── */}
        <div className="flex items-center gap-3">
          {!isUnlimited && !data?.is_admin && (
            <Link
              href="/dashboard/upgrade"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "#C75B39", color: "#FFFFFF" }}
            >
              <Sparkles size={12} />
              Changer de plan
            </Link>
          )}
          <Link
            href="/studio/api-keys"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm transition-opacity hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
          >
            <KeyRound size={12} />
            BYOK — Mes clés API
          </Link>
        </div>

        {/* ─── Transaction history ─── */}
        <div className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Historique des transactions
          </h2>

          {!data || data.transactions.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Coins size={20} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
                Aucune transaction pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {data.transactions.slice(0, 50).map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3 px-2 py-1.5 text-[10px] rounded-sm" style={{
                  color: "rgba(255,255,255,0.5)",
                  background: tx.type === "deduct" ? "rgba(229,72,77,0.02)" : tx.type === "purchase" ? "rgba(16,185,129,0.02)" : "transparent",
                }}>
                  {/* Icon */}
                  <span style={{ color: tx.type === "purchase" ? "#10B981" : tx.type === "grant" ? "#C75B39" : "#E5484D" }}>
                    {tx.type === "purchase" ? <TrendingUp size={10} /> : tx.type === "grant" ? <Coins size={10} /> : <TrendingDown size={10} />}
                  </span>

                  {/* Date */}
                  <span className="w-16 shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {new Date(tx.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>

                  {/* Type */}
                  <span className="w-16 shrink-0 font-medium" style={{
                    color: tx.type === "purchase" ? "#10B981" : tx.type === "grant" ? "#C75B39" : tx.type === "deduct" ? "#E5484D" : "rgba(255,255,255,0.3)",
                  }}>
                    {tx.type === "purchase" ? "Achat" : tx.type === "grant" ? "Crédits" : tx.type === "deduct" ? "Génération" : tx.type === "refund" ? "Remb." : "Bonus"}
                  </span>

                  {/* Reason */}
                  <span className="flex-1 truncate">{tx.reason?.replace(/_/g, " ") || ""}</span>

                  {/* Amount */}
                  <span style={{ color: tx.type === "purchase" || tx.type === "grant" || tx.type === "bonus" ? "#10B981" : "#E5484D" }}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
