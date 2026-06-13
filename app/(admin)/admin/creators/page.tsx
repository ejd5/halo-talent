import type { Metadata } from "next";
import { CreatorsGridPage } from "./components/CreatorsGridPage";

export const metadata: Metadata = {
  title: "Roster créateurs, Where Talent Forms Admin",
};

export default function Page() {
  return <CreatorsGridPage />;
}
