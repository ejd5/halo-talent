"use client";

import type { Application } from "../../types";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

type Props = { application: Application };

const platformFollowers: Record<string, string> = {
  YouTube: "12 500",
  Instagram: "8 200",
  TikTok: "15 000",
  OnlyFans: "2 300",
  Twitter: "4 100",
  LinkedIn: "3 800",
};

const platformVerified: Record<string, boolean> = {
  YouTube: true,
  Instagram: true,
  TikTok: false,
  OnlyFans: true,
  Twitter: false,
  LinkedIn: false,
};

export function PlatformsTab({ application }: Props) {
  const app = application;
  return (
    <div className="space-y-3 card-accent" style={{ background: "var(--bg-primary)" }}>
      {app.platforms.map((platform) => (
        <div
          key={platform}
          className="p-4 transition-colors hover:bg-white/[0.02]"
          style={{ border: "1px solid var(--border-default)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-sans font-semibold" style={{ color: "var(--text-primary)" }}>
              {platform}
            </h4>
            {app.social_links?.[platform] && (
              <a
                href={app.social_links[platform]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-sans transition-colors hover:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                Voir le profil <ExternalLink size={10} strokeWidth={1.5} />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
                Username
              </p>
              <p className="text-xs font-sans mt-0.5" style={{ color: "#D0CCC6" }}>
                @{app.full_name.toLowerCase().replace(/\s/, ".")}.{platform.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
                Abonnés estimés
              </p>
              <p className="text-xs font-sans mt-0.5" style={{ color: "#D0CCC6" }}>
                {platformFollowers[platform] ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {platformVerified[platform] ? (
                <>
                  <CheckCircle size={11} strokeWidth={1.5} style={{ color: "var(--success)" }} />
                  <span className="text-[10px] font-sans" style={{ color: "var(--success)" }}>
                    Vérifié
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={11} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-[10px] font-sans" style={{ color: "var(--text-secondary)" }}>
                    Non vérifié
                  </span>
                </>
              )}
            </div>
            <button
              className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              Vérifier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
