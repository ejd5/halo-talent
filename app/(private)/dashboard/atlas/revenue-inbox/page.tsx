import { Suspense } from "react";
import { RevenueInbox } from "@/components/atlas/RevenueInbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Inbox | Halo Atlas",
  description:
    "Prioritize conversations by revenue potential, purchase intent, and fan value.",
};

export default function RevenueInboxPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center h-[calc(100vh-4rem)]"
          style={{ backgroundColor: "var(--color-ink, #1A1614)" }}
        >
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{
              borderColor: "rgba(199,91,57,0.2)",
              borderTopColor: "var(--color-accent, var(--or, #D8A95B))",
            }}
          />
        </div>
      }
    >
      <RevenueInbox />
    </Suspense>
  );
}
