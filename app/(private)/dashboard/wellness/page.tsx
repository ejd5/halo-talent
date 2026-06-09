"use client";

import { useState, useEffect } from "react";
import { Heart, Moon, Sun, Brain, Activity, AlertTriangle, TrendingUp, Sparkles, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function WellnessPage() {
  const [mood, setMood] = useState<number>(5);
  const [sleepGood, setSleepGood] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const { data: todayLog } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", user.id)
      .eq("date", today)
      .single();
    if (todayLog) {
      setCheckedIn(true);
      setMood(todayLog.mood_score ?? 5);
      setSleepGood(todayLog.sleep_good);
      setNote(todayLog.note ?? "");
    }

    const { data: history } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", user.id)
      .order("date", { ascending: false })
      .limit(14);
    if (history) setLogs(history);

    if (history && history.length > 0) {
      const avgMood = history.reduce((s, l) => s + (l.mood_score ?? 5), 0) / history.length;
      const avgSleep = history.filter((l) => l.sleep_good).length / history.length;
      setScore(Math.round(((avgMood / 10) * 60) + avgSleep * 40));
    }
  };

  const handleCheckin = async () => {
    if (sleepGood === null) return;
    setChecking(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    await supabase.from("wellness_logs").upsert({
      creator_id: user.id,
      date: today,
      mood_score: mood,
      sleep_good: sleepGood,
      note: note || null,
    });

    setCheckedIn(true);
    loadData();
    setChecking(false);
  };

  const avgMood = logs.length > 0 ? (logs.reduce((s, l) => s + (l.mood_score ?? 5), 0) / logs.length) : null;
  const avgSleep = logs.length > 0 ? (logs.filter((l) => l.sleep_good).length / logs.length) * 100 : null;
  const streak = logs.length > 0 ? logs.filter((l) => {
    const expected = new Date(Date.now() - logs.indexOf(l) * 86400000).toISOString().slice(0, 10);
    return l.date === expected;
  }).length : 0;

  const moodColor = score !== null
    ? score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"
    : "#FFFFFF40";

  const recommendations = score !== null && score < 50
    ? [
        { icon: Moon, text: "Priorise ton sommeil cette semaine — 8h minimum" },
        { icon: Sun, text: "Essaie une marche de 20min en pleine journée" },
        { icon: Heart, text: "Prends un vrai jour off, sans écran" },
      ]
    : score !== null && score < 70
    ? [
        { icon: Brain, text: "Continue les bons habits ! Ajoute une méditation de 5min" },
        { icon: Activity, text: "Maintiens ta cadence mais n'oublie pas les pauses" },
      ]
    : [
        { icon: Sparkles, text: "Super équilibre ! Partage tes tips avec la communauté" },
        { icon: Heart, text: "Continue sur cette lancée — tu gères ton rythme" },
      ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Bien-être</h1>
          <p className="text-sm mt-1" style={{ color: "#FFFFFF" }}>Prends soin de toi — c&apos;est la clé d&apos;une carrière durable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score card */}
        <div className="p-6 border border-[var(--color-border)] card-accent flex flex-col items-center justify-center" style={{ backgroundColor: "var(--color-card)" }}>
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#FFFFFF60" }}>Score bien-être</p>
          <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-2" style={{ borderColor: moodColor }}>
            <span className="text-3xl font-bold font-mono" style={{ color: "#FFFFFF" }}>{score ?? "—"}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
            {score !== null ? (score >= 70 ? "Équilibre 🌟" : score >= 50 ? "En progression 💪" : "À surveiller 🌱") : "Pas encore de données"}
          </p>
          <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: "#FFFFFF60" }}>
            <span>Moy. humeur : {avgMood ? `${avgMood.toFixed(1)}/10` : "—"}</span>
            <span>Sommeil : {avgSleep !== null ? `${Math.round(avgSleep)}%` : "—"}</span>
          </div>
        </div>

        {/* Check-in card */}
        <div className="p-6 border border-[var(--color-border)] card-accent md:col-span-2" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} style={{ color: "#10B981" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              {checkedIn ? "Check-in du jour ✓" : "Daily check-in"}
            </h2>
            {streak > 1 && (
              <span className="px-1.5 py-0.5 text-[8px] font-mono" style={{ backgroundColor: "#10B98115", color: "#10B981" }}>
                🔥 {streak} jours
              </span>
            )}
          </div>

          {checkedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm" style={{ color: "#FFFFFF" }}>
                <span>Humeur : {mood}/10</span>
                <span>Sommeil : {sleepGood ? "Bien" : "Difficile"}</span>
                {note && <span className="text-xs italic" style={{ color: "#FFFFFF80" }}>— {note}</span>}
              </div>
              <button onClick={() => setCheckedIn(false)}
                className="text-[10px] uppercase tracking-wider underline underline-offset-4 hover:opacity-70 transition-opacity"
                style={{ color: "#FFFFFF60" }}>
                Modifier
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mood slider */}
              <div>
                <p className="text-xs mb-2" style={{ color: "#FFFFFF80" }}>Comment te sens-tu aujourd&apos;hui ?</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#FFFFFF40" }}>1</span>
                  <input
                    type="range"
                    min="1" max="10" value={mood}
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="flex-1 accent-[#10B981]"
                  />
                  <span className="text-xs" style={{ color: "#FFFFFF40" }}>10</span>
                  <span className="text-sm font-mono w-8 text-right" style={{ color: "#10B981" }}>{mood}</span>
                </div>
              </div>

              {/* Sleep toggle */}
              <div>
                <p className="text-xs mb-2" style={{ color: "#FFFFFF80" }}>As-tu bien dormi ?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSleepGood(true)}
                    className={cn("px-4 py-2 text-xs font-medium border transition-all", sleepGood === true ? "border-[#10B981] bg-[#10B981]/10" : "border-[var(--color-border)]")}
                    style={{ color: "#FFFFFF" }}
                  >
                    <Moon size={13} className="inline mr-1" /> Oui
                  </button>
                  <button
                    onClick={() => setSleepGood(false)}
                    className={cn("px-4 py-2 text-xs font-medium border transition-all", sleepGood === false ? "border-[#EF4444] bg-[#EF4444]/10" : "border-[var(--color-border)]")}
                    style={{ color: "#FFFFFF" }}
                  >
                    <Sun size={13} className="inline mr-1" /> Non
                  </button>
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-xs mb-1" style={{ color: "#FFFFFF60" }}>Une chose qui t&apos;a fait plaisir ? (optionnel)</p>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: une balade, un compliment, un bon café..."
                  className="w-full bg-transparent border-b border-[var(--color-border)] py-1.5 text-xs focus:outline-none focus:border-[#10B981] transition-colors"
                  style={{ color: "#FFFFFF" }}
                />
              </div>

              <button
                onClick={handleCheckin}
                disabled={sleepGood === null || checking}
                className="px-6 py-2 text-xs uppercase tracking-wider font-semibold disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
              >
                {checking ? "Enregistrement..." : "Enregistrer mon check-in"}
              </button>
            </div>
          )}
        </div>

        {/* History graph */}
        <div className="p-6 border border-[var(--color-border)] card-accent md:col-span-2" style={{ backgroundColor: "var(--color-card)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#FFFFFF" }}>Évolution de l&apos;humeur (14 jours)</h2>
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-xs" style={{ color: "#FFFFFF60" }}>Fais ton premier check-in pour voir l&apos;évolution</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-24">
              {logs.slice(0, 14).reverse().map((l, i) => {
                const h = ((l.mood_score ?? 5) / 10) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm transition-all" style={{
                      height: `${h}%`,
                      backgroundColor: (l.mood_score ?? 5) >= 7 ? "#10B981" : (l.mood_score ?? 5) >= 5 ? "#F59E0B" : "#EF4444",
                      minHeight: "4px",
                    }} />
                    <span className="text-[7px]" style={{ color: "#FFFFFF30" }}>
                      {new Date(l.date).getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="p-6 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} style={{ color: "#10B981" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Recommandations</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <rec.icon size={14} style={{ color: "#10B981" }} className="mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed" style={{ color: "#FFFFFF" }}>{rec.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="p-6 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} style={{ color: "#10B981" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Ressources</h2>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { label: "3114 — Prévention suicide", desc: "Appel gratuit 24h/24", urgent: true },
              { label: "SOS Amitié", desc: "09 72 39 40 50 — 24h/24", urgent: true },
              { label: "Psy.fr", desc: "Trouver un psy près de chez vous" },
              { label: "Petit BamBou", desc: "Appli de méditation gratuite" },
            ].map((r, i) => (
              <div key={i} className={cn("p-2.5 border text-xs", r.urgent ? "border-[#EF4444]/30" : "border-[var(--color-border)]")}
                style={{ backgroundColor: r.urgent ? "#EF444408" : "var(--color-base)" }}>
                <p className="font-medium" style={{ color: "#FFFFFF" }}>{r.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF60" }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[8px] mt-3" style={{ color: "#FFFFFF30" }}>
            Tu n&apos;es pas seul·e. L&apos;équipe Halo est là pour toi.
          </p>
        </div>
      </div>
    </div>
  );
}
