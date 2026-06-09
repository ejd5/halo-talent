import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Aggregate stats for the week
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7) + "-01";

  // Total creators
  const { count: totalCreators } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "creator")
    .eq("status", "active");

  // Current month revenue
  const { data: currentRevs } = await supabase
    .from("monthly_revenues")
    .select("gross_revenue")
    .eq("month", currentMonth);
  const totalRevenue = (currentRevs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);

  // Previous month revenue
  const { data: prevRevs } = await supabase
    .from("monthly_revenues")
    .select("gross_revenue")
    .eq("month", prevMonth);
  const prevRevenue = (prevRevs || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);

  // Department aggregates
  const { data: creators } = await supabase
    .from("profiles")
    .select("id, department")
    .eq("role", "creator")
    .eq("status", "active");

  const deptRevenues: Record<string, number> = {};
  for (const c of creators || []) {
    const dept = c.department || "Non assigné";
    const { data: d } = await supabase
      .from("monthly_revenues")
      .select("gross_revenue")
      .eq("creator_id", c.id)
      .eq("month", currentMonth);
    const rev = (d || []).reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
    deptRevenues[dept] = (deptRevenues[dept] || 0) + rev;
  }

  // Top performer
  const topCreator = creators
    ? [...creators].sort((a, b) => {
        const revA =
          deptRevenues[a.department || ""] || 0;
        return 0;
      })[0]
    : null;

  // Drafts count
  const { count: pendingDrafts } = await supabase
    .from("atlas_drafts")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const stats = {
    week: new Date().toISOString().slice(0, 10),
    total_creators: totalCreators || 0,
    total_revenue: totalRevenue,
    revenue_change_vs_prev: prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0,
    departments: Object.entries(deptRevenues).map(([name, rev]) => ({ name, revenue: rev })),
    pending_drafts: pendingDrafts || 0,
  };

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Tu es analyste pour une agence de management créatif.

DONNÉES DE LA SEMAINE :
${JSON.stringify(stats, null, 2)}

Identifie :
1. Les patterns qui distinguent top performers de bottom performers
2. Les changements significatifs vs semaine précédente
3. Les opportunités d'amélioration concrètes
4. Les risques émergents

Format : 4 sections numérotées, chacune avec 2-3 bullet points actionnables.
Ton : direct, factuel, sans flatterie. Pour direction d'agence.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  await supabase.from("admin_insights").insert({
    type: "weekly_benchmarking",
    content: text,
    period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
    period_end: new Date().toISOString(),
    meta: stats,
  });

  return NextResponse.json({ ok: true });
}
