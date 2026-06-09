import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { campaignId } = body;
  if (!campaignId) return NextResponse.json({ error: "campaignId requis" }, { status: 400 });

  // Verify ownership
  const { data: campaign } = await supabase
    .from("atlas_smart_messages_campaigns")
    .select("id, platform")
    .eq("id", campaignId)
    .eq("creator_id", user.id)
    .single();
  if (!campaign) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Get all remaining pending drafts
  const { data: remaining } = await supabase
    .from("atlas_drafts")
    .select("id")
    .eq("smart_message_campaign_id", campaignId)
    .eq("status", "pending_validation");

  if (!remaining?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const now = new Date().toISOString();

  // Mark all as sent
  await supabase
    .from("atlas_drafts")
    .update({ status: "sent", sent_at: now, sent_via: "smart_message" })
    .eq("smart_message_campaign_id", campaignId)
    .eq("status", "pending_validation");

  // Update campaign counts
  const totalSent = remaining.length;
  await supabase
    .from("atlas_smart_messages_campaigns")
    .update({
      sent_count: totalSent,
      validated_count: totalSent,
      status: "completed",
      completed_at: now,
    })
    .eq("id", campaignId);

  return NextResponse.json({ sent: totalSent });
}
