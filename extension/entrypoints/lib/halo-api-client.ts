// ─── Halo API Client — Halo Companion ───────────
// All communication with the Halo Talent backend

import { HALO_API_BASE } from "./constants";
import { checkPrivacy } from "./privacy-guard";
import { logEvent } from "./audit-logger";
import type { FanProfile, FanMemory } from "@/src/types/fan";
import type { ChatScript, AIDraft, ChatThread } from "@/src/types/message";
import type { VaultItem, VaultSearchResult, VaultComplianceResult } from "@/src/types/vault";
import type { ExtractedStats } from "@/src/types/platform";

class HaloAPIClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = HALO_API_BASE;
  }

  /** Set the auth token from the background auth manager */
  setToken(token: string | null): void {
    this.token = token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error("Not authenticated. Please log in to Halo Talent.");
    }

    const url = `${this.baseUrl}/${path}`;
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
          ...options.headers,
        },
      });

      const durationMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorBody = await response.text();
        await logEvent({
          action: "api_call",
          platform: "halo-api",
          targetId: path,
          details: { method: options.method ?? "GET", status: response.status },
          success: false,
          error: errorBody,
          durationMs,
        });
        throw new Error(`Halo API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      await logEvent({
        action: "api_call",
        platform: "halo-api",
        targetId: path,
        details: { method: options.method ?? "GET", status: response.status },
        success: true,
        durationMs,
      });

      return data as T;
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Halo API error")) {
        throw err;
      }
      await logEvent({
        action: "api_call",
        platform: "halo-api",
        targetId: path,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
      throw err;
    }
  }

  // ─── Fan Brain ───

  async getFanProfile(fanId: string): Promise<FanProfile> {
    return this.request<FanProfile>(`v1/fans/${fanId}`);
  }

  async updateFanNotes(
    fanId: string,
    notes: string
  ): Promise<{ success: boolean }> {
    const sanitized = checkPrivacy({ notes }, "fan_profile");
    return this.request(`v1/fans/${fanId}/notes`, {
      method: "PATCH",
      body: JSON.stringify(sanitized.sanitized),
    });
  }

  async updateFanTags(
    fanId: string,
    tags: string[]
  ): Promise<{ success: boolean }> {
    return this.request(`v1/fans/${fanId}/tags`, {
      method: "PATCH",
      body: JSON.stringify({ tags }),
    });
  }

  async getFanMemories(fanId: string): Promise<FanMemory[]> {
    return this.request<FanMemory[]>(`v1/fans/${fanId}/memories`);
  }

  async addFanMemory(
    fanId: string,
    memory: Omit<FanMemory, "id" | "createdAt" | "updatedAt">
  ): Promise<FanMemory> {
    return this.request<FanMemory>(`v1/fans/${fanId}/memories`, {
      method: "POST",
      body: JSON.stringify(memory),
    });
  }

  // ─── Scripts ───

  async getScripts(): Promise<ChatScript[]> {
    return this.request<ChatScript[]>("v1/scripts");
  }

  async getAIDraftSuggestion(params: {
    fanId?: string;
    persona?: string;
    tone?: string;
    context?: string;
  }): Promise<AIDraft> {
    return this.request<AIDraft>("v1/scripts/ai-draft", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // ─── Chat ───

  async getChatThreads(): Promise<ChatThread[]> {
    return this.request<ChatThread[]>("v1/chat/threads");
  }

  // ─── Vault ───

  async searchVault(query: string): Promise<VaultSearchResult[]> {
    return this.request<VaultSearchResult[]>(
      `v1/vault/search?q=${encodeURIComponent(query)}`
    );
  }

  async getVaultItem(itemId: string): Promise<VaultItem> {
    return this.request<VaultItem>(`v1/vault/${itemId}`);
  }

  async checkVaultCompliance(
    itemId: string
  ): Promise<VaultComplianceResult> {
    return this.request<VaultComplianceResult>(
      `v1/vault/${itemId}/compliance`
    );
  }

  // ─── Stats ───

  async submitStats(stats: ExtractedStats): Promise<{ success: boolean }> {
    const sanitized = checkPrivacy(stats as unknown as Record<string, unknown>, "stats");
    return this.request("v1/stats/ingest", {
      method: "POST",
      body: JSON.stringify(sanitized.sanitized),
    });
  }

  // ─── Auth ───

  async exchangeToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.request("v1/auth/exchange", {
      method: "POST",
      body: JSON.stringify({ code, client: "chrome-extension" }),
    });
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    return this.request("v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export const haloAPI = new HaloAPIClient();
