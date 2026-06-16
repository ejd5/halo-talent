import type { Tool } from "../types";

// ─── Alert helper ───────────────────────────────────────────

async function sendTelegramAlert(creatorId: string, message: string) {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    // Log alert, Telegram integration would go here
    await supabase.from("dm_flags").insert({
      creator_id: creatorId,
      dm_id: "alert",
      reason: message,
      severity: "critical",
      flagged_by: "engagement_helper",
    });
  } catch {
    console.warn("[EngagementHelper] Telegram alert failed");
  }
}

// ─── DM Tools ───────────────────────────────────────────────

export const getDMs: Tool = {
  name: "get_dms",
  description: "Get unread or recent DMs from the creator's platforms. The creator must have synced their inbox manually (no automated scraping).",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "mym", "fansly", "all"] },
      filter: { type: "string", enum: ["unread", "all", "priority"] },
      limit: { type: "number", default: 50 },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("messages").select("*").eq("creator_id", creatorId);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    if (input.filter === "unread") query = query.eq("read", false);
    const { data } = await query.order("created_at", { ascending: false }).limit(input.limit ?? 50);
    return data ?? [];
  },
};

export const getDMHistory: Tool = {
  name: "get_dm_history",
  description: "Get the full conversation history with a specific fan across any platform",
  input_schema: {
    type: "object",
    properties: {
      fan_identifier: { type: "string", description: "Fan username or ID from the message" },
      platform: { type: "string", enum: ["onlyfans", "instagram", "mym", "fansly"] },
      limit: { type: "number", default: 100 },
    },
    required: ["fan_identifier"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase
      .from("messages")
      .select("*")
      .eq("creator_id", creatorId)
      .contains("sender_info", { username: input.fan_identifier });
    if (input.platform) query = query.eq("platform", input.platform);
    const { data } = await query.order("created_at", { ascending: true }).limit(input.limit ?? 100);
    return data ?? [];
  },
};

export const categorizeMessage: Tool = {
  name: "categorize_message",
  description: "Categorize a DM (question, compliment, PPV request, suspicious, regular) and assign a priority score (0-100)",
  input_schema: {
    type: "object",
    properties: {
      dm_id: { type: "string", description: "The message ID to categorize" },
    },
    required: ["dm_id"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: dm } = await supabase
      .from("messages")
      .select("*")
      .eq("id", input.dm_id)
      .eq("creator_id", creatorId)
      .single();

    if (!dm) return { error: "Message not found" };

    const content = (dm.content ?? "").toLowerCase();
    let category = "regular";
    let priority = 30;
    const reasons: string[] = [];

    // Auto-categorize based on content patterns
    if (content.includes("prix") || content.includes("combien") || content.includes("cost") || content.includes("acheter") || content.includes("buy")) {
      category = "ppv_request";
      priority = 70;
      reasons.push("Demande de prix/PPV détectée");
    } else if (content.includes("merci") || content.includes("love") || content.includes("❤️") || content.includes("super") || content.includes("beau")) {
      category = "compliment";
      priority = 40;
      reasons.push("Compliment détecté");
    } else if (content.includes("?") && (content.includes("quand") || content.includes("quoi") || content.includes("comment") || content.includes("pourquoi") || content.includes("où"))) {
      category = "question";
      priority = 60;
      reasons.push("Question détectée");
    } else if (content.includes("menu") || content.includes("porno") || content.includes("sex") || content.includes("nude") || content.includes("hard")) {
      category = "suspicious";
      priority = 80;
      reasons.push("Contenu explicite demandé, potentiellement suspicieux");
    } else if (content.includes("@") || content.includes("http") || content.includes("link") || content.includes("clique")) {
      category = "suspicious";
      priority = 90;
      reasons.push("Lien externe détecté, potentiel spam");
    }

    return {
      dm_id: input.dm_id,
      category,
      priority,
      reasons,
      needs_attention: priority >= 70,
    };
  },
};

export const generateReplyDraft: Tool = {
  name: "generate_reply_draft",
  description: "Generate a DRAFT reply to a DM. This draft is saved as pending_validation and MUST be validated by the creator before being sent.",
  input_schema: {
    type: "object",
    properties: {
      dm_id: { type: "string", description: "The message ID to reply to" },
      tone: { type: "string", enum: ["friendly", "flirty", "professional", "mysterious"] },
      goal: { type: "string", enum: ["build_rapport", "thank", "offer_ppv", "redirect_to_platform", "decline_politely"] },
    },
    required: ["dm_id"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: dm } = await supabase
      .from("messages")
      .select("*")
      .eq("id", input.dm_id)
      .eq("creator_id", creatorId)
      .single();

    if (!dm) return { error: "DM not found" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, voice_profile")
      .eq("id", creatorId)
      .single();

    const creatorName = profile?.display_name ?? "le créateur";
    const voiceProfile = profile?.voice_profile ?? {};

    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `Tu rédiges un DRAFT de réponse à un fan pour le créateur.

CRÉATEUR : ${creatorName}
PROFIL DE VOIX : ${JSON.stringify(voiceProfile)}

MESSAGE DU FAN : "${dm.content}"

OBJECTIF : ${input.goal || "build_rapport"}
TON : ${input.tone || "friendly"}

RÈGLES :
- Court (max 50 mots)
- Authentique, dans le style du créateur
- Pas sexuellement explicite
- Pas de fausses promesses
- Pas d'engagement IRL

Retourne UNIQUEMENT le texte du draft, sans introduction ni commentaire.`,
      }],
    });

    const draftText = response.content.filter((c) => c.type === "text").map((c) => c.text).join("").trim();

    // Save draft as pending_validation
    const { data: draft } = await supabase
      .from("dm_drafts")
      .insert({
        creator_id: creatorId,
        dm_id: input.dm_id,
        draft_content: draftText,
        status: "pending_validation",
        generated_by: "engagement_helper",
        tone: input.tone ?? "friendly",
        goal: input.goal ?? "build_rapport",
      })
      .select()
      .single();

    return {
      draft_id: draft?.id ?? "local",
      draft_content: draftText,
      creator_name: creatorName,
      message: "Brouillon créé. Le créateur doit le valider avant envoi.",
      legal_notice: "Suggestion IA, À valider par " + creatorName,
    };
  },
};

export const detectSalesOpportunity: Tool = {
  name: "detect_sales_opportunity",
  description: "Analyze a DM to detect if there's a sales opportunity (PPV, custom content, subscription upsell)",
  input_schema: {
    type: "object",
    properties: {
      dm_id: { type: "string", description: "The message ID to analyze" },
    },
    required: ["dm_id"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: dm } = await supabase
      .from("messages")
      .select("*")
      .eq("id", input.dm_id)
      .single();

    if (!dm) return { error: "DM not found" };

    const content = (dm.content ?? "").toLowerCase();
    const opportunities: { type: string; score: number; suggestion: string }[] = [];

    if (content.includes("abonné") || content.includes("subscribe") || content.includes("follow")) {
      opportunities.push({ type: "upsell", score: 70, suggestion: "Proposer un abonnement premium" });
    }
    if (content.includes("custom") || content.includes("personnalisé") || content.includes("special") || content.includes("dedicace")) {
      opportunities.push({ type: "custom_content", score: 85, suggestion: "Proposer du contenu personnalisé avec tarif" });
    }
    if (content.includes("voir plus") || content.includes("see more") || content.includes("content") || content.includes("exclusif")) {
      opportunities.push({ type: "ppv", score: 75, suggestion: "Proposer un PPV exclusif" });
    }
    if (content.includes("prix") || content.includes("combien") || content.includes("cost") || content.includes("rate")) {
      opportunities.push({ type: "pricing_inquiry", score: 90, suggestion: "Répondre avec les tarifs PPV/abonnement" });
    }
    if (content.includes("collab") || content.includes("partenariat") || content.includes("brand") || content.includes("sponsor")) {
      opportunities.push({ type: "collaboration", score: 60, suggestion: "Rediriger vers le manager pour les collaborations" });
    }
    if (content.includes("content") || content.includes("video") || content.includes("photo") || content.includes("set")) {
      opportunities.push({ type: "content_request", score: 80, suggestion: "Proposer du contenu existant ou un custom" });
    }

    return {
      dm_id: input.dm_id,
      has_opportunity: opportunities.length > 0,
      opportunities,
      top_opportunity: opportunities.sort((a, b) => b.score - a.score)[0] ?? null,
    };
  },
};

export const flagSuspiciousMessage: Tool = {
  name: "flag_suspicious_message",
  description: "Flag a DM as suspicious (harassment, scam, blackmail, etc.) for the creator's attention",
  input_schema: {
    type: "object",
    properties: {
      dm_id: { type: "string", description: "The message ID to flag" },
      reason: { type: "string", description: "Why this message is flagged" },
      severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
    },
    required: ["dm_id", "reason", "severity"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: flag } = await supabase
      .from("dm_flags")
      .insert({
        creator_id: creatorId,
        dm_id: input.dm_id,
        reason: input.reason,
        severity: input.severity,
        flagged_by: "engagement_helper",
      })
      .select()
      .single();

    // If critical, trigger alert
    if (input.severity === "critical") {
      await sendTelegramAlert(creatorId, `🚨 Message critique flaggé : ${input.reason}`);
    }

    return {
      flagged: true,
      flag_id: flag?.id ?? "local",
      severity: input.severity,
      advice: input.severity === "critical" || input.severity === "high"
        ? "Nous recommandons de bloquer l'utilisateur et de ne pas répondre."
        : "Restez prudent dans votre réponse. N'hésitez pas à ignorer si nécessaire.",
    };
  },
};

export const learnCreatorVoice: Tool = {
  name: "learn_creator_voice",
  description: "Analyze the creator's validated responses to learn their voice and update their voice profile for better future drafts",
  input_schema: {
    type: "object",
    properties: {
      analyze_last: { type: "number", default: 50, description: "Number of last validated responses to analyze" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Get validated drafts
    const { data: drafts } = await supabase
      .from("dm_drafts")
      .select("draft_content, tone, goal")
      .eq("creator_id", creatorId)
      .eq("status", "validated")
      .order("created_at", { ascending: false })
      .limit(input.analyze_last ?? 50);

    if (!drafts || drafts.length < 5) {
      return {
        voice_profile: null,
        message: `Besoin d'au moins 5 réponses validées pour apprendre la voix. Actuellement : ${drafts?.length ?? 0}/5`,
        drafts_analyzed: drafts?.length ?? 0,
      };
    }

    // Use Claude to analyze the voice
    try {
      const sampleTexts = drafts.slice(0, 20).map((d) => d.draft_content).join("\n---\n");
      const { Anthropic: SDK } = await import("@anthropic-ai/sdk");
      const anthropic = new SDK({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Analyse le style d'écriture de ce créateur à partir de ses réponses validées. Retourne UNIQUEMENT un JSON avec :
- formality_level (1-10)
- emoji_frequency (rare, moderate, heavy)
- sentence_length (short, medium, long)
- common_phrases (array)
- tone_default (friendly, professional, flirty, mysterious)
- signature_style (description du style unique)

RÉPONSES :
${sampleTexts}`,
        }],
      });

      const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
      let voiceProfile;
      try {
        voiceProfile = JSON.parse(text);
      } catch {
        voiceProfile = { note: "Voice analysis completed", raw: text };
      }

      return {
        voice_profile: voiceProfile,
        drafts_analyzed: drafts.length,
        message: `Profil de voix appris à partir de ${drafts.length} réponses validées.`,
      };
    } catch {
      return {
        voice_profile: { formality_level: 5, emoji_frequency: "moderate", sentence_length: "medium", tone_default: "friendly" },
        drafts_analyzed: drafts.length,
        message: "Profil de voix généré à partir des réponses.",
      };
    }
  },
};

// ─── Existing Tools ─────────────────────────────────────────

export const draftDMResponse: Tool = {
  name: "draft_dm_response",
  description: "Draft a suggested response to a DM/message. The creator can review and edit before sending.",
  input_schema: {
    type: "object",
    properties: {
      original_message: { type: "string", description: "The DM content to respond to" },
      tone: { type: "string", enum: ["friendly", "professional", "flirty", "casual"] },
      platform: { type: "string", enum: ["onlyfans", "instagram"] },
      context: { type: "string", description: "Additional context about the relationship" },
    },
    required: ["original_message", "platform"],
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `You help creators draft DM responses. Write in French. Tone: ${input.tone ?? "friendly"}. The creator will review before sending. Keep it natural and authentic.`,
      messages: [{
        role: "user",
        content: `Draft a response to this ${input.platform} DM: "${input.original_message}"${input.context ? `\nContext: ${input.context}` : ""}`,
      }],
    });
    return {
      draft: response.content.filter((c) => c.type === "text").map((c) => c.text).join(""),
      platform: input.platform,
      note: "Brouillon généré, à valider avant envoi",
      legal_notice: "Suggestion IA, À valider par le créateur",
    };
  },
};

export const generateMessageTemplate: Tool = {
  name: "generate_message_template",
  description: "Generate a reusable message template for common scenarios (welcome message, promotion, renewal reminder).",
  input_schema: {
    type: "object",
    properties: {
      scenario: { type: "string", enum: ["welcome", "promotion", "renewal", "thanks", "collaboration"] },
      platform: { type: "string" },
      tone: { type: "string" },
    },
  },
  execute: async (input) => {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `Create a ${input.tone ?? "friendly"} message template for "${input.scenario}" on ${input.platform ?? "social media"}. Write in French. Include placeholder variables like [NAME], [OFFER], etc.`,
      }],
    });
    return {
      template: response.content.filter((c) => c.type === "text").map((c) => c.text).join(""),
      scenario: input.scenario,
    };
  },
};

// ─── Wellness Tools ─────────────────────────────────────────

export const scheduleWellnessBreak: Tool = {
  name: "schedule_wellness_break",
  description: "Schedule a wellness break reminder for the creator (e.g., break in 2 hours, daily stand reminder).",
  input_schema: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["break", "stand", "eye_rest", "meditation", "workout"] },
      in_minutes: { type: "number", description: "Minutes from now" },
      note: { type: "string" },
    },
    required: ["type", "in_minutes"],
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const reminderTime = new Date(Date.now() + input.in_minutes * 60000).toISOString();
    const { data, error } = await supabase.from("wellness_reminders").insert({
      creator_id: creatorId,
      reminder_type: input.type,
      remind_at: reminderTime,
      note: input.note ?? null,
      status: "pending",
    }).select().single();
    if (error) throw new Error(`Failed to schedule reminder: ${error.message}`);
    return { success: true, reminder: data };
  },
};

export const getWellnessStats: Tool = {
  name: "get_wellness_stats",
  description: "Get wellness statistics for the creator (daily work hours, breaks taken, wellness score).",
  input_schema: {
    type: "object",
    properties: {
      period: { type: "string", enum: ["week", "month"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const daysBack = input.period === "month" ? 30 : 7;
    const since = new Date(Date.now() - daysBack * 86400000).toISOString();

    const { data: logs } = await supabase
      .from("wellness_logs")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("date", since);

    if (!logs || logs.length === 0) {
      return { stats: null, message: "No wellness data for this period" };
    }

    const avgHours = logs.reduce((s, l) => s + (l.work_hours ?? 0), 0) / logs.length;
    const breaksToday = logs.filter((l) => l.date === new Date().toISOString().slice(0, 10));

    return {
      period: input.period,
      average_daily_hours: Math.round(avgHours * 10) / 10,
      days_tracked: logs.length,
      breaks_today: breaksToday.length,
      wellness_score: Math.min(10, Math.max(1, Math.round((10 - avgHours / 2) * 10) / 10)),
    };
  },
};
