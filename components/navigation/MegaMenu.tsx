"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { MEGA_MENU } from "@/lib/marketing/mega-menu-data";
import { ChevronDown } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const locale = useLocale();
  const l = norm(locale);
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
        setMobileOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleEnter = useCallback((i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 200);
  }, []);

  const toggleMobile = (i: number) => {
    setMobileOpen(mobileOpen === i ? null : i);
  };

  return (
    <div ref={containerRef} className={className} onMouseLeave={handleLeave}>
      {/* Desktop: top-level items */}
      <div className="hidden lg:flex items-center gap-0">
        {MEGA_MENU.map((entry, i) => {
          const hasColumns = !!entry.columns;
          const active = entry.href ? isActive(entry.href) : false;

          return (
            <div
              key={entry.labelKey}
              className="relative"
              onMouseEnter={() => hasColumns && handleEnter(i)}
            >
              {entry.href && !hasColumns ? (
                <Link
                  href={entry.href}
                  className="relative py-1 px-3 text-[11px] font-util tracking-[0.22em] uppercase transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-util), monospace",
                    color: active ? "var(--or, #D8A95B)" : "var(--pierre, #9C9183)",
                  }}
                  onClick={() => setOpenIndex(null)}
                >
                  {t(entry.labelKey, l)}
                </Link>
              ) : (
                <button
                  className="relative py-1 px-3 text-[11px] font-util tracking-[0.22em] uppercase transition-colors duration-200 inline-flex items-center gap-1"
                  style={{
                    fontFamily: "var(--font-util), monospace",
                    color: openIndex === i || active ? "var(--or, #D8A95B)" : "var(--pierre, #9C9183)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-expanded={openIndex === i}
                >
                  {t(entry.labelKey, l)}
                  <ChevronDown
                    size={10}
                    style={{
                      transform: openIndex === i ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
              )}

              {/* Dropdown panel */}
              {hasColumns && openIndex === i && (
                <div
                  className="absolute top-full left-0 pt-3 z-50"
                  onMouseEnter={() => handleEnter(i)}
                >
                  <div
                    className="flex gap-12 p-8 min-w-[520px]"
                    style={{
                      backgroundColor: "var(--surface, #1C1712)",
                      border: "1px solid var(--ligne, rgba(216,169,91,0.18))",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                  >
                    {entry.columns?.map((col) => (
                      <div key={col.titleKey} className="min-w-[200px]">
                        {col.href ? (
                          <Link
                            href={col.href}
                            className="block mb-4 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors"
                            style={{
                              color: "var(--or, #D8A95B)",
                              fontFamily: "var(--font-util), monospace",
                            }}
                            onClick={() => setOpenIndex(null)}
                          >
                            {t(col.titleKey, l)}
                          </Link>
                        ) : (
                          <p
                            className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em]"
                            style={{
                              color: "var(--or, #D8A95B)",
                              fontFamily: "var(--font-util), monospace",
                            }}
                          >
                            {t(col.titleKey, l)}
                          </p>
                        )}
                        <div className="space-y-2">
                          {col.items.map((item) => (
                            <Link
                              key={item.labelKey}
                              href={item.href}
                              className="block group py-1"
                              onClick={() => setOpenIndex(null)}
                            >
                              <span
                                className="block text-[13px] transition-colors duration-150"
                                style={{
                                  color: isActive(item.href) ? "var(--or, #D8A95B)" : "var(--ivoire, #F4EEE3)",
                                  fontFamily: "var(--font-body), sans-serif",
                                }}
                              >
                                {t(item.labelKey, l)}
                              </span>
                              {item.descriptionKey && (
                                <span
                                  className="block text-[11px] mt-0.5 transition-colors duration-150"
                                  style={{
                                    color: "var(--pierre, #9C9183)",
                                    fontFamily: "var(--font-body), sans-serif",
                                  }}
                                >
                                  {t(item.descriptionKey, l)}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: accordion menu (shown by parent via mobile toggle) */}
      <div className="lg:hidden">
        {MEGA_MENU.map((entry, i) => {
          const hasChildren = !!entry.columns;
          return (
            <div key={entry.labelKey} className="border-b" style={{ borderColor: "rgba(244,238,227,0.06)" }}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMobile(i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                    style={{ color: "var(--ivoire, #F4EEE3)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span
                      className="text-[1.1rem] font-medium"
                      style={{ fontFamily: "var(--font-display-alt), serif" }}
                    >
                      {t(entry.labelKey, l)}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileOpen === i ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                        color: "var(--pierre, #9C9183)",
                      }}
                    />
                  </button>
                  {mobileOpen === i && (
                    <div className="pb-4 space-y-2">
                      {entry.columns?.map((col) => (
                        <div key={col.titleKey}>
                          {col.href ? (
                            <Link
                              href={col.href}
                              className="block py-2 pl-4 text-[12px] uppercase tracking-[0.12em] font-semibold"
                              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
                            >
                              {t(col.titleKey, l)}
                            </Link>
                          ) : (
                            <p
                              className="py-2 pl-4 text-[12px] uppercase tracking-[0.12em] font-semibold"
                              style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
                            >
                              {t(col.titleKey, l)}
                            </p>
                          )}
                          {col.items.map((item) => (
                            <Link
                              key={item.labelKey}
                              href={item.href}
                              className="block py-2 pl-8 text-[14px] transition-colors"
                              style={{
                                color: isActive(item.href) ? "var(--or, #D8A95B)" : "var(--ivoire, #F4EEE3)",
                                fontFamily: "var(--font-body), sans-serif",
                              }}
                            >
                              {t(item.labelKey, l)}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={entry.href ?? "#"}
                  className="block py-4"
                  style={{ color: "var(--ivoire, #F4EEE3)" }}
                >
                  <span
                    className="text-[1.1rem] font-medium"
                    style={{ fontFamily: "var(--font-display-alt), serif" }}
                  >
                    {t(entry.labelKey, l)}
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
