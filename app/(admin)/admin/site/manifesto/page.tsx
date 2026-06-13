import type { Metadata } from "next";
import { ManifestoEditor } from "./components/ManifestoEditor";

export const metadata: Metadata = {
  title: "Manifeste, Where Talent Forms CMS",
};

export default function Page() {
  return <ManifestoEditor />;
}
