import { Suspense } from "react";
import { CommissionsPage } from "./components/CommissionsPage";

export default function CommissionsRoute() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-sans" style={{ color: "#E0D8D0" }}>Chargement...</div>}>
      <CommissionsPage />
    </Suspense>
  );
}
