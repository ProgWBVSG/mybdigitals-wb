/**
 * La forma de una invitación digital. Una sola fuente de verdad para las demos
 * (src/invitaciones/demo) y para las de clientes (src/invitaciones/clientes).
 *
 * Todo lo visible sale de acá: agregar una boda no debería obligar a tocar JSX.
 */

/* ── La carta ──────────────────────────────────────────────────
   La pantalla de entrada y el momento que vende el producto: un sobre cerrado
   con lacre. El invitado toca la pantalla, corre el video de apertura y al
   terminar entra la invitación.

   Son dos assets, generados con los prompts de
   .claude/skills/invitaciones-casamiento/references/prompts-gemini-carta.md   */

export type Carta = {
  /** Sobre cerrado con el lacre incluido. Es lo primero que se ve. */
  imagen: string;
  /** La apertura. Su primer fotograma es `imagen`, por eso no hay salto. */
  video: string;
  /** Iniciales que van por HTML sobre el centro del lacre. Ej: "M&T". */
  iniciales: string;
  /** Texto chiquito debajo del sello. Ej: "Tocá para abrir". */
  instruccion: string;
};

/* ── Bloques de contenido ──────────────────────────────────── */

/** Un momento del día. Ej: 21:00 · Cena. */
export type Hito = { hora: string; titulo: string };

export type Lugar = {
  tipo: "Ceremonia" | "Fiesta" | "Civil";
  titulo: string;
  hora: string;
  direccion: string;
  mapa: string;
};

export type Regalo = {
  mensaje: string;
  banco: string;
  cbu: string;
  alias: string;
  titular: string;
};

export type Pregunta = {
  q: string;
  opciones: string[];
  correcta: number;
};

export type Logistica = {
  hoteles?: string;
  transporte?: string;
};

/* ── Diseño ────────────────────────────────────────────────── */

export type Diseno = {
  /** El acento sale de la foto de la pareja, no del gusto propio. */
  acento: string;
  /** Casi blanco siempre: la invitación tiene que sentirse liviana. */
  fondo: string;
  /** Tipografía de nombres y títulos. El cuerpo va en la del sistema. */
  fuente: string;
  /** 0.08 a 0.25. Cuanto más cargada la foto, más bajo. */
  opacidadHero: number;
};

/* ── La invitación completa ────────────────────────────────── */

export type Invitacion = {
  slug: string;
  origen: "demo" | "cliente";

  /** Como lo quieren ver escrito. Ej: "Marti & Tomi". */
  nombres: string;
  /** Volanta chiquita arriba del nombre. Ej: "Nuestra Boda". */
  volanta: string;
  /** Formato español: "15 de Noviembre 2026". Siempre a futuro. */
  fecha: string;

  carta: Carta;
  /** La portada ilustrada. El centro va vacío: los nombres se escriben encima. */
  hero: { imagen: string; video: string };

  /**
   * Cenefas florales de las secciones de contenido, en el orden en que se
   * usan. Van generadas sobre blanco puro y se montan con `multiply`.
   * Si está vacío, las secciones se sostienen con el lavado del fondo.
   */
  flores?: string[];
  diseno: Diseno;

  /* ── Todo lo de abajo es la presentación, que todavía no se desarrolló.
     Opcional por ahora; pasa a obligatorio cuando se arme el contenido. ── */

  fotoHero?: string;
  galeria?: string[];
  frase?: string;

  cronograma?: Hito[];
  lugares?: Lugar[];
  /** Dibujos a línea. Con alpha, se montan con `multiply` sobre el papel. */
  ilustracionLugar?: string;
  ilustracionVestimenta?: string;
  /** El lacre suelto. Vuelve como botón del RSVP: esa rima con el sobre es lo
      que hace que la invitación se sienta una sola pieza. */
  sello?: string;
  dressCode?: { titulo: string; detalle: string };
  regalo?: Regalo;
  logistica?: Logistica;

  /** Tres preguntas, siempre de esta pareja. Nunca genéricas. */
  trivia?: Pregunta[];

  musica?: string;
  instagram?: string;

  /** Hasta cuándo puede confirmar la gente. */
  cierreRsvp?: string;
  /** El mural de notas y fotos de los invitados. */
  mural?: boolean;
};
