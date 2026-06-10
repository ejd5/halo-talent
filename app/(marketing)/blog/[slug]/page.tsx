"use client";

import { useParams } from "next/navigation";
import { ARTICLES } from "@/lib/blog/data";
import { BlogArticle } from "@/components/blog/BlogArticle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div style={{ backgroundColor: "var(--bg-primary)" }}>
        <section className="py-20 md:py-28">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
            >
              Article introuvable
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              L&apos;article que vous cherchez n&apos;existe pas ou a été déplacé.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft size={14} />
              Retour au blog
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <BlogArticle article={article} />
        </div>
      </section>
    </div>
  );
}
