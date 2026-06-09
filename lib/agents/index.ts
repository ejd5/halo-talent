import { Agent } from "./base/Agent";
import { ContentStrategist } from "./ContentStrategist";
import { AnalyticsCoach } from "./AnalyticsCoach";
import { EngagementHelper } from "./EngagementHelper";
import { TrendSpotter } from "./TrendSpotter";
import { PricingAdvisor } from "./PricingAdvisor";
import { WellnessCoach } from "./WellnessCoach";

export type AgentName = "content" | "analytics" | "engagement" | "trends" | "pricing" | "wellness";

export function getAgent(name: AgentName, creatorId: string, apiKey?: string): Agent {
  switch (name) {
    case "content": return new ContentStrategist(creatorId, apiKey);
    case "analytics": return new AnalyticsCoach(creatorId, apiKey);
    case "engagement": return new EngagementHelper(creatorId, apiKey);
    case "trends": return new TrendSpotter(creatorId, apiKey);
    case "pricing": return new PricingAdvisor(creatorId, apiKey);
    case "wellness": return new WellnessCoach(creatorId, apiKey);
  }
}
