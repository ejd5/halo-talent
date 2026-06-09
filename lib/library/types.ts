export type MediaType = "image" | "video" | "audio" | "document";

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string | null;
  type: MediaType;
  mime_type: string;

  // Ownership
  creator_id: string;
  creator_name: string;
  manager_id: string | null;

  // File metadata
  file_size: number;
  width: number | null;
  height: number | null;
  duration: number | null;

  // User-defined tags
  tags: string[];

  // AI analysis (Claude Vision)
  ai_description: string | null;
  ai_tags: string[];
  ai_colors: string[];
  ai_mood: string | null;
  ai_suitable_platforms: string[];
  ai_analyzed: boolean;
  ai_analysis_date: string | null;

  // Moderation (platform guidelines)
  moderation_safe: boolean;
  moderation_concerns: string[];
  moderation_checked: boolean;

  // Usage tracking
  used_in_post_ids: string[];
  used_on_platforms: string[];

  // Relations
  post_id: string | null;
  folder: string | null;
  is_favorite: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
};

export type LibraryFilters = {
  search: string;
  type: MediaType | "all";
  tag: string;
  creator: string;
  platform: string;
  mood: string;
  dateFrom: string;
  dateTo: string;
  moderationStatus: "all" | "safe" | "concerns" | "unchecked";
  favoritesOnly: boolean;
};

export const DEFAULT_FILTERS: LibraryFilters = {
  search: "",
  type: "all",
  tag: "",
  creator: "",
  platform: "",
  mood: "",
  dateFrom: "",
  dateTo: "",
  moderationStatus: "all",
  favoritesOnly: false,
};

export type UploadFile = {
  id: string;
  file: File;
  name: string;
  type: MediaType;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "compressing" | "analyzing" | "done" | "error";
  error?: string;
  preview: string | null;
};

export type MediaFolder = {
  id: string;
  name: string;
  creator_id: string;
  color: string;
  media_count: number;
};
