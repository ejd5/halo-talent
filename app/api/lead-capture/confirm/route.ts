import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/?error=invalid_token", request.url));
    }

    const supabase = await createClient();

    // Find submission by token
    const { data: submission } = await supabase
      .from("lead_capture_submissions")
      .select("id, fan_id, creator_id, email, status, token_expires_at")
      .eq("confirmation_token", token)
      .single();

    if (!submission) {
      return NextResponse.redirect(new URL("/?error=invalid_token", request.url));
    }

    if (submission.status === "confirmed") {
      // Already confirmed, redirect to thanks
      return NextResponse.redirect(new URL("/thanks?already=1", request.url));
    }

    if (submission.status === "expired" || (submission.token_expires_at && new Date(submission.token_expires_at) < new Date())) {
      return NextResponse.redirect(new URL("/?error=expired", request.url));
    }

    // Mark submission as confirmed
    await supabase
      .from("lead_capture_submissions")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", submission.id);

    // Update fan consent
    if (submission.fan_id) {
      await supabase
        .from("atlas_fans")
        .update({
          email_consent: true,
          email_consent_at: new Date().toISOString(),
        })
        .eq("id", submission.fan_id);
    }

    // Log consent
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    await supabase
      .from("consent_logs")
      .insert({
        fan_id: submission.fan_id,
        creator_id: submission.creator_id,
        consent_type: "email_marketing",
        granted: true,
        source: "double_opt_in",
        ip_address: ip,
      })
      .maybeSingle();

    return NextResponse.redirect(new URL("/thanks", request.url));
  } catch (err) {
    console.error("[LEAD-CAPTURE CONFIRM] Error:", err);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
