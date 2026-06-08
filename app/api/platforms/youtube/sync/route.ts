import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { creatorId, channelId, accessToken } = await request.json();

    if (!creatorId || !channelId) {
      return NextResponse.json({ error: "creatorId et channelId requis" }, { status: 400 });
    }

    const apiKey = accessToken || process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Clé API YouTube non configurée" }, { status: 500 });
    }

    // 1. Récupérer les stats de la chaîne
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id=${channelId}&key=${apiKey}`
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Erreur API YouTube", details: err },
        { status: res.status }
      );
    }

    const data = await res.json();
    const channel = data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "Chaîne YouTube introuvable" }, { status: 404 });
    }

    // 2. Récupérer les dernières vidéos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&key=${apiKey}`
    );
    const videosData = await videosRes.json().catch(() => ({ items: [] }));
    const videoIds = videosData.items?.map((v: any) => v.id.videoId).filter(Boolean).join(",") || "";

    // 3. Récupérer les stats des vidéos récentes
    let recentVideos: any[] = [];
    if (videoIds) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();
      recentVideos = (statsData.items || []).map((v: any) => ({
        id: v.id,
        views: parseInt(v.statistics?.viewCount || "0"),
        likes: parseInt(v.statistics?.likeCount || "0"),
        comments: parseInt(v.statistics?.commentCount || "0"),
      }));
    }

    // 4. Sauvegarder en base
    const supabase = createAdminClient();
    const { error: upsertError } = await supabase.from("creator_accounts").upsert(
      {
        creator_id: creatorId,
        platform: "youtube",
        username: channel.snippet.customUrl || channel.snippet.title,
        followers: parseInt(channel.statistics.subscriberCount) || 0,
        platform_data: {
          title: channel.snippet.title,
          thumbnail: channel.snippet.thumbnails?.default?.url,
          total_views: parseInt(channel.statistics.viewCount || "0"),
          video_count: parseInt(channel.statistics.videoCount || "0"),
          recent_videos: recentVideos,
          last_sync: new Date().toISOString(),
        },
      },
      { onConflict: "creator_id, platform" }
    );

    if (upsertError) {
      console.error("Erreur sauvegarde YouTube:", upsertError);
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        channel: channel.snippet.title,
        subscribers: parseInt(channel.statistics.subscriberCount) || 0,
        total_views: parseInt(channel.statistics.viewCount || "0"),
        video_count: parseInt(channel.statistics.videoCount || "0"),
      },
    });
  } catch (error: any) {
    console.error("Erreur sync YouTube:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
