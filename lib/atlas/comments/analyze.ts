import type { Sentiment, Intent } from "./types";

interface AnalysisResult {
  sentiment: Sentiment;
  intent: Intent;
  language: string;
  is_spam: boolean;
  contains_link: boolean;
  potential_harassment: boolean;
}

/**
 * Analyze a comment using Claude AI.
 * Falls back to heuristic analysis if the API call fails.
 */
export async function analyzeComment(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return heuristicAnalysis(text);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Analyze this social media comment. Return ONLY a JSON object (no markdown, no explanation):

{
  "sentiment": "very_positive" | "positive" | "neutral" | "negative" | "very_negative",
  "intent": "compliment" | "question" | "complaint" | "spam" | "promotion" | "general" | "harassment",
  "language": "ISO language code",
  "is_spam": true/false,
  "contains_link": true/false,
  "potential_harassment": true/false
}

Comment: "${text.replace(/"/g, "'")}"`,
        }],
      }),
    });

    if (!response.ok) {
      console.error("[ANALYZE] API error:", response.status);
      return heuristicAnalysis(text);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    // Parse JSON from response (handling potential markdown fences)
    const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(jsonStr);

    return {
      sentiment: validateSentiment(result.sentiment),
      intent: validateIntent(result.intent),
      language: result.language || "fr",
      is_spam: !!result.is_spam,
      contains_link: !!result.contains_link || /https?:\/\/|www\./i.test(text),
      potential_harassment: !!result.potential_harassment,
    };
  } catch (err) {
    console.error("[ANALYZE] Error:", err);
    return heuristicAnalysis(text);
  }
}

/* ─── Heuristic fallback ─── */
function heuristicAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const hasLink = /https?:\/\/|www\.|\.com\b|\.fr\b|bit\.ly/i.test(text);

  const spamKeywords = [
    "buy now", "free", "check my profile", "click here", "limited offer",
    "follow me", "promo", "link in bio", "dm me", "make money",
  ];

  const positiveWords = [
    "merci", "super", "bravo", "génial", "magnifique", "adorable",
    "beau", "belle", "❤️", "🔥", "✨", "😍", "🥰", "parfait", "excellent",
    "wow", "amazing", "beautiful", "love", "great", "best", "💯",
  ];

  const negativeWords = [
    "nul", "nulle", "moche", "horrible", "déteste", "haine", "triste",
    "degueu", "dégueulasse", "terrible", "worst", "hate", "ugly",
  ];

  const questionWords = [
    "?", "qui", "quoi", "comment", "pourquoi", "combien", "est-ce",
    "quand", "où", "que", "quel", "quelle",
  ];

  const isSpam = spamKeywords.some((k) => lower.includes(k)) || (hasLink && !lower.includes("merci"));
  const isQuestion = questionWords.some((q) => lower.includes(q));
  const isPositive = positiveWords.some((w) => lower.includes(w));
  const isNegative = negativeWords.some((w) => lower.includes(w));

  let sentiment: Sentiment = "neutral";
  if (isPositive && !isNegative) sentiment = "positive";
  if (isNegative && !isPositive) sentiment = "negative";
  if (isPositive && isNegative) sentiment = "neutral";

  let intent: Intent = "general";
  if (isSpam) intent = "spam";
  else if (isQuestion) intent = "question";
  else if (isPositive) intent = "compliment";
  else if (isNegative) intent = "complaint";

  return {
    sentiment,
    intent,
    language: "fr",
    is_spam: isSpam,
    contains_link: hasLink,
    potential_harassment: isNegative && lower.includes("t") === false,
  };
}

function validateSentiment(s: string): Sentiment {
  const valid: Sentiment[] = ["very_positive", "positive", "neutral", "negative", "very_negative"];
  return valid.includes(s as Sentiment) ? (s as Sentiment) : "neutral";
}

function validateIntent(i: string): Intent {
  const valid: Intent[] = ["compliment", "question", "complaint", "spam", "promotion", "general", "harassment"];
  return valid.includes(i as Intent) ? (i as Intent) : "general";
}
