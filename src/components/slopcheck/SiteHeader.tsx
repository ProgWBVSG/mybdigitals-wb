"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";

/**
 * En la portada de SlopCheck la barra flota sobre el hero; en el resto de sus
 * páginas se apoya sobre el degradado con su línea inferior.
 */
export function SiteHeader() {
  const overHero = usePathname() === "/slopcheck";

  return (
    <header className={overHero ? "topbar topbar-over" : "topbar"}>
      <Link href="/slopcheck" className="wordmark">
        slop<b>check</b>
      </Link>
      <a className="topbar-back" href={SITE_URL}>
        ← mybdigitals.com
      </a>
    </header>
  );
}
