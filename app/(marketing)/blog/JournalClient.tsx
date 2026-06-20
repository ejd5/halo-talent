"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Clock, BookOpen } from "lucide-react";

import { JOURNAL_WTF, RUBRIQUES, GUIDES_ESSENTIELS } from "@/lib/marketing/journal-wtf";
import { ARTICLES_WTF } from "@/lib/marketing/journal-articles";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  return { ref };
}

/* ─── Styles — inline pour éviter d'ajouter des fichiers CSS ─── */

const S = {
  section: { position: "relative" as const, padding: "100px 0" },
  wrap: { maxWidth: 1180, margin: "0 auto", padding: "0 40px" },
  line: { height: 1, background: "var(--ligne-faible, rgba(244,238,227,0.08))", width: "100%" },
  champagne: { color: "var(--or, #D8A95B)" },
  pierre: { color: "var(--pierre, #9C9183)" },
  ivoire: { color: "var(--ivoire, #F4EEE3)" },
  encre: { color: "var(--encre, #0C0A08)" },
};

/* ─── Hero magazine ─── */

function HeroMagazine() {
  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--creme, #F9F6EF)",
        paddingTop: 160,
        paddingBottom: 80,
      }}
    >
      <div style={S.wrap}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="lg:grid-cols-[1.2fr_1fr]"
        >
          <div>
            {/* Label */}
            <p
              style={{
                fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--or, #D8A95B)",
                marginBottom: 40,
              }}
            >
              {JOURNAL_WTF.signature}
            </p>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-couture, 'Playfair Display'), Georgia, serif",
                fontSize: "clamp(48px, 6vw, 88px)",
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "var(--encre, #0C0A08)",
                marginBottom: 28,
                maxWidth: 700,
              }}
            >
              {JOURNAL_WTF.name}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-display-alt, 'Fraunces'), Georgia, serif",
                fontSize: 20,
                lineHeight: 1.4,
                color: "var(--pierre, #9C9183)",
                maxWidth: 540,
                marginBottom: 24,
                fontStyle: "italic",
              }}
            >
              {JOURNAL_WTF.subtitle}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--encre, #0C0A08)",
                opacity: 0.6,
                maxWidth: 480,
                marginBottom: 36,
              }}
            >
              {JOURNAL_WTF.description}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <Link
                href={`/blog/${"pourquoi-createur-centre-modele"}`}
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--encre, #0C0A08)",
                  borderBottom: "1px solid var(--encre, #0C0A08)",
                  paddingBottom: 4,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Lire le dossier principal
                <ArrowUpRight size={14} />
              </Link>
              <span style={{ color: "var(--ligne, rgba(216,169,91,0.18))" }}>/</span>
              <Link
                href="#rubriques"
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--pierre, #9C9183)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Explorer les rubriques
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right: Cover Image */}
          <div
            style={{
              aspectRatio: "4/5",
              background: "var(--surface, #1C1712)",
              border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
              position: "relative",
              overflow: "hidden",
              maxWidth: 420,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <img
              src="/images/wtf/journal/wtf-journal-cover.png?v=2"
              alt="Le Journal WTF Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Article couverture ─── */

function ArticleCouverture() {
  const article = ARTICLES_WTF.find((a) => a.slug === "pourquoi-createur-centre-modele");

  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--encre, #0C0A08)",
        paddingTop: 0,
        paddingBottom: 100,
      }}
    >
      <div style={S.wrap}>
        <Link
          href={article ? `/blog/${article.slug}` : "/blog"}
          style={{ textDecoration: "none", display: "block" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 60,
              alignItems: "center",
              borderTop: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
              paddingTop: 80,
            }}
          >
            {/* Left: text */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--or, #D8A95B)",
                  marginBottom: 20,
                }}
              >
                Article à la une
              </p>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  background: "rgba(216,169,91,0.1)",
                  color: "var(--or, #D8A95B)",
                  marginBottom: 24,
                }}
              >
                Maison
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-couture, 'Playfair Display'), serif",
                  fontSize: "clamp(28px, 3.2vw, 44px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "var(--ivoire, #F4EEE3)",
                  marginBottom: 20,
                }}
              >
                Pourquoi le créateur doit redevenir le centre du modèle
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--pierre, #9C9183)",
                  marginBottom: 24,
                }}
              >
                Le marché du management créateur a grandi vite. Trop vite parfois.
                Le Journal WTF ouvre une réflexion sur la transparence, le contrôle,
                la protection et la place réelle du talent dans un modèle qui doit
                redevenir plus humain.
              </p>
              <span
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--or, #D8A95B)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Lire le dossier
                <ArrowUpRight size={12} />
              </span>
            </div>

            {/* Right: visual block */}
            <div
              style={{
                aspectRatio: "4/3",
                background: "var(--surface, #1C1712)",
                border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {article?.heroImage ? (
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
                      fontSize: 32,
                      fontWeight: 300,
                      color: "var(--or, #D8A95B)",
                      opacity: 0.3,
                      letterSpacing: "0.08em",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    WTF
                    <br />
                    <span style={{ fontSize: 16, fontStyle: "italic", opacity: 0.6 }}>
                      Where Talent Forms
                    </span>
                  </div>
                  {/* Ligne champagne */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, var(--or, #D8A95B), transparent)",
                      opacity: 0.3,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ─── Barre de rubriques ─── */

function RubriqueBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="rubriques"
      style={{
        ...S.section,
        backgroundColor: "var(--creme, #F9F6EF)",
        paddingTop: 0,
        paddingBottom: 80,
      }}
    >
      <div style={S.wrap}>
        <div
          style={{
            display: "flex",
            gap: 0,
            borderTop: "1px solid rgba(12,10,8,0.08)",
            borderBottom: "1px solid rgba(12,10,8,0.08)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {RUBRIQUES.map((r) => {
            const isActive = active === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActive(isActive ? null : r.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--or, #D8A95B)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(12,10,8,0.4)";
                }}
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "18px 24px",
                  background: isActive ? "rgba(12,10,8,0.03)" : "transparent",
                  border: "none",
                  borderRight: "1px solid rgba(12,10,8,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color: isActive ? "var(--or, #D8A95B)" : "rgba(12,10,8,0.4)",
                  transition: "color 0.2s, background 0.2s",
                  flexShrink: 0,
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Grille magazine asymétrique ─── */

function GrilleEditoriale() {
  const articles = ARTICLES_WTF.slice(0, 7);
  if (articles.length === 0) return null;

  const grand = articles[0];
  const moyens = articles.slice(1, 3);
  const courts = articles.slice(3, 7);

  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--encre, #0C0A08)",
        paddingTop: 0,
        paddingBottom: 100,
      }}
    >
      <div style={S.wrap}>
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--or, #D8A95B)",
            marginBottom: 40,
          }}
        >
          Articles récents
        </p>

        {/* Grand article */}
        {grand && (
          <Link
            href={`/blog/${grand.slug}`}
            style={{ textDecoration: "none", display: "block", marginBottom: 40 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
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
                    color: "var(--or, #D8A95B)",
                  }}
                >
                  {grand.rubrique}
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
                  {grand.title}
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
                  {grand.excerpt}
                </p>
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
                  <Clock size={11} />
                  {grand.readingTime} min
                </span>
              </div>
              <div
                style={{
                  background: "var(--surface, #1C1712)",
                  border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
                  minHeight: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {grand.heroImage ? (
                  <img
                    src={`${grand.heroImage}?v=2`}
                    alt={grand.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                    }}
                  />
                ) : (
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
                    {grand.rubrique}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* 2 moyens */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            marginBottom: 40,
            paddingBottom: 40,
            borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
          }}
        >
          {moyens.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--surface, #1C1712)",
                  border: "1px solid var(--ligne, rgba(216,169,91,0.12))",
                  padding: 28,
                  height: "100%",
                  transition: "border-color 0.3s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--or, #D8A95B)",
                  }}
                >
                  {a.rubrique}
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
                  {a.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "var(--pierre, #9C9183)",
                    marginBottom: 14,
                  }}
                >
                  {a.excerpt}
                </p>
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
                  <Clock size={11} />
                  {a.readingTime} min
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 4 courts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {courts.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  padding: "24px 0",
                  borderTop: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--or, #D8A95B)",
                  }}
                >
                  {a.rubrique}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display-alt, 'Fraunces'), serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: "var(--ivoire, #F4EEE3)",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {a.title}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                    fontSize: 10,
                    color: "var(--pierre, #9C9183)",
                  }}
                >
                  <Clock size={10} style={{ display: "inline", marginRight: 3 }} />
                  {a.readingTime} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Dossier du mois ─── */

function DossierDuMois() {
  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--creme, #F9F6EF)",
        paddingTop: 80,
        paddingBottom: 100,
      }}
    >
      <div style={{ ...S.wrap, maxWidth: 800 }}>
        <p
          style={{
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--or, #D8A95B)",
            marginBottom: 12,
          }}
        >
          Le dossier du mois
        </p>
        <div
          style={{
            borderTop: "1px solid rgba(12,10,8,0.08)",
            paddingTop: 32,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-couture, 'Playfair Display'), serif",
              fontSize: "clamp(24px, 2.8vw, 36px)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "var(--encre, #0C0A08)",
              marginBottom: 20,
              maxWidth: 640,
            }}
          >
            Pourquoi les créateurs changent d&rsquo;agence tous les six mois
            — et comment construire un modèle plus durable
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--encre, #0C0A08)",
              opacity: 0.6,
              maxWidth: 560,
              marginBottom: 28,
            }}
          >
            Un dossier sur la confiance, les commissions, les outils, la transparence
            et les modèles d&rsquo;accompagnement à long terme.
          </p>
          <Link
            href="/blog/agence-opaque-maison-management"
            style={{
              fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--encre, #0C0A08)",
              borderBottom: "1px solid var(--encre, #0C0A08)",
              paddingBottom: 4,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Lire le dossier
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Guides essentiels ─── */

function GuidesEssentiels() {
  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--encre, #0C0A08)",
        paddingTop: 80,
        paddingBottom: 100,
      }}
    >
      <div style={S.wrap}>
        <p
          style={{
            fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--or, #D8A95B)",
            marginBottom: 40,
          }}
        >
          Guides essentiels
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 2,
            background: "var(--ligne-faible, rgba(244,238,227,0.08))",
          }}
        >
          {GUIDES_ESSENTIELS.map((g) => (
            <Link
              key={g.slug}
              href={`/blog/${g.slug}`}
              style={{
                textDecoration: "none",
                background: "var(--encre, #0C0A08)",
                padding: 28,
                transition: "background 0.3s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-util, 'Space Grotesk'), monospace",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--or, #D8A95B)",
                }}
              >
                {g.rubrique}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display-alt, 'Fraunces'), serif",
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: "var(--ivoire, #F4EEE3)",
                  marginTop: 12,
                  marginBottom: 10,
                }}
              >
                {g.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "var(--pierre, #9C9183)",
                  margin: 0,
                }}
              >
                {g.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── A retenir ─── */

function ARetenir() {
  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--creme, #F9F6EF)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div style={{ ...S.wrap, maxWidth: 700, textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 1,
            background: "var(--or, #D8A95B)",
            margin: "0 auto 28px",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-display-alt, 'Fraunces'), serif",
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--encre, #0C0A08)",
            fontStyle: "italic",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          {JOURNAL_WTF.aRetenir}
        </p>
        <div
          style={{
            width: 40,
            height: 1,
            background: "var(--or, #D8A95B)",
            margin: "28px auto 0",
          }}
        />
      </div>
    </section>
  );
}

/* ─── Newsletter ─── */

function NewsletterSection() {
  return (
    <section
      style={{
        ...S.section,
        backgroundColor: "var(--encre, #0C0A08)",
        paddingTop: 80,
        paddingBottom: 100,
      }}
    >
      <div style={{ ...S.wrap, maxWidth: 600, textAlign: "center" }}>
        <BookOpen size={24} style={{ color: "var(--or, #D8A95B)", marginBottom: 24, opacity: 0.6 }} />
        <h2
          style={{
            fontFamily: "var(--font-couture, 'Playfair Display'), serif",
            fontSize: "clamp(24px, 2.5vw, 32px)",
            fontWeight: 400,
            color: "var(--ivoire, #F4EEE3)",
            marginBottom: 16,
          }}
        >
          {JOURNAL_WTF.newsletter.title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body, 'Instrument Sans'), sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--pierre, #9C9183)",
            maxWidth: 440,
            margin: "0 auto 32px",
          }}
        >
          {JOURNAL_WTF.newsletter.text}
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            gap: 0,
            maxWidth: 400,
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
              padding: "14px 0",
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
              padding: "14px 0 14px 16px",
            }}
          >
            {JOURNAL_WTF.newsletter.cta}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── Main component ─── */

export function JournalClient() {
  return (
    <main>
      <HeroMagazine />
      <ArticleCouverture />
      <RubriqueBar />
      <GrilleEditoriale />
      <DossierDuMois />
      <GuidesEssentiels />
      <ARetenir />
      <NewsletterSection />
    </main>
  );
}
