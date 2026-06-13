import type { Metadata } from "next";
import { SystemPage } from "./components/SystemPage";

export const metadata: Metadata = {
  title: "Système, Where Talent Forms Admin",
};

export default function Page() {
  return <SystemPage />;
}
