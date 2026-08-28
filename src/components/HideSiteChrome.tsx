"use client";

import { usePathname } from "next/navigation";

/**
 * Rutas que son un producto aparte dentro del mismo dominio: tienen su propia
 * identidad visual y su propia navegación, así que el chrome de MYB no se
 * monta ahí.
 */
const SUB_MARCAS = ["/slopcheck", "/tuinvitaciondigital"];

export default function HideSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (SUB_MARCAS.some((ruta) => pathname?.startsWith(ruta))) return null;
  return <>{children}</>;
}
