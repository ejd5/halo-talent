"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Hash, Music2, DollarSign, Users, Loader, RefreshCw, Globe, Clock,
} from "lucide-react";
import { FreshnessIndicator } from "./components/FreshnessIndicator";
import { HashtagsTab } from "./components/HashtagsTab";
import { SongsTab } from "./components/SongsTab";
import { TopAdsTab } from "./components/TopAdsTab";
import { HashtagAnalysisPopup } from "./components/HashtagAnalysisPopup";

type TabKey = "hashtags" | "songs" | "top_ads" | "top_creators";

interface TabDef {
  key: TabKey;
  label: string;
  icon: any;
}

const TABS: TabDef[] = [
  { key: "hashtags", label: "Hashtags", icon: Hash },
  { key: "songs", label: "Sons", icon: Music2 },
  { key: "top_ads", label: "Top Ads", icon: DollarSign },
  { key: "top_creators", label: "Top Creators", icon: Users },
];

const REGIONS = [
  { value: "FR", label: "France" },
  { value: "US", label: "États-Unis" },
  { value: "GB", label: "Royaume-Uni" },
  { value: "JP", label: "Japon" },
  { value: "BR", label: "Brésil" },
  { value: "DE", label: "Allemagne" },
  { value: "IT", label: "Italie" },
  { value: "ES", label: "Espagne" },
];

const PERIODS = [
  { value: "7", label: "7 jours" },
  { value: "30", label: "30 jours" },
  { value: "120", label: "120 jours" },
];

// Rate limiter: max 1 force-refresh per hour
function useRefreshRateLimit() {
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const check = useCallback(() => {
    const last = localStorage.getItem("tiktok_refresh_at");
    if (last) {
      const elapsed = (Date.now() - parseInt(last)) / 1000;
      if (elapsed < 3600) {
        setDisabled(true);
        setCountdown(Math.ceil(3600 - elapsed));
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setDisabled(false);
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return false;
      }
    }
    return true;
  }, []);

  const consume = useCallback(() => {
    localStorage.setItem("tiktok_refresh_at", String(Date.now()));
    setDisabled(true);
    setCountdown(3600);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setDisabled(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { disabled, countdown, check, consume };
}

export default function TikTokCreativePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("hashtags");
  const [region, setRegion] = useState("FR");
  const [period, setPeriod] = useState("7");
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [analysisHashtag, setAnalysisHashtag] = useState<string | null>(null);
  const { disabled: refreshDisabled, countdown, check: checkRefresh, consume: consumeRefresh } = useRefreshRateLimit();

  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        activeTab === "hashtags" ? "hashtags"
        : activeTab === "songs" ? "songs"
        : activeTab === "top_ads" ? "top-ads"
        : null;

      if (!endpoint) {
        // Top Creators — placeholder
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ region, period });
      if (activeTab === "songs" && commercialOnly) params.set("commercialOnly", "true");
      if (forceRefresh) params.set("_refresh", "1");

      const res = await fetch(`/api/trends/tiktok/${endpoint}?${params}`);
      if (!res.ok) throw new Error("Erreur API");
      const d = await res.json();
      setData(d);
      setLastFetched(new Date());
    } catch {
      setError("Impossible de charger les données TikTok. Réessaie avec une région plus large.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, region, period, commercialOnly]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    if (!checkRefresh()) return;
    consumeRefresh();
    loadData(true);
  };

  const getDataForTab = () => {
    if (!data) return [];
    switch (activeTab) {
      case "hashtags": return data.hashtags ?? [];
      case "songs": return data.songs ?? [];
      case "top_ads": return data.ads ?? [];
      default: return [];
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
            TikTok Creative Lab
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Hashtags, sons et publicités tendances — Creative Center via Apify
          </p>
        </div>
        <FreshnessIndicator
          lastFetched={lastFetched}
          loading={loading}
          onRefresh={handleRefresh}
          refreshDisabled={refreshDisabled}
          refreshCountdown={countdown}
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Tabs */}
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium transition-all"
            style={{
              backgroundColor: activeTab === t.key ? "rgba(199,91,57,0.12)" : "transparent",
              color: activeTab === t.key ? "#C75B39" : "rgba(245,240,235,0.3)",
              border: activeTab === t.key ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
            }}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}

        <div className="flex-1" />

        {/* Region */}
        <div className="flex items-center gap-1.5">
          <Globe size={11} style={{ color: "rgba(245,240,235,0.2)" }} />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-2 py-1 text-[10px] border bg-transparent"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div className="flex items-center gap-1.5">
          <Clock size={11} style={{ color: "rgba(245,240,235,0.2)" }} />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-2 py-1 text-[10px] border bg-transparent"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Commercial-safe toggle (songs only) */}
        {activeTab === "songs" && (
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={commercialOnly}
              onChange={(e) => setCommercialOnly(e.target.checked)}
              className="accent-[#C75B39]"
            />
            <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
              Commercial-safe
            </span>
          </label>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-xs px-3 py-2 mb-4 flex items-center gap-2"
          style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "#C44536", border: "1px solid rgba(196,69,54,0.15)" }}
        >
          <span>{error}</span>
          <button
            onClick={() => setRegion("US")}
            className="ml-auto text-[10px] px-2 py-0.5 font-medium"
            style={{ backgroundColor: "rgba(196,69,54,0.1)", border: "1px solid rgba(196,69,54,0.2)" }}
          >
            Voir les tendances mondiales
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.15)" }} />
            <p className="text-xs" style={{ color: "rgba(245,240,235,0.15)" }}>
              Chargement des tendances TikTok...
            </p>
          </div>
        </div>
      )}

      {/* Tab content */}
      {!loading && (
        <>
          {activeTab === "hashtags" && (
            <HashtagsTab
              hashtags={getDataForTab()}
              onAnalyse={(name) => setAnalysisHashtag(name)}
              onAddToWatchlist={(keyword) => {
                fetch("/api/dashboard/trends/watchlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ keyword, sources: ["tiktok"] }),
                }).catch(() => {});
              }}
            />
          )}
          {activeTab === "songs" && (
            <SongsTab
              songs={getDataForTab()}
              onAnalyse={() => {}}
            />
          )}
          {activeTab === "top_ads" && (
            <TopAdsTab ads={getDataForTab()} />
          )}
          {activeTab === "top_creators" && (
            <div className="flex flex-col items-center py-16 text-center">
              <Users size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
              <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
                Top Creators — bientôt disponible
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
                Cette fonctionnalité arrivera dans une prochaine version
              </p>
            </div>
          )}
        </>
      )}

      {/* Analysis popup */}
      {analysisHashtag && (
        <HashtagAnalysisPopup
          hashtag={analysisHashtag}
          onClose={() => setAnalysisHashtag(null)}
        />
      )}
    </div>
  );
}
