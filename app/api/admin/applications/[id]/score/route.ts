import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = Promise<{ id: string }>;

// Minimal types for the Anthropic API call
type MessageContent = { type: string; text: string };

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch application
    const { data: app, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !app) {
      return NextResponse.json(
        { error: "Candidature introuvable" },
        { status: 404 }
      );
    }

    // Verify admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      !["admin", "manager"].includes((profile.role as string) ?? "")
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Build prompt
    const prompt = `Tu es un recruteur expert pour une agence de management créatif premium. Évalue cette candidature.

CANDIDATURE :
Nom : ${app.full_name}
Département : ${app.department}
Revenus actuels : ${app.current_monthly_revenue}
Plateformes : ${(app.platforms as string[])?.join(", ") ?? "Non renseigné"}

Objectifs : "${app.goals ?? ""}"
Pourquoi nous : "${app.why_us ?? ""}"

ÉVALUE selon ces critères (chacun /20) :
1. Cohérence du parcours
2. Potentiel de croissance
3. Qualité de la communication
4. Alignement avec nos valeurs (transparence, souveraineté)
5. Faisabilité de l'accompagnement

Retourne UNIQUEMENT un JSON valide (pas de markdown, pas de texte autour) :
{
  "score_total": <0-100>,
  "scores": { "coherence": <0-20>, "potential": <0-20>, "communication": <0-20>, "alignment": <0-20>, "feasibility": <0-20> },
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendation": "approve" | "review" | "reject",
  "reasoning": "<2-3 phrases>"
}`;

    // Call Anthropic API
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY non configurée" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Erreur API Claude", details: errorText },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.content as MessageContent[];
    const textContent = content[0]?.text ?? "";

    // Parse JSON from response
    let parsed: Record<string, unknown>;
    try {
      // Strip any markdown code fences if present
      const clean = textContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse Claude", raw: textContent },
        { status: 502 }
      );
    }

    // Update application with score
    const score_total = parsed.score_total as number;
    const updateData: Record<string, unknown> = {
      ai_score: score_total,
      ai_analysis: parsed,
    };

    const { error: updateError } = await supabase
      .from("applications")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Erreur mise à jour score:", updateError);
    }

    // Log the audit
    await supabase.from("audit_logs").insert({
      application_id: id,
      action: "Analyse IA générée",
      actor: "Claude",
      metadata: { score: score_total },
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Erreur score IA:", error);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}
