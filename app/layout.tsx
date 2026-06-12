import type { Metadata } from "next";
import {
  Syne,
  Plus_Jakarta_Sans,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Fraunces,
  Instrument_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const syne = Syne({
  variable: "--font-display-legacy",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display-alt",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-util",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
      className={`${syne.variable} ${plusJakartaSans.variable} ${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${instrumentSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
