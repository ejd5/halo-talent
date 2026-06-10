import { Suspense } from "react";
import { PPVPricingLab } from "@/components/atlas/PPVPricingLab";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full animate-spin" style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)" }} />
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function PPVPricingPage() {
  return (
    <div className="flex -m-4 md:-m-8 h-[calc(100vh-4rem)] overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Suspense fallback={<LoadingSpinner />}>
        <PPVPricingLab />
      </Suspense>
    </div>
  );
}
