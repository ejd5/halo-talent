"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Music2, Video, MessageCircle, Briefcase, Lock,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, Link2, Unlink,
  ExternalLink, Loader, ChevronRight, Copy,
} from "lucide-react";
import type { PlatformType, PlatformConnection } from "@/lib/studio/types";
import { OAUTH_PROVIDERS } from "@/lib/studio/types";
import type { OAuthProvider } from "@/lib/studio/types";
import { getConnectionStatus } from "@/lib/studio/oauth";

const ICON_MAP: Record<string, React.ElementType> = {
  Camera, Music2, Video, MessageCircle, Briefcase, Lock,
};

function useConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/oauth/connections");
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setConnections(data.connections || []);
      setError(null);
    } catch {
      setError("Impossible de charger les connexions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  return { connections, loading, error, refetch: fetchConnections };
}

function PlatformCard({
  provider,
  connection,
  onConnect,
  onDisconnect,
  connecting,
}: {
  provider: OAuthProvider;
  connection: PlatformConnection | undefined;
  onConnect: (type: PlatformType) => void;
  onDisconnect: (type: PlatformType) => void;
  connecting: PlatformType | null;
}) {
  const Icon = ICON_MAP[provider.icon] || MessageCircle;
  const status = getConnectionStatus(connection);

  return (
    <div
      className="flex items-center gap-3 p-3 transition-all hover:opacity-90"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center shrink-0 rounded-sm"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <Icon size={18} style={{ color: connection ? "var(--accent)" : "rgba(255,255,255,0.2)" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>{provider.label}</span>
          {connection && connection.status === "active" && (
            <span className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(34,197,94,0.1)", color: "var(--success)" }}>
              {connection.platform_username || "Connecté"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Status dot + label */}
          <span className="flex items-center gap-1 text-[10px]" style={{ color: status.color }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: status.color }} />
            {status.label}
          </span>
          {connection && connection.status === "active" && (
            <>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {connection.platform_followers > 0 && `${connection.platform_followers.toLocaleString()} abonnés`}
              </span>
              {connection.last_sync_at && (
                <>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Sync: {new Date(connection.last_sync_at).toLocaleDateString()}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action button */}
      {provider.authType === "manual" ? (
        <a
          href={provider.docs || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors hover:opacity-80 rounded-sm shrink-0"
          style={{ border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.4)" }}
        >
          <ExternalLink size={10} />
          Manuel
        </a>
      ) : provider.authType === "api_key" ? (
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors rounded-sm shrink-0"
          style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
        >
          <Link2 size={10} />
          Configurer
        </button>
      ) : connection ? (
        <div className="flex items-center gap-1 shrink-0">
          {connection.status === "expired" || connection.status === "error" ? (
            <button
              onClick={() => onConnect(provider.type)}
              disabled={connecting === provider.type}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors rounded-sm"
              style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
            >
              {connecting === provider.type ? <Loader size={10} className="animate-spin" /> : <RefreshCw size={10} />}
              Reconnecter
            </button>
          ) : (
            <button
              onClick={() => onDisconnect(provider.type)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors rounded-sm"
              style={{ border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}
            >
              <Unlink size={10} />
              Déconnecter
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onConnect(provider.type)}
          disabled={connecting === provider.type}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] transition-colors rounded-sm shrink-0"
          style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
        >
          {connecting === provider.type ? (
            <Loader size={10} className="animate-spin" />
          ) : (
            <Link2 size={10} />
          )}
          Connecter
        </button>
      )}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 text-xs mb-4 rounded-sm animate-fade-in"
      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--success)" }}
    >
      <CheckCircle size={14} />
      {message}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 text-xs mb-4 rounded-sm animate-fade-in"
      style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}
    >
      <AlertTriangle size={14} />
      {message}
    </div>
  );
}

export default function PlatformsPage() {
  const router = useRouter();
  const { connections, loading, error, refetch } = useConnections();
  const [connecting, setConnecting] = useState<PlatformType | null>(null);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Read URL params for success/error notifications
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const errorParam = params.get("error");
    const platform = params.get("platform");

    if (success && platform) {
      setNotif({ type: "success", message: `${getPlatformLabel(platform)} connecté avec succès !` });
    } else if (errorParam) {
      const messages: Record<string, string> = {
        access_denied: "Connexion annulée",
        invalid_state: "Erreur de sécurité — réessaie",
        server_error: "Erreur serveur — réessaie",
        missing_params: "Paramètres manquants",
        db_error: "Erreur de sauvegarde",
      };
      setNotif({ type: "error", message: messages[errorParam] || `Erreur: ${errorParam}` });
    }

    // Clean URL
    if (success || errorParam) {
      router.replace("/studio/platforms", { scroll: false });
    }
  }, [router]);

  const handleConnect = async (platform: PlatformType) => {
    setConnecting(platform);
    try {
      const res = await fetch(`/api/oauth/${platform}/init`, { method: "POST" });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setNotif({ type: "error", message: "Erreur d'init OAuth" });
        setConnecting(null);
      }
    } catch {
      setNotif({ type: "error", message: "Erreur réseau" });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: PlatformType) => {
    try {
      const res = await fetch(`/api/oauth/${platform}/disconnect`, { method: "POST" });
      if (res.ok) {
        setNotif({ type: "success", message: `${getPlatformLabel(platform)} déconnecté` });
        refetch();
      }
    } catch {
      setNotif({ type: "error", message: "Erreur lors de la déconnexion" });
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl italic mb-1" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>
          Comptes connectés
        </h1>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Connecte tes plateformes sociales pour publier directement depuis le Studio.
          Les tokens sont chiffrés de bout en bout.
        </p>
      </div>

      {/* Notifications */}
      {notif && (
        notif.type === "success" ? (
          <SuccessBanner message={notif.message} />
        ) : (
          <ErrorBanner message={notif.message} />
        )
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.3)" }} />
        </div>
      ) : error ? (
        <ErrorBanner message={error} />
      ) : (
        /* Platform cards */
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: "1px solid var(--border-default)" }}
        >
          {/* OAuth platforms */}
          {OAUTH_PROVIDERS.filter((p) => p.authType === "oauth").map((provider) => (
            <PlatformCard
              key={provider.type}
              provider={provider}
              connection={connections.find((c) => c.platform === provider.type)}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connecting={connecting}
            />
          ))}

          {/* Divider for manual platforms */}
          <div
            className="px-3 py-2 text-[10px] uppercase tracking-wider"
            style={{ background: "var(--bg-card)", color: "rgba(255,255,255,0.2)", borderBottom: "1px solid var(--border-default)" }}
          >
            Accès manuel — Pas d'API publique
          </div>

          {/* Manual platforms (OF, MYM) */}
          {OAUTH_PROVIDERS.filter((p) => p.authType === "manual" || p.authType === "api_key").map((provider) => (
            <PlatformCard
              key={provider.type}
              provider={provider}
              connection={connections.find((c) => c.platform === provider.type)}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connecting={connecting}
            />
          ))}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-6 text-[10px] leading-relaxed space-y-1" style={{ color: "rgba(255,255,255,0.2)" }}>
        <p>Pour OnlyFans, MYM et Fansly : pas d'API publique disponible. Le Studio prépare le contenu et le copie dans le presse-papier pour publication manuelle.</p>
        <p>Les tokens sont chiffrés en AES-256-GCM et stockés de manière sécurisée. Tu peux révoquer une connexion à tout moment.</p>
      </div>
    </div>
  );
}

function getPlatformLabel(platform: string): string {
  return OAUTH_PROVIDERS.find((p) => p.type === platform)?.label || platform;
}
