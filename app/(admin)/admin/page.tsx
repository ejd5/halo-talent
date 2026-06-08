import { Suspense } from "react";
import { DashboardOverview } from "./components/DashboardOverview";

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverview />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div
        className="h-10 w-64 mb-8 animate-pulse"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      <div className="grid grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        ))}
      </div>
      <div className="flex gap-6 mb-8">
        <div
          className="flex-1 h-80 animate-pulse"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="w-80 h-80 animate-pulse"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </div>
  );
}
