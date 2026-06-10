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
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  "pt-BR": "🇧🇷",
  de: "🇩🇪",
  it: "🇮🇹",
};

const LOCALE_LABELS: Record<string, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
  "pt-BR": "BR",
  de: "DE",
  it: "IT",
};

const ALL_LOCALES = ["fr", "en", "es", "pt-BR", "de", "it"] as Locale[];

interface NavItem {
  href: string;
  labelKey: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/features", labelKey: "nav.features" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/protection", labelKey: "nav.protection" },
  { href: "/blog", labelKey: "nav.blog" },
];

export function Navbar() {
  const locale = useLocale();
  const l = norm(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const localePattern = /^\/(fr|en|es|pt|de|it)(\/|$)/;
  const currentPath = pathname;

  const switchLocale = (newLocale: Locale) => {
    const code = newLocale === "pt-BR" ? "pt" : newLocale;
    if (localePattern.test(currentPath)) {
      window.location.href = currentPath.replace(localePattern, `/${code}$2`);
    } else {
      window.location.href = `/${code}${currentPath === "/" ? "" : currentPath}`;
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500"
      style={{
        background: scrolled ? "var(--bg-surface)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-default)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-semibold text-lg tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Halo
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 text-[0.8rem] font-medium uppercase tracking-[0.05em] transition-colors duration-200"
              style={{
                color: isActive(item.href) ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {t(item.labelKey, l)}
              <span
                className="absolute -bottom-0.5 left-0 h-[2px] transition-all duration-300"
                style={{
                  width: isActive(item.href) ? "100%" : "0%",
                  backgroundColor: "var(--accent)",
                }}
              />
            </Link>
          ))}

          <div className="flex items-center gap-3 ml-4">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    {ALL_LOCALES.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors"
                        style={{
                          color: loc === l ? "var(--accent)" : "var(--text-secondary)",
                          backgroundColor: loc === l ? "var(--accent-soft)" : "transparent",
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
              className="text-[0.75rem] font-medium uppercase tracking-[0.05em] transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("nav.login", l)}
            </Link>

            {/* CTA */}
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-6 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-text, #fff)",
              }}
            >
              {t("nav.start_free", l)}
            </Link>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50"
          style={{ color: "var(--text-primary)" }}
          aria-label="Menu"
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="block w-6 h-px" style={{ backgroundColor: "var(--text-primary)" }} />
              <span className="block w-6 h-px" style={{ backgroundColor: "var(--text-primary)" }} />
              <span className="block w-4 h-px" style={{ backgroundColor: "var(--text-primary)" }} />
            </div>
          )}
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: "var(--bg-primary)",
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
                color: isActive(item.href) ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {t(item.labelKey, l)}
            </Link>
          ))}

          {/* Mobile language switcher */}
          <div className="flex items-center gap-3 mt-4">
            {ALL_LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  switchLocale(loc);
                  setIsOpen(false);
                }}
                className="text-sm px-2 py-1 rounded-sm transition-colors"
                style={{
                  color: loc === l ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: loc === l ? "var(--accent-soft)" : "transparent",
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
                backgroundColor: "var(--accent)",
                color: "var(--accent-text, #fff)",
              }}
            >
              {t("nav.start_free", l)}
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-[0.8rem] font-medium transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("nav.login", l)}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
