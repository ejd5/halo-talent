import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ComplianceDrafter } from "@/lib/atlas/ai/drafter";
import type { Platform, DraftIntent, FanInfo } from "@/lib/atlas/ai/drafter";

/* ─── POST: Generate drafts ────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { platform, context, intent, fan } = body;

    // Validate
    const validPlatforms: Platform[] = ["onlyfans", "instagram", "tiktok", "mym", "email", "sms"];
    if (!platform || !validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Plateforme invalide" }, { status: 400 });
    }
    if (!fan?.id) {
      return NextResponse.json({ error: "Fan requis (id)" }, { status: 400 });
    }

    const drafter = new ComplianceDrafter(user.id);

    // Enrich fan info from DB if partial
    const fanInfo: FanInfo = { ...fan };
    if (!fanInfo.display_name || !fanInfo.fan_tier) {
      const { data: fullFan } = await supabase
        .from("atlas_fans")
        .select("display_name, first_name, fan_tier, total_spent, language, tags")
        .eq("id", fan.id)
        .single();
      if (fullFan) {
        fanInfo.display_name ||= fullFan.display_name || "";
        fanInfo.first_name ||= fullFan.first_name || "";
        fanInfo.fan_tier ||= fullFan.fan_tier || "";
        fanInfo.total_spent ||= fullFan.total_spent || 0;
        fanInfo.language ||= fullFan.language || "fr";
        fanInfo.tags ||= fullFan.tags || [];
      }
    }

    const result = await drafter.draft({
      platform: platform as Platform,
      context: context || {},
      intent: (intent as DraftIntent) || "engagement",
      fan: fanInfo,
    });

    if (!result.success) {
      const status = result.reason === "moderation_blocked" ? 422 : 500;
      return NextResponse.json({ error: result.details, reason: result.reason }, { status });
    }

    return NextResponse.json({ drafts: result.drafts });
  } catch (err) {
    console.error("[DRAFT API] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ─── GET: List drafts ──────────────────────────────────── */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const status = request.nextUrl.searchParams.get("status") || "pending";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
    const platform = request.nextUrl.searchParams.get("platform");

    let query = supabase
      .from("atlas_drafts")
      .select("*, atlas_fans!inner(display_name, avatar_url, fan_tier)")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 200));

    if (status !== "all") query = query.eq("status", status);
    if (platform) query = query.eq("platform", platform);

    const { data: drafts, error } = await query;

    if (error) return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });

    return NextResponse.json({ drafts: drafts ?? [] });
  } catch (err) {
    console.error("[DRAFT LIST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
