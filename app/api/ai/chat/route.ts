import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import "server-only";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { messages, conversationId } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Messages requis" },
      { status: 400 }
    );
  }

  try {
    // Récupérer le contexte du créateur depuis Supabase
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: accounts } = await supabase
      .from("creator_accounts")
      .select("*")
      .eq("creator_id", user.id);

    const { data: revenues } = await supabase
      .from("monthly_revenues")
      .select("*")
      .eq("creator_id", user.id)
      .order("month", { ascending: false })
      .limit(6);

    const totalFollowers =
      accounts?.reduce((sum, a) => sum + (a.followers || 0), 0) || 0;
    const activePlatforms =
      accounts?.map((a) => a.platform).join(", ") || "aucune";

    const systemPrompt = `Tu es l'assistant IA personnel de ${profile?.display_name || profile?.full_name || "ce créateur"}${profile?.department ? `, créateur dans le département ${profile.department}` : ""} de notre maison de management créatif.

CONTEXTE DU CRÉATEUR :
- Plateformes actives : ${activePlatforms}
- Revenus 6 derniers mois : ${JSON.stringify(revenues || [])}
- Total followers tous réseaux : ${totalFollowers}

TON RÔLE :
1. Conseiller le créateur sur sa stratégie de contenu et marketing
2. Analyser ses données et proposer des optimisations
3. Aider à la planification de campagnes
4. Donner des insights sur les tendances du secteur
5. Suggérer des prix, des formats de contenu, des collaborations

LIMITES STRICTES :
- NE JAMAIS écrire à la place du créateur des messages destinés à ses fans
- NE JAMAIS rédiger de contenu suggestif ou explicite
- Toujours suggérer, jamais imposer
- Si le créateur demande de l'aide pour répondre à un fan, suggère une APPROCHE pas un texte exact
- Si la question dépasse tes compétences, recommande de contacter le manager humain

TON STYLE :
- Empathique, encourageant, professionnel
- Concis (jamais plus de 3 paragraphes par réponse)
- Toujours actionnable (qu'est-ce que le créateur peut FAIRE concrètement)
- Utilise des exemples concrets quand pertinent
- Réponds dans la langue du créateur (par défaut français)

VALEURS DE LA MAISON :
- Transparence
- Souveraineté du créateur
- Croissance saine et durable (pas burnout)
- Respect de l'image et de la vie privée`;

    // Appel à l'API DeepSeek (compatible OpenAI)
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: 1500,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Clé API DeepSeek invalide." },
          { status: 500 }
        );
      }
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Trop de requêtes. Veuillez réessayer dans quelques instants.",
          },
          { status: 429 }
        );
      }
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage =
      data.choices?.[0]?.message?.content || "";

    let newConversationId = conversationId;

    // Sauvegarder la conversation en base
    if (conversationId) {
      const updatedMessages = [
        ...messages,
        { role: "assistant", content: assistantMessage },
      ];
      await supabase
        .from("ai_conversations")
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    } else {
      const { data: newConv } = await supabase
        .from("ai_conversations")
        .insert({
          creator_id: user.id,
          topic: (messages[0]?.content || "").slice(0, 100),
          messages: [
            ...messages,
            { role: "assistant", content: assistantMessage },
          ],
        })
        .select("id")
        .single();

      newConversationId = newConv?.id;
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationId: newConversationId,
    });
  } catch (error: any) {
    console.error("Erreur API DeepSeek:", error);

    return NextResponse.json(
      { error: "Erreur lors de la génération de la réponse." },
      { status: 500 }
    );
  }
}
