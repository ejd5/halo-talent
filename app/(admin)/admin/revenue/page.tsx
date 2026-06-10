import { Suspense } from "react";
import { RevenuePage } from "./components/RevenuePage";

export default function RevenueRoute() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-sans" style={{ color: "var(--text-secondary)" }}>Chargement...</div>}>
      <RevenuePage />
    </Suspense>
  );
}
