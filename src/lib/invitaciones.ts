/**
 * Contenido de Tu Invitación Digital. Todo lo que se muestra en la página sale
 * de acá, para que cambiar un precio o sumar una reseña no obligue a tocar JSX.
 */

export type TipoEvento = "bodas" | "cumples" | "profesional";
export type Moneda = "ARS" | "USD";

/* ── Tipos de evento ───────────────────────────────────────── */

export type Categoria = {
  id: TipoEvento;
  titulo: string;
  gancho: string;
  /** Color del brillo de la tarjeta. Distingue una categoría de otra. */
  glow: "green" | "purple" | "blue";
};

export const CATEGORIAS: Categoria[] = [
  { id: "bodas", titulo: "Casamiento", gancho: "Para el día que se acuerdan toda la vida", glow: "green" },
  { id: "cumples", titulo: "Cumpleaños", gancho: "Quince, cincuenta o los que sean", glow: "purple" },
  { id: "profesional", titulo: "Evento profesional", gancho: "Lanzamientos, cenas y conferencias", glow: "blue" },
];

/* ── Diseños ───────────────────────────────────────────────── */

export type Diseno = {
  id: number;
  tipo: TipoEvento;
  nombre: string;
  imagen: string;
  acento: string;
};

/**
 * El `id` y el `tipo` tienen que coincidir con las claves de `demoDataBase`
 * en /tuinvitaciondigital/demo/[id], que es la demo que abre cada tarjeta.
 */
export const DISENOS: Diseno[] = [
  { id: 1, tipo: "bodas", nombre: "Camelia", imagen: "/fotos_boda/foto1.jpg", acento: "#e11d48" },
  { id: 2, tipo: "bodas", nombre: "Cielo", imagen: "/fotos_boda/foto2.jpg", acento: "#60a5fa" },
  { id: 3, tipo: "bodas", nombre: "Olivar", imagen: "https://images.unsplash.com/photo-1596431940984-7eaf9bd80de5?auto=format&fit=crop&w=1200&q=90", acento: "#4b5548" },
  { id: 4, tipo: "bodas", nombre: "Bruma", imagen: "/fotos_boda/foto3.jpg", acento: "#4b5563" },
  { id: 5, tipo: "bodas", nombre: "Ocaso", imagen: "/fotos_boda/foto4.jpg", acento: "#f0a58f" },
  { id: 6, tipo: "bodas", nombre: "Granate", imagen: "https://images.unsplash.com/photo-1579549321487-3cb83e5a5960?auto=format&fit=crop&w=1200&q=90", acento: "#611a28" },
  { id: 7, tipo: "bodas", nombre: "Lavanda", imagen: "https://images.unsplash.com/photo-1543362143-6c84b1ebac1d?auto=format&fit=crop&w=1200&q=90", acento: "#a78bfa" },
  { id: 8, tipo: "bodas", nombre: "Lino", imagen: "/fotos_boda/foto5.jpg", acento: "#64748b" },

  { id: 1, tipo: "cumples", nombre: "Violeta", imagen: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=90", acento: "#a855f7" },
  { id: 2, tipo: "cumples", nombre: "Durazno", imagen: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=90", acento: "#eaac8b" },
  { id: 3, tipo: "cumples", nombre: "Dorado", imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90", acento: "#eab308" },
  { id: 4, tipo: "cumples", nombre: "Carmín", imagen: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=1200&q=90", acento: "#f43f5e" },
  { id: 5, tipo: "cumples", nombre: "Índigo", imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=90", acento: "#3b82f6" },
  { id: 6, tipo: "cumples", nombre: "Nocturno", imagen: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90", acento: "#818cf8" },
  { id: 7, tipo: "cumples", nombre: "Fucsia", imagen: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=90", acento: "#db2777" },
  { id: 8, tipo: "cumples", nombre: "Ámbar", imagen: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1200&q=90", acento: "#ea580c" },
];

export const enlaceDemo = (d: Diseno) => `/tuinvitaciondigital/demo/${d.id}?t=${d.tipo}`;

/* ── Qué incluye ───────────────────────────────────────────── */

export const INCLUYE: Record<TipoEvento, string[]> = {
  bodas: [
    "Cuenta regresiva hasta la hora de la fiesta",
    "Ceremonia y salón, cada uno con su mapa",
    "Confirmación de asistencia automática",
    "Restricciones de comida por invitado",
    "Alias y CBU para el regalo",
    "Álbum de fotos con QR para las mesas",
    "Dress code, hoteles y horario del micro",
    "Tu canción sonando de fondo",
  ],
  cumples: [
    "Cuenta regresiva hasta la hora de la fiesta",
    "Ubicación con botón al mapa",
    "Confirmación de asistencia automática",
    "Lista de invitados en vivo",
    "Álbum de fotos con QR para las mesas",
    "Galería de fotos y música",
    "Dress code y datos para el regalo",
    "Un link por invitado, con su nombre",
  ],
  profesional: [
    "Cuenta regresiva hasta el inicio",
    "Sede y accesos con mapa",
    "Registro de asistentes automático",
    "Exportación de la lista a Excel",
    "Agenda del evento por bloques",
    "Logos y colores de tu marca",
    "Restricciones alimentarias del catering",
    "Acreditación con QR en la puerta",
  ],
};

/* ── Precios ───────────────────────────────────────────────── */

export type Plan = {
  nombre: string;
  precio: Record<Moneda, number>;
  items: string[];
  destacado: boolean;
};

/**
 * REVISAR ANTES DE VENDER: el único precio confirmado es Completa en ARS
 * ($68.999). El resto son valores de referencia para armar la escalera.
 */
export const PLANES: Plan[] = [
  {
    nombre: "Esencial",
    precio: { ARS: 44999, USD: 35 },
    items: ["Diseño personalizado", "Cuenta regresiva y mapa", "Datos del regalo", "Confirmación por WhatsApp"],
    destacado: false,
  },
  {
    nombre: "Completa",
    precio: { ARS: 68999, USD: 55 },
    items: ["Todo lo de Esencial", "Confirmación dentro de la invitación", "Lista de invitados en vivo", "Restricciones de comida", "Galería y música"],
    destacado: true,
  },
  {
    nombre: "Completa +",
    precio: { ARS: 94999, USD: 75 },
    items: ["Todo lo de Completa", "Un link por invitado", "Álbum con QR para las mesas", "Trivia para los invitados", "Exportación a Excel"],
    destacado: false,
  },
];

export function formatearPrecio(valor: number, moneda: Moneda) {
  return new Intl.NumberFormat(moneda === "ARS" ? "es-AR" : "en-US", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * La moneda sale de la zona horaria del navegador: no pide permisos, no hace
 * pedidos de red y no obliga al visitante a elegir país. Argentina paga en
 * pesos; el resto del mundo, en dólares.
 */
export function detectarMoneda(): Moneda {
  try {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    return zona.startsWith("America/Argentina") || zona === "America/Buenos_Aires" ? "ARS" : "USD";
  } catch {
    return "ARS";
  }
}

/* ── Reseñas ───────────────────────────────────────────────── */

export type Resena = { nombre: string; evento: string; texto: string };

/**
 * Vacío a propósito: no se inventan reseñas de un negocio real. Cargá acá las
 * de clientes que te hayan dado el OK y la sección aparece sola.
 */
export const RESENAS: Resena[] = [];

/* ── Preguntas ─────────────────────────────────────────────── */

export const PREGUNTAS = [
  {
    p: "¿Mis invitados tienen que descargar algo?",
    r: "No. Es un link que se abre en el navegador del celular, igual que cualquier página. Anda en Android y en iPhone.",
  },
  {
    p: "¿Cómo sé quién confirmó?",
    r: "Cada confirmación entra a una lista que ves en vivo desde el celular, con el nombre, cuántos vienen y las restricciones de comida. La bajás en Excel cuando se la pasás al salón.",
  },
  {
    p: "¿Puedo cambiar cosas después de mandarla?",
    r: "Sí. Como es una web, se edita cuando quieras y el link no cambia. Si se corre el horario, todos ven la versión nueva.",
  },
  {
    p: "¿Cuánto tarda?",
    r: "Tres días hábiles desde que nos pasás los datos y las fotos.",
  },
  {
    p: "¿Se paga todos los meses?",
    r: "No. Es un pago único e incluye el año de publicación.",
  },
];

/* ── Contacto ──────────────────────────────────────────────── */

export const WHATSAPP_NUMERO = "543515555123";

export const whatsappPara = (texto: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;

export const WHATSAPP = whatsappPara("Hola! Quiero info sobre las invitaciones digitales");
