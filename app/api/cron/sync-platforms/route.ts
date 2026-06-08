import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes max

export async function GET(request: NextRequest) {
  // Protection : vérifier le cron secret
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  const results: { platform: string; creatorId: string; status: string; error?: string }[] = [];

  // Récupérer tous les comptes connectés
  const { data: accounts } = await supabase
    .from("creator_accounts")
    .select("id, creator_id, platform, username, platform_data");

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ message: "Aucun compte à synchroniser", results });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  for (const account of accounts) {
    try {
      switch (account.platform) {
        case "youtube": {
          if (!apiKey) {
            results.push({ platform: "youtube", creatorId: account.creator_id, status: "skipped", error: "YOUTUBE_API_KEY non configurée" });
            continue;
          }
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${account.username}&key=${apiKey}`
          );
          if (!res.ok) throw new Error(`YouTube API: ${res.status}`);
          const data = await res.json();
          const channel = data.items?.[0];
          if (channel) {
            await supabase.from("creator_accounts").update({
              followers: parseInt(channel.statistics.subscriberCount) || 0,
              platform_data: {
                ...(account.platform_data as Record<string, unknown>),
                total_views: channel.statistics.viewCount,
                video_count: channel.statistics.videoCount,
                last_sync: new Date().toISOString(),
              },
            }).eq("id", account.id);
          }
          results.push({ platform: "youtube", creatorId: account.creator_id, status: "ok" });
          break;
        }

        case "tiktok": {
          const token = (account.platform_data as any)?.access_token;
          if (!token) {
            results.push({ platform: "tiktok", creatorId: account.creator_id, status: "skipped", error: "Token manquant" });
            continue;
          }
          const profileRes = await fetch(
            "https://open.tiktokapis.com/v2/user/info/?fields=follower_count",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!profileRes.ok) {
            if (profileRes.status === 401) {
              // Token expiré, tenter refresh via la route dédiée
              results.push({ platform: "tiktok", creatorId: account.creator_id, status: "error", error: "Token expiré" });
            }
            continue;
          }
          const profileData = await profileRes.json();
          const followers = parseInt(profileData.data?.user?.follower_count || "0");
          await supabase.from("creator_accounts").update({
            followers,
            platform_data: {
              ...(account.platform_data as Record<string, unknown>),
              last_sync: new Date().toISOString(),
            },
          }).eq("id", account.id);
          results.push({ platform: "tiktok", creatorId: account.creator_id, status: "ok" });
          break;
        }

        case "instagram": {
          const token = (account.platform_data as any)?.access_token;
          if (!token) {
            results.push({ platform: "instagram", creatorId: account.creator_id, status: "skipped", error: "Token manquant" });
            continue;
          }
          const igRes = await fetch(
            `https://graph.facebook.com/v18.0/me?fields=followers_count&access_token=${token}`
          );
          if (!igRes.ok) {
            results.push({ platform: "instagram", creatorId: account.creator_id, status: "error", error: "Token expiré" });
            await supabase.from("creator_accounts").update({
              platform_data: {
                ...(account.platform_data as Record<string, unknown>),
                last_sync: new Date().toISOString(),
                sync_error: "Token expiré - reconnectez votre compte",
              },
            }).eq("id", account.id);
            continue;
          }
          const igData = await igRes.json();
          await supabase.from("creator_accounts").update({
            followers: parseInt(igData.followers_count || "0"),
            platform_data: {
              ...(account.platform_data as Record<string, unknown>),
              last_sync: new Date().toISOString(),
              sync_error: null,
            },
          }).eq("id", account.id);
          results.push({ platform: "instagram", creatorId: account.creator_id, status: "ok" });
          break;
        }

        // OnlyFans / MYM / Fansly : pas de sync automatique
        case "onlyfans":
        case "mym":
        case "fansly":
        case "reveal":
          results.push({ platform: account.platform, creatorId: account.creator_id, status: "manual" });
          break;

        default:
          results.push({ platform: account.platform, creatorId: account.creator_id, status: "unknown" });
      }

      // Petite pause entre les appels pour éviter les rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch (error: any) {
      console.error(`Erreur sync ${account.platform} pour ${account.creator_id}:`, error);
      results.push({ platform: account.platform, creatorId: account.creator_id, status: "error", error: error.message });
    }
  }

  // Notifier les admins en cas d'erreurs
  const errors = results.filter((r) => r.status === "error");
  if (errors.length > 0) {
    console.warn("Erreurs de synchronisation:", errors);
  }

  return NextResponse.json({
    success: true,
    total: accounts.length,
    synced: results.filter((r) => r.status === "ok").length,
    errors: errors.length,
    results,
  });
}
