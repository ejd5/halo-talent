// ─── Tracking Events, Chat AI ───────────────────────────
// Lightweight event tracking. Logs to console + Supabase.
// No third-party analytics services.

import { createAdminClient } from "@/lib/supabase/server";

// ── Event name constants ────────────────────────────────

export const ChatAITrackingEvents = {
  PAGE_VIEWED: "chat_ai_page_viewed",
  MODE_SELECTED: "chat_ai_mode_selected",
  SETUP_STARTED: "chat_ai_setup_started",
  CONSENT_COMPLETED: "consent_checklist_completed",
  DISCLOSURE_SELECTED: "disclosure_mode_selected",
  DRAFT_GENERATED: "ai_draft_generated",
  DRAFT_APPROVED: "ai_draft_approved",
  DRAFT_COPIED: "ai_draft_copied",
  MESSAGE_ESCALATED: "message_escalated",
  PPV_CREATED: "ppv_recommendation_created",
  FOLLOWUP_CREATED: "followup_created",
  QA_REVIEWED: "qa_review_completed",
  COMPLIANCE_BLOCK: "compliance_block_triggered",
  EMERGENCY_PAUSE: "emergency_pause_clicked",

  // Landing page CTA events (public)
  LANDING_HERO_DEMO: "landing_hero_demo_clicked",
  LANDING_HERO_HOW_IT_WORKS: "landing_hero_how_it_works_clicked",
  LANDING_PROFILES_DEMO: "landing_profiles_demo_clicked",
  LANDING_FINAL_DEMO: "landing_final_demo_clicked",
  LANDING_FINAL_LEX: "landing_final_lex_clicked",
} as const;

export type ChatAITrackingEventName =
  (typeof ChatAITrackingEvents)[keyof typeof ChatAITrackingEvents];

// ── Track event ─────────────────────────────────────────

export async function trackEvent(
  name: ChatAITrackingEventName | string,
  payload: Record<string, unknown> = {},
  userId?: string
): Promise<void> {
  // Always log to console (dev-friendly)
  console.log(`[Chat AI Event] ${name}`, JSON.stringify(payload).substring(0, 200));

  // Persist to Supabase if userId provided
  if (userId) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("chat_ai_tracking_events").insert({
        user_id: userId,
        name,
        payload,
        session_id: payload.sessionId || null,
      });
    } catch (err) {
      // Silent fallback, tracking should never break the app
      console.warn("[Chat AI Tracking] Failed to persist event:", err);
    }
  }
}

/**
 * Track page view (can be called from client side via API).
 */
export function trackPageView(userId?: string): void {
  trackEvent(ChatAITrackingEvents.PAGE_VIEWED, {
    url: typeof window !== "undefined" ? window.location.pathname : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
  }, userId);
}
