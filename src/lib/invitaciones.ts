/**
 * Los diseños que se muestran en la galería. Cada uno abre la demo real
 * (/tuinvitaciondigital/demo/[id]?t=[tipo]), así que el `id` y el `tipo`
 * tienen que coincidir con las claves de `demoDataBase` en esa ruta.
 *
 * El nombre describe la paleta del diseño, no a la pareja de la demo: quien
 * compra elige por cómo se ve, no por cómo se llaman los novios de ejemplo.
 */
export type TipoEvento = "bodas" | "cumples";

export type Diseno = {
  id: number;
  tipo: TipoEvento;
  nombre: string;
  /** Cómo se siente el diseño, en tres o cuatro palabras. */
  caracter: string;
  imagen: string;
  /** El color de acento que usa la invitación real. */
  acento: string;
};

export const DISENOS: Diseno[] = [
  // ── Casamientos ──
  { id: 1, tipo: "bodas", nombre: "Camelia", caracter: "Romántico y cálido", imagen: "/fotos_boda/foto1.jpg", acento: "#e11d48" },
  { id: 2, tipo: "bodas", nombre: "Cielo", caracter: "Fresco y luminoso", imagen: "/fotos_boda/foto2.jpg", acento: "#60a5fa" },
  { id: 3, tipo: "bodas", nombre: "Olivar", caracter: "Botánico y sereno", imagen: "https://images.unsplash.com/photo-1596431940984-7eaf9bd80de5?auto=format&fit=crop&w=1200&q=90", acento: "#4b5548" },
  { id: 4, tipo: "bodas", nombre: "Bruma", caracter: "Sobrio y minimal", imagen: "/fotos_boda/foto3.jpg", acento: "#4b5563" },
  { id: 5, tipo: "bodas", nombre: "Ocaso", caracter: "Boho al atardecer", imagen: "/fotos_boda/foto4.jpg", acento: "#f0a58f" },
  { id: 6, tipo: "bodas", nombre: "Granate", caracter: "Clásico de gala", imagen: "https://images.unsplash.com/photo-1579549321487-3cb83e5a5960?auto=format&fit=crop&w=1200&q=90", acento: "#611a28" },
  { id: 7, tipo: "bodas", nombre: "Lavanda", caracter: "Suave y campestre", imagen: "https://images.unsplash.com/photo-1543362143-6c84b1ebac1d?auto=format&fit=crop&w=1200&q=90", acento: "#a78bfa" },
  { id: 8, tipo: "bodas", nombre: "Lino", caracter: "Neutro y moderno", imagen: "/fotos_boda/foto5.jpg", acento: "#64748b" },

  // ── Quince años ──
  { id: 1, tipo: "cumples", nombre: "Violeta", caracter: "Vibrante de noche", imagen: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=90", acento: "#a855f7" },
  { id: 2, tipo: "cumples", nombre: "Durazno", caracter: "Dulce y aterciopelado", imagen: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=90", acento: "#eaac8b" },
  { id: 3, tipo: "cumples", nombre: "Dorado", caracter: "Brillo de fiesta", imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90", acento: "#eab308" },
  { id: 4, tipo: "cumples", nombre: "Carmín", caracter: "Gala intensa", imagen: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=1200&q=90", acento: "#f43f5e" },
  { id: 5, tipo: "cumples", nombre: "Índigo", caracter: "Elegante y nocturno", imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=90", acento: "#3b82f6" },
  { id: 6, tipo: "cumples", nombre: "Nocturno", caracter: "Urbano y actual", imagen: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90", acento: "#818cf8" },
  { id: 7, tipo: "cumples", nombre: "Fucsia", caracter: "Alegre y expresivo", imagen: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=90", acento: "#db2777" },
  { id: 8, tipo: "cumples", nombre: "Ámbar", caracter: "Cálido y festivo", imagen: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1200&q=90", acento: "#ea580c" },
];

export const enlaceDemo = (d: Diseno) => `/tuinvitaciondigital/demo/${d.id}?t=${d.tipo}`;

export const WHATSAPP =
  "https://wa.me/543515555123?text=Hola!%20quiero%20info%20sobre%20las%20invitaciones%20digitales";

export const whatsappPara = (texto: string) =>
  `https://wa.me/543515555123?text=${encodeURIComponent(texto)}`;
