// Generates a simple MP4 video to simulate generation when no API key is configured.
// In production, real providers would return actual videos.

export async function GET(request: Request) {
  const url = new URL(request.url);
  const seed = url.searchParams.get("seed") || "demo";
  const prompt = url.searchParams.get("prompt") || "AI Generated Video";
  const duration = parseInt(url.searchParams.get("duration") || "5");

  // Generate a simple colored frame based on the seed
  const hash = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (hash * 37) % 256;
  const g = (hash * 73) % 256;
  const b = (hash * 137) % 256;

  // Create a simple SVG frame as a data URL (displayed as video placeholder)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(${r},${g},${b})" />
        <stop offset="100%" style="stop-color:rgb(${(r + 50) % 256},${(g + 80) % 256},${(b + 120) % 256})" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:rgba(255,255,255,0.15)" />
        <stop offset="100%" style="stop-color:rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    <rect width="1024" height="576" fill="url(#glow)"/>
    <circle cx="512" cy="248" r="80" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <polygon points="492,218 492,278 542,248" fill="rgba(255,255,255,0.3)"/>
    <text x="512" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">${prompt.slice(0, 80)}</text>
    <text x="512" y="410" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.3)">${duration}s · IA généré · halo-talent.com</text>
  </svg>`;

  const encodedSvg = Buffer.from(svg).toString("base64");
  const dataUrl = `data:image/svg+xml;base64,${encodedSvg}`;

  // Return as JSON so the frontend can render it as an image placeholder
  return new Response(JSON.stringify({
    type: "demo",
    video_url: dataUrl,
    duration,
    prompt,
    seed,
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
