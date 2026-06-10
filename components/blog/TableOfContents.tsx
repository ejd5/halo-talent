"use client";

import type { ArticleSection } from "@/lib/blog/types";

export function TableOfContents({ content }: { content: ArticleSection[] }) {
  const headings = content.filter(
    (s): s is ArticleSection & { type: "heading" | "subheading" } =>
      s.type === "heading" || s.type === "subheading"
  );

  if (headings.length < 2) return null;

  return (
    <nav
      className="p-4 rounded-xl mb-8 text-sm"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--text-tertiary)" }}>
        Sommaire
      </p>
      <ul className="space-y-1">
        {headings.map((h, i) => {
          const id = h.content.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
            <li key={i}>
              <a
                href={`#${id}`}
                className="block text-[11px] py-0.5 transition-colors hover:opacity-100"
                style={{
                  color: "var(--text-secondary)",
                  opacity: 0.8,
                  paddingLeft: h.type === "subheading" ? "1rem" : "0",
                }}
              >
                {h.content}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
