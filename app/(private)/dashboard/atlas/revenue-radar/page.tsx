import { Suspense } from "react";
import { RevenueRadar } from "@/components/atlas/RevenueRadar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Radar | WTF Atlas",
  description: "Identify and prioritize sales opportunities across your fan base.",
};

export default function RevenueRadarPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center h-full"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          <div
            className="w-5 h-5 rounded-full animate-spin"
            style={{
              border: "2px solid var(--border-default)",
              borderTopColor: "var(--accent)",
            }}
          />
        </div>
      }
    >
      <RevenueRadar />
    </Suspense>
  );
}
