"use client";

import { useState } from "react";
import PushOptIn from "@/components/atlas/PushOptIn";

interface Props {
  slug: string;
  cta_text: string;
  confirmation_message: string;
  collect_first_name: boolean;
  consent_text: string;
  accent_color: string;
  text_color: string;
  /** Optional: creator info for push opt-in after form submission */
  creator_handle?: string;
  creator_name?: string;
  creator_id?: string;
}

export default function CaptureForm({
  slug, cta_text, confirmation_message, collect_first_name,
  consent_text, accent_color, text_color,
  creator_handle, creator_name, creator_id,
}: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Email requis"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/lead-capture/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email, first_name: firstName || undefined, source: "capture_page" }),
      });
      const d = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setError(d.error || d.message || "Erreur");
        if (d.status === "already_subscribed") setDone(true);
      }
    } catch { setError("Erreur réseau"); }
    finally { setSubmitting(false); }
  }

  if (done) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: text_color, fontWeight: 500 }}>{confirmation_message}</p>
        {creator_handle && (
          <div style={{ marginTop: 16 }}>
            <PushOptIn
              creatorHandle={creator_handle}
              creatorName={creator_name}
              creatorId={creator_id}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      {collect_first_name && (
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          style={inputStyle(text_color)}
        />
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={inputStyle(text_color)}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%", padding: "12px 16px", fontSize: 13, fontWeight: 600,
          border: "none", cursor: "pointer",
          backgroundColor: accent_color, color: "#FFFFFF", opacity: submitting ? 0.6 : 1,
          fontFamily: "'Syne', system-ui, sans-serif",
        }}
      >
        {submitting ? "..." : cta_text}
      </button>
      <p style={{ margin: 0, fontSize: 10, lineHeight: 1.4, color: `${text_color}60` }}>
        {consent_text}
      </p>
      {error && <p style={{ margin: 0, fontSize: 11, color: "#C44536" }}>{error}</p>}
    </form>
  );
}

function inputStyle(textColor: string): React.CSSProperties {
  return {
    width: "100%", padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" as const,
    backgroundColor: "transparent",
    border: `1px solid ${textColor}20`,
    color: textColor,
    borderRadius: 0,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  };
}
