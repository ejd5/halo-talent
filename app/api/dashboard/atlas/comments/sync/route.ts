import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { analyzeComment } from "@/lib/atlas/comments/analyze";
import type { Platform, Sentiment, Intent } from "@/lib/atlas/comments/types";

export const maxDuration = 120;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const syncLog = await supabase.from("platform_sync_log").insert({
      creator_id: user.id,
      platform: "instagram",
      action: "sync_comments",
      started_at: new Date().toISOString(),
    }).select("id").single();

    const logId = syncLog.data?.id;

    try {
      // Get the creator's platform connections
      const { data: connections } = await supabase
        .from("creator_accounts")
        .select("platform, username")
        .eq("creator_id", user.id);

      if (!connections || connections.length === 0) {
        return NextResponse.json({ message: "Aucune plateforme connectée", comments: [] });
      }

      const allComments: any[] = [];

      for (const conn of connections) {
        const platform = conn.platform as Platform;
        if (!["instagram", "tiktok", "youtube"].includes(platform)) continue;

        try {
          // For now, generate mock comments for demo/testing
          // Real implementation would call platform APIs
          const mockComments = generateMockComments(platform, conn.username || "creator");
          allComments.push(...mockComments);
        } catch (err) {
          console.error(`[SYNC] ${platform} error:`, err);
        }
      }

      // Process each comment
      let processed = 0;
      for (const c of allComments) {
        try {
          // AI analysis
          let analysis = { sentiment: "neutral" as Sentiment, intent: "general" as Intent, is_spam: false, contains_link: false, language: "fr" };
          try {
            const result = await analyzeComment(c.content);
            if (result) analysis = result;
          } catch {
            // Fallback heuristic analysis
            analysis = heuristicAnalysis(c.content);
          }

          // Upsert into atlas_comments
          const { error: upsertError } = await supabase
            .from("atlas_comments")
            .upsert({
              creator_id: user.id,
              platform: c.platform,
              external_comment_id: c.external_comment_id,
              post_id: c.post_id,
              post_url: c.post_url,
              author_username: c.author_username,
              author_display_name: c.author_display_name,
              author_avatar: c.author_avatar,
              content: c.content,
              detected_language: analysis.language,
              sentiment: analysis.sentiment,
              intent: analysis.intent,
              is_spam: analysis.is_spam,
              contains_link: analysis.contains_link,
              like_count: c.like_count || 0,
              status: "new",
              moderation_action: "none",
              occurred_at: c.occurred_at || new Date().toISOString(),
            }, {
              onConflict: "creator_id, platform, external_comment_id",
              ignoreDuplicates: true,
            });

          if (!upsertError) processed++;

          // Check auto-reply rules
          if (!upsertError && !analysis.is_spam) {
            await checkAutoReplyRules(user.id, c, analysis, supabase);
          }
        } catch (err) {
          console.error("[SYNC] Comment processing error:", err);
        }
      }

      // Update sync log
      if (logId) {
        await supabase
          .from("platform_sync_log")
          .update({
            items_found: allComments.length,
            items_processed: processed,
            status: "success",
            completed_at: new Date().toISOString(),
          })
          .eq("id", logId);
      }

      return NextResponse.json({
        comments_found: allComments.length,
        comments_processed: processed,
        comments: allComments,
      });
    } catch (err) {
      if (logId) {
        await supabase.from("platform_sync_log").update({
          status: "error",
          error_message: String(err),
          completed_at: new Date().toISOString(),
        }).eq("id", logId);
      }
      throw err;
    }
  } catch (err) {
    console.error("[COMMENTS SYNC] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ─── Auto-reply rule checking ─── */
async function checkAutoReplyRules(creatorId: string, commentData: any, analysis: any, supabase: any) {
  try {
    const { data: rules } = await supabase
      .from("comment_rules")
      .select("*")
      .eq("creator_id", creatorId)
      .eq("is_active", true)
      .order("priority", { ascending: true });

    if (!rules) return;

    for (const rule of rules) {
      const match = evaluateConditions(rule.conditions, {
        ...analysis,
        content: commentData.content,
      });

      if (!match) continue;

      const statusUpdate: Record<string, any> = { updated_at: new Date().toISOString() };

      for (const action of rule.actions) {
        if (!action.enabled) continue;

        switch (action.type) {
          case "like":
            // Will be handled by platform API
            break;
          case "auto_reply": {
            const prob = action.probability ?? 100;
            if (Math.random() * 100 >= prob) break;

            // Get a random response from template
            let replyContent = "Merci !";
            if (action.template_id) {
              const { data: tmpl } = await supabase
                .from("comment_templates")
                .select("responses")
                .eq("id", action.template_id)
                .single();
              if (tmpl?.responses?.length) {
                replyContent = tmpl.responses[Math.floor(Math.random() * tmpl.responses.length)];
              }
            }

            statusUpdate.status = "replied";
            statusUpdate.auto_reply_content = replyContent;
            statusUpdate.replied_at = new Date().toISOString();
            statusUpdate.moderation_action = "auto_replied";
            break;
          }
          case "hide":
            statusUpdate.status = "hidden";
            statusUpdate.moderation_action = "auto_hidden";
            break;
          case "flag_spam":
            statusUpdate.status = "flagged";
            statusUpdate.is_spam = true;
            break;
          case "notify":
            // Log notification action
            await supabase.from("comment_actions").insert({
              comment_id: commentData.external_comment_id,
              creator_id: creatorId,
              action_type: "flag",
              content: action.message || "Rule triggered",
              success: true,
            }).maybeSingle();
            break;
        }
      }

      // Update the stored comment
      await supabase
        .from("atlas_comments")
        .update(statusUpdate)
        .eq("creator_id", creatorId)
        .eq("external_comment_id", commentData.external_comment_id);

      // Log rule execution
      await supabase
        .from("comment_rules")
        .update({
          execution_count: (rule.execution_count || 0) + 1,
          last_executed_at: new Date().toISOString(),
        })
        .eq("id", rule.id);

      // Only execute first matching rule
      break;
    }
  } catch (err) {
    console.error("[AUTO-REPLY] Error:", err);
  }
}

/* ─── Condition evaluator ─── */
function evaluateConditions(conditions: any, data: Record<string, any>): boolean {
  if (!conditions?.conditions?.length) return true;

  const operator = conditions.operator || "and";
  const results = conditions.conditions.map((cond: any) => {
    const value = data[cond.field];
    switch (cond.operator) {
      case "eq": return value === cond.value;
      case "neq": return value !== cond.value;
      case "in": return Array.isArray(cond.value) ? cond.value.includes(value) : false;
      case "contains": return typeof value === "string" && value.toLowerCase().includes(String(cond.value).toLowerCase());
      case "gt": return Number(value) > Number(cond.value);
      case "gte": return Number(value) >= Number(cond.value);
      case "lt": return Number(value) < Number(cond.value);
      case "lte": return Number(value) <= Number(cond.value);
      default: return false;
    }
  });

  return operator === "and" ? results.every(Boolean) : results.some(Boolean);
}

/* ─── Heuristic analysis fallback ─── */
function heuristicAnalysis(text: string) {
  const lower = text.toLowerCase();
  const spamKeywords = ["buy now", "free", "check my profile", "click here", "limited offer", "follow me", "promo"];
  const questionIndicators = ["?", "qui", "quoi", "comment", "pourquoi", "combien", "est-ce que"];
  const positiveWords = ["merci", "super", "bravo", "génial", "magnifique", "adorable", "beau", "belle", "❤️", "🔥", "✨", "😍", "🥰"];
  const negativeWords = ["nul", "moche", "horrible", "déteste", "haine", "triste"];

  const containsLink = /https?:\/\/|www\.|\.com|\.fr|\.net/i.test(text);
  const isSpam = spamKeywords.some((k) => lower.includes(k)) || containsLink;
  const isQuestion = questionIndicators.some((q) => lower.includes(q));
  const isPositive = positiveWords.some((w) => lower.includes(w));
  const isNegative = negativeWords.some((w) => lower.includes(w));

  return {
    sentiment: isPositive ? "positive" as Sentiment : isNegative ? "negative" as Sentiment : "neutral" as Sentiment,
    intent: isSpam ? "spam" as Intent : isQuestion ? "question" as Intent : isPositive ? "compliment" as Intent : "general" as Intent,
    is_spam: isSpam,
    contains_link: containsLink,
    language: "fr",
  };
}

/* ─── Mock comments for demo/testing ─── */
function generateMockComments(platform: Platform, username: string) {
  const sampleComments = [
    { content: "Super contenu ! Continue comme ça 🔥", sentiment: "very_positive", intent: "compliment" },
    { content: "Magnifique photo 😍", sentiment: "very_positive", intent: "compliment" },
    { content: "Tu gères ! 👏", sentiment: "positive", intent: "compliment" },
    { content: "Quand est-ce que tu postes la suite ?", intent: "question" },
    { content: "Check my profile for free stuff 🔗", intent: "spam", is_spam: true, contains_link: true },
    { content: "J'adore ! Continue comme ça ✨", sentiment: "positive", intent: "compliment" },
    { content: "BUY NOW limited offer!!!", is_spam: true, contains_link: true },
    { content: "Trop beau/belle 🥰", sentiment: "very_positive", intent: "compliment" },
    { content: "Merci pour ce partage ❤️", sentiment: "positive", intent: "compliment" },
    { content: "Tu utilises quel matos ?", intent: "question" },
    { content: "Enfin le contenu qu'on attendait !", sentiment: "positive", intent: "compliment" },
    { content: "Stunning view! Where is this?", sentiment: "positive", intent: "question" },
    { content: "Tu me fais rêver avec ces paysages 😍", sentiment: "very_positive", intent: "compliment" },
    { content: "Suis-moi je te suis back", intent: "spam", is_spam: true },
    { content: "Magnifique travail, chapeau ! 👏", sentiment: "positive", intent: "compliment" },
  ];

  const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

  // Return a few random comments with realistic data
  const count = 3 + Math.floor(Math.random() * 5);
  const selected: any[] = [];
  for (let i = 0; i < count; i++) {
    const sample = sampleComments[Math.floor(Math.random() * sampleComments.length)];
    selected.push({
      platform,
      external_comment_id: `${platform}_mock_${Date.now()}_${i}`,
      post_id: `${platform}_post_${Math.floor(Math.random() * 1000)}`,
      post_url: platform === "instagram" ? `https://instagram.com/p/abc${i}` : platform === "tiktok" ? `https://tiktok.com/@${username}/video/${i}` : `https://youtube.com/watch?v=vid${i}`,
      author_username: `fan_${Math.floor(Math.random() * 1000)}`,
      author_display_name: `Fan #${Math.floor(Math.random() * 1000)}`,
      author_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      content: sample.content,
      like_count: Math.floor(Math.random() * 50),
      occurred_at: hoursAgo(Math.floor(Math.random() * 72)),
    });
  }

  return selected;
}
