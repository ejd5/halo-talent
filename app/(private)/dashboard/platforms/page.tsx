"use client";
import { Camera, Video, Music2, Globe } from "lucide-react";
import type { ElementType } from "react";

const platforms: { name: string; handle: string; followers: string; color: string; icon: ElementType }[] = [
  { name: "Instagram", handle: "@jean.dupont", followers: "14.2K", color: "#E4405F", icon: Camera },
  { name: "YouTube", handle: "Jean Dupont", followers: "8.1K", color: "#FF0000", icon: Video },
  { name: "TikTok", handle: "@jeandupont", followers: "5.3K", color: "#000000", icon: Music2 },
  { name: "OnlyFans", handle: "jeandupont", followers: "890", color: "#00AFF0", icon: Globe },
  { name: "Twitter", handle: "@jean_dpt", followers: "1.8K", color: "#1DA1F2", icon: Globe },
];

export default function PlatformsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes plateformes</h1>
        <p className="text-base mt-1" style={{ color: "var(--text-primary)" }}>Gérez vos comptes connectés</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="p-5 border border-[var(--color-border)] flex items-center gap-5" style={{ backgroundColor: "var(--color-card)" }}>
              <div className="p-2.5 border" style={{ borderColor: p.color, color: p.color }}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-base" style={{ color: "var(--text-primary)" }}>{p.handle}</div>
              </div>
              <div className="text-right">
                <div className="text-base">{p.followers}</div>
                <div className="text-sm" style={{ color: "var(--text-primary)" }}>followers</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
