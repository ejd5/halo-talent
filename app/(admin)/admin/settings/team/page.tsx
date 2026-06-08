import type { Metadata } from "next";
import { TeamPage } from "./components/TeamPage";

export const metadata: Metadata = {
  title: "Équipe — Halo Talent Admin",
};

export default function Page() {
  return <TeamPage />;
}
