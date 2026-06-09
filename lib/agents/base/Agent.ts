import Anthropic from "@anthropic-ai/sdk";
import type { Tool, ToolCall, ToolResult, AgentResponse } from "./types";
import { getCreatorDNA, injectDNAIntoPrompt } from "@/lib/dna/helpers";

export abstract class Agent {
  protected anthropic: Anthropic;
  protected creatorId: string;
  protected conversationId?: string;
  protected systemPrompt: string;

  constructor(creatorId: string, apiKey?: string) {
    this.creatorId = creatorId;
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY || "mock",
    });
    this.systemPrompt = this.getSystemPrompt();
  }

  abstract getName(): string;
  abstract getSystemPrompt(): string;
  abstract getTools(): Tool[];

  async chat(userMessage: string, history: any[] = []): Promise<AgentResponse> {
    const tools = this.getTools();
    const toolDefs = tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema as Record<string, unknown>,
    }));

    // Injecter l'ADN du créateur dans le system prompt (mode dégradé si pas de DNA)
    const dna = await getCreatorDNA(this.creatorId).catch(() => null);
    const systemPrompt = injectDNAIntoPrompt(this.systemPrompt, dna);

    const messages: Anthropic.MessageParam[] = [
      ...history.map((m: any) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      })),
      { role: "user" as const, content: userMessage },
    ];

    const allToolCalls: ToolCall[] = [];
    const allToolResults: ToolResult[] = [];
    let maxIterations = 10;

    let response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      tools: toolDefs as any,
      messages: messages as any,
    });

    while (response.stop_reason === "tool_use" && maxIterations > 0) {
      maxIterations--;

      const toolUses = response.content.filter(
        (c): c is Anthropic.ToolUseBlock => c.type === "tool_use"
      );

      (messages as any[]).push({
        role: "assistant",
        content: response.content,
      });

      const toolResults: any[] = await Promise.all(
        toolUses.map(async (toolUse) => {
          const tool = tools.find((t) => t.name === toolUse.name);
          if (!tool) {
            return { type: "tool_result", tool_use_id: toolUse.id, content: `Tool ${toolUse.name} not found`, is_error: true };
          }
          try {
            const result = await tool.execute(toolUse.input, this.creatorId);
            allToolCalls.push({ tool: toolUse.name, input: toolUse.input });
            allToolResults.push({ output: result });
            return { type: "tool_result", tool_use_id: toolUse.id, content: JSON.stringify(result) };
          } catch (error: any) {
            allToolCalls.push({ tool: toolUse.name, input: toolUse.input });
            allToolResults.push({ output: null, error: error.message });
            return { type: "tool_result", tool_use_id: toolUse.id, content: error.message, is_error: true };
          }
        })
      );

      (messages as any[]).push({
        role: "user",
        content: toolResults,
      });

      response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        tools: toolDefs as any,
        messages: messages as any,
      });
    }

    const finalText = response.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n");

    await this.saveConversation(userMessage, finalText, allToolCalls);

    return {
      message: finalText,
      toolCalls: allToolCalls,
      toolResults: allToolResults,
    };
  }

  private async saveConversation(userMsg: string, agentMsg: string, toolCalls: ToolCall[]) {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const entry = {
        role: "assistant",
        content: agentMsg,
        tool_calls: toolCalls,
        timestamp: new Date().toISOString(),
      };

      if (this.conversationId) {
        const { data: existing } = await supabase
          .from("ai_conversations")
          .select("messages")
          .eq("id", this.conversationId)
          .single();

        const existingMessages = Array.isArray(existing?.messages) ? existing.messages : [];
        await supabase
          .from("ai_conversations")
          .update({
            messages: [
              ...existingMessages,
              { role: "user", content: userMsg, timestamp: new Date().toISOString() },
              entry,
            ],
            updated_at: new Date().toISOString(),
          })
          .eq("id", this.conversationId);
      } else {
        const { data } = await supabase
          .from("ai_conversations")
          .insert({
            creator_id: this.creatorId,
            agent: this.getName(),
            topic: userMsg.slice(0, 100),
            messages: [
              { role: "user", content: userMsg, timestamp: new Date().toISOString() },
              entry,
            ],
          })
          .select()
          .single();
        if (data) this.conversationId = data.id;
      }
    } catch (err) {
      console.error("[Agent] Failed to persist conversation:", err);
    }
  }

  async runProactiveTask(_taskName: string): Promise<void> {
    // Override in subclasses
  }
}
