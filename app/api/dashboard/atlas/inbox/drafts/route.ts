import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPendingDrafts, approveDraft, rejectDraft } from "@/lib/atlas/ai/drafter";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const drafts = await getPendingDrafts(supabase, user.id);
    return NextResponse.json({ drafts });
  } catch (err) {
    console.error("[ATLAS DRAFTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { draftId, action } = await request.json();
    if (!draftId || !action) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    if (action === "approve") {
      const draft = await approveDraft(supabase, draftId, user.id);
      return NextResponse.json({ draft });
    } else if (action === "reject") {
      const draft = await rejectDraft(supabase, draftId, user.id);
      return NextResponse.json({ draft });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (err) {
    console.error("[ATLAS DRAFTS PATCH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
