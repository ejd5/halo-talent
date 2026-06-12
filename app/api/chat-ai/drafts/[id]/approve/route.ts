import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canUseChatAIAction } from "@/lib/compliance/chat-ai-gate";
import { logAction } from "@/lib/compliance/audit";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;
  const { id: draftId } = await params;

  try {
    // 1. Load draft
    const { data: draft, error: draftErr } = await supabase
      .from("chat_ai_drafts")
      .select("*, chat_ai_conversations!inner(fan_id, platform)")
      .eq("id", draftId)
      .single();

    if (draftErr || !draft) {
      return NextResponse.json({ error: "Brouillon introuvable" }, { status: 404 });
    }

    if (draft.status === "approved") {
      return NextResponse.json({ error: "Déjà approuvé" }, { status: 409 });
    }

    if (draft.status === "blocked") {
      return NextResponse.json({
        error: "Ce brouillon est bloqué par la conformité et ne peut pas être approuvé.",
      }, { status: 403 });
    }

    // 2. Load fan for compliance check
    const conv = draft.chat_ai_conversations as Record<string, unknown> | null;
    const fanId = conv?.fan_id as string | undefined;

    if (fanId) {
      const { data: fan } = await supabase
        .from("chat_ai_fans")
        .select("risk_flags, status")
        .eq("id", fanId)
        .single();

      if (fan) {
        const flags = (fan.risk_flags as string[]) || [];
        if (flags.includes("do_not_contact") || fan.status === "do_not_contact") {
          return NextResponse.json({
            error: "Action impossible : ce fan est marqué 'Ne pas contacter'.",
          }, { status: 403 });
        }
      }
    }

    // 3. Load config for compliance gate
    const { data: config } = await supabase
      .from("chat_ai_user_config")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { data: consent } = await supabase
      .from("chat_ai_consent_checklists")
      .select("*")
      .eq("user_id", userId)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const consentComplete = consent
      ? (consent.item_1_authorized && consent.item_2_platform_rules &&
         consent.item_3_ia_limitations && consent.item_4_no_guarantee &&
         consent.item_5_no_revenue_guarantee && consent.item_6_human_approval &&
         consent.item_7_disclosure && consent.item_8_boundaries &&
         consent.item_9_audit_logged && consent.item_10_can_disable &&
         consent.item_11_legal_info_only)
      : false;

    // 4. Compliance gate
    const gateResult = canUseChatAIAction("approve_draft", {
      userId,
      fanId,
      platform: conv?.platform as string | undefined as Parameters<typeof canUseChatAIAction>[1]["platform"],
      mode: config?.mode as string | undefined as Parameters<typeof canUseChatAIAction>[1]["mode"],
      disclosure: config?.disclosure as string | undefined as Parameters<typeof canUseChatAIAction>[1]["disclosure"],
      consentCompleted: consentComplete,
      isPaused: config?.is_paused as boolean | undefined,
    });

    if (!gateResult.allowed) {
      return NextResponse.json(gateResult, { status: 403 });
    }

    // 5. Update draft status
    const { error: updateErr } = await supabase
      .from("chat_ai_drafts")
      .update({
        status: "approved",
        compliance_status: "ok",
      })
      .eq("id", draftId);

    if (updateErr) {
      console.error("[Chat AI] Draft approve update error:", updateErr);
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    // 6. Audit log
    await logAction({
      userId,
      actorId: userId,
      actorType: "creator",
      action: "ai_draft_approved",
      targetType: "draft",
      targetId: draftId,
      metadata: {
        conversationId: draft.conversation_id,
        fanId: fanId || null,
        previousStatus: draft.status,
      },
    });

    return NextResponse.json({
      success: true,
      draftId,
      status: "approved",
      message: "Brouillon approuvé. Prêt à copier — aucun envoi automatique n'a été effectué.",
    });
  } catch (error) {
    console.error("[Chat AI] Draft approve POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
