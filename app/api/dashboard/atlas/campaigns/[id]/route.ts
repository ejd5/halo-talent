import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    const { data: campaign } = await supabase
      .from("atlas_campaigns")
      .select("*, audience_segment:atlas_segments(*)")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!campaign) return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });

    // Fetch sends stats
    const { data: sends } = await supabase
      .from("atlas_campaign_sends")
      .select("status, opened_at, clicked_at, unsubscribed_at, error, sent_at")
      .eq("campaign_id", id);

    const total = sends?.length || 0;
    const sent = sends?.filter((s: any) => s.status !== "pending").length || 0;
    const opened = sends?.filter((s: any) => s.opened_at).length || 0;
    const clicked = sends?.filter((s: any) => s.clicked_at).length || 0;
    const failed = sends?.filter((s: any) => s.status === "failed").length || 0;
    const bounced = sends?.filter((s: any) => s.status === "bounced").length || 0;

    // Fetch recent sends list for activity log
    const { data: recentSends } = await supabase
      .from("atlas_campaign_sends")
      .select("*, fan:atlas_fans(id, display_name, email)")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      campaign: {
        ...campaign,
        stats: {
          total, sent, opened, clicked, failed, bounced,
          open_rate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
          click_rate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
        },
        recent_sends: recentSends || [],
      },
    });
  } catch (err) {
    console.error("[CAMPAIGN DETAIL] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Prevent editing after sending
    const { data: existing } = await supabase
      .from("atlas_campaigns")
      .select("status")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!existing) return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    if (existing.status === "sent" || existing.status === "sending") {
      return NextResponse.json({ error: "Impossible de modifier une campagne en cours d'envoi" }, { status: 400 });
    }

    const allowed = [
      "name", "type", "goal", "subject", "preheader", "from_name", "from_email",
      "content", "audience_segment_id", "custom_filters", "personalize_with_ai",
      "schedule_at", "throttle_hours", "ab_test_enabled", "ab_test_version_a",
      "ab_test_version_b", "status",
    ];

    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    updates.updated_at = new Date().toISOString();

    const { data: campaign } = await supabase
      .from("atlas_campaigns")
      .update(updates)
      .eq("id", id)
      .eq("creator_id", user.id)
      .select()
      .single();

    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("[CAMPAIGN UPDATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    const { data: existing } = await supabase
      .from("atlas_campaigns")
      .select("status")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!existing) return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    if (existing.status === "sending") {
      return NextResponse.json({ error: "Impossible de supprimer une campagne en cours d'envoi" }, { status: 400 });
    }

    await supabase.from("atlas_campaigns").delete().eq("id", id).eq("creator_id", user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CAMPAIGN DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
