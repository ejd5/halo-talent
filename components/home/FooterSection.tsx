import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Studio IA", href: "/studio" },
  { label: "Atlas CRM", href: "/atlas" },
  { label: "Bouclier Légal", href: "/protection" },
  { label: "Command Center", href: "/admin" },
  { label: "Tarifs", href: "/pricing" },
];

const RESOURCE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Guides", href: "/guides" },
  { label: "Glossaire", href: "/glossary" },
  { label: "Démo", href: "/demo" },
];

const LEGAL_LINKS = [
  { label: "CGV", href: "/legal/cgv" },
  { label: "CGU", href: "/legal/cgu" },
  { label: "Confidentialité", href: "/legal/privacy" },
  { label: "Mentions légales", href: "/legal/mentions" },
];

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: "var(--text-tertiary)" }}>
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm transition-all duration-200 hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterSection() {
  return (
    <footer style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--border-default)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-20">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <LinkColumn title="Produit" links={PRODUCT_LINKS} />
          <LinkColumn title="Ressources" links={RESOURCE_LINKS} />
          <LinkColumn title="Légal" links={LEGAL_LINKS} />
          <div>
            <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: "var(--text-tertiary)" }}>
              Contact
            </h4>
            <ul className="space-y-2.5 mb-6">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-200 hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[0.6rem]" style={{ color: "var(--text-tertiary)" }}>
              contact@halotalent.com
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-6" style={{ backgroundColor: "var(--border-default)" }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.65rem]" style={{ color: "var(--text-tertiary)" }}>
            &copy; 2026 Halo Talent. Tous droits réservés.
          </p>
          <p className="text-[0.55rem] text-center max-w-xl leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Halo Talent ne fournit pas de conseil juridique. Le Bouclier Légal est un outil d&apos;aide à la décision.
          </p>
        </div>
      </div>
    </footer>
  );
}
