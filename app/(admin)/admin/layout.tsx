import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "./components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Bypass auth in development
  if (process.env.NODE_ENV === "development") {
    return <AdminShell userName="Admin" userRole="admin" userAvatar={null}>{children}</AdminShell>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;

  if (!role || !["admin", "manager"].includes(role)) {
    redirect("/");
  }

  return (
    <AdminShell
      userName={profile?.full_name ?? user.email?.split("@")[0] ?? "Admin"}
      userRole={role}
      userAvatar={profile?.avatar_url ?? null}
    >
      {children}
    </AdminShell>
  );
}
