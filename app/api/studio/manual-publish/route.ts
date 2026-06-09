import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ManualPublicationPreparer } from "@/lib/platforms/manual";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { platform, caption, media_urls, scheduled_for, ppv_price, ppv_message } = body;

    if (!platform || !caption || !scheduled_for) {
      return NextResponse.json({ error: "platform, caption et scheduled_for requis" }, { status: 400 });
    }

    if (!["onlyfans", "mym", "fansly"].includes(platform)) {
      return NextResponse.json({ error: "Plateforme non supportée" }, { status: 400 });
    }

    const preparer = new ManualPublicationPreparer();
    const result = await preparer.prepare({
      creator_id: user.id,
      platform,
      content: { caption, media_urls: media_urls || [], ppv_price, ppv_message },
      scheduled_for,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[MANUAL PUBLISH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
