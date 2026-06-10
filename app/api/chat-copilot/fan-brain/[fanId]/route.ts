import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FanBrainService } from "@/lib/chat-copilot/fan-brain";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { fanId } = await params;
  const isExport = request.nextUrl.searchParams.get("export") === "true";

  try {
    const service = new FanBrainService(fanId, user.id);

    if (isExport) {
      const brain = await service.export();
      return NextResponse.json(brain);
    }

    const brain = await service.load();
    return NextResponse.json(brain);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { fanId } = await params;
  const body = await request.json();
  const { segment, data, action } = body;

  // Support adding manual notes via dedicated action
  if (action === "note") {
    if (!data?.content) {
      return NextResponse.json({ error: "content requis dans data" }, { status: 400 });
    }
    try {
      const service = new FanBrainService(fanId, user.id);
      await service.addNote(data.content);
      return NextResponse.json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!segment || !data) {
    return NextResponse.json(
      { error: "segment et data requis" },
      { status: 400 },
    );
  }

  const validSegments = ["profile", "financial", "personality", "conversation", "risk", "tags"];
  if (!validSegments.includes(segment)) {
    return NextResponse.json(
      { error: `segment invalide. Valeurs acceptées: ${validSegments.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const service = new FanBrainService(fanId, user.id);
    await service.update(segment, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
