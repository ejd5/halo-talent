import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Increment usage count
    const { error } = await supabase.rpc("increment_template_uses", { template_id: id });
    if (error) {
      // Fallback: select + update
      const { data: current } = await supabase.from("templates").select("uses_count").eq("id", id).single();
      if (current) {
        await supabase.from("templates").update({ uses_count: (current as any).uses_count + 1 }).eq("id", id);
      }
    }

    // Fetch the template data to return
    const { data: template } = await supabase
      .from("templates")
      .select("id, name, type, template_data, target_platforms, target_aspect_ratios")
      .eq("id", id)
      .single();

    if (!template) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (err) {
    console.error("[TEMPLATE USE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
