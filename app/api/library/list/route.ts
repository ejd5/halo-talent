import { NextRequest, NextResponse } from "next/server";
import { mediaItems } from "@/lib/library/mock";
import type { MediaType } from "@/lib/library/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as MediaType | null;
  const search = searchParams.get("search")?.toLowerCase();
  const creator = searchParams.get("creator") || searchParams.get("creatorId");
  const tag = searchParams.get("tag");
  const platform = searchParams.get("platform");
  const mood = searchParams.get("mood");
  const safe = searchParams.get("safe");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  let results = [...mediaItems];

  if (type) {
    results = results.filter((m) => m.type === type);
  }
  if (creator) {
    results = results.filter((m) => m.creator_id === creator || m.creator_name === creator);
  }
  if (tag) {
    results = results.filter((m) => m.tags.includes(tag) || m.ai_tags.includes(tag));
  }
  if (platform) {
    results = results.filter((m) => m.ai_suitable_platforms.includes(platform) || m.used_on_platforms.includes(platform));
  }
  if (mood) {
    results = results.filter((m) => m.ai_mood === mood);
  }
  if (safe === "true") {
    results = results.filter((m) => m.moderation_safe);
  } else if (safe === "false") {
    results = results.filter((m) => !m.moderation_safe);
  }
  if (search) {
    results = results.filter((m) =>
      m.title.toLowerCase().includes(search) ||
      m.tags.some((t) => t.includes(search)) ||
      m.ai_tags.some((t) => t.includes(search)) ||
      (m.ai_description ?? "").toLowerCase().includes(search)
    );
  }

  const total = results.length;
  results = results.slice(offset, offset + limit);

  return NextResponse.json({
    items: results,
    total,
    offset,
    limit,
    has_more: offset + limit < total,
  });
}

export async function POST(request: NextRequest) {
  // Alias: POST /api/library/list with body
  const body = await request.json();
  const url = new URL(request.url);
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      url.searchParams.set(key, value);
    }
  }
  return GET(new NextRequest(url, request));
}
