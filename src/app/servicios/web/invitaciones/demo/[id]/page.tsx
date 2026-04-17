"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, CalendarHeart, MapPin, Gift, Music, Pause, Play, ChevronDown, 
  Camera, Map, Clock, HelpCircle, Shirt, Hotel, ChevronLeft, ChevronRight, ImagePlus, CheckCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

// ── BASE CONTENIDO POR TIPO ──

const baseBodasContent = {
  historyLine: "Hay recuerdos que no voy a borrar, personas que no voy a olvidar y lugares donde siempre voy a querer estar...",
  gallery: [
     "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
  ],
  locations: [
    { type: "Ceremonia", title: "Catedral Nuestra Señora", time: "18:00 hs", link: "https://maps.google.com/?q=Catedral", address: "Av. Principal 123", icon: MapPin },
    { type: "Fiesta", title: "Salón La Perla", time: "20:00 hs", link: "https://maps.google.com/?q=Salon", address: "Ruta 9, Km 13", icon: Map }
  ],
  dressCode: { title: "Elegante Formal", info: "Por favor, reservá el color blanco para la novia." },
  gifts: {
     message: "El mejor regalo es tu presencia. Pero si querés sumarte a nuestra luna de miel, podés hacerlo acá:",
     bank: "Santander Rio", cbu: "000000312000000000", alias: "boda.amor", name: "Los Novios"
  },
  mural: true,
  music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
  instagram: "nuestraboda2025",
  logistics: {
     hotels: "Contamos con tarifas especiales en el Hotel Principal (10% OFF mencionando el casamiento).",
     transport: "Saldrán micros desde Plaza Centro a las 17:30 hs puntuales."
  }
};

const baseCumplesContent = {
  historyLine: "Los momentos más lindos son los que compartimos con las personas que queremos...",
  gallery: [
     "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=600&q=80",
     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  ],
  locations: [
    { type: "Fiesta", title: "Salón Crystal", time: "21:30 hs", link: "https://maps.google.com/?q=Salon", address: "Calle Soñada 456", icon: Map }
  ],
  dressCode: { title: "Gala Inolvidable", info: "Un detalle brillante o rosa pálido." },
  gifts: {
     message: "Tu presencia es mi mejor regalo. Si querés hacerlo especial aún más, podés dejarme un detalle acá:",
     bank: "Galicia", cbu: "000000312000000000", alias: "mis.15.anios", name: "La Festejada"
  },
  mural: true,
  music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  instagram: "mis15party",
  logistics: {
     transport: "Micros disponibles desde el centro a las 20:30."
  }
};

// ── TRIVIA PERSONALIZADA POR DISEÑO ──

const triviaBodas: Record<string, {q: string; options: string[]; correct: number}[]> = {
  "1": [
    { q: "¿Dónde se conocieron Marti y Tomi?", options: ["En la uni", "En el trabajo", "Por amigos en común"], correct: 2 },
    { q: "¿Quién propuso el primer plan?", options: ["Marti", "Tomi", "Los dos a la vez"], correct: 1 },
    { q: "¿Cuál es su comida favorita juntos?", options: ["Pizza", "Sushi", "Asado del domingo"], correct: 2 },
  ],
  "2": [
    { q: "¿Cuántos años llevan juntos Julieta y Marcos?", options: ["2 años", "5 años", "8 años"], correct: 1 },
    { q: "¿Cuál es el destino soñado de luna de miel?", options: ["Europa", "Caribe", "Patagonia"], correct: 0 },
    { q: "¿Quién cocina mejor en la pareja?", options: ["Julieta", "Marcos", "Piden delivery siempre"], correct: 0 },
  ],
  "3": [
    { q: "¿Dónde fue la primera cita de Lisa y Hernán?", options: ["Un café", "Un parque", "Un concierto"], correct: 2 },
    { q: "¿Cuál es la mascota de la pareja?", options: ["Un gato", "Un perro", "No tienen"], correct: 0 },
    { q: "¿Cuál es su película favorita juntos?", options: ["El padrino", "Titanic", "La La Land"], correct: 2 },
  ],
  "4": [
    { q: "¿En qué ciudad se conocieron Candela y Elías?", options: ["Buenos Aires", "Córdoba", "Rosario"], correct: 1 },
    { q: "¿Cuál es el hobby compartido de la pareja?", options: ["Senderismo", "Fotografía", "Cocinar"], correct: 1 },
    { q: "¿Quién es más madrugador?", options: ["Candela", "Elías", "Ninguno, son nocturnos"], correct: 2 },
  ],
  "5": [
    { q: "¿Cuál es la canción del primer baile de Georgina y Joaquín?", options: ["Un bolero", "Un tango", "Una cumbia romántica"], correct: 1 },
    { q: "¿Cuántos años tiene la pareja junta?", options: ["3 años", "6 años", "9 años"], correct: 1 },
    { q: "¿Cuál es el destino favorito para escapadas?", options: ["El mar", "La montaña", "La ciudad"], correct: 1 },
  ],
  "6": [
    { q: "¿Quién propuso primero en la pareja?", options: ["Stefi", "Nico", "Fue sorpresa para los dos"], correct: 1 },
    { q: "¿Cuál es el plan preferido del finde?", options: ["Salir de noche", "Día de campo", "Películas en casa"], correct: 2 },
    { q: "¿A quién de los dos le gusta más el café?", options: ["Stefi", "Nico", "Los dos son adictos"], correct: 2 },
  ],
  "7": [
    { q: "¿Cuánto tiempo llevan juntos Anto y Fer?", options: ["1 año", "4 años", "7 años"], correct: 1 },
    { q: "¿Cuál es su lugar favorito para comer?", options: ["En casa", "Bodegón del barrio", "Restaurante fancy"], correct: 1 },
    { q: "¿Cuál fue el primer viaje juntos?", options: ["Mar del Plata", "Mendoza", "Iguazú"], correct: 0 },
  ],
  "8": [
    { q: "¿Qué deporte practican juntos Valentina y Lucas?", options: ["Tenis", "Running", "Ciclismo"], correct: 1 },
    { q: "¿Cuál es el lugar ideal para sus vacaciones?", options: ["Playa tropical", "Ciudad europea", "Parque nacional"], correct: 0 },
    { q: "¿Quién es más ordenado en la pareja?", options: ["Valentina", "Lucas", "Es complejo..."], correct: 0 },
  ],
};

const triviaCumples: Record<string, {q: string; options: string[]; correct: number}[]> = {
  "1": [
    { q: "¿Cuál es la comida favorita de Mía?", options: ["Sushi", "Milanesa con papas", "Pasta"], correct: 0 },
    { q: "¿Qué música no puede faltar en la fiesta de Mía?", options: ["Reggaetón", "Pop", "Cumbia"], correct: 0 },
    { q: "¿Cuál es el color favorito de Mía?", options: ["Violeta", "Rosa", "Azul"], correct: 0 },
  ],
  "2": [
    { q: "¿Qué destino sueña visitar Delfina?", options: ["Japón", "París", "Nueva York"], correct: 1 },
    { q: "¿Cuál es la serie favorita de Delfina?", options: ["Stranger Things", "Élite", "Gossip Girl"], correct: 2 },
    { q: "¿Qué tipo de fiesta le encanta a Delfina?", options: ["Tranquila y íntima", "Épica con muchos amigos", "Solo con la familia"], correct: 1 },
  ],
  "3": [
    { q: "¿Cuál es el postre favorito de Valentina?", options: ["Cheesecake", "Tiramisu", "Alfajores"], correct: 0 },
    { q: "¿Qué hobby tiene Valentina?", options: ["Pintura", "Baile", "Fotografía"], correct: 1 },
    { q: "¿Cuántos amigos tiene Valentina en su grupo close?", options: ["3 o 4", "Entre 8 y 10", "Es muy sociable, más de 15"], correct: 1 },
  ],
  "4": [
    { q: "¿Cuál es el género musical que más escucha Camila?", options: ["Pop en español", "K-pop", "Trap latino"], correct: 1 },
    { q: "¿Qué hace Camila cuando está sola en casa?", options: ["Ve series", "Cocina", "Sale igual"], correct: 0 },
    { q: "¿Cuál es el animal favorito de Camila?", options: ["Gato", "Perro", "Conejo"], correct: 0 },
  ],
  "5": [
    { q: "¿Cuál es el deporte favorito de Martina?", options: ["Vóley", "Natación", "Tenis"], correct: 0 },
    { q: "¿Qué le regalarías a Martina si pudieras?", options: ["Un viaje", "Ropa de marca", "Una cena especial"], correct: 0 },
    { q: "¿Cuál es la película favorita de Martina?", options: ["Mamma Mia", "El diablo viste a la moda", "Crepúsculo"], correct: 0 },
  ],
  "6": [
    { q: "¿En qué barrio vive Luna?", options: ["El centro", "Las afueras", "Cerca de la playa"], correct: 2 },
    { q: "¿Cuál es el snack favorito de Luna?", options: ["Palomitas", "Papas fritas", "Oreos"], correct: 2 },
    { q: "¿Qué hace Luna los domingos?", options: ["Duerme hasta tarde", "Sale a caminar", "Visita a la familia"], correct: 0 },
  ],
  "7": [
    { q: "¿Cuál es la estación del año favorita de Sol?", options: ["Verano", "Primavera", "Otoño"], correct: 0 },
    { q: "¿Qué tipo de música suele escuchar Sol?", options: ["Indie pop", "Cumbia", "Clásica"], correct: 0 },
    { q: "¿Cuál es el superpoder que le gustaría tener a Sol?", options: ["Volar", "Ser invisible", "Teletransportarse"], correct: 2 },
  ],
  "8": [
    { q: "¿Cuál es la comida favorita de Renata?", options: ["Tacos", "Pizza", "Empanadas"], correct: 2 },
    { q: "¿Qué plan elige Renata para su cumple?", options: ["Viaje sorpresa", "Fiesta épica", "Cena íntima"], correct: 1 },
    { q: "¿Cuál es el emoji que más usa Renata?", options: ["😂", "🌸", "🔥"], correct: 1 },
  ],
};

// ── BASE DE DATOS DEMOS ──
const demoDataBase: Record<string, any> = {
  // BODAS
  "bodas-1": { ...baseBodasContent, trivia: triviaBodas["1"], names: "Marti & Tomi", gateTitle: "Nuestra Boda", decorGate: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80", date: "15 de Noviembre 2025", font: "Georgia, serif", colorAccent: "#d4af37", styleType: "photo", opacityHero: 0.15 },
  "bodas-2": { ...baseBodasContent, trivia: triviaBodas["2"], names: "Julieta & Marcos", gateTitle: "Nos Casamos", decorGate: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80", date: "22 de Marzo 2026", font: "Arial, sans-serif", colorAccent: "#60a5fa", styleType: "photo", opacityHero: 0.2 },
  "bodas-3": { ...baseBodasContent, trivia: triviaBodas["3"], names: "Lisa & Hernán", gateTitle: "Celebramos", decorGate: "https://images.unsplash.com/photo-1596431940984-7eaf9bd80de5?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1596431940984-7eaf9bd80de5?auto=format&fit=crop&w=1920&q=80", date: "16 de Septiembre 2025", font: "Geist Sans, sans-serif", colorAccent: "#4b5548", styleType: "watercolor", opacityHero: 0.1 },
  "bodas-4": { ...baseBodasContent, trivia: triviaBodas["4"], names: "Candela & Elías", gateTitle: "Gran Día", decorGate: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80", date: "08 de Junio 2025", font: "Courier New, monospace", colorAccent: "#9ca3af", styleType: "photo", opacityHero: 0.2 },
  "bodas-5": { ...baseBodasContent, trivia: triviaBodas["5"], names: "Georgina & Joaquín", gateTitle: "Sunset Boho", decorGate: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80", date: "30 de Agosto 2025", font: "Palatino, serif", colorAccent: "#f0a58f", styleType: "photo", opacityHero: 0.15 },
  "bodas-6": { ...baseBodasContent, trivia: triviaBodas["6"], names: "Stefi & Nico", gateTitle: "Monograma Elegante", decorGate: "https://images.unsplash.com/photo-1579549321487-3cb83e5a5960?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1579549321487-3cb83e5a5960?auto=format&fit=crop&w=1920&q=80", date: "20 de Diciembre 2025", font: "Georgia, serif", colorAccent: "#611a28", styleType: "watercolor", opacityHero: 0.1 },
  "bodas-7": { ...baseBodasContent, trivia: triviaBodas["7"], names: "Anto & Fer", gateTitle: "Lavanda Clásica", decorGate: "https://images.unsplash.com/photo-1543362143-6c84b1ebac1d?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1543362143-6c84b1ebac1d?auto=format&fit=crop&w=1920&q=80", date: "14 de Octubre 2025", font: "Arial, sans-serif", colorAccent: "#a78bfa", styleType: "watercolor", opacityHero: 0.08 },
  "bodas-8": { ...baseBodasContent, trivia: triviaBodas["8"], names: "Valentina & Lucas", gateTitle: "El Gran Día", decorGate: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1920&q=80", date: "11 de Octubre 2025", font: "Arial, sans-serif", colorAccent: "#cbd5e1", styleType: "photo", opacityHero: 0.15 },

  // CUMPLES
  "cumples-1": { ...baseCumplesContent, trivia: triviaCumples["1"], names: "Mía", gateTitle: "Mis 15 Años", decorGate: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1920&q=80", date: "10 Diciembre 2025", font: "Arial, sans-serif", colorAccent: "#a855f7", styleType: "photo", opacityHero: 0.25 },
  "cumples-2": { ...baseCumplesContent, trivia: triviaCumples["2"], names: "Delfina", gateTitle: "Mis 15", decorGate: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80", bgHero: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80", date: "24 Mayo 2025", font: "Georgia, serif", colorAccent: "#eaac8b", styleType: "watercolor", opacityHero: 0.1 },
  "cumples-3": { ...baseCumplesContent, trivia: triviaCumples["3"], names: "Valentina", gateTitle: "Golden Sweet", bgHero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80", date: "15 de Agosto", font: "Palatino, serif", colorAccent: "#eab308", styleType: "photo", opacityHero: 0.15 },
  "cumples-4": { ...baseCumplesContent, trivia: triviaCumples["4"], names: "Camila", gateTitle: "Gala Rosa", bgHero: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?auto=format&fit=crop&w=1920&q=80", date: "20 Septiembre 2025", font: "Courier New, monospace", colorAccent: "#f43f5e", styleType: "photo", opacityHero: 0.2 },
  "cumples-5": { ...baseCumplesContent, trivia: triviaCumples["5"], names: "Martina", gateTitle: "Mis XV", bgHero: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1920&q=80", date: "05 Febrero 2026", font: "Trebuchet MS, sans-serif", colorAccent: "#3b82f6", styleType: "photo", opacityHero: 0.25 },
  "cumples-6": { ...baseCumplesContent, trivia: triviaCumples["6"], names: "Luna", gateTitle: "Party", bgHero: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80", date: "18 de Octubre", font: "Inter, sans-serif", colorAccent: "#818cf8", styleType: "photo", opacityHero: 0.2 },
  "cumples-7": { ...baseCumplesContent, trivia: triviaCumples["7"], names: "Sol", gateTitle: "15 Años", bgHero: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1920&q=80", date: "12 Enero 2026", font: "Georgia, serif", colorAccent: "#db2777", styleType: "watercolor", opacityHero: 0.1 },
  "cumples-8": { ...baseCumplesContent, trivia: triviaCumples["8"], names: "Renata", gateTitle: "Mis XV", bgHero: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1920&q=80", date: "28 Noviembre 2025", font: "Arial, sans-serif", colorAccent: "#ea580c", styleType: "photo", opacityHero: 0.2 },
};

function SectionTitle({ title, font, color }: { title: string; font: string; color: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="text-4xl text-center mb-10"
      style={{ fontFamily: font, color }}
    >
      {title}
    </motion.h2>
  );
}

export default function DemoInvitationPage() {
  const router = useRouter();
  const params = useParams();

  const [data, setData] = useState<any>(null);
  const [guestName, setGuestName] = useState<string>("");
  const [invType, setInvType] = useState<string>("bodas");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const t = urlParams.get("t") || "bodas";
      const id = params?.id || "1";
      const n = urlParams.get("n") || "";
      const key = `${t}-${id}`;
      setData(demoDataBase[key] || demoDataBase["bodas-1"]);
      setGuestName(n);
      setInvType(t);
    }
  }, [params]);

  const [isEntered, setIsEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 45, h: 12, m: 30, s: 0 });
  const [showGifts, setShowGifts] = useState(false);
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaAns, setTriviaAns] = useState<Record<number, number | null>>({});

  // ── RSVP STATE ──
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<"yes" | "no" | null>(null);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpDiet, setRsvpDiet] = useState<Set<string>>(new Set());
  const [rsvpSong, setRsvpSong] = useState("");

  const dietOptions = [
    { id: "ninguna", label: "Sin restricciones" },
    { id: "vegetariano", label: "Vegetariano / Vegano" },
    { id: "sinTacc", label: "Sin TACC (Celíaco)" },
    { id: "lactosa", label: "Intolerante a la lactosa" },
  ];

  const toggleDiet = (id: string) => {
    setRsvpDiet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  type MuralNote = { id: number; type: "note" | "photo"; text?: string; name?: string; color?: string; rotation: number; x: number | string; y: number | string; imageUrl?: string };
  const [notes, setNotes] = useState<MuralNote[]>([
    { id: 1, type: "note", text: "¡Muchas felicidades! Que sea una noche increíble", name: "Tía Marta", color: "#fef08a", rotation: -5, x: "10%", y: "15%" },
    { id: 2, type: "note", text: "Los quiero mucho, a romper la pista", name: "Sofi", color: "#fbcfe8", rotation: 3, x: "45%", y: "15%" },
    { id: 3, type: "photo", name: "Fede y Cami", imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80", rotation: -2, x: "20%", y: "45%" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [newName, setNewName] = useState("");
  const muralRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (guestName && !newName) setNewName(guestName);
  }, [guestName]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const colors = ["#fef08a", "#fbcfe8", "#bbf7d0", "#bfdbfe", "#e9d5ff"];
    setNotes((prev) => [...prev, {
      id: Date.now(), type: "note", text: newNote,
      name: newName || "Invitado",
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.floor(Math.random() * 10) - 5,
      x: "40%", y: "40%",
    }]);
    setNewNote("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNotes((prev) => [...prev, {
      id: Date.now(), type: "photo", imageUrl: url,
      name: newName || "Invitado",
      rotation: Math.floor(Math.random() * 10) - 5,
      x: "30%", y: "30%",
    }]);
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { d, h, m, s } = prev;
        if (s > 0) s--;
        else { s = 59; if (m > 0) m--; else { m = 59; if (h > 0) h--; else { h = 23; d--; } } }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500 text-sm">Cargando demo...</div>;

  const handleEnter = () => {
    setIsEntered(true);
    setIsPlaying(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  const handleRsvpSubmit = () => {
    if (!rsvpAttending || !rsvpName.trim()) return;
    setRsvpSubmitted(true);
  };

  // Sección de galería: texto genérico por tipo
  const galleryTitle = invType === "bodas" ? "Nuestros Momentos" : "Galería";
  // Etiqueta de RSVP por tipo
  const rsvpDeadlineLabel = invType === "bodas"
    ? `Por favor confirmá antes del 1° del mes anterior a la boda.`
    : `Confirmá tu asistencia antes del ${data.date?.split(" ").slice(-2).join(" ") || "la fecha"}.`;

  return (
    <div className="bg-[#fcfcff] min-h-screen text-stone-800 font-sans selection:bg-rose-200 overflow-x-hidden">
      <audio ref={audioRef} src={data.music} loop hidden />

      {/* ── 1. PANTALLA DE INGRESO (Gatekeeper) ── */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#fbfbfb] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none flex flex-col items-center justify-center">
              <Image src={data.decorGate || data.bgHero} alt="Decor" fill className="object-cover scale-105 opacity-40 blur-sm" priority />
              <div className="absolute inset-0 bg-stone-50/50 mix-blend-color" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative z-10 flex flex-col items-center text-center px-4"
            >
              {/* Sin "Hola familia X" — presentación elegante */}
              <p className="text-[10px] tracking-[0.35em] text-stone-500 font-bold uppercase mb-4" style={{ color: data.colorAccent }}>
                {data.gateTitle}
              </p>

              <h1
                style={{ fontFamily: "'Dancing Script', 'Georgia', cursive", fontSize: "4.5rem", lineHeight: 1 }}
                className="text-stone-700 mb-3 max-w-sm"
              >
                {data.names}
              </h1>

              <p className="text-stone-400 text-xs tracking-[0.15em] mb-8 uppercase">{data.date}</p>

              {guestName && (
                <div className="mb-6 text-stone-600 bg-white/80 px-5 py-2 rounded-full backdrop-blur-md border border-stone-200/60 text-xs tracking-widest font-semibold uppercase shadow-sm">
                  Tu lugar está reservado, <span style={{ color: data.colorAccent }}>{guestName}</span>
                </div>
              )}

              <button
                onClick={handleEnter}
                className="relative overflow-hidden group border border-stone-300 bg-white hover:border-stone-800 text-stone-600 hover:text-stone-900 px-10 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-sm"
              >
                <div className="absolute inset-0 w-0 bg-stone-100 transition-all duration-[250ms] ease-out group-hover:w-full" />
                <span className="relative z-10 flex items-center gap-2">
                  Abrir Invitación <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTÓN VOLVER ── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-stone-200 text-stone-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors shadow-sm"
      >
        <ArrowLeft size={12} strokeWidth={2.5} /> Catálogo
      </motion.button>

      {/* ── BOTÓN MÚSICA ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-stone-100/50 text-stone-700 hover:scale-110 transition-transform"
      >
        <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-2 border-[1.5px] border-dashed border-stone-300 rounded-full" />
        {isPlaying ? <Pause size={16} fill="currentColor" strokeWidth={0} /> : <Play size={16} fill="currentColor" className="ml-1" strokeWidth={0} />}
      </motion.button>

      {/* ── 2. HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className={`absolute inset-0 z-0 ${data.styleType === "watercolor" ? "mix-blend-multiply opacity-50" : ""}`}>
          <Image src={data.bgHero} alt="Fondo" fill className="object-cover" priority style={{ opacity: data.opacityHero }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fcfcff]/5 via-[#fcfcff]/60 to-[#fcfcff]" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center px-4 w-full text-center mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            style={{ fontFamily: data.font, color: data.colorAccent }}
            className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest mb-4"
          >
            {data.names}
          </motion.h1>
          <div className="w-10 h-[1px] bg-stone-300 my-6" />
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-sm md:text-lg text-stone-500 tracking-[0.2em] font-light uppercase"
          >
            {data.date}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-12 text-stone-400"
        >
          <ChevronDown size={24} strokeWidth={1} />
        </motion.div>
      </section>

      {/* ── HISTORIA / FRASE ── */}
      {data.historyLine && (
        <section className="relative py-28 px-6 text-center overflow-hidden border-b border-stone-100" style={{ backgroundColor: "#fdfaf6" }}>
          {/* Fondo floral visible */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1490750967868-88df5691cc6e?auto=format&fit=crop&w=1600&q=80"
              alt="Flores decorativas"
              fill
              className="object-cover"
              style={{ opacity: 0.18 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf6]/80 via-transparent to-[#fdfaf6]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdfaf6]/60 via-transparent to-[#fdfaf6]/60" />
          </div>

          {/* Rama izquierda */}
          <div className="absolute left-0 top-0 h-full w-48 pointer-events-none" style={{ color: data.colorAccent, opacity: 0.65 }}>
            <svg viewBox="0 0 180 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M25 520 C35 420 15 365 50 290 C70 235 28 178 58 115 C78 72 45 35 68 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M48 400 C72 378 108 388 132 365" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M42 310 C66 285 100 300 124 275" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M52 225 C76 202 112 218 140 195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <ellipse cx="80" cy="390" rx="18" ry="9" fill="currentColor" opacity="0.3" transform="rotate(-25 80 390)"/>
              <ellipse cx="72" cy="300" rx="16" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-30 72 300)"/>
              <circle cx="132" cy="365" r="12" fill="currentColor" opacity="0.18"/>
              <circle cx="132" cy="365" r="5" fill="currentColor" opacity="0.7"/>
              <ellipse cx="132" cy="352" rx="7" ry="4" fill="currentColor" opacity="0.4"/>
              <ellipse cx="143" cy="358" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(55 143 358)"/>
              <ellipse cx="143" cy="372" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(125 143 372)"/>
              <ellipse cx="132" cy="378" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(180 132 378)"/>
              <ellipse cx="121" cy="372" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(-125 121 372)"/>
              <ellipse cx="121" cy="358" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(-55 121 358)"/>
              <circle cx="124" cy="275" r="9" fill="currentColor" opacity="0.18"/>
              <circle cx="124" cy="275" r="4" fill="currentColor" opacity="0.7"/>
              <ellipse cx="124" cy="265" rx="6" ry="3.5" fill="currentColor" opacity="0.4"/>
              <ellipse cx="133" cy="271" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(60 133 271)"/>
              <ellipse cx="133" cy="279" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(120 133 279)"/>
              <ellipse cx="124" cy="285" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(180 124 285)"/>
              <ellipse cx="115" cy="279" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(-120 115 279)"/>
              <ellipse cx="115" cy="271" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(-60 115 271)"/>
              <circle cx="140" cy="195" r="8" fill="currentColor" opacity="0.18"/>
              <circle cx="140" cy="195" r="3.5" fill="currentColor" opacity="0.7"/>
              <ellipse cx="140" cy="186" rx="5" ry="3" fill="currentColor" opacity="0.4"/>
              <ellipse cx="149" cy="191" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(60 149 191)"/>
              <ellipse cx="149" cy="199" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(120 149 199)"/>
              <ellipse cx="140" cy="204" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(180 140 204)"/>
              <ellipse cx="131" cy="199" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(-120 131 199)"/>
              <ellipse cx="131" cy="191" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(-60 131 191)"/>
              <circle cx="68" cy="5" r="5" fill="currentColor" opacity="0.55"/>
            </svg>
          </div>

          {/* Rama derecha (espejo) */}
          <div className="absolute right-0 top-0 h-full w-48 pointer-events-none" style={{ color: data.colorAccent, opacity: 0.65 }}>
            <svg viewBox="0 0 180 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ transform: "scaleX(-1)" }}>
              <path d="M25 520 C35 420 15 365 50 290 C70 235 28 178 58 115 C78 72 45 35 68 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M48 400 C72 378 108 388 132 365" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M42 310 C66 285 100 300 124 275" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M52 225 C76 202 112 218 140 195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <ellipse cx="80" cy="390" rx="18" ry="9" fill="currentColor" opacity="0.3" transform="rotate(-25 80 390)"/>
              <ellipse cx="72" cy="300" rx="16" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-30 72 300)"/>
              <circle cx="132" cy="365" r="12" fill="currentColor" opacity="0.18"/>
              <circle cx="132" cy="365" r="5" fill="currentColor" opacity="0.7"/>
              <ellipse cx="132" cy="352" rx="7" ry="4" fill="currentColor" opacity="0.4"/>
              <ellipse cx="143" cy="358" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(55 143 358)"/>
              <ellipse cx="143" cy="372" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(125 143 372)"/>
              <ellipse cx="132" cy="378" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(180 132 378)"/>
              <ellipse cx="121" cy="372" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(-125 121 372)"/>
              <ellipse cx="121" cy="358" rx="7" ry="4" fill="currentColor" opacity="0.4" transform="rotate(-55 121 358)"/>
              <circle cx="124" cy="275" r="9" fill="currentColor" opacity="0.18"/>
              <circle cx="124" cy="275" r="4" fill="currentColor" opacity="0.7"/>
              <ellipse cx="124" cy="265" rx="6" ry="3.5" fill="currentColor" opacity="0.4"/>
              <ellipse cx="133" cy="271" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(60 133 271)"/>
              <ellipse cx="133" cy="279" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(120 133 279)"/>
              <ellipse cx="124" cy="285" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(180 124 285)"/>
              <ellipse cx="115" cy="279" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(-120 115 279)"/>
              <ellipse cx="115" cy="271" rx="6" ry="3.5" fill="currentColor" opacity="0.4" transform="rotate(-60 115 271)"/>
              <circle cx="140" cy="195" r="8" fill="currentColor" opacity="0.18"/>
              <circle cx="140" cy="195" r="3.5" fill="currentColor" opacity="0.7"/>
              <ellipse cx="140" cy="186" rx="5" ry="3" fill="currentColor" opacity="0.4"/>
              <ellipse cx="149" cy="191" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(60 149 191)"/>
              <ellipse cx="149" cy="199" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(120 149 199)"/>
              <ellipse cx="140" cy="204" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(180 140 204)"/>
              <ellipse cx="131" cy="199" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(-120 131 199)"/>
              <ellipse cx="131" cy="191" rx="5" ry="3" fill="currentColor" opacity="0.4" transform="rotate(-60 131 191)"/>
              <circle cx="68" cy="5" r="5" fill="currentColor" opacity="0.55"/>
            </svg>
          </div>

          {/* Texto */}
          <div className="relative z-10 max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-stone-300" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: data.colorAccent }}>
                <path d="M10 2C10 2 7 6 2 6C2 6 6 9 6 14C6 14 8 11 10 10C12 11 14 14 14 14C14 9 18 6 18 6C13 6 10 2 10 2Z" fill="currentColor" opacity="0.7"/>
              </svg>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-stone-300" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-xl md:text-2xl font-light italic leading-relaxed text-stone-600"
              style={{ fontFamily: "Georgia, serif" }}
            >
              &ldquo;{data.historyLine}&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-3 mt-8"
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-stone-300" />
              <div className="flex gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: data.colorAccent, opacity: 0.5 }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.colorAccent, opacity: 0.7 }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: data.colorAccent, opacity: 0.5 }} />
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-stone-300" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CUENTA REGRESIVA ── */}
      <section className="py-20 px-6 flex flex-col items-center justify-center border-b border-stone-100 bg-[#fbfbfb]">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-8 font-semibold">Faltan</p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="flex gap-3 md:gap-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="w-16 h-20 md:w-20 md:h-24 bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <span className="text-2xl md:text-3xl text-stone-700 font-serif" style={{ color: data.colorAccent }}>
                {value.toString().padStart(2, "0")}
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-stone-400 mt-2">
                {{ d: "Días", h: "Hs", m: "Min", s: "Seg" }[unit]}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── GALERÍA DE FOTOS ── */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-20 overflow-hidden relative border-b border-stone-100">
          <SectionTitle title={galleryTitle} font={data.font} color={data.colorAccent} />
          <div className="relative flex w-[200%] gap-4" style={{ WebkitMaskImage: "linear-gradient(90deg, transparent, white 10%, white 90%, transparent)" }}>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-4 min-w-max"
            >
              {[...data.gallery, ...data.gallery].map((img: string, i: number) => (
                <div key={i} className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                  <Image src={img} alt="Galería" fill className="object-cover" sizes="(max-width: 768px) 256px, 320px" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── UBICACIÓN ── */}
      {data.locations && (
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <SectionTitle title="Dónde y Cuándo" font={data.font} color={data.colorAccent} />
          <div className="grid md:grid-cols-2 gap-8">
            {data.locations.map((loc: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-stone-200 p-8 rounded-3xl text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center mb-6 text-stone-500">
                  <loc.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl tracking-wider uppercase mb-2" style={{ color: data.colorAccent }}>{loc.type}</h3>
                <p className="font-serif text-2xl text-stone-700 mb-1">{loc.title}</p>
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                  <Clock size={14} /> <span>{loc.time}</span>
                </div>
                <p className="text-sm text-stone-500 mb-8">{loc.address}</p>
                <a href={loc.link} target="_blank" rel="noopener noreferrer" className="border border-stone-300 text-stone-600 hover:bg-stone-50 px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors w-full">
                  Cómo Llegar
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── DRESS CODE Y LOGÍSTICA ── */}
      {(data.dressCode || data.logistics) && (
        <section className="py-20 px-6 bg-[#fbfbfb] border-y border-stone-100 flex flex-col md:flex-row gap-10 justify-center items-center md:items-start text-center">
          {data.dressCode && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col items-center max-w-sm">
              <Shirt className="text-stone-400 mb-4" strokeWidth={1} size={36} />
              <h3 className="text-lg uppercase tracking-widest font-semibold mb-2" style={{ color: data.colorAccent }}>Dress Code</h3>
              <p className="font-serif text-xl text-stone-700 mb-2">{data.dressCode.title}</p>
              <p className="text-sm text-stone-500">{data.dressCode.info}</p>
            </motion.div>
          )}

          {data.logistics && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col items-center max-w-sm mt-10 md:mt-0">
              <Hotel className="text-stone-400 mb-4" strokeWidth={1} size={36} />
              <h3 className="text-lg uppercase tracking-widest font-semibold mb-2" style={{ color: data.colorAccent }}>Logística</h3>
              {data.logistics.hotels && <p className="text-sm text-stone-500 mb-3">{data.logistics.hotels}</p>}
              {data.logistics.hotels && <div className="h-px w-10 bg-stone-300 my-2" />}
              <p className="text-sm text-stone-500">{data.logistics.transport}</p>
            </motion.div>
          )}
        </section>
      )}

      {/* ── REGALOS ── */}
      {data.gifts && (
        <section className="py-24 px-6 max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
              <Gift size={28} strokeWidth={1} />
            </div>
          </div>
          <SectionTitle title="Mesa de Regalos" font={data.font} color={data.colorAccent} />
          <p className="text-stone-500 mb-8 leading-relaxed text-sm">{data.gifts.message}</p>

          <button
            onClick={() => setShowGifts(!showGifts)}
            className="bg-white border border-stone-300 text-stone-700 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:border-stone-400 transition"
          >
            Datos Bancarios
          </button>

          <AnimatePresence>
            {showGifts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="bg-white border border-stone-200 rounded-2xl p-6 text-sm text-stone-600 flex flex-col gap-3 shadow-inner">
                  <p><strong>Banco:</strong> {data.gifts.bank}</p>
                  <p><strong>Alias:</strong> {data.gifts.alias}</p>
                  <p><strong>CBU:</strong> <span className="font-mono">{data.gifts.cbu}</span></p>
                  <p><strong>Titular:</strong> {data.gifts.name}</p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(data.gifts.cbu)}
                    className="mt-4 border border-stone-300 bg-stone-50 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider hover:bg-stone-100 transition"
                    style={{ color: data.colorAccent }}
                  >
                    Copiar CBU
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* ── TRIVIA ── */}
      {data.trivia && Array.isArray(data.trivia) && data.trivia.length > 0 && (() => {
        const currentTrivia = data.trivia[triviaIdx];
        const currentAns = triviaAns[triviaIdx] ?? null;
        return (
          <section className="py-24 px-6 bg-[#fbfbfb] border-y border-stone-100 flex flex-col items-center">
            <HelpCircle className="text-stone-400 mb-6" size={32} strokeWidth={1} />
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-4" style={{ color: data.colorAccent }}>Mini Juego</p>

            <div className="flex items-center gap-4 w-full justify-center max-w-lg mb-8">
              <button onClick={() => setTriviaIdx((p) => Math.max(p - 1, 0))} disabled={triviaIdx === 0} className="text-stone-400 disabled:opacity-30 hover:text-stone-700 transition p-2">
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={triviaIdx}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                    className="font-serif text-2xl md:text-3xl text-stone-700 text-center h-16 flex items-center justify-center leading-tight"
                  >
                    {currentTrivia.q}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <button onClick={() => setTriviaIdx((p) => Math.min(p + 1, data.trivia.length - 1))} disabled={triviaIdx === data.trivia.length - 1} className="text-stone-400 disabled:opacity-30 hover:text-stone-700 transition p-2">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
              {currentTrivia.options.map((opt: string, i: number) => {
                const isSelected = currentAns === i;
                const isCorrect = i === currentTrivia.correct;
                let style = "bg-white border-stone-200 text-stone-600";
                if (currentAns !== null) {
                  if (isSelected && !isCorrect) style = "bg-red-50 border-red-200 text-red-600";
                  if (isCorrect) style = "bg-green-50 border-green-200 text-green-700";
                }
                return (
                  <button
                    key={`${triviaIdx}-${i}`}
                    disabled={currentAns !== null}
                    onClick={() => setTriviaAns((p) => ({ ...p, [triviaIdx]: i }))}
                    className={`border px-6 py-4 rounded-xl text-sm font-medium transition-all ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="h-10 mt-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentAns !== null && (
                  <motion.p key={`ans-${triviaIdx}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm font-bold text-stone-500">
                    {currentAns === currentTrivia.correct ? "¡Acertaste! Los conocés de memoria. 🎉" : "¡Casi! Pero no... 😅"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {data.trivia.map((_: any, i: number) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === triviaIdx ? "bg-stone-600" : "bg-stone-300"}`} style={{ backgroundColor: i === triviaIdx ? data.colorAccent : undefined }} />
              ))}
            </div>
          </section>
        );
      })()}

      {/* ── INSTAGRAM / HASHTAG ── */}
      {data.instagram && (
        <section className="py-20 px-6 max-w-lg mx-auto text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-6">
            <Camera strokeWidth={1.5} size={24} />
          </div>
          <SectionTitle title="Compartí tus fotos" font={data.font} color={data.colorAccent} />
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            Etiquetanos en tus fotos y videos de la fiesta usando el hashtag oficial.
          </p>
          <p className="font-bold text-2xl tracking-widest uppercase mb-8" style={{ color: data.colorAccent }}>
            #{data.instagram}
          </p>
        </section>
      )}

      {/* ── MURAL INTERACTIVO ── */}
      {data.mural && (
        <section className="py-24 px-6 bg-[#fbfbfb] border-y border-stone-100 flex flex-col lg:flex-row gap-10 items-center justify-center overflow-hidden">
          <div className="w-full max-w-sm flex flex-col items-center lg:items-start text-center lg:text-left">
            <SectionTitle title="Mural de Deseos" font={data.font} color={data.colorAccent} />
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              Dejá tu marca en el mural virtual. Escribí un mensaje y arrastrá tu notita donde más te guste.
            </p>
            <div className="w-full flex flex-col gap-3 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative z-20">
              <input
                type="text"
                placeholder="Tu nombre o apodo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none"
              />
              <textarea
                placeholder="Escribí un deseo o mensaje corto..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                maxLength={60}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none resize-none h-24"
              />
              <div className="flex gap-2 mt-2 w-full">
                <button
                  onClick={addNote}
                  style={{ backgroundColor: data.colorAccent }}
                  className="flex-1 text-white px-2 py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-lg hover:brightness-110 transition flex items-center justify-center whitespace-nowrap"
                >
                  Colgar Nota
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-[42px] bg-stone-100 border border-stone-200 text-stone-600 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-colors shadow-sm self-center"
                  title="Añadir Foto"
                >
                  <ImagePlus size={18} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handlePhotoUpload} />
              </div>
            </div>
          </div>

          <div ref={muralRef} className="w-full max-w-xl h-[450px] border-[12px] border-[#d4bca4] bg-[#fdfaf6] rounded-lg shadow-inner relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cork-board.png')] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-4 bg-black/5 pointer-events-none" />

            {notes.map((note) => {
              if (note.type === "photo") {
                return (
                  <motion.div
                    key={note.id} drag dragConstraints={muralRef} dragElastic={0} dragMomentum={false}
                    initial={{ opacity: 0, scale: 0.5, left: note.x, top: note.y }}
                    animate={{ opacity: 1, scale: 1, left: note.x, top: note.y }}
                    style={{ rotate: note.rotation }}
                    className="absolute p-2 pb-4 bg-white shadow-xl cursor-grab active:cursor-grabbing border border-stone-200 flex flex-col items-center z-10"
                  >
                    <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-[inset_0_-1px_3px_rgba(0,0,0,0.3)] absolute -top-1.5 left-1/2 -translate-x-1/2 z-20" />
                    <div className="w-28 h-28 md:w-36 md:h-36 relative bg-stone-100 overflow-hidden mb-2 pointer-events-none">
                      <Image src={note.imageUrl!} alt="Foto" fill className="object-cover" />
                    </div>
                    <p className="font-serif text-[11px] text-stone-800 text-center uppercase tracking-wide">{note.name}</p>
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={note.id} drag dragConstraints={muralRef} dragElastic={0} dragMomentum={false}
                  initial={{ opacity: 0, scale: 0.5, left: note.x, top: note.y }}
                  animate={{ opacity: 1, scale: 1, left: note.x, top: note.y }}
                  style={{ backgroundColor: note.color, rotate: note.rotation }}
                  className="absolute w-32 min-h-[120px] p-4 shadow-md flex flex-col gap-2 cursor-grab active:cursor-grabbing border-t border-white/40 z-10"
                >
                  <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-[inset_0_-1px_3px_rgba(0,0,0,0.3)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  <p className="font-serif text-sm text-stone-800 leading-snug break-words flex-1 mt-1 pointer-events-none">{note.text}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 text-right pointer-events-none">{note.name}</p>
                </motion.div>
              );
            })}

            {notes.length === 0 && <p className="text-stone-400 font-serif italic relative z-10 pointer-events-none">Mural vacío...</p>}
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      <section className="bg-stone-900 text-stone-300 py-32 px-6 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 w-full max-w-lg flex flex-col items-center">
          <SectionTitle title="RSVP" font={data.font} color="#ffffff" />

          <AnimatePresence mode="wait">
            {rsvpSubmitted ? (
              /* ── SUCCESS STATE ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${data.colorAccent}22`, border: `2px solid ${data.colorAccent}` }}
                >
                  <CheckCircle size={40} style={{ color: data.colorAccent }} strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: data.font }}>
                    ¡Confirmado!
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {rsvpAttending === "yes"
                      ? `Ya estás anotado, ${rsvpName}. ¡Nos vemos en el gran día!`
                      : `Recibimos tu respuesta, ${rsvpName}. Gracias por avisarnos.`}
                  </p>
                </div>
                {rsvpAttending === "yes" && (
                  <p className="text-[11px] tracking-widest uppercase text-stone-500 border border-stone-700 rounded-full px-4 py-2">
                    {data.date}
                  </p>
                )}
              </motion.div>
            ) : (
              /* ── FORM STATE ── */
              <motion.div key="form" exit={{ opacity: 0 }} className="w-full">
                <p className="text-stone-400 mb-10 font-light leading-relaxed text-sm">
                  {rsvpDeadlineLabel}
                </p>

                <div className="bg-stone-800/50 border border-stone-700 rounded-3xl p-6 md:p-8 w-full text-left flex flex-col gap-6">
                  {/* Nombre siempre editable */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Tu nombre completo</label>
                    <input
                      type="text"
                      placeholder="Escribí tu nombre..."
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-200 outline-none focus:border-stone-500 transition-colors"
                    />
                  </div>

                  {/* Asistencia */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 block">Asistencia</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setRsvpAttending("yes")}
                        className={`border rounded-xl px-4 py-3 text-sm transition-all ${rsvpAttending === "yes" ? "border-transparent text-white" : "border-stone-500 text-stone-300 hover:bg-stone-700"}`}
                        style={rsvpAttending === "yes" ? { backgroundColor: data.colorAccent, borderColor: data.colorAccent } : {}}
                      >
                        Sí, asisto ✓
                      </button>
                      <button
                        onClick={() => setRsvpAttending("no")}
                        className={`border rounded-xl px-4 py-3 text-sm transition-all ${rsvpAttending === "no" ? "border-stone-400 bg-stone-700 text-white" : "border-stone-700 text-stone-500 hover:bg-stone-800"}`}
                      >
                        No asisto
                      </button>
                    </div>
                  </div>

                  {/* Restricciones dietarias – siempre visibles */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 block">Menú / Restricciones dietarias</label>
                    <div className="flex flex-col gap-2">
                      {dietOptions.map(opt => {
                        const checked = rsvpDiet.has(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleDiet(opt.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                              checked
                                ? "border-transparent text-white"
                                : "border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                            }`}
                            style={checked ? { backgroundColor: `${data.colorAccent}33`, borderColor: data.colorAccent, color: "#fff" } : {}}
                          >
                            <span
                              className="w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all"
                              style={checked
                                ? { backgroundColor: data.colorAccent, borderColor: data.colorAccent }
                                : { borderColor: "#57534e" }
                              }
                            >
                              {checked && (
                                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                  <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Canción sugerida – siempre visible */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Canción sugerida 🎵</label>
                    <input
                      type="text"
                      placeholder="Esa que no puede faltar..."
                      value={rsvpSong}
                      onChange={(e) => setRsvpSong(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-300 outline-none focus:border-stone-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleRsvpSubmit}
                    disabled={!rsvpAttending || !rsvpName.trim()}
                    style={{ backgroundColor: (rsvpAttending && rsvpName.trim()) ? data.colorAccent : undefined }}
                    className="mt-4 w-full text-white px-10 py-4 rounded-xl text-[11px] font-bold tracking-[0.25em] uppercase shadow-lg hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed bg-stone-700"
                  >
                    Confirmar asistencia
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
