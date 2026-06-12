import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callDeepSeek, isDemoMode } from "@/lib/ai/deepseek";
import { pickModel } from "@/lib/ai/router";
import { buildDraftPrompt } from "@/lib/ai/prompts";
import { demoDraftResponse } from "@/lib/ai/demo-responses";
import { canUseChatAIAction, scanMessageText } from "@/lib/compliance/chat-ai-gate";
import { logAction } from "@/lib/compliance/audit";
import type { ComplianceCheckResult, DeepSeekModel } from "@/lib/types/chat-ai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      conversationId,
      objective,
      actionType = "generate",
      toneOverride,
      ppvAssetId,
      targetLanguage,
    } = body;

    if (!conversationId || !objective) {
      return NextResponse.json(
        { error: "conversationId et objective requis" },
        { status: 400 }
      );
    }

    // 1. Load conversation (RLS ensures user owns it)
    const { data: conv, error: convErr } = await supabase
      .from("chat_ai_conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    // 2. Load fan
    const fanId = conv.fan_id;
    let fan: Record<string, unknown> | null = null;
    if (fanId) {
      const { data: fanData } = await supabase
        .from("chat_ai_fans")
        .select("*")
        .eq("id", fanId)
        .single();
      fan = fanData;
    }

    // 3. Load last 10 messages
    const { data: messages } = await supabase
      .from("chat_ai_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("seq", { ascending: false })
      .limit(10);

    const recentHistory = (messages || [])
      .reverse()
      .map((m: Record<string, unknown>) =>
        `[${m.direction === "in" ? "Fan" : "Moi"}]: ${m.text}`
      )
      .join("\n");

    // 4. Load active playbook
    const { data: config } = await supabase
      .from("chat_ai_user_config")
      .select("*, chat_ai_playbooks!chat_ai_user_config_active_playbook_id_fkey(*)")
      .eq("user_id", userId)
      .single();

    const playbook = config?.chat_ai_playbooks as Record<string, unknown> | null;

    // 5. Load consent checklist
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

    // 6. Load vault asset if ppvAssetId
    let vaultAsset: Record<string, unknown> | null = null;
    if (ppvAssetId) {
      const { data: asset } = await supabase
        .from("chat_ai_vault_assets")
        .select("*")
        .eq("id", ppvAssetId)
        .single();
      vaultAsset = asset;
    }

    // 7. Compliance gate — fan status pre-checks
    const fanRiskFlags = (fan?.risk_flags as string[]) || [];
    const fanStatus = fan?.status as string | undefined;

    if (fanStatus === "do_not_contact") {
      return NextResponse.json({
        allowed: false,
        riskLevel: "high",
        reasons: ["Ce fan est marqué 'Ne pas contacter'. Aucune action possible."],
        requiredActions: [],
        suggestedSafeAlternative: null,
        draft: null,
      }, { status: 403 });
    }

    const isCommercialAction = actionType === "rewrite_premium" || !!ppvAssetId;
    if (isCommercialAction && fanRiskFlags.includes("vulnerable_fan")) {
      return NextResponse.json({
        allowed: false,
        riskLevel: "high",
        reasons: ["Ce fan est détecté comme vulnérable. Actions commerciales bloquées."],
        requiredActions: ["escalate_to_supervisor"],
        suggestedSafeAlternative: "Utiliser un message non commercial de prise de nouvelles.",
        draft: null,
      }, { status: 403 });
    }

    if (isCommercialAction && fanRiskFlags.includes("do_not_contact")) {
      return NextResponse.json({
        allowed: false,
        riskLevel: "high",
        reasons: ["Ce fan a demandé à ne pas être contacté pour des offres."],
        requiredActions: [],
        suggestedSafeAlternative: null,
        draft: null,
      }, { status: 403 });
    }

    // 8. Check vault already sold
    if (vaultAsset && fanId) {
      const soldTo = (vaultAsset.sold_to_fan_ids as string[]) || [];
      if (soldTo.includes(fanId)) {
        return NextResponse.json({
          allowed: false,
          riskLevel: "medium",
          reasons: ["Cet asset a déjà été vendu à ce fan."],
          requiredActions: ["choose_different_asset"],
          suggestedSafeAlternative: "Choisir un autre asset du vault ou créer un bundle.",
          draft: null,
        }, { status: 409 });
      }
    }

    // 9. Compliance gate — module-level checks
    const gateResult: ComplianceCheckResult = canUseChatAIAction("generate_draft", {
      userId,
      fanId: fanId || undefined,
      playbookId: playbook?.id as string | undefined,
      platform: conv.platform,
      mode: config?.mode as string | undefined as Parameters<typeof canUseChatAIAction>[1]["mode"],
      disclosure: config?.disclosure as string | undefined as Parameters<typeof canUseChatAIAction>[1]["disclosure"],
      consentCompleted: consentComplete,
      isPaused: config?.is_paused as boolean | undefined,
    });

    if (!gateResult.allowed) {
      return NextResponse.json({ ...gateResult, draft: null }, { status: 403 });
    }

    // 10. Build prompt & call AI
    const disclosure = config?.disclosure as string || "private_copilot";
    const systemPrompt = buildDraftPrompt({
      playbook: playbook ? {
        name: playbook.name as string,
        globalTone: playbook.global_tone as string,
        forbiddenWords: playbook.forbidden_words as string[],
        allowedWords: playbook.allowed_words as string[],
        boldnessLevel: playbook.boldness_level as number,
        boundaries: playbook.boundaries as string[],
        forbiddenTopics: playbook.forbidden_topics as string[],
        ppvMinPrice: playbook.ppv_min_price as number,
        ppvMaxPrice: playbook.ppv_max_price as number,
      } : undefined,
      fan: fan ? {
        pseudonym: fan.pseudonym as string,
        status: fan.status as "new" | "active" | "vip" | "whale" | "dormant" | "churn_risk" | "do_not_contact" | undefined,
        language: fan.language as string,
        intentScore: fan.intent_score as number,
        churnRisk: fan.churn_risk as number,
        relationshipScore: fan.relationship_score as number,
        commercialScore: fan.commercial_score as number,
        avoidTopics: fan.avoid_topics as string[],
        riskFlags: fanRiskFlags,
      } : undefined,
      objective,
      tone: toneOverride,
      recentHistory: recentHistory || undefined,
      disclosure,
    });

    const model: DeepSeekModel = pickModel("draft");
    const demoMode = isDemoMode();
    let text: string;
    let explanation: string;
    let tokensUsed = 0;
    let latencyMs = 0;
    let complianceNotes: string[] = [];

    if (demoMode) {
      const demo = demoDraftResponse({ objective, tone: toneOverride, targetLanguage });
      text = demo.text;
      explanation = demo.explanation;
      complianceNotes = demo.complianceNotes;
    } else {
      const response = await callDeepSeek({
        model,
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.7,
        maxTokens: 1024,
        json: true,
      });

      tokensUsed = response.tokensUsed;
      latencyMs = response.latencyMs;

      if (response.parsed) {
        text = (response.parsed.text as string) || response.text;
        explanation = (response.parsed.explanation as string) || "";
        complianceNotes = (response.parsed.complianceNotes as string[]) || [];
      } else {
        text = response.text;
        explanation = "Réponse générée par IA.";
      }
    }

    // 11. Post-generation compliance scan
    const scanResult = scanMessageText(text);
    const riskLevel = scanResult.riskLevel === "high" ? "high" :
      (complianceNotes.length > 0 ? "medium" : "low");

    // 12. Save draft to Supabase
    const { data: draft, error: draftErr } = await supabase
      .from("chat_ai_drafts")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        text,
        objective,
        tone: toneOverride || "chaleureux et naturel",
        context_sources: JSON.stringify([
          fan ? { type: "fan_brain", reference: `${fan.pseudonym} — ${fan.status}`, snippet: `LTV: ${fan.ltv}€, Scores: intent=${fan.intent_score}, churn=${fan.churn_risk}` } : null,
          playbook ? { type: "playbook", reference: playbook.name, snippet: `Ton: ${playbook.global_tone}, audace: ${playbook.boldness_level}/5` } : null,
        ].filter(Boolean)),
        risk_level: riskLevel,
        compliance_status: scanResult.allowed ? "needs_review" : "blocked",
        requires_validation: true,
        model,
        explanation,
        status: scanResult.allowed ? "draft" : "blocked",
      })
      .select("id")
      .single();

    if (draftErr) {
      console.error("[Chat AI] Draft insert error:", draftErr);
      return NextResponse.json({ error: "Erreur sauvegarde brouillon" }, { status: 500 });
    }

    // 13. Audit log
    await logAction({
      userId,
      actorId: userId,
      actorType: "creator",
      action: scanResult.allowed ? "ai_draft_generated" : "ai_draft_blocked",
      targetType: "draft",
      targetId: draft.id,
      metadata: {
        model,
        objective,
        riskLevel,
        demoMode,
        tokensUsed,
        latencyMs,
        conversationId,
        fanId: fanId || null,
        complianceBlocked: !scanResult.allowed,
      },
    });

    // 14. Return
    return NextResponse.json({
      allowed: scanResult.allowed,
      draft: {
        id: draft.id,
        conversationId,
        userId,
        text,
        objective,
        tone: toneOverride || "chaleureux et naturel",
        contextSources: [
          fan ? { type: "fan_brain", reference: `${fan.pseudonym} — ${fan.status}`, snippet: `LTV: ${fan.ltv}€` } : null,
          playbook ? { type: "playbook", reference: playbook.name, snippet: `Ton: ${playbook.global_tone}` } : null,
        ].filter(Boolean),
        riskLevel,
        complianceStatus: scanResult.allowed ? "needs_review" : "blocked",
        requiresValidation: true,
        model,
        explanation,
        status: scanResult.allowed ? "draft" : "blocked",
        createdAt: new Date().toISOString(),
      },
      riskLevel,
      complianceNotes: [...complianceNotes, ...scanResult.reasons],
      explanation,
      model,
      tokensUsed,
      latencyMs: demoMode ? 0 : (Date.now() - startTime),
      demoMode,
    });
  } catch (error) {
    console.error("[Chat AI] Draft POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
