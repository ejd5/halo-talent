import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/compliance/audit";

export const dynamic = "force-dynamic";

const CONSENT_ITEM_KEYS = [
  "item_1_authorized",
  "item_2_platform_rules",
  "item_3_ia_limitations",
  "item_4_no_guarantee",
  "item_5_no_revenue_guarantee",
  "item_6_human_approval",
  "item_7_disclosure",
  "item_8_boundaries",
  "item_9_audit_logged",
  "item_10_can_disable",
  "item_11_legal_info_only",
] as const;

const CONSENT_ITEM_LABELS: Record<string, string> = {
  item_1_authorized: "Je suis bien le/la titulaire du compte",
  item_2_platform_rules: "Je connais les règles des plateformes (OF, MYM, etc.)",
  item_3_ia_limitations: "Je comprends que l'IA peut produire des suggestions inappropriées",
  item_4_no_guarantee: "Je comprends qu'aucun résultat n'est garanti",
  item_5_no_revenue_guarantee: "Je comprends qu'aucun revenu n'est garanti",
  item_6_human_approval: "Je m'engage à valider chaque message avant envoi",
  item_7_disclosure: "Je comprends mes obligations de divulgation",
  item_8_boundaries: "Je comprends les limites du module IA",
  item_9_audit_logged: "J'accepte que mes actions soient journalisées",
  item_10_can_disable: "Je sais que je peux désactiver le module à tout moment",
  item_11_legal_info_only: "Je comprends que ceci n'est pas un conseil juridique",
};

function computeChecklistResponse(checklist: Record<string, unknown> | null) {
  if (!checklist) {
    return {
      checklist: null,
      completed: false,
      completedCount: 0,
      totalCount: 11,
      version: 0,
      updatedAt: null,
      missingItems: CONSENT_ITEM_KEYS.map((k) => ({ key: k, label: CONSENT_ITEM_LABELS[k] })),
    };
  }

  const items: Record<string, boolean> = {};
  for (const k of CONSENT_ITEM_KEYS) {
    items[k] = !!(checklist as Record<string, boolean>)[k];
  }
  const completedCount = Object.values(items).filter(Boolean).length;
  const missingItems = CONSENT_ITEM_KEYS
    .filter((k) => !items[k])
    .map((k) => ({ key: k, label: CONSENT_ITEM_LABELS[k] }));

  return {
    checklist: items,
    completed: completedCount === 11,
    completedCount,
    totalCount: 11,
    version: checklist.version as number,
    updatedAt: checklist.completed_at as string | null,
    missingItems,
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { data: checklist, error } = await supabase
      .from("chat_ai_consent_checklists")
      .select("*")
      .eq("user_id", user.id)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("[Consent] GET error:", error);
      return NextResponse.json({ error: "Erreur chargement consentement" }, { status: 500 });
    }

    return NextResponse.json(computeChecklistResponse(checklist as Record<string, unknown> | null));
  } catch (error) {
    console.error("[Consent] GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();

    // Validate that all keys in body are valid consent item keys
    const updateKeys = Object.keys(body).filter((k) =>
      CONSENT_ITEM_KEYS.includes(k as typeof CONSENT_ITEM_KEYS[number])
    );

    if (updateKeys.length === 0) {
      return NextResponse.json({ error: "Aucune clé de consentement valide" }, { status: 400 });
    }

    // Build update object with only valid boolean fields
    const updates: Record<string, unknown> = {};
    for (const k of updateKeys) {
      updates[k] = Boolean(body[k]);
    }

    // Check if all 11 items are now true
    const { data: existing } = await supabase
      .from("chat_ai_consent_checklists")
      .select("*")
      .eq("user_id", user.id)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const existingItems: Record<string, boolean> = {};
    for (const k of CONSENT_ITEM_KEYS) {
      existingItems[k] = !!(existing as Record<string, boolean> | null)?.[k];
    }
    for (const k of updateKeys) {
      existingItems[k] = Boolean(body[k]);
    }

    const allComplete = Object.values(existingItems).every(Boolean);
    if (allComplete) {
      updates.completed_at = new Date().toISOString();
    }

    if (existing) {
      // Update existing checklist
      const { error: updateErr } = await supabase
        .from("chat_ai_consent_checklists")
        .update(updates)
        .eq("id", (existing as Record<string, unknown>).id as string)
        .eq("user_id", user.id);

      if (updateErr) {
        console.error("[Consent] PATCH update error:", updateErr);
        return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
      }
    } else {
      // Create new checklist
      updates.user_id = user.id;
      updates.version = 1;

      const { error: insertErr } = await supabase
        .from("chat_ai_consent_checklists")
        .insert(updates);

      if (insertErr) {
        console.error("[Consent] PATCH insert error:", insertErr);
        return NextResponse.json({ error: "Erreur création" }, { status: 500 });
      }
    }

    // Audit log
    await logAction({
      userId: user.id,
      actorId: user.id,
      actorType: "creator",
      action: "consent_checklist_updated",
      targetType: "consent_checklist",
      targetId: user.id,
      metadata: {
        updatedKeys: updateKeys,
        allComplete,
        version: ((existing as Record<string, unknown> | null)?.version as number) || 1,
      },
    });

    // Return updated checklist
    const { data: updated } = await supabase
      .from("chat_ai_consent_checklists")
      .select("*")
      .eq("user_id", user.id)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json(computeChecklistResponse(updated as Record<string, unknown> | null));
  } catch (error) {
    console.error("[Consent] PATCH error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
