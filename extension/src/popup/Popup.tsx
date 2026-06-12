// ─── Popup component — Halo Companion ───────────
// Mini popup (256px) — quick status and open side panel shortcut

import { useState, useEffect } from "react";

export default function Popup() {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    // Query the active tab to check platform
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
      if (tab?.id) {
        chrome.sidePanel.open({ tabId: tab.id });
      }
    });
  };

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "#0A0A0A", color: "#FAFAFA", fontFamily: "Inter, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: "rgba(249,115,22,0.1)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--or, #D8A95B)" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xs font-bold" style={{ color: "var(--or, #D8A95B)" }}>
          Halo Companion
        </span>
      </div>

      {/* Platform status */}
      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-3"
        style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: platform ? "#10B981" : "#71717A",
          }}
        />
        <span className="text-[11px]" style={{ color: platform ? "#10B981" : "#71717A" }}>
          {platform ? `${platform} - Connecté` : "En attente"}
        </span>
      </div>

      {/* Action buttons */}
      <button
        onClick={openSidePanel}
        className="w-full text-xs font-semibold py-2.5 rounded-lg mb-1.5 transition-all"
        style={{ backgroundColor: "var(--or, #D8A95B)", color: "#fff" }}
      >
        Ouvrir Halo Companion
      </button>

      <button
        onClick={() => chrome.runtime.openOptionsPage?.()}
        className="w-full text-[11px] font-medium py-1.5 rounded-lg transition-all"
        style={{
          backgroundColor: "transparent",
          color: "#71717A",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Paramètres
      </button>
    </div>
  );
}
