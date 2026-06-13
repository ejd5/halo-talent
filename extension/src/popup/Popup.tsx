// ─── Popup — WTF Companion ────────────────────────────────
// Mini popup (320px) — status, stats live, open sidepanel

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Users, DollarSign, ChevronRight } from "lucide-react";

const PLANS = {
  free: { label: "FREE", color: "#9C9183" },
  starter: { label: "STARTER", color: "#D8A95B" },
  pro: { label: "PRO", color: "#C75B39" },
};

export default function Popup() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [plan] = useState<"free" | "starter" | "pro">("starter");
  const [stats] = useState({ revenue: 248, fans: 1240, active: 38 });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) {
        const hostname = new URL(tab.url).hostname;
        if (hostname.includes("onlyfans.com")) setPlatform("OnlyFans");
        else if (hostname.includes("fansly.com")) setPlatform("Fansly");
        else if (hostname.includes("mym.fans")) setPlatform("MYM");
        else if (hostname.includes("instagram.com")) setPlatform("Instagram");
        else if (hostname.includes("tiktok.com")) setPlatform("TikTok");
      }
    });
  }, []);

  const openSidePanel = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) chrome.sidePanel.open({ tabId: tab.id });
    });
  };

  const planInfo = PLANS[plan];

  return (
    <div
      style={{
        width: 320,
        backgroundColor: "#0A0A0B",
        color: "#F5F0EB",
        fontFamily: "Inter, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(245,240,235,0.06)",
          background: "linear-gradient(135deg, rgba(199,91,57,0.06) 0%, transparent 60%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo */}
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            W
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB", lineHeight: 1 }}>
              WTF Companion
            </div>
            <div style={{ fontSize: 9, color: "#9C9183", marginTop: 2, letterSpacing: "0.1em" }}>
              BY HALO TALENT
            </div>
          </div>
        </div>
        {/* Plan badge */}
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "3px 8px",
            letterSpacing: "0.12em",
            border: `1px solid ${planInfo.color}40`,
            color: planInfo.color,
            backgroundColor: `${planInfo.color}12`,
          }}
        >
          {planInfo.label}
        </div>
      </div>

      {/* Platform status */}
      <div style={{ padding: "10px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            backgroundColor: "rgba(245,240,235,0.03)",
            border: "1px solid rgba(245,240,235,0.06)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: platform ? "#10B981" : "#6B7280",
              boxShadow: platform ? "0 0 6px rgba(16,185,129,0.5)" : "none",
            }}
          />
          <span style={{ fontSize: 11, color: platform ? "#10B981" : "#6B7280", fontWeight: 500 }}>
            {platform ? `${platform} — Actif` : "Aucune plateforme détectée"}
          </span>
        </div>
      </div>

      {/* Mini stats */}
      <div style={{ padding: "0 16px 12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { icon: DollarSign, value: `${stats.revenue}€`, label: "Auj.", color: "#10B981" },
          { icon: Users, value: stats.fans.toLocaleString("fr"), label: "Fans", color: "#C75B39" },
          { icon: TrendingUp, value: `${stats.active}`, label: "En ligne", color: "#D8A95B" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "8px",
              backgroundColor: "rgba(245,240,235,0.03)",
              border: "1px solid rgba(245,240,235,0.06)",
              textAlign: "center",
            }}
          >
            <s.icon size={13} style={{ color: s.color, margin: "0 auto 4px" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB", fontFamily: "monospace" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: "#9C9183" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main CTA */}
      <div style={{ padding: "0 16px 12px" }}>
        <button
          onClick={openSidePanel}
          style={{
            width: "100%",
            padding: "11px 16px",
            background: "linear-gradient(135deg, #C75B39 0%, #D8A95B 100%)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.04em",
          }}
        >
          <Zap size={14} />
          Ouvrir WTF Companion
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 16px 12px",
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={() => chrome.tabs.create({ url: "https://app.halotalent.com/dashboard" })}
          style={{
            flex: 1,
            padding: "7px",
            fontSize: 10,
            fontWeight: 600,
            color: "#9C9183",
            backgroundColor: "transparent",
            border: "1px solid rgba(245,240,235,0.08)",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => chrome.runtime.openOptionsPage?.()}
          style={{
            flex: 1,
            padding: "7px",
            fontSize: 10,
            fontWeight: 600,
            color: "#9C9183",
            backgroundColor: "transparent",
            border: "1px solid rgba(245,240,235,0.08)",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          Paramètres
        </button>
      </div>
    </div>
  );
}
