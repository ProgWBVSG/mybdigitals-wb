import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./invitacion.css";

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

export default function InvitacionLayout({ children }: { children: React.ReactNode }) {
  return <div className={`inv ${pinyon.variable} ${cormorant.variable}`}>{children}</div>;
}
