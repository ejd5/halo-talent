"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, BarChart3, Globe, Hash, Sparkles,
  TrendingUp, Users, Eye, Play, Loader,
} from "lucide-react";

interface Props {
  hashtag: string;
  onClose: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function HashtagAnalysisPopup({ hashtag, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Simulate loading analysis data
    const t = setTimeout(() => {
      setData({
        metrics: {
          total_videos: 2450000,
          total_views: 89200000,
          growth_7d: 34,
          growth_30d: 128,
          growth_120d: 340,
          current_rank: 4,
          rank_history: [8, 7, 6, 5, 5, 4, 4],
        },
        audience: {
          age_18_24: 38,
          age_25_34: 32,
          age_35_44: 18,
          age_45plus: 12,
          female: 58,
          male: 42,
          top_countries: [
            { country: "France", pct: 42 },
            { country: "Belgique", pct: 12 },
            { country: "Canada", pct: 10 },
            { country: "Suisse", pct: 8 },
          ],
          top_interests: ["Mode", "Beauté", "Lifestyle", "Fitness", "Voyage"],
        },
        top_videos: Array.from({ length: 10 }, (_, i) => ({
          id: `v${i}`,
          title: `Vidéo populaire #${i + 1} avec #${hashtag}`,
          views: Math.floor(Math.random() * 500000 + 50000),
          thumbnail: "",
        })),
        combos: [
          { hashtag: `#${hashtag}`, frequency: "100%" },
          { hashtag: "#foryou", frequency: "72%" },
          { hashtag: "#viral", frequency: "58%" },
          { hashtag: "#fyp", frequency: "45%" },
          { hashtag: "#trending", frequency: "38%" },
          { hashtag: "#creator", frequency: "30%" },
          { hashtag: "#content", frequency: "25%" },
        ],
        recommendation: {
          stage: "growing",
          window: "2 semaines",
          ideas: [
            `Crée un tutoriel "Comment utiliser #${hashtag}"`,
            `Partage ton expérience personnelle avec #${hashtag}`,
            `Compare avant/après en utilisant #${hashtag}`,
          ],
        },
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [hashtag]);

  const sections = [
    { key: "metrics", label: "Métriques", icon: BarChart3 },
    { key: "audience", label: "Audience", icon: Users },
    { key: "videos", label: "Top vidéos", icon: Play },
    { key: "combos", label: "Combos", icon: Hash },
    { key: "recommendation", label: "IA", icon: Sparkles },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4" style={{ backgroundColor: "var(--bg-primary)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            #{hashtag}
          </h2>
          <button onClick={onClose} className="p-1 hover:opacity-70" style={{ color: "rgba(245,240,235,0.2)" }}>
            <X size={14} />
          </button>
        </div>

        {/* Section nav */}
        <div className="flex gap-0.5 px-4 py-2 overflow-x-auto" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          {sections.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(i)}
              className="flex items-center gap-1 text-[9px] px-2 py-1.5 font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeSection === i ? "rgba(199,91,57,0.1)" : "transparent",
                color: activeSection === i ? "var(--accent)" : "rgba(245,240,235,0.2)",
              }}
            >
              <s.icon size={10} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.15)" }} />
            </div>
          ) : data && (
            <div className="space-y-6">
              {/* Section: Metrics */}
              {activeSection === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MetricCard label="Total vidéos" value={formatCount(data.metrics.total_videos)} />
                    <MetricCard label="Vues cumulées" value={formatCount(data.metrics.total_views)} />
                    <MetricCard label="Croissance 7j" value={`+${data.metrics.growth_7d}%`} up />
                    <MetricCard label="Rank actuel" value={`#${data.metrics.current_rank}`} />
                  </div>
                  {/* Growth chart — simplified */}
                  <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
                      Croissance
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span style={{ color: "var(--success)" }}>7j: +{data.metrics.growth_7d}%</span>
                      <span style={{ color: "var(--accent)" }}>30j: +{data.metrics.growth_30d}%</span>
                      <span style={{ color: "rgba(245,240,235,0.5)" }}>120j: +{data.metrics.growth_120d}%</span>
                    </div>
                    {/* Rank sparkline */}
                    <div className="flex items-end gap-1 h-8 mt-2">
                      {data.metrics.rank_history.map((v: number, i: number) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{
                            height: `${(10 - v) / 10 * 100}%`,
                            backgroundColor: i === data.metrics.rank_history.length - 1 ? "var(--accent)" : "rgba(245,240,235,0.06)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Audience */}
              {activeSection === 1 && (
                <div className="space-y-4">
                  {/* Age distribution */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
                      Âge
                    </p>
                    <div className="space-y-1">
                      {[
                        { label: "18-24", value: data.audience.age_18_24 },
                        { label: "25-34", value: data.audience.age_25_34 },
                        { label: "35-44", value: data.audience.age_35_44 },
                        { label: "45+", value: data.audience.age_45plus },
                      ].map((g) => (
                        <div key={g.label} className="flex items-center gap-2 text-xs">
                          <span className="w-8" style={{ color: "rgba(245,240,235,0.3)" }}>{g.label}</span>
                          <div className="flex-1 h-2" style={{ backgroundColor: "rgba(245,240,235,0.04)" }}>
                            <div className="h-full" style={{ width: `${g.value}%`, backgroundColor: "rgba(199,91,57,0.4)" }} />
                          </div>
                          <span className="tabular-nums" style={{ color: "rgba(245,240,235,0.5)" }}>{g.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Top countries */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
                      Top pays
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {data.audience.top_countries.map((c: any) => (
                        <div key={c.country} className="flex items-center justify-between py-1 px-2" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
                          <span className="text-xs" style={{ color: "var(--text-primary)" }}>{c.country}</span>
                          <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Top videos */}
              {activeSection === 2 && (
                <div className="space-y-2">
                  {data.top_videos.map((v: any, i: number) => (
                    <div key={v.id} className="flex items-center justify-between p-2" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium" style={{ color: "rgba(245,240,235,0.2)" }}>#{i + 1}</span>
                        <span className="text-xs truncate max-w-[300px]" style={{ color: "var(--text-primary)" }}>{v.title}</span>
                      </div>
                      <span className="text-[10px] tabular-nums" style={{ color: "rgba(245,240,235,0.3)" }}>
                        {formatCount(v.views)} vues
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Section: Combos */}
              {activeSection === 3 && (
                <div className="space-y-3">
                  <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>
                    Hashtags fréquemment utilisés avec #{hashtag}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.combos.map((c: any) => (
                      <span
                        key={c.hashtag}
                        className="text-xs px-2 py-1"
                        style={{
                          backgroundColor: c.frequency === "100%" ? "rgba(199,91,57,0.1)" : "rgba(245,240,235,0.04)",
                          color: c.frequency === "100%" ? "var(--accent)" : "rgba(245,240,235,0.4)",
                        }}
                      >
                        {c.hashtag}
                        <span className="ml-1 text-[9px]" style={{ opacity: 0.5 }}>{c.frequency}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: AI Recommendation */}
              {activeSection === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] px-2 py-0.5 font-medium" style={{
                      backgroundColor: "rgba(122,154,101,0.1)",
                      color: "var(--success)",
                      border: "1px solid rgba(122,154,101,0.2)",
                    }}>
                      {data.recommendation.stage === "growing" ? "En croissance" : data.recommendation.stage}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                      Fenêtre : {data.recommendation.window}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>
                      Idées de contenu
                    </p>
                    {data.recommendation.ideas.map((idea: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5"
                        style={{ backgroundColor: "rgba(245,240,235,0.03)", borderLeft: "2px solid var(--accent)" }}
                      >
                        <span className="text-[9px] font-medium mt-0.5" style={{ color: "var(--accent)" }}>{i + 1}.</span>
                        <p className="text-xs" style={{ color: "var(--text-primary)" }}>{idea}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push(`/studio/composer?source=tiktok&hashtag=${encodeURIComponent(hashtag)}`)}
                    className="w-full text-xs font-semibold py-2.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                  >
                    Créer maintenant
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.03)" }}>
      <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>
        {label}
      </p>
      <p className="text-lg font-semibold mt-1 tabular-nums" style={{ color: up ? "var(--success)" : "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}
