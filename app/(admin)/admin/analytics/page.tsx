import type { Metadata } from "next";
import { AnalyticsPage } from "./components/AnalyticsPage";

export const metadata: Metadata = {
  title: "Analytics, Where Talent Forms Admin",
};

export default function Page() {
  return <AnalyticsPage />;
}
