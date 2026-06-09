import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tracking pixel — 1x1 transparent GIF
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaign");
  const recipientId = searchParams.get("recipient");

  if (campaignId && recipientId) {
    try {
      const supabase = await createClient();
      // Direct update instead of RPC (which doesn't exist yet)
      await supabase
        .from("atlas_campaign_sends")
        .update({
          opened_at: new Date().toISOString(),
          status: "opened",
          open_count: 1,
        })
        .eq("campaign_id", campaignId)
        .eq("fan_id", recipientId)
        .is("opened_at", null);
    } catch {
      // Silent — tracking pixel must never break
    }
  }

  return new Response(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
