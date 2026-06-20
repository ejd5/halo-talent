import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const sensitiveActions = ["delete", "payout"];

/**
 * Next.js 16 Unified Proxy
 * - Replaces middleware.ts
 * - Handles authentication guards, admin role checks, and integrations acknowledgments
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validate the user token against Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Route definitions
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/halo") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/studio");

  const isAdminRoute = pathname.startsWith("/admin");

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const isProModeRoute = pathname.startsWith("/dashboard/integrations/pro-mode");

  // 1. Authentication guards
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const redirect = request.nextUrl.searchParams.get("redirect");
    const url = request.nextUrl.clone();
    url.pathname = redirect || "/dashboard";
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  // 2. Pro Mode acknowledgment guard
  if (user && isProModeRoute && pathname !== "/dashboard/integrations/pro-mode/acknowledge") {
    const { data: ack } = await supabase
      .from("pro_mode_acknowledgments")
      .select("id")
      .eq("creator_id", user.id)
      .single();

    if (!ack) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations/pro-mode/acknowledge", request.url)
      );
    }
  }

  // 3. Admin Authorization Check
  if (isAdminRoute) {
    // Bypass auth check in local development if needed, but enforce in production
    if (process.env.NODE_ENV !== "development") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user!.id)
        .single();

      const role = profile?.role as string | undefined;

      // Not admin/manager → redirect to home
      if (!role || !["admin", "manager"].includes(role)) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // Sensitive actions require full admin role
      if (
        role === "manager" &&
        sensitiveActions.some((action) => pathname.includes(action))
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, videos, sw.js, robots.txt, etc.)
     * - API routes
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico|txt|js|json)$|api/).*)",
  ],
};
