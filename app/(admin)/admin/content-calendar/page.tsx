"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { JSX } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Download,
  AlertTriangle,
  Loader2,
  X,
  Check,
  FileText,
  TrendingUp,
  Layout,
} from "lucide-react";

// ----- Constants -----
const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#E4405F",
  TikTok: "#000000",
  YouTube: "#FF0000",
  OnlyFans: "#00AFF0",
  Twitter: "#1DA1F2",
  LinkedIn: "#0A66C2",
};

const PLATFORM_LABELS: Record<string, string> = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  YouTube: "YouTube",
  OnlyFans: "OnlyFans",
  Twitter: "Twitter",
  LinkedIn: "LinkedIn",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  live: "Live",
  video: "Vidéo",
  ppv: "PPV",
};

const CONTENT_TYPE_ICONS: Record<string, string> = {
  post: "📷",
  story: "📱",
  reel: "🎬",
  video: "🎥",
  live: "🔴",
  ppv: "🔒",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Planifié",
  published: "Publié",
  failed: "Échec",
  cancelled: "Annulé",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "var(--text-secondary)",
  scheduled: "var(--accent)",
  published: "var(--success)",
  failed: "var(--danger)",
  cancelled: "rgba(255,255,255,0.2)",
};

type CalendarEvent = {
  id: string;
  creator_id: string;
  platform: string;
  content_type: string;
  scheduled_for: string;
  status: string;
  title: string | null;
  preview_url: string | null;
  hashtags: string[] | null;
  campaign_id: string | null;
  notes: string | null;
  creator: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string;
    avatar_url: string | null;
    department: string | null;
  } | null;
};

type ViewMode = "month" | "week" | "day" | "timeline";

// ----- Main Page -----
export default function ContentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [noPlanning, setNoPlanning] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const getRange = useCallback(() => {
    const d = new Date(currentDate);
    let from: Date, to: Date;
    switch (viewMode) {
      case "month":
        from = new Date(d.getFullYear(), d.getMonth(), 1);
        to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        break;
      case "week": {
        const day = d.getDay();
        from = new Date(d);
        from.setDate(d.getDate() - day);
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59, 999);
        break;
      }
      case "day":
        from = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        break;
      default:
        from = new Date(d.getFullYear(), d.getMonth(), 1);
        to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    }
    return { from: from.toISOString(), to: to.toISOString() };
  }, [currentDate, viewMode]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const range = getRange();
    const params = new URLSearchParams();
    params.set("from", range.from);
    params.set("to", range.to);
    if (selectedCreator) params.set("creator_ids", selectedCreator);
    if (selectedPlatform) params.set("platform", selectedPlatform);
    if (selectedStatus) params.set("status", selectedStatus);
    if (selectedType) params.set("content_type", selectedType);

    const res = await fetch(`/api/admin/content-calendar?${params.toString()}`);
    if (!res.ok) { setError("Erreur chargement"); setLoading(false); return; }
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }, [getRange, selectedCreator, selectedPlatform, selectedStatus, selectedType]);

  const fetchMeta = useCallback(async () => {
    const range = getRange();
    // Conflicts
    const conflictParams = new URLSearchParams();
    conflictParams.set("from", range.from);
    conflictParams.set("to", range.to);
    const cRes = await fetch(`/api/admin/content-calendar/conflicts?${conflictParams.toString()}`);
    const cData = await cRes.json();
    setConflicts(cData.conflicts || []);
    setSuggestions(cData.suggestions || []);

    // Creators with planning
    const crParams = new URLSearchParams();
    crParams.set("from", range.from);
    crParams.set("to", range.to);
    const crRes = await fetch(`/api/admin/content-calendar/creators?${crParams.toString()}`);
    const crData = await crRes.json();
    setCreators(crData.creators || []);
    setNoPlanning(crData.no_planning || []);
  }, [getRange]);

  useEffect(() => {
    fetchEvents();
    fetchMeta();
  }, [fetchEvents, fetchMeta]);

  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentDate]);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    switch (viewMode) {
      case "month": d.setMonth(d.getMonth() + dir); break;
      case "week": d.setDate(d.getDate() + 7 * dir); break;
      case "day": d.setDate(d.getDate() + dir); break;
      default: d.setMonth(d.getMonth() + dir);
    }
    setCurrentDate(d);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.scheduled_for.startsWith(dateStr));
  };

  const pageTitle = useMemo(() => {
    const options: Intl.DateTimeFormatOptions =
      viewMode === "month" ? { month: "long", year: "numeric" }
      : viewMode === "week" ? { month: "long", day: "numeric" }
      : { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return currentDate.toLocaleDateString("fr-FR", options);
  }, [currentDate, viewMode]);

  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const EventBadge = ({ event }: { event: CalendarEvent }) => (
    <div
      className="group relative cursor-pointer px-1.5 py-0.5 text-[10px] leading-tight truncate rounded-sm mb-0.5"
      style={{
        background: `${PLATFORM_COLORS[event.platform] || "#666"}22`,
        borderLeft: `2px solid ${PLATFORM_COLORS[event.platform] || "#666"}`,
        color: "var(--text-primary)",
      }}
      title={`${event.creator?.display_name || event.creator?.full_name || ""} - ${event.title || event.content_type}`}
    >
      <span className="mr-1">{CONTENT_TYPE_ICONS[event.content_type] || "📄"}</span>
      {event.creator?.display_name || event.creator?.full_name || event.creator?.email?.split("@")[0]}
      {event.status === "published" && <Check size={10} className="inline ml-1" style={{ color: "var(--success)" }} />}
      {event.status === "failed" && <X size={10} className="inline ml-1" style={{ color: "var(--danger)" }} />}
    </div>
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
            Calendrier de contenu
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Vue agence · {events.length} événement{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={14} />
            Nouvel event
          </button>
          <a
            href={`/api/admin/content-calendar/export?format=ical&from=${getRange().from}&to=${getRange().to}`}
            className="flex items-center gap-1.5 px-3 py-2 text-sm transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            <Download size={14} />
            Export
          </a>
          <a
            href="/admin/content-calendar/analytics"
            className="flex items-center gap-1.5 px-3 py-2 text-sm transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            <TrendingUp size={14} />
            Analytics
          </a>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 mb-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1 transition-colors" style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-semibold min-w-[200px] text-center" style={{ color: "var(--text-primary)" }}>
            {pageTitle}
          </h2>
          <button onClick={() => navigate(1)} className="p-1 transition-colors" style={{ color: "var(--text-secondary)" }}>
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="ml-2 px-2 py-1 text-xs transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            Aujourd'hui
          </button>
        </div>

        <div className="flex items-center gap-1" style={{ background: "rgba(255,255,255,0.04)", padding: 2 }}>
          {(["month", "week", "day"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                background: viewMode === mode ? "var(--accent)" : "transparent",
                color: viewMode === mode ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {mode === "month" ? "Mois" : mode === "week" ? "Semaine" : "Jour"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs transition-colors"
            style={{ background: showFilters ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
          >
            <Filter size={12} />
            Filtres
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="flex items-center gap-3 px-4 py-3 mb-4 flex-wrap"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        >
          <select
            value={selectedCreator}
            onChange={(e) => setSelectedCreator(e.target.value)}
            className="px-2 py-1.5 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            <option value="">Tous les créateurs</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>{c.display_name || c.full_name || c.email}</option>
            ))}
          </select>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-2 py-1.5 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            <option value="">Toutes les plateformes</option>
            {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2 py-1.5 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            <option value="">Tous les types</option>
            {Object.entries(CONTENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2 py-1.5 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {(selectedCreator || selectedPlatform || selectedStatus || selectedType) && (
            <button
              onClick={() => { setSelectedCreator(""); setSelectedPlatform(""); setSelectedStatus(""); setSelectedType(""); }}
              className="text-xs px-2 py-1"
              style={{ color: "var(--accent)" }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Alerts */}
      {noPlanning.length > 0 && (
        <div
          className="flex items-center gap-2 px-4 py-2 mb-4 text-sm"
          style={{ background: "rgba(232,168,56,0.1)", color: "#E8A838" }}
        >
          <AlertTriangle size={14} />
          {noPlanning.length} créateur{noPlanning.length > 1 ? "s" : ""} n'ont rien planifié cette semaine
        </div>
      )}

      {conflicts.length > 0 && (
        <div
          className="flex items-center gap-2 px-4 py-2 mb-4 text-sm"
          style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
        >
          <AlertTriangle size={14} />
          {conflicts.length} conflit{conflicts.length > 1 ? "s" : ""} de hashtag détecté{conflicts.length > 1 ? "s" : ""}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      )}

      {/* Month View */}
      {!loading && viewMode === "month" && (
        <div style={{ border: "1px solid var(--border-default)" }}>
          <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {weekDays.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7" style={{ minHeight: 600 }}>
            {monthGrid.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} style={{ borderRight: "1px solid rgba(255,255,255,0.04)", minHeight: 100 }} />;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
              return (
                <div
                  key={day}
                  className="p-1"
                  style={{
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    borderBottom: "1px solid var(--border-default)",
                    minHeight: 100,
                    background: isToday ? "rgba(199,91,57,0.05)" : "transparent",
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 text-xs mb-1"
                    style={{
                      color: isToday ? "var(--text-primary)" : "var(--text-secondary)",
                      background: isToday ? "var(--accent)" : "transparent",
                      borderRadius: isToday ? "50%" : undefined,
                    }}
                  >
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 4).map((e) => (
                      <EventBadge key={e.id} event={e} />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        +{dayEvents.length - 4} de plus
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {!loading && viewMode === "week" && (
        <WeekViewContent events={events} currentDate={currentDate} weekDays={weekDays} EventBadge={EventBadge} />
      )}

      {/* Day View */}
      {!loading && viewMode === "day" && (
        <DayViewContent events={events} currentDate={currentDate} />
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Suggestions d'optimisation
          </h3>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 text-sm"
                style={{ background: "rgba(122,154,101,0.08)", border: "1px solid rgba(122,154,101,0.15)" }}
              >
                <TrendingUp size={14} className="mt-0.5" style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--text-secondary)" }}>{s.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {platform}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateEventModal
          creators={creators}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchEvents(); }}
        />
      )}
    </div>
  );
}

// ========== WEEK VIEW ==========
function WeekViewContent({
  events, currentDate, weekDays, EventBadge,
}: {
  events: CalendarEvent[];
  currentDate: Date;
  weekDays: string[];
  EventBadge: ({ event }: { event: CalendarEvent }) => JSX.Element;
}) {
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return events.filter((e) => e.scheduled_for.startsWith(dateStr));
  };

  return (
    <div style={{ border: "1px solid var(--border-default)" }}>
      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {days.map((d, i) => (
          <div key={i} className="py-2 px-2 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              {weekDays[i]}
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: "var(--text-primary)" }}>
              {d.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ minHeight: 400 }}>
        {days.map((d, i) => (
          <div key={i} className="p-1" style={{ borderRight: "1px solid rgba(255,255,255,0.04)", minHeight: 150 }}>
            {getEventsForDay(d).map((e) => (
              <EventBadge key={e.id} event={e} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== DAY VIEW ==========
function DayViewContent({ events, currentDate }: { events: CalendarEvent[]; currentDate: Date }) {
  const dateStr = currentDate.toISOString().slice(0, 10);
  const dayEvents = events.filter((e) => e.scheduled_for.startsWith(dateStr));
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6h to 23h

  const getHourEvents = (hour: number) => {
    return dayEvents.filter((e) => {
      const h = new Date(e.scheduled_for).getHours();
      return h === hour;
    });
  };

  return (
    <div style={{ border: "1px solid var(--border-default)" }}>
      {hours.map((hour) => {
        const hourEvts = getHourEvents(hour);
        return (
          <div
            key={hour}
            className="flex"
            style={{ borderBottom: "1px solid var(--border-default)", minHeight: 48 }}
          >
            <div
              className="w-16 shrink-0 flex items-start justify-end pr-3 pt-2 text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
            <div className="flex-1 p-1 space-y-1">
              {hourEvts.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2 px-2 py-1 text-xs"
                  style={{
                    background: `${PLATFORM_COLORS[e.platform] || "#666"}15`,
                    borderLeft: `3px solid ${PLATFORM_COLORS[e.platform] || "#666"}`,
                    color: "var(--text-primary)",
                  }}
                >
                  <span>{CONTENT_TYPE_ICONS[e.content_type] || "📄"}</span>
                  <span className="font-medium">{e.creator?.display_name || e.creator?.full_name || e.creator?.email}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{e.platform}</span>
                  {e.title && <span style={{ color: "rgba(255,255,255,0.5)" }}>· {e.title}</span>}
                  <span
                    className="ml-auto text-[10px] px-1.5 py-0.5"
                    style={{ background: `${STATUS_COLORS[e.status]}20`, color: STATUS_COLORS[e.status] }}
                  >
                    {STATUS_LABELS[e.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========== CREATE MODAL ==========
function CreateEventModal({
  creators, onClose, onCreated,
}: {
  creators: any[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [creatorId, setCreatorId] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [contentType, setContentType] = useState("post");
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId || !platform || !scheduledDate) return;
    setSaving(true);
    setError(null);

    const scheduledFor = `${scheduledDate}T${scheduledTime}:00.000Z`;

    const res = await fetch("/api/admin/content-calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creator_id: creatorId, platform, content_type: contentType, title, scheduled_for: scheduledFor }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Erreur"); setSaving(false); return; }
    setSaving(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md p-6" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Nouvel événement</h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Créateur *</label>
            <select value={creatorId} onChange={(e) => setCreatorId(e.target.value)} required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
              <option value="">Sélectionner...</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>{c.display_name || c.full_name || c.email}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Plateforme *</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                {Object.keys(PLATFORM_LABELS).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Type *</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                {Object.entries(CONTENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Titre</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Date *</label>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Heure</label>
              <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
            </div>
          </div>
          {error && <div className="text-xs" style={{ color: "var(--danger)" }}>{error}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>Annuler</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
