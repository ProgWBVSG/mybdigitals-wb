"use client";

import { usePathname } from "next/navigation";

/**
 * SlopCheck es un producto aparte dentro del sitio: tiene su propia identidad
 * visual y su propia navegación, así que el chrome de MYB no se monta ahí.
 */
export default function HideOnSlopcheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/slopcheck")) return null;
  return <>{children}</>;
}
