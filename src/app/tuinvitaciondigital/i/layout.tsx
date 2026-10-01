import { Bodoni_Moda, Cormorant_Garamond, DM_Mono, La_Belle_Aurore, Pinyon_Script, Shadows_Into_Light_Two } from "next/font/google";
import "./invitacion.css";
import "./fotomaton.css";
import "./funcion.css";
import "./garabato.css";

/* Dos familias y ninguna más.
   Pinyon es una spenceriana de verdad: Dancing Script y Great Vibes son las
   dos scripts de Canva y se reconocen al instante. */
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* Cormorant tiene la x chica y mucho contraste: se ve a Garamond impreso.
   Se cargan los pesos bajos nada más, porque en la invitación no hay negritas. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Las del estilo fotomatón. Sin precarga: Rosa no las usa, y precargarlas
   en todas las invitaciones sería bajar fuentes que nadie ve. */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/* Las del estilo garabato: mayúsculas de marcador y birome. Sin precarga. */
const mano = Shadows_Into_Light_Two({
  variable: "--font-mano",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const firma = La_Belle_Aurore({
  variable: "--font-firma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export default function InvitacionLayout({ children }: { children: React.ReactNode }) {
  return <div className={`inv ${pinyon.variable} ${cormorant.variable} ${bodoni.variable} ${mono.variable} ${mano.variable} ${firma.variable}`}>{children}</div>;
}
