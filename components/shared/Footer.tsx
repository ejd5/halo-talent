import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerColumns = [
  {
    title: "Maison",
    links: [
      { href: "/manifeste", label: "À propos" },
      { href: "/manifeste", label: "Manifeste" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Départements",
    links: [
      { href: "/departments", label: "Music & Performing Arts" },
      { href: "/departments", label: "Sport & Lifestyle" },
      { href: "/departments", label: "Business & Thought Leadership" },
      { href: "/departments", label: "Digital Creators" },
      { href: "/departments", label: "Talent Premium" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/contrat-type", label: "Contrat type" },
      { href: "#", label: "CGV" },
      { href: "#", label: "Confidentialité" },
      { href: "#", label: "RGPD" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-display text-xl italic tracking-wide text-brand-ivory"
            >
              Halo Talent
            </Link>
            <p className="mt-3 text-sm text-brand-taupe leading-relaxed">
              Une maison de management créatif premium et éthique.
            </p>
          </div>

          {/* Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-[0.15em] text-brand-gold mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-taupe hover:text-brand-ivory transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-taupe">
          <p>© {new Date().getFullYear()} Halo Talent. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.1em]">FR / EN / ES</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
