"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Globe,
  Users,
  Zap,
  X,
  Check,
  Star,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────

const ANTI_DETECT_TOOLS = [
  {
    name: "GoLogin",
    tag: "Recommandé",
    pricing: "Free / $24 / $79 / $149 / mois",
    origin: "Émirats Arabes Unis",
    strengths: ["53 paramètres fingerprint", "API REST complète", "UX user-friendly"],
    limit: "Risque de ban selon usage",
    // TODO: Remplacer par l'URL d'affiliation réelle avec ton UTM
    affiliateUrl: "https://gologin.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.5/5",
  },
  {
    name: "AdsPower",
    pricing: "Free / $9 / $49 / $269 / mois",
    origin: "Hong Kong",
    strengths: ["RPA automation intégré", "Grande communauté tech", "Mises à jour fréquentes"],
    limit: "Interface complexe pour débutants",
    affiliateUrl: "https://adspower.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.2/5",
  },
  {
    name: "Multilogin",
    pricing: "€79 / €199 / €399 / mois",
    origin: "Estonie",
    strengths: ["Fingerprints les plus avancés", "Support enterprise", "Stabilité exemplaire"],
    limit: "Cher, usage enterprise",
    affiliateUrl: "https://multilogin.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.7/5",
  },
  {
    name: "Dolphin Anty",
    pricing: "Free / $10 / $19 / $89 / mois",
    origin: "Russie",
    strengths: ["Plan gratuit très généreux", "Profils illimités en free", "Proxy intégré"],
    limit: "Maintenance moins active récemment",
    affiliateUrl: "https://dolphinanty.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.0/5",
  },
];

const PROXY_TOOLS = [
  {
    name: "BrightData",
    pricing: "À partir de $0.60/GB (résidentiel)",
    origin: "Israël",
    strengths: ["Plus grand pool IP mondial", "99.9% uptime SLA", "API sophistiquée"],
    limit: "Prix plus élevé que la moyenne",
    affiliateUrl: "https://brightdata.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.6/5",
  },
  {
    name: "Oxylabs",
    pricing: "À partir de $0.80/GB (résidentiel)",
    origin: "Lituanie",
    strengths: ["Réseau 100M+ IPs", "Support 24/7 premium", "Rotation auto avancée"],
    limit: "Ticket d'entrée élevé",
    affiliateUrl: "https://oxylabs.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.5/5",
  },
  {
    name: "Smartproxy",
    pricing: "À partir de $0.50/GB (résidentiel)",
    origin: "Chypre",
    strengths: ["Excellent rapport qualité/prix", "Dashboard intuitif", "Documentation claire"],
    limit: "Pool IP plus modeste",
    affiliateUrl: "https://smartproxy.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.3/5",
  },
  {
    name: "IPRoyal",
    pricing: "À partir de $0.35/GB (résidentiel)",
    origin: "Lettonie",
    strengths: ["Moins cher du marché", "Paiement crypto accepté", "Pas de logs"],
    limit: "Support plus lent",
    affiliateUrl: "https://iproyal.com/?utm_source=halo&utm_medium=pro_mode&utm_campaign=affiliate",
    rating: "4.0/5",
  },
];

const ENGAGEMENT_TOOLS = [
  {
    name: "Jarvee",
    warning: "Bans massifs historiques (2021). Plus de support actif. Déconseillé.",
    severity: "critical" as const,
  },
  {
    name: "Inflact",
    warning: "Fonctionnalités automatisées à risque. Utilisation modérée possible.",
    severity: "warning" as const,
  },
  {
    name: "Combin",
    warning: "Automation de growth problématique. Risque de shadowban.",
    severity: "warning" as const,
  },
  {
    name: "SocialPilot",
    warning: "Planification OK mais automation d'engagement = risque.",
    severity: "warning" as const,
  },
];

const FAQ_ITEMS = [
  {
    q: "Pourquoi ne pas intégrer ces outils directement ?",
    r: "Notre promesse Zero Ban Guarantee repose sur l'utilisation exclusive d'APIs officielles. Intégrer ces outils compromettrait cette promesse pour tous nos créateurs.",
  },
  {
    q: "Vais-je perdre ma Zero Ban Guarantee si je les utilise ?",
    r: "Partiellement. Si un ban est lié à votre usage de ces outils (constaté par investigation), il n'est pas couvert. Les incidents sur les comptes gérés via notre plateforme restent garantis.",
  },
  {
    q: "L'agence a-t-elle des accords commerciaux avec ces outils ?",
    r: "Oui. Nous percevons des commissions d'affiliation sur certains liens. Ces revenus financent les outils gratuits que nous offrons à notre communauté. Notre transparence est totale — chaque lien affilié est identifié.",
  },
  {
    q: "Quelle est l'alternative légale ?",
    r: "Le Co-management officiel via les rôles Meta Business Suite, TikTok Business Center, et Brand Account YouTube. Voir notre module Co-management pour configurer ces accès sans risque.",
  },
];

// ─── Tool Card ─────────────────────────────────────────────────

function ToolCard({
  tool,
  children,
}: {
  tool: (typeof ANTI_DETECT_TOOLS)[number] | (typeof PROXY_TOOLS)[number];
  children?: React.ReactNode;
}) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div
      className="p-4 transition-all"
      style={{
        backgroundColor: "rgba(245,240,235,0.03)",
        border: "1px solid rgba(245,240,235,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>
              {tool.name}
            </h3>
            {"tag" in tool && tool.tag && (
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 flex items-center gap-1"
                style={{
                  backgroundColor: "rgba(199,91,57,0.1)",
                  color: "#C75B39",
                  border: "1px solid rgba(199,91,57,0.2)",
                }}
              >
                <Star size={8} />
                {tool.tag}
              </span>
            )}
          </div>
          <p className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.3)" }}>
            {tool.origin}
          </p>
        </div>
        <span className="text-[10px] font-mono" style={{ color: "rgba(245,240,235,0.2)" }}>
          {tool.rating}
        </span>
      </div>

      {/* Pricing */}
      <div
        className="px-2.5 py-1.5 mb-3 text-[10px]"
        style={{
          backgroundColor: "rgba(245,240,235,0.03)",
          color: "rgba(245,240,235,0.4)",
          fontFamily: "monospace",
        }}
      >
        {tool.pricing}
      </div>

      {/* Strengths */}
      <div className="space-y-1 mb-3">
        {tool.strengths.map((s, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <Check size={10} className="shrink-0 mt-0.5" style={{ color: "#7A9A65" }} />
            <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Limitation */}
      {"limit" in tool && tool.limit && (
        <div className="flex items-start gap-1.5 mb-3">
          <AlertTriangle size={10} className="shrink-0 mt-0.5" style={{ color: "#C75B39" }} />
          <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            {tool.limit}
          </span>
        </div>
      )}

      {/* Disclaimer toggle */}
      <button
        onClick={() => setShowDisclaimer(!showDisclaimer)}
        className="w-full text-[9px] py-1.5 transition-all flex items-center justify-center gap-1"
        style={{
          backgroundColor: showDisclaimer
            ? "rgba(199,91,57,0.08)"
            : "rgba(245,240,235,0.03)",
          color: showDisclaimer
            ? "#C75B39"
            : "rgba(245,240,235,0.2)",
        }}
      >
        <AlertTriangle size={8} />
        {showDisclaimer ? "Masquer" : "Voir"} le disclaimer légal
      </button>

      {showDisclaimer && (
        <div
          className="mt-2 p-2 text-[9px] leading-relaxed"
          style={{
            backgroundColor: "rgba(196,69,54,0.06)",
            border: "1px solid rgba(196,69,54,0.1)",
            color: "rgba(245,240,235,0.4)",
          }}
        >
          ⚠️ L&apos;utilisation de cet outil peut violer les CGU de Meta, TikTok,
          ou OnlyFans selon votre cas d&apos;usage. Vérifiez avant utilisation.
        </div>
      )}

      {/* Affiliate link */}
      <a
        href={tool.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="w-full text-[10px] font-semibold py-2 mt-2 transition-all flex items-center justify-center gap-1.5 hover:opacity-80"
        style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
      >
        Voir le site
        <ExternalLink size={9} />
      </a>

      {children}
    </div>
  );
}

// ─── Engagement Tool Row ────────────────────────────────────────

function EngagementToolRow({
  tool,
}: {
  tool: (typeof ENGAGEMENT_TOOLS)[number];
}) {
  return (
    <div
      className="flex items-start justify-between p-3"
      style={{
        backgroundColor:
          tool.severity === "critical"
            ? "rgba(196,69,54,0.06)"
            : "rgba(199,91,57,0.04)",
        borderLeft: `3px solid ${
          tool.severity === "critical" ? "#C44536" : "#C75B39"
        }`,
      }}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          size={12}
          className="shrink-0 mt-0.5"
          style={{
            color: tool.severity === "critical" ? "#C44536" : "#C75B39",
          }}
        />
        <div>
          <span className="text-xs font-semibold" style={{ color: "#F5F0EB" }}>
            {tool.name}
          </span>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>
            {tool.warning}
          </p>
        </div>
      </div>
      <span
        className="text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 shrink-0"
        style={{
          backgroundColor:
            tool.severity === "critical"
              ? "rgba(196,69,54,0.1)"
              : "rgba(199,91,57,0.1)",
          color:
            tool.severity === "critical" ? "#C44536" : "#C75B39",
        }}
      >
        {tool.severity === "critical" ? "Éviter" : "Risqué"}
      </span>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function ProModePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!confirm("Es-tu sûr de vouloir révoquer ton accès Pro Mode ?")) return;
    setRevoking(true);
    try {
      await fetch("/api/integrations/pro-mode/revoke", { method: "DELETE" });
      router.push("/dashboard/integrations/pro-mode/acknowledge");
    } catch {
      // ignore
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* ═══ Header ═══ */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} style={{ color: "#C75B39" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5"
              style={{
                backgroundColor: "rgba(199,91,57,0.1)",
                color: "#C75B39",
                border: "1px solid rgba(199,91,57,0.2)",
              }}
            >
              Pro Mode
            </span>
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Outils avancés
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Documentation exploratoire — utilisation sous votre responsabilité
          </p>
        </div>
        <button
          onClick={handleRevoke}
          disabled={revoking}
          className="text-[9px] px-2 py-1 transition-all hover:opacity-70 flex items-center gap-1"
          style={{ color: "rgba(245,240,235,0.15)" }}
        >
          <X size={8} />
          {revoking ? "Révocation..." : "Révoquer mon accès Pro Mode"}
        </button>
      </div>

      {/* ═══ Category 1 — Anti-detect Browsers ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Globe size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Anti-detect Browsers
          </h2>
        </div>
        <p
          className="text-xs leading-relaxed mb-6"
          style={{ color: "rgba(245,240,235,0.4)" }}
        >
          Les anti-detect browsers créent des profils navigateurs uniques
          (fingerprint, IP, user-agent, fuseau horaire, polices) pour faire
          croire à une plateforme que chaque compte est utilisé par une personne
          différente sur un device différent.
        </p>
        <p
          className="text-[10px] leading-relaxed mb-6 p-3"
          style={{
            backgroundColor: "rgba(245,240,235,0.03)",
            borderLeft: "2px solid rgba(245,240,235,0.1)",
            color: "rgba(245,240,235,0.3)",
          }}
        >
          <strong style={{ color: "rgba(245,240,235,0.5)" }}>
            Usages légitimes documentés :{" "}
          </strong>
          gestion de comptes pour différents clients par une agence, tests
          cross-browser pour QA, recherche académique.
          <br />
          <strong style={{ color: "#C75B39" }}>Risques :</strong> violation
          potentielle des CGU de Meta/TikTok/OnlyFans selon votre usage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ANTI_DETECT_TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      {/* ═══ Category 2 — Residential Proxies ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Proxies Résidentiels
          </h2>
        </div>
        <p
          className="text-xs leading-relaxed mb-6"
          style={{ color: "rgba(245,240,235,0.4)" }}
        >
          Les proxies résidentiels acheminent votre trafic via des IPs
          appartenant à des fournisseurs d&apos;accès réels, rendant la
          connexion indiscernable d&apos;un utilisateur classique. Essentiels
          pour le multi-comptes à échelle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROXY_TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      {/* ═══ Category 3 — Engagement Automation (warning) ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} style={{ color: "#C44536" }} />
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
          >
            Outils d&apos;engagement automatisé
          </h2>
        </div>
        <div
          className="p-3 mb-4 text-xs leading-relaxed flex items-start gap-2"
          style={{
            backgroundColor: "rgba(196,69,54,0.08)",
            border: "1px solid rgba(196,69,54,0.15)",
            color: "rgba(245,240,235,0.5)",
          }}
        >
          <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: "#C44536" }} />
          <span>
            Cette catégorie a historiquement causé des bans massifs. Utilisez
            avec <strong style={{ color: "#C44536" }}>extrême précaution</strong>{" "}
            ou évitez.
          </span>
        </div>

        <div className="space-y-2">
          {ENGAGEMENT_TOOLS.map((tool) => (
            <EngagementToolRow key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section>
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
        >
          Questions fréquentes
        </h2>
        <div className="space-y-1">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="transition-all"
              style={{
                backgroundColor: openFaq === i ? "rgba(199,91,57,0.04)" : "transparent",
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <span className="text-xs font-medium pr-4" style={{ color: "#F5F0EB" }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={12}
                  className="shrink-0 transition-transform"
                  style={{
                    color: "rgba(245,240,235,0.2)",
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {openFaq === i && (
                <div
                  className="px-3 pb-3 text-[11px] leading-relaxed"
                  style={{ color: "rgba(245,240,235,0.5)" }}
                >
                  {item.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Footer Actions ═══ */}
      <section
        className="p-4 space-y-2"
        style={{
          backgroundColor: "rgba(245,240,235,0.02)",
          border: "1px solid rgba(245,240,235,0.06)",
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => router.push("/dashboard/integrations/pro-mode/acknowledge")}
            className="flex-1 text-[10px] font-medium py-2.5 transition-all hover:opacity-70"
            style={{
              backgroundColor: "rgba(245,240,235,0.04)",
              color: "rgba(245,240,235,0.3)",
              border: "1px solid rgba(245,240,235,0.06)",
            }}
          >
            Revoir le disclaimer
          </button>
          <button
            onClick={handleRevoke}
            disabled={revoking}
            className="flex-1 text-[10px] font-medium py-2.5 transition-all hover:opacity-70"
            style={{
              backgroundColor: "rgba(196,69,54,0.08)",
              color: "#C44536",
              border: "1px solid rgba(196,69,54,0.15)",
            }}
          >
            {revoking ? "Révocation..." : "Révoquer mon accès Pro Mode"}
          </button>
          <Link
            href="/dashboard/integrations"
            className="flex-1 text-[10px] font-medium py-2.5 text-center transition-all hover:opacity-80 flex items-center justify-center gap-1.5"
            style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
          >
            <Shield size={10} />
            Voir Co-management (alternative légale)
          </Link>
        </div>
        <p
          className="text-[9px] text-center pt-2"
          style={{ color: "rgba(245,240,235,0.1)" }}
        >
          Version v1.0 — Dernière mise à jour : juin 2026 —
          <button
            onClick={() => router.push("/dashboard/integrations/pro-mode/acknowledge")}
            className="underline underline-offset-2 hover:opacity-70 ml-1"
          >
            Voir l&apos;historique du disclaimer
          </button>
        </p>
      </section>
    </div>
  );
}
