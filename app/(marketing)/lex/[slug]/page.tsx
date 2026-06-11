import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";
import { SourceTag } from "@/components/legal/SourceTag";

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  platform: string | null;
  category: string;
  jurisdiction: string | null;
  source_name: string | null;
  source_url: string | null;
  tags: string[] | null;
  last_verified_at: string | null;
  updated_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getArticles(): Promise<KnowledgeArticle[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_knowledge")
      .select("id, title, content, summary, platform, category, jurisdiction, source_name, source_url, tags, last_verified_at, updated_at")
      .eq("is_active", true)
      .order("title", { ascending: true });

    return (data || []) as KnowledgeArticle[];
  } catch {
    return [];
  }
}

export default async function LexArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => slugify(a.title) === slug);

  if (!article) {
    notFound();
  }

  const formattedDate = article.last_verified_at || article.updated_at;

  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/lex"
          className="inline-flex items-center gap-1 text-xs font-medium mb-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ArrowRight size={12} className="rotate-180" />
          Retour au hub juridique
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-semibold px-2 py-0.5"
            style={{
              backgroundColor: "var(--color-accent-soft)",
              color: "var(--color-accent)",
            }}
          >
            {article.category.replace(/_/g, " ")}
          </span>
          {article.platform && (
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {article.platform}
            </span>
          )}
          {article.jurisdiction && (
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {article.jurisdiction}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            {article.summary}
          </p>
        )}

        <div className="flex items-center gap-3">
          {formattedDate && <FreshnessBadge date={formattedDate} />}
          {article.source_name && article.source_url && (
            <SourceTag sources={[{ label: article.source_name, url: article.source_url }]} />
          )}
        </div>
      </div>

      <div className="mb-8">
        <LegalDisclaimer variant="short" />
      </div>

      {/* Content */}
      <div
        className="p-6 mb-8 text-sm leading-relaxed whitespace-pre-wrap"
        style={{
          border: "1px solid var(--border-default)",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-secondary)",
        }}
      >
        {article.content}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5"
              style={{
                backgroundColor: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              {tag.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mb-8">
        <Link
          href="/protection"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Analyser mon contrat
          <ArrowRight size={18} />
        </Link>
      </div>

      <LegalDisclaimer variant="agency" />
    </div>
  );
}
