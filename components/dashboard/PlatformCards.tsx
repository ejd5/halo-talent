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
  onlyfans: "text-brand-gold",
  mym: "text-brand-gold-light",
  fansly: "text-brand-taupe",
  reveal: "text-brand-taupe",
  instagram: "text-pink-400",
  tiktok: "text-cyan-400",
  youtube: "text-red-400",
  twitter: "text-sky-400",
  twitch: "text-purple-400",
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("creator_accounts")
      .select("*")
      .eq("creator_id", user.id)
      .order("platform");

    if (data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleSync = async (platform: string, account: Account) => {
    setSyncing(platform);

    try {
      if (["onlyfans", "mym", "fansly", "reveal"].includes(platform)) {
        // Saisie manuelle — ouvre un formulaire
        alert("Saisie manuelle : rendez-vous dans l'onglet Revenus pour ajouter vos chiffres du mois.");
        setSyncing(null);
        return;
      }

      // Sync automatique via API
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
        <div className="h-6 bg-white/5 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5" />
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
          <h2 className="font-display text-2xl text-brand-ivory">
            Mes plateformes
          </h2>
          <p className="text-brand-taupe text-sm mt-1">
            {accounts.filter((a) => a.followers).length} connectées sur {accounts.length}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-brand-gold hover:text-brand-gold-light transition-colors"
        >
          <Plus size={14} /> Connecter
        </button>
      </div>

      {/* Grid */}
      {accounts.length === 0 ? (
        <div className="border border-dashed border-white/10 p-12 text-center">
          <p className="text-brand-taupe text-sm mb-4">
            Aucune plateforme connectée
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs uppercase tracking-[0.15em] text-brand-gold hover:text-brand-gold-light transition-colors"
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
                className="border border-white/5 p-5 hover:border-white/10 transition-colors group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-mono",
                      platformColors[account.platform] || "text-brand-ivory"
                    )}>
                      {platformIcons[account.platform] || account.platform.slice(0, 2).toUpperCase()}
                    </span>
                    <h3 className="text-sm font-medium text-brand-ivory capitalize">
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
                          "text-brand-taupe hover:text-brand-gold transition-colors",
                          syncing === account.platform && "animate-spin"
                        )}
                      />
                    </button>
                    {/* Status */}
                    {isStale ? (
                      <WifiOff size={13} className="text-brand-alert" />
                    ) : (
                      <Wifi size={13} className={cn(
                        account.followers ? "text-brand-success" : "text-brand-taupe/40"
                      )} />
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-taupe">Followers</span>
                    <span className="font-mono text-brand-ivory">
                      {account.followers?.toLocaleString() || "—"}
                    </span>
                  </div>
                  {account.monthly_revenue !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-taupe">Revenu / mois</span>
                      <span className="font-mono text-brand-ivory">
                        {account.monthly_revenue.toLocaleString()}€
                      </span>
                    </div>
                  )}
                  {account.username && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-taupe">@{account.username}</span>
                      {lastSync && (
                        <span className={cn(
                          "text-[10px]",
                          isStale ? "text-brand-alert/60" : "text-brand-taupe/40"
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
      <div className="bg-brand-espresso border border-white/10 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="font-display text-xl text-brand-ivory italic">Connecter une plateforme</h3>
            <p className="text-brand-taupe text-sm mt-1">
              Choisissez une plateforme à connecter
            </p>
          </div>
          <button onClick={onClose} className="text-brand-taupe hover:text-brand-ivory text-xl">&times;</button>
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
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-white/5 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={cn(
                    "text-sm font-medium",
                    selectedPlatform === p.id ? "text-brand-gold" : "text-brand-ivory"
                  )}>
                    {p.label}
                  </span>
                  <p className="text-brand-taupe text-xs mt-0.5">{p.note}</p>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 uppercase tracking-wider",
                  p.type === "api"
                    ? "text-brand-success bg-brand-success/10"
                    : "text-brand-taupe bg-white/5"
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
            <label className="block text-xs uppercase tracking-[0.15em] text-brand-taupe mb-2">
              Username / Handle (optionnel)
            </label>
            <input
              type="text"
              placeholder="@votrehandle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-2 text-brand-ivory text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              onClick={handleConnect}
              disabled={saving}
              className="w-full mt-4 py-3 bg-brand-gold text-brand-black text-xs uppercase tracking-[0.15em] font-medium disabled:opacity-40"
            >
              {saving ? "Connexion..." : "Connecter"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
