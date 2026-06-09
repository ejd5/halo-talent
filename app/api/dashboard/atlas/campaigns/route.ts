import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    let query = supabase
      .from("atlas_campaigns")
      .select("*, audience_segment:atlas_segments(id, name)")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);

    const { data: campaigns } = await query;

    // Fetch stats for each campaign
    const campaignsWithStats = await Promise.all(
      (campaigns || []).map(async (c: any) => {
        const { data: sends } = await supabase
          .from("atlas_campaign_sends")
          .select("status, opened_at, clicked_at, unsubscribed_at")
          .eq("campaign_id", c.id);

        const total = sends?.length || 0;
        const sent = sends?.filter((s: any) => s.status !== "pending").length || 0;
        const opened = sends?.filter((s: any) => s.opened_at).length || 0;
        const clicked = sends?.filter((s: any) => s.clicked_at).length || 0;
        const unsubscribed = sends?.filter((s: any) => s.unsubscribed_at).length || 0;

        return {
          ...c,
          stats: {
            total,
            sent,
            opened,
            open_rate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
            clicked,
            click_rate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
            unsubscribed,
          },
        };
      })
    );

    return NextResponse.json({ campaigns: campaignsWithStats });
  } catch (err) {
    console.error("[CAMPAIGNS LIST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name, type, goal } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Nom et type requis" }, { status: 400 });
    }

    const { data: campaign, error } = await supabase
      .from("atlas_campaigns")
      .insert({
        creator_id: user.id,
        name,
        type,
        goal: goal || "engagement",
        status: "draft",
        content: body.content || [],
        subject: body.subject || "",
        preheader: body.preheader || "",
        from_name: body.from_name || "",
        from_email: body.from_email || "",
        audience_segment_id: body.audience_segment_id || null,
        custom_filters: body.custom_filters || {},
        personalize_with_ai: body.personalize_with_ai || false,
        schedule_at: body.schedule_at || null,
        throttle_hours: body.throttle_hours || 4,
        ab_test_enabled: body.ab_test_enabled || false,
        ab_test_version_a: body.ab_test_version_a || null,
        ab_test_version_b: body.ab_test_version_b || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("[CAMPAIGNS CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
