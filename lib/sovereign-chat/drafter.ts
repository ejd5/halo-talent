import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getCreatorDNA } from "@/lib/dna/helpers";

interface DraftParams {
  platform: "onlyfans" | "instagram" | "tiktok" | "mym" | "fansly" | "email" | "sms";
  context: any;
  intent: "reply" | "initiate" | "upsell" | "engagement" | "win_back";
  fan: any;
  count?: number;
}

interface ModerationResult {
  blocked: boolean;
  reason?: string;
}

interface DraftResult {
  success: boolean;
  reason?: string;
  details?: string;
  drafts?: any[];
}

export class ComplianceDrafter {
  private anthropic: Anthropic;

  constructor(private creatorId: string) {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }

  async draft(params: DraftParams): Promise<DraftResult> {
    // 1. Pre-flight moderation
    const moderationCheck = await this.checkModeration(params);
    if (moderationCheck.blocked) {
      return {
        success: false,
        reason: "moderation_blocked",
        details: moderationCheck.reason,
      };
    }

    // 2. Load DNA (graceful degradation)
    const dna = await getCreatorDNA(this.creatorId).catch(() => null);

    // 3. Build prompts
    const systemPrompt = this.buildSystemPrompt(params, dna);
    const userPrompt = this.buildUserPrompt(params);

    // 4. Generate via Claude
    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "{}";

    let parsed: { drafts?: any[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      return { success: false, reason: "parse_error", details: "Claude response was not valid JSON" };
    }

    if (!parsed.drafts || !Array.isArray(parsed.drafts)) {
      return { success: false, reason: "invalid_response", details: "Response missing drafts array" };
    }

    // 5. Post-flight compliance validation
    for (const draft of parsed.drafts) {
      draft.compliance_check = this.validateDraft(draft, params.platform);
    }

    // 6. Save with audit trail
    const fullPrompt = systemPrompt + "\n\n" + userPrompt;
    await this.saveDrafts(parsed.drafts, params, fullPrompt);

    return { success: true, drafts: parsed.drafts };
  }

  private buildSystemPrompt(params: DraftParams, dna: any): string {
    const platformRules: Record<string, string> = {
      onlyfans: `RÈGLES ONLYFANS 2026 :
- Disclosure IA obligatoire (note discrète en fin si message envoyé tel quel)
- Pas d'impersonation : c'est un DRAFT, le créateur valide
- Pas de promesses de rencontre IRL ou de sentiments romantiques
- Pas de contenu impliquant des mineurs (auto-refus)
- Pas de demandes d'argent en feignant une relation`,

      instagram: `RÈGLES INSTAGRAM/META 2026 :
- Pas de spam (rate limit 1 DM/60s recommandé)
- Pas d'auto-DM en masse
- Pas de promotion non disclosed
- Respect des hashtags interdits`,

      tiktok: `RÈGLES TIKTOK :
- Pas de spam DM
- Pas de promotion explicite vers contenu adulte
- Pas de redirections depuis TikTok vers OF/MYM directement`,

      email: `RÈGLES EMAIL (CAN-SPAM, RGPD, CASL) :
- Identification claire de l'expéditeur
- Lien de désabonnement obligatoire
- Pas de promesses fausses`,

      sms: `RÈGLES SMS (TCPA, RGPD) :
- "Reply STOP to unsubscribe" obligatoire US/CA
- Pas avant 8h ou après 21h local
- Opt-in documenté requis`,
    };

    const systemParts = [
      `Tu génères ${params.count || 3} drafts de message à valider par un créateur.`,
      "",
      `⚠️ RÈGLES NON NÉGOCIABLES :`,
      platformRules[params.platform] || "",
      "",
      `⚠️ RÈGLES UNIVERSELLES :`,
      "1. C'est un DRAFT. Le créateur validera et enverra lui-même.",
      "2. Pas d'impersonation : utilise la VOIX du créateur sans prétendre être lui en temps réel.",
      "3. Pas de promesses fausses, exagérées, ou de relation amoureuse.",
      "4. Reste authentique, aligné avec son ADN.",
      "5. Si tu détectes un risque (mineur, harcèlement, demande illégale), ne génère PAS et flag dans warnings.",
      "",
    ];

    // Inject DNA voice profile if available
    if (dna?.voice_profile) {
      const vp = dna.voice_profile;
      systemParts.push(`ADN DU CRÉATEUR :`);
      systemParts.push(`Tonalité : formality=${vp.tone?.formality ?? "N/A"} · humor=${vp.tone?.humor ?? "N/A"} · warmth=${vp.tone?.warmth ?? "N/A"} · boldness=${vp.tone?.boldness ?? "N/A"}`);
      systemParts.push(`Énergie : ${vp.energy_level}`);
      systemParts.push(`Phrases fétiches : ${vp.vocabulary?.signature_phrases?.join(", ") || "aucune"}`);
      systemParts.push(`Mots favoris : ${vp.vocabulary?.favorite_words?.join(", ") || "aucun"}`);
      systemParts.push(`Mots interdits : ${vp.vocabulary?.banned_words?.join(", ") || "aucun"}`);
      systemParts.push(`Emojis : ${vp.vocabulary?.emoji_usage === "never" ? "NE JAMAIS utiliser d'emojis" : `${vp.vocabulary?.emoji_usage} · signature : ${vp.vocabulary?.signature_emojis?.join(" ") || ""}`}`);
      systemParts.push(`Formule de fin : "${vp.vocabulary?.sign_off}"`);
      systemParts.push(`Personnalité : ${vp.personality_traits?.join(" · ") || ""}`);
      systemParts.push("");
    }

    systemParts.push(`CONTEXTE FAN :`);
    systemParts.push(`- Tier : ${params.fan.fan_tier}`);
    systemParts.push(`- LTV : ${params.fan.total_spent}€`);
    systemParts.push(`- Langue : ${params.fan.language}`);
    systemParts.push(`- Pays : ${params.fan.country}`);
    systemParts.push(`- Dernière interaction : ${params.fan.last_interaction_at}`);
    systemParts.push("");

    systemParts.push(
      `Génère ${params.count || 3} drafts avec des angles différents :`,
      "1. Approche chaleureuse/empathique",
      "2. Approche joueuse/curieuse",
      "3. Approche directe/pratique",
      "",
    );

    systemParts.push(`RETOURNE UN JSON STRICT :
{
  "drafts": [
    {
      "approach": "<description angle>",
      "text": "<texte du draft>",
      "rationale": "<pourquoi ce draft fonctionne>",
      "estimated_engagement": <0-100>,
      "warnings": ["<warning si pertinent>"],
      "requires_disclosure": <true/false>
    }
  ]
}`);

    return systemParts.join("\n");
  }

  private buildUserPrompt(params: DraftParams): string {
    return `Plateforme : ${params.platform}
Intent : ${params.intent}

Contexte récent :
${JSON.stringify(params.context, null, 2)}

Génère les drafts maintenant.`;
  }

  private async checkModeration(params: DraftParams): Promise<ModerationResult> {
    const text = JSON.stringify(params.context);
    const hardLimits = [
      { pattern: /\b(mineur|underage|teen|child|kid)\b/i, reason: "minor_content" },
      { pattern: /\b(viol|rape|forced|coerce)\b/i, reason: "coercive_content" },
      { pattern: /promise|garanti.{0,30}\b(rencontre|meet|sex|love)\b/i, reason: "false_promise" },
    ];

    for (const { pattern, reason } of hardLimits) {
      if (pattern.test(text)) {
        return { blocked: true, reason };
      }
    }
    return { blocked: false };
  }

  private validateDraft(draft: any, platform: string) {
    const limits: Record<string, number> = {
      instagram: 1000,
      tiktok: 500,
      sms: 160,
      email: 10000,
      onlyfans: 2000,
      mym: 2000,
      fansly: 2000,
    };

    const checks: Record<string, any> = {
      length_ok: draft.text?.length <= (limits[platform] || 2000),
      character_count: draft.text?.length || 0,
      no_false_promises: true,
      requires_disclosure: draft.requires_disclosure || false,
    };

    const forbiddenPatterns = [
      /\bje t'aime\b/i,
      /\bon se rencontre\b.{0,30}\b(irl|réel|real)\b/i,
      /\bguarantee\b.{0,30}\b(money|profit|argent)\b/i,
    ];

    for (const pattern of forbiddenPatterns) {
      if (draft.text && pattern.test(draft.text)) {
        checks.no_false_promises = false;
      }
    }

    return checks;
  }

  private async saveDrafts(drafts: any[], params: DraftParams, prompt: string) {
    const supabase = await createClient();
    for (const draft of drafts) {
      await supabase.from("atlas_drafts").insert({
        creator_id: this.creatorId,
        fan_id: params.fan.id,
        platform: params.platform,
        intent: params.intent,
        draft_text: draft.text,
        approach: draft.approach,
        rationale: draft.rationale,
        warnings: draft.warnings || null,
        compliance_check: draft.compliance_check || null,
        estimated_engagement: draft.estimated_engagement || null,
        status: "pending_validation",
        generated_with_model: "claude-sonnet-4-20250514",
        generation_prompt: { system: prompt.slice(0, 4000) },
      });
    }
  }
}
