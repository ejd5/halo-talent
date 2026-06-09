export interface Tool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  execute: (input: any, creatorId: string) => Promise<any>;
}

export interface ToolCall {
  tool: string;
  input: any;
}

export interface ToolResult {
  output: any;
  error?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string | any[];
}

export interface AgentResponse {
  message: string;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  artifacts?: any[];
}

export type AgentName = "content" | "analytics" | "engagement" | "trends" | "pricing" | "wellness";
