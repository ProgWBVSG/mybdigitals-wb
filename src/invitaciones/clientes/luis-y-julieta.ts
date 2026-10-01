import type { InvitacionFotomaton } from "../tipos";

/**
 * Luis y Julieta. Estilo fotomatón.
 *
 * Las fotos son las reales de la pareja (Plataforma Invitaciones/Clientes/
 * Luis y Julieta/Fotos), procesadas con el script de la skill
 * `invitacion-fotomaton`.
 *
 * TODO: falta el brief. Todo lo marcado "A confirmar" o XXXXX sale de ahí y
 * se verifica con la pareja antes de mandar el link: fecha, lugares, horarios,
 * vestimenta y datos para el regalo. Nada de esto se inventa.
 */
const BASE = "/invitaciones/clientes/luis-y-julieta";

export const luisYJulieta: InvitacionFotomaton = {
  slug: "luis-y-julieta",
  origen: "cliente",
  plan: "completa",
  estilo: "fotomaton",

  nombres: "Luis & Julieta",
  volanta: "Nos casamos",
  // TODO: fecha real. Esta es provisoria para que la cuenta regresiva ande.
  fecha: "20 de Marzo 2027",

  fotomaton: {
    // El último cuadro es el que asoma primero de la ranura: por eso va la
    // foto con velo, que es la que dice "casamiento" sin leer nada.
    tira: [`${BASE}/tira-1.webp`, `${BASE}/tira-2.webp`, `${BASE}/tira-3.webp`],
    polaroid: `${BASE}/polaroid.webp`,
    iniciales: "L & J",
    lugarCorto: "A confirmar", // TODO: ciudad del casamiento
    compartir: `${BASE}/compartir.jpg`,
  },

  cronograma: [
    { hora: "A confirmar", titulo: "Ceremonia" },
    { hora: "A confirmar", titulo: "Fiesta" },
  ],

  lugares: [
    { tipo: "Ceremonia", titulo: "A confirmar", hora: "A confirmar", direccion: "A confirmar", mapa: "https://maps.google.com" },
    { tipo: "Fiesta", titulo: "A confirmar", hora: "A confirmar", direccion: "A confirmar", mapa: "https://maps.google.com" },
  ],

  dressCode: { titulo: "A confirmar", detalle: "Lo confirmamos en breve." },

  regalo: {
    mensaje: "Que estés ese día ya es el regalo. Si igual querés hacernos uno, te dejamos los datos.",
    banco: "XXXXX",
    alias: "XXXXX.XXXXX",
    cbu: "XXXXXXXXXXXXXXXXXXXXXX",
    titular: "XXXXX",
  },

  cierreRsvp: "Confirmanos tu asistencia así cerramos la lista con el salón.",

  diseno: {
    acento: "#7a0f18",
    fondo: "#fcf3ef",
    fuente: "Georgia, serif",
    opacidadHero: 0.15,
  },
};
