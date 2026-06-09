import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { creator_id } = body;
  if (!creator_id) {
    return NextResponse.json({ error: "creator_id requis" }, { status: 400 });
  }

  // Get creator profile
  const { data: creator } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", creator_id)
    .single();

  if (!creator) return NextResponse.json({ error: "Créateur introuvable" }, { status: 404 });

  // Get available managers with their assignments
  const { data: managers } = await supabase
    .from("team_members")
    .select(`
      id, full_name, email, role, metadata,
      assignments:creator_manager_assignments(
        creator:profiles(id, full_name, display_name, department)
      )
    `)
    .eq("status", "active")
    .in("role", ["senior_manager", "manager"])
    .order("role", { ascending: true });

  // Filter by capacity
  const candidates = (managers || []).map((m: any) => ({
    id: m.id,
    full_name: m.full_name,
    email: m.email,
    role: m.role,
    current_load: m.assignments?.length || 0,
    max_capacity: m.role === "senior_manager" ? 20 : 12,
    departments: [...new Set((m.assignments || []).map((a: any) => a.creator?.department).filter(Boolean))],
    languages: m.metadata?.languages || [],
  })).filter((m) => m.current_load < m.max_capacity);

  if (candidates.length === 0) {
    return NextResponse.json({ error: "Aucun manager disponible" }, { status: 409 });
  }

  // Use AI to suggest best match
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: `Suggère le meilleur manager pour ce créateur.

CRÉATEUR :
${JSON.stringify(creator, null, 2)}

MANAGERS DISPONIBLES :
${JSON.stringify(candidates, null, 2)}

Critères :
1. Charge actuelle (préférer moins chargés)
2. Spécialisation par matching de département
3. Langues parlées si pertinentes
4. Rôle (senior_manager peut prendre + de charge)

Retourne UNIQUEMENT du JSON : { "suggested_manager_id": "...", "reasoning": "..." }`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  let result: { suggested_manager_id?: string; reasoning?: string };
  try {
    result = JSON.parse(text);
  } catch {
    // Fallback: take least loaded manager
    const sorted = [...candidates].sort((a, b) => a.current_load - b.current_load);
    result = {
      suggested_manager_id: sorted[0].id,
      reasoning: "Fallback: least loaded manager",
    };
  }

  const suggested = candidates.find((c) => c.id === result.suggested_manager_id);
  if (!suggested) {
    // Fallback
    const sorted = [...candidates].sort((a, b) => a.current_load - b.current_load);
    result.suggested_manager_id = sorted[0].id;
    result.reasoning = "Fallback: AI suggestion not available, least loaded selected";
  }

  return NextResponse.json({
    suggestion: result,
    candidates: candidates.map((c) => ({
      id: c.id,
      full_name: c.full_name,
      role: c.role,
      current_load: c.current_load,
      max_capacity: c.max_capacity,
      departments: c.departments,
    })),
  });
}
