import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logAction } from "@/lib/compliance/audit";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id: creatorId } = await params;

  try {
    const body = await request.json();
    const { is_paused } = body;

    if (typeof is_paused !== "boolean") {
      return NextResponse.json({ error: "is_paused (boolean) requis" }, { status: 400 });
    }

    const adminClient = await createAdminClient();

    // Verify creator config exists and capture previous state
    const { data: existing, error: fetchErr } = await adminClient
      .from("chat_ai_user_config")
      .select("user_id, is_paused")
      .eq("user_id", creatorId)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Configuration Chat AI introuvable pour ce créateur" }, { status: 404 });
    }

    const previousPaused = existing.is_paused;

    // Update creator's config
    const { error: updateErr } = await adminClient
      .from("chat_ai_user_config")
      .update({ is_paused, updated_at: new Date().toISOString() })
      .eq("user_id", creatorId);

    if (updateErr) {
      console.error("[Admin] Pause update error:", updateErr);
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    // Audit log the admin action
    await logAction({
      userId: creatorId,
      actorId: auth.user.id,
      actorType: "admin",
      action: is_paused ? "admin_chat_ai_creator_paused" : "admin_chat_ai_creator_resumed",
      targetType: "creator_account",
      targetId: creatorId,
      metadata: { adminId: auth.user.id, previousState: previousPaused, newState: is_paused },
    });

    return NextResponse.json({
      success: true,
      creatorId,
      isPaused: is_paused,
      action: is_paused ? "paused" : "resumed",
    });
  } catch (error) {
    console.error("[Admin] Pause error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
