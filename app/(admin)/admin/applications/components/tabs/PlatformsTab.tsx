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
    <div className="space-y-3 card-accent" style={{ background: "#0A0908" }}>
      {app.platforms.map((platform) => (
        <div
          key={platform}
          className="p-4 transition-colors hover:bg-white/[0.02]"
          style={{ border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-sans font-semibold" style={{ color: "#F5F0EB" }}>
              {platform}
            </h4>
            {app.social_links?.[platform] && (
              <a
                href={app.social_links[platform]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-sans transition-colors hover:opacity-70"
                style={{ color: "#C75B39" }}
              >
                Voir le profil <ExternalLink size={10} strokeWidth={1.5} />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#E0D8D0" }}>
                Username
              </p>
              <p className="text-xs font-sans mt-0.5" style={{ color: "#D0CCC6" }}>
                @{app.full_name.toLowerCase().replace(/\s/, ".")}.{platform.toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#E0D8D0" }}>
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
                  <CheckCircle size={11} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
                  <span className="text-[10px] font-sans" style={{ color: "#7A9A65" }}>
                    Vérifié
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={11} strokeWidth={1.5} style={{ color: "#E0D8D0" }} />
                  <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                    Non vérifié
                  </span>
                </>
              )}
            </div>
            <button
              className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ color: "#C75B39", border: "1px solid rgba(199,91,57,0.3)" }}
            >
              Vérifier
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
