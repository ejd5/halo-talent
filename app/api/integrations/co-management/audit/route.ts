import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data } = await supabase
    .from("co_management_audit")
    .select(`
      *,
      platform_co_management!inner (
        platform, manager_email, access_level
      )
    `)
    .eq("creator_id", user.id)
    .order("performed_at", { ascending: false })
    .limit(100);

  return NextResponse.json({ audit: data ?? [] });
}
