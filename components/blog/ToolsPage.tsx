"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/blog/data";
import { ExternalLink, Check } from "lucide-react";

export function ToolsPage() {
  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      <div className="grid grid-cols-1 gap-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="flex items-start gap-4 p-4 rounded-xl transition-all hover:translate-y-[-2px]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="text-xl shrink-0 mt-0.5">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {tool.name}
                </h3>
                {tool.free && (
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--success, #7A9A65) 10%, transparent)",
                      color: "var(--success, #7A9A65)",
                    }}
                  >
                    <Check size={8} className="inline mr-0.5" />
                    Gratuit
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {tool.description}
              </p>
            </div>
            <ExternalLink size={12} className="shrink-0 mt-1" style={{ color: "var(--text-tertiary)" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
