import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════
// GET: List all conversations grouped by fan
// Returns the latest message per fan + unread status
// ═══════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const channel = searchParams.get("channel");
    const tier = searchParams.get("tier");
    const search = searchParams.get("search");
    const unreadOnly = searchParams.get("unread") === "true";

    // Fetch all fans that have interactions
    let fansQuery = supabase
      .from("atlas_fans")
      .select("id, display_name, email, fan_tier, fan_score, avatar_url, country, language, last_interaction_at, total_spent, total_interactions, tags, email_consent, sms_consent, username_onlyfans, username_instagram, username_tiktok")
      .eq("creator_id", user.id)
      .eq("status", "active")
      .not("total_interactions", "eq", 0);

    if (tier) fansQuery = fansQuery.eq("fan_tier", tier);
    if (search) {
      fansQuery = fansQuery.or(
        `display_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: fans } = await fansQuery
      .order("last_interaction_at", { ascending: false })
      .limit(50);

    if (!fans || fans.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // Get fan read statuses
    const { data: readStatuses } = await supabase
      .from("atlas_conversation_read")
      .select("fan_id, last_read_at, is_pinned")
      .eq("creator_id", user.id);

    const readMap = new Map((readStatuses ?? []).map((r: any) => [r.fan_id, r]));

    // Get last message interaction per fan
    const fanIds = fans.map((f) => f.id);

    const { data: lastMessages } = await supabase
      .from("atlas_interactions")
      .select("*")
      .in("fan_id", fanIds)
      .eq("creator_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(100);

    // Group by fan and get the latest message per fan
    const latestPerFan = new Map<string, any>();
    const unreadCounts = new Map<string, number>();
    const allDirections = new Map<string, string[]>();

    for (const msg of lastMessages ?? []) {
      const fid = msg.fan_id;

      // Track all directions to know if last message was from fan
      if (!allDirections.has(fid)) allDirections.set(fid, []);
      allDirections.get(fid)!.push(msg.direction);

      // Check unread
      const read = readMap.get(fid);
      const isUnread = msg.direction === "inbound" &&
        (!read || new Date(msg.occurred_at) > new Date(read.last_read_at));

      if (isUnread) {
        unreadCounts.set(fid, (unreadCounts.get(fid) || 0) + 1);
      }

      // Track latest message per fan
      if (!latestPerFan.has(fid)) {
        latestPerFan.set(fid, msg);
      }
    }

    // Count pending drafts per fan
    const { data: draftCounts } = await supabase
      .from("atlas_drafts")
      .select("fan_id")
      .in("fan_id", fanIds)
      .eq("creator_id", user.id)
      .in("status", ["pending", "pending_validation"]);

    const draftCountMap = new Map<string, number>();
    for (const d of draftCounts ?? []) {
      draftCountMap.set(d.fan_id, (draftCountMap.get(d.fan_id) || 0) + 1);
    }

    // Build conversation list
    let conversations = fans.map((fan) => {
      const lastMsg = latestPerFan.get(fan.id);
      const read = readMap.get(fan.id);
      const directions = allDirections.get(fan.id) || [];
      const lastInboundIndex = directions.lastIndexOf("inbound");
      const hasInboundAfterOutbound = lastInboundIndex > directions.lastIndexOf("outbound");

      return {
        fan: {
          id: fan.id,
          display_name: fan.display_name || fan.email || "Anonyme",
          email: fan.email,
          fan_tier: fan.fan_tier,
          fan_score: fan.fan_score,
          avatar_url: fan.avatar_url,
          country: fan.country,
          language: fan.language,
          total_spent: fan.total_spent,
          total_interactions: fan.total_interactions,
          tags: fan.tags,
          channels: {
            email: fan.email_consent,
            sms: fan.sms_consent,
            onlyfans: !!fan.username_onlyfans,
            instagram: !!fan.username_instagram,
            tiktok: !!fan.username_tiktok,
          },
        },
        last_message: lastMsg ? {
          content: lastMsg.content?.substring(0, 150) || "",
          channel: lastMsg.channel,
          direction: lastMsg.direction,
          occurred_at: lastMsg.occurred_at,
        } : null,
        unread_count: unreadCounts.get(fan.id) || 0,
        has_pending_draft: (draftCountMap.get(fan.id) || 0) > 0,
        is_pinned: read?.is_pinned || false,
        is_unread: hasInboundAfterOutbound,
      };
    });

    // Filter unread only
    if (unreadOnly) {
      conversations = conversations.filter((c: any) => c.unread_count > 0 || c.is_unread);
    }

    // Filter by channel
    if (channel) {
      conversations = conversations.filter((c: any) => (c.fan.channels as any)[channel]);
    }

    // Sort: pinned first, then by last message recency
    conversations.sort((a: any, b: any) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      if (a.last_message && b.last_message) {
        return new Date(b.last_message.occurred_at).getTime() -
               new Date(a.last_message.occurred_at).getTime();
      }
      return 0;
    });

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("[ATLAS INBOX] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
