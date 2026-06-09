import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addDisclosureIfRequired } from "@/lib/atlas/ai/drafter";
import type { Platform } from "@/lib/atlas/ai/drafter";

/* ─── GET: Single draft details ─────────────────────────── */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: draft } = await supabase
      .from("atlas_drafts")
      .select("*, atlas_fans!inner(display_name, avatar_url, fan_tier, first_name, total_spent)")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!draft) {
      return NextResponse.json({ error: "Draft introuvable" }, { status: 404 });
    }

    // Get audit trail
    const { data: auditLog } = await supabase
      .from("atlas_draft_audit")
      .select("*")
      .eq("draft_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ draft, audit_log: auditLog ?? [] });
  } catch (err) {
    console.error("[DRAFT GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ─── PUT: Approve / Reject / Edit draft ────────────────── */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { action, edited_text, rejection_reason, apply_disclosure } = body;

    // Fetch existing draft
    const { data: draft } = await supabase
      .from("atlas_drafts")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!draft) {
      return NextResponse.json({ error: "Draft introuvable" }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    const auditAction: string = action || "approved";

    switch (action) {
      case "approve":
      case "approved": {
        // Save edit history if content changed
        let finalText = edited_text || draft.content;
        if (edited_text && edited_text !== draft.content) {
          updates.edit_history = [
            ...(draft.edit_history || []),
            { previous: draft.content, edited_at: new Date().toISOString() },
          ];
          updates.content = edited_text;
        }

        // Apply disclosure if requested
        if (apply_disclosure && draft.platform) {
          finalText = addDisclosureIfRequired(
            edited_text || draft.content,
            draft.platform as Platform,
            true,
          );
          updates.content = finalText;
        }

        updates.status = "approved";
        updates.validated_at = new Date().toISOString();
        break;
      }

      case "reject":
      case "rejected": {
        updates.status = "rejected";
        updates.rejection_reason = rejection_reason || "Rejeté par le créateur";
        updates.validated_at = new Date().toISOString();
        break;
      }

      case "edit": {
        if (!edited_text) {
          return NextResponse.json({ error: "edited_text requis" }, { status: 400 });
        }
        updates.content = edited_text;
        updates.edit_history = [
          ...(draft.edit_history || []),
          { previous: draft.content, edited_at: new Date().toISOString() },
        ];
        // Stay as pending (needs re-approval)
        break;
      }

      case "mark_sent": {
        updates.status = "sent";
        updates.sent_at = new Date().toISOString();
        updates.sent_channel = body.channel || draft.platform || draft.channel;
        break;
      }

      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("atlas_drafts")
      .update(updates)
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("*, atlas_fans!inner(display_name, avatar_url, fan_tier)")
      .single();

    if (error) return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });

    // Log audit trail
    await supabase.from("atlas_draft_audit").insert({
      draft_id: id,
      creator_id: user.id,
      action: auditAction,
      platform: draft.platform,
      intent: draft.intent,
      metadata: {
        had_edit: !!edited_text && edited_text !== draft.content,
        rejection_reason,
        apply_disclosure,
      },
    });

    return NextResponse.json({ draft: updated });
  } catch (err) {
    console.error("[DRAFT UPDATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
