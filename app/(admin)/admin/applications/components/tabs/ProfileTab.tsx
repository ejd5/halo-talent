"use client";

import type { Application } from "../../types";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

type Props = { application: Application };

const countryFlags: Record<string, string> = {
  FR: "🇫🇷",
  BE: "🇧🇪",
};

export function ProfileTab({ application }: Props) {
  const app = application;
  return (
    <div className="space-y-6 card-accent">
      {/* Personal info */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-primary)" }}>
          Informations personnelles
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={13} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
            <span className="text-sm font-sans" style={{ color: "#D0CCC6" }}>
              {countryFlags[app.country ?? ""] ?? "🌍"} {app.country ?? "Non renseigné"}
            </span>
          </div>
          {app.age && (
            <div className="flex items-center gap-2">
              <Calendar size={13} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
              <span className="text-sm font-sans" style={{ color: "#D0CCC6" }}>
                {app.age} ans
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Social links */}
      {app.social_links && Object.keys(app.social_links).length > 0 && (
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-primary)" }}>
            Réseaux sociaux
          </p>
          <div className="space-y-2">
            {Object.entries(app.social_links).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group px-3 py-2 transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center gap-2">
                  <LinkIcon size={12} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>
                    {platform}
                  </span>
                </div>
                <ExternalLink
                  size={12}
                  strokeWidth={1.5}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--accent)" }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Department info */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-primary)" }}>
          Département souhaité
        </p>
        <span
          className="text-xs font-sans font-medium px-2.5 py-1.5"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {app.department}
        </span>
      </div>
    </div>
  );
}
