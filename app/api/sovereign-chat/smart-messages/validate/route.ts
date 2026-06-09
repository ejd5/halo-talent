import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { draftId, action, edited_text } = body;

  if (!draftId || !action) {
    return NextResponse.json({ error: "draftId et action requis" }, { status: 400 });
  }

  if (!["skip", "send", "edit", "reject"].includes(action)) {
    return NextResponse.json({ error: "action invalide" }, { status: 400 });
  }

  // Verify draft ownership
  const { data: draft } = await supabase
    .from("atlas_drafts")
    .select("id, smart_message_campaign_id")
    .eq("id", draftId)
    .eq("creator_id", user.id)
    .single();

  if (!draft) return NextResponse.json({ error: "Draft introuvable" }, { status: 404 });

  const now = new Date().toISOString();

  switch (action) {
    case "send":
      await supabase
        .from("atlas_drafts")
        .update({ status: "sent", sent_at: now, sent_via: "smart_message", edited_text: edited_text || null })
        .eq("id", draftId);

      await supabase
        .from("atlas_smart_messages_campaigns")
        .update({ sent_count: (await getCount(supabase, draft.smart_message_campaign_id, "sent")) })
        .eq("id", draft.smart_message_campaign_id);
      break;

    case "edit":
      await supabase
        .from("atlas_drafts")
        .update({ status: "edited", edited_text })
        .eq("id", draftId);
      break;

    case "reject":
      await supabase
        .from("atlas_drafts")
        .update({ status: "rejected" })
        .eq("id", draftId);
      break;

    case "skip":
      // Keep as pending_validation, no status change
      break;
  }

  // Update validated count
  await supabase
    .from("atlas_smart_messages_campaigns")
    .update({
      validated_count: await getCount(supabase, draft.smart_message_campaign_id, [
        "sent", "edited", "rejected",
      ]),
    })
    .eq("id", draft.smart_message_campaign_id);

  return NextResponse.json({ ok: true });
}

async function getCount(supabase: any, campaignId: string, status: string | string[]) {
  const { count } = await supabase
    .from("atlas_drafts")
    .select("id", { count: "exact", head: true })
    .eq("smart_message_campaign_id", campaignId)
    .in("status", Array.isArray(status) ? status : [status]);

  return count ?? 0;
}
