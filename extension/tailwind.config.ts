import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Halo Palette B — Design System
        accent: "var(--or, #D8A95B)",
        "accent-soft": "rgba(249,115,22,0.12)",
        "bg-primary": "#0A0A0A",
        "bg-surface": "#141414",
        "bg-card": "#1A1A1A",
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1AA",
        "text-tertiary": "#71717A",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        "border-default": "rgba(255,255,255,0.06)",
        "border-strong": "rgba(255,255,255,0.1)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
