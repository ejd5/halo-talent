export type MediaType = "image" | "video" | "document";
export type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: MediaType;
  creator_id: string;
  creator_name: string;
  tags: string[];
  created_at: string;
  file_size: number;
  width: number | null;
  height: number | null;
};

export const MEDIA_TYPE_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  document: "Document",
};
