"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { calcularFaltante, parsearFecha, type Faltante } from "@/invitaciones/fecha";
import type { InvitacionMensajes as Datos, LineaCharla, Lugar } from "@/invitaciones/tipos";
import { COMIDAS } from "@/lib/rsvp-comun";
import type { Personal } from "../personal";
import { usarEnVista } from "../usarEnVista";
import { usarRsvp } from "../usarRsvp";
import { IconAbajo, IconCalendario, IconCopiar, IconCorazon, IconPin, IconReloj, IconTildes, Malvavisco } from "./Dibujos";

/**
 * Estilo "Mensajes": la invitación es una charla entre los novios que se va
 * escribiendo mientras se baja. Cada dato llega como un mensaje, con los
 * puntos de "escribiendo…" antes; las fotos van como fotos enviadas, y
 * confirmar es contestar. El humor está en el texto; la información es la de
 * cualquier invitación.
 *
 * Para que nadie se pierda: arriba hay un resumen fijado con lo esencial, una
 * barra para saltar a cada parte (que marca dónde estás) y una línea de
 * progreso. Criterios: .claude/skills/invitacion-mensajes/SKILL.md
 */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Los valores de COMIDAS son compartidos con el resto del sistema; acá sólo se cambia cómo se leen. */
const COMIDA_NEUTRA: Record<string, string> = { "Sin TACC": "Sin gluten" };

const dos = (n: number) => String(n).padStart(2, "0");

type Contexto = { avatares: [string, string]; todo: boolean };
const Charla = createContext<Contexto>({ avatares: ["", ""], todo: false });

/* ── Una fila de la charla ─────────────────────────────────────
   Entra cuando el invitado llega a ella: primero los puntos y, un momento
   después, el mensaje. Así el ritmo de lectura lo marca el scroll. Si el
   invitado salta con la barra de arriba, todo se muestra de una vez. */

function Fila({
  quien,
  demora = 650,
  avatar = true,
  children,
}: {
  quien: 0 | 1 | "yo";
  demora?: number;
  avatar?: boolean;
  children: React.ReactNode;
}) {
  const { avatares, todo } = useContext(Charla);
  const [ref, visible] = usarEnVista<HTMLDivElement>("-4%");
  const [listo, setListo] = useState(false);
  const mostrar = visible || todo;

  useEffect(() => {
    if (!mostrar) return;
    const menos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setListo(true), menos || todo ? 0 : demora);
    return () => clearTimeout(t);
  }, [mostrar, todo, demora]);

  return (
    <div ref={ref} data-visible={mostrar} data-listo={listo} className={`mj-fila mj-fila--${quien}`}>
      {quien !== "yo" &&
        (avatar ? (
          <Image src={avatares[quien]} alt="" width={32} height={32} className="mj-avatar" />
        ) : (
          <span className="mj-hueco" aria-hidden="true" />
        ))}
      {mostrar && !listo && quien !== "yo" && (
        <span className="mj-puntos" aria-hidden="true">
          <i /><i /><i />
        </span>
      )}
      <div className="mj-contenido">{children}</div>
    </div>
  );
}

function Texto({ linea, avatar = true, demora }: { linea: LineaCharla; avatar?: boolean; demora?: number }) {
  return (
    <Fila quien={linea.quien} avatar={avatar} demora={demora}>
      <p className="mj-burbuja">{linea.texto}</p>
    </Fila>
  );
}

/** Varias líneas seguidas: el avatar sólo en la primera de cada tanda. */
function Tanda({ lineas }: { lineas: LineaCharla[] }) {
  return (
    <>
      {lineas.map((l, i) => (
        <Texto key={`${i}-${l.texto}`} linea={l} avatar={i === 0 || lineas[i - 1].quien !== l.quien} />
      ))}
    </>
  );
}

/** Un mensaje del sistema: centrado, sin remitente. Explica o resume. */
function Sistema({ children, clase = "" }: { children: React.ReactNode; clase?: string }) {
  const [ref, visible] = usarEnVista<HTMLDivElement>("-4%");
  return (
    <div ref={ref} data-visible={visible} className={`mj-sistema ${clase}`}>
      {children}
    </div>
  );
}

function Foto({
  quien,
  src,
  alt,
  pie,
  posicion,
  reaccion = false,
}: {
  quien: 0 | 1;
  src: string;
  alt: string;
  pie: string;
  posicion: string;
  reaccion?: boolean;
}) {
  return (
    <Fila quien={quien} demora={900}>
      <figure className="mj-foto">
        <div className="mj-foto__marco">
          <Image src={src} alt={alt} fill sizes="(min-width: 30rem) 300px, 72vw" className="mj-foto__img" style={{ objectPosition: posicion }} />
        </div>
        <figcaption className="mj-foto__pie">{pie}</figcaption>
        {reaccion && (
          <span className="mj-reaccion">
            <IconCorazon />
          </span>
        )}
      </figure>
    </Fila>
  );
}

/** Copiar un dato al portapapeles, con aviso de que se copió. */
function Copiar({ valor, etiqueta = "Copiar" }: { valor: string; etiqueta?: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      className="mj-copiar"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(valor);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2200);
        } catch {
          // Sin permiso de portapapeles el dato igual está a la vista.
        }
      }}
    >
      <IconCopiar />
      {copiado ? "¡Copiado!" : etiqueta}
    </button>
  );
}

/* ── Tarjetas de información ───────────────────────────────── */

function TarjetaLugar({ lugar, quien }: { lugar: Lugar; quien: 0 | 1 }) {
  return (
    <Fila quien={quien} avatar={false} demora={450}>
      <div className="mj-tarjeta">
        <div className="mj-lugar">
          <span className="mj-icono"><IconPin /></span>
          <div>
            <p className="mj-tarjeta__titulo">{lugar.titulo}</p>
            <p className="mj-tarjeta__hora">{lugar.tipo} · {lugar.hora} hs</p>
          </div>
        </div>
        <p className="mj-tarjeta__texto">{lugar.direccion}</p>
        <div className="mj-acciones">
          <a className="mj-boton mj-boton--chico" href={lugar.mapa} target="_blank" rel="noopener noreferrer">
            Cómo llegar
          </a>
          <Copiar valor={lugar.direccion} etiqueta="Copiar dirección" />
        </div>
      </div>
    </Fila>
  );
}

/** El tiempo que falta, corriendo. */
function CuentaViva({ fecha }: { fecha: string }) {
  const [f, setF] = useState<Faltante | null>(null);
  useEffect(() => {
    const objetivo = parsearFecha(fecha);
    const calcular = () => setF(calcularFaltante(objetivo));
    const cuadro = requestAnimationFrame(calcular);
    const reloj = setInterval(calcular, 1000);
    return () => {
      cancelAnimationFrame(cuadro);
      clearInterval(reloj);
    };
  }, [fecha]);

  const unidades: [number | undefined, string][] = [[f?.d, "días"], [f?.h, "horas"], [f?.m, "min"], [f?.s, "seg"]];
  return (
    <div className="mj-cuenta" role="timer" aria-label="Tiempo que falta para el evento">
      {unidades.map(([valor, nombre]) => (
        <div key={nombre} className="mj-cuenta__unidad">
          <span className="mj-cuenta__n">{valor === undefined ? "··" : dos(valor)}</span>
          <span className="mj-cuenta__nombre">{nombre}</span>
        </div>
      ))}
    </div>
  );
}

/** Enlace para añadir el evento al calendario (Google Calendar, sirve en cualquier celular). */
function enlaceCalendario(d: Datos, ceremonia?: Lugar) {
  const [h, m] = (ceremonia?.hora ?? "18:00").split(":").map(Number);
  const inicio = parsearFecha(d.fecha, h);
  if (!inicio) return null;
  inicio.setMinutes(m || 0);
  const fin = new Date(inicio.getTime() + 9.5 * 3_600_000);
  const f = (x: Date) => `${x.getFullYear()}${dos(x.getMonth() + 1)}${dos(x.getDate())}T${dos(x.getHours())}${dos(x.getMinutes())}00`;
  const lugar = ceremonia ? `${ceremonia.titulo}, ${ceremonia.direccion}` : "";
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: d.mensajes.evento,
    dates: `${f(inicio)}/${f(fin)}`,
    location: lugar,
    details: d.mensajes.intro,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ── Confirmar es contestar ────────────────────────────────── */

function Rsvp({ d, personal }: { d: Datos; personal?: Personal }) {
  const m = d.mensajes;
  const r = usarRsvp({ slug: d.slug, personal });
  const respuesta = r.asiste ? m.respuestaSi : m.respuestaNo;
  const textoSi = "¡Claro que sí, ahí estaré!";
  const textoNo = "No puedo ir, pero los quiero";

  return (
    <>
      <Texto linea={m.avisos.pregunta} />

      {r.cerrado && !personal ? (
        <Texto linea={{ quien: 0, texto: "Esta invitación es personal. Confirma desde el enlace que te enviaron." }} />
      ) : r.enviado ? (
        <>
          <Fila quien="yo" demora={0}>
            <p className="mj-burbuja mj-burbuja--yo">
              {r.asiste ? textoSi : textoNo}
              <IconTildes className="mj-tildes" />
            </p>
          </Fila>
          <Tanda lineas={respuesta} />
          {r.asiste && (
            <div className="mj-tostado">
              <Malvavisco />
              <p className="mj-tostado__pie">Listo, estás en la lista.</p>
            </div>
          )}
          {personal && (
            <button type="button" className="mj-enlace" onClick={() => { r.setEnviado(false); r.abrir(); }}>
              Cambiar la respuesta
            </button>
          )}
        </>
      ) : (
        <div ref={r.formRef} className="mj-responder">
          <div className="mj-chips" role="group" aria-label="Tu respuesta">
            {[[true, textoSi], [false, textoNo]].map(([valor, texto]) => (
              <button key={String(valor)} type="button" className="mj-chip" aria-pressed={r.asiste === valor} onClick={() => r.setAsiste(valor as boolean)}>
                {texto as string}
              </button>
            ))}
          </div>
          {d.cierreRsvp && r.asiste === null && <p className="mj-pista">{d.cierreRsvp}</p>}

          {r.asiste !== null && (
            <div className="mj-formulario">
              {!personal && (
                <label className="mj-campo">
                  <span>Tu nombre</span>
                  <input value={r.nombre} onChange={(e) => r.setNombre(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" maxLength={40} />
                </label>
              )}

              {r.asiste === true && (
                <>
                  {(!personal || r.cupo > 1) && (
                    <label className="mj-campo">
                      <span>{personal && r.cupo > 1 ? `Cuántos van, de ${r.cupo}` : "Cuántas personas son"}</span>
                      <input type="number" inputMode="numeric" min={1} max={r.cupo} value={r.acompanantes} onChange={(e) => r.setAcompanantes(Number(e.target.value))} />
                    </label>
                  )}
                  <fieldset className="mj-campo">
                    <legend>¿Alguna restricción alimentaria?</legend>
                    <div className="mj-chips">
                      {COMIDAS.map((c) => (
                        <button key={c} type="button" className="mj-chip mj-chip--chico" aria-pressed={r.comidas.includes(c)} onClick={() => r.alternarComida(c)}>
                          {COMIDA_NEUTRA[c] ?? c}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  {!personal && (
                    <label className="mj-campo">
                      <span>La canción que no puede faltar</span>
                      <input value={r.cancion} onChange={(e) => r.setCancion(e.target.value)} placeholder="Canción y artista" />
                    </label>
                  )}
                </>
              )}

              {r.falta && !r.nombre.trim() && <p className="mj-aviso">Falta tu nombre.</p>}
              {r.errorEnvio && <p role="alert" className="mj-aviso">{r.errorEnvio}</p>}

              <button type="button" className="mj-boton" onClick={r.enviar} disabled={r.enviando}>
                {r.enviando ? "Enviando…" : "Enviar respuesta"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ── Orientación: dónde estoy y cómo salto ─────────────────── */

/** Qué parte de la invitación se está leyendo. */
function usarSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState("");
  // Tras tocar un botón de la barra, el observador no manda durante un rato:
  // mientras la página se desplaza pasa por las partes del medio y marcaría cualquiera.
  const bloqueo = useRef(0);
  const clave = ids.join(",");

  useEffect(() => {
    const lista = clave.split(",");
    const nodos = lista.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => Boolean(n));
    const observador = new IntersectionObserver(
      (entradas) => {
        if (Date.now() < bloqueo.current) return;
        for (const e of entradas) if (e.isIntersecting) setActiva(e.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    nodos.forEach((n) => observador.observe(n));

    // La última parte es corta y nunca llega a la franja del observador: al
    // llegar al fondo de la página, es la que se está leyendo.
    const alFondo = () => {
      if (Date.now() < bloqueo.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) setActiva(lista[lista.length - 1]);
    };
    window.addEventListener("scroll", alFondo, { passive: true });

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", alFondo);
    };
  }, [clave]);

  const fijar = (id: string) => {
    bloqueo.current = Date.now() + 1600;
    setActiva(id);
  };
  return [activa, fijar] as const;
}

/** Cuánto se lleva leído, de 0 a 1. */
function usarProgreso() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    };
    const alScroll = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      cancelAnimationFrame(cuadro);
    };
  }, []);
  return p;
}

function Navegacion({ secciones, activa, ir }: { secciones: [string, string][]; activa: string; ir: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);

  // Que el botón de la parte actual quede a la vista cuando la barra se desplaza de costado.
  useEffect(() => {
    const barra = ref.current;
    const boton = barra?.querySelector<HTMLElement>("[aria-current='true']");
    if (!barra || !boton) return;
    barra.scrollTo({ left: boton.offsetLeft - barra.clientWidth / 2 + boton.clientWidth / 2, behavior: "smooth" });
  }, [activa]);

  return (
    <nav ref={ref} className="mj-nav" aria-label="Ir a una parte de la invitación">
      {secciones.map(([id, nombre]) => (
        <button key={id} type="button" className={`mj-nav__boton${id === "confirmar" ? " mj-nav__boton--final" : ""}`} aria-current={activa === id} onClick={() => ir(id)}>
          {nombre}
        </button>
      ))}
    </nav>
  );
}

/* ── La invitación ─────────────────────────────────────────── */

export default function InvitacionMensajes({ invitacion, personal }: { invitacion: Datos; personal?: Personal }) {
  const m = invitacion.mensajes;
  const fecha = parsearFecha(invitacion.fecha);
  const fechaLarga = invitacion.fecha.replace(/ (\d{4})$/, " de $1");
  const fechaEscrita = fecha ? `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}` : invitacion.fecha;

  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => {
    // En el servidor no existe "ahora": la cuenta se calcula ya en el navegador.
    const cuadro = requestAnimationFrame(() => setDias(calcularFaltante(parsearFecha(invitacion.fecha))?.d ?? 0));
    return () => cancelAnimationFrame(cuadro);
  }, [invitacion.fecha]);

  const ceremonia = invitacion.lugares?.find((l) => l.tipo === "Ceremonia" || l.tipo === "Civil");
  const fiesta = invitacion.lugares?.find((l) => l.tipo === "Fiesta");
  const cuenta = { ...m.avisos.cuenta, texto: m.avisos.cuenta.texto.replace("{d}", dias === null ? "··" : String(dias)) };
  const calendario = enlaceCalendario(invitacion, ceremonia);

  const secciones: [string, string][] = [["fecha", "Fecha"]];
  if (invitacion.lugares) secciones.push(["lugar", "Lugar"]);
  if (invitacion.cronograma) secciones.push(["programa", "Programa"]);
  if (invitacion.dressCode) secciones.push(["vestimenta", "Vestimenta"]);
  if (invitacion.regalo) secciones.push(["regalos", "Regalos"]);
  secciones.push(["confirmar", "Confirmar"]);

  const [activa, fijar] = usarSeccionActiva(secciones.map(([id]) => id));
  const progreso = usarProgreso();

  // Al saltar, se muestra toda la charla de una vez: si no, lo que queda en
  // medio sigue sin escribirse y la página cambia de alto mientras se llega.
  // Por eso se espera a que se acomode, y después se corrige si hizo falta.
  const [todo, setTodo] = useState(false);
  const ir = (id: string) => {
    setTodo(true);
    fijar(id);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const destino = document.getElementById(id);
        if (!destino) return;
        const margen = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0;
        const alFondo = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
        if (!alFondo && Math.abs(destino.getBoundingClientRect().top - margen) > 24) destino.scrollIntoView({ behavior: "auto", block: "start" });
      }, 900);
    }, 400);
  };

  return (
    <Charla.Provider value={{ avatares: m.avatares, todo }}>
      <main className="inv-columna mj">
        {/* ── Cabecera: quién escribe, a dónde ir y cuánto llevas ── */}
        <header className="mj-cabecera">
          <span className="mj-caras" aria-hidden="true">
            <Image src={m.avatares[0]} alt="" width={36} height={36} className="mj-cara" priority />
            <Image src={m.avatares[1]} alt="" width={36} height={36} className="mj-cara" priority />
          </span>
          <h1 className="mj-quienes">{invitacion.nombres}</h1>
          <p className="mj-estado"><span className="mj-estado__punto" aria-hidden="true" />en línea</p>
          <Navegacion secciones={secciones} activa={activa} ir={ir} />
          <div className="mj-progreso" aria-hidden="true">
            <span style={{ transform: `scaleX(${progreso})` }} />
          </div>
        </header>

        <div className="mj-charla">
          {/* ── Qué es esto, y lo esencial ── */}
          <Sistema clase="mj-sistema--aviso">
            <p>{m.intro}</p>
            <IconAbajo className="mj-flecha" />
          </Sistema>

          <Sistema clase="mj-sistema--fijado">
            <div className="mj-fijado">
              <p className="mj-fijado__titulo"><IconPin />Lo esencial</p>
              <ul className="mj-fijado__lista">
                <li><IconCalendario />{fechaEscrita}</li>
                {ceremonia && <li><IconReloj />{ceremonia.hora} hs · {m.evento}</li>}
                {ceremonia && <li><IconPin />{ceremonia.titulo}</li>}
              </ul>
            </div>
          </Sistema>

          {personal && (
            <Texto linea={{ quien: 0, texto: personal.nota ? `${personal.saludo} ${personal.nota}` : personal.saludo }} />
          )}

          <Tanda lineas={m.apertura} />

          <Foto quien={m.fotoFogon.quien} src={m.fotoFogon.src} alt={m.fotoFogon.alt} pie={m.fotoFogon.pie} posicion="50% 78%" reaccion />

          {/* ── Cuándo ── */}
          <section id="fecha" className="mj-bloque">
            <Texto linea={m.avisos.fecha} />
            <Fila quien={m.avisos.fecha.quien} avatar={false} demora={500}>
              <div className="mj-calendario">
                <p className="mj-calendario__mes">{fecha ? `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}` : invitacion.fecha}</p>
                <p className="mj-calendario__dia">{fecha ? fecha.getDate() : ""}</p>
                <p className="mj-calendario__semana">{fecha ? DIAS[fecha.getDay()] : ""}</p>
                {calendario && (
                  <a className="mj-calendario__agregar" href={calendario} target="_blank" rel="noopener noreferrer">
                    <IconCalendario />
                    Añadir al calendario
                  </a>
                )}
              </div>
            </Fila>
            <Texto linea={cuenta} />
            <Fila quien={cuenta.quien} avatar={false} demora={400}>
              <CuentaViva fecha={invitacion.fecha} />
            </Fila>
          </section>

          {/* ── Dónde ── */}
          {invitacion.lugares && (
            <section id="lugar" className="mj-bloque">
              {ceremonia && (
                <>
                  <Texto linea={m.avisos.ceremonia} />
                  <TarjetaLugar lugar={ceremonia} quien={m.avisos.ceremonia.quien} />
                </>
              )}
              {fiesta && (
                <>
                  <Texto linea={m.avisos.fiesta} />
                  <TarjetaLugar lugar={fiesta} quien={m.avisos.fiesta.quien} />
                </>
              )}
            </section>
          )}

          {/* ── El programa ── */}
          {invitacion.cronograma && (
            <section id="programa" className="mj-bloque">
              <Texto linea={m.avisos.orden} />
              <Fila quien={m.avisos.orden.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <ol className="mj-programa">
                    {invitacion.cronograma.map((h) => (
                      <li key={`${h.hora}-${h.titulo}`}>
                        <span className="mj-programa__hora">{h.hora}</span>
                        <span>{h.titulo}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Fila>
            </section>
          )}

          {/* ── Vestimenta ── */}
          {invitacion.dressCode && (
            <section id="vestimenta" className="mj-bloque">
              <Texto linea={m.avisos.vestimenta} />
              <Fila quien={m.avisos.vestimenta.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__titulo">{invitacion.dressCode.titulo}</p>
                  <p className="mj-tarjeta__texto">{invitacion.dressCode.detalle}</p>
                  {m.paleta.length > 0 && (
                    <ul className="mj-paleta" aria-label="Colores sugeridos">
                      {m.paleta.map((c) => (
                        <li key={c.nombre}>
                          <span className="mj-paleta__color" style={{ background: c.color }} />
                          <span className="mj-paleta__nombre">{c.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Fila>
            </section>
          )}

          <Foto quien={m.fotoMesa.quien} src={m.fotoMesa.src} alt={m.fotoMesa.alt} pie={m.fotoMesa.pie} posicion="50% 38%" />

          {/* ── Regalos ── */}
          {invitacion.regalo && (
            <section id="regalos" className="mj-bloque">
              <Texto linea={m.avisos.regalo} />
              <Fila quien={m.avisos.regalo.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__texto">{invitacion.regalo.mensaje}</p>
                  <div className="mj-dato">
                    <span className="mj-dato__etiqueta">Alias</span>
                    <Copiar valor={invitacion.regalo.alias} />
                    <span className="mj-dato__valor">{invitacion.regalo.alias}</span>
                  </div>
                  <div className="mj-dato">
                    <span className="mj-dato__etiqueta">Cuenta</span>
                    <Copiar valor={invitacion.regalo.cbu} />
                    <span className="mj-dato__valor">{invitacion.regalo.cbu}</span>
                  </div>
                  <p className="mj-tarjeta__chico">{invitacion.regalo.titular} · {invitacion.regalo.banco}</p>
                </div>
              </Fila>
            </section>
          )}

          {/* ── Contestar ── */}
          <section id="confirmar" className="mj-bloque">
            <Rsvp d={invitacion} personal={personal} />
          </section>
        </div>

        <footer className="mj-pie">
          <p className="mj-pie__firma">{m.firma}</p>
          <p className="mj-pie__datos">{invitacion.nombres} · {fechaLarga}</p>
        </footer>
      </main>
    </Charla.Provider>
  );
}
