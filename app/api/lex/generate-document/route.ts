// ─── Halo Lex — Document Generator API ─────────────────────────
// POST /api/lex/generate-document
// Body: { documentType, platform, context, questionnaireId?, tone?, escalationLevel?, language? }
// Response: { id, content, type, references }

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface GenerateDocumentRequest {
  documentType: string;
  platform: string;
  context: {
    problemType?: string;
    problemDescription?: string;
    objectives?: string[];
    creatorName?: string;
    username?: string;
    agencyName?: string;
  };
  questionnaireId?: string;
  tone?: "firme_juridique" | "ferme_courtois" | "conciliant" | "tres_ferme";
  escalationLevel?: 1 | 2 | 3 | 4;
  language?: string;
}

const DOCUMENT_TYPES: Record<string, { label: string; categories: string[]; systemPrompt: string }> = {
  appeal_suspension: {
    label: "Appel suspension/bannissement",
    categories: ["plateforme"],
    systemPrompt: "Tu es un assistant juridique spécialisé dans la rédaction de recours pour créateurs de contenu.\nTu rédiges des lettres d'appel formelles contre les décisions de suspension ou bannissement de plateformes.\nLa lettre doit citer les CGU pertinentes de la plateforme, le DSA (Article 17, 21), et exiger une explication détaillée.\nTon : ferme mais professionnel. N'invente pas d'articles de loi.",
  },
  mise_en_demeure: {
    label: "Mise en demeure",
    categories: ["agence", "contentieux"],
    systemPrompt: "Tu rédiges des mises en demeure professionnelles pour créateurs de contenu contre leur agence ou un tiers.\nCite les articles de loi pertinents (Code civil 1171, 1143, CPI L131-1).\nStructure : rappel des faits → manquements → mise en demeure → délai → recours.\nTon : ferme et juridique. Délai standard : 48h à 8 jours.",
  },
  reclamation: {
    label: "Réclamation",
    categories: ["plateforme", "autorité"],
    systemPrompt: "Tu rédiges des réclamations pour créateurs de contenu.\nCible : plateforme (paiements retenus), CNIL (RGPD), DSA, ou plainte pour harcèlement.\nSois factuel, structuré, et cite les textes applicables.\nTon : professionnel et précis.",
  },
  contrat: {
    label: "Contrat/Clause",
    categories: ["contractuel"],
    systemPrompt: "Tu aides les créateurs à rédiger ou analyser des clauses contractuelles.\nModèles : contrat agence-créateur équilibré, cession droits image, NDA, avenant.\nLes clauses doivent respecter le droit français (CPI, Code civil).\nTon : neutre et technique. Précise que le document nécessite validation par un avocat.",
  },
  fiscal: {
    label: "Document fiscal",
    categories: ["fiscal"],
    systemPrompt: "Tu aides les créateurs avec leurs documents fiscaux.\nContenu : déclaration revenus créateur, demande rescrit fiscal, justificatifs bancaires.\nPrécise qu'il s'agit d'une aide à la rédaction et que l'utilisateur doit consulter un expert-comptable.\nTon : informatif et prudent.",
  },
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  firme_juridique: "Ferme et juridique, citations précises des textes de loi, ton sans appel.",
  ferme_courtois: "Ferme mais courtois, respectueux, laissant une porte ouverte à la résolution amiable.",
  conciliant: "Conciliant et constructif, recherche de solution à l'amiable, ton modéré.",
  tres_ferme: "Très ferme, dernier recours avant action judiciaire, mention explicite des procédures contentieuses.",
};

const ESCALATION_INSTRUCTIONS: Record<number, string> = {
  1: "Simple demande informelle, ton modéré, sans fondement juridique détaillé.",
  2: "Demande formelle avec bases légales et références aux CGU/lois applicables.",
  3: "Mise en demeure avec délai de réponse, citation des articles de loi, mention des recours.",
  4: "Pré-contentieux, dernière notification avant saisine du tribunal, ton très ferme.",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = (await request.json()) as GenerateDocumentRequest;
    const {
      documentType,
      platform,
      context,
      questionnaireId,
      tone = "ferme_courtois",
      escalationLevel = 2,
      language = "fr",
    } = body;

    if (!documentType || !platform) {
      return NextResponse.json({ error: "documentType et platform requis" }, { status: 400 });
    }

    // Questionnaire context
    let questionnaireContext = "";
    if (questionnaireId) {
      const { data: q } = await supabase
        .from("lex_questionnaires")
        .select("*")
        .eq("id", questionnaireId)
        .single();

      if (q) {
        const diagLine = q.diagnosis ? "\n- Analyse Lex : " + String(q.diagnosis).substring(0, 500) : "";
        questionnaireContext = [
          "Diagnostic préalable :",
          "- Plateformes : " + ((q.platforms || []) as string[]).join(", "),
          "- Problème : " + (q.problem_type || ""),
          "- Timing : " + (q.problem_timing || ""),
          "- Description : " + (q.problem_description || ""),
          "- Objectifs : " + ((q.objectives || []) as string[]).join(", "),
          "- Urgence : " + (q.urgency || ""),
          diagLine,
        ].filter(Boolean).join("\n");
      }
    }

    // Legal knowledge context
    const { data: legalKnowledge } = await supabase
      .from("legal_knowledge")
      .select("*")
      .or("platform.eq." + platform + ",platform.is.null")
      .eq("is_active", true)
      .limit(8);

    const legalRefs = (legalKnowledge || [])
      .map((k: { title: string; source_name: string; summary: string }) => "- " + k.title + " (" + k.source_name + "): " + k.summary)
      .join("\n");

    const docType = DOCUMENT_TYPES[documentType];
    if (!docType) {
      return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.ferme_courtois;
    const escalationInstruction = ESCALATION_INSTRUCTIONS[escalationLevel] || ESCALATION_INSTRUCTIONS[2];

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: "API key non configurée" }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const contextLines = [
      context.problemDescription ? "- Situation : " + context.problemDescription : "",
      context.problemType ? "- Type de problème : " + context.problemType : "",
      context.objectives?.length ? "- Objectifs : " + context.objectives.join(", ") : "",
      context.creatorName ? "- Nom du créateur : " + context.creatorName : "",
      context.username ? "- Nom d'utilisateur : " + context.username : "",
      context.agencyName ? "- Agence : " + context.agencyName : "",
    ].filter(Boolean).join("\n");

    const userPrompt = [
      "Génère un document juridique professionnel.",
      "",
      "Type de document : " + docType.label,
      "Plateforme : " + platform,
      "Langue : " + language,
      "",
      "Contexte utilisateur :",
      contextLines || "Aucun contexte fourni.",
      "",
      questionnaireContext,
      "",
      "Références juridiques disponibles :",
      legalRefs || "Aucune référence spécifique trouvée dans la base.",
      "",
      "Instructions de ton : " + toneInstruction,
      "Niveau d'escalade : " + escalationInstruction,
      "",
      "Le document doit inclure :",
      "1. En-tête formelle (destinataire, expéditeur, date, objet)",
      "2. Corps structuré avec les faits, les motifs, et les demandes",
      "3. Bases légales citées avec précision",
      "4. Signature et coordonnées",
      "5. [PLACEHOLDER] pour les informations manquantes",
      "",
      "Format : texte brut, paragraphes clairement séparés, titres en gras avec **",
    ].join("\n");

    const systemPrompt = docType.systemPrompt + "\n\nN'invente JAMAIS d'articles de loi, de références juridiques ou de CGU. Utilise uniquement les références fournies dans le contexte. Si aucune référence pertinente n'est disponible, indique-le et suggère une consultation avec un avocat.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n");

    // Save the letter
    const { data: letter, error: insertError } = await supabase
      .from("generated_letters")
      .insert({
        analysis_id: questionnaireId || null,
        user_id: user.id,
        letter_type: documentType,
        platform,
        content,
        language,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Link to questionnaire if provided
    if (questionnaireId) {
      await supabase
        .from("lex_questionnaires")
        .update({ letter_id: letter.id, status: "letter_generated" })
        .eq("id", questionnaireId);
    }

    return NextResponse.json({
      id: letter.id,
      content,
      type: documentType,
      platform,
      references: (legalKnowledge || []).map((k: { title: string; source_name: string }) => ({
        title: k.title,
        source: k.source_name,
      })),
    });
  } catch (error) {
    console.error("Lex generate-document error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
