// ─── AI Router — Task → Model Selection ──────────────────
// Routes tasks to deepseek-v4-flash (fast) or deepseek-v4-pro (reasoning)

import type { DeepSeekModel, TaskType } from "@/lib/types/chat-ai";

// Fast tasks → Flash (cheaper, 6x faster)
const FLASH_TASKS: TaskType[] = [
  "draft",
  "rewrite",
  "translate",
  "shorten",
];

// Complex tasks → Pro (reasoning needed)
const PRO_TASKS: TaskType[] = [
  "ppv_strategy",
  "fan_scoring",
  "churn_analysis",
  "playbook_gen",
  "compliance_analysis",
];

/**
 * Pick the optimal model for a given task type.
 * Flash for drafting/rewriting, Pro for strategy/scoring/analysis.
 */
export function pickModel(taskType: TaskType): DeepSeekModel {
  if (FLASH_TASKS.includes(taskType)) return "deepseek-v4-flash";
  if (PRO_TASKS.includes(taskType)) return "deepseek-v4-pro";
  return "deepseek-v4-flash"; // default safe
}

/**
 * Estimate tokens based on input length (rough heuristic).
 */
export function estimateInputTokens(text: string): number {
  // ~1 token per 4 chars for English, ~1 per 2.5 for French
  return Math.ceil(text.length / 3);
}

/**
 * Get max tokens for a given task type.
 */
export function getMaxTokens(taskType: TaskType): number {
  switch (taskType) {
    case "draft":
    case "rewrite":
      return 1024;
    case "translate":
    case "shorten":
      return 512;
    case "ppv_strategy":
    case "fan_scoring":
    case "churn_analysis":
      return 2048;
    case "playbook_gen":
      return 3072;
    case "compliance_analysis":
      return 1024;
    default:
      return 1024;
  }
}

/**
 * Get temperature for a given task type.
 */
export function getTemperature(taskType: TaskType): number {
  switch (taskType) {
    case "draft":
    case "rewrite":
      return 0.7; // Creative
    case "translate":
      return 0.2; // Precise
    case "ppv_strategy":
    case "fan_scoring":
      return 0.3; // Analytical
    case "churn_analysis":
    case "compliance_analysis":
      return 0.1; // Strict
    default:
      return 0.3;
  }
}
