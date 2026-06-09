import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAuthUrl, encodeOAuthState, getOAuthProvider } from "@/lib/studio/oauth";

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/oauth/[platform]/init">) {
  try {
    const { platform } = await ctx.params;

    const provider = getOAuthProvider(platform);
    if (!provider) {
      return NextResponse.json({ error: "Plateforme non supportée" }, { status: 400 });
    }
    if (provider.authType !== "oauth") {
      return NextResponse.json({ error: "Cette plateforme ne supporte pas OAuth" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const state = encodeOAuthState({
      userId: user.id,
      platform,
      redirectTo: "/studio/platforms",
      nonce: crypto.randomUUID(),
    });

    const authUrl = buildAuthUrl(platform, state);

    return NextResponse.json({ authUrl, state });
  } catch (err) {
    console.error(`[OAUTH INIT] Error:`, err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
