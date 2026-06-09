import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const adminRoutes = ["/admin"];
const sensitiveActions = ["delete", "payout"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Pro-mode acknowledgment check ---
  if (pathname.startsWith("/dashboard/integrations/pro-mode")) {
    // Always allow the acknowledge page
    if (pathname === "/dashboard/integrations/pro-mode/acknowledge") {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return supabaseResponse;

    const { data: ack } = await supabase
      .from("pro_mode_acknowledgments")
      .select("id")
      .eq("creator_id", user.id)
      .single();

    if (!ack) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations/pro-mode/acknowledge", request.url),
      );
    }

    return supabaseResponse;
  }

  // --- Admin auth check ---
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Bypass auth in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated → redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Check user role from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;

  // Not admin/manager → redirect to home
  if (!role || !["admin", "manager"].includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // For sensitive actions, require 'admin' role
  if (
    role === "manager" &&
    sensitiveActions.some((action) => pathname.includes(action))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/integrations/pro-mode/:path*"],
};
