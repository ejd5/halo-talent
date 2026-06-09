import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PlatformConnection, PlatformType } from "@/lib/studio/types";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("creator_id", user.id)
      .order("platform", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
    }

    // Strip sensitive fields before sending to client
    const safe = (data || []).map((conn: PlatformConnection) => ({
      id: conn.id,
      platform: conn.platform as PlatformType,
      platform_user_id: conn.platform_user_id,
      platform_username: conn.platform_username,
      platform_followers: conn.platform_followers,
      status: conn.status,
      last_sync_at: conn.last_sync_at,
      connected_at: conn.connected_at,
      metadata: conn.metadata,
    }));

    return NextResponse.json({ connections: safe });
  } catch (err) {
    console.error("[OAUTH CONNECTIONS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
