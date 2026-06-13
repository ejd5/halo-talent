// ─── Settings Page — Halo Companion ───────────

import { useState } from "react";
import {
  ChevronLeft, User, Smartphone, Palette, Globe,
  Bell, Trash2, Download, Shield, Info, ExternalLink,
  Sun, Moon, Monitor,
} from "lucide-react";
import { useCompanionStore } from "../stores/companion-store";
import type { PlatformType } from "@/src/types/platform";
import { PLATFORM_LABELS } from "@/src/types/platform";
import type { Route, RouteState } from "../router";

type NavigateFn = (to: Route | RouteState, params?: Record<string, string>) => void;

interface Props { navigate: NavigateFn }

const LANGUAGES = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "pt", label: "Português" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
] as const;

const THEME_OPTIONS = [
  { id: "auto", label: "Auto (système)", icon: Monitor },
  { id: "light", label: "Jour", icon: Sun },
  { id: "dark", label: "Nuit", icon: Moon },
  { id: "clock", label: "Horloge", icon: ClockIcon },
] as const;

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}

const PLATFORMS: PlatformType[] = ["onlyfans", "fansly", "mym", "instagram", "tiktok"];

export function SettingsPage({ navigate }: Props) {
  const { settings, updateSettings, isConnected, userEmail } = useCompanionStore();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleLogout = () => {
    chrome.storage.local.remove("halo_auth");
    useCompanionStore.getState().setConnection(false);
    navigate("dashboard");
  };

  const handleClearCache = () => {
    chrome.storage.local.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <header className="shrink-0 px-4 py-3 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
        <button onClick={() => navigate("dashboard")} className="p-1 rounded" style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Paramètres</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Account */}
        <Section icon={User} title="Compte WTF">
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-[11px]" style={{ color: "var(--text-primary)" }}>{userEmail}</p>
              <div className="flex items-center gap-1.5" style={{ color: "var(--success)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
                <span className="text-[10px] font-medium">Connecté</span>
              </div>
              <button onClick={handleLogout}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg mt-1"
                style={{ color: "var(--danger)", backgroundColor: "rgba(239,68,68,0.08)" }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Connectez-vous pour activer les fonctionnalités
            </p>
          )}
        </Section>

        {/* Platforms */}
        <Section icon={Smartphone} title="Plateformes">
          <div className="space-y-2">
            {PLATFORMS.map((p) => (
              <div key={p} className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--text-primary)" }}>
                  {PLATFORM_LABELS[p]}
                </span>
                <Toggle
                  checked={settings.platforms[p] ?? false}
                  onChange={(v) => updateSettings({ platforms: { ...settings.platforms, [p]: v } })}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Theme */}
        <Section icon={Palette} title="Thème">
          <div className="grid grid-cols-2 gap-1.5">
            {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => updateSettings({ theme: id as typeof settings.theme })}
                className="flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: settings.theme === id ? "var(--accent-soft)" : "var(--bg-surface)",
                  color: settings.theme === id ? "var(--accent)" : "var(--text-secondary)",
                }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Language */}
        <Section icon={Globe} title="Langue">
          <div className="grid grid-cols-2 gap-1.5">
            {LANGUAGES.map(({ id, label }) => (
              <button key={id} onClick={() => updateSettings({ language: id as typeof settings.language })}
                className="flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: settings.language === id ? "var(--accent-soft)" : "var(--bg-surface)",
                  color: settings.language === id ? "var(--accent)" : "var(--text-secondary)",
                }}>
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <div className="space-y-2.5">
            <ToggleRow label="Whale en ligne" description={settings.notifications.whaleOnline ? "Activé" : "Désactivé"}
              checked={settings.notifications.whaleOnline}
              onChange={(v) => updateSettings({ notifications: { ...settings.notifications, whaleOnline: v } })} />
            <ToggleRow label="Fan à risque" description={settings.notifications.fanAtRisk ? "Activé" : "Désactivé"}
              checked={settings.notifications.fanAtRisk}
              onChange={(v) => updateSettings({ notifications: { ...settings.notifications, fanAtRisk: v } })} />
            <ToggleRow label="PPV non ouvert" description={settings.notifications.ppvUnopened ? "Activé" : "Désactivé"}
              checked={settings.notifications.ppvUnopened}
              onChange={(v) => updateSettings({ notifications: { ...settings.notifications, ppvUnopened: v } })} />
          </div>
        </Section>

        {/* Data */}
        <Section icon={Trash2} title="Données">
          <div className="space-y-2">
            <button onClick={handleClearCache}
              className="w-full flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium transition-colors"
              style={{ color: "var(--warning)", backgroundColor: "rgba(245,158,11,0.08)" }}>
              <Trash2 size={14} /> Effacer le cache local
            </button>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium"
              style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-surface)" }}>
              <Download size={14} /> Exporter mes données
            </button>
          </div>
        </Section>

        {/* Privacy */}
        <Section icon={Shield} title="Confidentialité">
          <button onClick={() => setShowPrivacy(!showPrivacy)}
            className="w-full flex items-center gap-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            <Info size={14} />
            Quelles données l'extension collecte ?
          </button>
          {showPrivacy && (
            <div className="mt-2 p-3 rounded-lg animate-slide-up" style={{ backgroundColor: "var(--bg-surface)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                WTF Companion lit uniquement les informations visibles sur les plateformes que vous utilisez,
                avec votre consentement explicite. Aucune donnée n'est partagée avec des tiers.
                Aucune action n'est effectuée automatiquement. Toutes les données sensibles sont chiffrées
                localement (AES-256-GCM) avant toute transmission.
              </p>
            </div>
          )}
        </Section>

        {/* Version */}
        <div className="text-center pb-2">
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            WTF Companion v1.0.0
          </p>
          <a href="https://docs.halotalent.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] mt-1" style={{ color: "var(--accent)" }}>
            <ExternalLink size={10} /> Support & Documentation
          </a>
        </div>

      </div>
    </div>
  );
}

// ─── Reusable Components ───────────────────────────────────

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
      <h3 className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
        <Icon size={13} style={{ color: "var(--text-tertiary)" }} />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="w-9 h-5 rounded-full relative transition-colors shrink-0"
      style={{ backgroundColor: checked ? "var(--success)" : "var(--border-strong)" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
