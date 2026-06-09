import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: clauses, error } = await supabase
      .from("abusive_clauses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    // Group by category
    const grouped: Record<string, typeof clauses> = {};
    for (const clause of clauses || []) {
      if (!grouped[clause.category]) grouped[clause.category] = [];
      grouped[clause.category].push(clause);
    }

    return NextResponse.json({
      clauses: clauses || [],
      grouped,
    });
  } catch (error) {
    console.error("Legal clauses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
