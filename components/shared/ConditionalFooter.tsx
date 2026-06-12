"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/shared/Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Skip the global footer on the homepage — it has its own couture footer
  if (pathname === "/") return null;

  return <Footer />;
}
