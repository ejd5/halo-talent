import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as any)?.role !== "admin") return null;
  return supabase;
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await checkAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Total generations
    const { count: totalGen } = await adminClient
      .from("credit_usage")
      .select("*", { count: "exact", head: true });

    // Total credits used
    const { data: creditSum } = await adminClient
      .from("credit_usage")
      .select("credits_used")
      .eq("status", "success");
    const totalCredits = (creditSum as any[])?.reduce((s, r) => s + (r.credits_used || 0), 0) ?? 0;

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const { data: activeUsers } = await adminClient
      .from("credit_usage")
      .select("creator_id")
      .eq("status", "success")
      .gte("created_at", firstOfMonth.toISOString());
    const uniqueUsers = new Set((activeUsers as any[])?.map((r) => r.creator_id) ?? []).size;

    // Top users
    const { data: topRaw } = await adminClient
      .from("credit_usage")
      .select("creator_id, credits_used, profiles!inner(email, subscription_tier)")
      .eq("status", "success")
      .order("created_at", { ascending: false })
      .limit(1000);

    const userMap = new Map<string, { email: string; plan: string; total: number }>();
    for (const row of (topRaw as any[]) ?? []) {
      const id = row.creator_id;
      const existing = userMap.get(id) ?? { email: row.profiles?.email ?? id, plan: row.profiles?.subscription_tier ?? "unknown", total: 0 };
      existing.total += row.credits_used || 0;
      userMap.set(id, existing);
    }

    const topUsers = Array.from(userMap.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 20)
      .map(([id, u]) => ({ id, email: u.email, total: u.total, plan: u.plan }));

    // Recent errors
    const { data: errors } = await adminClient
      .from("credit_usage")
      .select("creator_id, action, error, created_at, profiles!inner(email)")
      .eq("status", "failed")
      .order("created_at", { ascending: false })
      .limit(20);

    const recentErrors = ((errors as any[]) ?? []).map((r) => ({
      id: r.creator_id,
      email: r.profiles?.email ?? r.creator_id,
      action: r.action,
      error: r.error,
      created_at: r.created_at,
    }));

    return NextResponse.json({
      total_generations: totalGen ?? 0,
      total_credits_used: totalCredits,
      total_cost_estimate: totalCredits * 0.003,
      active_users: uniqueUsers,
      top_users: topUsers,
      daily_stats: [],
      recent_errors: recentErrors,
    });
  } catch (err) {
    console.error("[ADMIN CREDITS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await checkAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, amount, reason, suspended } = body;

    if (suspended !== undefined) {
      await createAdminClient()
        .from("profiles")
        .update({ generation_suspended: suspended })
        .eq("id", user_id);
      return NextResponse.json({ success: true, suspended });
    }

    if (!user_id || amount === undefined) {
      return NextResponse.json({ error: "user_id et amount requis" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("credits_ia")
      .eq("id", user_id)
      .single();

    const current = (profile as any)?.credits_ia ?? 0;
    const newCredits = Math.max(0, current + amount);

    await adminClient.from("profiles").update({ credits_ia: newCredits }).eq("id", user_id);

    await adminClient.from("credit_usage").insert({
      creator_id: user_id,
      action: reason || "admin_adjustment",
      credits_used: amount > 0 ? amount : 0,
      status: "success",
      metadata: { previous: current, new: newCredits, reason },
    });

    return NextResponse.json({ success: true, previous: current, new: newCredits });
  } catch (err) {
    console.error("[ADMIN CREDITS POST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
