"use client";

import { useState } from "react";
import { ARTICLES } from "@/lib/blog/data";
import { CATEGORIES } from "@/lib/blog/types";
import { BlogCard } from "./BlogCard";

export function BlogList() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? ARTICLES.filter((a) => a.category === activeCategory)
    : ARTICLES;

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
          style={{
            backgroundColor: activeCategory === null ? "var(--accent)" : "var(--bg-card)",
            color: activeCategory === null ? "var(--accent-text, #fff)" : "var(--text-secondary)",
            border: activeCategory === null ? "none" : "1px solid var(--border-default)",
          }}
        >
          Tout
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: activeCategory === cat.id ? "var(--accent)" : "var(--bg-card)",
              color: activeCategory === cat.id ? "var(--accent-text, #fff)" : "var(--text-secondary)",
              border: activeCategory === cat.id ? "none" : "1px solid var(--border-default)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-center py-12" style={{ color: "var(--text-tertiary)" }}>
          Aucun article dans cette catégorie.
        </p>
      )}
    </div>
  );
}
