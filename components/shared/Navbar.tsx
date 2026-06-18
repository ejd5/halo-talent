"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Menu,
  X,
  ChevronRight,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { HaloCoutureLogo } from "@/components/brand/HaloCoutureLogo";
import { NAV_SECTIONS, type NavSection, type MegaCard } from "@/lib/marketing/mega-menu-data";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const LOCALE_FLAGS: Record<string, string> = {
  fr: "🇫🇷", en: "🇬🇧", es: "🇪🇸", "pt-BR": "🇧🇷", de: "🇩🇪", it: "🇮🇹",
};

const ALL_LOCALES = ["fr", "en", "es", "pt-BR", "de", "it"] as Locale[];

/* ─── Styles ─── */

const navbarCSS = `
  /* ── Floating pill ── */
  .cf-pill {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(26, 22, 20, 0.6);
    border: 1px solid rgba(245, 240, 235, 0.08);
    border-radius: 999px;
    padding: 4px 6px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
  }
  .cf-pill:hover {
    border-color: rgba(245, 240, 235, 0.12);
    box-shadow: 0 0 30px rgba(199, 91, 57, 0.06);
  }

  /* ── Nav trigger text ── */
  .cf-trigger {
    position: relative;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245, 240, 235, 0.55);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.25s;
    font-family: var(--font-body, 'Plus Jakarta Sans'), sans-serif;
    white-space: nowrap;
  }
  .cf-trigger:hover,
  .cf-trigger[data-state="open"] {
    color: rgba(245, 240, 235, 0.95);
  }

  /* ── Mega card ── */
  .cf-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px 18px;
    min-height: 180px;
    border-radius: 12px;
    background: rgba(26, 22, 20, 0.65);
    border: 1px solid rgba(245, 240, 235, 0.06);
    transition: border-color 0.35s, box-shadow 0.35s, transform 0.3s, background 0.3s;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
  }
  .cf-card:hover {
    transform: translateY(-2px);
    background: rgba(30, 26, 22, 0.8);
  }
  .cf-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  .cf-card:hover::before {
    opacity: 1;
  }

  /* ── Card icon ── */
  .cf-card-icon {
    position: absolute;
    bottom: -8px;
    right: -8px;
    width: 80px;
    height: 80px;
    opacity: 0.1;
    transition: opacity 0.35s, transform 0.35s, filter 0.35s;
    filter: none;
  }
  .cf-card:hover .cf-card-icon {
    opacity: 0.5;
    transform: scale(1.15) rotate(-5deg);
    filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 4px currentColor);
  }

  /* ── Badge ── */
  .cf-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 999px;
    line-height: 1.4;
  }

  /* ── CTA capsule ── */
  .cf-cta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 14px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 999px;
    background: #C8A66E;
    color: #0A0806;
    border: 1px solid #C8A66E;
    transition: background 0.25s, transform 0.25s, box-shadow 0.25s, color 0.25s, border-color 0.25s;
    text-decoration: none;
    white-space: nowrap;
    font-family: var(--font-body, 'Plus Jakarta Sans'), sans-serif;
  }
  .cf-cta:hover {
    background: #D4B880; /* Paler yellow */
    border-color: #D4B880;
    color: #0A0806;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(200, 166, 110, 0.35);
  }

  /* ── Sign in link ── */
  .cf-signin {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(245, 240, 235, 0.5);
    transition: color 0.25s;
    text-decoration: none;
    white-space: nowrap;
    font-family: var(--font-body, 'Plus Jakarta Sans'), sans-serif;
  }
  .cf-signin:hover {
    color: rgba(245, 240, 235, 0.85);
  }

  /* ── Backdrop overlay when mega-menu open ── */
  .cf-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 40;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s;
  }
  .cf-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }

  /* ── Language selector ── */
  .cf-lang {
    position: relative;
  }
  .cf-lang-btn {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    padding: 4px 6px;
    color: rgba(245, 240, 235, 0.4);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
  }
  .cf-lang-btn:hover {
    color: rgba(245, 240, 235, 0.7);
    background: rgba(245, 240, 235, 0.04);
  }
  .cf-lang-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 100px;
    padding: 4px;
    border-radius: 10px;
    background: rgba(14, 12, 10, 0.95);
    border: 1px solid rgba(245, 240, 235, 0.08);
    backdrop-filter: blur(20px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    z-index: 60;
  }
  .cf-lang-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 10px;
    font-size: 12px;
    color: rgba(245, 240, 235, 0.5);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
  }
  .cf-lang-item:hover {
    color: rgba(245, 240, 235, 0.9);
    background: rgba(245, 240, 235, 0.05);
  }
  .cf-lang-item.active {
    color: #C75B39;
    background: rgba(199, 91, 57, 0.08);
  }

  /* ── Mobile drawer ── */
  .cf-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 420px;
    background: rgba(14, 12, 10, 0.98);
    border-left: 1px solid rgba(245, 240, 235, 0.06);
    z-index: 100;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow-y: auto;
    backdrop-filter: blur(20px);
  }
  .cf-drawer.open {
    transform: translateX(0);
  }
  .cf-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s;
  }
  .cf-drawer-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  /* ── Mobile nav items ── */
  .cf-mobile-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(245, 240, 235, 0.85);
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 1px solid rgba(245, 240, 235, 0.05);
    font-family: var(--font-body, 'Plus Jakarta Sans'), sans-serif;
    text-decoration: none;
  }
  .cf-mobile-subitem {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    transition: background 0.2s;
    text-decoration: none;
  }
  .cf-mobile-subitem:hover {
    background: rgba(245, 240, 235, 0.04);
  }
`;

/* ─── Badge colors ─── */
function getBadgeStyle(badge: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    NEW: { bg: "rgba(139,92,246,0.15)", color: "#A78BFA" },
    FREE: { bg: "rgba(16,185,129,0.15)", color: "#34D399" },
    PRO: { bg: "rgba(216,169,91,0.15)", color: "#D8A95B" },
    BETA: { bg: "rgba(59,130,246,0.15)", color: "#60A5FA" },
    OPEN: { bg: "rgba(16,185,129,0.12)", color: "#34D399" },
  };
  const s = map[badge] ?? { bg: "rgba(245,240,235,0.08)", color: "rgba(245,240,235,0.6)" };
  return { backgroundColor: s.bg, color: s.color };
}

/* ═══════════════════════════════════════════════════════
   NAVBAR — Chargeflow-style
   ═══════════════════════════════════════════════════════ */

export function Navbar() {
  const locale = useLocale();
  const l = norm(locale);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // tracks if any mega-menu is open

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      // Never hide — always visible
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track mega-menu state from Radix
  const handleValueChange = useCallback((value: string) => {
    setMenuOpen(!!value);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: 103,
    padding: "16px 40px 0 40px",
    display: "flex",
    alignItems: "center",
    gap: 30,
    overflow: "visible",
    background: scrolled ? "rgba(12,10,8,0.72)" : "rgba(12,10,8,0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: scrolled ? "1px solid rgba(245,240,235,0.06)" : "1px solid transparent",
    transition: "background 0.45s, backdrop-filter 0.45s, border-color 0.45s",
  };

  return (
    <>
      <style>{navbarCSS}</style>

      {/* Backdrop overlay when mega-menu is open */}
      <div className={`cf-overlay ${menuOpen ? "active" : ""}`} />

      <nav style={navStyle}>
        {/* ─── Logo (Left) ─── */}
        <Link href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <img
            src="/wtf-logo.png"
            alt="WTF Talent"
            style={{ height: 160, width: 288 }}
          />
        </Link>

        {/* ─── Desktop: Floating pill (Center) ─── */}
        <div className="hidden lg:flex items-center justify-center" style={{ flex: 1, minWidth: 0 }}>
          <NavigationMenu onValueChange={handleValueChange}>
            <NavigationMenuList className="cf-pill" style={{ gap: 0 }}>
              {NAV_SECTIONS.map((section) => {
                if (section.href && !section.cards) {
                  return (
                    <NavigationMenuItem key={section.labelKey}>
                      <NavigationMenuLink asChild>
                        <Link href={section.href} className="cf-trigger">
                          {t(section.labelKey, l)}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                }
                return (
                  <NavigationMenuItem key={section.labelKey} value={section.labelKey}>
                    <NavigationMenuTrigger className="cf-trigger">
                      {t(section.labelKey, l)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <MegaMenuPanel section={section} locale={l} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* ─── Desktop: Right actions ─── */}
        <div className="hidden lg:flex items-center gap-2" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
          <div className="cf-lang">
            <button onClick={() => setLangOpen(!langOpen)} className="cf-lang-btn">
              <span>{LOCALE_FLAGS[l]}</span>
            </button>
            {langOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 55 }} onClick={() => setLangOpen(false)} />
                <div className="cf-lang-dropdown">
                  {ALL_LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        const code = loc === "pt-BR" ? "pt" : loc;
                        window.location.href = `/${code}`;
                        setLangOpen(false);
                      }}
                      className={`cf-lang-item ${loc === l ? "active" : ""}`}
                    >
                      <span>{LOCALE_FLAGS[loc]}</span>
                      <span>{loc === "pt-BR" ? "BR" : loc.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Link href="/login" className="cf-signin">
            {t("nav.login", l)}
            <ArrowUpRight size={10} />
          </Link>
          <Link href="/apply" className="cf-cta">
            {l === "fr" ? "Essayer" : t("nav.start_free", l)}
            <ArrowUpRight size={11} />
          </Link>
        </div>

        {/* ─── Mobile hamburger ─── */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          style={{
            color: "rgba(245,240,235,0.85)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            flexShrink: 0,
          }}
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* ─── Mobile drawer ─── */}
      <div
        className={`cf-drawer-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={l}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MEGA MENU PANEL — Cards with personalized glow
   ═══════════════════════════════════════════════════════ */

function MegaMenuPanel({
  section,
  locale,
}: {
  section: NavSection;
  locale: Locale;
}) {
  if (!section.cards) return null;

  const count = section.cards.length;
  // Each card is ~200px wide, container adapts to card count
  const cardWidth = 200;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${count}, ${cardWidth}px)`,
        gap: 12,
        padding: 16,
        width: "fit-content",
      }}
    >
      {section.cards.map((card) => (
        <GlowCard key={card.labelKey} card={card} locale={locale} />
      ))}
    </div>
  );
}

/* ─── Individual Glow Card ─── */

function GlowCard({ card, locale }: { card: MegaCard; locale: Locale }) {
  const [hovered, setHovered] = useState(false);

  const glowBorder = hovered
    ? `1px solid ${card.glowColor}44`
    : "1px solid rgba(245,240,235,0.06)";

  const glowShadow = hovered
    ? `0 0 24px ${card.glowColor}20, 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 ${card.glowColor}10`
    : "0 2px 8px rgba(0,0,0,0.2)";

  return (
    <NavigationMenuLink asChild>
      <Link
        href={card.href}
        className="cf-card"
        style={{
          border: glowBorder,
          boxShadow: glowShadow,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Badge */}
        {card.badge && (
          <span className="cf-badge" style={getBadgeStyle(card.badge)}>
            {card.badge}
          </span>
        )}

        {/* Title */}
        <h4
          style={{
            fontFamily: "var(--font-body, 'Plus Jakarta Sans'), sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: hovered ? "rgba(245,240,235,0.95)" : "rgba(245,240,235,0.8)",
            marginTop: card.badge ? 10 : 0,
            marginBottom: 6,
            transition: "color 0.25s",
          }}
        >
          {t(card.labelKey, locale)}
        </h4>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body, 'Plus Jakarta Sans'), sans-serif",
            fontSize: 12,
            lineHeight: 1.5,
            color: "rgba(245,240,235,0.4)",
            flex: 1,
          }}
        >
          {t(card.descriptionKey, locale)}
        </p>

        {/* Abstract SVG icon (unique per card) */}
        {card.iconPath && (
          <svg
            className="cf-card-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke={card.glowColor}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={card.iconPath} />
          </svg>
        )}

        {/* Glow gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            background: hovered
              ? `radial-gradient(ellipse at 50% 100%, ${card.glowColor}18 0%, transparent 70%)`
              : "none",
            pointerEvents: "none",
            transition: "background 0.4s",
          }}
        />
      </Link>
    </NavigationMenuLink>
  );
}

/* ═══════════════════════════════════════════════════════
   MOBILE DRAWER
   ═══════════════════════════════════════════════════════ */

function MobileDrawer({
  open,
  onClose,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`cf-drawer ${open ? "open" : ""}`}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(245,240,235,0.06)",
        }}
      >
        <Link href="/" onClick={onClose}>
          <img
            src="/wtf-logo.png"
            alt="WTF Talent"
            style={{ height: 48, width: "auto" }}
          />
        </Link>
        <button
          onClick={onClose}
          style={{
            color: "rgba(245,240,235,0.6)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* CTAs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 24px",
          borderBottom: "1px solid rgba(245,240,235,0.06)",
        }}
      >
        <Link href="/login" className="cf-signin" onClick={onClose}>
          {t("nav.login", locale)}
          <ArrowUpRight size={12} />
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/apply" className="cf-cta" onClick={onClose} style={{ fontSize: 11, padding: "7px 16px" }}>
          {t("nav.start_free", locale)}
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Nav items */}
      <div style={{ padding: "8px 24px" }}>
        {NAV_SECTIONS.map((section, i) => {
          if (section.href && !section.cards) {
            return (
              <Link
                key={section.labelKey}
                href={section.href}
                onClick={onClose}
                className="cf-mobile-item"
              >
                {t(section.labelKey, locale)}
              </Link>
            );
          }

          const isExpanded = expandedIndex === i;

          return (
            <div key={section.labelKey}>
              <button
                className="cf-mobile-item"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                <span>{t(section.labelKey, locale)}</span>
                <ChevronDown
                  size={16}
                  style={{
                    color: "rgba(245,240,235,0.3)",
                    transform: isExpanded ? "rotate(180deg)" : "",
                    transition: "transform 0.25s",
                  }}
                />
              </button>
              {isExpanded && section.cards && (
                <div style={{ paddingBottom: 12 }}>
                  {section.cards.map((card) => (
                    <Link
                      key={card.labelKey}
                      href={card.href}
                      onClick={onClose}
                      className="cf-mobile-subitem"
                    >
                      {/* Glow dot */}
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: card.glowColor,
                          boxShadow: `0 0 8px ${card.glowColor}60`,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "rgba(245,240,235,0.8)",
                            fontFamily: "var(--font-body, 'Plus Jakarta Sans'), sans-serif",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {t(card.labelKey, locale)}
                          {card.badge && (
                            <span
                              className="cf-badge"
                              style={{ ...getBadgeStyle(card.badge), fontSize: 8 }}
                            >
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(245,240,235,0.35)",
                            marginTop: 2,
                            fontFamily: "var(--font-body, 'Plus Jakarta Sans'), sans-serif",
                          }}
                        >
                          {t(card.descriptionKey, locale)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Language */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(245,240,235,0.06)",
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {ALL_LOCALES.map((loc) => (
          <button
            key={loc}
            onClick={() => {
              const code = loc === "pt-BR" ? "pt" : loc;
              window.location.href = `/${code}`;
            }}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              color: loc === locale ? "#C75B39" : "rgba(245,240,235,0.4)",
              background: loc === locale ? "rgba(199,91,57,0.1)" : "transparent",
              transition: "color 0.2s, background 0.2s",
            }}
          >
            {LOCALE_FLAGS[loc]} {loc === "pt-BR" ? "BR" : loc.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
