import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logAction } from "@/lib/compliance/audit";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["approved", "revised", "blocked", "escalated", "false_positive"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id: qaItemId } = await params;

  try {
    const body = await request.json();
    const { status, notes } = body;

    if (!status || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      return NextResponse.json({ error: `Statut invalide. Valides: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const adminClient = await createAdminClient();

    // Fetch the QA item to get creator user_id for audit
    const { data: qaItem, error: fetchErr } = await adminClient
      .from("chat_ai_qa_items")
      .select("id, user_id, status, reason")
      .eq("id", qaItemId)
      .single();

    if (fetchErr || !qaItem) {
      return NextResponse.json({ error: "Item QA introuvable" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes) updates.notes = notes;

    const { error: updateErr } = await adminClient
      .from("chat_ai_qa_items")
      .update(updates)
      .eq("id", qaItemId);

    if (updateErr) {
      console.error("[Admin] QA update error:", updateErr);
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    // Audit log the admin action
    await logAction({
      userId: qaItem.user_id,
      actorId: auth.user.id,
      actorType: "admin",
      action: "admin_qa_reviewed",
      targetType: "qa_item",
      targetId: qaItemId,
      metadata: {
        adminId: auth.user.id,
        previousStatus: qaItem.status,
        newStatus: status,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      id: qaItemId,
      status,
      previousStatus: qaItem.status,
    });
  } catch (error) {
    console.error("[Admin] QA PATCH error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
