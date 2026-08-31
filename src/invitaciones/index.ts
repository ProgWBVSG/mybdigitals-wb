import type { Invitacion } from "./tipos";
import { rosa } from "./demo/rosa";

/**
 * Registro único de invitaciones. Las demos y las de clientes conviven acá
 * porque comparten la misma ruta (/tuinvitaciondigital/i/<slug>), pero cada una
 * declara su `origen` y las reglas de cada carpeta están en README.md.
 *
 * Al sumar una invitación: importarla arriba y agregarla a la lista.
 */
const INVITACIONES: Invitacion[] = [rosa];

export const buscarInvitacion = (slug: string) =>
  INVITACIONES.find((i) => i.slug === slug);

export const slugsDeInvitaciones = () => INVITACIONES.map((i) => i.slug);

export type { Invitacion };
