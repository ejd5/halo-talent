import type { Metadata } from "next";
import { TeamPage } from "./components/TeamPage";

export const metadata: Metadata = {
  title: "Équipe, Where Talent Forms Admin",
};

export default function Page() {
  return <TeamPage />;
}
