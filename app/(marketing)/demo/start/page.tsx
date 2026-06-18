import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoShell } from "@/components/demo/DemoShell";

export const metadata: Metadata = {
  title: "Démo Where Talent Forms, Essayez la plateforme",
  description:
    "Prenez en main la plateforme Where Talent Forms. Testez Atlas CRM, Studio IA, CHATEENG et WTF Lex dans un environnement de démonstration interactif.",
  openGraph: {
    title: "Démo interactive, Where Talent Forms",
    description:
      "Essayez Where Talent Forms gratuitement. CRM, IA, analyse de contrats : découvrez les outils par vous-même.",
  },
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "var(--encre)" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ border: "2px solid rgba(255,255,255,0.06)", borderTopColor: "var(--or, #D8A95B)" }}
        />
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Chargement...</p>
      </div>
    </div>
  );
}

export default function DemoStartPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DemoShell />
    </Suspense>
  );
}
