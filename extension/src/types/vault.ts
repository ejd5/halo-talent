// ─── Vault types — Halo Companion ───────────

import type { PlatformType } from "./platform";

/** Content item from the Halo Vault */
export interface VaultItem {
  id: string;
  title: string;
  description?: string;
  type: VaultItemType;
  platform: PlatformType;
  previewUrl?: string;
  fileUrl?: string;
  fileSize?: number;
  duration?: number; // seconds, for video/audio
  tags: string[];
  categories: string[];
  isNSFW: boolean;
  hasModelRelease: boolean;
  releaseFormUrl?: string;
  scheduledFor?: string;
  usedIn: string[]; // campaign IDs
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type VaultItemType = "photo" | "video" | "audio" | "document" | "archive";

export const VAULT_TYPE_LABELS: Record<VaultItemType, string> = {
  photo: "📸 Photo",
  video: "🎬 Vidéo",
  audio: "🎵 Audio",
  document: "📄 Document",
  archive: "📦 Archive",
};

/** Quick search result from the vault */
export interface VaultSearchResult {
  item: VaultItem;
  score: number;
  matchedOn: "title" | "tags" | "description" | "ai_embedding";
}

/** Compliance check result for a vault item */
export interface VaultComplianceResult {
  itemId: string;
  passes: boolean;
  checks: ComplianceCheck[];
  warnings: string[];
  lastCheckedAt: number;
}

export interface ComplianceCheck {
  name: string;
  passed: boolean;
  detail?: string;
}
