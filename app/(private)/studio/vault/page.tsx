"use client";

import { Suspense } from "react";
import { ContentVaultOrchestrator } from "@/components/vault/ContentVaultOrchestrator";

function VaultFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div
        className="w-5 h-5 rounded-full animate-spin"
        style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--accent)" }}
      />
    </div>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={<VaultFallback />}>
      <ContentVaultOrchestrator />
    </Suspense>
  );
}
