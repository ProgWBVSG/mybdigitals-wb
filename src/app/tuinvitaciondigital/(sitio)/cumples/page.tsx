import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DISENOS, WHATSAPP, enlaceDemo } from "@/lib/invitaciones";
import { urlDe } from "@/lib/site";

export const metadata: Metadata = {
  title: "Invitaciones digitales para 15 años",
  description:
    "Invitaciones web para fiestas de quince en Córdoba: cuenta regresiva, ubicación con mapa, confirmación de asistencia automática y álbum de fotos con QR. Ocho diseños para elegir.",
  keywords: [
    "invitaciones digitales 15 años",
    "tarjetas web quinceañera",
    "invitación interactiva fiesta de 15",
    "confirmación de asistencia 15 años",
  ],
  alternates: { canonical: "/tuinvitaciondigital/cumples" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: urlDe("/tuinvitaciondigital/cumples"),
    title: "Invitaciones digitales para 15 años",
    description:
      "La invitación que tus amigas abren en el celular: cuenta regresiva, mapa, confirmación automática y álbum de fotos compartido.",
  },
};

const DISENOS_XV = DISENOS.filter((d) => d.tipo === "cumples");

const PARA_LOS_XV = [
  {
    t: "Se manda por el grupo",
    d: "Un link al grupo de WhatsApp del curso y listo. No hay que imprimir nada ni repartir tarjeta por tarjeta.",
  },
  {
    t: "La lista se arma sola",
    d: "Cada una confirma desde el celular y el nombre aparece en la planilla. Sabés cuántas son antes de cerrar con el salón.",
  },
  {
    t: "Las fotos de la noche",
    d: "Un QR en la mesa y todas suben lo que sacaron al mismo álbum. Al otro día están todas juntas.",
  },
  {
    t: "Tu música de fondo",
    d: "La canción que elegís suena mientras miran las fotos y la cuenta regresiva.",
  },
];

export default function Cumples() {
  return (
    <>
      <section className="tid-seccion tid-hero">
        <div className="tid-marco">
          <p className="tid-rubro">Quince años</p>
          <h1 className="tid-display tid-h1 tid-hero__titulo">
            Tus quince empiezan cuando <span className="tid-cursiva">abren</span> la invitación.
          </h1>
          <p className="tid-plomo tid-hero__bajada">
            Ocho diseños para fiesta de quince. Elegís uno, lo personalizamos con tus fotos y tus
            colores, y queda listo en tres días hábiles.
          </p>
          <div className="tid-hero__acciones">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="tid-boton tid-boton--lleno"
            >
              Pedir la mía
            </a>
            <Link href="/tuinvitaciondigital#precios" className="tid-boton tid-boton--linea">
              Ver precios
            </Link>
          </div>
        </div>
      </section>

      <section className="tid-seccion" id="disenos">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Los diseños</p>
            <h2 className="tid-display tid-h2">Abrilos y recorrelos enteros.</h2>
            <p className="tid-plomo">
              Son demos reales, con la cuenta regresiva corriendo y la confirmación funcionando.
              Miralas desde el celular, que es donde las van a ver tus amigas.
            </p>
          </div>

          <ul className="tid-grilla">
            {DISENOS_XV.map((d) => (
              <li key={d.id}>
                <Link href={enlaceDemo(d)} className="tid-carta">
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
        </div>
      </section>

      <section className="tid-seccion">
        <div className="tid-marco">
          <div className="tid-encabezado">
            <p className="tid-rubro">Para la fiesta</p>
            <h2 className="tid-display tid-h2">Lo que te saca de encima.</h2>
          </div>
          <ul className="tid-lista">
            {PARA_LOS_XV.map((x) => (
              <li key={x.t} className="tid-lista__item">
                <h3 className="tid-display tid-h3">{x.t}</h3>
                <p className="tid-lista__texto">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tid-seccion tid-cierre">
        <div className="tid-marco tid-cierre__interior">
          <h2 className="tid-display tid-h2 tid-cierre__titulo">
            Contanos la fecha y te mandamos una <span className="tid-cursiva">prueba</span>.
          </h2>
          <p className="tid-plomo tid-cierre__bajada">
            Escribinos con el día de la fiesta y el diseño que te gustó. Te respondemos con una
            versión con tu nombre, sin compromiso.
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
            <Link href="/tuinvitaciondigital" className="tid-boton tid-boton--linea">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
