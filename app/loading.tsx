export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated halo ring */}
        <div
          className="halo-ring"
          style={{
            width: 48,
            height: 48,
            position: "relative",
          }}
        />
        <span
          className="eyebrow"
          style={{
            color: "var(--or, #D8A95B)",
            opacity: 0.6,
            letterSpacing: "0.3em",
          }}
        >
          Chargement
        </span>
      </div>
    </div>
  );
}
