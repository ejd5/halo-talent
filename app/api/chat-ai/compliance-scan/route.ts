import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canUseChatAIAction, scanMessageText } from "@/lib/compliance/chat-ai-gate";
import { logAction } from "@/lib/compliance/audit";
import type { ComplianceCheckResult } from "@/lib/types/chat-ai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;

  try {
    const body = await request.json();
    const { text, fanId, conversationId, action = "generate_draft" } = body;

    if (!text) {
      return NextResponse.json({ error: "text requis" }, { status: 400 });
    }

    // 1. Load context for compliance gate
    let fanRiskFlags: string[] = [];
    let fanStatus: string | null = null;

    if (fanId) {
      const { data: fan } = await supabase
        .from("chat_ai_fans")
        .select("risk_flags, status")
        .eq("id", fanId)
        .single();
      if (fan) {
        fanRiskFlags = (fan.risk_flags as string[]) || [];
        fanStatus = fan.status as string;
      }
    }

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

    // 2. Module-level compliance
    let convPlatform: string | undefined;
    if (conversationId) {
      const { data: conv } = await supabase
        .from("chat_ai_conversations")
        .select("platform")
        .eq("id", conversationId)
        .single();
      convPlatform = conv?.platform as string | undefined;
    }

    const gateResult: ComplianceCheckResult = canUseChatAIAction(
      action as Parameters<typeof canUseChatAIAction>[0],
      {
        userId,
        fanId: fanId || undefined,
        platform: convPlatform as Parameters<typeof canUseChatAIAction>[1]["platform"],
        mode: config?.mode as Parameters<typeof canUseChatAIAction>[1]["mode"],
        disclosure: config?.disclosure as Parameters<typeof canUseChatAIAction>[1]["disclosure"],
        consentCompleted: consentComplete,
        isPaused: config?.is_paused as boolean | undefined,
      }
    );

    // 3. Text-level scan
    const textScan = scanMessageText(text);

    // 4. Fan-level checks
    const fanReasons: string[] = [];
    if (fanStatus === "do_not_contact") {
      fanReasons.push("Ce fan est marqué 'Ne pas contacter'.");
    }
    if (fanRiskFlags.includes("vulnerable_fan") && action !== "generate_draft") {
      fanReasons.push("Fan détecté comme vulnérable — actions commerciales bloquées.");
    }

    // 5. Aggregate result
    const allReasons = [...gateResult.reasons, ...textScan.reasons, ...fanReasons];
    const allRequired = [...gateResult.requiredActions, ...textScan.requiredActions];
    const allowed = gateResult.allowed && textScan.allowed && fanReasons.length === 0;
    const riskLevel = (!allowed || gateResult.riskLevel === "high" || textScan.riskLevel === "high")
      ? "high" : (allReasons.length > 0 ? "medium" : "low");

    const result: ComplianceCheckResult = {
      allowed,
      riskLevel,
      reasons: allReasons,
      requiredActions: allRequired,
      suggestedSafeAlternative: !allowed
        ? "Reformulez le message en respectant les règles de conformité."
        : null,
    };

    // 6. Audit log
    await logAction({
      userId,
      actorId: userId,
      actorType: "creator",
      action: allowed ? "compliance_scan_passed" : "compliance_block_triggered",
      targetType: "message",
      targetId: conversationId || null,
      metadata: {
        action,
        fanId: fanId || null,
        riskLevel,
        reasons: allReasons,
        textLength: text.length,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Chat AI] Compliance scan POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
