"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock, BookOpen } from "lucide-react";
import type { ArticleWTF, ArticleSectionWTF } from "@/lib/marketing/journal-wtf";
import { RUBRIQUES } from "@/lib/marketing/journal-wtf";
import { ARTICLES_WTF } from "@/lib/marketing/journal-articles";

/* ─── Helpers ─── */

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const RUBRIQUE_COLORS: Record<string, string> = {
  maison: "var(--or, #D8A95B)",
  "image-influence": "#C96A4A",
  "atlas-ia": "#8FB58A",
  protection: "#7A8A95",
  lex: "#9B8E7A",
  departements: "#A08070",
  dossiers: "var(--or, #D8A95B)",
};

function getRubriqueColor(category: string): string {
  return RUBRIQUE_COLORS[category] ?? "var(--or, #D8A95B)";
}

function getRubriqueLabel(category: string): string {
  return RUBRIQUES.find((r) => r.id === category)?.label ?? category;
}

/* ─── Section Renderer ─── */

function SectionRenderer({ section, index }: { section: ArticleSectionWTF; index: number }) {
  switch (section.type) {
    case "heading": {
      const id = slugify(section.content);
      return (
        <h2
          id={id}
          className="scroll-mt-24"
          style={{
            fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
            fontSize: "clamp(22px, 2.2vw, 30px)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--ivoire, #F4EEE3)",
            marginTop: 48,
            marginBottom: 20,
            letterSpacing: "-0.01em",
          }}
        >
          {section.content}
        </h2>
      );
    }

    case "subheading": {
      const id = slugify(section.content);
      return (
        <h3
          id={id}
          className="scroll-mt-24"
          style={{
            fontFamily: "var(--font-display-alt, 'Fraunces'), Georgia, serif",
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.3,
            color: "var(--ivoire, #F4EEE3)",
            marginTop: 36,
            marginBottom: 14,
          }}
        >
          {section.content}
        </h3>
      );
    }

    case "paragraph": {
      const isFirst = index === 0;
      return (
        <p
          style={{
            fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--pierre, #9C9183)",
            marginBottom: 20,
          }}
        >
          {isFirst && (
            <span
              style={{
                fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
                fontSize: "3.2em",
                lineHeight: 0.8,
                fontWeight: 400,
                color: "var(--or, #D8A95B)",
                float: "left",
                marginRight: 10,
                marginTop: 4,
              }}
            >
              {section.content.charAt(0)}
            </span>
          )}
          {isFirst ? section.content.slice(1) : section.content}
        </p>
      );
    }

    case "pullquote":
      return (
        <div
          style={{
            marginTop: 36,
            marginBottom: 36,
            paddingTop: 28,
            paddingBottom: 28,
            borderTop: "1px solid var(--ligne, rgba(216,169,91,0.18))",
            borderBottom: "1px solid var(--ligne, rgba(216,169,91,0.18))",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display-alt, 'Fraunces'), Georgia, serif",
              fontSize: "clamp(18px, 2vw, 24px)",
              lineHeight: 1.4,
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--ivoire, #F4EEE3)",
              textAlign: "center",
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            &ldquo;{section.content}&rdquo;
          </p>
          {section.author && (
            <p
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--pierre, #9C9183)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              {section.author}
            </p>
          )}
        </div>
      );

    case "list":
      return (
        <div style={{ marginBottom: 24 }}>
          {section.content && (
            <p
              style={{
                fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ivoire, #F4EEE3)",
                marginBottom: 12,
              }}
            >
              {section.content}
            </p>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {section.items?.map((item, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--pierre, #9C9183)",
                  paddingLeft: 20,
                  position: "relative",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 10,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--or, #D8A95B)",
                    opacity: 0.5,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "a-retenir":
      return (
        <div
          style={{
            marginTop: 36,
            marginBottom: 36,
            padding: 32,
            background: "var(--surface, #1C1712)",
            borderLeft: "2px solid var(--or, #D8A95B)",
            borderRadius: 4,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 9,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--or, #D8A95B)",
              marginBottom: 12,
            }}
          >
            À retenir
          </p>
          <p
            style={{
              fontFamily: "var(--font-display-alt, 'Fraunces'), Georgia, serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--ivoire, #F4EEE3)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {section.content}
          </p>
        </div>
      );

    case "faq":
      return (
        <details
          style={{
            marginBottom: 12,
            borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
            paddingBottom: 12,
            cursor: "pointer",
          }}
        >
          <summary
            style={{
              fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ivoire, #F4EEE3)",
              padding: "12px 0",
              listStyle: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {section.question}
            <span style={{ color: "var(--or, #D8A95B)", fontSize: 18, lineHeight: 1 }}>+</span>
          </summary>
          <p
            style={{
              fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--pierre, #9C9183)",
              padding: "4px 0 12px",
              margin: 0,
            }}
          >
            {section.answer}
          </p>
        </details>
      );

    case "table":
      return (
        <div style={{ overflowX: "auto", marginBottom: 28, marginTop: 28 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--or, #D8A95B)" }}>
                {section.headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      color: "var(--or, #D8A95B)",
                      fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr
                  key={ri}
                  style={{ borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.06))" }}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "10px 14px",
                        color: "var(--pierre, #9C9183)",
                        lineHeight: 1.5,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "cta":
      return (
        <div
          style={{
            marginTop: 40,
            marginBottom: 40,
            textAlign: "center",
            padding: "36px 28px",
            border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
            background: "var(--surface, #1C1712)",
          }}
        >
          <Link
            href={section.href}
            style={{
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--or, #D8A95B)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {section.label}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Table of Contents ─── */

function ArticleTOC({ content }: { content: ArticleSectionWTF[] }) {
  const headings = content.filter(
    (s): s is { type: "heading" | "subheading"; content: string } =>
      s.type === "heading" || s.type === "subheading"
  );

  if (headings.length < 2) return null;

  return (
    <nav
      style={{
        position: "sticky",
        top: 100,
        borderLeft: "1px solid var(--ligne, rgba(216,169,91,0.18))",
        paddingLeft: 20,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
          fontSize: 9,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--pierre, #9C9183)",
          marginBottom: 16,
        }}
      >
        Sommaire
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((h, i) => {
          const id = slugify(h.content);
          return (
            <li key={i} style={{ marginBottom: 10 }}>
              <a
                href={`#${id}`}
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: "var(--pierre, #9C9183)",
                  textDecoration: "none",
                  display: "block",
                  paddingLeft: h.type === "subheading" ? 12 : 0,
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--or, #D8A95B)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.color = "var(--pierre, #9C9183)"; }}
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

/* ─── Mobile TOC ─── */

function MobileTOC({ content }: { content: ArticleSectionWTF[] }) {
  const headings = content.filter(
    (s): s is { type: "heading" | "subheading"; content: string } =>
      s.type === "heading" || s.type === "subheading"
  );

  if (headings.length < 2) return null;

  return (
    <details
      style={{
        marginBottom: 32,
        borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
        paddingBottom: 16,
      }}
    >
      <summary
        style={{
          fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
          fontSize: 9,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--or, #D8A95B)",
          cursor: "pointer",
          padding: "12px 0",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Sommaire
        <span style={{ fontSize: 16 }}>+</span>
      </summary>
      <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
        {headings.map((h, i) => {
          const id = slugify(h.content);
          return (
            <li key={i} style={{ marginBottom: 6 }}>
              <a
                href={`#${id}`}
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 13,
                  color: "var(--pierre, #9C9183)",
                  textDecoration: "none",
                  display: "block",
                  padding: "4px 0 4px" + (h.type === "subheading" ? " 12px" : " 0"),
                }}
              >
                {h.content}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/* ─── Related Articles ─── */

function RelatedArticles({ current, category }: { current: string; category: string }) {
  const related = (ARTICLES_WTF ?? [])
    .filter((a) => a.slug !== current && a.category === category)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 64,
        paddingTop: 40,
        borderTop: "1px solid var(--ligne, rgba(216,169,91,0.18))",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--or, #D8A95B)",
          marginBottom: 28,
        }}
      >
        Dans la même rubrique
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 24,
        }}
      >
        {related.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                padding: 20,
                background: "var(--surface, #1C1712)",
                border: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
                height: "100%",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.4,
                  fontWeight: 500,
                  color: "var(--ivoire, #F4EEE3)",
                  margin: 0,
                }}
              >
                {a.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "var(--pierre, #9C9183)",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {a.excerpt.slice(0, 120)}&hellip;
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Newsletter embed ─── */

function NewsletterEmbed() {
  return (
    <div
      style={{
        marginTop: 48,
        padding: "36px 28px",
        background: "var(--surface, #1C1712)",
        border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
        textAlign: "center",
      }}
    >
      <BookOpen size={20} style={{ color: "var(--or, #D8A95B)", marginBottom: 16, opacity: 0.6 }} />
      <p
        style={{
          fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
          fontSize: 20,
          fontWeight: 400,
          color: "var(--ivoire, #F4EEE3)",
          marginBottom: 10,
        }}
      >
        Recevoir les prochains dossiers WTF
      </p>
      <p
        style={{
          fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--pierre, #9C9183)",
          maxWidth: 400,
          margin: "0 auto 24px",
        }}
      >
        Une sélection de perspectives, guides et analyses pour créateurs, équipes et marques.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: "flex",
          gap: 0,
          maxWidth: 360,
          margin: "0 auto",
          borderBottom: "1px solid var(--ligne, rgba(216,169,91,0.18))",
        }}
      >
        <input
          type="email"
          placeholder="votre@email.com"
          aria-label="Votre adresse email"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            padding: "12px 0",
            fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
            fontSize: 14,
            color: "var(--ivoire, #F4EEE3)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--or, #D8A95B)",
            cursor: "pointer",
            padding: "12px 0 12px 16px",
          }}
        >
          S&rsquo;inscrire
        </button>
      </form>
    </div>
  );
}

/* ─── Main Component ─── */

export function JournalArticle({ article }: { article: ArticleWTF }) {
  const accentColor = getRubriqueColor(article.category);
  const rubriqueLabel = getRubriqueLabel(article.category);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 220px",
        gap: 48,
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 40px",
      }}
    >
      {/* Main content */}
      <article style={{ minWidth: 0 }}>
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--pierre, #9C9183)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 40,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--or, #D8A95B)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pierre, #9C9183)"; }}
        >
          <ArrowLeft size={12} />
          Retour au Journal
        </Link>

        {/* Hero */}
        <header style={{ marginBottom: 48 }}>
          {/* Category badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "4px 10px",
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
              marginBottom: 24,
            }}
          >
            {rubriqueLabel}
          </span>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
              fontSize: "clamp(30px, 3.6vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--ivoire, #F4EEE3)",
              marginBottom: 20,
            }}
          >
            {article.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontFamily: "var(--font-display-alt, 'Fraunces'), Georgia, serif",
              fontSize: 17,
              lineHeight: 1.5,
              color: "var(--pierre, #9C9183)",
              fontStyle: "italic",
              maxWidth: 620,
              marginBottom: 24,
            }}
          >
            {article.excerpt}
          </p>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 10,
              color: "var(--pierre, #9C9183)",
              opacity: 0.7,
            }}
          >
            <span>{article.publishedAt}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} />
              {article.readingTime} min de lecture
            </span>
          </div>
        </header>

        {/* Hero visual */}
        <div
          style={{
            aspectRatio: "16/9",
            background: "var(--surface, #1C1712)",
            border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {article.heroImage ? (
            <img
              src={`${article.heroImage}?v=2`}
              alt={article.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <>
              <div
                style={{
                  fontFamily: "var(--font-couture, 'Playfair Display'), serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--or, #D8A95B)",
                  opacity: 0.25,
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                WTF
                <br />
                <span style={{ fontSize: 13, fontStyle: "italic", opacity: 0.5 }}>
                  Where Talent Forms
                </span>
              </div>
              {/* Top line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  opacity: 0.3,
                }}
              />
            </>
          )}
        </div>

        {/* Mobile TOC */}
        <div className="block lg:hidden">
          <MobileTOC content={article.content} />
        </div>

        {/* Content */}
        <div>
          {article.content.map((section, i) => (
            <SectionRenderer key={i} section={section} index={i} />
          ))}
        </div>

        {/* Article CTA */}
        {article.cta && (
          <div
            style={{
              marginTop: 48,
              padding: "36px 28px",
              background: "var(--surface, #1C1712)",
              border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
                fontSize: 20,
                fontWeight: 400,
                color: "var(--ivoire, #F4EEE3)",
                marginBottom: 8,
              }}
            >
              {article.cta.title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--pierre, #9C9183)",
                maxWidth: 440,
                margin: "0 auto 24px",
              }}
            >
              {article.cta.text}
            </p>
            <Link
              href={article.cta.buttonHref}
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--or, #D8A95B)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid var(--or, #D8A95B)",
                paddingBottom: 4,
              }}
            >
              {article.cta.buttonLabel}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}

        {/* Internal links */}
        {article.internalLinks && article.internalLinks.length > 0 && (
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--pierre, #9C9183)",
                marginBottom: 12,
              }}
            >
              Pour aller plus loin
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {article.internalLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                    fontSize: 13,
                    color: "var(--or, #D8A95B)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    width: "fit-content",
                  }}
                >
                  {link.label}
                  <ArrowUpRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <NewsletterEmbed />

        {/* Related articles */}
        <RelatedArticles current={article.slug} category={article.category} />
      </article>

      {/* Desktop TOC sidebar */}
      <aside className="hidden lg:block" style={{ position: "relative" }}>
        <ArticleTOC content={article.content} />
      </aside>
    </div>
  );
}
