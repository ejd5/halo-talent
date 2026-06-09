import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 1. Auth status
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 2. Try query as authenticated user
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "none")
    .maybeSingle();

  // 3. Try with admin client for comparison
  let adminProfile = null;
  let adminError = null;
  if (user) {
    const admin = createAdminClient();
    const result = await admin.from("profiles").select("*").eq("id", user.id).maybeSingle();
    adminProfile = result.data;
    adminError = result.error;
  }

  // 4. List all profiles (admin)
  const admin = createAdminClient();
  const { data: allProfiles } = await admin.from("profiles").select("id, email, role").limit(10);

  return NextResponse.json({
    auth: { user_id: user?.id, email: user?.email, error: authError?.message || null },
    profile_query: { data: profile, error: profileError ? { code: profileError.code, message: profileError.message, details: profileError.details, hint: profileError.hint } : null },
    admin_query: { data: adminProfile, error: adminError ? { message: adminError.message } : null },
    all_profiles: allProfiles,
  });
}
