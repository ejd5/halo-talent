import { createClient } from "@/lib/supabase/server";
import type { SegmentFilter } from "@/lib/atlas/crm/segments";

// ─── Types ──────────────────────────────────────────────────

export interface CampaignRecipient {
  id: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  fan_tier: string;
  fan_score: number;
  language: string;
  country: string | null;
  total_spent: number;
  tags: string[] | null;
  custom_fields: Record<string, unknown>;
}

export interface CampaignContent {
  blocks: ContentBlock[];
}

export interface ContentBlock {
  type: "header" | "text" | "image" | "button" | "video" | "divider" | "footer";
  content?: string;
  src?: string;
  url?: string;
  label?: string;
  align?: "left" | "center" | "right";
  style?: Record<string, string>;
}

// ─── Get eligible recipients from filters ──────────────────

export async function getRecipientsForSegment(
  creatorId: string,
  filters: SegmentFilter[],
  customFilters?: Record<string, any>
): Promise<CampaignRecipient[]> {
  const supabase = await createClient();

  let query = supabase
    .from("atlas_fans")
    .select("id, email, display_name, first_name, fan_tier, fan_score, language, country, total_spent, tags, custom_fields, email_bounced")
    .eq("creator_id", creatorId)
    .eq("status", "active")
    .eq("email_consent", true)
    .not("email", "is", null)
    .eq("email_bounced", false);

  // Apply segment filters
  for (const f of filters || []) {
    if (f.field === "status" || f.field === "email_consent") continue; // already enforced
    switch (f.operator) {
      case "eq": query = (query as any).eq(f.field, f.value); break;
      case "neq": query = (query as any).neq(f.field, f.value); break;
      case "gt": query = (query as any).gt(f.field, f.value); break;
      case "gte": query = (query as any).gte(f.field, f.value); break;
      case "lt": query = (query as any).lt(f.field, f.value); break;
      case "lte": query = (query as any).lte(f.field, f.value); break;
      case "in": query = (query as any).in(f.field, f.value); break;
      case "contains": query = (query as any).contains(f.field, f.value); break;
    }
  }

  // Apply custom filters
  if (customFilters) {
    if (customFilters.tier) query = (query as any).in("fan_tier", customFilters.tier);
    if (customFilters.min_score) query = (query as any).gte("fan_score", customFilters.min_score);
    if (customFilters.max_score) query = (query as any).lte("fan_score", customFilters.max_score);
    if (customFilters.min_spent) query = (query as any).gte("total_spent", customFilters.min_spent);
    if (customFilters.max_spent) query = (query as any).lte("total_spent", customFilters.max_spent);
    if (customFilters.country) query = (query as any).eq("country", customFilters.country);
    if (customFilters.language) query = (query as any).eq("language", customFilters.language);
    if (customFilters.tags) query = (query as any).overlaps("tags", customFilters.tags);
    if (customFilters.not_tags) query = (query as any).not("tags", "cs", customFilters.not_tags);
    if (customFilters.acquired_via) query = (query as any).eq("acquired_via", customFilters.acquired_via);
  }

  const { data } = await query;
  return (data || []) as CampaignRecipient[];
}

// ─── Estimate recipient count ─────────────────────────────

export async function estimateSegmentCount(
  creatorId: string,
  filters: SegmentFilter[],
  customFilters?: Record<string, any>
): Promise<number> {
  const recipients = await getRecipientsForSegment(creatorId, filters, customFilters);
  return recipients.length;
}

// ─── Template variable replacement ───────────────────────

export function replaceVariables(
  content: string,
  vars: Record<string, string>
): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

// ─── Build email HTML from content blocks ────────────────

export function buildEmailHtml(
  blocks: ContentBlock[],
  vars: Record<string, string>
): string {
  const renderBlock = (block: ContentBlock): string => {
    switch (block.type) {
      case "header":
        return `<h2 style="font-size:24px;font-weight:700;margin:24px 0 12px;text-align:${block.align || "left"}">${replaceVariables(block.content || "", vars)}</h2>`;
      case "text":
        return `<p style="font-size:15px;line-height:1.7;margin:0 0 16px;text-align:${block.align || "left"}">${replaceVariables(block.content || "", vars)}</p>`;
      case "image":
        return `<img src="${block.src || ""}" alt="" style="max-width:100%;height:auto;border-radius:4px;margin:12px 0;display:block" />`;
      case "button":
        return `<div style="text-align:${block.align || "center"};margin:16px 0"><a href="${replaceVariables(block.url || "#", vars)}" style="display:inline-block;background-color:var(--or, #D8A95B);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:4px;font-size:15px;font-weight:600">${block.label || "Cliquez ici"}</a></div>`;
      case "video":
        return `<div style="margin:12px 0;text-align:center;padding:32px 0;background-color:rgba(0,0,0,0.05);border-radius:4px"><p style="font-size:13px;color:#888">🎬 ${block.content || "Vidéo"}</p></div>`;
      case "divider":
        return `<hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:24px 0" />`;
      case "footer":
        return `<div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(0,0,0,0.08);font-size:12px;color:#888;text-align:center">
          ${replaceVariables(block.content || "", vars)}
          <p style="margin:8px 0 0"><a href="{{unsubscribe_url}}" style="color:#888;text-decoration:underline">Se désabonner</a></p>
        </div>`;
      default:
        return "";
    }
  };

  const blocksHtml = blocks.map(renderBlock).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin:0; padding:0; background-color:#f4f4f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    .email-container { max-width:600px; margin:0 auto; background-color:#ffffff; }
    .email-content { padding:24px 32px; }
    @media (max-width:480px) { .email-content { padding:16px; } }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      ${blocksHtml}
    </div>
  </div>
  <img src="{{tracking_pixel}}" alt="" width="1" height="1" style="display:none" />
</body>
</html>`;
}

// ─── Unsubscribe token management ─────────────────────────

export async function generateUnsubToken(fanId: string): Promise<string> {
  const supabase = await createClient();
  const token = crypto.randomUUID();
  await supabase.from("atlas_unsubscribe_tokens").insert({
    fan_id: fanId,
    token,
  });
  return token;
}

export async function verifyUnsubToken(token: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("atlas_unsubscribe_tokens")
    .select("fan_id")
    .eq("token", token)
    .eq("used", false)
    .gte("expires_at", new Date().toISOString())
    .single();
  return data?.fan_id || null;
}

export async function markUnsubTokenUsed(token: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("atlas_unsubscribe_tokens").update({ used: true }).eq("token", token);
}

// ─── AI Personalization ───────────────────────────────────

export async function personalizeWithAI(
  content: CampaignContent,
  recipient: CampaignRecipient
): Promise<CampaignContent> {
  const personalizedBlocks = content.blocks.map((block) => {
    if (block.type === "text" || block.type === "header") {
      let text = block.content || "";

      // Personalize by tier
      const tierGreetings: Record<string, string> = {
        vip: "Cher VIP",
        whale: "Cher membre Premium",
        engaged: "Cher fan",
        warm: "Cher ami",
        cold: "Bonjour",
      };
      text = text.replace("{{greeting}}", tierGreetings[recipient.fan_tier] || "Bonjour");

      // Personalize by language
      if (recipient.language === "en") {
        text = text
          .replace("Bonjour", "Hello")
          .replace("cher fan", "dear fan")
          .replace("chers", "dear");
      }

      return { ...block, content: text };
    }
    if (block.type === "button" && block.url) {
      const url = new URL(block.url);
      url.searchParams.set("utm_source", "email");
      url.searchParams.set("utm_medium", "campaign");
      url.searchParams.set("utm_content", recipient.fan_tier);
      return { ...block, url: url.toString() };
    }
    return block;
  });

  return { blocks: personalizedBlocks };
}

// ─── Send campaign via Resend ─────────────────────────────

export async function sendCampaignEmail(
  to: string,
  fromName: string,
  fromEmail: string,
  subject: string,
  html: string,
  tags?: { name: string; value: string }[],
  listUnsubscribeUrl?: string
) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const headers: Record<string, string> = {};
  if (listUnsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${listUnsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  return resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    headers,
    tags,
  });
}

// ─── Estimate credit cost for AI personalization ─────────

export function estimateAICreditCost(recipientCount: number): number {
  return recipientCount; // 1 credit per personalized email
}

// ─── Default templates ───────────────────────────────────

export const EMAIL_TEMPLATES: Record<string, CampaignContent> = {
  welcome: {
    blocks: [
      { type: "header", content: "Bienvenue {{first_name}} ! 🎉", align: "center" },
      { type: "text", content: "Je suis tellement content que tu aies rejoint mon univers. Prépare-toi à du contenu exclusif, des avant-premières et bien plus encore !", align: "left" },
      { type: "image", src: "" },
      { type: "button", label: "Découvrir mon dernier post", url: "https://refundize.com/studio", align: "center" },
      { type: "divider" },
      { type: "footer", content: "© 2026, Merci de faire partie de l'aventure ✨" },
    ],
  },
  new_content: {
    blocks: [
      { type: "header", content: "Nouveau contenu 🔥", align: "center" },
      { type: "text", content: "{{greeting}} {{first_name}},\n\nJ'ai quelque chose de spécial pour toi ! Mon nouveau contenu vient de sortir et je pense sincèrement que tu vas adorer.", align: "left" },
      { type: "image", src: "" },
      { type: "button", label: "Voir le contenu →", url: "https://refundize.com/studio", align: "center" },
      { type: "divider" },
      { type: "footer", content: "© 2026, Tu reçois cet email car tu fais partie de ma communauté." },
    ],
  },
  promo_ppv: {
    blocks: [
      { type: "header", content: "Offre exclusive pour toi 🎁", align: "center" },
      { type: "text", content: "{{greeting}} {{first_name}},\n\nJ'ai préparé une offre spéciale, juste pour toi. C'est le moment parfait pour découvrir ce que j'ai créé.", align: "left" },
      { type: "image", src: "" },
      { type: "button", label: "Voir l'offre", url: "https://refundize.com/studio", align: "center" },
      { type: "divider" },
      { type: "footer", content: "© 2026, Offre à durée limitée." },
    ],
  },
  reengagement: {
    blocks: [
      { type: "header", content: "Tu me manques ! 💫", align: "center" },
      { type: "text", content: "{{greeting}} {{first_name}},\n\nÇa fait un moment et je commençais à m'ennuyer. J'ai préparé plein de nouvelles surprises dont tu vas vouloir entendre parler.", align: "left" },
      { type: "button", label: "Revenir voir", url: "https://refundize.com/studio", align: "center" },
      { type: "divider" },
      { type: "footer", content: "© 2026, Tu reçois cet email car tu es un membre de ma communauté." },
    ],
  },
  birthday: {
    blocks: [
      { type: "header", content: "Joyeux anniversaire {{first_name}} ! 🎂", align: "center" },
      { type: "text", content: "{{greeting}} {{first_name}},\n\nAujourd'hui c'est ton jour et je voulais te souhaiter un très joyeux anniversaire. J'ai un petit quelque chose de spécial pour toi...", align: "left" },
      { type: "button", label: "Mon cadeau 🎁", url: "https://refundize.com/studio", align: "center" },
      { type: "divider" },
      { type: "footer", content: "© 2026, Joyeux anniversaire de la part de toute l'équipe ! 🎉" },
    ],
  },
};
