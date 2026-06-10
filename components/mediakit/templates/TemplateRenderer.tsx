"use client";

import { formatNumber } from "./utils";
import type { MediaKitState, PlatformStat, PortfolioItem, PricingTier, AudienceDemographics } from "@/lib/mediakit/types";

/* ─── Theme overrides per template ─── */

const TEMPLATE_STYLES = {
  minimal: {
    page: "max-w-[800px] mx-auto bg-white text-gray-900",
    headerBg: "bg-gray-50",
    sectionBorder: "border-gray-100",
    accent: (c: string) => c,
    font: "font-sans",
    statCard: "bg-gray-50 rounded-lg",
    heading: "text-gray-800 font-semibold tracking-tight",
    badge: "bg-gray-100 text-gray-600",
  },
  bold: {
    page: "max-w-[800px] mx-auto",
    headerBg: "",
    sectionBorder: "border-gray-200",
    accent: (c: string) => c,
    font: "font-sans",
    statCard: "rounded-lg",
    heading: "font-bold uppercase tracking-wider",
    badge: "rounded-full",
  },
  creative: {
    page: "max-w-[800px] mx-auto",
    headerBg: "",
    sectionBorder: "border-gray-200/30",
    accent: (c: string) => c,
    font: "font-sans",
    statCard: "rounded-2xl backdrop-blur-sm",
    heading: "font-bold",
    badge: "rounded-full",
  },
};

/* ─── Props ─── */
interface TemplateRendererProps {
  state: MediaKitState;
  forPrint?: boolean;
}

/* ─── Main renderer ─── */
export function TemplateRenderer({ state, forPrint }: TemplateRendererProps) {
  const { data, template } = state;
  const accent = data.profile.accentColor || "var(--accent)";
  const style = TEMPLATE_STYLES[template];

  const selectedPortfolio = data.portfolio.filter((p) =>
    state.selectedPortfolio.includes(p.id)
  );

  return (
    <div
      id="mediakit-content"
      className={`${style.page} ${forPrint ? "p-8" : "p-6"} ${style.font}`}
      style={{ fontFamily: forPrint ? "system-ui, sans-serif" : undefined }}
    >
      {/* ═══ HEADER ═══ */}
      <HeaderSection data={data} style={style} accent={accent} template={template} />

      {/* ═══ BIO ═══ */}
      {data.profile.bio && (
        <Section title="" style={style}>
          <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
            {data.profile.bio}
          </p>
        </Section>
      )}

      {/* ═══ STATS ═══ */}
      {state.showStats && (
        <Section title="Statistiques" style={style}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.stats.map((s) => (
              <StatCard key={s.platform} stat={s} template={template} accent={accent} />
            ))}
          </div>
          <div className="mt-4">
            <DemographicsBadges demographics={data.demographics} accent={accent} />
          </div>
        </Section>
      )}

      {/* ═══ PORTFOLIO ═══ */}
      {state.showPortfolio && selectedPortfolio.length > 0 && (
        <Section title="Portfolio" style={style}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedPortfolio.slice(0, 4).map((item) => (
              <PortfolioCard key={item.id} item={item} template={template} accent={accent} />
            ))}
          </div>
        </Section>
      )}

      {/* ═══ PRICING ═══ */}
      {state.showPricing && (
        <Section title="Tarifs de collaboration" style={style}>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${template === "bold" ? "md:grid-cols-4" : ""}`}>
            {data.pricing.map((p) => (
              <PricingCard key={p.id} pricing={p} template={template} accent={accent} />
            ))}
          </div>
        </Section>
      )}

      {/* ═══ CONTACT ═══ */}
      <Section title="Contact" style={style}>
        <div className="flex flex-wrap gap-3 items-center text-sm" style={{ color: "#4B5563" }}>
          <span>✉️ {data.contactEmail}</span>
          {data.bookingLink && (
            <a
              href={data.bookingLink}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded"
              style={{ backgroundColor: accent, color: "#fff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Réserver un call
            </a>
          )}
        </div>
        {data.socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.socialLinks.map((link) => (
              <span
                key={link.platform}
                className="text-[10px] px-2 py-0.5 rounded"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                {link.platform}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* ═══ FOOTER ═══ */}
      <div className="text-center pt-6 mt-6" style={{ borderTop: "1px solid #E5E7EB" }}>
        <p className="text-[9px]" style={{ color: "#9CA3AF" }}>
          Généré par Halo Talent · {data.profile.pseudo} · {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function HeaderSection({
  data, style, accent, template,
}: {
  data: TemplateRendererProps["state"]["data"];
  style: typeof TEMPLATE_STYLES.minimal;
  accent: string;
  template: string;
}) {
  if (template === "bold") {
    return (
      <div className="text-center py-8 mb-6" style={{ backgroundColor: accent }}>
        <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
          {data.profile.name[0]}
        </div>
        <h1 className="text-2xl font-bold text-white">{data.profile.name}</h1>
        <p className="text-sm mt-1 text-white/80">@{data.profile.pseudo}</p>
        <div className="flex justify-center gap-2 mt-2 text-[10px] text-white/70">
          <span>{data.profile.languages.join(" · ")}</span>
          <span>•</span>
          <span>{data.profile.country}</span>
        </div>
      </div>
    );
  }

  if (template === "creative") {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` }}>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {data.profile.name[0]}
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">{data.profile.name}</h1>
            <p className="text-sm text-white/80">@{data.profile.pseudo}</p>
            <div className="flex gap-2 mt-1 text-[10px] text-white/70">
              <span>{data.profile.languages.join(" · ")}</span>
              <span>•</span>
              <span>{data.profile.country}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal
  return (
    <div className="flex items-center gap-4 pb-6 mb-6" style={{ borderBottom: "1px solid #E5E7EB" }}>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
        style={{ backgroundColor: accent }}
      >
        {data.profile.name[0]}
      </div>
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#1F2937" }}>{data.profile.name}</h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>@{data.profile.pseudo}</p>
        <div className="flex gap-2 mt-1 text-[10px]" style={{ color: "#9CA3AF" }}>
          <span>{data.profile.languages.join(" · ")}</span>
          <span>•</span>
          <span>{data.profile.country}</span>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, children, style,
}: {
  title: string;
  children: React.ReactNode;
  style: typeof TEMPLATE_STYLES.minimal;
}) {
  return (
    <div className="mb-6">
      {title && (
        <h2 className={`text-xs mb-3 ${style.heading}`} style={{ color: "#374151" }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function StatCard({
  stat, template, accent,
}: {
  stat: PlatformStat;
  template: string;
  accent: string;
}) {
  const bg = template === "bold" ? `${accent}10` : "bg-gray-50";
  return (
    <div className={`p-3 text-center ${template === "minimal" ? "bg-gray-50 rounded-lg" : template === "creative" ? "rounded-2xl" : "rounded-lg"}`}
      style={template !== "minimal" ? { backgroundColor: `${accent}08` } : undefined}
    >
      <p className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{stat.platform}</p>
      <p className="text-lg font-bold" style={{ color: "#1F2937" }}>{formatNumber(stat.followers)}</p>
      <div className="flex justify-center gap-2 mt-1 text-[9px]" style={{ color: "#9CA3AF" }}>
        <span>Eng. {stat.engagement}%</span>
        <span>•</span>
        <span>+{stat.growth}%/m</span>
      </div>
    </div>
  );
}

function DemographicsBadges({
  demographics, accent,
}: {
  demographics: AudienceDemographics;
  accent: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {demographics.ageGroups.map((g) => (
        <div key={g.label} className="flex items-center gap-1.5 text-[10px]" style={{ color: "#6B7280" }}>
          <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: "#E5E7EB" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${g.pct}%`, backgroundColor: accent }} />
          </div>
          {g.label} {g.pct}%
        </div>
      ))}
    </div>
  );
}

function PortfolioCard({
  item, template, accent,
}: {
  item: PortfolioItem;
  template: string;
  accent: string;
}) {
  return (
    <div className={`p-3 ${template === "creative" ? "rounded-2xl" : "rounded-lg"}`}
      style={{ backgroundColor: `${accent}05`, border: `1px solid ${accent}15` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${accent}10`, color: accent }}
        >
          {item.platform}
        </span>
        <span className="text-[9px]" style={{ color: "#9CA3AF" }}>{item.type}</span>
      </div>
      <p className="text-xs font-medium mb-2" style={{ color: "#1F2937" }}>{item.title}</p>
      <div className="flex gap-3 text-[9px]" style={{ color: "#6B7280" }}>
        <span>{formatNumber(item.views)} vues</span>
        <span>•</span>
        <span>{item.engagement}% eng.</span>
      </div>
    </div>
  );
}

function PricingCard({
  pricing, template, accent,
}: {
  pricing: PricingTier;
  template: string;
  accent: string;
}) {
  return (
    <div className={`p-3 ${template === "creative" ? "rounded-2xl text-center" : "rounded-lg"}`}
      style={{ backgroundColor: `${accent}05`, border: `1px solid ${accent}15` }}
    >
      <p className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{pricing.label}</p>
      <p className="text-lg font-bold" style={{ color: "#1F2937" }}>{pricing.price}€</p>
      <p className="text-[9px] mt-1" style={{ color: "#9CA3AF" }}>{pricing.description}</p>
    </div>
  );
}
