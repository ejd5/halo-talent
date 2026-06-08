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
    <div className="space-y-6">
      {/* Personal info */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#7A736B" }}>
          Informations personnelles
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={13} strokeWidth={1.5} style={{ color: "#5A544C" }} />
            <span className="text-sm font-sans" style={{ color: "#D0CCC6" }}>
              {countryFlags[app.country ?? ""] ?? "🌍"} {app.country ?? "Non renseigné"}
            </span>
          </div>
          {app.age && (
            <div className="flex items-center gap-2">
              <Calendar size={13} strokeWidth={1.5} style={{ color: "#5A544C" }} />
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
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#7A736B" }}>
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
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2">
                  <LinkIcon size={12} strokeWidth={1.5} style={{ color: "#5A544C" }} />
                  <span className="text-xs font-sans font-medium" style={{ color: "#D0CCC6" }}>
                    {platform}
                  </span>
                </div>
                <ExternalLink
                  size={12}
                  strokeWidth={1.5}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#C75B39" }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Department info */}
      <div>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#7A736B" }}>
          Département souhaité
        </p>
        <span
          className="text-xs font-sans font-medium px-2.5 py-1.5"
          style={{ background: "rgba(199,91,57,0.08)", color: "#C75B39" }}
        >
          {app.department}
        </span>
      </div>
    </div>
  );
}
