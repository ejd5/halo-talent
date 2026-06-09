"use client";

import Link from "next/link";
import { Sparkles, Video, Image, Send, PenLine, Music } from "lucide-react";

type QuickAction = {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

const ACTIONS: QuickAction[] = [
  { label: "Créer un post Instagram", description: "Composer avec template", icon: Sparkles, href: "/studio/composer" },
  { label: "Générer une vidéo IA", description: "Texte → Vidéo en quelques clics", icon: Video, href: "/studio/generate/video" },
  { label: "Créer un visuel", description: "Image IA ou édition photo", icon: Image, href: "/studio/generate/image" },
  { label: "Publier partout", description: "Multi-publish en un clic", icon: Send, href: "/studio/publish" },
  { label: "Captions express", description: "3 idées en 30 secondes", icon: PenLine, href: "/studio/generate/text" },
  { label: "Musique trending", description: "Trouver le son du moment", icon: Music, href: "/studio/generate/audio" },
];

export function QuickStartGrid() {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold mb-3" style={{ color: "#F5F0EB" }}>
        Démarrer rapidement
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group relative p-4 border transition-all duration-300 hover:-translate-y-px"
              style={{
                borderColor: "rgba(245,240,235,0.06)",
                backgroundColor: "#2A2420",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(199,91,57,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,240,235,0.06)";
              }}
            >
              <div className="mb-3">
                <Icon size={24} strokeWidth={1.5} className="text-[#C75B39] transition-opacity group-hover:opacity-80" />
              </div>
              <p className="font-sans text-[0.9rem] font-medium mb-0.5" style={{ color: "#F5F0EB" }}>
                {action.label}
              </p>
              <p className="font-sans text-[0.8rem]" style={{ color: "var(--color-ink-tertiary)" }}>
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
