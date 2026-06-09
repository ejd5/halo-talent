"use client";

import { RefreshCw, Clock } from "lucide-react";

interface Props {
  lastFetched: Date | null;
  loading: boolean;
  onRefresh: () => void;
  refreshDisabled: boolean;
  refreshCountdown: number;
}

export function FreshnessIndicator({
  lastFetched,
  loading,
  onRefresh,
  refreshDisabled,
  refreshCountdown,
}: Props) {
  const getTimeAgo = () => {
    if (!lastFetched) return "Jamais";
    const diff = Date.now() - lastFetched.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    return `Il y a ${hours}h`;
  };

  return (
    <div className="flex items-center gap-3 text-[10px]" style={{ color: "rgba(245,240,235,0.25)" }}>
      <div className="flex items-center gap-1">
        <Clock size={10} />
        <span>Données mises à jour {getTimeAgo()}</span>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshDisabled || loading}
        className="flex items-center gap-1 px-2 py-1 transition-all hover:opacity-70 disabled:opacity-30"
        style={{
          color: refreshDisabled ? "rgba(245,240,235,0.15)" : "rgba(245,240,235,0.4)",
          border: "1px solid rgba(245,240,235,0.08)",
        }}
        title={
          refreshDisabled
            ? `Réessaie dans ${refreshCountdown}s`
            : "Forcer le rafraîchissement (max 1x/h)"
        }
      >
        <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
        {refreshDisabled ? `${refreshCountdown}s` : "Rafraîchir"}
      </button>
    </div>
  );
}
