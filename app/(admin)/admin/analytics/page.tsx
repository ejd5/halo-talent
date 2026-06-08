import type { Metadata } from "next";
import { AnalyticsPage } from "./components/AnalyticsPage";

export const metadata: Metadata = {
  title: "Analytics — Halo Talent Admin",
};

export default function Page() {
  return <AnalyticsPage />;
}
