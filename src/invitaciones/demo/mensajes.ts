import type { InvitacionMensajes } from "../tipos";
import { FECHA, FOTOS } from "./lucia-y-nicolas";

/**
 * Modelo Mensajes: la versión de humor. Una charla entre los dos novios que se
 * va escribiendo mientras se baja (0 = ella, 1 = él, por las caras).
 *
 * Está escrita en español neutro a propósito, para que sirva en cualquier país:
 * sin voseo, sin "che", sin "dale", sin bancos ni ciudades de un lugar concreto
 * y sin nombres de pareja. Las fotos son reales; todo lo demás es de muestra.
 * El CBU es inválido a propósito.
 */
export const mensajes: InvitacionMensajes = {
  slug: "mensajes",
  origen: "demo",
  estilo: "mensajes",
  plan: "completa",

  nombres: "Los novios",
  volanta: "Nos casamos",
  fecha: FECHA,

  mensajes: {
    compartir: "/invitaciones/mensajes/compartir.jpg",
    avatares: [`${FOTOS}/avatar-lu.webp`, `${FOTOS}/avatar-nico.webp`],
    evento: "Boda",
    intro: "Esta es tu invitación. Desliza hacia abajo para leerla; al final podrás confirmar si vienes.",
    paleta: [
      { nombre: "Verde bosque", color: "#2f5a45" },
      { nombre: "Crema", color: "#eadfc8" },
      { nombre: "Borgoña", color: "#6e2a35" },
      { nombre: "Dorado", color: "#b98c3a" },
    ],

    apertura: [
      { quien: 1, texto: "Oye, una pregunta." },
      { quien: 0, texto: "Si es por el último malvavisco, la respuesta es no." },
      { quien: 1, texto: "No. ¿Nos casamos?" },
      { quien: 0, texto: "Sí." },
      { quien: 0, texto: "Pero con fogata." },
    ],

    fotoFogon: {
      src: `${FOTOS}/fogon.webp`,
      alt: "Ella y él sentados frente al fuego con palos de malvaviscos, mirándose y riéndose",
      pie: "Trato hecho. Ya tengo los palos.",
      quien: 1,
    },
    fotoMesa: {
      src: `${FOTOS}/mesa.webp`,
      alt: "Ella y él detrás de una mesa con globos de corazón, rosas rojas y un cartel luminoso que dice LOVE",
      pie: "Prueba de que ya sabemos decorar una mesa. El salón estará mejor, lo prometemos.",
      quien: 0,
    },

    avisos: {
      fecha: { quien: 0, texto: "Anota la fecha: sábado 13 de febrero de 2027." },
      cuenta: { quien: 1, texto: "Faltan {d} días y todavía no sé hacerme el nudo de la corbata." },
      ceremonia: { quien: 0, texto: "Primero, la ceremonia, al aire libre. Llega con tiempo: nos casamos igual aunque falten, pero mejor que estés." },
      fiesta: { quien: 1, texto: "Después, la fiesta. Habrá fogata." },
      orden: { quien: 0, texto: "Este es el programa, por si te distraes:" },
      vestimenta: { quien: 1, texto: "De vestir, elegante de campo. Y si hace frío, nadie se hace el fuerte." },
      regalo: { quien: 1, texto: "Si quieres regalarnos algo, la luna de miel no se paga sola." },
      pregunta: { quien: 0, texto: "Falta lo más importante: ¿vienes?" },
    },

    respuestaSi: [
      { quien: 0, texto: "¡Anotado! Guárdame un baile." },
      { quien: 1, texto: "Y un malvavisco." },
    ],
    respuestaNo: [
      { quien: 1, texto: "Te vamos a extrañar. Mucho." },
      { quien: 0, texto: "Igual te guardamos un malvavisco." },
    ],

    firma: "Escrito con cariño y un poco de humo.",
  },

  cronograma: [
    { hora: "18:30", titulo: "Ceremonia al aire libre" },
    { hora: "19:30", titulo: "Brindis de bienvenida" },
    { hora: "21:00", titulo: "Cena" },
    { hora: "23:00", titulo: "Primer baile" },
    { hora: "01:30", titulo: "Mesa de dulces junto a la fogata" },
    { hora: "04:00", titulo: "Chocolate caliente y despedida" },
  ],

  lugares: [
    {
      tipo: "Ceremonia",
      titulo: "Mirador de los Aromos",
      hora: "18:30",
      direccion: "Camino del Mirador 3, Valle Alto",
      mapa: "https://maps.google.com/?q=Mirador+de+los+Aromos",
    },
    {
      tipo: "Fiesta",
      titulo: "Domos del Alba",
      hora: "19:30",
      direccion: "Camino del Mirador 3,5, Valle Alto",
      mapa: "https://maps.google.com/?q=Domos+del+Alba",
    },
  ],

  dressCode: {
    titulo: "Elegante de campo",
    detalle: "De noche refresca: lleva un abrigo. Calzado cómodo para el pasto, porque se baila hasta tarde. El blanco está reservado para la novia.",
  },

  regalo: {
    mensaje: "Lo más lindo es que estés. Si aun así quieres sumar algo, nos ayuda con la luna de miel.",
    banco: "Transferencia bancaria",
    alias: "los.novios.2027",
    cbu: "0000000000000000000000",
    titular: "Los novios",
  },

  cierreRsvp: "Respóndenos antes del 13 de enero.",

  diseno: { acento: "#b8461a", fondo: "#f7ecdc", fuente: "DM Sans", opacidadHero: 0.15 },
};
