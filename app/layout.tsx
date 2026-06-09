import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Halo Talent — Maison de management créatif",
    template: "%s — Halo Talent",
  },
  description:
    "Cinq départements, une commission dégressive (30% → 10%), une seule exigence : votre succès. Management créatif avec transparence radicale.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Halo Talent — Maison de management créatif",
    description:
      "Cinq départements, une commission dégressive (30% → 10%), une seule exigence : votre succès.",
    siteName: "Halo Talent",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="light"
      className={`${syne.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
