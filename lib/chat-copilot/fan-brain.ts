// ─── Fan Brain — Orchestrator ─────────────────────────────
// Loads, updates, analyzes, and exports the FanBrain knowledge graph.
// Every fan has a brain row (auto-created via DB trigger on atlas_fans insert).

import { createClient } from "@/lib/supabase/server";
import type {
  FanBrain,
  FanBrainPersonality,
  FanBrainConversation,
  FanBrainRisk,
  BrainSegment,
  AnalysisResult,
  BrainContextSummary,
  AnalyzeBody,
} from "./types";

export class FanBrainService {
  private fanId: string;
  private creatorId: string;

  constructor(fanId: string, creatorId: string) {
    this.fanId = fanId;
    this.creatorId = creatorId;
  }

  // ── Load full brain (fan_brains + atlas_fans aggregates) ──

  async load(): Promise<FanBrain> {
    const supabase = await createClient();

    // Fetch the brain row
    const { data: brain, error } = await supabase
      .from("fan_brains")
      .select("*")
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId)
      .single();

    if (error || !brain) {
      throw new Error(
        error?.message === "Row not found"
          ? "Fan brain not found. Ensure the fan exists."
          : error?.message || "Failed to load fan brain",
      );
    }

    return this.mapRowToBrain(brain);
  }

  // ── Update a specific brain segment ──

  async update(segment: BrainSegment, data: Record<string, unknown>): Promise<void> {
    const supabase = await createClient();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (segment === "personality") {
      update.personality = {
        ...(data as Partial<FanBrainPersonality>),
      };
    } else if (segment === "conversation") {
      update.conversation = {
        ...(data as Partial<FanBrainConversation>),
      };
    } else if (segment === "risk") {
      const risk = data as Partial<FanBrainRisk>;
      if (risk.churn_score !== undefined) update.churn_score = risk.churn_score;
      if (risk.days_since_last_message !== undefined) update.days_since_last_message = risk.days_since_last_message;
      if (risk.days_since_last_purchase !== undefined) update.days_since_last_purchase = risk.days_since_last_purchase;
      if (risk.engagement_trend !== undefined) update.engagement_trend = risk.engagement_trend;
    } else if (segment === "tags") {
      update.tags = data;
    } else if (segment === "profile") {
      const profile = data as Record<string, unknown>;
      if (profile.custom_name !== undefined) update.custom_name = profile.custom_name;
      if (profile.language_detected !== undefined) update.language_detected = profile.language_detected;
      if (profile.timezone_estimate !== undefined) update.timezone_estimate = profile.timezone_estimate;
    } else if (segment === "financial") {
      const fin = data as Record<string, unknown>;
      if (fin.ltv_predicted !== undefined) update.ltv_predicted = fin.ltv_predicted;
      if (fin.segment !== undefined) update.segment = fin.segment;
      if (fin.tip_history !== undefined) update.tip_history = fin.tip_history;
      if (fin.average_ppv_price !== undefined) update.average_ppv_price = fin.average_ppv_price;
      if (fin.subscription_months !== undefined) update.subscription_months = fin.subscription_months;
    }

    update.last_brain_update = new Date().toISOString();

    const { error } = await supabase
      .from("fan_brains")
      .update(update)
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId);

    if (error) throw new Error(`Failed to update brain: ${error.message}`);
  }

  // ── AI-powered conversation analysis ──

  async analyzeConversation(body: AnalyzeBody): Promise<AnalysisResult> {
    const supabase = await createClient();

    // Load current brain for context
    const brain = await this.load();

    // Build the analysis prompt
    const prompt = this.buildAnalysisPrompt(brain, body.messages);

    // Call the AI (reuse existing DeepSeek or Claude infra)
    const analysis = await this.callAiForAnalysis(prompt);

    // Apply detected changes
    const diff: AnalysisResult["diff"] = {
      personality_changes: null,
      conversation_updates: null,
      risk_update: null,
      new_tags: [],
      new_topics: [],
    };

    // Update personality if the AI detected changes
    if (analysis.personality) {
      const mergedPersonality = {
        ...brain.personality,
        ...analysis.personality,
      };
      await this.update("personality", mergedPersonality);
      diff.personality_changes = analysis.personality;
    }

    // Update conversation state
    if (analysis.conversation) {
      const mergedConversation = {
        ...brain.conversation,
        ...analysis.conversation,
        total_messages: brain.conversation.total_messages + body.messages.length,
        topics_discussed: [
          ...new Set([
            ...brain.conversation.topics_discussed,
            ...(analysis.conversation.new_topics || []),
          ]),
        ],
      };
      await this.update("conversation", mergedConversation);
      diff.conversation_updates = analysis.conversation;
      diff.new_topics = analysis.conversation.new_topics || [];
    }

    // Update risk
    if (analysis.risk) {
      await this.update("risk", analysis.risk);
      diff.risk_update = analysis.risk;
    }

    // Update tags
    if (analysis.new_tags && analysis.new_tags.length > 0) {
      const mergedTags = [...new Set([...brain.tags, ...analysis.new_tags])];
      await this.update("tags", mergedTags as unknown as Record<string, unknown>);
      diff.new_tags = analysis.new_tags;
    }

    return {
      diff,
      summary: analysis.summary || "Analyse terminée.",
    };
  }

  // ── Get context summary for AI drafter prompts ──

  async getContextSummary(): Promise<BrainContextSummary> {
    const brain = await this.load();
    const recentMemories = await this.getRecentMemories();

    return {
      fan_name: brain.custom_name || `Fan #${brain.fan_id.slice(0, 8)}`,
      segment: brain.segment,
      communication_style: brain.personality.communication_style,
      interests: brain.personality.interests,
      triggers_positive: brain.personality.triggers_positive,
      triggers_negative: brain.personality.triggers_negative,
      preferred_content_type: brain.personality.preferred_content_type,
      preferred_tone: brain.personality.preferred_tone,
      sentiment_trend: brain.conversation.sentiment_trend,
      churn_risk: brain.risk.churn_score,
      last_topic:
        brain.conversation.topics_discussed[
          brain.conversation.topics_discussed.length - 1
        ] || "",
      open_threads: brain.conversation.open_threads,
      notes_manuelles: brain.personality.notes_manuelles,
      recent_memories: recentMemories,
    };
  }

  // ── Export full brain as JSON ──

  async export(): Promise<FanBrain & { raw: Record<string, unknown> }> {
    const supabase = await createClient();

    const { data: brain, error } = await supabase
      .from("fan_brains")
      .select("*")
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId)
      .single();

    if (error || !brain) {
      throw new Error("Fan brain not found");
    }

    return {
      ...this.mapRowToBrain(brain),
      raw: brain,
    };
  }

  // ── Add manual note ──

  async addNote(content: string): Promise<void> {
    const brain = await this.load();
    const existingNotes = brain.personality.notes_manuelles;
    const timestamp = new Date().toLocaleString("fr-FR");
    const updatedNotes = existingNotes
      ? `${existingNotes}\n[${timestamp}] ${content}`
      : `[${timestamp}] ${content}`;

    await this.update("personality", {
      ...brain.personality,
      notes_manuelles: updatedNotes,
    } as unknown as Record<string, unknown>);
  }

  // ── Private helpers ──

  private mapRowToBrain(row: Record<string, unknown>): FanBrain {
    const personality = (row.personality as FanBrainPersonality) || {
      communication_style: "casual",
      interests: [],
      triggers_positive: [],
      triggers_negative: [],
      preferred_content_type: "photo",
      preferred_tone: "",
      notes_manuelles: "",
    };

    const conversation = (row.conversation as FanBrainConversation) || {
      total_messages: 0,
      topics_discussed: [],
      last_messages_summary: "",
      sentiment_trend: "neutral",
      open_threads: [],
      best_performing_messages: [],
    };

    return {
      fan_id: row.fan_id as string,
      creator_id: row.creator_id as string,
      custom_name: row.custom_name as string | null,
      language_detected: (row.language_detected as string) || "fr",
      timezone_estimate: row.timezone_estimate as string | null,
      ltv_predicted: Number(row.ltv_predicted) || 0,
      segment: (row.segment as FanBrain["segment"]) || "regular",
      tip_history: (row.tip_history as number[]) || [],
      average_ppv_price: Number(row.average_ppv_price) || 0,
      subscription_months: Number(row.subscription_months) || 0,
      personality,
      conversation,
      risk: {
        churn_score: Number(row.churn_score) || 0,
        days_since_last_message: Number(row.days_since_last_message) || 0,
        days_since_last_purchase: Number(row.days_since_last_purchase) || 0,
        engagement_trend: (row.engagement_trend as FanBrain["risk"]["engagement_trend"]) || "stable",
      },
      tags: (row.tags as string[]) || [],
      last_brain_update: (row.last_brain_update as string) || null,
      last_analysis_at: (row.last_analysis_at as string) || null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  private async getRecentMemories(): Promise<string[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("fan_memory_embeddings")
      .select("content")
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId)
      .order("created_at", { ascending: false })
      .limit(5);

    return (data || []).map((m: { content: string }) => m.content);
  }

  private buildAnalysisPrompt(
    brain: FanBrain,
    messages: { role: string; content: string }[],
  ): string {
    const conversation = messages
      .map((m) => `[${m.role === "fan" ? "FAN" : "CREATOR"}] ${m.content}`)
      .join("\n");

    return [
      "Tu es un assistant d'analyse de profil fan pour Halo Talent.",
      "Analyse la conversation suivante et détecte :",
      "- Communication style (flirty/friendly/shy/demanding/casual)",
      "- Intérêts mentionnés",
      "- Triggers positifs (ce qui a suscité une réaction positive)",
      "- Triggers négatifs (ce qui a refroidi la conversation)",
      "- Type de contenu préféré",
      "- Nouveaux sujets de discussion",
      "- Sentiment (positive/neutral/declining)",
      "- Risque de churn (0-100)",
      "- Tags suggérés",
      "- Résumé court de la conversation",
      "",
      "Contexte actuel du fan :",
      `  Style: ${brain.personality.communication_style}`,
      `  Intérêts connus: ${brain.personality.interests.join(", ") || "aucun"}`,
      `  Score de risque actuel: ${brain.risk.churn_score}/100`,
      `  Dernier résumé: ${brain.conversation.last_messages_summary || "aucun"}`,
      "",
      "Conversation :",
      conversation,
    ].join("\n");
  }

  private async callAiForAnalysis(prompt: string): Promise<{
    personality?: Partial<FanBrainPersonality>;
    conversation?: Partial<FanBrainConversation> & { new_topics?: string[] };
    risk?: Partial<FanBrainRisk>;
    new_tags?: string[];
    summary?: string;
  }> {
    // Use the existing DeepSeek AI chat endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        systemPrompt: `Tu es un assistant d'analyse de profil fan. Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte avant/après) contenant ces champs optionnels :
{
  "personality": { "communication_style": "...", "interests": [...], "triggers_positive": [...], "triggers_negative": [...], "preferred_content_type": "...", "preferred_tone": "..." },
  "conversation": { "last_messages_summary": "...", "sentiment_trend": "...", "open_threads": [...], "best_performing_messages": [...], "new_topics": [...] },
  "risk": { "churn_score": 0, "engagement_trend": "..." },
  "new_tags": [...],
  "summary": "..."
}
Ne modifie que les champs pertinents. N'inclus PAS les clés inchangées.`,
      }),
    });

    if (!response.ok) {
      return { summary: "Échec de l'analyse IA." };
    }

    const data = await response.json();
    // The AI chat endpoint returns { message: "..." }
    const aiText = data.message || "";
    try {
      const parsed = JSON.parse(aiText);
      return parsed;
    } catch {
      return { summary: "Impossible de parser la réponse IA." };
    }
  }
}
