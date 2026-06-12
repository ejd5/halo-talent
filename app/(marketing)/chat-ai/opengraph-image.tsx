import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0A08",
          fontFamily: "Space Grotesk, monospace",
          padding: "60px 80px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            padding: "8px 24px",
            borderRadius: "2px",
            border: "1px solid rgba(216, 169, 91, 0.3)",
            fontSize: "16px",
            color: "#D8A95B",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 500,
          }}
        >
          <span style={{ display: "flex", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D8A95B" }} />
          Sovereign Chat AI
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: 700,
            color: "#F4EEE3",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Un copilote de chatting conçu pour vendre mieux, sans perdre le contrôle.
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            color: "#9C9183",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          L&apos;IA prépare. L&apos;humain valide. Le créateur contrôle.
        </div>

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "24px",
            color: "#F4EEE3",
            fontWeight: 500,
          }}
        >
          Halo
          <span style={{ fontStyle: "italic", color: "#D8A95B" }}>
            Talent
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
