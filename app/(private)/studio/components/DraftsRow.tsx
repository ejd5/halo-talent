"use client";

import Link from "next/link";
import { Image, FileText, Video } from "lucide-react";

type Draft = {
  id: string;
  title: string;
  type: "image" | "text" | "video";
  platform: string;
  updatedAt: string;
  href: string;
};

const DRAFTS: Draft[] = [
  { id: "1", title: "Post Instagram — Nouveau produit", type: "image", platform: "Instagram", updatedAt: "Il y a 2h", href: "/studio/composer" },
  { id: "2", title: "Script YouTube — Review matos", type: "text", platform: "YouTube", updatedAt: "Il y a 5h", href: "/studio/generate/text" },
  { id: "3", title: "TikTok — Challenge tendance", type: "video", platform: "TikTok", updatedAt: "Hier", href: "/studio/edit/video" },
  { id: "4", title: "Newsletter — Édition juin", type: "text", platform: "Email", updatedAt: "Hier", href: "/studio/composer" },
  { id: "5", title: "Reel — Coulisses shooting", type: "video", platform: "Instagram", updatedAt: "Il y a 3j", href: "/studio/edit/video" },
  { id: "6", title: "Story — Sondage engagement", type: "image", platform: "Instagram", updatedAt: "Il y a 4j", href: "/studio/composer" },
];

const TYPE_ICONS = {
  image: Image,
  text: FileText,
  video: Video,
};

export function DraftsRow() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
          Mes derniers brouillons
        </h2>
        <Link href="/studio/history" className="text-[11px] hover:opacity-70 transition-opacity" style={{ color: "#C75B39" }}>
          Voir tout
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
        {DRAFTS.map((draft) => {
          const Icon = TYPE_ICONS[draft.type];
          return (
            <Link
              key={draft.id}
              href={draft.href}
              className="group shrink-0 w-48 p-3 border transition-all duration-200 hover:translate-y-[-2px]"
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0A0908" }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center mb-2"
                style={{ background: "rgba(199,91,57,0.1)" }}
              >
                <Icon size={14} style={{ color: "#C75B39" }} />
              </div>
              <p className="text-xs font-medium leading-snug mb-2 line-clamp-2" style={{ color: "#F5F0EB" }}>
                {draft.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-1 py-px" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                  {draft.platform}
                </span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {draft.updatedAt}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
