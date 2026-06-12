import { Suspense } from "react";
import { DemoShell } from "@/components/demo/DemoShell";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#1A1614" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--or, #D8A95B)" }}
        />
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DemoShell />
    </Suspense>
  );
}
