import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Authenticate the current request as an admin or manager.
 * Returns the authenticated user on success, or an error Response on failure.
 *
 * Usage in any admin API route:
 *
 *   const auth = await requireAdmin();
 *   if (auth instanceof NextResponse) return auth;
 *   // auth.user is the authenticated admin/manager
 */
export async function requireAdmin(): Promise<
  | { user: { id: string; email?: string }; role: string }
  | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "manager"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return { user: { id: user.id, email: user.email }, role: profile.role };
}
