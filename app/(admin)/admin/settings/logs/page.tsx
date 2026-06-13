import type { Metadata } from "next";
import { AuditLogsPage } from "./components/AuditLogsPage";

export const metadata: Metadata = {
  title: "Audit Logs, Where Talent Forms Admin",
};

export default function Page() {
  return <AuditLogsPage />;
}
