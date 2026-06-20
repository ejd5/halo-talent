"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { ArticleWTF } from "@/lib/marketing/journal-wtf";
import { RUBRIQUES } from "@/lib/marketing/journal-wtf";

const RUBRIQUE_COLORS: Record<string, string> = {
  maison: "var(--or, #D8A95B)",
  "image-influence": "#C96A4A",
  "atlas-ia": "#8FB58A",
  protection: "#7A8A95",
  lex: "#9B8E7A",
  departements: "#A08070",
  dossiers: "var(--or, #D8A95B)",
};

function getColor(cat: string): string {
  return RUBRIQUE_COLORS[cat] ?? "var(--or, #D8A95B)";
}

function getLabel(cat: string): string {
  return RUBRIQUES.find((r) => r.id === cat)?.label ?? cat;
}

export function JournalCard({ article, variant = "default" }: { article: ArticleWTF; variant?: "default" | "compact" | "wide" }) {
  const accent = getColor(article.category);
  const rubrique = getLabel(article.category);

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${article.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            padding: "20px 0",
            borderTop: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {rubrique}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display-alt, 'Fraunces'), serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.3,
              color: "var(--ivoire, #F4EEE3)",
              margin: "8px 0",
            }}
          >
            {article.title}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 10,
              color: "var(--pierre, #9C9183)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Clock size={10} />
            {article.readingTime} min
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "wide") {
    return (
      <Link
        href={`/blog/${article.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
            paddingBottom: 40,
            borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {rubrique}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-couture, 'Playfair Display'), serif",
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.2,
                color: "var(--ivoire, #F4EEE3)",
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              {article.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--pierre, #9C9183)",
                marginBottom: 16,
              }}
            >
              {article.excerpt}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 10,
                color: "var(--pierre, #9C9183)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={11} />
                {article.readingTime} min
              </span>
              <span style={{ color: accent, display: "flex", alignItems: "center", gap: 4 }}>
                Lire <ArrowUpRight size={11} />
              </span>
            </div>
          </div>
          <div
            style={{
              background: "var(--surface, #1C1712)",
              border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--pierre, #9C9183)",
                opacity: 0.4,
              }}
            >
              {rubrique}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* default card */
  return (
    <Link
      href={`/blog/${article.slug}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "var(--surface, #1C1712)",
          border: "1px solid var(--ligne, rgba(216,169,91,0.12))",
          padding: 28,
          height: "100%",
          transition: "border-color 0.3s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {rubrique}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-couture, 'Playfair Display'), serif",
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.25,
            color: "var(--ivoire, #F4EEE3)",
            marginTop: 12,
            marginBottom: 10,
          }}
        >
          {article.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--pierre, #9C9183)",
            marginBottom: 14,
            flex: 1,
          }}
        >
          {article.excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 10,
            color: "var(--pierre, #9C9183)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} />
            {article.readingTime} min
          </span>
          <span style={{ color: accent, display: "flex", alignItems: "center", gap: 4 }}>
            Lire <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
