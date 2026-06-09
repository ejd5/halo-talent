import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Single campaign with drafts
  if (id) {
    const { data: campaign } = await supabase
      .from("atlas_smart_messages_campaigns")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!campaign) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    const { data: drafts } = await supabase
      .from("atlas_drafts")
      .select(`
        *,
        atlas_fans!inner(display_name, email, username_onlyfans, total_spent, fan_tier, fan_score, language, country, last_interaction_at)
      `)
      .eq("smart_message_campaign_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({ campaign, drafts: drafts || [] });
  }

  // List all campaigns with draft counts
  const { data: campaigns } = await supabase
    .from("atlas_smart_messages_campaigns")
    .select("*")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns || [] });
}
