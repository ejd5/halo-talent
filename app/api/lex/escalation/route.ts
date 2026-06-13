// ─── WTF Lex, Lawyer Escalation API ─────────────────────────
// GET  /api/lex/escalation/partners, Liste des avocats partenaires
// POST /api/lex/escalation         , Déclenche une escalade
// POST /api/lex/escalation/consultation, Crée une consultation

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/lex/escalation?action=partners
 * Liste les avocats partenaires disponibles.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "consultations") {
      // Liste des consultations de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
      }

      const { data, error } = await supabase
        .from("lex_consultations")
        .select("*, partner:firm_name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ consultations: data || [] });
    }

    // MVP: Escalade avocat désactivée, retourne liste vide
    // Réactiver en Phase 2 (mois 6+) avec vrais partenaires
    return NextResponse.json({
      partners: [],
      mvp_disabled: true,
      message: "Réseau d'avocats partenaires disponible en Phase 2. Laissez votre email pour être notifié.",
    });
  } catch (error) {
    console.error("Lex escalation GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/lex/escalation
 * Déclenche une escalade vers un avocat partenaire.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await request.json();
    const { action, partnerId, questionnaireId, reason, messageContext } = body;

    if (action === "create_consultation") {
      // MVP Phase 1: Escalade avocat désactivée
      // Réactiver en Phase 2 (mois 6+) quand les partenariats sont signés
      return NextResponse.json({
        error: "not_available",
        message: "Le réseau d'avocats partenaires sera disponible en Phase 2. Laissez votre email pour être notifié.",
      }, { status: 503 });
    }

    if (action === "log_trigger") {
      // Logger un déclenchement d'escalade (auto-détection)
      const { data, error } = await supabase
        .from("lex_escalation_triggers")
        .insert({
          user_id: user.id,
          trigger_type: body.triggerType || "auto",
          trigger_reason: reason,
          message_context: messageContext || "",
          partner_suggested: body.partnerIds || [],
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ trigger: data });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error("Lex escalation POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Génère un brief de dossier pour l'avocat.
 */
async function generateDossierBrief(
  questionnaire: Record<string, unknown>,
  partner: Record<string, unknown>,
  user: { id: string; email?: string }
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return generateStaticBrief(questionnaire);

  try {
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `Tu génères un brief professionnel pour un avocat partenaire (${partner.firm_name}).
Le brief doit être clair, structuré et prêt à être utilisé par l'avocat pour préparer la consultation.
Format professionnel, neutre, factuel.`,
      messages: [{
        role: "user",
        content: `Génère un brief de dossier pour avocat.

Plateformes : ${(questionnaire.platforms as string[] || []).join(", ")}
Type de problème : ${questionnaire.problem_type || ""}
Description : ${questionnaire.problem_description || ""}
Objectifs du créateur : ${(questionnaire.objectives as string[] || []).join(", ")}
Urgence : ${questionnaire.urgency || ""}
Diagnostic Lex : ${(questionnaire.diagnosis as string || "").substring(0, 1000)}

Structure attendue :
**RÉSUMÉ DU DOSSIER**
[2-3 phrases]

**FAITS**
[Rappel chronologique]

**QUESTIONS JURIDIQUES**
[Points clés à aborder]

**DOCUMENTS FOURNIS**
[Liste]

**OBJECTIFS DU CLIENT**
[Attentes explicites]`,
      }],
    });

    return response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as any).text)
      .join("\n");
  } catch {
    return generateStaticBrief(questionnaire);
  }
}

function generateStaticBrief(questionnaire: Record<string, unknown>): string {
  return `**RÉSUMÉ DU DOSSIER**

Créateur concerné par un litige sur ${(questionnaire.platforms as string[] || []).join(", ") || "plusieurs plateformes"}.
Type de problème : ${questionnaire.problem_type || "Non spécifié"}.
Urgence : ${questionnaire.urgency || "Modéré"}.

**FAITS**
${questionnaire.problem_description || "Description non fournie."}

**QUESTIONS JURIDIQUES**
- Analyse des droits du créateur dans cette situation
- Recours possibles et probabilité de succès
- Démarches recommandées

**OBJECTIFS**
${(questionnaire.objectives as string[] || []).join(", ") || "Non spécifiés"}

**Note :** Brief généré automatiquement par WTF Lex.`;
}
