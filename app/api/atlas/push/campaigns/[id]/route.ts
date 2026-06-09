import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPushCampaign } from "@/lib/atlas/channels/push";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: campaign } = await supabase
      .from("atlas_push_campaigns")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    }

    // Get delivery stats
    const { data: sends } = await supabase
      .from("atlas_campaign_sends")
      .select("status, clicked_at, error, created_at")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ campaign, sends: sends ?? [] });
  } catch (err) {
    console.error("[PUSH CAMPAIGN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();

    const updates: Record<string, any> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.body !== undefined) updates.body = body.body;
    if (body.icon_url !== undefined) updates.icon_url = body.icon_url;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    if (body.target_url !== undefined) updates.target_url = body.target_url;
    if (body.status !== undefined) updates.status = body.status;

    const { data: campaign, error } = await supabase
      .from("atlas_push_campaigns")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("[PUSH CAMPAIGN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { error } = await supabase
      .from("atlas_push_campaigns")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUSH CAMPAIGN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST: send campaign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: campaign } = await supabase
      .from("atlas_push_campaigns")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    }

    // Update status to sending
    await supabase
      .from("atlas_push_campaigns")
      .update({ status: "sending" })
      .eq("id", id);

    const result = await sendPushCampaign(campaign);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("[PUSH CAMPAIGN SEND] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
