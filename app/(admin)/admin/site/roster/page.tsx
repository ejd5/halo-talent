import type { Metadata } from "next";
import { RosterPage } from "./components/RosterPage";

export const metadata: Metadata = {
  title: "Talents — Halo Talent CMS",
};

export default function Page() {
  return <RosterPage />;
}
