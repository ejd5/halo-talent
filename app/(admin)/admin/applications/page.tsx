import type { Metadata } from "next";
import { ApplicationsPage } from "./components/ApplicationsPage";

export const metadata: Metadata = {
  title: "Candidatures — Halo Talent Admin",
};

export default function Page() {
  return <ApplicationsPage />;
}
