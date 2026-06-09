import type { PlatformType, PlatformSubType } from "@/lib/studio/types";

export type MediaType = "IMAGE" | "VIDEO";

export interface PhotoParams {
  image_url: string;
  caption: string;
  location_id?: string;
  user_tags?: Array<{ username: string; x: number; y: number }>;
}

export interface VideoParams {
  video_url: string;
  caption: string;
  cover_url?: string;
  share_to_feed?: boolean;
}

export interface CarouselItem {
  type: MediaType;
  url: string;
}

export interface CarouselParams {
  items: CarouselItem[];
  caption: string;
}

export interface StoryParams {
  media_url: string;
  type: MediaType;
}

export interface YouTubeVideoParams {
  title: string;
  description: string;
  video_url: string;
  privacy_status: "public" | "unlisted" | "private";
  tags?: string[];
  category_id?: string;
}

export interface TikTokVideoParams {
  video_url: string;
  caption: string;
  privacy_level?: "PUBLIC" | "PRIVATE" | "FRIENDS";
  allow_duet?: boolean;
  allow_stitch?: boolean;
  comment_disabled?: boolean;
}

export interface TweetParams {
  text: string;
  media_urls?: string[];
  reply_to?: string;
}

export interface ThreadParams {
  text: string;
  media_urls?: string[];
}

export interface LinkedInPostParams {
  text: string;
  media_urls?: string[];
  visibility?: "PUBLIC" | "CONNECTIONS";
}

export interface BlueskyPostParams {
  text: string;
  image_urls?: string[];
  reply_to?: string;
  langs?: string[];
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  error?: string;
  statusCode?: string;
}

export interface PublisherStatus {
  state: "idle" | "uploading" | "processing" | "publishing" | "done" | "error";
  message: string;
  progress?: number;
}

export type PublisherConstructor = {
  accessToken: string;
  platformUserId: string;
  extra?: Record<string, unknown>;
};
