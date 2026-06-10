"use client";

import { BlogList } from "@/components/blog/BlogList";

export default function BlogPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] mb-4 px-3 py-1 rounded-full"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              Blog
            </span>
            <h1
              className="text-[2.5rem] md:text-[4rem] font-bold tracking-[-0.02em] leading-[1.05]"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
            Guides, juridique et actualités
            </h1>
            <p className="text-base md:text-lg mt-4" style={{ color: "var(--text-secondary)" }}>
              Tout savoir sur la gestion de votre activité OFM : conseils juridiques, guides pratiques, outils et actualités des plateformes.
            </p>
          </div>

          {/* Blog list with filters */}
          <BlogList />
        </div>
      </section>
    </div>
  );
}
