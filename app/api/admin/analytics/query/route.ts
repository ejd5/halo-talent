import { type NextRequest, NextResponse } from "next/server";

const tools = [
  {
    name: "query_revenues",
    description: "Query revenue data. Returns monthly brut/commission/net with optional filters.",
    input_schema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "ISO date (e.g. 2025-01-01)" },
        end_date: { type: "string" },
        creator_id: { type: "string" },
        platform: { type: "string", enum: ["YouTube", "Instagram", "TikTok", "OnlyFans", "Twitter", "LinkedIn"] },
        department: { type: "string", enum: ["Music", "Beauté & Mode", "Sport", "Business", "Lifestyle"] },
      },
    },
  },
  {
    name: "query_creators",
    description: "Query creators data. Returns list with revenue, status, department.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["active", "inactive"] },
        department: { type: "string" },
        min_revenue: { type: "number" },
      },
    },
  },
  {
    name: "query_applications",
    description: "Query applications stats. Returns count by status, source, period.",
    input_schema: {
      type: "object",
      properties: {
        start_date: { type: "string" },
        end_date: { type: "string" },
        status: { type: "string", enum: ["pending", "review", "approved", "rejected"] },
        source: { type: "string" },
      },
    },
  },
  {
    name: "query_web_analytics",
    description: "Query web traffic and conversion data.",
    input_schema: {
      type: "object",
      properties: {
        metric: { type: "string", enum: ["pageviews", "visitors", "conversion", "sources", "devices"] },
        period: { type: "string", enum: ["7d", "30d", "90d"] },
      },
    },
  },
];

const MOCK_DB: Record<string, unknown> = {
  revenue_leader: "Clara W. avec 42 500€ brut ce mois-ci",
  music_vs_sport: "Music : 185 000€ (5 créateurs) | Sport : 68 000€ (4 créateurs)",
  platform_leader: "YouTube : 245 000€ | Instagram : 128 000€ | TikTok : 89 000€ | OnlyFans : 112 000€",
  declining_creators: "Emma V. (-28%), Hugo P. (-12%), Léa R. (-8%)",
  best_creator: "Marc T. avec +45% de croissance mensuelle",
};

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "query_revenues":
      return JSON.stringify({
        total_brut: 468000,
        total_commission: 82400,
        total_net: 385600,
        creator_count: 21,
        period: (args.start_date ?? "2026-01-01") + " to " + (args.end_date ?? "2026-06-01"),
        top_creator: MOCK_DB.revenue_leader,
        by_department: MOCK_DB.music_vs_sport,
        by_platform: MOCK_DB.platform_leader,
      });
    case "query_creators":
      return JSON.stringify({
        total: 21,
        active: 18,
        inactive: 3,
        by_department: { Music: 5, "Beauté & Mode": 6, Sport: 4, Business: 3, Lifestyle: 2 },
        top_growth: MOCK_DB.best_creator,
        declining: MOCK_DB.declining_creators,
      });
    case "query_applications":
      return JSON.stringify({
        total: 650,
        pending: 120,
        review: 80,
        approved: 180,
        rejected: 270,
        conversion_rate: "27.7%",
        avg_approval_time: "12 jours",
      });
    case "query_web_analytics":
      return JSON.stringify({
        pageviews: 28850,
        visitors: 22100,
        conversion_rate: "3.8%",
        top_source: "Organic (38%)",
        devices: { mobile: "62%", desktop: "31%", tablet: "7%" },
      });
    default:
      return JSON.stringify({ error: "Tool not found" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ error: "Question requise" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback: simple keyword matching
      const q = question.toLowerCase();
      if (q.includes("rentable") || q.includes("meilleur créateur")) {
        return NextResponse.json({ answer: `Le créateur le plus rentable ce trimestre est ${MOCK_DB.revenue_leader}. ${MOCK_DB.best_creator}` });
      }
      if (q.includes("music") || q.includes("sport")) {
        return NextResponse.json({ answer: MOCK_DB.music_vs_sport });
      }
      if (q.includes("plateforme")) {
        return NextResponse.json({ answer: MOCK_DB.platform_leader });
      }
      if (q.includes("baisse") || q.includes("baisse")) {
        return NextResponse.json({ answer: `Créateurs en baisse : ${MOCK_DB.declining_creators}. Je recommande de planifier un point avec Emma V. pour investiguer la cause de sa baisse.` });
      }
      return NextResponse.json({ answer: "Je peux vous renseigner sur les revenus, créateurs, candidatures et trafic web. Essayez : \"Quel est mon créateur le plus rentable ?\"" });
    }

    // Real Claude tool calling
    const messages: { role: string; content: any }[] = [
      {
        role: "system",
        content: "You are an analytics assistant for Where Talent Forms, a creator management agency. Answer in French. Use the available tools to fetch data and provide clear, concise answers with numbers. If you need multiple data points, call tools sequentially.",
      },
      { role: "user", content: question },
    ];

    let finalAnswer = "";
    let hasMoreTools = true;
    let iterations = 0;

    while (hasMoreTools && iterations < 5) {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools,
          messages,
        }),
      });

      const data = await resp.json();
      const content = data.content ?? [];

      // Check for tool use
      const toolUses = content.filter((c: { type: string }) => c.type === "tool_use");
      const textBlocks = content.filter((c: { type: string }) => c.type === "text");

      if (toolUses.length > 0) {
        messages.push({ role: "assistant", content: content });

        for (const toolUse of toolUses) {
          const result = await executeTool(toolUse.name, toolUse.input ?? {});
          messages.push({
            role: "user",
            content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }],
          });
        }
      } else {
        hasMoreTools = false;
        finalAnswer = textBlocks.map((t: { text: string }) => t.text).join(" ") || "Aucune réponse générée.";
      }
      iterations++;
    }

    return NextResponse.json({ answer: finalAnswer || "Je n'ai pas pu traiter votre demande complète, mais voici ce que j'ai trouvé." });
  } catch (error) {
    console.error("Analytics query error:", error);
    return NextResponse.json({ error: "Erreur lors du traitement" }, { status: 500 });
  }
}
