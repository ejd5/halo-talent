import type { Metadata } from "next";
import { SystemPage } from "./components/SystemPage";

export const metadata: Metadata = {
  title: "Système — Halo Talent Admin",
};

export default function Page() {
  return <SystemPage />;
}
