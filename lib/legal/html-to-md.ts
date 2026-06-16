/**
 * Minimal HTML → Markdown converter for CGU pages.
 * Not a full spec parser, handles the subset found in CGU/ToS pages.
 */

export function htmlToMarkdown(html: string): string {
  const md = html

    // Strip unwanted blocks
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")

    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n\n")

    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")

    // Lists
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<\/?[ou]l[^>]*>/gi, "\n")
    .replace(/<\/?li[^>]*>/g, "")

    // Block elements
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<div[^>]*>(.*?)<\/div>/gi, "$1\n")
    .replace(/<section[^>]*>(.*?)<\/section>/gi, "$1\n")
    .replace(/<article[^>]*>(.*?)<\/article>/gi, "$1\n")
    .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")

    // Strip remaining tags
    .replace(/<[^>]+>/g, "")

    // Entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")

    // Collapse excessive whitespace
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();

  return md;
}
