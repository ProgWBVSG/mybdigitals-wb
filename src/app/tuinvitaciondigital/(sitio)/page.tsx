"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DISENOS, WHATSAPP, enlaceDemo, whatsappPara, type TipoEvento } from "@/lib/invitaciones";

/* ─────────────────────────────────────────────────────────────
   El teléfono del encabezado. No es una captura: la cuenta
   regresiva corre de verdad y el diseño cambia al tocarlo.
   ───────────────────────────────────────────────────────────── */

const VITRINA = [DISENOS[0], DISENOS[2], DISENOS[5], DISENOS[8]];

/** Una fecha siempre futura, para que el reloj tenga sentido. */
function fechaDemo() {
  const d = new Date();
  d.setDate(d.getDate() + 96);
  d.setHours(20, 30, 0, 0);
  return d;
}

/**
 * La fecha del evento y el tiempo que falta. Todo arranca después del montaje:
 * en el servidor no existe "ahora", así que el primer render sale sin reloj y
 * el navegador lo completa en el siguiente cuadro.
 */
function useInvitacionDemo() {
  const [estado, setEstado] = useState<{ destino: Date; restante: number } | null>(null);

  useEffect(() => {
    const destino = fechaDemo();
    const tick = () => setEstado({ destino, restante: Math.max(0, destino.getTime() - Date.now()) });
    const primerCuadro = requestAnimationFrame(tick);
    const reloj = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(primerCuadro);
      clearInterval(reloj);
    };
  }, []);

  if (!estado) return { destino: null, reloj: null };

  const seg = Math.floor(estado.restante / 1000);
  return {
    destino: estado.destino,
    reloj: {
      dias: Math.floor(seg / 86400),
      horas: Math.floor((seg % 86400) / 3600),
      min: Math.floor((seg % 3600) / 60),
      seg: seg % 60,
    },
  };
}

function Telefono() {
  const [activo, setActivo] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const { destino, reloj } = useInvitacionDemo();
  const d = VITRINA[activo];
  const fecha = useMemo(
    () =>
      destino
        ? destino
            .toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
            .toUpperCase()
        : "",
    [destino]
  );

  const nombres = d.tipo === "bodas" ? "Sofía & Matías" : "Delfina";
  const ocasion = d.tipo === "bodas" ? "Nos casamos" : "Mis quince";

  return (
    <div className="tid-vitrina">
      <div className="tid-tel" style={{ "--acento": d.acento } as React.CSSProperties}>
        <div className="tid-tel__pantalla">
          <div className="tid-tel__foto">
            <Image
              src={d.imagen}
              alt=""
              fill
              sizes="300px"
              className="tid-tel__img"
              priority={activo === 0}
            />
            <div className="tid-tel__velo" />
            <div className="tid-tel__titulo">
              <p className="tid-tel__ocasion">{ocasion}</p>
              <p className="tid-tel__nombres tid-display tid-cursiva">{nombres}</p>
              <p className="tid-tel__fecha">{fecha || " "}</p>
            </div>
          </div>

          <div className="tid-tel__cuerpo">
            <div className="tid-tel__reloj">
              {[
                { v: reloj?.dias, e: "días" },
                { v: reloj?.horas, e: "hs" },
                { v: reloj?.min, e: "min" },
                { v: reloj?.seg, e: "seg" },
              ].map((u) => (
                <div key={u.e} className="tid-tel__unidad">
                  <span className="tid-tel__num">
                    {u.v === undefined || u.v === null ? "––" : String(u.v).padStart(2, "0")}
                  </span>
                  <span className="tid-tel__etiqueta">{u.e}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={`tid-tel__rsvp${confirmado ? " tid-tel__rsvp--ok" : ""}`}
              onClick={() => setConfirmado((v) => !v)}
            >
              {confirmado ? "¡Confirmado! Nos vemos ahí" : "Confirmar asistencia"}
            </button>

            <p className="tid-tel__pie">
              {confirmado
                ? "Ya quedó en la lista de los novios."
                : "Tocá el botón: así lo ve tu invitado."}
            </p>
          </div>
        </div>
      </div>

      <div className="tid-vitrina__selector" role="group" aria-label="Cambiar diseño de ejemplo">
        {VITRINA.map((v, i) => (
          <button
            key={`${v.tipo}-${v.id}`}
            type="button"
            onClick={() => setActivo(i)}
            className={`tid-muestra${i === activo ? " tid-muestra--activa" : ""}`}
            style={{ "--acento": v.acento } as React.CSSProperties}
            aria-pressed={i === activo}
          >
            <span className="tid-muestra__punto" aria-hidden="true" />
            {v.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Galería
   ───────────────────────────────────────────────────────────── */

function Galeria() {
  const [filtro, setFiltro] = useState<TipoEvento | "todos">("todos");
  const visibles = DISENOS.filter((d) => filtro === "todos" || d.tipo === filtro);

  const filtros: { valor: TipoEvento | "todos"; texto: string }[] = [
    { valor: "todos", texto: "Todos" },
    { valor: "bodas", texto: "Casamientos" },
    { valor: "cumples", texto: "Quince años" },
  ];

  return (
    <>
      <div className="tid-filtros" role="group" aria-label="Filtrar diseños por tipo de evento">
        {filtros.map((f) => (
          <button
            key={f.valor}
            type="button"
            onClick={() => setFiltro(f.valor)}
            className={`tid-filtro${filtro === f.valor ? " tid-filtro--activo" : ""}`}
            aria-pressed={filtro === f.valor}
          >
            {f.texto}
          </button>
        ))}
      </div>

      <ul className="tid-grilla">
        {visibles.map((d) => (
          <li key={`${d.tipo}-${d.id}`}>
            <Link
              href={enlaceDemo(d)}
              className="tid-carta"
              style={{ "--acento": d.acento } as React.CSSProperties}
            >
              <span className="tid-carta__marco">
                <Image
                  src={d.imagen}
                  alt={`Diseño ${d.nombre}`}
                  fill
                  sizes="(max-width: 40rem) 45vw, (max-width: 62rem) 30vw, 22vw"
                  className="tid-carta__img"
                />
                <span className="tid-carta__abrir">Abrir la demo</span>
              </span>
              <span className="tid-carta__pie">
                <span className="tid-carta__nombre tid-display">{d.nombre}</span>
                <span className="tid-carta__caracter">{d.caracter}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Preguntas
   ───────────────────────────────────────────────────────────── */

const PREGUNTAS = [
  {
    p: "¿Mis invitados tienen que descargar algo?",
    r: "No. Es un link. Lo mandás por WhatsApp y se abre en el navegador del celular, igual que cualquier página. Funciona en Android y en iPhone.",
  },
  {
    p: "¿Cómo sé quién confirmó?",
    r: "Cada confirmación entra a una planilla que podés ver en vivo desde el celular, con el nombre, cuántos vienen y si alguien tiene restricción alimentaria. La descargás en Excel cuando se la tenés que pasar al salón.",
  },
  {
    p: "¿Puedo cambiar cosas después de mandarla?",
    r: "Sí. Como es una web, se edita en cualquier momento y el link sigue siendo el mismo. Si se corre el horario o cambia la dirección, lo actualizamos y todos ven la versión nueva.",
  },
  {
    p: "¿Cuánto tarda?",
    r: "Tres días hábiles desde que nos pasás los datos y las fotos. Si la fecha te apura, avisanos y vemos.",
  },
  {
    p: "¿Los diseños se pueden cambiar?",
    r: "El diseño que elegís es el punto de partida: cambiamos colores, tipografía y fotos para que sea tuyo. Si querés algo desde cero, también se hace.",
  },
  {
    p: "¿Se paga todos los meses?",
    r: "No. Es un pago único e incluye el año de publicación. Sin suscripción ni costos escondidos.",
  },
];

function Preguntas() {
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <ul className="tid-faq">
      {PREGUNTAS.map((f, i) => {
        const activa = abierta === i;
        return (
          <li key={f.p} className="tid-faq__item">
            <button
              type="button"
              className="tid-faq__boton"
              onClick={() => setAbierta(activa ? null : i)}
              aria-expanded={activa}
            >
              <span className="tid-faq__pregunta">{f.p}</span>
              <span
                className={`tid-faq__signo${activa ? " tid-faq__signo--abierto" : ""}`}
                aria-hidden="true"
              />
            </button>
            {activa && <p className="tid-faq__respuesta">{f.r}</p>}
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────────────
   Página
   ───────────────────────────────────────────────────────────── */

const INCLUYE = [
  { t: "Cuenta regresiva", d: "El reloj corre en vivo desde que abren el link hasta la hora de la fiesta." },
  { t: "Ubicación con mapa", d: "Ceremonia y salón, cada uno con su horario y un botón que abre Google Maps." },
  { t: "Confirmación automática", d: "Tu invitado confirma en el celular y el nombre te aparece en la planilla." },
  { t: "Restricciones de comida", d: "Vegetariano, sin TACC, sin lactosa: cada uno lo marca al confirmar." },
  { t: "Álbum de fotos", d: "Un QR en la mesa y los invitados suben las fotos de la noche al mismo álbum." },
  { t: "Datos para el regalo", d: "Alias y CBU a la vista, para no tener que explicarlo cincuenta veces." },
  { t: "Dress code y logística", d: "Cómo vestirse, dónde dormir y a qué hora sale el micro." },
  { t: "Música y galería", d: "La canción de ustedes suena de fondo mientras miran las fotos." },
];

const PLANES = [
  {
    nombre: "Esencial",
    para: "Para quien quiere lo importante, sin vueltas.",
    precio: "$44.999",
    items: [
      "Diseño a elección, personalizado",
      "Cuenta regresiva y mapas",
      "Dress code, regalo y logística",
      "Confirmación por WhatsApp",
    ],
    destacado: false,
  },
  {
    nombre: "Completa",
    para: "La que elige casi todo el mundo.",
    precio: "$68.999",
    items: [
      "Todo lo de Esencial",
      "Confirmación dentro de la invitación",
      "Planilla de invitados en vivo",
      "Restricciones alimentarias",
      "Galería de fotos y música",
    ],
    destacado: true,
  },
  {
    nombre: "Completa +",
    para: "Cuando la fiesta es grande y hay que organizarla.",
    precio: "$94.999",
    items: [
      "Todo lo de Completa",
      "Un link por invitado, con su nombre",
      "Álbum de fotos con QR para la mesa",
      "Trivia para los invitados",
      "Exportación a Excel",
    ],
    destacado: false,
  },
];

const PASOS = [
  {
    t: "Elegís el diseño",
    d: "Abrí las demos desde el celular, como las va a ver tu invitado. Cuando uno te gusta, nos decís cuál.",
  },
  {
    t: "Nos pasás los datos",
    d: "Fecha, lugares, fotos y la canción. Te mandamos una lista para que no se olvide nada.",
  },
  {
    t: "La armamos",
    d: "Tres días hábiles. Te llega el link para revisar y pedir los cambios que quieras.",
  },
  {
    t: "La mandás",
    d: "Copiás el link al grupo de WhatsApp y empezás a ver las confirmaciones entrar solas.",
  },
];

export default function Invitaciones() {
  return (
    <>
      {/* ── Encabezado ── */}
      <section className="tid-seccion tid-hero">
        <div className="tid-marco tid-hero__interior">
          <div className="tid-hero__texto">
            <p className="tid-rubro">Casamientos y quince años · Córdoba</p>
            <h1 className="tid-display tid-h1 tid-hero__titulo">
              La fiesta empieza cuando <span className="tid-cursiva">abren</span> la invitación.
            </h1>
            <p className="tid-plomo tid-hero__bajada">
              Una página hecha para tu evento. Se abre de un link, funciona en cualquier celular y
              te dice quién viene sin que persigas a nadie por WhatsApp.
            </p>
            <div className="tid-hero__acciones">
              <a href="#disenos" className="tid-boton tid-boton--lleno">
                Ver los 16 diseños
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="tid-boton tid-boton--linea"
              >
                Pedir la mía
              </a>
            </div>
          </div>

          <Telefono />
        </div>
      </section>

      {/* ── Datos duros ── */}
      <section className="tid-seccion--cenida">
        <div className="tid-marco">
          <div className="tid-filete" />
          <ul className="tid-tira">
            {[
              { n: "3 días", d: "hábiles de entrega" },
              { n: "Pago único", d: "sin mensualidad" },
              { n: "16 diseños", d: "para personalizar" },
              { n: "Sin app", d: "se abre de un link" },
            ].map((x) => (
              <li key={x.n} className="tid-tira__item">
                <span className="tid-display tid-tira__num">{x.n}</span>
                <span className="tid-tira__texto">{x.d}</span>
              </li>
            ))}
          </ul>
          <div className="tid-filete" />
        </div>
      </section>

      {/* ── Galería ── */}
      <section className="tid-seccion" id="disenos">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Los diseños</p>
            <h2 className="tid-display tid-h2">
              Abrilos como los va a abrir <span className="tid-cursiva">tu invitado</span>.
            </h2>
            <p className="tid-plomo">
              Son demos de verdad, no capturas. Tocá cualquiera y recorrela entera desde el
              celular. El diseño que elijas después se personaliza con tus fotos y tus colores.
            </p>
          </div>
          <Galeria />
        </div>
      </section>

      {/* ── Qué incluye ── */}
      <section className="tid-seccion" id="incluye">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Qué incluye</p>
            <h2 className="tid-display tid-h2">Todo lo que una tarjeta de papel no puede hacer.</h2>
          </div>
          <ul className="tid-lista">
            {INCLUYE.map((x) => (
              <li key={x.t} className="tid-lista__item">
                <h3 className="tid-display tid-h3">{x.t}</h3>
                <p className="tid-lista__texto">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Precios ── */}
      <section className="tid-seccion" id="precios">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Precios</p>
            <h2 className="tid-display tid-h2">Un pago y listo.</h2>
            <p className="tid-plomo">
              Sin suscripción. El precio incluye la personalización, los cambios que necesites
              antes de mandarla y el año de publicación.
            </p>
          </div>

          <ul className="tid-planes">
            {PLANES.map((p) => (
              <li key={p.nombre} className={`tid-plan${p.destacado ? " tid-plan--destacado" : ""}`}>
                {p.destacado && <span className="tid-plan__cinta">La más elegida</span>}
                <h3 className="tid-display tid-plan__nombre">{p.nombre}</h3>
                <p className="tid-plan__para">{p.para}</p>
                <p className="tid-plan__precio">
                  <span className="tid-display">{p.precio}</span>
                  <span className="tid-plan__moneda">ARS</span>
                </p>
                <ul className="tid-plan__items">
                  {p.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <a
                  href={whatsappPara(`Hola! Quiero la invitación digital, plan ${p.nombre}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`tid-boton ${
                    p.destacado ? "tid-boton--lleno" : "tid-boton--linea"
                  } tid-plan__cta`}
                >
                  Quiero esta
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cómo funciona: acá el orden importa, por eso va numerado ── */}
      <section className="tid-seccion">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Cómo funciona</p>
            <h2 className="tid-display tid-h2">
              De la idea al grupo de WhatsApp, en cuatro pasos.
            </h2>
          </div>
          <ol className="tid-pasos">
            {PASOS.map((p, i) => (
              <li key={p.t} className="tid-paso">
                <span className="tid-paso__num tid-display">{i + 1}</span>
                <div>
                  <h3 className="tid-display tid-h3">{p.t}</h3>
                  <p className="tid-lista__texto">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Preguntas ── */}
      <section className="tid-seccion" id="preguntas">
        <div className="tid-marco tid-marco--angosto">
          <div className="tid-encabezado">
            <p className="tid-rubro">Preguntas</p>
            <h2 className="tid-display tid-h2">Lo que todos preguntan.</h2>
          </div>
          <Preguntas />
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="tid-seccion tid-cierre">
        <div className="tid-marco tid-cierre__interior">
          <h2 className="tid-display tid-h2 tid-cierre__titulo">
            Contanos de tu fiesta y te mandamos una <span className="tid-cursiva">prueba</span>.
          </h2>
          <p className="tid-plomo tid-cierre__bajada">
            Escribinos con la fecha y el tipo de evento. Te respondemos con el diseño que mejor va
            y cuánto sale, sin compromiso.
          </p>
          <div className="tid-hero__acciones tid-cierre__acciones">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="tid-boton tid-boton--lleno"
            >
              Escribinos por WhatsApp
            </a>
            <Link href="/tuinvitaciondigital/bodas" className="tid-boton tid-boton--linea">
              Ver casamientos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
