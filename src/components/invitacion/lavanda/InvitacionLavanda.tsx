"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { parsearFecha } from "@/invitaciones/fecha";
import type { InvitacionEscena as Datos } from "@/invitaciones/tipos";
import Formulario from "../comun/Formulario";
import { Copiable, Escena, Escrito, MESES, Mapa, Musica, dos, usarMusica } from "../comun/piezas";
import type { Personal } from "../personal";
import { Abierta } from "../rasgado/abierta";
import { Manos, Rama } from "./Dibujos";

/**
 * Estilo "Lavanda": un sobre lila cerrado con lacre plateado. Al tocar el lacre
 * la solapa se levanta, asoma la tarjeta y la invitación baja sola hasta ella.
 * Criterios: .claude/skills/invitacion-lavanda
 */

const Arana = ({ className = "" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={`lv-arana ${className}`} src="/invitaciones/lavanda/arana.svg" alt="" width={464} height={704} />
);

function Sobre({ d, saludo, fecha, alAbrir }: { d: Datos; saludo?: string; fecha: string; alAbrir: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [a, b] = d.escena.monograma ?? ["", ""];

  // Cuando el sobre quedó arriba, fuera de la vista, se cierra solo: si el
  // invitado vuelve, lo encuentra como al principio.
  useEffect(() => {
    if (!abierto || !ref.current) return;
    const ojo = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setAbierto(false); });
    ojo.observe(ref.current);
    return () => ojo.disconnect();
  }, [abierto]);

  const abrir = () => {
    if (abierto) return;
    navigator.vibrate?.([14, 30, 10]);
    alAbrir();
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!quieto) setAbierto(true);
    setTimeout(() => document.getElementById("invitados")?.scrollIntoView({ behavior: quieto ? "auto" : "smooth" }), quieto ? 0 : 1900);
  };

  return (
    <section ref={ref} className="lv-sobre" data-abierto={abierto}>
      <div className="lv-sobre__forro" aria-hidden="true">
        <div className="lv-sobre__tarjeta"><Arana /></div>
      </div>
      <div className="lv-sobre__bolsillo"><div className="lv-sobre__papel" /></div>
      <div className="lv-sobre__frente">
        <p className="lv-sobre__volanta">{d.volanta}</p>
        <p className="lv-sobre__fecha">{fecha}</p>
        {saludo && <p className="lv-sobre__saludo">{saludo}</p>}
        <svg className="lv-flecha" viewBox="0 0 12 34" aria-hidden="true"><path d="M6 1v31M1.500 27 6 32.500 10.500 27" /></svg>
      </div>
      <div className="lv-solapa">
        <div className="lv-solapa__sombra"><div className="lv-solapa__papel" /></div>
        <div className="lv-solapa__texto">
          <Rama />
          <p className="lv-monograma" aria-hidden="true"><span>{a}</span><i /><span>{b}</span></p>
          <h1 className="lv-nombres">{d.nombres}</h1>
          <Rama className="lv-rama--vuelta" />
        </div>
        <button type="button" className="lv-lacre" aria-label="Abrir la invitación" onClick={abrir}>
          <Image src={d.escena.lacre ?? "/invitaciones/lavanda/lacre-ci.webp"} alt="" width={560} height={560} priority sizes="210px" />
        </button>
      </div>
    </section>
  );
}

export default function InvitacionLavanda({ invitacion: d, personal }: { invitacion: Datos; personal?: Personal }) {
  const m = usarMusica();
  const f = parsearFecha(d.fecha);
  const fecha = f ? `${dos(f.getDate())}.${dos(f.getMonth() + 1)}.${f.getFullYear()}` : d.fecha;
  const larga = f ? `${f.getDate()} de ${MESES[f.getMonth()]} ${f.getFullYear()}` : d.fecha;
  const limite = d.cierreRsvp ? parsearFecha(d.cierreRsvp) : null;
  const lugar = d.lugares?.[0];

  return (
    <Abierta.Provider value>
      <main className="inv-columna cm lv">
        <Sobre d={d} saludo={personal?.saludo} fecha={fecha} alAbrir={m.tocar} />
        <Musica src={d.musica} m={m} />

        {/* ── El arco ── */}
        <Escena className="lv-trama" id="invitados">
          <div className="lv-hoja lv-hoja--arco">
            <Arana className="lv-arana--cuelga" />
            <Escrito className="lv-titulo">¡{d.escena.intro[0]}!</Escrito>
            <p className="lv-texto">{d.frase}</p>
            <p className="lv-dia">{larga}</p>
            {lugar && (
              <>
                <p className="lv-hora">{lugar.hora} h</p>
                <p className="lv-donde">Los esperamos en</p>
                <p className="lv-lugar">{lugar.titulo}</p>
                <p className="lv-direccion">{lugar.direccion}</p>
              </>
            )}
            <Rama chica />
          </div>
        </Escena>

        {lugar && (
          <section className="lv-trama lv-trama--mapa">
            <div className="lv-hoja lv-hoja--mapa">
              <Mapa lugar={lugar} />
            </div>
          </section>
        )}

        {/* ── Vestimenta ── */}
        {d.dressCode && (
          <Escena className="lv-papel">
            <Escrito className="lv-titulo">{d.dressCode.titulo}</Escrito>
            <p className="lv-texto">{d.dressCode.detalle}</p>
            <ul className="lv-paleta">
              {d.escena.paleta?.map((c, i) => <li key={c.nombre} title={c.nombre} style={{ background: c.color, "--i": i } as React.CSSProperties} />)}
            </ul>
          </Escena>
        )}

        {/* ── Deseos ── */}
        {d.escena.deseos && (
          <Escena className="lv-trama">
            <div className="lv-hoja lv-hoja--deseos">
              <Manos />
              <Escrito className="lv-titulo">Deseos</Escrito>
              {d.escena.deseos.map((x, i) => (
                <div key={x.titulo} className="lv-deseo">
                  <h3>{x.titulo}</h3>
                  <p className="lv-texto">{x.texto}</p>
                  {i === 0 && d.regalo && <Copiable etiqueta="Alias" valor={d.regalo.alias} />}
                </div>
              ))}
              <Rama chica />
            </div>
          </Escena>
        )}

        {/* ── Respuesta ── */}
        <Escena className="lv-papel lv-papel--fin" id="confirmar">
          <Escrito className="lv-titulo">Confirmación</Escrito>
          {limite && <p className="lv-texto lv-limite">Hasta el <b>{limite.getDate()} de {MESES[limite.getMonth()].toLowerCase()}</b></p>}
          <Formulario
            datos={d}
            personal={personal}
            textoEnviar="Enviar"
            listo={(asiste) => (
              <>
                <Escrito as="p" className="lv-titulo">{asiste ? `¡${d.escena.gracias}!` : "Gracias por avisar"}</Escrito>
                <Rama chica />
              </>
            )}
          />
        </Escena>
      </main>
    </Abierta.Provider>
  );
}
