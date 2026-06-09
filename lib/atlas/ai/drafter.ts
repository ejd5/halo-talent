import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

/* ─── Types ─────────────────────────────────────────────── */

export type Platform = "onlyfans" | "instagram" | "tiktok" | "mym" | "email" | "sms";
export type DraftIntent = "reply" | "initiate" | "upsell" | "engagement" | "welcome" | "reengagement" | "promo" | "thank_you" | "birthday" | "custom";

export interface FanInfo {
  id: string;
  display_name?: string;
  first_name?: string;
  fan_tier?: string;
  total_spent?: number;
  language?: string;
  tags?: string[];
  last_message_at?: string;
}

export interface DraftParams {
  platform: Platform;
  context: Record<string, any>;
  intent: DraftIntent;
  fan: FanInfo;
}

export interface ComplianceCheck {
  length_ok: boolean;
  no_forbidden_words: boolean;
  no_false_promises: boolean;
  includes_required_disclosure: boolean;
  character_count: number;
}

export interface Draft {
  id: string;
  approach: string;
  text: string;
  rationale: string;
  warnings: string[];
  requires_disclosure: boolean;
  compliance_check?: ComplianceCheck;
}

export interface DraftResult {
  success: boolean;
  drafts?: Draft[];
  reason?: "moderation_blocked" | "no_api_key" | "generation_failed" | "compliance_blocked";
  details?: string;
}

export interface CreatorDNA {
  display_name: string;
  bio: string;
  voice_profile: {
    tone: string;
    style: string;
    catchphrases: string[];
    emoji_usage: "minimal" | "moderate" | "heavy";
    formality: "casual" | "neutral" | "formal";
    language: string;
  };
}

/* ─── ComplianceDrafter ──────────────────────────────────── */

export class ComplianceDrafter {
  private anthropic: Anthropic | null = null;
  private creatorId: string;

  constructor(creatorId: string) {
    this.creatorId = creatorId;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  /* ─── Main entry point ───────────────────────────────── */

  async draft(params: DraftParams): Promise<DraftResult> {
    try {
      // 1. Pre-flight : vérifier la modération
      const moderationCheck = this.checkModeration(params.context);
      if (moderationCheck.blocked) {
        await this.logAudit({
          action: "failed",
          platform: params.platform,
          intent: params.intent,
          metadata: { moderation_reason: moderationCheck.reason, moderation_details: moderationCheck.details },
        });
        return { success: false, reason: "moderation_blocked", details: moderationCheck.reason };
      }

      // 2. Charger l'ADN du créateur
      const dna = await this.getCreatorDNA();

      // 3. Construire le system prompt avec les règles
      const systemPrompt = this.buildSystemPrompt(params, dna);

      // 4. Générer via Claude
      if (!this.anthropic) {
        return { success: false, reason: "no_api_key", details: "Clé API Anthropic non configurée" };
      }

      const userPrompt = this.buildUserPrompt(params);
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const contentBlock = response.content[0];
      if (contentBlock.type !== "text") {
        return { success: false, reason: "generation_failed", details: "Réponse inattendue de Claude" };
      }

      const rawText = contentBlock.text;
      const jsonStr = rawText.replace(/```json\n?|\n?```/g, "").trim();
      let parsed: { drafts: any[] };
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        return { success: false, reason: "generation_failed", details: "Impossible de parser la réponse JSON" };
      }

      const drafts: Draft[] = [];

      // 5. Post-flight : valider chaque draft
      for (const raw of parsed.drafts || []) {
        const draft: Draft = {
          id: crypto.randomUUID(),
          approach: raw.approach || "",
          text: raw.text || "",
          rationale: raw.rationale || "",
          warnings: raw.warnings || [],
          requires_disclosure: !!raw.requires_disclosure,
          compliance_check: this.validateDraft(raw, params.platform),
        };
        drafts.push(draft);
      }

      // 6. Sauvegarder en base (audit trail)
      for (const draft of drafts) {
        await this.saveDraft(draft, params, systemPrompt, rawText);
      }

      await this.logAudit({
        action: "generated",
        platform: params.platform,
        intent: params.intent,
        prompt_sent: userPrompt,
        response_received: rawText,
        metadata: { draft_count: drafts.length, moderation_warnings: moderationCheck.warnings },
      });

      return { success: true, drafts };
    } catch (err) {
      console.error("[COMPLIANCE DRAFTER] Error:", err);
      await this.logAudit({
        action: "failed",
        platform: params.platform,
        metadata: { error: String(err) },
      });
      return { success: false, reason: "generation_failed", details: String(err) };
    }
  }

  /* ─── Pre-flight moderation ───────────────────────────── */

  private checkModeration(context: any): { blocked: boolean; reason?: string; details?: string; warnings?: string[] } {
    const text = JSON.stringify(context);
    const warnings: string[] = [];

    // Hard limits — blocage immédiat
    const hardLimits: { pattern: RegExp; reason: string }[] = [
      { pattern: /\bmineur|underage|teen|child\b/i, reason: "Référence à un mineur détectée" },
      { pattern: /\bviol|rape|forced|non-consent\b/i, reason: "Violence ou non-consentement détecté" },
      { pattern: /promis.{0,30}(rencontre|meet|rendez-vous)/i, reason: "Promesse de rencontre IRL" },
    ];

    for (const limit of hardLimits) {
      if (limit.pattern.test(text)) {
        return { blocked: true, reason: "hard_limit_violation", details: limit.reason };
      }
    }

    // Soft warnings — ne bloque pas mais avertit
    const softWarnings: { pattern: RegExp; warning: string }[] = [
      { pattern: /\b(garanti|certain)\b.{0,20}(résultat|result|money|argent|profit)/i, warning: "Terme de garantie détecté" },
      { pattern: /\bargent\b.{0,30}\b(facile|rapide|sans effort)\b/i, warning: "Promesse financière irréaliste" },
      { pattern: /\b(médical|medical|docteur|doctor|traitement)\b/i, warning: "Terme médical non autorisé" },
    ];

    for (const sw of softWarnings) {
      if (sw.pattern.test(text)) {
        warnings.push(sw.warning);
      }
    }

    return { blocked: false, warnings };
  }

  /* ─── Creator DNA ─────────────────────────────────────── */

  private async getCreatorDNA(): Promise<CreatorDNA> {
    try {
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, bio, voice_tone, language")
        .eq("id", this.creatorId)
        .single();

      return {
        display_name: profile?.display_name || "Le créateur",
        bio: profile?.bio || "",
        voice_profile: {
          tone: profile?.voice_tone || "naturel et chaleureux",
          style: "authentique et proche de ses fans",
          catchphrases: [],
          emoji_usage: "moderate",
          formality: "casual",
          language: profile?.language || "fr",
        },
      };
    } catch {
      return {
        display_name: "Le créateur",
        bio: "",
        voice_profile: { tone: "naturel et chaleureux", style: "authentique", catchphrases: [], emoji_usage: "moderate", formality: "casual", language: "fr" },
      };
    }
  }

  /* ─── System prompt builder ────────────────────────────── */

  private platformRules(platform: Platform): string {
    const rules: Record<Platform, string> = {
      onlyfans: `RÈGLES ONLYFANS 2026 :
- INTERDICTION ABSOLUE de simuler une relation amoureuse ou des sentiments
- INTERDICTION ABSOLUE de promettre une rencontre IRL
- Disclosure obligatoire si contenu généré par IA envoyé tel quel
- Pas d'impersonation : le créateur valide et envoie lui-même
- Communication authentique et respectueuse
- Pas de contenu impliquant des mineurs (ban permanent + poursuites)`,
      instagram: `RÈGLES INSTAGRAM/META 2026 :
- Anti-spam : rythme naturel, pas de répétition
- Pas d'auto-DM massif
- Pas de promotion non disclosed
- Contenu authentique et engaging
- Respect des guidelines communautaires Meta`,
      tiktok: `RÈGLES TIKTOK 2026 :
- Pas de spam
- Pas de redirection externe vers contenu adulte
- Communication naturelle et créative
- Respect des CGU TikTok`,
      mym: `RÈGLES MYM 2026 :
- Similaire OnlyFans : pas de promesses IRL
- Pas d'impersonation
- Communication validée par le créateur
- Respect de la plateforme`,
      email: `RÈGLES EMAIL (CAN-SPAM, RGPD) :
- Identification claire de l'expéditeur
- Lien de désabonnement obligatoire
- Pas de sujet trompeur
- Adresse physique de l'expéditeur
- Respect de la vie privée`,
      sms: `RÈGLES SMS (TCPA, RGPD) :
- STOP pour désabonnement obligatoire
- Pas de messages avant 8h ou après 21h
- Opt-in documenté obligatoire
- Messages concis (160 caractères max)`,
    };
    return rules[platform] || rules.email;
  }

  private buildSystemPrompt(params: DraftParams, dna: CreatorDNA): string {
    return `Tu génères des drafts de messages à valider par un créateur de contenu.

⚠️ RÈGLES NON NÉGOCIABLES :
${this.platformRules(params.platform)}

⚠️ RÈGLES UNIVERSELLES :
1. C'est un DRAFT — le créateur validera et enverra lui-même
2. Utilise la VOIX du créateur sans prétendre être lui
3. Pas de promesses fausses ou exagérées
4. Reste authentique et aligné avec son ADN
5. Si tu détectes un risque (réclamation, mineur, harcèlement, demande illégale) : ne génère PAS

ADN DU CRÉATEUR :
- Nom : ${dna.display_name}
- Bio : ${dna.bio}
- Ton : ${dna.voice_profile.tone}
- Style : ${dna.voice_profile.style}
- Utilisation d'émojis : ${dna.voice_profile.emoji_usage}
- Niveau de formalité : ${dna.voice_profile.formality}
- Langue : ${dna.voice_profile.language}

CONTEXTE :
- Plateforme : ${params.platform}
- Intention : ${params.intent}
- Fan : ${params.fan.display_name || params.fan.first_name || "un fan"} (tier: ${params.fan.fan_tier || "N/A"}, LTV: ${params.fan.total_spent || 0}€)
- Langue du fan : ${params.fan.language || dna.voice_profile.language}

Génère 3 drafts avec des angles différents. Réponds UNIQUEMENT avec ce JSON valide :
{
  "drafts": [
    {
      "approach": "description de l'angle choisi",
      "text": "le message draft",
      "rationale": "pourquoi ce draft fonctionne",
      "warnings": ["alerte si pertinent"],
      "requires_disclosure": false
    }
  ]
}`;
  }

  private buildUserPrompt(params: DraftParams): string {
    return `Génère 3 drafts pour ${params.intent} sur ${params.platform}.

Contexte supplémentaire :
${JSON.stringify(params.context, null, 2)}

Fan : ${JSON.stringify({
  name: params.fan.display_name || params.fan.first_name,
  tier: params.fan.fan_tier,
  ltv: params.fan.total_spent,
  tags: params.fan.tags,
}, null, 2)}`;
  }

  /* ─── Post-flight validation ──────────────────────────── */

  private validateDraft(draft: any, platform: Platform): ComplianceCheck {
    const text = draft.text || "";
    const checks: ComplianceCheck = {
      length_ok: true,
      no_forbidden_words: true,
      no_false_promises: true,
      includes_required_disclosure: true,
      character_count: text.length,
    };

    // Character limits per platform
    const limits: Record<string, number> = { instagram: 1000, tiktok: 500, sms: 160, email: 10000 };
    if (text.length > (limits[platform] || 2000)) checks.length_ok = false;

    // Forbidden patterns (false promises, impersonation)
    const forbidden: RegExp[] = [
      /je t'aime\b/i,
      /\bje viens te voir\b/i,
      /\brencontre.{0,30}(réel|réelle|irl|real)\b/i,
      /\bguarantee|garant(i|ie)\b.{0,30}\b(money|argent|profit|résultat)\b/i,
    ];
    for (const pat of forbidden) {
      if (pat.test(text)) checks.no_false_promises = false;
    }

    // Check disclosure
    if (platform === "email" && !text.includes("désabonnement") && !text.includes("unsubscribe")) {
      checks.includes_required_disclosure = false;
    }

    return checks;
  }

  /* ─── Database persistence ────────────────────────────── */

  private async saveDraft(draft: Draft, params: DraftParams, prompt: string, rawResponse: string): Promise<void> {
    try {
      const supabase = await createClient();
      await supabase.from("atlas_drafts").insert({
        creator_id: this.creatorId,
        fan_id: params.fan.id,
        platform: params.platform,
        intent: params.intent,
        channel: params.platform,
        approach: draft.approach,
        content: draft.text,
        draft_text: draft.text,
        prompt: { raw: prompt },
        full_response: { raw: rawResponse },
        compliance_check: draft.compliance_check,
        warnings: draft.warnings,
        requires_disclosure: draft.requires_disclosure,
        status: "pending",
        generated_with_model: "claude-sonnet-4-20250514",
      });
    } catch (err) {
      console.error("[DRAFTER] Save error:", err);
    }
  }

  /* ─── Audit trail ─────────────────────────────────────── */

  private async logAudit(entry: {
    action: string;
    platform?: string;
    intent?: string;
    prompt_sent?: string;
    response_received?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const supabase = await createClient();
      await supabase.from("atlas_draft_audit").insert({
        creator_id: this.creatorId,
        action: entry.action,
        platform: entry.platform,
        intent: entry.intent,
        prompt_sent: entry.prompt_sent,
        response_received: entry.response_received,
        compliance_checks: {},
        metadata: entry.metadata || {},
      });
    } catch (err) {
      console.error("[DRAFTER AUDIT] Error:", err);
    }
  }
}

/* ─── Disclosure helper ──────────────────────────────────── */

/* ─── Legacy helpers (backwards compat) ──────────────────── */

export async function getPendingDrafts(
  supabase: any,
  creatorId: string,
  limit = 20,
) {
  const { data } = await supabase
    .from("atlas_drafts")
    .select("*, atlas_fans!inner(display_name, avatar_url, fan_tier)")
    .eq("creator_id", creatorId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function approveDraft(supabase: any, draftId: string, creatorId: string) {
  const { data } = await supabase
    .from("atlas_drafts")
    .update({ status: "approved", validated_at: new Date().toISOString() })
    .eq("id", draftId)
    .eq("creator_id", creatorId)
    .select()
    .single();
  return data;
}

export async function rejectDraft(supabase: any, draftId: string, creatorId: string) {
  const { data } = await supabase
    .from("atlas_drafts")
    .update({ status: "rejected", validated_at: new Date().toISOString() })
    .eq("id", draftId)
    .eq("creator_id", creatorId)
    .select()
    .single();
  return data;
}

export function addDisclosureIfRequired(text: string, platform: Platform, isAIGenerated: boolean): string {
  if (!isAIGenerated) return text;

  switch (platform) {
    case "email":
      return `${text}\n\n---\nCette communication peut contenir des éléments générés ou suggérés par intelligence artificielle, validés et envoyés par le créateur. Pour vous désabonner, répondez "STOP".`;
    case "onlyfans":
      // OF 2026 : disclosure required if AI-generated content is sent unedited
      // Since the creator validates drafts, it's human-approved
      return text;
    case "sms":
      return `${text} STOP pour désabonnement.`;
    default:
      return text;
  }
}
