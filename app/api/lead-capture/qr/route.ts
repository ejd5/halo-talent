import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3005";
const QR_API = "https://api.qrserver.com/v1/create-qr-code";

export async function GET(request: NextRequest) {
  try {
    const pageId = request.nextUrl.searchParams.get("page_id");
    const size = parseInt(request.nextUrl.searchParams.get("size") || "300");
    const color = request.nextUrl.searchParams.get("color") || "C75B39";

    if (!pageId) {
      return NextResponse.json({ error: "page_id requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // Get the page to build the URL
    const { data: page } = await supabase
      .from("lead_capture_pages")
      .select("slug, title")
      .eq("id", pageId)
      .eq("creator_id", user.id)
      .single();

    if (!page) {
      return NextResponse.json({ error: "Page introuvable" }, { status: 404 });
    }

    const pageUrl = `${PUBLIC_URL}/${page.slug}?utm_source=qr_${pageId.slice(0, 8)}`;
    const qrImageUrl = `${QR_API}?size=${size}x${size}&data=${encodeURIComponent(pageUrl)}&color=${color}&margin=12&bgcolor=1A1614`;

    return NextResponse.json({
      url: pageUrl,
      qr_image: qrImageUrl,
      download_url: `${QR_API}?size=${Math.max(size, 1024)}x${Math.max(size, 1024)}&data=${encodeURIComponent(pageUrl)}&color=${color}&margin=12&bgcolor=1A1614`,
    });
  } catch (err) {
    console.error("[LEAD-CAPTURE QR] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Alias: same as GET but with body
  return GET(request);
}
