"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const LOCALE_FLAGS: Record<string, string> = {
  fr: "🇫🇷", en: "🇬🇧", es: "🇪🇸", "pt-BR": "🇧🇷", de: "🇩🇪", it: "🇮🇹",
};

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR", en: "EN", es: "ES", "pt-BR": "BR", de: "DE", it: "IT",
};

const ALL_LOCALES = ["fr", "en", "es", "pt-BR", "de", "it"] as Locale[];

interface NavItem {
  href: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/#maisons", labelKey: "nav.features" },
  { href: "/#commissions", labelKey: "nav.pricing" },
  { href: "/#bouclier", labelKey: "nav.protection" },
  { href: "/#departements", labelKey: "nav.studio" },
  { href: "/chat-ai", labelKey: "nav.chat_ai" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Navbar() {
  const locale = useLocale();
  const l = norm(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setHidden(y > 120 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      style={{
        transform: hidden ? "translateY(-100%)" : "",
        background: scrolled ? "rgba(12,10,8,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
        transition: "transform 0.4s, background 0.4s, backdrop-filter 0.4s",
      }}
      className="fixed top-0 left-0 right-0 z-50 h-[72px]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display-alt text-[22px] font-medium tracking-[0.01em]"
          style={{ fontFamily: "var(--font-display-alt, Fraunces, Georgia, serif)", color: "var(--ivoire, #F4EEE3)" }}
        >
          Halo <em style={{ fontStyle: "italic", color: "var(--or, #D8A95B)" }}>Talent</em>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9 h-full">
          <div className="flex items-center gap-9 h-full">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-1 text-[11px] font-util tracking-[0.22em] uppercase transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-util, Space Grotesk, monospace)",
                  color: isActive(item.href) ? "var(--or, #D8A95B)" : "var(--pierre, #9C9183)",
                  letterSpacing: "0.22em",
                }}
              >
                {t(item.labelKey, l)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 ml-4">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm transition-colors"
                style={{ color: "var(--pierre, #9C9183)" }}
              >
                <span>{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_LABELS[l]}</span>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div
                    className="absolute top-full right-0 mt-1 z-20 py-1 min-w-[100px] rounded-sm shadow-lg"
                    style={{
                      backgroundColor: "var(--surface, #1C1712)",
                      border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
                    }}
                  >
                    {ALL_LOCALES.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          const code = loc === "pt-BR" ? "pt" : loc;
                          window.location.href = `/${code}`;
                          setLangOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors"
                        style={{
                          color: loc === l ? "var(--or, #D8A95B)" : "var(--pierre, #9C9183)",
                          backgroundColor: loc === l ? "rgba(216,169,91,0.08)" : "transparent",
                        }}
                      >
                        <span>{LOCALE_FLAGS[loc]}</span>
                        <span>{LOCALE_LABELS[loc]}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="flex items-center text-[11px] uppercase tracking-[0.22em] transition-colors"
              style={{
                fontFamily: "var(--font-util, Space Grotesk, monospace)",
                color: "var(--pierre, #9C9183)",
              }}
            >
              {t("nav.login", l)}
            </Link>

            {/* CTA */}
            <Link
              href="/apply"
              className="inline-flex items-center gap-2.5 px-[26px] py-[14px] text-[11px] uppercase tracking-[0.22em] transition-all duration-300"
              style={{
                fontFamily: "var(--font-util, Space Grotesk, monospace)",
                backgroundColor: "var(--cuivre, #E2702E)",
                color: "#fff",
                border: "1px solid var(--cuivre, #E2702E)",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F08440";
                e.currentTarget.style.borderColor = "#F08440";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--cuivre, #E2702E)";
                e.currentTarget.style.borderColor = "var(--cuivre, #E2702E)";
              }}
            >
              {t("nav.start_free", l)}
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50"
          style={{ color: "var(--ivoire, #F4EEE3)" }}
          aria-label="Menu"
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="block w-6 h-px" style={{ backgroundColor: "var(--ivoire, #F4EEE3)" }} />
              <span className="block w-6 h-px" style={{ backgroundColor: "var(--ivoire, #F4EEE3)" }} />
              <span className="block w-4 h-px" style={{ backgroundColor: "var(--ivoire, #F4EEE3)" }} />
            </div>
          )}
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: "var(--encre, #0C0A08)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-[2rem] font-bold uppercase tracking-[0.02em] transition-colors"
              style={{
                fontFamily: "var(--font-display-alt, Fraunces, serif)",
                color: isActive(item.href) ? "var(--or, #D8A95B)" : "var(--ivoire, #F4EEE3)",
              }}
            >
              {t(item.labelKey, l)}
            </Link>
          ))}

          <div className="flex items-center gap-3 mt-4">
            {ALL_LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  const code = loc === "pt-BR" ? "pt" : loc;
                  window.location.href = `/${code}`;
                  setIsOpen(false);
                }}
                className="text-sm px-2 py-1 rounded-sm transition-colors"
                style={{
                  color: loc === l ? "var(--or, #D8A95B)" : "var(--pierre, #9C9183)",
                  backgroundColor: loc === l ? "rgba(216,169,91,0.08)" : "transparent",
                }}
              >
                {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/apply"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em]"
              style={{
                backgroundColor: "var(--cuivre, #E2702E)",
                color: "#fff",
              }}
            >
              {t("nav.start_free", l)}
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-[0.8rem] font-medium transition-colors"
              style={{ color: "var(--pierre, #9C9183)" }}
            >
              {t("nav.login", l)}
            </Link>
          </div>
        </nav>
      </div>
    </nav>
  );
}
