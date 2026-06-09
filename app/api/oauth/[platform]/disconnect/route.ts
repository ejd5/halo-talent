import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/oauth/[platform]/disconnect">) {
  try {
    const { platform } = await ctx.params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { error } = await supabase
      .from("platform_connections")
      .update({ status: "revoked", access_token: null, refresh_token: null })
      .eq("creator_id", user.id)
      .eq("platform", platform);

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[OAUTH DISCONNECT] Error:`, err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
