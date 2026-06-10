"use client";

import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import type { Article, ArticleSection } from "@/lib/blog/types";
import { CATEGORIES } from "@/lib/blog/types";
import { TableOfContents } from "./TableOfContents";

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  guides: { bg: "color-mix(in srgb, var(--accent) 10%, transparent)", text: "var(--accent)" },
  juridique: { bg: "color-mix(in srgb, #6366f1 10%, transparent)", text: "#6366f1" },
  outils: { bg: "color-mix(in srgb, #f59e0b 10%, transparent)", text: "#f59e0b" },
  actualites: { bg: "color-mix(in srgb, #06b6d4 10%, transparent)", text: "#06b6d4" },
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SectionRenderer({ section }: { section: ArticleSection }) {
  const id = section.type === "heading" || section.type === "subheading" ? slugify(section.content) : undefined;

  switch (section.type) {
    case "heading":
      return (
        <h2
          id={id}
          className="text-xl font-bold mt-8 mb-3"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          {section.content}
        </h2>
      );
    case "subheading":
      return (
        <h3
          id={id}
          className="text-base font-semibold mt-6 mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {section.content}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {section.content}
        </p>
      );
    case "list":
      return (
        <div className="mb-4">
          {section.content && (
            <p className="text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {section.content}
            </p>
          )}
          <ul className="space-y-1">
            {section.items?.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed pl-4 relative"
                style={{ color: "var(--text-secondary)" }}
              >
                <span
                  className="absolute left-0 top-[0.6em] w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case "quote":
      return (
        <blockquote
          className="text-sm leading-relaxed italic p-4 rounded-xl mb-4 border-l-2"
          style={{
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-surface)",
            borderLeftColor: "var(--accent)",
            border: "1px solid var(--border-default)",
            borderLeftWidth: "3px",
          }}
        >
          {section.content}
        </blockquote>
      );
    case "tip":
      return (
        <div
          className="text-sm leading-relaxed p-4 rounded-xl mb-4"
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          }}
        >
          {section.content}
        </div>
      );
    default:
      return null;
  }
}

export function BlogArticle({ article }: { article: Article }) {
  const catLabel = CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category;
  const colors = CAT_COLORS[article.category] ?? CAT_COLORS.guides;

  return (
    <article className="mx-auto" style={{ maxWidth: "720px" }}>
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-[11px] font-medium mb-6 transition-colors"
        style={{ color: "var(--text-tertiary)" }}
      >
        <ArrowLeft size={12} />
        Retour au blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {catLabel}
          </span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold leading-snug mb-4"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          {article.title}
        </h1>

        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          {article.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          <span className="flex items-center gap-1">
            <User size={11} />
            {article.author}
          </span>
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {article.readingTime} min de lecture
          </span>
        </div>
      </header>

      {/* TOC */}
      <TableOfContents content={article.content} />

      {/* Content */}
      <div className="mb-12">
        {article.content.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>

      {/* CTA */}
      {article.cta && (
        <div
          className="p-6 rounded-xl text-center mb-12"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
          >
            {article.cta.title}
          </h3>
          <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            {article.cta.description}
          </p>
          <Link
            href={article.cta.buttonHref}
            className="inline-block px-6 py-2.5 text-sm font-semibold rounded-xl transition-all"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
          >
            {article.cta.buttonLabel}
          </Link>
        </div>
      )}
    </article>
  );
}
