"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setLocale, type Locale, LOCALES } from "./legal";
import { setCommonLocale } from "./common";

export function useLocale(): Locale {
  const pathname = usePathname();
  const match = pathname ? pathname.match(new RegExp(`^/(${LOCALES.join("|")})(/|$)`)) : null;
  const locale: Locale = (match?.[1] as Locale) || "fr";

  useEffect(() => {
    setLocale(locale);
    setCommonLocale(locale as any);
  }, [locale]);

  return locale;
}
