import type { Metadata } from "next";
import { ARTICLES } from "@/lib/blog/data";
import { BlogArticle } from "@/components/blog/BlogArticle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return { title: "Article introuvable, Where Talent Forms" };
  }
  return {
    title: `${article.title}, Where Talent Forms`,
    description: article.description,
    openGraph: {
      title: `${article.title}, Where Talent Forms`,
      description: article.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
              L'article que vous cherchez n'existe pas ou a été déplacé.
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
