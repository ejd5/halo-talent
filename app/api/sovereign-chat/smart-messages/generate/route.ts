import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ComplianceDrafter } from "@/lib/sovereign-chat/drafter";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";
import { notify } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { segmentId, brief, platform, tone, goal, variables, campaignName } = await request.json();

  if (!segmentId || !platform) {
    return NextResponse.json({ error: "segmentId et platform requis" }, { status: 400 });
  }

  // Verify segment ownership
  const { data: segment } = await supabase
    .from("atlas_segments")
    .select("id, name")
    .eq("id", segmentId)
    .eq("creator_id", user.id)
    .single();
  if (!segment) return NextResponse.json({ error: "Segment introuvable" }, { status: 404 });

  // Get members
  const engine = new SmartSegmentEngine();
  const members = await engine.getMembers(segmentId);
  if (members.length === 0) {
    return NextResponse.json({ error: "Le segment est vide" }, { status: 400 });
  }

  // Create campaign
  const { data: campaign, error: campErr } = await supabase
    .from("atlas_smart_messages_campaigns")
    .insert({
      creator_id: user.id,
      name: campaignName || brief?.slice(0, 60) || `Campagne ${segment.name}`,
      segment_id: segmentId,
      platform,
      tone: tone || "chaleureuse",
      goal: goal || "engagement",
      brief,
      variables: variables || [],
      total_drafts: members.length,
      status: "generating",
    })
    .select()
    .single();

  if (campErr) {
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }

  // Fire-and-forget background generation
  generateDraftsInBackground(campaign.id, members, { brief, platform, tone, goal, variables }, user.id);

  return NextResponse.json({
    campaign_id: campaign.id,
    total: members.length,
  });
}

async function generateDraftsInBackground(
  campaignId: string,
  members: any[],
  params: any,
  creatorId: string,
) {
  const drafter = new ComplianceDrafter(creatorId);
  const supabase = await createClient();
  const BATCH = 10;

  for (let i = 0; i < members.length; i += BATCH) {
    const batch = members.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (fan) => {
        try {
          const result = await drafter.draft({
            platform: params.platform,
            intent: "engagement",
            fan,
            context: {
              brief: params.brief,
              tone: params.tone,
              goal: params.goal,
              variables: params.variables,
            },
            count: 1,
          });

          if (result.success && result.drafts?.[0]) {
            await supabase.from("atlas_drafts").update({
              smart_message_campaign_id: campaignId,
            }).eq("id", result.drafts[0].id);
          }
        } catch (e) {
          console.error(`Draft failed for fan ${fan.id}:`, e);
        }
      }),
    );
  }

  // Mark campaign as ready
  await supabase
    .from("atlas_smart_messages_campaigns")
    .update({ status: "ready_for_validation" })
    .eq("id", campaignId);

  // Notify creator
  try {
    await notify({
      userId: creatorId,
      type: "smart_messages_ready",
      title: `${members.length} drafts prêts à valider`,
      message: `Campagne "${(params.brief || "").slice(0, 30)}..."`,
      channels: ["in_app"],
    });
  } catch {}
}
