"use client";

import { useState } from "react";
import {
  DollarSign, Eye, BarChart3, Target, Clock,
  TrendingUp, ExternalLink, X,
} from "lucide-react";

interface TopAd {
  brand_name: string;
  industry?: string;
  video_url?: string;
  cover_url?: string;
  likes: number;
  ctr?: number;
  cvr?: number;
  view_rate_6s?: number;
  duration?: number;
}

interface AdPattern {
  hook: string;
  format: string;
  cta: string;
  optimal_duration: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function analysePattern(ad: TopAd): AdPattern {
  // Mock pattern detection, in production would use Claude/ML
  const hooks = ["Question choc", "Révélation inattendue", "Hook visuel 3s", "Story personnelle"];
  const formats = ["POV", "Story", "Tutoriel", "Before/After", "Testimonial"];
  const ctas = ["Lien en bio", "Swipe up", "Code promo", "Call to action direct"];
  return {
    hook: hooks[Math.floor(Math.random() * hooks.length)],
    format: formats[Math.floor(Math.random() * formats.length)],
    cta: ctas[Math.floor(Math.random() * ctas.length)],
    optimal_duration: `${Math.floor(Math.random() * 15 + 10)}-${Math.floor(Math.random() * 15 + 25)}s`,
  };
}

function AdPatternModal({ ad, onClose }: { ad: TopAd; onClose: () => void }) {
  const pattern = analysePattern(ad);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-md p-5"
        style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Pattern IA, {ad.brand_name}
          </h3>
          <button onClick={onClose} className="p-1 hover:opacity-70" style={{ color: "rgba(245,240,235,0.2)" }}>
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(245,240,235,0.2)" }}>Hook détecté</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pattern.hook}</p>
          </div>
          <div className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(245,240,235,0.2)" }}>Format</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pattern.format}</p>
          </div>
          <div className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(245,240,235,0.2)" }}>CTA</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pattern.cta}</p>
          </div>
          <div className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
            <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(245,240,235,0.2)" }}>Durée optimale</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{pattern.optimal_duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdVideoCard({ ad }: { ad: TopAd }) {
  const [showPattern, setShowPattern] = useState(false);
  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className="relative overflow-hidden group transition-all"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid rgba(245,240,235,0.06)",
          aspectRatio: "9/16",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Cover */}
        {ad.cover_url ? (
          <img
            src={ad.cover_url}
            alt={ad.brand_name}
            className="w-full h-full object-cover transition-opacity"
            style={{ opacity: hovering ? 0.3 : 1 }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Eye size={24} style={{ color: "rgba(245,240,235,0.06)" }} />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity"
          style={{
            opacity: hovering ? 1 : 0,
            background: "linear-gradient(to top, rgba(26,22,20,0.95) 0%, rgba(26,22,20,0.6) 60%, transparent 100%)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {ad.brand_name}
          </p>
          {ad.industry && (
            <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
              {ad.industry}
            </p>
          )}

          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
              <span className="block font-medium" style={{ color: "rgba(245,240,235,0.5)" }}>{formatCount(ad.likes)}</span>
              Likes
            </div>
            {ad.ctr && (
              <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                <span className="block font-medium" style={{ color: "rgba(245,240,235,0.5)" }}>{ad.ctr}%</span>
                CTR
              </div>
            )}
            {ad.cvr && (
              <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                <span className="block font-medium" style={{ color: "rgba(245,240,235,0.5)" }}>{ad.cvr}%</span>
                CVR
              </div>
            )}
            {ad.view_rate_6s && (
              <div className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                <span className="block font-medium" style={{ color: "rgba(245,240,235,0.5)" }}>{ad.view_rate_6s}%</span>
                View 6s
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPattern(true)}
            className="mt-2 w-full text-[9px] font-medium py-1.5 transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            Analyser le pattern
          </button>
        </div>

        {/* Always-visible brand name */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-0"> {/* hidden when hover overlay shows */}</div>
      </div>

      {showPattern && <AdPatternModal ad={ad} onClose={() => setShowPattern(false)} />}
    </>
  );
}

interface Props {
  ads: TopAd[];
}

export function TopAdsTab({ ads }: Props) {
  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <DollarSign size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
          Aucune publicité pour cette région
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
          Essaie avec une industrie différente
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {ads.map((ad, i) => (
        <AdVideoCard key={`${ad.brand_name}-${i}`} ad={ad} />
      ))}
    </div>
  );
}
