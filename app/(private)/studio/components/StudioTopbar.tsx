"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Bell, ChevronDown, Camera, Video, Music2, MessageCircle, Globe } from "lucide-react";
import type { WalletBalance } from "@/lib/studio/types";

const PLATFORMS = [
  { id: "all", label: "Toutes les plateformes", icon: Globe },
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "tiktok", label: "TikTok", icon: Music2 },
  { id: "twitter", label: "Twitter / X", icon: MessageCircle },
];

export function StudioTopbar() {
  const pathname = usePathname();
  const [platformOpen, setPlatformOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [creditsData, setCreditsData] = useState<WalletBalance | null>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    fetch("/api/studio/credits")
      .then((r) => r.json())
      .then((d) => {
        if (d.tier?.name) setCreditsData(d);
      })
      .catch(() => {});
  }, []);

  const used = creditsData?.monthly_quota && creditsData?.monthly_quota > 0
    ? Math.max(0, creditsData.monthly_quota - (creditsData?.balance ?? 0))
    : 0;
  const total = creditsData?.is_unlimited ? 999999 : (creditsData?.monthly_quota ?? 5000);
  const creditsPct = creditsData?.is_unlimited || total === 0 ? 0 : Math.min(100, Math.round((used / total) * 100));

  return (
    <header
      className="flex items-center gap-3 px-4 md:px-6 shrink-0"
      style={{
        height: 56,
        background: "transparent",
        borderBottom: "1px solid rgba(245,240,235,0.04)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs flex-1 min-w-0">
        <Link href="/studio" className="transition-colors hover:text-[#F5F0EB]" style={{ color: "var(--color-ink-tertiary)" }}>
          Studio
        </Link>
        {pathname !== "/studio" && (
          <>
            <span style={{ color: "var(--color-ink-tertiary)" }}>›</span>
            <span className="truncate" style={{ color: "#C75B39" }}>
              {pathname.replace("/studio/", "").replace(/\//g, " · ")}
            </span>
          </>
        )}
      </div>

      {/* Platform selector */}
      <div className="relative" ref={platformRef}>
        <button
          onClick={() => setPlatformOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors"
          style={{
            color: "var(--color-ink-secondary)",
            border: "1px solid rgba(245,240,235,0.08)",
          }}
        >
          <selectedPlatform.icon size={12} />
          <span className="hidden sm:inline">{selectedPlatform.label}</span>
          <ChevronDown size={10} className={platformOpen ? "rotate-180" : ""} style={{ transition: "transform 0.2s" }} />
        </button>

        {platformOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 py-1 shadow-xl z-50" style={{ background: "#2A2420", border: "1px solid rgba(245,240,235,0.08)" }}>
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const isSelected = p.id === selectedPlatform.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p); setPlatformOpen(false); }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs transition-colors"
                  style={{
                    color: isSelected ? "#C75B39" : "var(--color-ink-secondary)",
                    background: isSelected ? "rgba(199,91,57,0.08)" : "transparent",
                  }}
                >
                  <Icon size={12} />
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* AI notification */}
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors"
        style={{
          color: "#C75B39",
          border: "1px solid rgba(199,91,57,0.15)",
        }}
      >
        <Sparkles size={12} />
        <span className="hidden sm:inline">Idées du jour</span>
      </button>

      {/* Credits badge */}
      <Link
        href="/studio/credits"
        className="flex items-center gap-1.5 text-[12px] transition-colors hover:opacity-70"
        style={{ color: "#C75B39" }}
      >
        <span>✦</span>
        <span className="hidden sm:inline tabular-nums">{creditsData?.is_unlimited ? "∞" : creditsData?.balance?.toLocaleString("fr-FR") || "..."}</span>
      </Link>

      {/* Notification bell */}
      <button className="relative p-1.5 transition-colors" style={{ color: "var(--color-ink-tertiary)" }}>
        <Bell size={16} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5" style={{ background: "#C75B39" }} />
      </button>
    </header>
  );
}
