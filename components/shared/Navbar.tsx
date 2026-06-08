"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/manifeste", label: "Manifeste" },
  { href: "/departments", label: "Départements" },
  { href: "/commissions", label: "Commissions" },
  { href: "/talents", label: "Talents" },
  { href: "/saas", label: "SaaS" },
  { href: "/apply", label: "Postuler" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-sm">
      <Container>
        <nav className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-display text-2xl italic tracking-wide text-brand-ivory hover:text-brand-gold transition-colors"
          >
            Halo Talent
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-taupe uppercase tracking-[0.12em] hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-sm uppercase tracking-[0.12em] px-5 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                Connexion
              </Link>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-ivory"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-brand-taupe uppercase tracking-[0.12em] hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-block text-sm uppercase tracking-[0.12em] px-5 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                Connexion
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </header>
  );
}
