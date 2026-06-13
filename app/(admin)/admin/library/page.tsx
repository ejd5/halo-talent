import type { Metadata } from "next";
import { LibraryPage } from "./components/LibraryPage";

export const metadata: Metadata = {
  title: "Bibliothèque, Where Talent Forms Admin",
};

export default function Page() {
  return <LibraryPage />;
}
