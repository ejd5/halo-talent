import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/atlas/webhooks/[apiKey]/[hookName]
// Public endpoint — receives external webhook events (Stripe, Calendly, etc.)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length < 2) {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    const [apiKey, ...hookNameParts] = slug;
    const hookName = hookNameParts.join("/");

    const supabase = await createClient();

    // Verify API key
    const { data: keyRecord } = await supabase
      .from("atlas_api_keys")
      .select("creator_id, active")
      .eq("key", apiKey)
      .eq("active", true)
      .maybeSingle();

    if (!keyRecord) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const payload = await request.json();
    const headers = Object.fromEntries(request.headers.entries());
    const sourceIp = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";

    // Log the webhook event
    const { data: event } = await supabase
      .from("atlas_webhook_events")
      .insert({
        creator_id: keyRecord.creator_id,
        hook_name: hookName,
        source_ip: sourceIp,
        headers,
        payload,
        matched_rules: 0,
      })
      .select()
      .single();

    // Find matching rules and enqueue them
    const { data: matchingRules } = await supabase
      .from("atlas_rules")
      .select("id")
      .eq("creator_id", keyRecord.creator_id)
      .eq("trigger_event", "webhook_received")
      .eq("is_active", true);

    let matchedCount = 0;
    if (matchingRules && matchingRules.length > 0) {
      for (const rule of matchingRules) {
        await supabase.rpc("atlas_enqueue_rule", {
          p_rule_id: rule.id,
          p_creator_id: keyRecord.creator_id,
          p_trigger_event: JSON.stringify({ hook_name: hookName, payload }),
          p_fan_id: null,
        });
        matchedCount++;
      }

      // Update matched count
      if (event) {
        await supabase
          .from("atlas_webhook_events")
          .update({ matched_rules: matchedCount })
          .eq("id", event.id);
      }
    }

    return NextResponse.json({
      received: true,
      event_id: event?.id,
      rules_matched: matchedCount,
    });
  } catch (err) {
    console.error("[ATLAS WEBHOOK] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET — health check
export async function GET() {
  return NextResponse.json({ status: "ok", service: "atlas-webhooks" });
}
