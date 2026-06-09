"use client";

import { useEffect, useState } from "react";
import { Plus, Wifi, WifiOff, RefreshCw, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Account = {
  id: string;
  platform: string;
  username: string | null;
  followers: number | null;
  monthly_revenue: number | null;
  platform_data: any;
};

const platformColors: Record<string, string> = {
  onlyfans: "text-accent",
  mym: "text-accent/60",
  fansly: "text-ink-muted",
  reveal: "text-ink-muted",
  instagram: "text-pink-500",
  tiktok: "text-cyan-500",
  youtube: "text-red-500",
  twitter: "text-sky-500",
  twitch: "text-purple-500",
};

const platformIcons: Record<string, string> = {
  onlyfans: "OF",
  mym: "MYM",
  fansly: "FA",
  reveal: "RV",
  instagram: "IG",
  tiktok: "TK",
  youtube: "YT",
  twitter: "TW",
  twitch: "TC",
};

export function PlatformCards() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const supabase = createClient();

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("creator_accounts")
        .select("*")
        .eq("creator_id", user.id)
        .order("platform");

      if (data) setAccounts(data);
    } catch (err) {
      console.error("Erreur chargement comptes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleSync = async (platform: string, account: Account) => {
    setSyncing(platform);

    try {
      if (["onlyfans", "mym", "fansly", "reveal"].includes(platform)) {
        alert("Saisie manuelle : rendez-vous dans l'onglet Revenus pour ajouter vos chiffres du mois.");
        setSyncing(null);
        return;
      }

      const res = await fetch(`/api/platforms/${platform}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: account.id,
          accessToken: account.platform_data?.access_token,
          channelId: account.username,
        }),
      });

      if (res.ok) {
        await fetchAccounts();
      }
    } catch {
      console.error("Erreur sync", platform);
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-ink/5 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">
            Mes plateformes
          </h2>
          <p className="text-ink-muted text-sm mt-1">
            {accounts.filter((a) => a.followers).length} connectées sur {accounts.length}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-hover transition-colors"
        >
          <Plus size={14} /> Connecter
        </button>
      </div>

      {/* Grid */}
      {accounts.length === 0 ? (
        <div className="border border-dashed border-ink/10 p-12 text-center">
          <p className="text-ink-muted text-sm mb-4">
            Aucune plateforme connectée
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-hover transition-colors"
          >
            + Connecter votre première plateforme
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((account) => {
            const lastSync = account.platform_data?.last_sync;
            const daysSinceSync = lastSync
              ? Math.floor((Date.now() - new Date(lastSync).getTime()) / 86400000)
              : null;
            const isStale = daysSinceSync !== null && daysSinceSync > 3;

            return (
              <div
                key={account.id}
                className="border border-ink/5 p-5 hover:border-ink/10 transition-colors group bg-base-alt card-accent"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center text-xs font-mono bg-base",
                      platformColors[account.platform] || "text-ink"
                    )}>
                      {platformIcons[account.platform] || account.platform.slice(0, 2).toUpperCase()}
                    </span>
                    <h3 className="text-sm font-medium text-ink capitalize">
                      {account.platform}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sync button */}
                    <button
                      onClick={() => handleSync(account.platform, account)}
                      disabled={syncing === account.platform}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Synchroniser"
                    >
                      <RefreshCw
                        size={13}
                        className={cn(
                          "text-ink-muted hover:text-accent transition-colors",
                          syncing === account.platform && "animate-spin"
                        )}
                      />
                    </button>
                    {/* Status */}
                    {isStale ? (
                      <WifiOff size={13} className="text-alert" />
                    ) : (
                      <Wifi size={13} className={cn(
                        account.followers ? "text-success" : "text-ink-muted/40"
                      )} />
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Followers</span>
                    <span className="font-mono text-ink">
                      {account.followers?.toLocaleString() || "—"}
                    </span>
                  </div>
                  {account.monthly_revenue !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-muted">Revenu / mois</span>
                      <span className="font-mono text-ink">
                        {account.monthly_revenue.toLocaleString()}€
                      </span>
                    </div>
                  )}
                  {account.username && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-muted">@{account.username}</span>
                      {lastSync && (
                        <span className={cn(
                          "text-[10px]",
                          isStale ? "text-alert/60" : "text-ink-muted/40"
                        )}>
                          Sync: il y a {daysSinceSync}j
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Modal */}
      {showModal && (
        <ConnectModal
          onClose={() => setShowModal(false)}
          onConnected={fetchAccounts}
        />
      )}
    </div>
  );
}

function ConnectModal({ onClose, onConnected }: { onClose: () => void; onConnected: () => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  const availablePlatforms = [
    { id: "instagram", label: "Instagram", type: "api", note: "Compte Business/Creator requis" },
    { id: "tiktok", label: "TikTok", type: "api", note: "Connexion via TikTok" },
    { id: "youtube", label: "YouTube", type: "api", note: "N'importe quelle chaîne" },
    { id: "twitter", label: "Twitter / X", type: "api", note: "Compte public" },
    { id: "twitch", label: "Twitch", type: "api", note: "Streamer" },
    { id: "onlyfans", label: "OnlyFans", type: "manual", note: "Saisie manuelle uniquement" },
    { id: "mym", label: "MYM", type: "manual", note: "Saisie manuelle uniquement" },
    { id: "fansly", label: "Fansly", type: "manual", note: "Saisie manuelle uniquement" },
    { id: "reveal", label: "Reveal", type: "manual", note: "Saisie manuelle uniquement" },
  ];

  const handleConnect = async () => {
    if (!selectedPlatform) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("creator_accounts").insert({
      creator_id: user.id,
      platform: selectedPlatform,
      username: username || null,
    });

    setSaving(false);
    onConnected();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-base-alt border border-ink/10 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink/5">
          <div>
            <h3 className="font-display text-xl text-ink">Connecter une plateforme</h3>
            <p className="text-ink-muted text-sm mt-1">
              Choisissez une plateforme à connecter
            </p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl">&times;</button>
        </div>

        {/* Liste */}
        <div className="p-6 space-y-3">
          {availablePlatforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={cn(
                "w-full text-left p-4 border transition-all",
                selectedPlatform === p.id
                  ? "border-accent bg-accent/5"
                  : "border-ink/5 hover:border-ink/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    "text-sm font-medium",
                    selectedPlatform === p.id ? "text-accent" : "text-ink"
                  )}>
                    {p.label}
                  </span>
                  <p className="text-ink-muted text-xs mt-0.5">{p.note}</p>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 uppercase tracking-wider",
                  p.type === "api"
                    ? "text-success bg-success/10"
                    : "text-ink-muted bg-ink/5"
                )}>
                  {p.type === "api" ? "Auto" : "Manuel"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Username (if selected) */}
        {selectedPlatform && (
          <div className="px-6 pb-6">
            <label className="block text-xs uppercase tracking-[0.15em] text-ink-muted mb-2">
              Username / Handle (optionnel)
            </label>
            <input
              type="text"
              placeholder="@votrehandle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-2 text-ink text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleConnect}
              disabled={saving}
              className="w-full mt-4 py-3 bg-accent text-white text-xs uppercase tracking-[0.15em] font-semibold font-sans disabled:opacity-40"
            >
              {saving ? "Connexion..." : "Connecter"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
