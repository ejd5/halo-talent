import type { Metadata } from "next";
import { ApplicationsPage } from "./components/ApplicationsPage";

export const metadata: Metadata = {
  title: "Candidatures, Where Talent Forms Admin",
};

export default function Page() {
  return <ApplicationsPage />;
}
