"use client";

import Link from "next/link";
import {
  Zap, Shield, BarChart3, FileText, Archive, Languages,
  Radio, Star, Check, ChevronRight, Download,
  MessageSquare, DollarSign, Users, TrendingUp, Crown,
  Lock, RefreshCw,
} from "lucide-react";

// Simple fallback SVG for Chrome icon
function Chrome({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Radio,
    title: "Revenue Radar",
    desc: "Vos fans à fort potentiel en temps réel. Sachex qui est en ligne, leur LTV et leur risque de churn — au bon moment.",
    color: "#C75B39",
    badge: "EXCLUSIF",
    free: false,
  },
  {
    icon: Zap,
    title: "Chat Assist IA",
    desc: "3 suggestions personnalisées par conversation. Insérez en 1 clic, modifiez, régénérez. Ton ajustable : Flirty, Friendly, Mystère, Upsell, Direct.",
    color: "#D8A95B",
    badge: null,
    free: true,
  },
  {
    icon: Archive,
    title: "Vault Check",
    desc: "Vérification anti-doublon avant d'envoyer un contenu. Prix optimal suggéré par l'IA selon l'historique d'achat du fan.",
    color: "#10B981",
    badge: null,
    free: false,
  },
  {
    icon: FileText,
    title: "Scripts Bibliothèque",
    desc: "100+ scripts catégorisés (Bienvenue, PPV, Relance, Remerciement…). Recherche instantanée, variables dynamiques {fan_name}.",
    color: "#8B5CF6",
    badge: null,
    free: false,
  },
  {
    icon: BarChart3,
    title: "Analytics Instantanés",
    desc: "Revenus du jour, semaine et mois. Top 5 fans. Heatmap des créneaux d'activité optimaux. Le tout dans votre navigateur.",
    color: "#3B82F6",
    badge: null,
    free: false,
  },
  {
    icon: Languages,
    title: "Traduction IA",
    desc: "Communiquez avec des fans internationaux sans friction. Traduction contextuelle, maintien du ton de voix.",
    color: "#EC4899",
    badge: null,
    free: false,
  },
  {
    icon: Shield,
    title: "Tone Guard",
    desc: "Badge de cohérence ADN sur chaque message. Assurez-vous que chaque message correspond à votre identité créatrice.",
    color: "#F59E0B",
    badge: null,
    free: true,
  },
  {
    icon: MessageSquare,
    title: "Fan Profile 360°",
    desc: "LTV, historique, sentiment, intérêts, score de churn, notes privées. Tout sur le fan actif, en contexte.",
    color: "#C75B39",
    badge: null,
    free: false,
  },
];

const PLANS = [
  {
    name: "Free",
    price: "0€",
    period: "/ mois",
    desc: "Découvrez l'essentiel sans engagement",
    color: "#9C9183",
    badge: null,
    features: [
      "Popup statut + mini stats",
      "Détection plateforme auto",
      "3 suggestions IA / jour",
      "Tone Guard basique",
      "Accès à la Knowledge Base",
    ],
    cta: "Installer gratuitement",
    ctaHref: "#install",
    highlight: false,
  },
  {
    name: "Starter",
    price: "Inclus",
    period: "dans votre plan",
    desc: "Pour les créateurs solo actifs",
    color: "#D8A95B",
    badge: "POPULAIRE",
    features: [
      "Tout ce qui est en Free",
      "Sidepanel complet débloqué",
      "Scripts illimités",
      "Fan Profile 360°",
      "Vault Check anti-doublon",
      "Analytics instantanés",
      "Tone Guard avancé",
    ],
    cta: "Voir le plan Starter",
    ctaHref: "/pricing",
    highlight: true,
  },
  {
    name: "Pro",
    price: "Inclus",
    period: "dans votre plan",
    desc: "Pour les agences et top créateurs",
    color: "#C75B39",
    badge: "MEILLEUR OUTIL",
    features: [
      "Tout ce qui est en Starter",
      "Revenue Radar en temps réel",
      "Traduction IA multi-langue",
      "Alertes whale & fan à risque",
      "LTV prédictif IA",
      "Accès équipe (co-management)",
      "Support prioritaire",
    ],
    cta: "Voir le plan Pro",
    ctaHref: "/pricing",
    highlight: false,
  },
];

const STEPS = [
  {
    num: "01",
    title: "Installer l'extension",
    desc: "Disponible sur le Chrome Web Store. Installation en 1 clic, aucune configuration requise.",
    icon: Chrome,
  },
  {
    num: "02",
    title: "Connecter votre compte Halo",
    desc: "Authentification sécurisée via votre compte Halo Talent existant. Chiffrement AES-256.",
    icon: Lock,
  },
  {
    num: "03",
    title: "Ouvrir une conversation",
    desc: "Sur OnlyFans, Fansly ou MYM, cliquez sur l'icône WTF Companion. Le sidepanel s'ouvre automatiquement.",
    icon: Zap,
  },
  {
    num: "04",
    title: "Laisser l'IA travailler",
    desc: "Revenue Radar, suggestions contextuelles, prix PPV optimal. Vous validez, vous envoyez, vous contrôlez.",
    icon: RefreshCw,
  },
];

const TESTIMONIALS = [
  {
    quote: "Le Revenue Radar m'a fait gagner 800€ la première semaine. Je savais exactement quel fan approcher et quand.",
    name: "Léa M.",
    role: "Créatrice · OnlyFans",
    ltv: "+38% LTV",
  },
  {
    quote: "J'avais peur que l'IA perde mon ton. Avec le Tone Guard, chaque message sonne comme moi. Mes fans ne voient aucune différence.",
    name: "Sofia R.",
    role: "Créatrice · Fansly + MYM",
    ltv: "×2 messages/jour",
  },
  {
    quote: "La bibliothèque de scripts seule vaut son pesant d'or. Plus besoin de réfléchir à chaque message PPV.",
    name: "Emma K.",
    role: "Manager · 12 créatrices",
    ltv: "-60% temps chatting",
  },
];

// ── Page ────────────────────────────────────────────────────

export default function WTFCompanionPage() {
  return (
    <div style={{ backgroundColor: "#0A0A0B", color: "#F5F0EB", fontFamily: "var(--font-body, Inter, sans-serif)", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 24px 80px",
          textAlign: "center",
          background: "radial-gradient(ellipse at top, rgba(199,91,57,0.12) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(245,240,235,0.06)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#C75B39",
                fontFamily: "monospace",
                padding: "4px 12px",
                border: "1px solid rgba(199,91,57,0.3)",
                backgroundColor: "rgba(199,91,57,0.08)",
              }}
            >
              EXTENSION CHROME — HALO TALENT
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 24,
              fontFamily: "var(--font-display, Georgia, serif)",
            }}
          >
            <span style={{ color: "#F5F0EB" }}>WTF Companion</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Votre co-pilote IA
            </span>
            <br />
            <span style={{ color: "#F5F0EB" }}>dans Chrome</span>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(245,240,235,0.6)", lineHeight: 1.7, marginBottom: 40, maxWidth: 620, margin: "0 auto 40px" }}>
            Revenue Radar, suggestions IA personnalisées, Vault anti-doublon, scripts, analytics et profil fan 360°.
            Directement dans votre navigateur, sur OnlyFans, Fansly et MYM.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a
              href="#install"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              <Chrome size={16} />
              Installer WTF Companion — Gratuit
            </a>
            <a
              href="#features"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: "#F5F0EB",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(245,240,235,0.15)",
              }}
            >
              Voir les fonctionnalités
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {["Chrome Web Store", "Manifest V3", "0 envoi automatique", "Données chiffrées AES-256"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(245,240,235,0.35)" }}>
                <Check size={11} style={{ color: "#10B981" }} />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATEFORMES ───────────────────────────────────── */}
      <section style={{ padding: "32px 24px", textAlign: "center", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(245,240,235,0.25)", marginBottom: 16, textTransform: "uppercase" }}>
          Compatible avec
        </p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {["OnlyFans", "Fansly", "MYM", "Instagram", "TikTok"].map((p) => (
            <span key={p} style={{ fontSize: 14, fontWeight: 600, color: "rgba(245,240,235,0.4)" }}>{p}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section style={{ padding: "60px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
          {[
            { value: "+38%", label: "LTV moyenne", sublabel: "chez nos créatrices actives", color: "#C75B39" },
            { value: "×2.4", label: "Messages / jour", sublabel: "grâce aux scripts et suggestions IA", color: "#D8A95B" },
            { value: "-60%", label: "Temps chatting", sublabel: "sur les réponses répétitives", color: "#10B981" },
            { value: "8", label: "Fonctionnalités", sublabel: "dans un seul outil Chrome", color: "#3B82F6" },
          ].map((s) => (
            <div
              key={s.value}
              style={{
                padding: "32px 24px",
                textAlign: "center",
                backgroundColor: "rgba(245,240,235,0.02)",
                border: "1px solid rgba(245,240,235,0.05)",
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 900, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB", marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "rgba(245,240,235,0.35)", marginTop: 4 }}>{s.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" style={{ padding: "80px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C75B39", marginBottom: 12, textTransform: "uppercase" }}>8 OUTILS EN 1</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F5F0EB", fontFamily: "var(--font-display, Georgia, serif)" }}>
              Tout ce dont vous avez besoin,<br />directement dans Chrome
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  style={{
                    padding: "28px 24px",
                    backgroundColor: "rgba(245,240,235,0.02)",
                    border: `1px solid ${f.badge ? f.color + "30" : "rgba(245,240,235,0.06)"}`,
                    position: "relative",
                    transition: "all 0.2s",
                  }}
                >
                  {f.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        padding: "3px 8px",
                        backgroundColor: `${f.color}15`,
                        color: f.color,
                        border: `1px solid ${f.color}30`,
                      }}
                    >
                      {f.badge}
                    </div>
                  )}
                  {f.free && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 8px",
                        backgroundColor: "rgba(16,185,129,0.1)",
                        color: "#10B981",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      FREE
                    </div>
                  )}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: `${f.color}12`,
                      border: `1px solid ${f.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F5F0EB", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(245,240,235,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMMENT CA MARCHE ────────────────────────────── */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)", background: "linear-gradient(180deg, rgba(199,91,57,0.04) 0%, transparent 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C75B39", marginBottom: 12, textTransform: "uppercase" }}>EN 4 ÉTAPES</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F5F0EB", fontFamily: "var(--font-display, Georgia, serif)" }}>
              Prêt en 2 minutes
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} style={{ textAlign: "center", padding: "32px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#C75B39", fontFamily: "monospace", marginBottom: 12, letterSpacing: "0.1em" }}>{s.num}</div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Icon size={22} style={{ color: "#fff" }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F5F0EB", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: "rgba(245,240,235,0.45)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────── */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#F5F0EB", fontFamily: "var(--font-display, Georgia, serif)" }}>
              Ce qu'elles en disent
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  padding: "28px",
                  backgroundColor: "rgba(245,240,235,0.02)",
                  border: "1px solid rgba(245,240,235,0.06)",
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} fill="#D8A95B" style={{ color: "#D8A95B" }} />)}
                </div>
                <p style={{ fontSize: 14, color: "rgba(245,240,235,0.7)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  &quot;{t.quote}&quot;
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(245,240,235,0.4)" }}>{t.role}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "4px 10px",
                      color: "#C75B39",
                      backgroundColor: "rgba(199,91,57,0.1)",
                      border: "1px solid rgba(199,91,57,0.2)",
                    }}
                  >
                    {t.ltv}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C75B39", marginBottom: 12, textTransform: "uppercase" }}>TARIFS</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F5F0EB", fontFamily: "var(--font-display, Georgia, serif)" }}>
              Commencez gratuitement,<br />montez en puissance avec Halo
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
            {PLANS.map((p) => (
              <div
                key={p.name}
                style={{
                  padding: "36px 28px",
                  backgroundColor: p.highlight ? "rgba(216,169,91,0.04)" : "rgba(245,240,235,0.02)",
                  border: p.highlight ? `2px solid ${p.color}` : "1px solid rgba(245,240,235,0.08)",
                  position: "relative",
                }}
              >
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "4px 12px",
                      backgroundColor: p.color,
                      color: p.highlight ? "#0A0A0B" : "#fff",
                      letterSpacing: "0.12em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: p.color, marginBottom: 8 }}>{p.name.toUpperCase()}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: "#F5F0EB", fontFamily: "monospace" }}>{p.price}</span>
                    <span style={{ fontSize: 12, color: "rgba(245,240,235,0.4)" }}>{p.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)" }}>{p.desc}</p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(245,240,235,0.7)" }}>
                      <Check size={14} style={{ color: p.color, marginTop: 1, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.ctaHref}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 20px",
                    backgroundColor: p.highlight ? p.color : "transparent",
                    color: p.highlight ? "#fff" : p.color,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    border: `1px solid ${p.color}`,
                    letterSpacing: "0.04em",
                  }}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTALL ───────────────────────────────────────── */}
      <section id="install" style={{ padding: "80px 24px", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C75B39", marginBottom: 12, textTransform: "uppercase" }}>INSTALLATION</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#F5F0EB", marginBottom: 16, fontFamily: "var(--font-display, Georgia, serif)" }}>
            Prêt à changer votre façon de chatter ?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(245,240,235,0.5)", marginBottom: 40 }}>
            Installez WTF Companion gratuitement. Aucune carte bancaire requise.
          </p>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "18px 36px",
              background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              textDecoration: "none",
              marginBottom: 16,
              letterSpacing: "0.04em",
            }}
          >
            <Chrome size={20} />
            Installer sur Chrome — Gratuit
            <Download size={16} />
          </a>
          <div style={{ fontSize: 11, color: "rgba(245,240,235,0.3)" }}>
            Chrome 120+ requis · Manifest V3 · Données chiffrées · Aucun envoi automatique
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#F5F0EB", textAlign: "center", marginBottom: 48, fontFamily: "var(--font-display, Georgia, serif)" }}>
            Questions fréquentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              {
                q: "L'extension envoie-t-elle des messages automatiquement ?",
                a: "Non. WTF Companion propose des suggestions. Vous êtes toujours celui qui valide et envoie. Aucune action n'est effectuée sans votre accord explicite.",
              },
              {
                q: "Mes données sont-elles partagées avec des tiers ?",
                a: "Vos données sont chiffrées localement (AES-256-GCM) et transmises uniquement aux serveurs Halo Talent via HTTPS. Aucune donnée n'est vendue ou partagée avec des tiers.",
              },
              {
                q: "L'extension fonctionne-t-elle sur Fansly et MYM ?",
                a: "Oui. WTF Companion est compatible avec OnlyFans, Fansly, MYM, Instagram et TikTok. Le sidepanel s'adapte automatiquement à la plateforme active.",
              },
              {
                q: "Faut-il déjà être client Halo Talent pour utiliser l'extension ?",
                a: "La version Free est accessible à tous sans compte Halo. Les fonctionnalités Starter et Pro nécessitent un abonnement Halo Talent actif.",
              },
              {
                q: "L'extension garantit-elle des résultats en termes de revenus ?",
                a: "Non. Les suggestions IA, les prix PPV recommandés et les alertes Revenue Radar sont indicatifs. Aucun revenu n'est garanti. Les résultats dépendent de votre utilisation.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                style={{
                  padding: "24px",
                  backgroundColor: "rgba(245,240,235,0.02)",
                  border: "1px solid rgba(245,240,235,0.06)",
                }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F5F0EB", marginBottom: 10 }}>{faq.q}</h3>
                <p style={{ fontSize: 13, color: "rgba(245,240,235,0.55)", lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
