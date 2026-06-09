import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign");
  const recipientId = searchParams.get("recipient");
  const targetUrl = searchParams.get("url");

  if (campaignId && recipientId) {
    try {
      const supabase = await createClient();
      await supabase
        .from("atlas_campaign_sends")
        .update({
          clicked_at: new Date().toISOString(),
          status: "clicked",
          click_count: 1,
        })
        .eq("campaign_id", campaignId)
        .eq("fan_id", recipientId)
        .is("clicked_at", null);
    } catch {
      // Silent
    }
  }

  if (targetUrl) {
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.redirect(new URL("/", request.url));
}
