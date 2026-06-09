import type { Tool } from "../types";

export const getCreatorProfile: Tool = {
  name: "get_creator_profile",
  description: "Get the full profile of the current creator (name, department, joined date, commission tier, etc.)",
  input_schema: { type: "object", properties: {}, required: [] },
  execute: async (_input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", creatorId).single();
    return data ?? { id: creatorId, error: "Profile not found" };
  },
};

export const getCreatorRevenues: Tool = {
  name: "get_creator_revenues",
  description: "Get the monthly revenues of the creator. Can filter by date range and platform.",
  input_schema: {
    type: "object",
    properties: {
      start_date: { type: "string", description: "YYYY-MM-DD" },
      end_date: { type: "string", description: "YYYY-MM-DD" },
      platform: { type: "string", enum: ["onlyfans", "mym", "instagram", "tiktok", "youtube", "all"] },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("monthly_revenues").select("*").eq("creator_id", creatorId);
    if (input.start_date) query = query.gte("month", input.start_date);
    if (input.end_date) query = query.lte("month", input.end_date);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    const { data } = await query.order("month", { ascending: false });
    return data ?? [];
  },
};

export const getCreatorAccounts: Tool = {
  name: "get_creator_accounts",
  description: "Get all connected platform accounts of the creator with current stats (followers, engagement, etc.)",
  input_schema: { type: "object", properties: {}, required: [] },
  execute: async (_input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("creator_accounts").select("*").eq("creator_id", creatorId);
    return data ?? [];
  },
};

export const getCreatorPosts: Tool = {
  name: "get_creator_posts",
  description: "Get recent posts of the creator across all platforms. Can filter by platform and status.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "tiktok", "youtube", "all"] },
      status: { type: "string", enum: ["published", "draft", "scheduled", "all"] },
      limit: { type: "number", description: "Number of posts to return (max 50)" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("posts").select("*").eq("creator_id", creatorId);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    if (input.status && input.status !== "all") query = query.eq("status", input.status);
    const { data } = await query.order("created_at", { ascending: false }).limit(input.limit ?? 20);
    return data ?? [];
  },
};

export const getCreatorContracts: Tool = {
  name: "get_creator_contracts",
  description: "Get active contracts and commission terms for the creator.",
  input_schema: { type: "object", properties: {}, required: [] },
  execute: async (_input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("contracts").select("*").eq("creator_id", creatorId);
    return data ?? [];
  },
};

export const getCreatorMessages: Tool = {
  name: "get_creator_messages",
  description: "Get recent messages/DMs from the creator's inbox across platforms.",
  input_schema: {
    type: "object",
    properties: {
      platform: { type: "string", enum: ["onlyfans", "instagram", "all"] },
      limit: { type: "number", description: "Number of messages to return" },
      unread_only: { type: "boolean" },
    },
  },
  execute: async (input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase.from("messages").select("*").eq("creator_id", creatorId);
    if (input.platform && input.platform !== "all") query = query.eq("platform", input.platform);
    if (input.unread_only) query = query.eq("read", false);
    const { data } = await query.order("created_at", { ascending: false }).limit(input.limit ?? 20);
    return data ?? [];
  },
};

export const getCreatorGoals: Tool = {
  name: "get_creator_goals",
  description: "Get current goals and progress for the creator.",
  input_schema: { type: "object", properties: {}, required: [] },
  execute: async (_input, creatorId) => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("goals").select("*").eq("creator_id", creatorId);
    return data ?? [];
  },
};
