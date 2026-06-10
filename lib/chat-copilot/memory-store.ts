// ─── Fan Memory Store — pgvector semantic search ──────────
// Stores and retrieves fan memories via vector embeddings.

import { createClient } from "@/lib/supabase/server";
import type {
  MemoryEntry,
  MemoryType,
  MemorySearchQuery,
  MemorySearchResult,
} from "./types";

export class MemoryStore {
  private fanId: string;
  private creatorId: string;

  constructor(fanId: string, creatorId: string) {
    this.fanId = fanId;
    this.creatorId = creatorId;
  }

  // ── Add a memory entry (with embedding generation) ──

  async add(
    memoryType: MemoryType,
    content: string,
    metadata?: Record<string, unknown>,
  ): Promise<MemoryEntry> {
    const supabase = await createClient();

    // Generate embedding via the existing studio/generate embedding endpoint
    const embedding = await this.generateEmbedding(content);

    const { data, error } = await supabase
      .from("fan_memory_embeddings")
      .insert({
        fan_id: this.fanId,
        creator_id: this.creatorId,
        memory_type: memoryType,
        content,
        metadata: metadata || {},
        embedding: embedding ? embedding : undefined,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to store memory: ${error.message}`);

    return {
      id: data.id,
      fan_id: data.fan_id,
      creator_id: data.creator_id,
      memory_type: data.memory_type,
      content: data.content,
      metadata: data.metadata,
      created_at: data.created_at,
    };
  }

  // ── Batch add multiple memories ──

  async batchAdd(
    entries: { memory_type: MemoryType; content: string; metadata?: Record<string, unknown> }[],
  ): Promise<MemoryEntry[]> {
    return Promise.all(
      entries.map((e) => this.add(e.memory_type, e.content, e.metadata)),
    );
  }

  // ── Semantic search ──

  async search(query: MemorySearchQuery): Promise<MemorySearchResult> {
    const supabase = await createClient();
    const limit = query.limit || 10;
    const minSimilarity = query.min_similarity || 0.7;

    // Generate query embedding
    const embedding = await this.generateEmbedding(query.query);

    if (!embedding) {
      // Fallback to text search if embedding generation fails
      return this.textSearch(query);
    }

    let dbQuery = supabase.rpc("match_fan_memories", {
      p_fan_id: this.fanId,
      p_creator_id: this.creatorId,
      p_embedding: embedding,
      p_match_threshold: minSimilarity,
      p_match_count: limit,
    });

    if (query.memory_type) {
      // We can't filter in the RPC, so filter post-query
      const { data } = await dbQuery;
      const filtered = (data || []).filter(
        (m: { memory_type: string }) => m.memory_type === query.memory_type,
      );
      return {
        entries: filtered.slice(0, limit).map(this.mapMemoryRow),
        query: query.query,
      };
    }

    const { data } = await dbQuery;
    return {
      entries: (data || []).slice(0, limit).map(this.mapMemoryRow),
      query: query.query,
    };
  }

  // ── Get recent memories (by date, not similarity) ──

  async getRecent(limit = 10): Promise<MemoryEntry[]> {
    const supabase = await createClient();

    const { data } = await supabase
      .from("fan_memory_embeddings")
      .select("*")
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId)
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []).map(this.mapMemoryRow);
  }

  // ── Delete a memory entry ──

  async delete(memoryId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("fan_memory_embeddings")
      .delete()
      .eq("id", memoryId)
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId);

    if (error) throw new Error(`Failed to delete memory: ${error.message}`);
  }

  // ── Clear all memories for this fan ──

  async clearAll(): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("fan_memory_embeddings")
      .delete()
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId);

    if (error) throw new Error(`Failed to clear memories: ${error.message}`);
  }

  // ── Private helpers ──

  private mapMemoryRow(row: Record<string, unknown>): MemoryEntry {
    return {
      id: row.id as string,
      fan_id: row.fan_id as string,
      creator_id: row.creator_id as string,
      memory_type: row.memory_type as MemoryType,
      content: row.content as string,
      metadata: row.metadata as Record<string, unknown>,
      created_at: row.created_at as string,
      similarity: row.similarity as number | undefined,
    };
  }

  private async generateEmbedding(text: string): Promise<number[] | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/embed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        },
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data.embedding || null;
    } catch {
      return null;
    }
  }

  private async textSearch(query: MemorySearchQuery): Promise<MemorySearchResult> {
    const supabase = await createClient();
    const limit = query.limit || 10;

    let dbQuery = supabase
      .from("fan_memory_embeddings")
      .select("*")
      .eq("fan_id", this.fanId)
      .eq("creator_id", this.creatorId)
      .textSearch("content", query.query, {
        type: "websearch",
        config: "french",
      })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (query.memory_type) {
      dbQuery = dbQuery.eq("memory_type", query.memory_type);
    }

    const { data } = await dbQuery;
    return {
      entries: (data || []).map(this.mapMemoryRow),
      query: query.query,
    };
  }
}
