"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

type Inspiration = {
  title: string;
  description: string;
  platform: string;
  href: string;
};

const INSPIRATIONS: Inspiration[] = [
  {
    title: "Tendance : Les coulisses authentiques",
    description: "Le contenu behind-the-scenes génère 2.3× plus d'engagement en ce moment. Proposez un before/after de votre setup.",
    platform: "Instagram",
    href: "/studio/composer",
  },
  {
    title: "Format court : TikTok/Reels",
    description: "Les vidéos < 30s avec un hook fort dans les 3 premières secondes performent le mieux cette semaine.",
    platform: "TikTok",
    href: "/studio/generate/video",
  },
  {
    title: "Série éducative : 3 posts",
    description: "Une mini-série de 3 posts qui se répondent. Thème : 'Une journée dans ma vie de créateur'.",
    platform: "Instagram",
    href: "/studio/composer",
  },
  {
    title: "Contenu nostalgique",
    description: "Le 'glow up' ou le 'alors vs maintenant' cartonne. Sortez vos archives !",
    platform: "YouTube",
    href: "/studio/edit/photo",
  },
  {
    title: "Collaboration croisée",
    description: "Invitez un créateur d'une niche complémentaire pour un live ou un duel. L'algo adore.",
    platform: "TikTok",
    href: "/studio/publish",
  },
];

export function InspirationFeed() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={14} style={{ color: "var(--accent)" }} />
        <h2 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Inspirations du jour
        </h2>
        <span className="font-sans text-[9px] px-1.5 py-0.5" style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}>
          Trend Spotter
        </span>
      </div>
      <div>
        {INSPIRATIONS.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group flex items-start gap-4 py-3 transition-colors hover:opacity-80"
            style={{
              borderBottom: i < INSPIRATIONS.length - 1 ? "1px solid rgba(245,240,235,0.04)" : "none",
            }}
          >
            <span
              className="font-display font-bold text-sm leading-none mt-0.5 min-w-[20px]"
              style={{ color: "var(--accent)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-sans text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </p>
                <span className="font-sans text-[9px] px-1.5 py-px shrink-0" style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--color-ink-tertiary)" }}>
                  {item.platform}
                </span>
              </div>
              <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                {item.description}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--accent)" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
