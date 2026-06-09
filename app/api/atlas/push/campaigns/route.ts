import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushCampaign } from "@/lib/atlas/channels/push";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const status = request.nextUrl.searchParams.get("status");

    let query = supabase
      .from("atlas_push_campaigns")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: campaigns } = await query;

    // Get subscriber count
    const { count: subscriberCount } = await supabase
      .from("atlas_push_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id)
      .eq("active", true);

    return NextResponse.json({
      campaigns: campaigns ?? [],
      subscriber_count: subscriberCount || 0,
    });
  } catch (err) {
    console.error("[PUSH CAMPAIGNS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { title, body: pushBody, icon_url, image_url, target_url, segment_filter, send_now } = body;

    if (!title || !pushBody) {
      return NextResponse.json({ error: "title et body requis" }, { status: 400 });
    }

    const { data: campaign, error } = await supabase
      .from("atlas_push_campaigns")
      .insert({
        creator_id: user.id,
        title,
        body: pushBody,
        icon_url: icon_url || null,
        image_url: image_url || null,
        target_url: target_url || "/",
        segment_filter: segment_filter || {},
        status: send_now ? "sending" : "draft",
        stats: { sent: 0, delivered: 0, clicked: 0 },
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    // If send_now, trigger the send (async in background)
    if (send_now && campaign) {
      sendPushCampaign(campaign).catch((err) =>
        console.error("[PUSH] Background send error:", err)
      );
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error("[PUSH CAMPAIGNS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
