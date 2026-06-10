// ─── Suggestion Engine — builds AI prompts and parses responses ──
// For generating QuickReplies, SuggestedActions, and ContextualAlerts

import type {
  FanBrain,
  QuickReply,
  SuggestedAction,
  ContextualAlert,
  SuggestionSet,
} from "./types";

// ─── Build system prompt for suggestion generation ──

export function buildSuggestionPrompt(
  fanBrain: FanBrain,
  messages: { role: string; content: string }[],
  creatorDNA: string | null,
): string {
  const recentMessages = messages
    .slice(-20)
    .map((m) => `[${m.role === "fan" ? "FAN" : "MOI"}] ${m.content}`)
    .join("\n");

  const now = new Date();
  const hour = now.getHours();
  const day = now.toLocaleDateString("fr-FR", { weekday: "long" });

  return [
    "Tu es un assistant de messagerie pour créateur de contenu. Génère des suggestions de réponse et d'action pour aider le créateur à mieux communiquer avec ses fans.",
    "",
    "═══ CONTEXTE FAN (Fan Brain) ═══",
    `Nom: ${fanBrain.custom_name || fanBrain.fan_id.slice(0, 8)}`,
    `Segment: ${fanBrain.segment}`,
    `Style communication: ${fanBrain.personality.communication_style}`,
    `Intérêts: ${fanBrain.personality.interests.join(", ") || "aucun"}`,
    `Triggers positifs: ${fanBrain.personality.triggers_positive.join(", ") || "aucun"}`,
    `Triggers négatifs: ${fanBrain.personality.triggers_negative.join(", ") || "aucun"}`,
    `Type contenu préféré: ${fanBrain.personality.preferred_content_type}`,
    `Ton préféré: ${fanBrain.personality.preferred_tone}`,
    `Score churn: ${fanBrain.risk.churn_score}/100`,
    `Dernier résumé: ${fanBrain.conversation.last_messages_summary || "aucun"}`,
    `Sujets abordés: ${fanBrain.conversation.topics_discussed.join(", ") || "aucun"}`,
    `Sentiment: ${fanBrain.conversation.sentiment_trend}`,
    `Jours sans message: ${fanBrain.risk.days_since_last_message}`,
    `Jours sans achat: ${fanBrain.risk.days_since_last_purchase}`,
    `LTV prédite: ${fanBrain.ltv_predicted}€`,
    "",
    creatorDNA ? `═══ ADN CRÉATEUR ═══\n${creatorDNA}\n` : "",
    `═══ CONTEXTE TEMPOREL ═══`,
    `Jour: ${day}`,
    `Heure: ${hour}h`,
    hour >= 7 && hour < 12 ? "Matinée — ton frais et énergique" : "",
    hour >= 12 && hour < 18 ? "Après-midi — ton décontracté" : "",
    hour >= 18 && hour < 22 ? "Soirée — ton plus intime et cozy" : "",
    hour >= 22 || hour < 7 ? "Nuit — ton doux et discret" : "",
    "",
    "═══ DERNIERS MESSAGES ═══",
    recentMessages || "Aucun message récent",
    "",
    "═══ INSTRUCTIONS ═══",
    "Génère UNIQUEMENT un objet JSON valide (pas de markdown, pas de texte avant/après) avec ces 3 tableaux :",
    "",
    "1. quickReplies — 3 réponses possibles que le créateur pourrait envoyer AU FAN.",
    "   - Chaque réponse doit être DANS LE STYLE DU CRÉATEUR (naturelle, comme un message texte)",
    "   - Adaptée à la personnalité du fan et au contexte de la conversation",
    "   - Si le fan est flirty → réponses flirt mais PAS trop explicites",
    "   - Si le fan est froid ou distant → réponses qui rassurent et réengagent",
    "   - Toujours respecter les tabous et limites du créateur",
    "   - Ne JAMAIS promettre de contenu gratuit non sollicité",
    "   - Format: { \"quickReplies\": [{ \"id\": \"qr-1\", \"text\": \"...\", \"reasoning\": \"pourquoi cette réponse\" }] }",
    "",
    "2. suggestedActions — 0-2 actions pertinentes pour ce fan (vide si aucune action pertinente) :",
    "   - ppv: \"Proposer un PPV\" — si le fan achète régulièrement, suggérer un contenu avec prix adapté",
    "   - re_engage: \"Relancer\" — si fan inactif >5 jours, message de relance",
    "   - free_preview: \"Offrir un aperçu\" — si fan n'a jamais acheté, teaser gratuit",
    "   - upsell: \"Upsell\" — si fan achète des petits PPV, suggérer contenu plus haut de gamme",
    "   - churn_warning: \"Attention churn\" — si score churn >50 ou intention de résiliation",
    "   - Format: { \"suggestedActions\": [{ \"id\": \"act-1\", \"type\": \"ppv\", \"icon\": \"💰\", \"title\": \"Proposer un PPV\", \"description\": \"...\", \"draftedMessage\": \"message pré-rédigé...\" }] }",
    "",
    "3. alerts — 0-3 alertes contextuelles pertinentes :",
    "   - vip: Fan à fort potentiel",
    "   - churn: Risque de perte",
    "   - timing: Heure optimale pour certains types de contenu",
    "   - taboo: Le fan a demandé quelque chose qui dépasse les limites",
    "   - Format: { \"alerts\": [{ \"id\": \"alert-1\", \"type\": \"vip\", \"level\": \"info\", \"message\": \"...\", \"detail\": \"...\" }] }",
    "",
    "RÈGLES STRICTES :",
    "- Les réponses doivent sembler HUMAINES et naturelles, pas génériques",
    "- N'inclus PAS les instructions dans ta réponse, seulement le JSON",
    "- Si aucune suggestion pertinente, retourne un tableau vide",
    "- Respecte le style unique du créateur",
    "- Ne propose JAMAIS d'envoyer du contenu automatiquement",
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Parse AI response into SuggestionSet ──

export function parseSuggestionResponse(raw: string): SuggestionSet | null {
  try {
    const parsed = JSON.parse(raw);
    return {
      quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
      suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : [],
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
    };
  } catch {
    return null;
  }
}

// ─── Mock fallback suggestions for development ──

export function getMockSuggestions(): SuggestionSet {
  return {
    quickReplies: [
      {
        id: "qr-1",
        text: "Coucou ! J'allais justement t'écrire, tu me lis dans les pensées 😏",
        reasoning: "Réponse légère et flirty adaptée à un fan qui engage",
      },
      {
        id: "qr-2",
        text: "Hmm je prépare quelque chose de spécial... Tu veux un aperçu ? 🔥",
        reasoning: "Crée du mystère et suscite l'intérêt pour du contenu à venir",
      },
      {
        id: "qr-3",
        text: "Je suis en mode chill mais pour toi je peux faire une exception 💕",
        reasoning: "Mix de décontraction et d'attention personnalisée",
      },
    ],
    suggestedActions: [
      {
        id: "act-1",
        type: "ppv",
        icon: "💰",
        title: "Proposer un PPV",
        description: "Ce fan achète régulièrement des vidéos. Propose-lui ta dernière création.",
        draftedMessage:
          "J'ai quelque chose qui va te plaire 😏 Un contenu tout frais que j'ai préparé spécialement... ça te dit d'être le premier à le voir ?",
      },
    ],
    alerts: [
      {
        id: "alert-1",
        type: "timing",
        level: "info",
        message:
          "Ce fan est plus actif en soirée (19h-22h) — c'est le bon moment pour lui envoyer du contenu exclusif",
      },
    ],
  };
}

// ─── Generate mock suggestions based on fan context ──
// Returns varied suggestions depending on segment + risk

export function getContextualMockSuggestions(
  fanBrain: FanBrain,
): SuggestionSet {
  const segment = fanBrain.segment;
  const churnScore = fanBrain.risk.churn_score;
  const daysSinceMessage = fanBrain.risk.days_since_last_message;
  const sentiment = fanBrain.conversation.sentiment_trend;

  const suggestions: SuggestionSet = {
    quickReplies: [],
    suggestedActions: [],
    alerts: [],
  };

  // Quick replies based on sentiment
  if (sentiment === "positive") {
    suggestions.quickReplies = [
      { id: "qr-1", text: "Trop contente que ça te plaise ! J'ai d'autres surprises en stock 😘", reasoning: "Renforce la relation positive" },
      { id: "qr-2", text: "Tu vas adorer la suite, crois-moi 🤫 Je prépare quelque chose de fou", reasoning: "Crée de l'anticipation" },
      { id: "qr-3", text: "Merci pour ton soutien, ça me touche vraiment 🥹 C'est pour des fans comme toi que je fais ça", reasoning: "Message chaleureux qui fidélise" },
    ];
  } else if (sentiment === "declining") {
    suggestions.quickReplies = [
      { id: "qr-1", text: "Hé, je pensais à toi aujourd'hui 🫶 Ça fait un moment, tout va bien ?", reasoning: "Réengagement en douceur" },
      { id: "qr-2", text: "Tu me manques par ici ! J'ai préparé quelque chose de spécial, j'espère que tu vas aimer 💝", reasoning: "Message chaleureux sans pression" },
      { id: "qr-3", text: "Pas de pression, mais sache que je suis toujours là si tu veux parler 🫂", reasoning: "Espace sécurisé pour revenir" },
    ];
  } else {
    suggestions.quickReplies = [
      { id: "qr-1", text: "Coucou toi 💫 J'espère que ta journée est belle, je pensais à toi", reasoning: "Message d'ouverture chaleureux" },
      { id: "qr-2", text: "Deviens qui j'ai vu passer aujourd'hui ? Un.e de mes fans préféré.e 😏", reasoning: "Fait sourire" },
      { id: "qr-3", text: "Si je te disais ce que je prépare... mais ça gâcherait la surprise 🤫", reasoning: "Crée du mystère" },
    ];
  }

  // Actions based on segment and risk
  if (segment === "whale") {
    suggestions.suggestedActions = [
      {
        id: "act-1", type: "upsell", icon: "📈",
        title: "Upsell contenu premium",
        description: `${fanBrain.custom_name || "Ce fan"} dépense régulièrement. Propose du contenu exclusif haut de gamme.`,
        draftedMessage: "J'ai un concept dont je suis trop fière, je voulais le partager avec toi en avant-première. Tu penses que ça pourrait t'intéresser ? 🎬",
      },
    ];
    suggestions.alerts.push({
      id: "alert-1", type: "vip", level: "success",
      message: `${fanBrain.custom_name || "Ce fan"} a dépensé plus de ${fanBrain.ltv_predicted}€ — VIP à soigner absolument`,
    });
  } else if (segment === "churning" && churnScore > 50) {
    suggestions.suggestedActions = [
      {
        id: "act-1", type: "re_engage", icon: "🔄",
        title: "Relancer le fan",
        description: `Inactif depuis ${daysSinceMessage} jours. Message de réengagement personnalisé.`,
        draftedMessage: "Ça fait un moment et je voulais prendre de tes nouvelles 🫶 J'espère que tout va bien de ton côté. J'ai préparé des nouveautés et j'aimerais beaucoup avoir ton avis, tu as toujours eu un super goût 💕",
      },
    ];
    if (churnScore > 70) {
      suggestions.alerts.push({
        id: "alert-2", type: "churn", level: "warning",
        message: `Dernière activité il y a ${daysSinceMessage} jours — risque de churn élevé (${churnScore}%)`,
        detail: "Prioriser le réengagement avec un message personnalisé et une offre douce.",
      });
    }
  } else if (segment === "tipper") {
    suggestions.suggestedActions = [
      {
        id: "act-1", type: "free_preview", icon: "🎁",
        title: "Offrir un aperçu gratuit",
        description: `${fanBrain.custom_name || "Ce fan"} n'a pas acheté récemment. Envoie un teaser pour raviver l'intérêt.`,
        draftedMessage: "J'ai un petit quelque chose à te montrer, j'aimerais avoir ton avis avant de le poster officiellement 😇 Dis-moi ce que t'en penses !",
      },
    ];
  }

  // Time-based alert
  const hour = new Date().getHours();
  if (hour >= 19 && hour <= 22) {
    suggestions.alerts.push({
      id: "alert-time", type: "timing", level: "info",
      message: "C'est le bon moment pour proposer du contenu exclusif — vos fans sont les plus actifs en soirée",
    });
  }

  // Taboo alert for churning fans that feel distant
  if (sentiment === "declining" && churnScore > 50) {
    suggestions.alerts.push({
      id: "alert-taboo", type: "taboo", level: "info",
      message: "Évite les messages trop pushy avec ce fan — il a besoin d'espace et de douceur",
    });
  }

  return suggestions;
}
