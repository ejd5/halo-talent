"use client";

import type { Creator } from "../../../types";
import { relativeTime } from "../../../utils";
import { CheckCircle, XCircle, RefreshCw, Plus, ExternalLink, Clock } from "lucide-react";

type Props = { creator: Creator };

export function PlatformsTab({ creator }: Props) {
  return (
    <div className="space-y-4 card-accent" style={{ background: "var(--bg-primary)" }}>
      {creator.platforms.map((platform) => (
        <div
          key={platform.name}
          className="p-5 transition-colors hover:bg-white/[0.02]"
          style={{ border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {platform.name}
              </h3>
              {platform.verified ? (
                <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: "var(--success)" }}>
                  <CheckCircle size={10} strokeWidth={1.5} /> Vérifié
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>
                  <XCircle size={10} strokeWidth={1.5} /> Non vérifié
                </span>
              )}
            </div>
            <a
              href={creator.social_links[platform.name] ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-sans transition-colors hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Voir le profil <ExternalLink size={10} strokeWidth={1.5} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>Username</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: "#D0CCC6" }}>{platform.username}</p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>Abonnés</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: "#D0CCC6" }}>
                {new Intl.NumberFormat("fr-FR").format(platform.followers)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>Dernière sync</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: platform.last_sync ? "#D0CCC6" : "var(--text-secondary)" }}>
                {platform.last_sync ? (
                  <span className="flex items-center gap-1">
                    <Clock size={11} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
                    {relativeTime(platform.last_sync)}
                  </span>
                ) : "Jamais"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={!platform.api_connected}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5 disabled:opacity-30"
              style={{ color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              <RefreshCw size={12} strokeWidth={1.5} />
              Sync manuelle
            </button>
            <span
              className="text-[10px] font-sans"
              style={{ color: platform.api_connected ? "var(--success)" : "var(--danger)" }}
            >
              API : {platform.api_connected ? "Connectée" : "Déconnectée"}
            </span>
          </div>
        </div>
      ))}

      <button
        className="flex items-center gap-2 w-full justify-center py-3 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
        style={{ color: "var(--text-primary)", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <Plus size={14} strokeWidth={1.5} />
        Connecter une nouvelle plateforme
      </button>
    </div>
  );
}
