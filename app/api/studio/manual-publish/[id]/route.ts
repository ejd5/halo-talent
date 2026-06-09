import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ManualPublicationPreparer } from "@/lib/platforms/manual";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/studio/manual-publish/[id]">) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const preparer = new ManualPublicationPreparer();
    const publication = await preparer.getById(id, user.id);

    if (!publication) {
      return NextResponse.json({ error: "Publication non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ data: publication });
  } catch (err) {
    console.error("[MANUAL PUBLISH GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/studio/manual-publish/[id]">) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { action } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const preparer = new ManualPublicationPreparer();

    switch (action) {
      case "copied":
        await preparer.markCopied(id, user.id);
        break;
      case "published":
        await preparer.markPublished(id, user.id);
        break;
      case "cancel":
        await preparer.cancel(id, user.id);
        break;
      default:
        return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[MANUAL PUBLISH PATCH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
