export default function ThanksPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#1A1614", color: "#F5F0EB",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", padding: 24,
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(199,91,57,0.1)", color: "var(--or, #D8A95B)",
          fontSize: 28, margin: "0 auto 16px",
        }}>
          ✓
        </div>
        <h1 style={{
          margin: 0, fontSize: 20, fontWeight: 600,
          fontFamily: "'Syne', system-ui, sans-serif",
        }}>
          Inscription confirmée !
        </h1>
        <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, color: "rgba(245,240,235,0.5)" }}>
          Merci pour ta confirmation. Tu recevras bientôt des nouvelles.
        </p>
      </div>
    </div>
  );
}
