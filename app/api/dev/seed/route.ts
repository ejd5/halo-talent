import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seulement en développement" }, { status: 403 });
  }

  const supabase = createAdminClient();

  // Créer un utilisateur test via l'API Admin (service_role)
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: "admin@halo-talent.com",
    password: "admin123",
    email_confirm: true,
    user_metadata: { full_name: "Admin WTF" },
  });

  if (createError) {
    // Si l'utilisateur existe déjà, on le récupère
    if (createError.message.includes("already exists")) {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const existingUser = existing.users.find((u) => u.email === "admin@halo-talent.com");
      if (existingUser) {
        // Mettre à jour son profil en admin
        await supabase
          .from("profiles")
          .update({ role: "admin", status: "active" })
          .eq("id", existingUser.id);

        return NextResponse.json({
          message: "L'utilisateur existe déjà.",
          email: "admin@halo-talent.com",
          password: "admin123",
        });
      }
    }
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  // Mettre à jour son profil en admin
  await supabase
    .from("profiles")
    .update({ role: "admin", status: "active" })
    .eq("id", user.user.id);

  return NextResponse.json({
    message: "Compte admin créé avec succès !",
    email: "admin@halo-talent.com",
    password: "admin123",
  });
}
