"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";
import { calcularFaltante, parsearFecha } from "@/invitaciones/fecha";
import type { InvitacionMensajes as Datos, LineaCharla } from "@/invitaciones/tipos";
import { COMIDAS } from "@/lib/rsvp-comun";
import type { Personal } from "../personal";
import { usarEnVista } from "../usarEnVista";
import { usarRsvp } from "../usarRsvp";
import { Malvavisco } from "./Dibujos";

/**
 * Estilo "Mensajes": la invitación es una charla entre los novios que se va
 * escribiendo mientras se baja. Cada dato llega como un mensaje, con los
 * puntos de "escribiendo…" antes; las fotos van como fotos enviadas, y
 * confirmar es contestar. El humor está en el texto; la información es la de
 * cualquier invitación. Criterios: .claude/skills/invitacion-mensajes/SKILL.md
 */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

type Persona = { nombre: string; avatar: string };
const Charla = createContext<[Persona, Persona]>([
  { nombre: "", avatar: "" },
  { nombre: "", avatar: "" },
]);

/* ── Una fila de la charla ─────────────────────────────────────
   Entra cuando el invitado llega a ella: primero los puntos y, un momento
   después, el mensaje. Así el ritmo de lectura lo marca el scroll. */

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
  const personas = useContext(Charla);
  const [ref, visible] = usarEnVista<HTMLDivElement>("-4%");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const menos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setListo(true), menos ? 0 : demora);
    return () => clearTimeout(t);
  }, [visible, demora]);

  const p = quien === "yo" ? null : personas[quien];

  return (
    <div ref={ref} data-visible={visible} data-listo={listo} className={`mj-fila mj-fila--${quien}`}>
      {p &&
        (avatar ? (
          <Image src={p.avatar} alt="" width={32} height={32} className="mj-avatar" />
        ) : (
          <span className="mj-hueco" aria-hidden="true" />
        ))}
      {visible && !listo && quien !== "yo" && (
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

function Foto({ quien, src, alt, pie, ratio, posicion }: { quien: 0 | 1; src: string; alt: string; pie: string; ratio: string; posicion: string }) {
  return (
    <Fila quien={quien} demora={900}>
      <figure className="mj-foto">
        <div className="mj-foto__marco" style={{ aspectRatio: ratio }}>
          <Image src={src} alt={alt} fill sizes="(min-width: 30rem) 300px, 72vw" className="mj-foto__img" style={{ objectPosition: posicion }} />
        </div>
        <figcaption className="mj-foto__pie">{pie}</figcaption>
      </figure>
    </Fila>
  );
}

function Copiable({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <p className="mj-dato">
      <span className="mj-dato__etiqueta">{etiqueta}</span>
      <span className="mj-dato__valor">{valor}</span>
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
        {copiado ? "¡Copiado!" : "Copiar"}
      </button>
    </p>
  );
}

/* ── Confirmar es contestar ────────────────────────────────── */

function Rsvp({ d, personal }: { d: Datos; personal?: Personal }) {
  const m = d.mensajes;
  const r = usarRsvp({ slug: d.slug, personal });
  const respuesta = r.asiste ? m.respuestaSi : m.respuestaNo;

  return (
    <>
      <Texto linea={m.avisos.pregunta} />

      {r.cerrado && !personal ? (
        <Texto linea={{ quien: 0, texto: "Esta invitación es personal. Confirmá desde el link que te mandaron." }} />
      ) : r.enviado ? (
        <>
          <Fila quien="yo" demora={0}>
            <p className="mj-burbuja mj-burbuja--yo">{r.asiste ? "¡Obvio, ahí estoy!" : "No puedo, los quiero igual"}</p>
          </Fila>
          <Tanda lineas={respuesta} />
          {r.asiste && (
            <div className="mj-tostado">
              <Malvavisco />
              <p className="mj-tostado__pie">En su punto.</p>
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
            {[[true, "¡Obvio, ahí estoy!"], [false, "No puedo, los quiero igual"]].map(([valor, texto]) => (
              <button key={String(valor)} type="button" className="mj-chip" aria-pressed={r.asiste === valor} onClick={() => r.setAsiste(valor as boolean)}>
                {texto as string}
              </button>
            ))}
          </div>

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
                      <span>{personal && r.cupo > 1 ? `Cuántos van, de ${r.cupo}` : "Cuántos son"}</span>
                      <input type="number" inputMode="numeric" min={1} max={r.cupo} value={r.acompanantes} onChange={(e) => r.setAcompanantes(Number(e.target.value))} />
                    </label>
                  )}
                  <fieldset className="mj-campo">
                    <legend>¿Algo que no comas?</legend>
                    <div className="mj-chips">
                      {COMIDAS.map((c) => (
                        <button key={c} type="button" className="mj-chip mj-chip--chico" aria-pressed={r.comidas.includes(c)} onClick={() => r.alternarComida(c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  {!personal && (
                    <label className="mj-campo">
                      <span>El tema que no puede faltar</span>
                      <input value={r.cancion} onChange={(e) => r.setCancion(e.target.value)} placeholder="Tema y artista" />
                    </label>
                  )}
                </>
              )}

              {r.falta && !r.nombre.trim() && <p className="mj-aviso">Falta tu nombre.</p>}
              {r.errorEnvio && <p role="alert" className="mj-aviso">{r.errorEnvio}</p>}

              <button type="button" className="mj-boton" onClick={r.enviar} disabled={r.enviando}>
                {r.enviando ? "Enviando…" : "Enviar"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ── La invitación ─────────────────────────────────────────── */

export default function InvitacionMensajes({ invitacion, personal }: { invitacion: Datos; personal?: Personal }) {
  const m = invitacion.mensajes;
  const [uno, dos] = invitacion.nombres.split("&").map((n) => n.trim());
  const personas: [Persona, Persona] = [
    { nombre: uno, avatar: m.avatares[0] },
    { nombre: dos, avatar: m.avatares[1] },
  ];

  const fecha = parsearFecha(invitacion.fecha);
  const fechaLarga = invitacion.fecha.replace(/ (\d{4})$/, " de $1");
  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => {
    // En el servidor no existe "ahora": la cuenta se calcula ya en el navegador.
    const cuadro = requestAnimationFrame(() => setDias(calcularFaltante(parsearFecha(invitacion.fecha))?.d ?? 0));
    return () => cancelAnimationFrame(cuadro);
  }, [invitacion.fecha]);

  const ceremonia = invitacion.lugares?.find((l) => l.tipo === "Ceremonia" || l.tipo === "Civil");
  const fiesta = invitacion.lugares?.find((l) => l.tipo === "Fiesta");
  const cuenta = { ...m.avisos.cuenta, texto: m.avisos.cuenta.texto.replace("{d}", dias === null ? "··" : String(dias)) };

  return (
    <Charla.Provider value={personas}>
      <main className="inv-columna mj">
        {/* ── Cabecera de la charla ── */}
        <header className="mj-cabecera">
          <span className="mj-caras" aria-hidden="true">
            <Image src={m.avatares[0]} alt="" width={40} height={40} className="mj-cara" priority />
            <Image src={m.avatares[1]} alt="" width={40} height={40} className="mj-cara" priority />
          </span>
          <h1 className="mj-quienes">{invitacion.nombres}</h1>
          <p className="mj-estado"><span className="mj-estado__punto" aria-hidden="true" />en línea</p>
        </header>

        <div className="mj-charla">
          {personal && (
            <Texto linea={{ quien: 0, texto: personal.nota ? `${personal.saludo} ${personal.nota}` : personal.saludo }} />
          )}

          <Tanda lineas={m.apertura} />

          <Foto quien={m.fotoFogon.quien} src={m.fotoFogon.src} alt={m.fotoFogon.alt} pie={m.fotoFogon.pie} ratio="4 / 5" posicion="50% 78%" />

          {/* ── Cuándo ── */}
          <Texto linea={m.avisos.fecha} />
          <Fila quien={m.avisos.fecha.quien} avatar={false} demora={500}>
            <div className="mj-calendario">
              <p className="mj-calendario__mes">{fecha ? `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}` : invitacion.fecha}</p>
              <p className="mj-calendario__dia">{fecha ? fecha.getDate() : ""}</p>
              <p className="mj-calendario__semana">{fecha ? DIAS[fecha.getDay()] : ""}</p>
            </div>
          </Fila>
          <Texto linea={cuenta} />

          {/* ── Dónde ── */}
          {ceremonia && (
            <>
              <Texto linea={m.avisos.ceremonia} />
              <Fila quien={m.avisos.ceremonia.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__titulo">{ceremonia.titulo}</p>
                  <p className="mj-tarjeta__hora">{ceremonia.hora} hs</p>
                  <p className="mj-tarjeta__texto">{ceremonia.direccion}</p>
                  <a className="mj-boton mj-boton--chico" href={ceremonia.mapa} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
                </div>
              </Fila>
            </>
          )}
          {fiesta && (
            <>
              <Texto linea={m.avisos.fiesta} />
              <Fila quien={m.avisos.fiesta.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__titulo">{fiesta.titulo}</p>
                  <p className="mj-tarjeta__hora">{fiesta.hora} hs</p>
                  <p className="mj-tarjeta__texto">{fiesta.direccion}</p>
                  <a className="mj-boton mj-boton--chico" href={fiesta.mapa} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
                </div>
              </Fila>
            </>
          )}

          {/* ── El orden del día ── */}
          {invitacion.cronograma && (
            <>
              <Texto linea={m.avisos.orden} />
              <Fila quien={m.avisos.orden.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <ul className="mj-orden">
                    {invitacion.cronograma.map((h) => (
                      <li key={`${h.hora}-${h.titulo}`}>
                        <span className="mj-orden__hora">{h.hora}</span>
                        <span>{h.titulo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fila>
            </>
          )}

          {/* ── Vestimenta ── */}
          {invitacion.dressCode && (
            <>
              <Texto linea={m.avisos.vestimenta} />
              <Fila quien={m.avisos.vestimenta.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__titulo">{invitacion.dressCode.titulo}</p>
                  <p className="mj-tarjeta__texto">{invitacion.dressCode.detalle}</p>
                </div>
              </Fila>
            </>
          )}

          <Foto quien={m.fotoMesa.quien} src={m.fotoMesa.src} alt={m.fotoMesa.alt} pie={m.fotoMesa.pie} ratio="4 / 5" posicion="50% 38%" />

          {/* ── Regalos ── */}
          {invitacion.regalo && (
            <>
              <Texto linea={m.avisos.regalo} />
              <Fila quien={m.avisos.regalo.quien} avatar={false} demora={450}>
                <div className="mj-tarjeta">
                  <p className="mj-tarjeta__texto">{invitacion.regalo.mensaje}</p>
                  <Copiable etiqueta="Alias" valor={invitacion.regalo.alias} />
                  <Copiable etiqueta="CBU" valor={invitacion.regalo.cbu} />
                  <p className="mj-tarjeta__chico">{invitacion.regalo.titular} · {invitacion.regalo.banco}</p>
                </div>
              </Fila>
            </>
          )}

          {/* ── Contestar ── */}
          <Rsvp d={invitacion} personal={personal} />
        </div>

        <footer className="mj-pie">
          <p className="mj-pie__firma">{m.firma}</p>
          <p className="mj-pie__datos">{invitacion.nombres} · {fechaLarga}</p>
        </footer>
      </main>
    </Charla.Provider>
  );
}
