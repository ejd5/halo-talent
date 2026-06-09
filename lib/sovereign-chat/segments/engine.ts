import { createClient } from "@/lib/supabase/server";
import type { SegmentRule } from "./templates";

export class SmartSegmentEngine {
  async getMembers(segmentId: string) {
    const supabase = await createClient();
    const { data: segment } = await supabase
      .from("atlas_segments")
      .select("*")
      .eq("id", segmentId)
      .single();

    if (!segment) return [];

    let query = supabase.from("atlas_fans").select("*").eq("creator_id", segment.creator_id);

    for (const rule of (segment.rules || []) as SegmentRule[]) {
      query = this.applyRule(query, rule);
    }

    const { data } = await query;
    return data || [];
  }

  async getMemberCount(segmentId: string): Promise<number> {
    const supabase = await createClient();
    const { data: segment } = await supabase
      .from("atlas_segments")
      .select("*")
      .eq("id", segmentId)
      .single();

    if (!segment) return 0;

    let query = supabase
      .from("atlas_fans")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", segment.creator_id);

    for (const rule of (segment.rules || []) as SegmentRule[]) {
      query = this.applyRule(query, rule);
    }

    const { count } = await query;
    return count ?? 0;
  }

  private applyRule(query: any, rule: SegmentRule): any {
    const field = rule.field;
    let value = rule.value;

    // Handle dynamic date values like "now-7d", "now-30d", etc.
    if (typeof value === "string" && value.startsWith("now-")) {
      const match = value.match(/^now-(\d+)([dhms])$/);
      if (match) {
        const num = parseInt(match[1]);
        const unit = match[2];
        const ms = unit === "d" ? num * 86400000 : unit === "h" ? num * 3600000 : unit === "m" ? num * 60000 : num * 1000;
        value = new Date(Date.now() - ms).toISOString();
      }
    }

    switch (rule.operator) {
      case "eq":
        return query.eq(field, value);
      case "neq":
        return query.neq(field, value);
      case "gt":
        return query.gt(field, value);
      case "gte":
        return query.gte(field, value);
      case "lt":
        return query.lt(field, value);
      case "lte":
        return query.lte(field, value);
      case "in":
        return query.in(field, value);
      case "contains":
        return query.contains(field, value);
      case "between":
        return query.gte(field, value[0]).lte(field, value[1]);
      case "is_null":
        return query.is(field, null);
      case "not_null":
        return query.not(field, "is", null);
      default:
        return query;
    }
  }

  async recalculate(segmentId: string) {
    const supabase = await createClient();

    const { data: segment } = await supabase
      .from("atlas_segments")
      .select("*")
      .eq("id", segmentId)
      .single();

    if (!segment || segment.type !== "smart") {
      return { total: 0, entries: 0, exits: 0, skipped: !segment ? "not_found" : "not_smart" };
    }

    const members = await this.getMembers(segmentId);

    const { data: oldMembers } = await supabase
      .from("atlas_segment_memberships")
      .select("fan_id")
      .eq("segment_id", segmentId);

    const oldIds = new Set((oldMembers || []).map((m: any) => m.fan_id));
    const newIds = new Set(members.map((m: any) => m.id));

    const entries = members.filter((m: any) => !oldIds.has(m.id));
    const exits = [...oldIds].filter((id) => !newIds.has(id));

    await supabase.from("atlas_segment_memberships").delete().eq("segment_id", segmentId);
    if (members.length > 0) {
      await supabase.from("atlas_segment_memberships").insert(
        members.map((m: any) => ({ segment_id: segmentId, fan_id: m.id })),
      );
    }

    await supabase
      .from("atlas_segments")
      .update({
        member_count: members.length,
        last_calculated_at: new Date().toISOString(),
      })
      .eq("id", segmentId);

    if (segment.on_entry_funnel_id) {
      for (const fan of entries) {
        await this.triggerFunnel(segment.on_entry_funnel_id, (fan as any).id);
      }
    }
    if (segment.on_exit_funnel_id) {
      for (const fanId of exits) {
        await this.triggerFunnel(segment.on_exit_funnel_id, fanId);
      }
    }

    return { total: members.length, entries: entries.length, exits: exits.length };
  }

  async onFanUpdate(fanId: string) {
    const supabase = await createClient();
    const { data: fan } = await supabase.from("atlas_fans").select("*").eq("id", fanId).single();
    if (!fan) return;

    const { data: smartSegments } = await supabase
      .from("atlas_segments")
      .select("id")
      .eq("creator_id", (fan as any).creator_id)
      .eq("type", "smart");

    for (const segment of smartSegments || []) {
      await this.recalculate((segment as any).id);
    }
  }

  async recalculateAll() {
    const supabase = await createClient();
    const { data: segments } = await supabase
      .from("atlas_segments")
      .select("id, creator_id, name")
      .eq("type", "smart");

    const results = [];
    for (const segment of segments || []) {
      try {
        const result = await this.recalculate((segment as any).id);
        results.push({ id: (segment as any).id, name: (segment as any).name, ...result });
      } catch (err) {
        results.push({ id: (segment as any).id, name: (segment as any).name, error: String(err) });
      }
    }
    return results;
  }

  private async triggerFunnel(_funnelId: string, _fanId: string) {
    // Intégration avec le moteur de funnels (à venir)
  }
}
