import { Navbar } from "@/components/shared/Navbar";
import { ConditionalFooter } from "@/components/shared/ConditionalFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="encre" style={{ backgroundColor: "var(--encre, #0C0A08)", minHeight: "100vh" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <ConditionalFooter />
    </div>
  );
}
