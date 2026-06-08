import type { Metadata } from "next";
import { LibraryPage } from "./components/LibraryPage";

export const metadata: Metadata = {
  title: "Bibliothèque — Halo Talent Admin",
};

export default function Page() {
  return <LibraryPage />;
}
