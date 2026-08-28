import Image from "next/image";
import Link from "next/link";
import { DISENOS, WHATSAPP, enlaceDemo } from "@/lib/invitaciones";

const DISENOS_BODA = DISENOS.filter((d) => d.tipo === "bodas");

const PARA_LA_BODA = [
  {
    t: "Ceremonia y fiesta, por separado",
    d: "Cada lugar con su horario y su botón al mapa. Nadie llega tarde a la iglesia por buscar la dirección en el grupo.",
  },
  {
    t: "Quién viene, sin perseguir a nadie",
    d: "La confirmación entra sola a una planilla. Cuántos son, si traen chicos y quién come sin TACC.",
  },
  {
    t: "El dato del regalo, una sola vez",
    d: "Alias y CBU escritos en la invitación. Se acabó reenviarlo por privado a cada tía.",
  },
  {
    t: "Las fotos de la noche, todas juntas",
    d: "Un QR en cada mesa y los invitados suben lo que sacaron al mismo álbum.",
  },
];

export default function Bodas() {
  return (
    <>
      <section className="tid-seccion tid-hero">
        <div className="tid-marco">
          <p className="tid-rubro">Casamientos</p>
          <h1 className="tid-display tid-h1 tid-hero__titulo">
            La invitación que se abre <span className="tid-cursiva">en el celular</span> de cada
            invitado.
          </h1>
          <p className="tid-plomo tid-hero__bajada">
            Ocho diseños pensados para casamiento. Elegís uno, lo personalizamos con sus fotos y
            sus colores, y queda listo en tres días hábiles.
          </p>
          <div className="tid-hero__acciones">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="tid-boton tid-boton--lleno"
            >
              Pedir la nuestra
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
              Miralas desde el celular, que es donde las va a ver tu gente.
            </p>
          </div>

          <ul className="tid-grilla">
            {DISENOS_BODA.map((d) => (
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
            <p className="tid-rubro">Para el día del casamiento</p>
            <h2 className="tid-display tid-h2">Lo que te saca de encima.</h2>
          </div>
          <ul className="tid-lista">
            {PARA_LA_BODA.map((x) => (
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
            Escribinos con el día del casamiento y el diseño que les gustó. Te respondemos con una
            versión con sus nombres, sin compromiso.
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
