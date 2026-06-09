import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyUnsubToken, markUnsubTokenUsed } from "@/lib/atlas/channels/email";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const redirect = request.nextUrl.searchParams.get("redirect");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/atlas", request.url));
    }

    const fanId = await verifyUnsubToken(token);

    if (fanId) {
      const supabase = await createClient();

      // Update fan consent
      await supabase
        .from("atlas_fans")
        .update({
          email_consent: false,
          unsubscribed_at: new Date().toISOString(),
        })
        .eq("id", fanId);

      // Mark token used
      await markUnsubTokenUsed(token);

      // Log consent change
      await supabase.from("atlas_consent_logs").insert({
        fan_id: fanId,
        consent_type: "email_marketing",
        granted: false,
        source: "unsubscribe_link",
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        user_agent: request.headers.get("user-agent") || null,
      });

      // Also update any pending sends for this fan
      await supabase
        .from("atlas_campaign_sends")
        .update({ unsubscribed_at: new Date().toISOString(), status: "unsubscribed" })
        .eq("fan_id", fanId)
        .is("unsubscribed_at", null);
    }

    if (redirect === "json") {
      return NextResponse.json({ success: true, unsubscribed: !!fanId });
    }

    // Redirect to confirmation page
    return NextResponse.redirect(new URL("/unsubscribed", request.url));
  } catch (err) {
    console.error("[UNSUBSCRIBE] Error:", err);
    return NextResponse.redirect(new URL("/unsubscribed?error=1", request.url));
  }
}
