import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const { id } = await params;

    // Fetch the change event
    const { data: event, error: fetchError } = await supabase
      .from("legal_change_events")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    if (event.human_reviewed) {
      return NextResponse.json({ error: "Déjà validé" }, { status: 409 });
    }

    // Update the event
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("legal_change_events")
      .update({
        human_reviewed: true,
        published: true,
        reviewed_by: user.id,
        reviewed_at: now,
        published_at: now,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Notify creators on the affected platform
    const { data: accounts } = await supabase
      .from("creator_accounts")
      .select("creator_id")
      .eq("platform", event.platform);

    const notifiedCreatorIds = accounts?.map((a) => a.creator_id) || [];
    let notifiedCount = 0;

    for (const creatorId of notifiedCreatorIds) {
      try {
        await notify({
          userId: creatorId,
          type: "legal_change",
          title: `${event.platform}, CGU mises à jour`,
          message: event.summary.slice(0, 200),
          severity: event.impact_level === "critical" ? "critical" : "info",
          link: "/dashboard/atlas/legal?tab=veille",
          channels: ["in_app"],
        });
        notifiedCount++;
      } catch {
        // Non-critical, continue notifying others
      }
    }

    return NextResponse.json({
      success: true,
      notified_creators: notifiedCount,
    });
  } catch (error) {
    console.error("Change event validate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
