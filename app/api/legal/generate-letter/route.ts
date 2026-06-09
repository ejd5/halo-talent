import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropicKey = process.env.ANTHROPIC_API_KEY;

interface GenerateLetterRequest {
  analysis_id: string;
  letter_type: "mise_en_demeure" | "resiliation" | "platform_support" | "account_recovery";
  platform: string;
  creator_name?: string;
  agency_name?: string;
  language?: string;
}

const LETTER_PROMPTS: Record<string, string> = {
  mise_en_demeure: `Génère une lettre de mise en demeure professionnelle en {lang}.

Le créateur demande à son agence de :
- Restituer l'accès complet au compte {platform}
- Cesser toute utilisation de son contenu
- Fournir un décompte détaillé des commissions perçues

Clauses abusives identifiées : {clauses}
Références juridiques : {legal_references}

La lettre doit :
- Être formelle mais ferme
- Citer les articles de loi et CGU pertinents
- Fixer un délai de 48h pour réponse
- Mentionner les recours possibles (plainte, signalement plateforme)
- Inclure des placeholders [NOM_CREATEUR], [NOM_AGENCE], [DATE], [NUMERO_COMPTE]`,

  resiliation: `Génère une lettre de résiliation de contrat d'agence en {lang}.

Motifs de résiliation :
{clauses}

Références juridiques : {legal_references}

La lettre doit :
- Rappeler le contrat concerné
- Détailer les manquements constatés
- Inclure les placeholders [NOM_CREATEUR], [NOM_AGENCE], [DATE]
- Mentionner la date d'effet de la résiliation
- Rappeler les obligations post-contractuelles (restitution des comptes, cessation d'utilisation du contenu)`,

  platform_support: `Génère un email de signalement à envoyer au support de {platform} en {lang}.

Le créateur signale que son agence :
{clauses}

L'email doit :
- Être concis et factuel
- Citer les CGU violées par l'agence
- Demander la restitution d'accès au compte
- Joindre la pièce d'identité du créateur comme preuve de propriété
- Inclure les placeholders nécessaires`,

  account_recovery: `Génère une demande de récupération de compte pour {platform} en {lang}.

Contexte : le créateur a perdu l'accès à son compte car son agence contrôlait l'email et les identifiants.

L'email doit :
- Expliquer la situation clairement
- Prouver l'identité du créateur (pièce d'identité à joindre)
- Demander la réinitialisation du mot de passe sur l'email du créateur
- Citer les CGU sur la propriété du compte
- Rester professionnel et factuel`,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: GenerateLetterRequest = await request.json();
    const { analysis_id, letter_type, platform, creator_name, agency_name, language } = body;
    const lang = language || "fr";

    if (!analysis_id || !letter_type || !platform) {
      return NextResponse.json(
        { error: "analysis_id, letter_type, and platform are required" },
        { status: 400 }
      );
    }

    // 1. Fetch the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("contract_analyses")
      .select("*")
      .eq("id", analysis_id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // 2. Fetch clauses
    const { data: clauses } = await supabase
      .from("abusive_clauses")
      .select("*")
      .in("id", analysis.clauses_checked)
      .eq("is_active", true);

    // 3. Fetch legal knowledge
    const { data: legalKnowledge } = await supabase
      .from("legal_knowledge")
      .select("*")
      .or(`platform.eq.${platform},platform.is.null`)
      .eq("is_active", true)
      .limit(10);

    const clausesText = (clauses || [])
      .map((c) => `- ${c.label} (sévérité ${c.severity}/5)\n  ${c.legal_argument}`)
      .join("\n\n");

    const legalRefs = (legalKnowledge || [])
      .map((k) => `- ${k.title} (${k.source_name}): ${k.summary}`)
      .join("\n");

    let letterContent = "";

    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });

      const promptTemplate = LETTER_PROMPTS[letter_type];
      if (!promptTemplate) {
        return NextResponse.json({ error: "Invalid letter_type" }, { status: 400 });
      }

      const userPrompt = promptTemplate
        .replace(/\{lang\}/g, lang)
        .replace(/\{platform\}/g, platform)
        .replace(/\{clauses\}/g, clausesText)
        .replace(/\{legal_references\}/g, legalRefs);

      const systemPrompt = `Tu es un assistant juridique spécialisé dans la rédaction de lettres et documents légaux pour la protection des créateurs de contenu.
Tu rédiges des documents professionnels, juridiquement précis, et prêts à être utilisés.
Utilise un ton ${letter_type === "platform_support" || letter_type === "account_recovery" ? "courtois et factuel" : "formel et ferme"}.
N'invente pas d'articles de loi — utilise uniquement les références fournies.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      letterContent = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as any).text)
        .join("\n");
    } else {
      // Static fallback
      letterContent = generateStaticLetter(letter_type, platform, clausesText, legalRefs, lang);
    }

    // 4. Save the letter
    const { data: letter, error: insertError } = await supabase
      .from("generated_letters")
      .insert({
        analysis_id,
        letter_type,
        platform,
        content: letterContent,
        language: lang,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // 5. Track letter generation
    await supabase
      .from("contract_analyses")
      .update({ letter_generated: true })
      .eq("id", analysis_id);

    return NextResponse.json({
      id: letter.id,
      letter_content: letterContent,
      letter_type,
      references_used: (legalKnowledge || []).map((k) => k.source_name),
    });
  } catch (error) {
    console.error("Legal generate-letter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateStaticLetter(
  type: string,
  platform: string,
  clauses: string,
  legalRefs: string,
  lang: string
): string {
  const date = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const base = `[NOM_CREATEUR]
[NUMERO_COMPTE ${platform.toUpperCase()}]
${date}

`;

  switch (type) {
    case "mise_en_demeure":
      return (
        base +
        `**LETTRE DE MISE EN DEMEURE**

Objet : Mise en demeure de restituer l'accès au compte et de fournir un décompte

À l'attention de [NOM_AGENCE],

Je soussigné(e) [NOM_CREATEUR], créateur(trice) de contenu sur la plateforme ${platform}, vous notifie par la présente une mise en demeure.

Clauses abusives constatées :
${clauses}

Références juridiques applicables :
${legalRefs}

En conséquence, je vous mets en demeure de :
1. Restituer l'accès complet à mon compte ${platform} dans un délai de 48h
2. Cesser toute utilisation de mon contenu sans mon autorisation expresse
3. Me fournir un décompte détaillé de l'ensemble des commissions perçues

Passé ce délai, je me réserve le droit de saisir les autorités compétentes et d'engager toute action judiciaire nécessaire.


Fait à [VILLE], le ${date}

[NOM_CREATEUR]`
      );

    case "platform_support":
      return (
        base +
        `**Demande d'assistance — Récupération de compte**

Objet : Demande de restitution d'accès — Compte créateur ${platform}

À l'équipe de support ${platform},

Je suis créateur(trice) sur votre plateforme et je rencontre un problème d'accès à mon compte.

Ma situation :
${clauses}

Je joins ma pièce d'identité afin de prouver que je suis bien le(la) titulaire vérifié(e) de ce compte.

Je vous demande de bien vouloir :
1. Réinitialiser l'accès à mon compte
2. Mettre à jour l'email de contact avec mon adresse personnelle
3. Me confirmer par écrit les mesures prises

Restant à votre disposition pour toute information complémentaire.

Cordialement,

[NOM_CREATEUR]
Pièce jointe : [PIECE_IDENTITE]`
      );

    default:
      return base + `**Lettre générée automatiquement**

Contexte : ${clauses}

Références : ${legalRefs}

Veuillez personnaliser cette lettre avec vos informations.

[NOM_CREATEUR]
[CONTACT]
${date}`;
  }
}
