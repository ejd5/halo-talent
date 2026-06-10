import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MemoryStore } from "@/lib/chat-copilot/memory-store";

const VALID_MEMORY_TYPES = [
  "conversation_summary", "topic", "preference", "purchase_context",
  "trigger_event", "manual_note", "interaction",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { fanId } = await params;
  const body = await request.json();
  const { action, ...payload } = body;

  const store = new MemoryStore(fanId, user.id);

  try {
    switch (action) {
      case "search": {
        const { query, limit, memory_type, min_similarity } = payload;
        if (!query) {
          return NextResponse.json({ error: "query requis" }, { status: 400 });
        }
        const result = await store.search({
          query,
          limit: limit || 10,
          memory_type,
          min_similarity: min_similarity || 0.7,
        });
        return NextResponse.json(result);
      }

      case "add": {
        const { memory_type, content, metadata } = payload;
        if (!memory_type || !content) {
          return NextResponse.json(
            { error: "memory_type et content requis" },
            { status: 400 },
          );
        }
        if (!VALID_MEMORY_TYPES.includes(memory_type)) {
          return NextResponse.json(
            { error: `memory_type invalide. Valeurs: ${VALID_MEMORY_TYPES.join(", ")}` },
            { status: 400 },
          );
        }
        const entry = await store.add(memory_type, content, metadata);
        return NextResponse.json(entry, { status: 201 });
      }

      case "recent": {
        const limit = payload.limit || 10;
        const entries = await store.getRecent(limit);
        return NextResponse.json({ entries });
      }

      case "delete": {
        const { memory_id } = payload;
        if (!memory_id) {
          return NextResponse.json({ error: "memory_id requis" }, { status: 400 });
        }
        await store.delete(memory_id);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: `action inconnue: ${action}. Actions: search, add, recent, delete` },
          { status: 400 },
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
