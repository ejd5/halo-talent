"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CATEGORIES, type Article } from "@/lib/blog/types";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  guides: { bg: "color-mix(in srgb, var(--accent) 10%, transparent)", text: "var(--accent)" },
  juridique: { bg: "color-mix(in srgb, #6366f1 10%, transparent)", text: "#6366f1" },
  outils: { bg: "color-mix(in srgb, #f59e0b 10%, transparent)", text: "#f59e0b" },
  actualites: { bg: "color-mix(in srgb, #06b6d4 10%, transparent)", text: "#06b6d4" },
};

export function BlogCard({ article }: { article: Article }) {
  const catLabel = CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category;
  const colors = CAT_COLORS[article.category] ?? CAT_COLORS.guides;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block p-5 rounded-xl transition-all hover:translate-y-[-2px]"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {catLabel}
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          {article.date}
        </span>
      </div>

      <h3
        className="text-base font-bold leading-snug mb-1.5"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      >
        {article.title}
      </h3>

      <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
        {article.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          <Clock size={10} className="inline mr-1" />
          {article.readingTime} min
        </span>
        <span className="text-[10px] font-medium flex items-center gap-0.5" style={{ color: "var(--accent)" }}>
          Lire <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
}
