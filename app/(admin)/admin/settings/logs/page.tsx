import type { Metadata } from "next";
import { AuditLogsPage } from "./components/AuditLogsPage";

export const metadata: Metadata = {
  title: "Audit Logs — Halo Talent Admin",
};

export default function Page() {
  return <AuditLogsPage />;
}
