import { Suspense } from "react";
import { CommandCenter } from "@/components/admin/CommandCenter";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <CommandCenter />
    </Suspense>
  );
}

function AdminSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="h-10 w-72 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[220px] h-24 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
        <div className="h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-48 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}
