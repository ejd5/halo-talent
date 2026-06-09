"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock posts ─────────────────────────────────────────────

const MOCK_POSTS = [
  { id: "p1", title: "Summer workout routine", platform: "instagram", type: "reel", status: "scheduled", day: 10, time: "10:00" },
  { id: "p2", title: "Behind the scenes shoot", platform: "onlyfans", type: "post", status: "scheduled", day: 10, time: "14:00" },
  { id: "p3", title: "Q&A fitness edition", platform: "youtube", type: "video", status: "draft", day: 12, time: "18:00" },
  { id: "p4", title: "Morning routine 2026", platform: "tiktok", type: "video", status: "scheduled", day: 12, time: "09:00" },
  { id: "p5", title: "Abonnement promo été", platform: "onlyfans", type: "post", status: "published", day: 8, time: "12:00" },
  { id: "p6", title: "GRWM get ready with me", platform: "instagram", type: "reel", status: "scheduled", day: 15, time: "11:00" },
  { id: "p7", title: "Workout challenge day 1", platform: "tiktok", type: "video", status: "draft", day: 18, time: "08:00" },
  { id: "p8", title: "PPV exclusive content", platform: "onlyfans", type: "post", status: "scheduled", day: 20, time: "20:00" },
  { id: "p9", title: "Fitness tips compilation", platform: "youtube", type: "video", status: "scheduled", day: 22, time: "16:00" },
  { id: "p10", title: "Weekend vlog", platform: "instagram", type: "story", status: "draft", day: 25, time: "09:00" },
];

const PLATFORM_COLORS: Record<string, string> = {
  onlyfans: "#00AFF0",
  instagram: "#E4405F",
  tiktok: "#00F2EA",
  youtube: "#FF0000",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Planifié",
  published: "Publié",
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<"month" | "week">("month");

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  // Monday = 0
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const today = now.getDate();
  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

  const calendarDays = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // Pad to fill last row
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [daysInMonth, startOffset]);

  const getPostsForDay = (day: number) => MOCK_POSTS.filter((p) => p.day === day);

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Mon calendrier</h1>
          <p className="text-sm mt-1" style={{ color: "#FFFFFF" }}>Planifie et suis tes publications</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80" style={{ backgroundColor: "#C75B39", color: "#FFFFFF" }}>
          <Plus size={11} /> Nouveau contenu
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-3 hover:opacity-70 transition-opacity">
            <ChevronLeft size={16} style={{ color: "#FFFFFF60" }} />
          </button>
          <h2 className="text-base font-semibold" style={{ color: "#FFFFFF" }}>
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-3 hover:opacity-70 transition-opacity">
            <ChevronRight size={16} style={{ color: "#FFFFFF60" }} />
          </button>
          {!isCurrentMonth && (
            <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
              className="text-[10px] px-2 py-1" style={{ color: "#C75B39" }}>
              Aujourd&apos;hui
            </button>
          )}
        </div>
        <div className="flex gap-1 mr-3">
          {(["month", "week"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn("px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-all",
                view === v ? "border-b-2" : "opacity-40 hover:opacity-70")}
              style={{ borderColor: view === v ? "#C75B39" : "transparent", color: "#FFFFFF" }}>
              {v === "month" ? "Mois" : "Semaine"}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="border border-[var(--color-border)] overflow-hidden" style={{ backgroundColor: "var(--color-card)" }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-[10px] uppercase tracking-wider font-medium" style={{ color: "#FFFFFF60", borderRight: "1px solid var(--color-border)" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const posts = day ? getPostsForDay(day) : [];
            const isToday = isCurrentMonth && day === today;

            return (
              <div key={i} className={cn(
                "min-h-[100px] p-1.5 border-b border-r border-[var(--color-border)] transition-all",
                isToday && "bg-[#C75B39]/05",
                !day && "opacity-20"
              )}>
                {day && (
                  <>
                    <div className={cn(
                      "text-[10px] font-mono mb-1 w-5 h-5 flex items-center justify-center",
                      isToday && "font-bold rounded-full"
                    )}
                      style={isToday ? { backgroundColor: "#C75B39", color: "#FFFFFF" } : { color: "#FFFFFF80" }}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {posts.slice(0, 3).map((post) => (
                        <div key={post.id} className={cn(
                          "px-1 py-0.5 text-[8px] font-medium truncate rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
                        )}
                          style={{ backgroundColor: `${PLATFORM_COLORS[post.platform] ?? "#FFFFFF"}20`, color: PLATFORM_COLORS[post.platform] ?? "#FFFFFF" }}>
                          {post.time} {post.title}
                        </div>
                      ))}
                      {posts.length > 3 && (
                        <div className="text-[8px] text-center" style={{ color: "#FFFFFF40" }}>
                          +{posts.length - 3}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming posts list */}
      <div className="border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-card)" }}>
        <h3 className="text-xs font-semibold mb-3" style={{ color: "#FFFFFF" }}>Publications à venir</h3>
        <div className="space-y-2">
          {MOCK_POSTS.filter((p) => p.status !== "published").slice(0, 5).map((post) => (
            <div key={post.id} className="flex items-center gap-3 p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[post.platform] ?? "#FFFFFF" }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>{post.title}</p>
                <p className="text-[9px]" style={{ color: "#FFFFFF60" }}>
                  {MONTHS[month]} {post.day} à {post.time} · {post.platform}
                </p>
              </div>
              <span className={cn(
                "text-[8px] px-1.5 py-0.5 font-mono uppercase",
                post.status === "draft" ? "text-[#F59E0B] bg-[#F59E0B]/10"
                  : post.status === "scheduled" ? "text-[#3B82F6] bg-[#3B82F6]/10"
                  : "text-[#10B981] bg-[#10B981]/10"
              )}>
                {STATUS_LABELS[post.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Integration buttons */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider font-medium border border-[var(--color-border)] transition-all hover:border-[#C75B39]/50"
          style={{ color: "#FFFFFF" }}>
          <CalendarIcon size={13} style={{ color: "#C75B39" }} />
          Demander à Content Strategist un plan
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider font-medium border border-[var(--color-border)] transition-all hover:border-[#C75B39]/50"
          style={{ color: "#FFFFFF" }}>
          <span className="text-[13px]">📊</span>
          Meilleurs créneaux selon mes analytics
        </button>
      </div>
    </div>
  );
}
