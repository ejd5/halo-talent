import type { Metadata } from "next";
import { CalendarPage } from "./components/CalendarPage";

export const metadata: Metadata = {
  title: "Calendrier — Halo Talent Admin",
};

export default function Page() {
  return <CalendarPage />;
}
