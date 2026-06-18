"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG, type SocialPlatform } from "@/lib/config/site";
import { HaloCoutureLogo } from "@/components/brand/HaloCoutureLogo";

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "IG",
  tiktok: "TT",
  linkedin: "IN",
  x: "X",
};

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email valide requis");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const d = await res.json();
        setError(d.error || "Erreur lors de l'inscription.");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div>
        <h5>Newsletter</h5>
        <p style={{ color: "var(--success, #4CAF50)", fontSize: "14px" }}>
          Merci pour votre inscription.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h5>Newsletter</h5>
      <p style={{ color: "var(--pierre, #9C9183)", fontSize: "14px", marginBottom: "18px" }}>
        Recevez les mises à jour produit et guides WTF.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="newsletter-line">
          <input
            type="email"
            placeholder="votre@email.com"
            aria-label="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "..." : "S'inscrire"}
          </button>
        </div>
      </form>
      {error && (
        <p style={{ color: "var(--danger, #C44536)", fontSize: "12px", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Footer() {
  const { socialLinks } = SITE_CONFIG;

  return (
    <footer className="footer-eco">
      <div className="wrap-eco" style={{ paddingTop: "90px", paddingBottom: "50px" }}>
        <div className="foot-grid">
          {/* Brand */}
          <div className="foot-brand">
            <Link href="/" className="inline-block mb-4">
              <HaloCoutureLogo size="md" variant="ivoire" />
            </Link>
            <p>Maison de management créatif. Faite avec conviction, pas avec des templates.</p>
            <div style={{ display: "flex", gap: "18px", color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util, Space Grotesk, monospace)", fontSize: "11px", letterSpacing: "0.15em" }}>
              {(Object.keys(socialLinks) as SocialPlatform[]).map((platform) => {
                const url = socialLinks[platform];
                const label = SOCIAL_LABELS[platform];
                if (!url) {
                  return <span key={platform}>{label}</span>;
                }
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5>Navigation</h5>
            <ul>
              <li><Link href="/qui-sommes-nous">Qui nous sommes</Link></li>
              <li><Link href="/manifeste">Manifeste</Link></li>
              <li><Link href="/commissions">Commissions</Link></li>
              <li><Link href="/protection">Bouclier Légal</Link></li>
              <li><Link href="/chat-ai">CHATEENG</Link></li>
              <li><Link href="/saas">SaaS</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5>Légal</h5>
            <ul>
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/confidentialite">Politique de confidentialité</Link></li>
              <li><Link href="/cgu">CGU</Link></li>
              <li><Link href="/contrat-type">Contrat type</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <NewsletterForm />
        </div>

        <div className="foot-base">
          <span>&copy; 2026 Where Talent Forms. Tous droits réservés.</span>
          <span>Where Talent Forms ne fournit pas de conseil juridique. <em>Fait avec conviction.</em></span>
        </div>
      </div>
    </footer>
  );
}
