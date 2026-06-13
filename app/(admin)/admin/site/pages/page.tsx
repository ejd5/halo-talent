import type { Metadata } from "next";
import { SitePagesPage } from "./components/SitePagesPage";

export const metadata: Metadata = {
  title: "Pages, Where Talent Forms CMS",
};

export default function Page() {
  return <SitePagesPage />;
}
