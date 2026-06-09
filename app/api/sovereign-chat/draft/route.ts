import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ComplianceDrafter } from "@/lib/sovereign-chat/drafter";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { platform, intent, fan_id, context, count } = body;

  if (!platform || !intent || !fan_id) {
    return NextResponse.json(
      { error: "platform, intent et fan_id requis" },
      { status: 400 },
    );
  }

  // Load fan profile
  const { data: fan, error: fanError } = await supabase
    .from("atlas_fans")
    .select("*")
    .eq("id", fan_id)
    .eq("creator_id", user.id)
    .single();

  if (fanError || !fan) {
    return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });
  }

  // Generate drafts
  try {
    const drafter = new ComplianceDrafter(user.id);
    const result = await drafter.draft({
      platform,
      intent,
      context: context || {},
      fan,
      count: count || 3,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.reason, details: result.details },
        { status: result.reason === "moderation_blocked" ? 422 : 500 },
      );
    }

    return NextResponse.json({ drafts: result.drafts });
  } catch (err) {
    console.error("Draft generation error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération des drafts" },
      { status: 500 },
    );
  }
}
