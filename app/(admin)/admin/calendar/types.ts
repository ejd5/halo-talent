export type ContentType = "post" | "story" | "reel" | "video" | "live";
export type CalendarStatus = "draft" | "planned" | "published" | "failed";

export type CalendarEvent = {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  platform: string;
  content_type: ContentType;
  content_preview: string;
  caption: string;
  hashtags: string[];
  media_url: string | null;
  media_type: "image" | "video" | null;
  scheduled_at: string;
  status: CalendarStatus;
  estimated_reach: number | null;
  estimated_engagement: number | null;
  created_at: string;
  updated_at: string;
};

export type CalendarView = "month" | "week" | "day" | "list";

export type CalendarFilters = {
  creator_ids: string[];
  platforms: string[];
  statuses: CalendarStatus[];
  content_types: ContentType[];
};

export const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "#FF0000",
  Instagram: "#E4405F",
  TikTok: "#000000",
  OnlyFans: "#00AFF0",
  Twitter: "#1DA1F2",
  LinkedIn: "#0A66C2",
};

export const PLATFORM_LABELS: Record<string, string> = {
  YouTube: "YouTube",
  Instagram: "Instagram",
  TikTok: "TikTok",
  OnlyFans: "OnlyFans",
  Twitter: "Twitter",
  LinkedIn: "LinkedIn",
};

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: "Post",
  story: "Story",
  reel: "Reel",
  video: "Vidéo",
  live: "Live",
};

export const CONTENT_TYPE_ICONS: Record<string, string> = {
  post: "📷",
  story: "📱",
  reel: "🎬",
  video: "🎥",
  live: "🔴",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  planned: "Planifié",
  published: "Publié",
  failed: "Échec",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "#E0D8D0",
  planned: "#C75B39",
  published: "#7A9A65",
  failed: "#C44536",
};
