import type { InvitacionRasgado } from "../tipos";
import { rosedal } from "./rosedal";

const F = "/invitaciones/fogata";

/**
 * Modelo Fogata: el estilo Rasgado con las fotos de los malvaviscos. El papel
 * se quema en los bordes y, al confirmar, se tuestan tres malvaviscos. Sin
 * nombres y en español neutro, para cualquier país. Las fotos son de la pareja
 * que pasó el material; los datos son los mismos de muestra que Rosedal.
 */
export const fogata: InvitacionRasgado = {
  slug: "fogata",
  origen: "demo",
  estilo: "rasgado",
  plan: "completa",

  nombres: "Nuestra Boda",
  volanta: "Nos casamos",
  fecha: rosedal.fecha,
  musica: `${F}/musica.mp3`,

  frase: "Lo más dulce se hace despacio, de a dos y cerca del fuego.",

  rasgado: {
    tema: "fogata",
    compartir: `${F}/compartir.jpg`,
    evento: "Nuestra boda",
    fotos: {
      portada: { src: `${F}/malvaviscos.webp`, alt: "Ella y él sentados junto al fuego, mirándose, con malvaviscos en la mano", proporcion: 0.87, foco: "50% 0%" },
      lugar: { src: `${F}/domo.webp`, alt: "Ella y él en un domo con luces cálidas, globos de corazón y rosas rojas", proporcion: 0.9, foco: "50% 45%" },
      vestimenta: { src: `${F}/rosas.webp`, alt: "Rosas rojas y un cartel luminoso que dice LOVE sobre la mesa", proporcion: 1.08, foco: "50% 60%" },
      pausa: { src: `${F}/juntos.webp`, alt: "Ella y él juntos entre globos rojos y rosas", proporcion: 1, foco: "50% 40%" },
      cierre: { src: `${F}/fogata.webp`, alt: "Ella y él de noche alrededor de la fogata, bajo una guirnalda de luces", proporcion: 0.64, foco: "50% 60%" },
    },
    bendicion: "Encendimos algo lindo y queremos celebrarlo con las personas que más queremos. Acompáñanos en nuestra boda.",
    padres: [],
    listaRegalos: { titulo: "Lista de regalos", boton: "Ver la lista", enlace: "https://www.amazon.com/wedding" },
    sobres: { titulo: "Lluvia de sobres", detalle: "Habrá un buzón el día de la fiesta" },
    pase: { invitado: "Invitado de honor", lugares: 2 },
    soloAdultos: "Con cariño, pensamos la fiesta sin niños. Gracias por comprenderlo.",
    gracias: "Por ser parte de esta noche. Te guardamos un lugar junto al fuego.",
  },

  cronograma: rosedal.cronograma,
  lugares: rosedal.lugares,

  dressCode: { titulo: "Formal", detalle: "De noche refresca: trae un abrigo. El blanco está reservado para la novia" },

  regalo: {
    mensaje: "Tu presencia es nuestro mejor regalo. Si además quieres tener un detalle:",
    banco: "Transferencia bancaria",
    alias: "nuestra.boda.2027",
    cbu: "0000000000000000000000",
    titular: "Los novios",
  },

  cierreRsvp: "13 de Enero 2027",

  diseno: { acento: "#8a1f2e", fondo: "#fff9ee", fuente: "Georgia, serif", opacidadHero: 0.15 },
};
