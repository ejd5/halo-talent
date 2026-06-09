"use client";

import Link from "next/link";

const socialIcons = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 11v5" />
      <path d="M8 8v0" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="bg-dark">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 pt-20 md:pt-24 pb-0">
        {/* ─── Grille asymétrique ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* GAUCHE — 4/12 (40%) */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="font-display text-2xl font-bold text-dark-text tracking-tight"
            >
              Halo Talent
            </Link>
            <p className="mt-3 text-sm text-dark-muted max-w-xs leading-relaxed">
              Maison de management créatif
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-8">
              {Object.entries(socialIcons).map(([name, icon]) => (
                <Link
                  key={name}
                  href="#"
                  className="text-dark-muted hover:text-accent transition-colors duration-200"
                  aria-label={name}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* CENTRE — 3/12 (30%) */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-sans font-semibold text-accent uppercase tracking-[0.12em] mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/manifeste", label: "Manifeste" },
                { href: "/departements", label: "Départements" },
                { href: "/commissions", label: "Commissions" },
                { href: "/talents", label: "Talents" },
                { href: "/protection", label: "Bouclier Légal" },
                { href: "/saas", label: "SaaS" },
                { href: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-dark-muted hover:text-dark-text transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[11px] font-sans font-semibold text-accent uppercase tracking-[0.12em] mb-5 mt-10">
              Légal
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "#", label: "Mentions légales" },
                { href: "#", label: "Politique de confidentialité" },
                { href: "#", label: "CGU" },
                { href: "/contrat-type", label: "Contrat type" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-dark-muted hover:text-dark-text transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DROITE — 4/12 (30%) */}
          <div className="md:col-span-4 md:pl-8">
            <h4 className="text-[11px] font-sans font-semibold text-accent uppercase tracking-[0.12em] mb-5">
              Newsletter
            </h4>
            <p className="text-sm text-dark-muted mb-5 leading-relaxed">
              Restez informé des nouvelles de la maison.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3"
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-transparent border-b border-dark-muted/30 py-2.5 text-sm text-dark-text placeholder:text-dark-muted/40 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent text-white text-[12px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover shrink-0"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>

        {/* ─── Barre du bas ─── */}
        <div className="mt-20 md:mt-24 pt-6 pb-8 border-t border-dark-muted/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-dark-muted">
          <p>© {new Date().getFullYear()} Halo Talent. Tous droits réservés.</p>
          <p className="italic">
            Fait avec conviction, pas avec des templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
