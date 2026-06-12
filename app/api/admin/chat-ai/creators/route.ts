import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 200);
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const offset = (page - 1) * limit;

    // Get all user configs with profile join
    const { data: configs, error, count } = await supabase
      .from("chat_ai_user_config")
      .select("user_id, mode, disclosure, is_paused, is_active, demo_mode, plan, created_at, updated_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[Admin Chat AI] Creators error:", error);
      return NextResponse.json({ error: "Erreur chargement créateurs" }, { status: 500 });
    }

    if (!configs?.length) {
      return NextResponse.json({ creators: [], total: 0, page, limit });
    }

    const userIds = configs.map((c) => c.user_id);

    // Fetch stats per creator in parallel
    const [
      { data: fansCounts },
      { data: draftsCounts },
      { data: qaPending },
      { data: consentData },
    ] = await Promise.all([
      supabase.from("chat_ai_fans").select("user_id").in("user_id", userIds),
      supabase.from("chat_ai_drafts").select("user_id, status").in("user_id", userIds),
      supabase.from("chat_ai_qa_items").select("user_id").in("user_id", userIds).eq("status", "pending"),
      supabase.from("chat_ai_consent_checklists").select("user_id, completed_at").in("user_id", userIds).not("completed_at", "is", null),
    ]);

    // Aggregate
    const fanCountMap = new Map<string, number>();
    fansCounts?.forEach((f) => fanCountMap.set(f.user_id, (fanCountMap.get(f.user_id) || 0) + 1));

    const draftCountMap = new Map<string, number>();
    draftsCounts?.forEach((d) => draftCountMap.set(d.user_id, (draftCountMap.get(d.user_id) || 0) + 1));

    const qaPendingMap = new Map<string, number>();
    qaPending?.forEach((q) => qaPendingMap.set(q.user_id, (qaPendingMap.get(q.user_id) || 0) + 1));

    const consentSet = new Set(consentData?.map((c) => c.user_id) || []);

    const creators = configs.map((c) => ({
      userId: c.user_id,
      mode: c.mode,
      disclosure: c.disclosure,
      isPaused: c.is_paused,
      isActive: c.is_active,
      demoMode: c.demo_mode,
      plan: c.plan,
      fansCount: fanCountMap.get(c.user_id) || 0,
      draftsCount: draftCountMap.get(c.user_id) || 0,
      pendingQa: qaPendingMap.get(c.user_id) || 0,
      consentComplete: consentSet.has(c.user_id),
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    return NextResponse.json({ creators, total: count || 0, page, limit });
  } catch (error) {
    console.error("[Admin Chat AI] Creators error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
