import type { Metadata } from "next";
import { CreatorsGridPage } from "./components/CreatorsGridPage";

export const metadata: Metadata = {
  title: "Roster créateurs — Halo Talent Admin",
};

export default function Page() {
  return <CreatorsGridPage />;
}
