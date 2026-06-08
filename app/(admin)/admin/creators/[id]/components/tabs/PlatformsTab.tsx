"use client";

import type { Creator } from "../../../types";
import { relativeTime } from "../../../utils";
import { CheckCircle, XCircle, RefreshCw, Plus, ExternalLink, Clock } from "lucide-react";

type Props = { creator: Creator };

export function PlatformsTab({ creator }: Props) {
  return (
    <div className="space-y-4">
      {creator.platforms.map((platform) => (
        <div
          key={platform.name}
          className="p-5 transition-colors hover:bg-white/[0.02]"
          style={{ border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
                {platform.name}
              </h3>
              {platform.verified ? (
                <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: "#7A9A65" }}>
                  <CheckCircle size={10} strokeWidth={1.5} /> Vérifié
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: "#9A9590" }}>
                  <XCircle size={10} strokeWidth={1.5} /> Non vérifié
                </span>
              )}
            </div>
            <a
              href={creator.social_links[platform.name] ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-sans transition-colors hover:opacity-70"
              style={{ color: "#C75B39" }}
            >
              Voir le profil <ExternalLink size={10} strokeWidth={1.5} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#5A544C" }}>Username</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: "#D0CCC6" }}>{platform.username}</p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#5A544C" }}>Abonnés</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: "#D0CCC6" }}>
                {new Intl.NumberFormat("fr-FR").format(platform.followers)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#5A544C" }}>Dernière sync</p>
              <p className="text-sm font-sans font-medium mt-0.5" style={{ color: platform.last_sync ? "#D0CCC6" : "#5A544C" }}>
                {platform.last_sync ? (
                  <span className="flex items-center gap-1">
                    <Clock size={11} strokeWidth={1.5} style={{ color: "#5A544C" }} />
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
              style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
            >
              <RefreshCw size={12} strokeWidth={1.5} />
              Sync manuelle
            </button>
            <span
              className="text-[10px] font-sans"
              style={{ color: platform.api_connected ? "#7A9A65" : "#C44536" }}
            >
              API : {platform.api_connected ? "Connectée" : "Déconnectée"}
            </span>
          </div>
        </div>
      ))}

      <button
        className="flex items-center gap-2 w-full justify-center py-3 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
        style={{ color: "#7A736B", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <Plus size={14} strokeWidth={1.5} />
        Connecter une nouvelle plateforme
      </button>
    </div>
  );
}
