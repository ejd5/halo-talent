import type { Metadata } from "next";
import { BlogListPage } from "./components/BlogListPage";

export const metadata: Metadata = {
  title: "Blog, Where Talent Forms CMS",
};

export default function Page() {
  return <BlogListPage />;
}
