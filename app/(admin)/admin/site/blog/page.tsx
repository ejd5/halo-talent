import type { Metadata } from "next";
import { BlogListPage } from "./components/BlogListPage";

export const metadata: Metadata = {
  title: "Blog — Halo Talent CMS",
};

export default function Page() {
  return <BlogListPage />;
}
