import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const creatorIds = url.searchParams.get("creator_ids");
  const platform = url.searchParams.get("platform");
  const status = url.searchParams.get("status");
  const contentType = url.searchParams.get("content_type");
  const campaignId = url.searchParams.get("campaign_id");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "500", 10);

  let query = supabase
    .from("content_calendar_events")
    .select("*, creator:profiles!creator_id(id, full_name, display_name, email, avatar_url, department)")
    .order("scheduled_for", { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (from) query = query.gte("scheduled_for", from);
  if (to) query = query.lte("scheduled_for", to);
  if (platform) query = query.eq("platform", platform);
  if (status) query = query.eq("status", status);
  if (contentType) query = query.eq("content_type", contentType);
  if (campaignId) query = query.eq("campaign_id", campaignId);
  if (creatorIds) {
    const ids = creatorIds.split(",");
    query = query.in("creator_id", ids);
  }

  const { data: events, error } = await query;
  if (error) return NextResponse.json({ error: "Erreur chargement" }, { status: 500 });

  return NextResponse.json({ events: events || [], total: events?.length || 0 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { creator_id, platform, content_type, scheduled_for, title, preview_url, hashtags, campaign_id, notes } = body;

  if (!creator_id || !platform || !scheduled_for) {
    return NextResponse.json({ error: "creator_id, platform, scheduled_for requis" }, { status: 400 });
  }

  const { data: event, error } = await supabase
    .from("content_calendar_events")
    .insert({
      creator_id, platform, content_type: content_type || "post",
      scheduled_for, title, preview_url, hashtags, campaign_id, notes,
      status: "scheduled",
    })
    .select("*, creator:profiles!creator_id(id, full_name, display_name, email, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  return NextResponse.json({ event });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const allowed = ["title", "platform", "content_type", "scheduled_for", "status", "preview_url", "hashtags", "campaign_id", "notes", "published_at", "draft_id"];
  const clean: Record<string, any> = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) clean[key] = updates[key];
  }

  if (clean.status === "published" && !clean.published_at) {
    clean.published_at = new Date().toISOString();
  }

  const { data: event, error } = await supabase
    .from("content_calendar_events")
    .update({ ...clean, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, creator:profiles!creator_id(id, full_name, display_name, email, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  return NextResponse.json({ event });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("content_calendar_events").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
