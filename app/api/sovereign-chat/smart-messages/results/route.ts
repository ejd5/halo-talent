import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign_id");
  if (!campaignId) return NextResponse.json({ error: "campaign_id requis" }, { status: 400 });

  const { data: campaign } = await supabase
    .from("atlas_smart_messages_campaigns")
    .select("*")
    .eq("id", campaignId)
    .eq("creator_id", user.id)
    .single();
  if (!campaign) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Draft stats by approach
  const { data: approaches } = await supabase
    .from("atlas_drafts")
    .select("approach, status")
    .eq("smart_message_campaign_id", campaignId);

  const approachStats: Record<string, { total: number; sent: number; rejected: number }> = {};
  for (const d of approaches || []) {
    const key = d.approach || "unknown";
    if (!approachStats[key]) approachStats[key] = { total: 0, sent: 0, rejected: 0 };
    approachStats[key].total++;
    if (d.status === "sent") approachStats[key].sent++;
    if (d.status === "rejected") approachStats[key].rejected++;
  }

  return NextResponse.json({
    campaign,
    analytics: {
      total: campaign.total_drafts,
      validated: campaign.validated_count,
      sent: campaign.sent_count,
      rejected: campaign.rejected_count,
      pending: campaign.total_drafts - campaign.validated_count - campaign.rejected_count,
      completion_pct: campaign.total_drafts > 0
        ? Math.round(((campaign.validated_count + campaign.rejected_count) / campaign.total_drafts) * 100)
        : 0,
      approaches: approachStats,
    },
  });
}
