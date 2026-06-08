import { Suspense } from "react";
import { CommissionsPage } from "./components/CommissionsPage";

export default function CommissionsRoute() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm font-sans" style={{ color: "#5A544C" }}>Chargement...</div>}>
      <CommissionsPage />
    </Suspense>
  );
}
