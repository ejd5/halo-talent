import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════
// POST: Generate AI drafts for a fan conversation
// Uses Anthropic SDK for intelligent drafting
// ═══════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { fanId, goal } = await request.json();
    if (!fanId) {
      return NextResponse.json({ error: "fanId requis" }, { status: 400 });
    }

    // Fetch fan
    const { data: fan } = await supabase
      .from("atlas_fans")
      .select("*")
      .eq("id", fanId)
      .eq("creator_id", user.id)
      .single();

    if (!fan) {
      return NextResponse.json({ error: "Fan introuvable" }, { status: 404 });
    }

    // Fetch recent interactions
    const { data: history } = await supabase
      .from("atlas_interactions")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(20);

    // Fetch creator profile for style context
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, display_name, bio")
      .eq("id", user.id)
      .single();

    const creatorName = profile?.full_name || profile?.display_name || "Le créateur";
    const recentMessages = (history ?? []).slice(0, 5).map((i: any) =>
      `${i.direction === "inbound" ? "👤 Fan" : "✨ " + creatorName} : ${i.content}`
    ).join("\n");

    // Build the prompt
    const prompt = `Tu génères 3 suggestions de réponse pour un créateur de contenu qui parle à un fan.

⚠️ RÈGLES STRICTES (impératives) :
1. Ce sont des SUGGESTIONS — le créateur les valide avant envoi.
2. JAMAIS de promesses irréalistes (rencontre IRL, sentiments, exclusivité).
3. JAMAIS de contenu explicite.
4. Max 1 mention discrète d'un produit.
5. Reste naturel et authentique.

FAN :
- Nom : ${fan.display_name || fan.email || "Inconnu"}
- Tier : ${fan.fan_tier} (score: ${fan.fan_score}/100)
- Dépenses totales : ${fan.total_spent}€
- Langue : ${fan.language || "fr"}
- Pays : ${fan.country || "Inconnu"}

HISTORIQUE RÉCENT (du plus récent au plus ancien) :
${recentMessages || "(aucun historique récent)"}

CRÉATEUR : ${creatorName}

OBJECTIF : ${goal || "Répondre naturellement et engager la conversation"}

Génère 3 drafts avec 3 approches différentes :
1. Chaleureuse/empathique
2. Joueuse/curieuse
3. Directe/efficace

RÉPONSE EN JSON UNIQUEMENT (pas de texte avant/après) :
{
  "drafts": [
    {
      "approach": "chaleureuse",
      "text": "...",
      "estimated_engagement": 85,
      "warning": null
    },
    ...
  ]
}`;

    let drafts: { approach: string; text: string; estimated_engagement: number; warning: string | null }[] = [];

    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY });

      // Use DeepSeek-compatible endpoint since that's the configured API key
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: "Tu es un assistant de drafting pour créateurs de contenu. Réponds UNIQUEMENT en JSON valide.",
        messages: [{ role: "user", content: prompt }],
      });

      const content = (response.content[0] as any).text;
      const parsed = JSON.parse(content);
      drafts = parsed.drafts || [];
    } catch (aiError) {
      console.error("[ATLAS DRAFT AI] Error:", aiError);
      // Fallback: generate template-based drafts
      drafts = generateFallbackDrafts(fan, history || [], goal || "Répondre");
    }

    // Save drafts to database
    const savedDrafts = [];
    for (const draft of drafts) {
      const { data } = await supabase
        .from("atlas_drafts")
        .insert({
          creator_id: user.id,
          fan_id: fanId,
          platform: "dm",
          channel: "dm",
          draft_text: draft.text,
          content: draft.text,
          approach: draft.approach,
          estimated_engagement: draft.estimated_engagement,
          ai_warning: draft.warning,
          status: "pending_validation",
          generator_prompt: prompt,
          original_content: draft.text,
        })
        .select()
        .single();

      if (data) savedDrafts.push(data);
    }

    // Audit log
    await supabase.from("atlas_audit_log").insert({
      creator_id: user.id,
      action: "draft_generated",
      entity_type: "fan",
      entity_id: fanId,
      metadata: { count: drafts.length, goal },
    });

    return NextResponse.json({ drafts: savedDrafts });
  } catch (err) {
    console.error("[ATLAS DRAFT GEN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── Fallback drafts when AI is unavailable ────────────────

function generateFallbackDrafts(fan: any, _history: any[], goal: string) {
  const name = fan.display_name || fan.email || "there";
  const tier = fan.fan_tier || "engaged";

  const templates: Record<string, { approach: string; text: string }[]> = {
    chaleureuse: [
      {
        approach: "chaleureuse",
        text: `Hey ${name}! 💫 Toujours un plaisir de te lire. Dis-moi si tu as besoin de quoi que ce soit, je suis là pour toi ✨`,
      },
      {
        approach: "joueuse",
        text: `Ahh ${name}! 🔥 Tu tombes bien, je préparais justement quelque chose de spécial. Ça te dit un avant-goût ? 😏`,
      },
      {
        approach: "directe",
        text: `Hey ${name} ! Merci pour ton message. J'adore échanger avec toi. Au fait, j'ai sorti un nouveau contenu qui va te plaire 👀`,
      },
    ],
  };

  if (tier === "whale" || tier === "vip") {
    templates.chaleureuse[0].text = `Hey ${name}! ✨ Toujours aussi génial de te voir ici. Tu sais que t'es dans le top de ma communauté ? 💎 Dis-moi tout !`;
    templates.directe = [{
      approach: "directe",
      text: `${name}! 💎 Content de te voir. J'ai quelque chose d'exclusif pour les membres de ton niveau, ça t'intéresse ?`,
    }];
  }

  if (goal.toLowerCase().includes("reengage") || goal.toLowerCase().includes("relance")) {
    return [
      {
        approach: "chaleureuse",
        text: `Hey ${name}! 👋 Ça faisait longtemps ! J'espère que tout va bien de ton côté. J'ai pensé à toi et je voulais prendre des nouvelles 💫`,
        estimated_engagement: 75,
        warning: null,
      },
      {
        approach: "joueuse",
        text: `${name}! 🎯 Je me demandais justement quand tu allais repasser par ici... J'ai un petit truc qui pourrait t'intéresser 😉`,
        estimated_engagement: 65,
        warning: null,
      },
      {
        approach: "directe",
        text: `Salut ${name}, ça fait un bail ! J'ai lancé pas mal de nouveaux contenus depuis. Viens jeter un œil quand tu as un moment 🔥`,
        estimated_engagement: 60,
        warning: null,
      },
    ];
  }

  return templates.chaleureuse.map((t) => ({
    ...t,
    estimated_engagement: 70,
    warning: null,
  }));
}

// PATCH: Approve, edit, or reject a draft
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { draftId, action, editedText } = await request.json();
    if (!draftId || !action) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const update: Record<string, any> = {};
    let auditAction = "";

    switch (action) {
      case "approve":
      case "send":
        update.status = "sent";
        update.sent_at = new Date().toISOString();
        update.sent_via = "copy_paste";
        auditAction = "draft_sent";
        break;
      case "edit":
        update.status = "edited";
        update.edited_text = editedText;
        auditAction = "draft_edited";
        break;
      case "reject":
        update.status = "rejected";
        update.validated_at = new Date().toISOString();
        auditAction = "draft_rejected";
        break;
      default:
        return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const { data } = await supabase
      .from("atlas_drafts")
      .update(update)
      .eq("id", draftId)
      .eq("creator_id", user.id)
      .select()
      .single();

    if (!data) {
      return NextResponse.json({ error: "Brouillon introuvable" }, { status: 404 });
    }

    // Audit log
    await supabase.from("atlas_audit_log").insert({
      creator_id: user.id,
      action: auditAction,
      entity_type: "draft",
      entity_id: draftId,
      metadata: { editedText: editedText || null },
    });

    return NextResponse.json({ draft: data });
  } catch (err) {
    console.error("[ATLAS DRAFT PATCH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
