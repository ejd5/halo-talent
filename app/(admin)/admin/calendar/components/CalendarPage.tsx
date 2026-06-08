"use client";

import { useCallback, useMemo, useState } from "react";
import { calendarEvents as allEvents } from "../data";
import type { CalendarEvent, CalendarView } from "../types";
import { CalendarToolbar, type CalendarFilters } from "./CalendarToolbar";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { TimelineView } from "./TimelineView";
import { EventDetailPanel } from "./EventDetailPanel";
import { CreatePostModal } from "./CreatePostModal";
import { InsightsSidebar } from "./InsightsSidebar";

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 8)); // June 8 2026
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState(allEvents);
  const [filters, setFilters] = useState<CalendarFilters>({
    creator_ids: [],
    platforms: [],
    statuses: [],
    content_types: [],
  });

  // Apply filters
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filters.creator_ids.length > 0 && !filters.creator_ids.includes(ev.creator_name)) return false;
      if (filters.platforms.length > 0 && !filters.platforms.includes(ev.platform)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(ev.status)) return false;
      if (filters.content_types.length > 0 && !filters.content_types.includes(ev.content_type)) return false;
      return true;
    });
  }, [events, filters]);

  const navigateMonth = useCallback((delta: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }, []);

  const goToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleStatusChange = useCallback(
    (id: string, status: CalendarEvent["status"]) => {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === id ? { ...ev, status } : ev))
      );
    },
    []
  );

  const handleCreatePost = useCallback(
    (post: {
      creator_name: string;
      platform: string;
      content_type: string;
      content_preview: string;
      caption: string;
      hashtags: string[];
      scheduled_at: string;
    }) => {
      const newEvent: CalendarEvent = {
        id: `ev-${Date.now()}`,
        creator_id: allEvents.find((e) => e.creator_name === post.creator_name)?.creator_id ?? "unknown",
        creator_name: post.creator_name,
        creator_avatar: null,
        platform: post.platform,
        content_type: post.content_type as CalendarEvent["content_type"],
        content_preview: post.content_preview,
        caption: post.caption,
        hashtags: post.hashtags,
        media_url: null,
        media_type: null,
        scheduled_at: post.scheduled_at,
        status: "planned",
        estimated_reach: null,
        estimated_engagement: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    []
  );

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col gap-4 p-6 overflow-auto">
        <CalendarToolbar
          currentDate={currentDate}
          onPrevMonth={() => navigateMonth(-1)}
          onNextMonth={() => navigateMonth(1)}
          onToday={goToday}
          view={view}
          onViewChange={setView}
          filters={filters}
          onFiltersChange={setFilters}
          onNewPost={() => setShowCreateModal(true)}
          showInsights={showInsights}
          onToggleInsights={() => setShowInsights((s) => !s)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((s) => !s)}
        />

        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={(ev) => setSelectedEventId(ev.id)}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={(ev) => setSelectedEventId(ev.id)}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={(ev) => setSelectedEventId(ev.id)}
          />
        )}
        {view === "list" && (
          <TimelineView
            events={filteredEvents}
            onEventClick={(ev) => setSelectedEventId(ev.id)}
          />
        )}
      </div>

      {/* Event detail panel */}
      {selectedEventId && (
        <EventDetailPanel
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create post modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreatePost}
        />
      )}

      {/* Insights sidebar */}
      {showInsights && (
        <InsightsSidebar onClose={() => setShowInsights(false)} />
      )}
    </div>
  );
}
