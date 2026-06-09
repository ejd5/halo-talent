"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, PlaySquare, MessageCircle, Globe, Bell, BookmarkCheck, Music2,
} from "lucide-react";

const tabs = [
  { label: "Vue d'ensemble", href: "/dashboard/trends", icon: LayoutDashboard },
  { label: "Google Trends", href: "/dashboard/trends/google", icon: Globe },
  { label: "YouTube", href: "/dashboard/trends/youtube", icon: PlaySquare },
  { label: "TikTok Creative", href: "/dashboard/trends/tiktok", icon: Music2 },
  { label: "Ma watchlist", href: "/dashboard/trends/watchlist", icon: BookmarkCheck },
  { label: "Alertes", href: "/dashboard/trends/alerts", icon: Bell },
];

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-thin" style={{ borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        {tabs.map((tab) => {
          const active = tab.href === "/dashboard/trends"
            ? pathname === "/dashboard/trends"
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px"
              style={{
                color: active ? "#C75B39" : "rgba(245,240,235,0.3)",
                borderBottomColor: active ? "#C75B39" : "transparent",
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
