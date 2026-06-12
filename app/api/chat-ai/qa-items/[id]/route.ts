import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/compliance/audit";
import type { QAStatus } from "@/lib/types/chat-ai";

export const dynamic = "force-dynamic";

const VALID_STATUSES: QAStatus[] = ["approved", "revised", "blocked", "escalated", "false_positive", "pending"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id: itemId } = await params;

  try {
    const body = await request.json();
    const { status, notes } = body;

    if (status && !VALID_STATUSES.includes(status as QAStatus)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from("chat_ai_qa_items")
      .select("id, user_id, status")
      .eq("id", itemId)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Item introuvable" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (status && status !== "pending") updates.reviewer_id = user.id;

    const { error: updateErr } = await supabase
      .from("chat_ai_qa_items")
      .update(updates)
      .eq("id", itemId);

    if (updateErr) {
      console.error("[Chat AI] QA update error:", updateErr);
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    await logAction({
      userId: user.id,
      actorId: user.id,
      actorType: "creator",
      action: "qa_item_reviewed",
      targetType: "qa_item",
      targetId: itemId,
      metadata: { newStatus: status, previousStatus: existing.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Chat AI] QA PATCH error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
