import { Suspense } from "react";
import { PayoutsPage } from "./components/PayoutsPage";

export default function PayoutsRoute() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-sans" style={{ color: "var(--text-secondary)" }}>Chargement...</div>}>
      <PayoutsPage />
    </Suspense>
  );
}
