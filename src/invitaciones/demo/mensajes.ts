import type { InvitacionMensajes } from "../tipos";
import { FECHA, FOTOS, cierreRsvp, cronograma, dressCode, lugares, regalo } from "./lucia-y-nicolas";

/**
 * Modelo Mensajes: la versión de humor para la misma pareja. Una charla entre
 * Lu (0) y Nico (1) que se va escribiendo mientras se baja. El chiste vive en
 * el texto, no en el diseño: la información es la misma que en Guirnalda.
 */
export const mensajes: InvitacionMensajes = {
  slug: "lu-y-nico",
  origen: "demo",
  estilo: "mensajes",
  plan: "completa",

  nombres: "Lu & Nico",
  volanta: "Se casan",
  fecha: FECHA,

  mensajes: {
    compartir: "/invitaciones/mensajes/compartir.jpg",
    avatares: [`${FOTOS}/avatar-lu.webp`, `${FOTOS}/avatar-nico.webp`],

    apertura: [
      { quien: 1, texto: "Che, Lu. Una pregunta." },
      { quien: 0, texto: "Si es por el último malvavisco, la respuesta es no." },
      { quien: 1, texto: "No. ¿Nos casamos?" },
      { quien: 0, texto: "Dale." },
      { quien: 0, texto: "Pero con fogón." },
    ],

    fotoFogon: {
      src: `${FOTOS}/fogon.webp`,
      alt: "Nico y Lu sentados frente al fuego con palos de malvaviscos, mirándose y riéndose",
      pie: "Trato hecho. Ya tengo los palos.",
      quien: 1,
    },
    fotoMesa: {
      src: `${FOTOS}/mesa.webp`,
      alt: "Lu y Nico detrás de una mesa con globos de corazón, rosas rojas y un cartel luminoso que dice LOVE",
      pie: "Prueba de que ya sabemos decorar una mesa. El salón está mejor, prometido.",
      quien: 0,
    },

    avisos: {
      fecha: { quien: 0, texto: "Anotá: sábado 13 de febrero de 2027." },
      cuenta: { quien: 1, texto: "Faltan {d} días y todavía no sé atarme la corbata." },
      ceremonia: { quien: 0, texto: "Primero la ceremonia, al aire libre. Lleguen con tiempo: nos casamos igual aunque falten." },
      fiesta: { quien: 1, texto: "Y después, la fiesta. Hay fogón." },
      orden: { quien: 0, texto: "El orden del día, por si se distraen:" },
      vestimenta: { quien: 1, texto: "De vestir, elegante de campo. Y si hace frío, nadie se hace el fuerte." },
      regalo: { quien: 1, texto: "Si quieren regalarnos algo, la luna de miel no se paga sola." },
      pregunta: { quien: 0, texto: "Falta lo más importante: ¿venís?" },
    },

    respuestaSi: [
      { quien: 0, texto: "¡Anotado! Guardame un baile." },
      { quien: 1, texto: "Y un malvavisco." },
    ],
    respuestaNo: [
      { quien: 1, texto: "Te vamos a extrañar. Mucho." },
      { quien: 0, texto: "Igual te guardamos el malvavisco." },
    ],

    firma: "Escrito con cariño y un poco de humo.",
  },

  cronograma,
  lugares,
  dressCode,
  regalo,
  cierreRsvp,

  diseno: { acento: "#b8461a", fondo: "#f7ecdc", fuente: "DM Sans", opacidadHero: 0.15 },
};
