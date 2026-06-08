import type { Metadata } from "next";
import { SitePagesPage } from "./components/SitePagesPage";

export const metadata: Metadata = {
  title: "Pages — Halo Talent CMS",
};

export default function Page() {
  return <SitePagesPage />;
}
