import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callDeepSeek, isDemoMode } from "@/lib/ai/deepseek";
import { pickModel } from "@/lib/ai/router";
import { buildPPVStrategyPrompt } from "@/lib/ai/prompts";
import { demoPPVResponse } from "@/lib/ai/demo-responses";
import { canUseChatAIAction, scanMessageText } from "@/lib/compliance/chat-ai-gate";
import { logAction } from "@/lib/compliance/audit";
import type { ComplianceCheckResult, DeepSeekModel } from "@/lib/types/chat-ai";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10) || 30, 100);
  const status = searchParams.get("status") || undefined;

  try {
    let query = supabase
      .from("chat_ai_ppv_recommendations")
      .select(`
        id, user_id, vault_asset_id, target_fan_ids, segment_id,
        recommended_price, min_price, max_price,
        justification, fatigue_risk, already_sold_to,
        conversion_estimate, status, created_at,
        chat_ai_vault_assets!inner(id, title, type, sensitivity)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: recs, error } = await query;

    if (error) {
      console.error("[Chat AI] PPV GET error:", error);
      return NextResponse.json({ error: "Erreur chargement historique" }, { status: 500 });
    }

    type RecRow = {
      id: string;
      user_id: string;
      vault_asset_id: string;
      target_fan_ids: string[];
      segment_id: string | null;
      recommended_price: number;
      min_price: number;
      max_price: number;
      justification: string;
      fatigue_risk: string;
      already_sold_to: string[];
      conversion_estimate: string;
      status: string;
      created_at: string;
      chat_ai_vault_assets: { id: string; title: string; type: string; sensitivity: string }[] | null;
    };

    const recommendations = (recs as RecRow[] | null)?.map((r) => ({
      id: r.id,
      vaultAssetId: r.vault_asset_id,
      vaultAssetTitle: r.chat_ai_vault_assets?.[0]?.title || null,
      vaultAssetType: r.chat_ai_vault_assets?.[0]?.type || null,
      targetFanIds: r.target_fan_ids || [],
      segmentId: r.segment_id,
      recommendedPrice: r.recommended_price,
      minPrice: r.min_price,
      maxPrice: r.max_price,
      justification: r.justification,
      fatigueRisk: r.fatigue_risk,
      alreadySoldTo: r.already_sold_to || [],
      conversionEstimate: r.conversion_estimate,
      status: r.status,
      createdAt: r.created_at,
      model: null,
      demoMode: false,
    })) || [];

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("[Chat AI] PPV GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;

  try {
    const body = await request.json();
    const { vaultAssetId, targetFanIds, segmentId } = body;

    if (!vaultAssetId) {
      return NextResponse.json({ error: "vaultAssetId requis" }, { status: 400 });
    }

    // 1. Load vault asset
    const { data: asset, error: assetErr } = await supabase
      .from("chat_ai_vault_assets")
      .select("*")
      .eq("id", vaultAssetId)
      .single();

    if (assetErr || !asset) {
      return NextResponse.json({ error: "Asset introuvable" }, { status: 404 });
    }

    // 2. Load user config + consent
    const { data: config } = await supabase
      .from("chat_ai_user_config")
      .select("*, chat_ai_playbooks!chat_ai_user_config_active_playbook_id_fkey(*)")
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

    // 3. Compliance gate
    const gateResult: ComplianceCheckResult = canUseChatAIAction("create_ppv", {
      userId,
      playbookId: config?.active_playbook_id as string | undefined,
      mode: config?.mode as Parameters<typeof canUseChatAIAction>[1]["mode"],
      disclosure: config?.disclosure as Parameters<typeof canUseChatAIAction>[1]["disclosure"],
      consentCompleted: consentComplete,
      isPaused: config?.is_paused as boolean | undefined,
    });

    if (!gateResult.allowed) {
      return NextResponse.json(gateResult, { status: 403 });
    }

    // 4. Check already sold for each target fan
    const soldToFans = (asset.sold_to_fan_ids as string[]) || [];
    const alreadySoldTo = (targetFanIds || []).filter((id: string) => soldToFans.includes(id));

    // 5. Load target fans for personalization
    let fanData: Record<string, unknown> | null = null;
    if (targetFanIds?.length === 1) {
      const { data: fan } = await supabase
        .from("chat_ai_fans")
        .select("*")
        .eq("id", targetFanIds[0])
        .single();
      fanData = fan;

      // Block if vulnerable or do_not_contact
      if (fanData) {
        const flags = (fanData.risk_flags as string[]) || [];
        if (flags.includes("vulnerable_fan") || flags.includes("do_not_contact") ||
            fanData.status === "do_not_contact") {
          return NextResponse.json({
            allowed: false,
            riskLevel: "high",
            reasons: ["Action commerciale bloquée : fan vulnérable ou 'ne pas contacter'."],
            requiredActions: [],
            suggestedSafeAlternative: null,
          }, { status: 403 });
        }
      }
    }

    // 6. Build prompt & call AI
    const playbook = config?.chat_ai_playbooks as Record<string, unknown> | null;
    const priceHistory = (asset.price_history as Array<{ date: string; price: number }>) || [];
    const priceHistoryStr = priceHistory
      .map((p: { date: string; price: number }) => `${p.date}: ${p.price}€`)
      .join(", ");

    const systemPrompt = buildPPVStrategyPrompt({
      playbook: playbook ? {
        name: playbook.name as string,
        ppvMinPrice: playbook.ppv_min_price as number,
        ppvMaxPrice: playbook.ppv_max_price as number,
        boldnessLevel: playbook.boldness_level as number,
      } : undefined,
      fan: fanData ? {
        pseudonym: fanData.pseudonym as string,
        status: fanData.status as "new" | "active" | "vip" | "whale" | "dormant" | "churn_risk" | "do_not_contact" | undefined,
        language: fanData.language as string,
        intentScore: fanData.intent_score as number,
        churnRisk: fanData.churn_risk as number,
        commercialScore: fanData.commercial_score as number,
        riskFlags: fanData.risk_flags as string[],
      } : undefined,
      assetTitle: asset.title as string,
      assetType: asset.type as string,
      priceHistory: priceHistoryStr || undefined,
      alreadySold: alreadySoldTo.length > 0,
    });

    const model: DeepSeekModel = pickModel("ppv_strategy");
    const demoMode = isDemoMode();
    let recommendation: Record<string, unknown>;

    if (demoMode) {
      const demo = demoPPVResponse();
      recommendation = demo.recommendations[0] as unknown as Record<string, unknown>;
    } else {
      const response = await callDeepSeek({
        model,
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.3,
        maxTokens: 2048,
        json: true,
      });

      recommendation = (response.parsed || {}) as Record<string, unknown>;
    }

    // 7. Scan compliance
    const approachText = recommendation.approach as string || "";
    const textScan = scanMessageText(approachText);

    // 8. Save to Supabase
    const { data: saved, error: saveErr } = await supabase
      .from("chat_ai_ppv_recommendations")
      .insert({
        user_id: userId,
        vault_asset_id: vaultAssetId,
        target_fan_ids: targetFanIds || [],
        segment_id: segmentId || null,
        recommended_price: recommendation.recommendedPrice || 0,
        min_price: recommendation.minPrice || 0,
        max_price: recommendation.maxPrice || 0,
        justification: recommendation.justification || "",
        fatigue_risk: recommendation.fatigueRisk || "low",
        already_sold_to: alreadySoldTo,
        conversion_estimate: recommendation.conversionEstimate || "Estimation indicative non garantie",
        status: textScan.allowed ? "draft" : "draft",
      })
      .select("id")
      .single();

    if (saveErr) {
      console.error("[Chat AI] PPV save error:", saveErr);
      return NextResponse.json({ error: "Erreur sauvegarde recommandation" }, { status: 500 });
    }

    // 9. Audit log
    await logAction({
      userId,
      actorId: userId,
      actorType: "creator",
      action: "ppv_recommendation_created",
      targetType: "ppv",
      targetId: saved.id,
      metadata: {
        vaultAssetId,
        recommendedPrice: recommendation.recommendedPrice,
        targetFanCount: (targetFanIds || []).length,
        alreadySoldCount: alreadySoldTo.length,
        model,
        demoMode,
      },
    });

    return NextResponse.json({
      recommendation: {
        id: saved.id,
        userId,
        vaultAssetId,
        targetFanIds: targetFanIds || [],
        segmentId: segmentId || null,
        recommendedPrice: recommendation.recommendedPrice,
        minPrice: recommendation.minPrice,
        maxPrice: recommendation.maxPrice,
        justification: recommendation.justification,
        fatigueRisk: recommendation.fatigueRisk,
        alreadySoldTo,
        conversionEstimate: recommendation.conversionEstimate || "Estimation indicative non garantie",
        status: "draft",
        createdAt: new Date().toISOString(),
      },
      compliance: {
        allowed: textScan.allowed,
        reasons: textScan.reasons,
      },
      model,
      demoMode,
    });
  } catch (error) {
    console.error("[Chat AI] PPV POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
