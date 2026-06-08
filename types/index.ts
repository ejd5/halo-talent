export type Department =
  | "music"
  | "sport"
  | "business"
  | "digital"
  | "premium";

export type CreatorRole = "creator" | "manager" | "admin";

export type CreatorStatus =
  | "applicant"
  | "active"
  | "paused"
  | "archived";

export type Platform =
  | "onlyfans"
  | "mym"
  | "reveal"
  | "fansly"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "twitch";

export interface CreatorProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: CreatorRole;
  department: Department | null;
  status: CreatorStatus;
  joined_at: string;
}

export interface CommissionTier {
  name: string;
  range: string;
  minRevenue: number;
  maxRevenue: number | null;
  commissionRate: number;
  creatorKeeps: number;
}
