import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock modules before importing the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          { type: "text", text: "Diagnostic mock : Votre contrat présente des clauses préoccupantes.\n\n**Actions recommandées :**\n1. Consultez un avocat\n2. Conservez vos preuves" },
        ],
      }),
    },
  })),
}));

import { POST } from "../route";
import { createClient } from "@/lib/supabase/server";

function mockRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/legal/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Build a Supabase query chain mock that returns itself for all query methods.
 * Call .resolve(value) at the end to set the final resolution value.
 */
function queryChain(resolveValue?: unknown) {
  const resolve = resolveValue;
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(() => chain),
    in: vi.fn(() => chain),
    or: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    single: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    order: vi.fn(() => chain),
    range: vi.fn(() => chain),
    gte: vi.fn(() => chain),
  };

  // The terminal method resolves the chain
  const terminal = vi.fn().mockResolvedValue(resolve ?? { data: [], error: null });
  chain.then = terminal;
  // Support both .then (async/await) and direct resolution
  for (const key of Object.keys(chain)) {
    chain[key] = vi.fn(() => chain);
  }

  // Override select to allow controlling resolution per table
  chain.select = vi.fn(() => chain);
  // Make the chain awaitable
  (chain as unknown as Promise<unknown>).then = terminal;
  (chain as unknown as Promise<unknown>).catch = vi.fn();

  return chain as unknown as ReturnType<typeof vi.fn> & {
    select: ReturnType<typeof vi.fn>;
    in: ReturnType<typeof vi.fn>;
    or: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/legal/analyze", () => {
  it("returns 400 for invalid input (empty platform)", async () => {
    const res = await POST(mockRequest({ platform: "", clauses_checked: ["clause_1"] }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Données invalides");
  });

  it("returns 400 for missing clauses_checked", async () => {
    const res = await POST(mockRequest({ platform: "onlyfans" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Données invalides");
  });

  it("returns 400 for empty clauses array", async () => {
    const res = await POST(mockRequest({ platform: "onlyfans", clauses_checked: [] }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Données invalides");
  });

  it("returns 404 when no matching clauses found", async () => {
    // Build a proper chain that resolves to empty data for the clauses query
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};
    const resolveChain = (data: unknown) => {
      const promise = Promise.resolve({ data, error: null });
      const builder: Record<string, ReturnType<typeof vi.fn>> = {};
      builder.select = vi.fn(() => builder);
      builder.in = vi.fn(() => builder);
      builder.eq = vi.fn(() => promise);
      builder.or = vi.fn(() => builder);
      builder.limit = vi.fn(() => promise);
      builder.insert = vi.fn(() => builder);
      builder.single = vi.fn(() => promise);
      builder.order = vi.fn(() => builder);
      builder.range = vi.fn(() => builder);
      builder.gte = vi.fn(() => builder);
      return builder;
    };

    const mockFrom = vi.fn().mockImplementation(() => resolveChain([]));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({ from: mockFrom });

    const res = await POST(mockRequest({ platform: "onlyfans", clauses_checked: ["non_existent"] }));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("No matching clauses found");
  });

  it("returns 200 with diagnosis for valid input", async () => {
    const mockClauses = [
      { id: "clause_1", label: "Test Clause", severity: 5, category: "financial", legal_argument: "Argument test", is_active: true },
    ];
    const mockKnowledge = [
      { id: "k1", title: "Test Knowledge", source_name: "Test", summary: "Summary test" },
    ];

    let callCount = 0;
    const chain = (data: unknown) => {
      const promise = Promise.resolve({ data, error: null });
      const builder: Record<string, ReturnType<typeof vi.fn>> = {};
      builder.select = vi.fn(() => builder);
      builder.in = vi.fn(() => builder);
      builder.eq = vi.fn(() => {
        callCount++;
        if (callCount === 1) return promise;
        return builder;
      });
      builder.or = vi.fn(() => builder);
      builder.limit = vi.fn(() => {
        // Return knowledge on the second call
        return Promise.resolve({ data: mockKnowledge, error: null });
      });
      builder.insert = vi.fn(() => builder);
      builder.single = vi.fn(() => Promise.resolve({ data: { id: "analysis-789" }, error: null }));
      builder.order = vi.fn(() => builder);
      builder.range = vi.fn(() => builder);
      builder.gte = vi.fn(() => builder);
      return builder;
    };

    const mockFrom = vi.fn().mockImplementation(() => chain(mockClauses));
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({ from: mockFrom });

    const res = await POST(mockRequest({
      platform: "onlyfans",
      clauses_checked: ["clause_1"],
      language: "fr",
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("analysis-789");
    expect(body.score).toBe(5);
    expect(body.risk_level).toBe("low");
    expect(body.diagnosis).toBeTruthy();
    expect(body.clauses_details).toHaveLength(1);
    expect(body.actions.length).toBeGreaterThanOrEqual(1);
  });

  it("handles optional parameters", async () => {
    let callCount = 0;
    const chain = () => {
      const builder: Record<string, ReturnType<typeof vi.fn>> = {};
      builder.select = vi.fn(() => builder);
      builder.in = vi.fn(() => builder);
      builder.eq = vi.fn(() => {
        callCount++;
        if (callCount <= 1) {
          return Promise.resolve({
            data: [{ id: "c1", label: "Clause", severity: 3, category: "contractual", legal_argument: "Arg", is_active: true }],
            error: null,
          });
        }
        return builder;
      });
      builder.or = vi.fn(() => builder);
      builder.limit = vi.fn(() => Promise.resolve({ data: [], error: null }));
      builder.insert = vi.fn(() => {
        // Return from insert().select().single()
        return {
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: "analysis-999" }, error: null })),
          })),
        };
      });
      builder.single = vi.fn(() => Promise.resolve({ data: { id: "analysis-999" }, error: null }));
      builder.order = vi.fn(() => builder);
      builder.range = vi.fn(() => builder);
      builder.gte = vi.fn(() => builder);
      return builder;
    };

    const mockFrom = vi.fn().mockImplementation(() => chain());
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({ from: mockFrom });

    const res = await POST(mockRequest({
      platform: "fansly",
      clauses_checked: ["c1"],
      other_clause_text: "Clause personnalisée",
      agency_name: "Mon Agence",
      language: "en",
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("analysis-999");
    expect(body.score).toBe(3);
  });

  it("returns 500 on database error", async () => {
    const builder = {
      select: vi.fn(() => builder),
      in: vi.fn(() => builder),
      eq: vi.fn(() => Promise.reject(new Error("DB down"))),
      or: vi.fn(() => builder),
      limit: vi.fn(() => builder),
    };

    const mockFrom = vi.fn(() => builder);
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({ from: mockFrom });

    const res = await POST(mockRequest({
      platform: "onlyfans",
      clauses_checked: ["clause_1"],
    }));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
