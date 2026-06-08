import type { Metadata } from "next";
import { ManifestoEditor } from "./components/ManifestoEditor";

export const metadata: Metadata = {
  title: "Manifeste — Halo Talent CMS",
};

export default function Page() {
  return <ManifestoEditor />;
}
