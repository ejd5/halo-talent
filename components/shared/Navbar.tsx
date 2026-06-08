"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/manifeste", label: "Manifeste" },
  { href: "/departments", label: "Départements" },
  { href: "/commissions", label: "Commissions" },
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
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-base/95 backdrop-blur-xl",
        "border-b border-ink/10",
        scrolled ? "h-14" : "h-[72px]"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-display font-bold text-ink uppercase tracking-[0.04em] transition-all duration-300",
            scrolled ? "text-[15px]" : "text-[18px]"
          )}
        >
          Halo Talent
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-[13px] font-sans font-medium uppercase tracking-[0.05em] transition-colors duration-150 group",
                isActive(link.href)
                  ? "text-accent"
                  : "text-ink-muted hover:text-accent"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 h-[2px] bg-accent transition-all duration-300",
                  isActive(link.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}

          <div className="flex items-center gap-4 ml-4">
            <Link
              href="/login"
              className="text-[12px] font-sans font-medium text-ink-muted/70 hover:text-ink transition-colors duration-150"
            >
              Connexion
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler
            </Link>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-ink relative z-50"
          aria-label="Menu"
        >
          {isOpen ? (
            <X size={22} strokeWidth={1.5} />
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
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-base flex flex-col items-center justify-center transition-all duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "font-display text-[32px] font-bold text-ink uppercase tracking-[0.02em] transition-colors duration-150",
                isActive(link.href)
                  ? "text-accent"
                  : "hover:text-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/apply"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-[13px] font-sans font-medium text-ink-muted/70 hover:text-ink transition-colors duration-150"
            >
              Connexion
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
