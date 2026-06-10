"use client";

import { useState, useRef, useEffect } from "react";
import { DEMO_CAMPAIGN, DEMO_PPV, DEMO_VAULT_ITEMS, type PersonaId } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { BarChart3, TrendingUp, Image, Video, ShieldCheck, Eye, MousePointer, DollarSign } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function DemoAtlasStep({ persona }: { persona: PersonaId }) {
  const locale = useLocale();
  const l = norm(locale);

  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, []);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setLaunched(true);
      setShowTooltip(true);
      tooltipTimer.current = setTimeout(() => setShowTooltip(false), 4000);
    }, 2000);
  };

  return (
    <div className="animate-fade-in space-y-4 max-w-2xl mx-auto">
      {/* Campaign */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {t("demo_new.atlas.campaign_title", l).replace("{name}", DEMO_CAMPAIGN.name)}
        </h3>
        <p className="text-[9px] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("demo_new.atlas.segment", l).replace("{segment}", DEMO_CAMPAIGN.segment)}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {([
            { label: "demo_new.atlas.sent", value: DEMO_CAMPAIGN.stats.sent, icon: Eye },
            { label: "demo_new.atlas.opened", value: DEMO_CAMPAIGN.stats.opened, icon: MousePointer },
            { label: "demo_new.atlas.clicked", value: DEMO_CAMPAIGN.stats.clicked, icon: BarChart3 },
            { label: "demo_new.atlas.revenue", value: `${DEMO_CAMPAIGN.stats.revenue}€`, icon: DollarSign },
          ] as const).map((stat) => (
            <div key={stat.label} className="text-center p-2" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <stat.icon size={12} style={{ color: "rgba(255,255,255,0.3)", margin: "0 auto 4px" }} />
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{t(stat.label, l)}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleLaunch}
          disabled={launching || launched}
          className="text-[10px] px-3 py-1.5 transition-all"
          style={{
            backgroundColor: launched ? "rgba(16,185,129,0.1)" : launching ? "rgba(255,255,255,0.04)" : "rgba(199,91,57,0.12)",
            color: launched ? "var(--success)" : launching ? "rgba(255,255,255,0.3)" : "var(--accent)",
            cursor: launching || launched ? "not-allowed" : "pointer",
          }}
        >
          {launched ? t("demo_new.atlas.launched", l) : launching ? t("demo_new.atlas.launching", l) : t("demo_new.atlas.launch", l)}
        </button>
      </div>

      {/* PPV Pricing */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          <TrendingUp size={14} style={{ color: "var(--success)" }} />
          {t("demo_new.atlas.ppv_title", l)}
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t("demo_new.atlas.ppv_from", l).replace("{n}", String(DEMO_PPV.currentPrice))}
          </span>
          <span className="text-[14px] font-bold" style={{ color: "var(--success)" }}>→</span>
          <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>
            {t("demo_new.atlas.ppv_to", l).replace("{n}", String(DEMO_PPV.recommendedPrice))}
          </span>
        </div>
        <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          {DEMO_PPV.reason}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "var(--success)" }}>
          {t("demo_new.atlas.ppv_projection", l).replace("{n}", String(DEMO_PPV.projectedRevenue))}
        </p>
      </div>

      {/* Content Vault */}
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          <Image size={14} style={{ color: "var(--accent)" }} />
          {t("demo_new.atlas.vault_title", l)}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_VAULT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-2"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {item.type === "image" ? <Image size={10} style={{ color: "rgba(255,255,255,0.3)" }} /> : <Video size={10} style={{ color: "rgba(255,255,255,0.3)" }} />}
                <span className="text-[9px] truncate" style={{ color: "var(--text-primary)" }}>{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[7px] px-1 py-px flex items-center gap-0.5"
                  style={{
                    backgroundColor: item.rightsStatus === "validated" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                    color: item.rightsStatus === "validated" ? "var(--success)" : "#F59E0B",
                  }}
                >
                  <ShieldCheck size={7} />
                  {item.rightsStatus === "validated" ? t("demo_new.atlas.vault_rights_ok", l) : t("demo_new.atlas.vault_rights_pending", l)}
                </span>
                <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t("demo_new.atlas.vault_fatigue", l).replace("{n}", String(item.fatigueScore))}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <a
            href="/dashboard/sovereign-chat/vault"
            className="inline-block text-[9px] px-3 py-1 transition-colors"
            style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
          >
            {t("demo_new.atlas.vault_view", l)} →
          </a>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="p-2 text-[9px] text-center transition-opacity"
          style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          💡 {t("demo_new.atlas.tooltip", l)}
        </div>
      )}
    </div>
  );
}
