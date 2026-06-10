// ─── Message handler — Halo Companion ───────────
// Routes messages between content scripts, side panel, and popup

import type { HaloMessage, MessageType } from "@/src/types/message";
import { checkCompliance } from "@/src/lib/compliance-guard";
import { checkPrivacy } from "@/src/lib/privacy-guard";
import { haloAPI } from "@/src/lib/halo-api-client";
import { getAuthToken } from "./auth-manager";

type MessageSender = chrome.runtime.MessageSender;

/** Handle incoming messages and route to the appropriate handler */
export async function handleMessage(
  message: HaloMessage,
  _sender: MessageSender
): Promise<HaloMessage> {
  const { type, payload, source } = message;

  console.log(`[Halo Companion] Message: ${type} from ${source}`);

  // Ensure auth token is set on API client
  const token = await getAuthToken();
  if (token) {
    haloAPI.setToken(token);
  }

  switch (type as MessageType) {
    // ─── Auth ───────────
    case "GET_AUTH_TOKEN":
      return {
        type: "AUTH_TOKEN_RESPONSE",
        payload: { token: token ?? null },
        source: "background",
        timestamp: Date.now(),
      };

    // ─── Fan Profile ───────────
    case "GET_FAN_PROFILE": {
      const fanId = payload as string;
      const profile = await haloAPI.getFanProfile(fanId);

      // Privacy check before returning to side panel
      const privacyResult = checkPrivacy(
        profile as unknown as Record<string, unknown>,
        "fan_profile"
      );

      return {
        type: "GET_FAN_PROFILE_RESPONSE",
        payload: privacyResult.allowed ? profile : privacyResult.sanitized,
        source: "background",
        timestamp: Date.now(),
      };
    }

    // ─── Compliance check ───────────
    case "COMPLIANCE_CHECK": {
      const ctx = payload as Parameters<typeof checkCompliance>[0];
      const results = checkCompliance(ctx);
      return {
        type: "COMPLIANCE_CHECK_RESPONSE",
        payload: results,
        source: "background",
        timestamp: Date.now(),
      };
    }

    // ─── Privacy check ───────────
    case "PRIVACY_CHECK": {
      const { data, context } = payload as {
        data: Record<string, unknown>;
        context: "fan_profile" | "chat_message" | "vault_item" | "stats";
      };
      const result = checkPrivacy(data, context);
      return {
        type: "PRIVACY_CHECK_RESPONSE",
        payload: result,
        source: "background",
        timestamp: Date.now(),
      };
    }

    // ─── Audit log ───────────
    case "AUDIT_LOG_EVENT":
      // Forwarded from content script to side panel if open
      return {
        type: "AUDIT_LOG_EVENT",
        payload,
        source: "background",
        timestamp: Date.now(),
      };

    // ─── Notification ───────────
    case "NOTIFICATION":
      // Display a browser notification
      try {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "src/assets/icons/icon-128.png",
          title: (payload as { title: string; message: string }).title,
          message: (payload as { title: string; message: string }).message,
        });
      } catch {
        // Notifications may not be available
      }
      return {
        type: "NOTIFICATION",
        payload: { sent: true },
        source: "background",
        timestamp: Date.now(),
      };

    // ─── Navigate side panel ───────────
    case "NAVIGATE":
      // Forward navigation to side panel
      return {
        type: "NAVIGATE",
        payload,
        source: "background",
        timestamp: Date.now(),
      };

    default:
      console.warn(`[Halo Companion] Unknown message type: ${type}`);
      return {
        type: "ERROR",
        payload: { message: `Unknown message type: ${type}` },
        source: "background",
        timestamp: Date.now(),
      };
  }
}
