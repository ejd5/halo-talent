"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, startTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { t } from "@/lib/i18n/legal";
import { useLocale } from "@/lib/i18n/use-locale";

interface NavItem {
  href?: string;
  label: string;
  icon?: React.ElementType;
  items?: { href: string; label: string; description?: string }[];
}

function getNavItems(locale: string): NavItem[] {
  return [
    { href: "/manifeste", label: "Manifeste" },
    { href: "/departments", label: "Départements" },
    { href: "/commissions", label: "Commissions" },
    {
      label: t("nav.label", locale),
      icon: ShieldCheck,
      items: [
        { href: "/protection", label: t("nav.legal_shield", locale), description: t("nav.legal_shield_desc", locale) },
        { href: "/protection#droits", label: t("nav.your_rights", locale), description: t("nav.your_rights_desc", locale) },
        { href: "/contrat-type", label: t("nav.contract_template", locale), description: t("nav.contract_template_desc", locale) },
      ],
    },
    { href: "/saas", label: "SaaS" },
  ];
}

export function Navbar() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const navItems = getNavItems(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu & dropdowns on route change
  useEffect(() => {
    startTransition(() => {
      setIsOpen(false);
      setActiveDropdown(null);
    });
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isSimple = (item: NavItem): item is NavItem & { href: string } =>
    !!item.href && !item.items;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500"
      style={{
        background: scrolled ? "rgba(245, 240, 235, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(26, 22, 20, 0.08)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-semibold text-ink uppercase tracking-[0.2em] text-[0.85rem]"
        >
          Halo Talent
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            if (isSimple(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative py-1 font-sans text-[0.8rem] font-medium text-ink-secondary uppercase tracking-[0.05em] transition-colors duration-200 group"
                >
                  {item.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-[2px] bg-accent transition-all duration-300"
                    style={{
                      width: isActive(item.href) ? "100%" : "0%",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href)) (e.target as HTMLElement).style.width = "100%";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href)) (e.target as HTMLElement).style.width = "0%";
                    }}
                  />
                </Link>
              );
            }

            // Dropdown item (Protection)
            const Icon = item.icon;
            const isOpen_ = activeDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                ref={dropdownRef}
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() =>
                    setActiveDropdown(isOpen_ ? null : item.label)
                  }
                  className="relative py-1 font-sans text-[0.8rem] font-medium text-ink-secondary uppercase tracking-[0.05em] transition-colors duration-200 group flex items-center gap-1.5"
                >
                  {Icon && <Icon size={14} strokeWidth={1.5} />}
                  {item.label}
                  <svg
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`transition-transform duration-200 ${isOpen_ ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1l3 3 3-3" />
                  </svg>
                  <span
                    className="absolute -bottom-0.5 left-0 h-[2px] bg-accent transition-all duration-300"
                    style={{ width: "100%" }}
                  />
                </button>

                {/* Dropdown panel */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 pointer-events-none"
                  style={{
                    opacity: isOpen_ ? 1 : 0,
                    transform: isOpen_
                      ? "translateX(-50%) translateY(0)"
                      : "translateX(-50%) translateY(-6px)",
                    transition: "opacity 0.18s ease, transform 0.18s ease",
                    pointerEvents: isOpen_ ? "auto" : "none",
                  }}
                >
                  <div className="bg-[#F5F0EB] border border-ink/10 min-w-[240px] shadow-xl">
                    <div className="py-2">
                      {item.items?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex flex-col px-5 py-3 hover:bg-ink/5 transition-colors group/link"
                        >
                          <span className="font-sans text-[0.8rem] font-semibold text-ink uppercase tracking-[0.05em] group-hover/link:text-accent transition-colors">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <span className="font-sans text-[0.7rem] text-ink-secondary/70 mt-0.5">
                              {sub.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-4 ml-4">
            <Link
              href="/login"
              className="font-sans text-[0.75rem] font-medium text-ink-secondary/70 hover:text-ink transition-colors uppercase tracking-[0.05em]"
            >
              Connexion
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-7 py-2.5 bg-accent text-white font-display text-[0.75rem] font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover transition-colors"
            >
              Postuler
            </Link>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-accent relative z-50"
          aria-label="Menu"
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="block w-6 h-px bg-ink" />
              <span className="block w-6 h-px bg-ink" />
              <span className="block w-4 h-px bg-ink" />
            </div>
          )}
        </button>
      </div>

      {/* ─── Mobile fullscreen overlay ─── */}
      <div
        className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300"
        style={{
          background: "#F5F0EB",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item) => {
            if (isSimple(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-display text-[2rem] font-bold text-ink uppercase tracking-[0.02em] hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              );
            }

            // Mobile: render dropdown items as individual links with icon
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-4">
                <span className="font-display text-[1.2rem] font-bold text-ink/40 uppercase tracking-[0.02em] flex items-center gap-2">
                  {Icon && <Icon size={18} strokeWidth={1.5} />}
                  {item.label}
                </span>
                <div className="flex flex-col items-center gap-3">
                  {item.items?.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className="font-display text-[1.6rem] font-bold text-ink uppercase tracking-[0.02em] hover:text-accent transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/apply"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white font-display text-[0.8rem] font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="font-sans text-[0.8rem] font-medium text-ink-secondary/70 hover:text-ink transition-colors"
            >
              Connexion
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
