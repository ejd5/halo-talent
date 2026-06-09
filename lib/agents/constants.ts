import type { AgentName } from "./base/types";

export const AGENT_LABELS: Record<AgentName, string> = {
  content: "Content Strategist",
  analytics: "Analytics Coach",
  engagement: "Engagement Helper",
  trends: "Trend Spotter",
  pricing: "Pricing Advisor",
  wellness: "Wellness Coach",
};

export const AGENT_EMOJIS: Record<AgentName, string> = {
  content: "📝",
  analytics: "📊",
  engagement: "💬",
  trends: "🔍",
  pricing: "💰",
  wellness: "🌱",
};

export const AGENT_DESCRIPTIONS: Record<AgentName, string> = {
  content: "Je planifie vos contenus pour maximiser l'engagement",
  analytics: "J'analyse vos performances et identifie les leviers",
  engagement: "Je drafte vos réponses aux DMs pour vous (vous validez toujours)",
  trends: "Je surveille les tendances et la concurrence",
  pricing: "J'optimise vos prix selon le marché",
  wellness: "Je veille sur votre équilibre",
};

export { type AgentName };
