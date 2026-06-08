import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { creatorId, accessToken, openId } = await request.json();

    if (!creatorId || !accessToken) {
      return NextResponse.json({ error: "creatorId et accessToken requis" }, { status: 400 });
    }

    // 1. Récupérer le profil TikTok via Display API
    const profileRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=display_name,username,follower_count,following_count,likes_count,video_count,is_verified",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!profileRes.ok) {
      const err = await profileRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Token TikTok invalide ou expiré", details: err },
        { status: 401 }
      );
    }

    const profileData = await profileRes.json();
    const user = profileData.data?.user;

    if (!user) {
      return NextResponse.json({ error: "Profil TikTok introuvable" }, { status: 404 });
    }

    // 2. Récupérer les vidéos récentes (max 10)
    const videosRes = await fetch(
      "https://open.tiktokapis.com/v2/video/list/?fields=id,title,create_time,view_count,like_count,comment_count,share_count",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 10 }),
      }
    );

    let recentVideos: any[] = [];
    if (videosRes.ok) {
      const videosData = await videosRes.json();
      recentVideos = (videosData.data?.videos || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        created_at: v.create_time,
        views: v.view_count,
        likes: v.like_count,
        comments: v.comment_count,
        shares: v.share_count,
      }));
    }

    // 3. Sauvegarder en base
    const supabase = createAdminClient();
    const { error: upsertError } = await supabase.from("creator_accounts").upsert(
      {
        creator_id: creatorId,
        platform: "tiktok",
        username: user.username,
        followers: parseInt(user.follower_count) || 0,
        platform_data: {
          display_name: user.display_name,
          following_count: parseInt(user.following_count || "0"),
          likes_count: parseInt(user.likes_count || "0"),
          video_count: parseInt(user.video_count || "0"),
          is_verified: user.is_verified,
          recent_videos: recentVideos,
          last_sync: new Date().toISOString(),
        },
      },
      { onConflict: "creator_id, platform" }
    );

    if (upsertError) {
      console.error("Erreur sauvegarde TikTok:", upsertError);
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        username: user.username,
        followers: parseInt(user.follower_count) || 0,
        following: parseInt(user.following_count || "0"),
        videos: parseInt(user.video_count || "0"),
        likes: parseInt(user.likes_count || "0"),
      },
    });
  } catch (error: any) {
    console.error("Erreur sync TikTok:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
