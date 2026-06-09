import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/agents";
import { AGENT_LABELS } from "@/lib/agents/constants";
import type { AgentName } from "@/lib/agents/base/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentName: string }> }
) {
  try {
    const { agentName } = await params;

    // Validate agent
    const validAgents: AgentName[] = ["content", "analytics", "engagement", "trends", "pricing", "wellness"];
    if (!validAgents.includes(agentName as AgentName)) {
      return NextResponse.json({ error: `Unknown agent: ${agentName}` }, { status: 400 });
    }

    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check if creator has a custom Anthropic key
    const { data: profile } = await supabase
      .from("profiles")
      .select("custom_anthropic_key")
      .eq("id", user.id)
      .single();

    const agent = getAgent(agentName as AgentName, user.id, profile?.custom_anthropic_key ?? undefined);

    // Load conversation history if provided
    let history = [];
    if (conversationId) {
      const { data: conv } = await supabase
        .from("ai_conversations")
        .select("messages")
        .eq("id", conversationId)
        .single();
      if (conv?.messages) {
        history = conv.messages.slice(-20); // Last 20 messages for context
      }
    }

    const response = await agent.chat(message, history);

    return NextResponse.json({
      ...response,
      agentName,
      agentLabel: AGENT_LABELS[agentName as AgentName],
    });
  } catch (error: any) {
    console.error("[Agent API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
