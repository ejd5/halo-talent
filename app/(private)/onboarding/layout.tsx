import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["700", "800"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${syne.variable} ${jakarta.variable}`} style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
