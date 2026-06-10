import { Suspense } from "react";
import { ComplianceDashboard } from "@/components/compliance/ComplianceDashboard";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)" }}
        />
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ComplianceDashboard />
    </Suspense>
  );
}
