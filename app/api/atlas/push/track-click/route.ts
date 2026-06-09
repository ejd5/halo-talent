import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json({ error: "campaignId requis" }, { status: 400 });
    }

    const supabase = await createClient();

    // Update the most recent send record for this campaign
    await supabase
      .from("atlas_campaign_sends")
      .update({ status: "clicked", clicked_at: new Date().toISOString() })
      .eq("campaign_id", campaignId)
      .eq("status", "sent");

    // Update campaign stats
    const { data: sends } = await supabase
      .from("atlas_campaign_sends")
      .select("status")
      .eq("campaign_id", campaignId);

    const clicked = sends?.filter((s) => s.status === "clicked").length || 0;
    const sent = sends?.filter((s) => s.status === "sent" || s.status === "clicked").length || 0;

    await supabase
      .from("atlas_push_campaigns")
      .update({ stats: { sent, delivered: sent, clicked } })
      .eq("id", campaignId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUSH TRACK CLICK] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
