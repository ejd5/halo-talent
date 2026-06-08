import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { creatorId, accessToken } = await request.json();

    if (!creatorId || !accessToken) {
      return NextResponse.json({ error: "creatorId et accessToken requis" }, { status: 400 });
    }

    // 1. Récupérer l'ID utilisateur Instagram Business/Creator
    const userRes = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
    );

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Token Instagram invalide ou expiré", details: err },
        { status: 401 }
      );
    }

    const user = await userRes.json();

    // 2. Récupérer le compte Instagram associé
    const accountsRes = await fetch(
      `https://graph.facebook.com/v18.0/${user.id}/accounts?fields=instagram_business_account,access_token&access_token=${accessToken}`
    );
    const accounts = await accountsRes.json();
    const igAccount = accounts.data?.[0]?.instagram_business_account;

    if (!igAccount) {
      return NextResponse.json(
        { error: "Aucun compte Instagram Business/Creator trouvé" },
        { status: 404 }
      );
    }

    // 3. Récupérer les stats du profil Instagram
    const igRes = await fetch(
      `https://graph.facebook.com/v18.0/${igAccount.id}?fields=followers_count,media_count,profile_picture_url,username&access_token=${accessToken}`
    );
    const profile = await igRes.json();

    // 4. Récupérer les insights (derniers 28 jours)
    const insightsRes = await fetch(
      `https://graph.facebook.com/v18.0/${igAccount.id}/insights?metric=impressions,reach,profile_views,email_contacts,get_directions_clicks,website_clicks&period=day&since=${Date.now() - 28 * 86400000}&until=${Date.now()}&access_token=${accessToken}`
    );
    const insights = await insightsRes.json().catch(() => ({ data: [] }));

    // 5. Sauvegarder en base
    const supabase = createAdminClient();
    const { error: upsertError } = await supabase.from("creator_accounts").upsert(
      {
        creator_id: creatorId,
        platform: "instagram",
        username: profile.username,
        followers: parseInt(profile.followers_count) || 0,
        platform_data: {
          media_count: profile.media_count,
          profile_picture_url: profile.profile_picture_url,
          insights: insights.data,
          last_sync: new Date().toISOString(),
        },
      },
      { onConflict: "creator_id, platform" }
    );

    if (upsertError) {
      console.error("Erreur sauvegarde Instagram:", upsertError);
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        username: profile.username,
        followers: parseInt(profile.followers_count) || 0,
        media_count: profile.media_count,
      },
    });
  } catch (error: any) {
    console.error("Erreur sync Instagram:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
