import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFanById } from "@/lib/atlas/crm/fans";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { fanId } = await params;
    const fan = await getFanById(supabase, fanId, user.id);
    if (!fan) {
      return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });
    }

    // Fetch timeline (interactions + purchases)
    const { data: interactions } = await supabase
      .from("atlas_interactions")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(50);

    // Fetch purchases
    const { data: purchases } = await supabase
      .from("atlas_purchases")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("purchased_at", { ascending: false })
      .limit(50);

    // Fetch notes
    const { data: notes } = await supabase
      .from("atlas_notes")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("pin_order", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    // Fetch documents
    const { data: documents } = await supabase
      .from("atlas_documents")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("uploaded_at", { ascending: false })
      .limit(50);

    // Fetch pending drafts for this fan
    const { data: drafts } = await supabase
      .from("atlas_drafts")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      fan,
      interactions: interactions ?? [],
      purchases: purchases ?? [],
      notes: notes ?? [],
      documents: documents ?? [],
      pending_drafts: drafts ?? [],
    });
  } catch (err) {
    console.error("[ATLAS FAN DETAIL] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { fanId } = await params;
    const fan = await getFanById(supabase, fanId, user.id);
    if (!fan) {
      return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });
    }

    // Log deletion for RGPD compliance first
    await supabase.from("atlas_deletion_log").insert({
      creator_id: user.id,
      original_fan_id: fanId,
      fan_email: fan.email,
      fan_display_name: fan.display_name,
      reason: "Demande manuelle",
    });

    // Anonymize fan data instead of hard delete (RGPD compliant)
    await supabase
      .from("atlas_fans")
      .update({
        email: null,
        phone: null,
        display_name: "[Supprimé]",
        avatar_url: null,
        username_onlyfans: null,
        username_instagram: null,
        username_tiktok: null,
        username_other: {},
        country: null,
        language: "en",
        tags: [],
        custom_fields: {},
        status: "deleted",
        total_spent: 0,
        lifetime_value: 0,
        purchases_count: 0,
        total_interactions: 0,
        fan_score: 0,
        fan_tier: "churned",
        email_consent: false,
        sms_consent: false,
        push_consent: false,
        data_processing_consent: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fanId)
      .eq("creator_id", user.id);

    // Delete associated data
    await supabase.from("atlas_interactions").delete().eq("fan_id", fanId).eq("creator_id", user.id);
    await supabase.from("atlas_purchases").delete().eq("fan_id", fanId).eq("creator_id", user.id);
    await supabase.from("atlas_notes").delete().eq("fan_id", fanId).eq("creator_id", user.id);
    await supabase.from("atlas_documents").delete().eq("fan_id", fanId).eq("creator_id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ATLAS FAN DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
