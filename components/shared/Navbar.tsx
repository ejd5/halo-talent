"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/manifeste", label: "Manifeste" },
  { href: "/departments", label: "Départements" },
  { href: "/commissions", label: "Commissions" },
  { href: "/protection", label: "Bouclier Légal" },
  { href: "/saas", label: "SaaS" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 font-sans text-[0.8rem] font-medium text-ink-secondary uppercase tracking-[0.05em] transition-colors duration-200 group"
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-[2px] bg-accent transition-all duration-300"
                style={{
                  width: isActive(link.href) ? "100%" : "0%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) (e.target as HTMLElement).style.width = "100%";
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) (e.target as HTMLElement).style.width = "0%";
                }}
              />
            </Link>
          ))}

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display text-[2rem] font-bold text-ink uppercase tracking-[0.02em] hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
