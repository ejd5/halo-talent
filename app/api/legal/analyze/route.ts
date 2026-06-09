import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropicKey = process.env.ANTHROPIC_API_KEY;

interface AnalyzeRequest {
  platform: string;
  clauses_checked: string[];
  other_clause_text?: string;
  agency_name?: string;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: AnalyzeRequest = await request.json();
    const { platform, clauses_checked, other_clause_text, agency_name, language } = body;
    const lang = language || "fr";

    if (!platform || !clauses_checked?.length) {
      return NextResponse.json(
        { error: "platform and clauses_checked are required" },
        { status: 400 }
      );
    }

    // 1. Fetch corresponding abusive clauses
    const { data: clauses, error: clausesError } = await supabase
      .from("abusive_clauses")
      .select("*")
      .in("id", clauses_checked)
      .eq("is_active", true);

    if (clausesError) throw clausesError;
    if (!clauses?.length) {
      return NextResponse.json(
        { error: "No matching clauses found" },
        { status: 404 }
      );
    }

    // 2. Calculate total score
    const totalScore = clauses.reduce((sum, c) => sum + c.severity, 0);

    // 3. Determine risk level
    const riskLevel =
      totalScore >= 21 ? "critical" :
      totalScore >= 13 ? "high" :
      totalScore >= 6  ? "medium" :
                         "low";

    // 4. Fetch relevant legal knowledge
    const { data: legalKnowledge } = await supabase
      .from("legal_knowledge")
      .select("*")
      .or(`platform.eq.${platform},platform.is.null`)
      .eq("is_active", true)
      .limit(10);

    // 5. Generate diagnosis
    let diagnosis = "";
    let actions: string[] = [];

    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });

      const clausesForPrompt = clauses
        .map((c) => `- ${c.label} (sévérité ${c.severity}/5)\n  Argument: ${c.legal_argument}`)
        .join("\n\n");

      const legalRefs = (legalKnowledge || [])
        .map((k) => `- ${k.title} (${k.source_name}): ${k.summary}`)
        .join("\n");

      const agencyContext = agency_name
        ? `\nAgence concernée : ${agency_name}`
        : "";

      const systemPrompt = `Tu es un conseiller juridique spécialisé dans la protection des créateurs de contenu. Tu analyses des contrats d'agence de management.

Voici les clauses problématiques identifiées dans le contrat de ce créateur :
${clausesForPrompt}
Plateforme concernée : ${platform}${agencyContext}

Données juridiques de référence :
${legalRefs}

Génère un diagnostic personnalisé en ${lang} qui :
- Résume la situation en 2-3 phrases percutantes
- Explique les droits du créateur pour chaque clause cochée
- Donne 3 actions concrètes à entreprendre immédiatement
- Reste factuel, jamais alarmiste, toujours empowerant

Format : texte structuré avec des sections claires.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: "Analyse mon contrat s'il te plaît." }],
      });

      diagnosis = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text)
        .join("\n");

      // Extract actions from diagnosis (lines starting with numbers or dashes after "actions")
      const lines = diagnosis.split("\n");
      const actionSection = lines.findIndex((l) =>
        l.toLowerCase().includes("action") || l.toLowerCase().includes("faire")
      );
      if (actionSection >= 0) {
        actions = lines
          .slice(actionSection)
          .filter((l) => /^\s*[\d\-•]/.test(l))
          .map((l) => l.replace(/^\s*[\d\-•.]+\s*/, "").trim())
          .filter(Boolean);
      }
    } else {
      // Static fallback without AI
      diagnosis = clauses
        .map(
          (c) =>
            `## ${c.label}\n${c.legal_argument}`
        )
        .join("\n\n");

      actions = [
        "Conserve tous les échanges écrits avec ton agence (emails, messages).",
        "Contacte le support de la plateforme avec ta pièce d'identité pour vérifier la propriété de ton compte.",
        "Consulte un avocat spécialisé en droit des créateurs numériques.",
      ];
    }

    // 6. Save analysis
    const { data: analysis, error: insertError } = await supabase
      .from("contract_analyses")
      .insert({
        platform,
        clauses_checked,
        other_clause_text: other_clause_text || null,
        agency_name: agency_name || null,
        total_score: totalScore,
        risk_level: riskLevel,
        ai_diagnosis: diagnosis,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // 7. Return result
    return NextResponse.json({
      id: analysis.id,
      score: totalScore,
      risk_level: riskLevel,
      diagnosis,
      clauses_details: clauses.map((c) => ({
        id: c.id,
        label: c.label,
        severity: c.severity,
        category: c.category,
        legal_argument: c.legal_argument,
      })),
      actions,
    });
  } catch (error) {
    console.error("Legal analyze error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
