import type { Metadata } from "next";
import { QuiSommesNousClient } from "./QuiSommesNousClient";

export const metadata: Metadata = {
  title: "Qui nous sommes, Where Talent Forms",
  description:
    "Where Talent Forms est une maison de management créatif née d'un constat simple : le créateur doit redevenir le centre du modèle. Découvrez notre histoire, nos convictions et notre vision.",
  openGraph: {
    title: "Qui nous sommes, Where Talent Forms",
    description:
      "Une maison de management créatif née d'un constat simple : le créateur doit redevenir le centre du modèle. Notre histoire, nos convictions, notre vision.",
  },
};

export default function QuiSommesNousPage() {
  return <QuiSommesNousClient />;
}
