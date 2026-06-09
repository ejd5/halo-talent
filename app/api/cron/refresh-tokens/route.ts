import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { refreshPlatformToken } from "@/lib/studio/oauth";
import { decrypt, encrypt } from "@/lib/crypto";
import type { PlatformConnection } from "@/lib/studio/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  // Simple auth check (cron secret)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Find tokens expiring in the next 24 hours
  const expiryThreshold = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data: connections } = await supabase
    .from("platform_connections")
    .select("*")
    .lt("expires_at", expiryThreshold)
    .eq("status", "active")
    .not("refresh_token", "is", null);

  if (!connections || connections.length === 0) {
    return NextResponse.json({ refreshed: 0, message: "Aucun token à rafraîchir" });
  }

  const results: { platform: string; success: boolean; error?: string }[] = [];

  for (const conn of connections as PlatformConnection[]) {
    try {
      if (!conn.refresh_token) continue;

      const decryptedRefresh = decrypt(conn.refresh_token);
      const newTokens = await refreshPlatformToken(conn.platform, decryptedRefresh);

      const updateData: Record<string, unknown> = {
        access_token: encrypt(newTokens.access_token),
        last_sync_at: new Date().toISOString(),
      };

      if (newTokens.refresh_token) {
        updateData.refresh_token = encrypt(newTokens.refresh_token);
      }
      if (newTokens.expires_at) {
        updateData.expires_at = newTokens.expires_at;
      }

      await supabase.from("platform_connections").update(updateData).eq("id", conn.id);

      results.push({ platform: conn.platform, success: true });
    } catch (err) {
      console.error(`[REFRESH TOKEN] Failed for ${conn.platform}:`, err);

      // Mark as expired so the creator knows to reconnect
      await supabase
        .from("platform_connections")
        .update({ status: "expired" })
        .eq("id", conn.id);

      results.push({
        platform: conn.platform,
        success: false,
        error: err instanceof Error ? err.message : "Erreur inconnue",
      });
    }
  }

  return NextResponse.json({ refreshed: results.filter((r) => r.success).length, failed: results.filter((r) => !r.success).length, results });
}
