import type { InvitacionEscena } from "../tipos";

const L = "/invitaciones/lavanda";

/**
 * Modelo Lavanda: sobre lila con lacre plateado, arco con araña grabada y papel
 * con trama de ramas. Pareja y salón inventados, cuenta inválida; la dirección
 * existe para que el mapa muestre algo real.
 */
export const lavanda: InvitacionEscena = {
  slug: "lavanda",
  origen: "demo",
  estilo: "lavanda",
  plan: "completa",
  nombres: "Camila & Ignacio",
  volanta: "Nos casamos",
  fecha: "20 de Noviembre 2027",
  musica: "/invitaciones/hilo-rojo/musica.mp3",
  frase: "Queremos compartir con ustedes la alegría de este día y que sean parte de nuestra historia.",
  diseno: { acento: "#5a4a6c", fondo: "#fffcf9", fuente: "Cormorant Garamond", opacidadHero: 0 },
  escena: {
    compartir: `${L}/compartir.jpg`,
    evento: "Boda de Camila e Ignacio",
    intro: ["Queridos invitados"],
    fotos: {},
    monograma: ["C", "I"],
    lacre: `${L}/lacre-ci.webp`,
    paleta: [
      { nombre: "Azul niebla", color: "#b4b7c9" },
      { nombre: "Gris salvia", color: "#9da5aa" },
      { nombre: "Rosa viejo", color: "#c2adbb" },
      { nombre: "Malva", color: "#a3979f" },
      { nombre: "Oliva", color: "#abb198" },
    ],
    deseos: [
      { titulo: "Regalos", texto: "Su compañía es lo más importante. Si además quieren ayudarnos a empezar, esta es nuestra cuenta." },
      { titulo: "Flores", texto: "En lugar de un ramo, traigan su vino favorito. Lo abriremos en la próxima reunión." },
      { titulo: "Solo adultos", texto: "Esta noche la celebramos entre grandes." },
    ],
    gracias: "Los esperamos",
  },
  lugares: [
    {
      tipo: "Fiesta",
      titulo: "Palacio Santa Clara",
      hora: "19:30",
      direccion: "Posadas 1500, Recoleta, Buenos Aires",
      mapa: "https://maps.google.com/?q=Posadas+1500,+Buenos+Aires",
    },
  ],
  dressCode: { titulo: "Dress code", detalle: "Nos encantaría que sus atuendos acompañen los colores de la fiesta" },
  regalo: { mensaje: "", banco: "XXXXX", cbu: "XXXXX", alias: "XXXXX", titular: "XXXXX" },
  cierreRsvp: "10 de Octubre 2027",
};
