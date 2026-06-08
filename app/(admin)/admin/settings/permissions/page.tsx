import type { Metadata } from "next";
import { PermissionsPage } from "./components/PermissionsPage";

export const metadata: Metadata = {
  title: "Permissions — Halo Talent Admin",
};

export default function Page() {
  return <PermissionsPage />;
}
