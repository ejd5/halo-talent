"use client";

import { ARTICLES } from "@/lib/blog/data";
import { BlogCard } from "./BlogCard";

export function GuidesPage() {
  const guides = ARTICLES.filter((a) => a.category === "guides");

  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      {guides.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {guides.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-center py-12" style={{ color: "var(--text-tertiary)" }}>
          Aucun guide pour le moment.
        </p>
      )}
    </div>
  );
}
