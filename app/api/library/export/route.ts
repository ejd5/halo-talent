import { NextRequest, NextResponse } from "next/server";
import { mediaItems } from "@/lib/library/mock";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const creatorId = searchParams.get("creatorId");
  const format = searchParams.get("format") || "json";

  let items = mediaItems;
  if (creatorId) {
    items = items.filter((m) => m.creator_id === creatorId);
  }

  if (format === "csv") {
    const header = "id,title,type,file_size,width,height,duration,mime_type,tags,created_at";
    const rows = items.map((m) =>
      [
        m.id,
        `"${m.title}"`,
        m.type,
        m.file_size,
        m.width ?? "",
        m.height ?? "",
        m.duration ?? "",
        m.mime_type,
        `"${m.tags.join("; ")}"`,
        m.created_at,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bibliothèque-${creatorId ?? "tous"}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // Default: JSON export
  const exportData = items.map((m) => ({
    id: m.id,
    title: m.title,
    url: m.url,
    type: m.type,
    mime_type: m.mime_type,
    file_size: m.file_size,
    width: m.width,
    height: m.height,
    duration: m.duration,
    tags: [...m.tags, ...m.ai_tags],
    description: m.ai_description,
    mood: m.ai_mood,
    platforms: [...m.ai_suitable_platforms, ...m.used_on_platforms],
    moderation: {
      safe: m.moderation_safe,
      concerns: m.moderation_concerns,
    },
    created_at: m.created_at,
  }));

  return NextResponse.json({
    exported_at: new Date().toISOString(),
    creator_id: creatorId ?? "all",
    count: exportData.length,
    items: exportData,
  });
}
