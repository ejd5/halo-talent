// ─── Demo Responses, Fallback quand DEEPSEEK_API_KEY absente ──
// Réponses mock crédibles pour démo sans clé API, badge "Demo Mode"

import type { AIDraft, DeepSeekResponse, GenerateDraftOutput, PPVStrategyOutput, FanInsightOutput, ComplianceScanOutput } from "@/lib/types/chat-ai";

const DEMO_FAN_NAMES = ["Alex", "Marco94", "Luna_Star", "ChrisFitness", "Emma.B"];
const DEMO_TONES = ["Chaleureux et complice", "Premium et exclusif", "Amical et léger"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function demoDraftResponse(input: {
  objective: string;
  tone?: string;
  targetLanguage?: string;
}): GenerateDraftOutput {
  const fanName = pick(DEMO_FAN_NAMES);
  const tone = input.tone || pick(DEMO_TONES);
  const lang = input.targetLanguage || "fr";

  const texts: Record<string, string> = {
    fr: `Coucou ${fanName} ! 🌸 Je voulais te remercier pour ton soutien, ça me touche vraiment. J'ai préparé quelque chose de spécial pour toi cette semaine... je te tiens au courant très bientôt. Comment s'est passée ta journée ? 💫`,
    en: `Hey ${fanName}! 🌸 Just wanted to thank you for your support, it really means a lot. I've got something special coming this week... stay tuned. How was your day? 💫`,
    es: `¡Hola ${fanName}! 🌸 Solo quería agradecerte por tu apoyo, de verdad significa mucho. Tengo algo especial preparado para ti esta semana... atento. ¿Cómo estuvo tu día? 💫`,
    de: `Hey ${fanName}! 🌸 Wollte dir nur kurz für deine Unterstützung danken, bedeutet mir wirklich viel. Hab diese Woche was Besonderes für dich... bleib gespannt. Wie war dein Tag? 💫`,
  };

  const text = texts[lang] || texts.fr;

  return {
    draft: {
      id: "demo-draft-" + Date.now(),
      conversationId: "demo-conv",
      userId: "demo-user",
      text,
      objective: input.objective,
      tone,
      contextSources: [
        { type: "fan_brain", reference: `${fanName}, VIP, LTV 480€`, snippet: "Fan actif depuis 8 mois, répond bien aux messages personnalisés" },
        { type: "playbook", reference: "Playbook Solo Standard", snippet: "Ton chaleureux, audace 3/5" },
      ],
      riskLevel: "low",
      complianceStatus: "needs_review",
      requiresValidation: true,
      model: "deepseek-v4-flash",
      explanation: `Ce brouillon utilise un ton ${tone.toLowerCase()}, commence par de la gratitude (renforce le lien), crée de l'anticipation sans pression, et termine par une question ouverte pour engager la conversation. Adapté au statut VIP du fan.`,
      status: "draft",
      createdAt: new Date().toISOString(),
    },
    text,
    riskLevel: "low",
    complianceNotes: ["Ton dans les limites", "Pas de promesse de contenu explicite", "Pression commerciale : aucune"],
    explanation: `Ce brouillon utilise un ton ${tone.toLowerCase()}, commence par de la gratitude, crée de l'anticipation sans pression.`,
    model: "deepseek-v4-flash",
    tokensUsed: 0,
    latencyMs: 0,
  };
}

export function demoPPVResponse(): PPVStrategyOutput {
  return {
    recommendations: [
      {
        id: "demo-ppv-" + Date.now(),
        userId: "demo-user",
        vaultAssetId: "demo-vault-1",
        targetFanIds: ["demo-fan-1"],
        segmentId: null,
        recommendedPrice: 24.99,
        minPrice: 14.99,
        maxPrice: 49.99,
        justification: "Fan VIP avec LTV élevée et historique d'achats PPV réguliers. Prix aligné sur ses derniers achats (20-30€). Marge de négociation possible jusqu'à 14.99€.",
        fatigueRisk: "Faible, dernier achat PPV il y a 12 jours, pas de saturation détectée.",
        alreadySoldTo: [],
        conversionEstimate: "Estimation indicative non garantie : 60-70% de probabilité d'achat basée sur l'historique.",
        status: "draft",
        createdAt: new Date().toISOString(),
      },
    ],
    reasoning: "Recommandation basée sur l'historique d'achat, le LTV, et l'absence de fatigue PPV. Prix dans les bornes du playbook (5-200€).",
    model: "deepseek-v4-pro",
  };
}

export function demoFanInsightResponse(): FanInsightOutput {
  return {
    scoring: {
      intentScore: 72,
      churnRisk: 15,
      commercialScore: 68,
      relationshipScore: 81,
    },
    nextBestAction: "Envoyer un message personnalisé de remerciement + teaser PPV exclusif cette semaine.",
    talkingPoints: [
      "Remercier pour le soutien récent (3 achats ce mois-ci)",
      "Mentionner le contenu exclusif à venir",
      "Demander son avis sur le dernier contenu acheté",
      "Proposer un PPV à 24.99€ dans 2-3 jours",
    ],
    warnings: [],
    model: "deepseek-v4-pro",
  };
}

export function demoComplianceScanResponse(): ComplianceScanOutput {
  return {
    allowed: true,
    riskLevel: "low",
    reasons: [],
    requiredActions: [],
    suggestedSafeAlternative: null,
    model: "deepseek-v4-flash",
  };
}

export function demoDeepSeekResponse(model: "deepseek-v4-flash" | "deepseek-v4-pro", json?: boolean): DeepSeekResponse {
  const baseText = "[Demo Mode] Ceci est une réponse simulée. Ajoutez votre clé DEEPSEEK_API_KEY pour activer l'IA réelle.";
  return {
    text: json ? JSON.stringify({ text: baseText, riskLevel: "low", complianceNotes: [], explanation: "Mode démonstration, réponse mock." }) : baseText,
    model,
    tokensUsed: 0,
    latencyMs: 0,
    parsed: json ? { text: baseText, riskLevel: "low", complianceNotes: [], explanation: "Mode démonstration, réponse mock." } : undefined,
  };
}
