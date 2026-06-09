import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SOCIAL_BRAND_COLORS } from "@/lib/atlas/lead-capture/types";
import CaptureForm from "@/components/lead-capture/CaptureForm";
import type { LeadCapturePage, LeadCaptureLink } from "@/lib/atlas/lead-capture/types";

/* ─── Server fetch ─── */
async function getPage(slug: string) {
  try {
    const admin = createAdminClient();
    const { data: page } = await admin
      .from("lead_capture_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (!page) return null;

    let links: LeadCaptureLink[] = [];
    if (page.page_type === "link_in_bio") {
      const { data: l } = await admin
        .from("lead_capture_links")
        .select("*")
        .eq("page_id", page.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      links = l ?? [];
    }

    // Fetch creator info for push opt-in
    let creatorHandle = "";
    let creatorName = "";
    const { data: profile } = await admin
      .from("profiles")
      .select("handle, display_name")
      .eq("id", page.creator_id)
      .single();
    if (profile) {
      creatorHandle = profile.handle || "";
      creatorName = profile.display_name || creatorHandle || "";
    }

    // Fire-and-forget view increment
    (async () => {
      try { await admin.from("lead_capture_pages").update({ views: (page.views || 0) + 1 }).eq("id", page.id).maybeSingle(); } catch {}
    })();

    return { page: page as LeadCapturePage, links, creatorHandle, creatorName };
  } catch {
    return null;
  }
}

/* ─── Page ─── */
export default async function LeadCapturePublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPage(slug);
  if (!data) notFound();

  const { page, links, creatorHandle, creatorName } = data;
  const isLib = page.page_type === "link_in_bio";

  const bgStyle: React.CSSProperties = page.background_type === "image"
    ? { backgroundImage: `url(${page.background_value})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
    : page.background_type === "video"
    ? { backgroundColor: "#1A1614" }
    : { backgroundColor: page.background_value as string };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      ...bgStyle,
      fontFamily: page.font_family || "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 400, width: "100%", padding: "40px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {/* Avatar */}
          {page.avatar_url ? (
            <img src={page.avatar_url} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} />
          ) : page.display_name ? (
            <div style={{
              width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 700,
              backgroundColor: `${page.accent_color}22`, color: page.accent_color, marginBottom: 12,
            }}>
              {page.display_name.charAt(0).toUpperCase()}
            </div>
          ) : null}

          {/* Name */}
          {page.display_name && (
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: page.text_color }}>{page.display_name}</p>
          )}

          {/* Bio */}
          {page.bio && (
            <p style={{ margin: "4px 0 20px", fontSize: 12, lineHeight: 1.5, color: `${page.text_color}99` }}>{page.bio}</p>
          )}

          {/* Link in Bio */}
          {isLib && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              {links.map((link) => {
                const brandColor = link.icon ? SOCIAL_BRAND_COLORS[link.icon] : undefined;
                const finalColor = brandColor || page.accent_color;
                return (
                  <a
                    key={link.id}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block", textAlign: "center", padding: "12px 16px", fontSize: 13, fontWeight: 500,
                      borderRadius: 0, textDecoration: "none",
                      backgroundColor: `${finalColor}15`,
                      border: `1px solid ${finalColor}30`,
                      color: finalColor,
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}

          {/* Capture form */}
          {!isLib && (
            <>
              {page.headline && (
                <h1 style={{
                  margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2,
                  fontFamily: "'Syne', system-ui, sans-serif", color: page.text_color,
                }}>
                  {page.headline}
                </h1>
              )}
              {page.subtitle && (
                <p style={{ margin: "8px 0 24px", fontSize: 13, lineHeight: 1.5, color: `${page.text_color}99` }}>{page.subtitle}</p>
              )}
              <CaptureForm
                slug={page.slug}
                cta_text={page.cta_text}
                confirmation_message={page.confirmation_message}
                collect_first_name={page.collect_first_name}
                consent_text={page.consent_text}
                accent_color={page.accent_color}
                text_color={page.text_color}
                creator_handle={creatorHandle}
                creator_name={creatorName}
                creator_id={page.creator_id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
