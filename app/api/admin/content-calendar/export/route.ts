import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "csv";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let query = supabase
    .from("content_calendar_events")
    .select("*, creator:profiles!creator_id(full_name, display_name, email)")
    .order("scheduled_for", { ascending: true });

  if (from) query = query.gte("scheduled_for", from);
  if (to) query = query.lte("scheduled_for", to);

  const { data: events } = await query;
  if (!events) return NextResponse.json({ error: "Aucun événement" }, { status: 404 });

  if (format === "csv") {
    const headers = "creator,platform,content_type,title,scheduled,status,hashtags";
    const rows = events.map((e: any) =>
      [
        `"${e.creator?.display_name || e.creator?.full_name || ""}"`,
        e.platform,
        e.content_type,
        `"${(e.title || "").replace(/"/g, '""')}"`,
        e.scheduled_for,
        e.status,
        `"${(e.hashtags || []).join(", ")}"`,
      ].join(",")
    );
    const csv = [headers, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="content-calendar-${from || "all"}.csv"`,
      },
    });
  }

  // iCal export
  if (format === "ical") {
    const ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Where Talent Forms//Content Calendar//FR",
      "CALSCALE:GREGORIAN",
    ];

    for (const e of events) {
      const dtStart = new Date(e.scheduled_for).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const dtEnd = new Date(new Date(e.scheduled_for).getTime() + 3600000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const creatorName = (e as any).creator?.display_name || (e as any).creator?.full_name || "Creator";

      ical.push("BEGIN:VEVENT");
      ical.push(`UID:${e.id}@halotalent`);
      ical.push(`DTSTART:${dtStart}`);
      ical.push(`DTEND:${dtEnd}`);
      ical.push(`SUMMARY:${creatorName} - ${e.title || e.content_type} (${e.platform})`);
      ical.push(`DESCRIPTION:${e.platform} / ${e.content_type}${e.hashtags?.length ? "\\n" + e.hashtags.join(", ") : ""}`);
      ical.push(`STATUS:${e.status === "published" ? "CONFIRMED" : "TENTATIVE"}`);
      ical.push("END:VEVENT");
    }

    ical.push("END:VCALENDAR");

    return new NextResponse(ical.join("\r\n"), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="content-calendar-${from || "all"}.ics"`,
      },
    });
  }

  return NextResponse.json({ events });
}
